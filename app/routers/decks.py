# Add a list-cards endpoint that allows owner or shared users to view cards
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from sqlalchemy.orm import joinedload
from ..db import get_session
from ..models import FlashcardDeck, Flashcard, DeckShare
from ..schemas import DeckCreate, DeckOut, CardCreate, CardOut, ShareCreate
from ..auth import get_current_profile
from ..models import Profile
from ..models import DeckInvite
from ..schemas import DeckInviteCreate, DeckInviteOut
router = APIRouter(prefix="/decks", tags=["decks"])

@router.get("/", response_model=list[DeckOut])
async def list_decks(session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
     owned = select(FlashcardDeck).where(FlashcardDeck.owner_id == user.id)
     shared = (
        select(FlashcardDeck) # no difference to groups, same thing with association table. get the flashcard decks, for who in the association table
        .join(DeckShare, DeckShare.deck_id == FlashcardDeck.id)
        .where(DeckShare.user_id == user.id)
    )
     deck_ids = (await session.execute(select(FlashcardDeck.id).where(FlashcardDeck.owner_id == user.id).union(select(DeckShare.deck_id).where(DeckShare.user_id == user.id)))).scalars().all(); decks = (await session.execute(select(FlashcardDeck).where(FlashcardDeck.id.in_(deck_ids)))).scalars().all(); return decks



@router.post("/", response_model=DeckOut)
async def create_deck(payload: DeckCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    deck = FlashcardDeck(owner_id=user.id, title=payload.title, description=payload.description)
    session.add(deck)
    await session.commit() # commit() when new changes that need to persist to the db. 
    await session.refresh(deck)
    return deck

@router.get("/{deck_id}/cards", response_model=list[CardOut])
async def list_cards(deck_id: UUID, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    # Fetch deck
    q = await session.execute(select(FlashcardDeck).where(FlashcardDeck.id == deck_id))
    deck = q.scalar_one_or_none()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    # Authorization: owner or shared
    if deck.owner_id != user.id:
        share_q = await session.execute(
            select(DeckShare).where(DeckShare.deck_id == deck_id, DeckShare.user_id == user.id)
        )
        share = share_q.scalar_one_or_none()
        if not share:
            raise HTTPException(status_code=403, detail="Not allowed") # user somehow got their hands on deckid, but does not have access to it. 
    # List cards
    cards_q = await session.execute(
        select(Flashcard).where(Flashcard.deck_id == deck_id).order_by(Flashcard.created_at.desc())
    )
    return cards_q.scalars().all()

@router.post("/{deck_id}/cards", response_model=CardOut)
async def add_card(deck_id: UUID, payload: CardCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(FlashcardDeck).where(FlashcardDeck.id == deck_id))
    deck = q.scalar_one_or_none()
    if not deck or deck.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Deck not found or not yours")
    card = Flashcard(deck_id=deck_id, front=payload.front, back=payload.back)
    session.add(card)
    await session.commit()
    await session.refresh(card)
    return card

@router.post("/{deck_id}/invite")
async def invite_to_deck(deck_id: UUID, payload: DeckInviteCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    # Ensure the deck exists and belongs to current user
    q = await session.execute(select(FlashcardDeck).where(FlashcardDeck.id == deck_id))
    deck = q.scalar_one_or_none()
    if not deck or deck.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Deck not found or not yours")

    # Find invitee
    q2 = await session.execute(select(Profile).where(Profile.email == payload.email))
    invitee = q2.scalar_one_or_none()
    if not invitee:
        raise HTTPException(status_code=404, detail="User with that email not found")

    # Prevent duplicate pending invites
    existing = await session.execute(
        select(DeckInvite).where(DeckInvite.deck_id == deck_id, DeckInvite.invitee_id == invitee.id, DeckInvite.status == "pending")
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Invite already pending for this user")

    invite = DeckInvite(deck_id=deck_id, inviter_id=user.id, invitee_id=invitee.id, permission=payload.permission, status="pending")
    session.add(invite)
    await session.commit()
    return {"ok": True}


@router.get("/invites", response_model=list[DeckInviteOut])
async def list_deck_invites(session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(DeckInvite).options(joinedload(DeckInvite.deck)).where(DeckInvite.invitee_id == user.id, DeckInvite.status == "pending"))
    return q.scalars().all()

@router.post("/invites/{invite_id}/accept")
async def accept_deck_invite(invite_id: UUID, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(DeckInvite).where(DeckInvite.id == invite_id, DeckInvite.invitee_id == user.id))
    invite = q.scalar_one_or_none()
    if not invite or invite.status != "pending":
        raise HTTPException(status_code=404, detail="Invite not found")

    invite.status = "accepted"
    session.add(DeckShare(deck_id=invite.deck_id, user_id=user.id, permission=invite.permission))
    await session.commit()
    return {"ok": True}

@router.post("/invites/{invite_id}/decline")
async def decline_deck_invite(invite_id: UUID, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(DeckInvite).where(DeckInvite.id == invite_id, DeckInvite.invitee_id == user.id))
    invite = q.scalar_one_or_none()
    if not invite or invite.status != "pending":
        raise HTTPException(status_code=404, detail="Invite not found")

    invite.status = "declined"
    await session.commit()
    return {"ok": True}
