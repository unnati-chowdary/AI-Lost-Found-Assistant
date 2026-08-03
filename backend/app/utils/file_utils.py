import os
import uuid
from fastapi import UploadFile, HTTPException

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def save_upload_file(file: UploadFile, upload_dir: str = "uploads") -> str:
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir, exist_ok=True)

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid image file extension.")

    contents = file.file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(upload_dir, unique_name)

    with open(file_path, "wb") as f:
        f.write(contents)

    return f"/uploads/{unique_name}"
