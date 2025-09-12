# app/routers/group_posts.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID

from ..db import get_session
from ..models import Group, GroupMember, GroupPost, Profile
from ..schemas import GroupPostCreate, GroupPostOut, ScoreEntry
from ..auth import get_current_profile

router = APIRouter(prefix="/groups", tags=["groups-feed"])

# Helper: check if user is in group
async def ensure_membership(session: AsyncSession, group_id: UUID, user_id: UUID):
    q = await session.execute(
        select(GroupMember).where(GroupMember.group_id == group_id, GroupMember.user_id == user_id)
    )
    return q.scalar_one_or_none()

@router.get("/{group_id}/posts", response_model=list[GroupPostOut])
async def list_posts(group_id: UUID, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    # ensure membership
    membership = await ensure_membership(session, group_id, user.id)
    if not membership:
        raise HTTPException(status_code=403, detail="Not in group")

    q = await session.execute(
        select(GroupPost).where(GroupPost.group_id == group_id).order_by(GroupPost.created_at.desc())
    )
    return q.scalars().all()

@router.post("/{group_id}/posts", response_model=GroupPostOut)
async def create_post(group_id: UUID, payload: GroupPostCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    membership = await ensure_membership(session, group_id, user.id)
    if not membership:
        raise HTTPException(status_code=403, detail="Not in group")

    post = GroupPost(group_id=group_id, author_id=user.id, content=payload.content)
    session.add(post)
    await session.commit()
    await session.refresh(post)
    return post

@router.get("/{group_id}/scoreboard", response_model=list[ScoreEntry])
async def group_scoreboard(group_id: UUID, session: AsyncSession = Depends(get_session), user=Depends(get_current_profile)):
    membership = await ensure_membership(session, group_id, user.id)
    if not membership:
        raise HTTPException(status_code=403, detail="Not in group")

    # count posts per member
    q = await session.execute(
        select(Profile.id, Profile.username, func.count(GroupPost.id).label("post_count"))
        .join(GroupPost, GroupPost.author_id == Profile.id, isouter=True)
        .where(GroupPost.group_id == group_id)
        .group_by(Profile.id, Profile.username)
        .order_by(func.count(GroupPost.id).desc())
    )
    rows = q.all()
    return [ScoreEntry(user_id=r.id, username=r.username or "Unknown", post_count=r.post_count) for r in rows]
