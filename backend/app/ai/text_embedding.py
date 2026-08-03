import logging
import numpy as np

logger = logging.getLogger(__name__)

_model = None

def get_text_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            logger.info("Loading SentenceTransformer model 'all-MiniLM-L6-v2'...")
            _model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("SentenceTransformer model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load SentenceTransformer: {e}. Using fallback TF-IDF vectorizer.")
            _model = "FALLBACK"
    return _model

def compute_text_embedding(text: str) -> np.ndarray:
    if not text or not text.strip():
        return np.zeros(384, dtype=np.float32)

    model = get_text_model()
    if model != "FALLBACK" and model is not None:
        try:
            embedding = model.encode(text, convert_to_numpy=True)
            # Normalize vector to unit length for cosine similarity
            norm = np.linalg.norm(embedding)
            if norm > 0:
                embedding = embedding / norm
            return embedding.astype(np.float32)
        except Exception as e:
            logger.error(f"Error computing SentenceTransformer embedding: {e}")

    # Fallback pseudo-embedding using char/word hash distribution
    words = text.lower().split()
    vec = np.zeros(384, dtype=np.float32)
    for word in words:
        idx = hash(word) % 384
        vec[idx] += 1.0
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec

def compute_text_similarity(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0

    v1 = compute_text_embedding(text1)
    v2 = compute_text_embedding(text2)

    sim = float(np.dot(v1, v2))
    return max(0.0, min(1.0, sim))
