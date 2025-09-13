# =============================
# app/routers/notes.py
# =============================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from ..db import get_session
from ..models import Note
from ..schemas import NoteCreate, NoteUpdate, NoteOut
from ..auth import get_current_profile

router = APIRouter(prefix="/notes", tags=["notes"])

@router.get("/", response_model=list[NoteOut])
async def list_notes(session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(Note).where(Note.user_id == user.id).order_by(Note.created_at.desc()))
    return q.scalars().all()

@router.post("/", response_model=NoteOut)
async def create_note(payload: NoteCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    note = Note(user_id=user.id, title=payload.title, content=payload.content)
    session.add(note)
    await session.commit()
    await session.refresh(note) # db adds attributes such as created_at, we want that included. 
    return note

@router.get("/{note_id}", response_model=NoteOut)
async def get_note(note_id: UUID, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(Note).where(Note.id == note_id, Note.user_id == user.id))
    note = q.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.patch("/{note_id}", response_model=NoteOut)
async def update_note(note_id: UUID, payload: NoteUpdate, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(Note).where(Note.id == note_id, Note.user_id == user.id))
    note = q.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if payload.title is not None:
        note.title = payload.title
    if payload.content is not None:
        note.content = payload.content
    await session.commit()
    await session.refresh(note)
    return note

@router.delete("/{note_id}")
async def delete_note(note_id: UUID, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    q = await session.execute(select(Note).where(Note.id == note_id, Note.user_id == user.id))
    note = q.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    await session.delete(note)
    await session.commit()
    return {"ok": True}
