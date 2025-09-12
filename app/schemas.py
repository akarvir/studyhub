# =============================
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr

# ---- Profile ----
class ProfileOut(BaseModel):
    id: UUID
    username: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ---- Notes ----
class NoteCreate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteOut(BaseModel):
    id: UUID
    title: Optional[str]
    content: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# ---- Decks & Cards ----
class DeckCreate(BaseModel):
    title: str
    description: Optional[str] = None

class ShareCreate(BaseModel):
    email: EmailStr
    permission: str  # 'view' | 'edit'
class DeckOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class CardCreate(BaseModel):
    front: str
    back: str

class CardOut(BaseModel):
    id: UUID
    front: str
    back: str
    created_at: datetime

    class Config:
        from_attributes = True

class ShareCreate(BaseModel):
    email: EmailStr
    permission: Literal["view", "edit"]

# ---- Groups ----
class GroupCreate(BaseModel):
    name: str

class GroupMemberCreate(BaseModel):
    user_id: UUID
    role: Literal["owner", "member"] = "member"

class GroupOut(BaseModel):
    id: UUID
    name: str
    description: str | None = None
    created_at: datetime
    class Config:
        orm_mode = True


class GroupPostCreate(BaseModel):
    content: str

class GroupPostOut(BaseModel):
    id: UUID
    group_id: UUID
    author_id: UUID
    content: str
    created_at: datetime
    # Optional: include author username
    class Config:
        orm_mode = True

class ScoreEntry(BaseModel):
    user_id: UUID
    username: str
    post_count: int


class InviteCreate(BaseModel):
    email: EmailStr
    role: str  # "member" | "owner"

class DeckInviteCreate(BaseModel):
    email: EmailStr
    permission: Literal["view", "edit"]

class DeckInviteOut(BaseModel):
    id: UUID
    deck_id: UUID
    inviter_id: UUID
    invitee_id: UUID
    permission: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True
