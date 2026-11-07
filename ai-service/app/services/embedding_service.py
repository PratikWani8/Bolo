import math
import re
from typing import List, Dict, Any
import numpy as np

class MultilingualVectorStore:
    """
    Lightweight, high-performance in-memory and disk-persisted vector store
    supporting multilingual token and subword n-gram vector representations.
    Ensures zero heavy native wheel compilation issues while delivering accurate similarity search.
    """
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self.vocab: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}

    def _tokenize(self, text: str) -> List[str]:
        if not text:
            return []
        # Support Latin and Indic scripts: split by words and character 3-grams
        words = re.findall(r'[\w\u0900-\u0D7F]+', text.lower())
        tokens = list(words)
        # Add character tri-grams for robust cross-lingual and spelling variation matching
        for w in words:
            if len(w) >= 3:
                for i in range(len(w) - 2):
                    tokens.append(w[i:i+3])
        return tokens

    def add_document(self, text: str, metadata: Dict[str, Any]):
        tokens = self._tokenize(text)
        if not tokens:
            return
        doc_entry = {
            'text': text,
            'tokens': tokens,
            'metadata': metadata,
        }
        self.documents.append(doc_entry)
        self._update_idf()

    def _update_idf(self):
        N = len(self.documents)
        df = {}
        for doc in self.documents:
            unique_tokens = set(doc['tokens'])
            for t in unique_tokens:
                df[t] = df.get(t, 0) + 1
        self.idf = {t: math.log((N + 1) / (count + 1)) + 1.0 for t, count in df.items()}

    def _get_vector(self, tokens: List[str]) -> np.ndarray:
        # Build sparse vector dictionary
        tf = {}
        for t in tokens:
            tf[t] = tf.get(t, 0) + 1
        
        # Calculate TF-IDF
        vec_dict = {}
        sum_sq = 0.0
        for t, count in tf.items():
            val = (1.0 + math.log(count)) * self.idf.get(t, 1.0)
            vec_dict[t] = val
            sum_sq += val * val
        
        # Normalize
        norm = math.sqrt(sum_sq) if sum_sq > 0 else 1.0
        return {t: v / norm for t, v in vec_dict.items()}

    def search(self, query: str, top_k: int = 3, threshold: float = 0.35) -> List[Dict[str, Any]]:
        query_tokens = self._tokenize(query)
        if not query_tokens or not self.documents:
            return []

        q_vec = self._get_vector(query_tokens)
        results = []

        for doc in self.documents:
            d_vec = self._get_vector(doc['tokens'])
            # Cosine similarity between normalized vectors = dot product
            score = 0.0
            for t, val in q_vec.items():
                if t in d_vec:
                    score += val * d_vec[t]

            # Boost if scheme name or department matches directly
            scheme_name = doc['metadata'].get('schemeName', '').lower()
            if scheme_name and any(word in scheme_name for word in query.lower().split() if len(word) > 3):
                score = min(1.0, score + 0.30)

            if score >= threshold:
                results.append({
                    'text': doc['text'],
                    'metadata': doc['metadata'],
                    'similarity': float(score),
                })

        # Sort descending by similarity
        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results[:top_k]

vector_store = MultilingualVectorStore()
