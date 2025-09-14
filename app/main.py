import os
import uvicorn
from fastapi import FastAPI
from .db import engine
from .models import Base
from .routers import notes, decks, groups, group_posts
from .routers import me as me_router
from fastapi.middleware.cors import CORSMiddleware

 
app = FastAPI(title="StudyHub API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://startstudying.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(notes.router)
app.include_router(decks.router)
app.include_router(groups.router)
app.include_router(me_router.router)
app.include_router(group_posts.router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    port = int(os.getenv("APP_PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
