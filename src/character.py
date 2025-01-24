from src.memory import Memory
from typing import List, String

class Character:
    def __init__(self, name: String, description: String, memories: List[Memory], reflection_score: int, reflection_threshold: int):
        self.name = name
        self.description = description
        self.memories = memories
        self.reflection_score = reflection_score
        self.reflection_threshold = reflection_threshold

    def observe(self, top_memories: List[Memory]) -> Memory:
        pass

    def reflect(self, top_memories: List[Memory]) -> Memory:
        pass

    def make_decision(self, top_memories: List[Memory]) -> Memory:
        pass

    def retrieve_top_k_memories(self, k) -> List[Memory]:
        pass

    def insert_memory(self, memory: Memory) -> None:
        pass

