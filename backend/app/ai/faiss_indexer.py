import logging
import numpy as np

logger = logging.getLogger(__name__)

class VectorSearchEngine:
    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.item_ids = []
        self.vectors = []
        self.faiss_index = None
        self._init_faiss()

    def _init_faiss(self):
        try:
            import faiss
            self.faiss_index = faiss.IndexFlatIP(self.dimension)
            logger.info("FAISS IndexFlatIP initialized.")
        except Exception as e:
            logger.warning(f"Could not initialize FAISS: {e}. Using NumPy dot-product vector search fallback.")
            self.faiss_index = None

    def add_vector(self, item_id: int, vector: np.ndarray):
        if vector is None or len(vector) != self.dimension:
            return

        vector = vector.astype(np.float32)
        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm

        self.item_ids.append(item_id)
        self.vectors.append(vector)

        if self.faiss_index is not None:
            self.faiss_index.add(np.array([vector]))

    def search(self, query_vector: np.ndarray, top_k: int = 10):
        if not self.item_ids or query_vector is None:
            return []

        query_vector = query_vector.astype(np.float32)
        norm = np.linalg.norm(query_vector)
        if norm > 0:
            query_vector = query_vector / norm

        if self.faiss_index is not None and self.faiss_index.ntotal > 0:
            try:
                distances, indices = self.faiss_index.search(np.array([query_vector]), min(top_k, len(self.item_ids)))
                results = []
                for dist, idx in zip(distances[0], indices[0]):
                    if idx < len(self.item_ids):
                        results.append((self.item_ids[idx], float(dist)))
                return results
            except Exception as e:
                logger.error(f"FAISS search error: {e}")

        # NumPy fallback search
        results = []
        for item_id, vec in zip(self.item_ids, self.vectors):
            sim = float(np.dot(query_vector, vec))
            results.append((item_id, max(0.0, min(1.0, sim))))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]
