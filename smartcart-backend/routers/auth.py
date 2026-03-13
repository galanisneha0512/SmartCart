from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserOut, SwitchModeRequest
from core.security import hash_password, verify_password, create_access_token
from core.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup", response_model=TokenResponse, status_code=201)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    # Check duplicate email
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Validate role
    if body.role not in ("buyer", "seller"):
        raise HTTPException(status_code=400, detail="Role must be buyer or seller")

    # Seller must provide store name
    if body.role == "seller" and not body.store_name:
        raise HTTPException(status_code=400, detail="Store name is required for sellers")

    user = User(
        name        = body.name,
        email       = body.email,
        password    = hash_password(body.password),
        role        = body.role,
        active_mode = "selling" if body.role == "seller" else "buying",
        store_name  = body.store_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/switch-mode", response_model=UserOut)
def switch_mode(
    body: SwitchModeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.mode not in ("buying", "selling"):
        raise HTTPException(status_code=400, detail="Mode must be buying or selling")
    if body.mode == "selling" and current_user.role != "seller":
        raise HTTPException(status_code=403, detail="Only sellers can switch to selling mode")

    current_user.active_mode = body.mode
    db.commit()
    db.refresh(current_user)
    return current_user