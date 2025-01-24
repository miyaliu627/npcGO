from typing import List

class Memory:
    def __init__(self, ts: int, content: str, importance: int, characters: List[str]):
        self.ts = ts
        self.content = content
        self.importance = importance
        self.characters = characters
