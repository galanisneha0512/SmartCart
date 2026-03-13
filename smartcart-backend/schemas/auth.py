from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SignupRequest(BaseModel):
    name:       str
    email:      EmailStr
    password:   str
    role:       str = "buyer"
    store_name: Optional[str] = None

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class UserOut(BaseModel):
    id:          int
    name:        str
    email:       str
    role:        str
    active_mode: str
    store_name:  Optional[str]
    created_at:  datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user:         UserOut

class SwitchModeRequest(BaseModel):
    mode: str  # "buying" or "selling"