from fastapi import APIRouter,FastAPI, status, HTTPException
from fastapi.responses import RedirectResponse
from app.schemas import UserOut, UserAuth
from backend.database import db
from backend.utils import get_hashed_password
from uuid import uuid4

router = APIRouter(
    tags=["User Routes"]
)

@router.post('/signup', summary="Create new user", response_model=UserOut)
async def create_user(data: UserAuth):
    user = db.get(data.email, None)
    if user is not None:
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exist"
        )
    user = {
        'email': data.email,
        'password': get_hashed_password(data.password),
        'id': str(uuid4())
    }
    db[data.email] = user
    return user