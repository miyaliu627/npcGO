from typing import List

class Memory:
    def __init__(self, ts: int, content: str, importance: int, characters: List[str]):
        self.ts = ts
        self.content = content
        self.importance = importance
        self.characters = characters

    def __lt__(self, other):
        # Comparison logic: memory.ts + memory.importance * 3
        return (self.ts + self.importance * 3) < (other.ts + other.importance * 3)