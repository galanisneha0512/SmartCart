import os, uuid, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE_MB   = 5

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    # Validate type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WEBP, GIF allowed.")

    # Validate size
    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max {MAX_SIZE_MB}MB.")

    # Save with unique name
    ext      = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    path     = os.path.join(UPLOAD_DIR, filename)

    with open(path, "wb") as f:
        f.write(contents)

    return { "url": f"http://localhost:8000/uploads/{filename}" }