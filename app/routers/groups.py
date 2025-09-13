# =============================
# app/routers/groups.py
# =============================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from uuid import UUID

from ..db import get_session
from ..models import Group, GroupMember, Profile, GroupInvite  # ✅ import GroupInvite here
from ..schemas import GroupCreate, GroupOut, GroupMemberCreate, InviteCreate
from ..auth import get_current_profile

router = APIRouter(prefix="/groups", tags=["groups"])


@router.get("/", response_model=list[GroupOut])
async def list_groups(session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(
        select(Group)
        .join(GroupMember, GroupMember.group_id == Group.id)
        .where(GroupMember.user_id == user.id)
    )
    return q.scalars().all()


@router.post("/", response_model=GroupOut)
async def create_group(payload: GroupCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    group = Group(name=payload.name, owner_id=user.id)
    session.add(group)
    await session.commit()
    await session.refresh(group)
    # Also add owner membership
    owner_member = GroupMember(group_id=group.id, user_id=user.id, role="owner")
    session.add(owner_member)
    await session.commit()
    return group


@router.post("/{group_id}/members")
async def add_member(group_id: UUID, payload: GroupMemberCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(Group).where(Group.id == group_id))
    group = q.scalar_one_or_none()
    if not group or group.owner_id != user.id: # if not owner of group, can't add members. 
        raise HTTPException(status_code=404, detail="Group not found or not yours")

    existing_q = await session.execute(
        select(GroupMember).where(
            GroupMember.group_id == group_id,
            GroupMember.user_id == payload.user_id
        )
    )
    existing = existing_q.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="User already in group")

    member = GroupMember(group_id=group_id, user_id=payload.user_id, role=payload.role)
    session.add(member)
    await session.commit()
    return {"ok": True}


@router.post("/{group_id}/invite")
async def invite_user_to_group(group_id: UUID, payload: InviteCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(Group).where(Group.id == group_id))
    group = q.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    q2 = await session.execute(select(Profile).where(Profile.email == payload.email))
    invitee = q2.scalar_one_or_none()
    if not invitee:
        raise HTTPException(status_code=404, detail="User not found on Studyhub!")

    # Create pending invite
    invite = GroupInvite(group_id=group_id, inviter_id=user.id, invitee_id=invitee.id, status="pending")
    session.add(invite)
    await session.commit()
    return {"ok": True}


@router.get("/invites")
async def list_group_invites(session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(
        select(GroupInvite).options(joinedload(GroupInvite.group))
        .where(GroupInvite.invitee_id == user.id, GroupInvite.status == "pending")
    )
    return q.scalars().all()


@router.post("/invites/{invite_id}/accept")
async def accept_invite(invite_id: UUID, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(
        select(GroupInvite).where(GroupInvite.id == invite_id, GroupInvite.invitee_id == user.id)
    ) # why not further filter for pending invities here?
    invite = q.scalar_one_or_none()
    if not invite or invite.status != "pending": # oh okay, that filtering is done here. but it won't show in the first place in list of invites. my bad.
        raise HTTPException(status_code=404, detail="Invite not found")

    invite.status = "accepted"
    session.add(GroupMember(group_id=invite.group_id, user_id=user.id,role="member"))  # add to group
    await session.commit() # the invite.status update of 'accept' happens in db when this is done. 
    return {"ok": True}


@router.post("/invites/{invite_id}/decline")
async def decline_invite(invite_id: UUID, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(
        select(GroupInvite).where(GroupInvite.id == invite_id, GroupInvite.invitee_id == user.id)
    )
    invite = q.scalar_one_or_none()
    if not invite or invite.status != "pending":
        raise HTTPException(status_code=404, detail="Invite not found")

    invite.status = "declined"
    await session.commit()
    return {"ok": True}
