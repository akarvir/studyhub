import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy import func
Base = declarative_base()

# -------- Profiles (1:1 with Supabase auth.users) --------
class Profile(Base):
    __tablename__ = "profiles"

    # Primary key that also FKs to auth.users.id
    id = Column(UUID(as_uuid=True), primary_key=True)  # no ForeignKey
    username = Column(String(50), unique=True, nullable=False)
    avatar_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    email = Column(String, unique=True, index=True, nullable=False)

    # Relationships
    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")
    decks = relationship("FlashcardDeck", back_populates="owner", cascade="all, delete-orphan")
    memberships = relationship("GroupMember", back_populates="user", cascade="all, delete-orphan")
    deck_shares = relationship("DeckShare", back_populates="user", cascade="all, delete-orphan")
    study_sessions = relationship("StudySession", back_populates="user", cascade="all, delete-orphan")
    posts = relationship("GroupPost", back_populates="author")
     

# -------- Notes --------
class Note(Base):
    __tablename__ = "notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Profile", back_populates="notes")

# -------- Flashcard Decks --------
class FlashcardDeck(Base):
    __tablename__ = "flashcard_decks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("Profile", back_populates="decks")
    cards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")
    shares = relationship("DeckShare", back_populates="deck", cascade="all, delete-orphan")
    study_sessions = relationship("StudySession", back_populates="deck", cascade="all, delete-orphan")
    invites = relationship("DeckInvite", back_populates="deck", cascade="all, delete-orphan")


# -------- Flashcards --------
class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deck_id = Column(UUID(as_uuid=True), ForeignKey("flashcard_decks.id", ondelete="CASCADE"), nullable=False)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    deck = relationship("FlashcardDeck", back_populates="cards")

# -------- Groups --------
class Group(Base):
    __tablename__ = "groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(String, nullable=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    posts = relationship("GroupPost", back_populates="group", cascade="all, delete-orphan")
    invites = relationship("GroupInvite", back_populates="group", cascade="all, delete-orphan")

# -------- Group Members (association: many-to-many) --------
class GroupMember(Base):
    __tablename__ = "group_members"

    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    role = Column(String(20), nullable=False)  # 'owner' | 'member'

    group = relationship("Group", back_populates="members")
    user = relationship("Profile", back_populates="memberships")

# -------- Deck Shares (association: many-to-many) --------
class DeckShare(Base):
    __tablename__ = "deck_shares"

    deck_id = Column(UUID(as_uuid=True), ForeignKey("flashcard_decks.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    permission = Column(String(20), nullable=False)  # 'view' | 'edit'

    deck = relationship("FlashcardDeck", back_populates="shares")
    user = relationship("Profile", back_populates="deck_shares")

# -------- Study Sessions --------
class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    deck_id = Column(UUID(as_uuid=True), ForeignKey("flashcard_decks.id", ondelete="CASCADE"), nullable=False)
    cards_studied = Column(Integer, nullable=False)
    score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Profile", back_populates="study_sessions")
    deck = relationship("FlashcardDeck", back_populates="study_sessions")



# models.py
class GroupPost(Base):
    __tablename__ = "group_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    group = relationship("Group", back_populates="posts")
    author = relationship("Profile", back_populates="posts")



class GroupInvite(Base):
    __tablename__ = "group_invites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"))
    inviter_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"))
    invitee_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"))
    status = Column(String(20), default="pending")  # 'pending' | 'accepted' | 'declined'
    created_at = Column(DateTime, server_default=func.now())

    group = relationship("Group", back_populates="invites")
    inviter = relationship("Profile", foreign_keys=[inviter_id])
    invitee = relationship("Profile", foreign_keys=[invitee_id])


class DeckInvite(Base):
    __tablename__ = "deck_invites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deck_id = Column(UUID(as_uuid=True), ForeignKey("flashcard_decks.id", ondelete="CASCADE"))
    inviter_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"))
    invitee_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"))
    permission = Column(String(20), nullable=False)  # 'view' | 'edit'
    status = Column(String(20), default="pending")   # 'pending' | 'accepted' | 'declined'
    created_at = Column(DateTime, server_default=func.now())

    deck = relationship("FlashcardDeck", back_populates="invites")
    inviter = relationship("Profile", foreign_keys=[inviter_id])
    invitee = relationship("Profile", foreign_keys=[invitee_id])
