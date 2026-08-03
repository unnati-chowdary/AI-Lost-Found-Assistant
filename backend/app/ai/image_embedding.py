import os
import logging
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

_open_clip_model = None
_open_clip_preprocess = None

def get_image_model():
    global _open_clip_model, _open_clip_preprocess
    if _open_clip_model is None:
        try:
            import open_clip
            import torch
            logger.info("Loading OpenCLIP model (ViT-B-32)...")
            model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
            model.eval()
            _open_clip_model = model
            _open_clip_preprocess = preprocess
            logger.info("OpenCLIP model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load OpenCLIP model: {e}. Using fallback image feature extraction.")
            _open_clip_model = "FALLBACK"
    return _open_clip_model, _open_clip_preprocess

def compute_image_embedding(image_path: str) -> np.ndarray:
    if not image_path:
        return None

    full_path = image_path
    if image_path.startswith("/uploads/"):
        from app.config import settings
        full_path = os.path.join(settings.UPLOAD_DIR, os.path.basename(image_path))

    if not os.path.exists(full_path):
        return None

    try:
        image = Image.open(full_path).convert("RGB")
        model, preprocess = get_image_model()

        if model != "FALLBACK" and model is not None:
            import torch
            image_tensor = preprocess(image).unsqueeze(0)
            with torch.no_grad():
                features = model.encode_image(image_tensor)
                features /= features.norm(dim=-1, keepdim=True)
                return features.cpu().numpy()[0].astype(np.float32)
        else:
            # Fallback: Color histogram embedding
            image = image.resize((64, 64))
            arr = np.array(image, dtype=np.float32)
            # Compute color distribution
            hist_r, _ = np.histogram(arr[:, :, 0], bins=32, range=(0, 256))
            hist_g, _ = np.histogram(arr[:, :, 1], bins=32, range=(0, 256))
            hist_b, _ = np.histogram(arr[:, :, 2], bins=32, range=(0, 256))
            vec = np.concatenate([hist_r, hist_g, hist_b]).astype(np.float32)
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            return vec
    except Exception as e:
        logger.error(f"Error computing image embedding for {image_path}: {e}")
        return None

def compute_image_similarity(image_path1: str, image_path2: str) -> float:
    if not image_path1 or not image_path2:
        return 0.0

    v1 = compute_image_embedding(image_path1)
    v2 = compute_image_embedding(image_path2)

    if v1 is None or v2 is None:
        return 0.0

    sim = float(np.dot(v1, v2))
    return max(0.0, min(1.0, sim))
