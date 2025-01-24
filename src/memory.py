from typing import String, List

class Memory:
    def __init__(self, ts: int, content: String, importance: int, characters: List[String]):
        self.ts = ts
        self.content = content
        self.importance = importance
        self.characters = characters
