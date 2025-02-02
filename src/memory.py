from typing import List

class Memory:
    def __init__(self, content: str, importance: int, characters: List[str]):
        self.content = content
        self.importance = importance
        self.characters = characters

    def __lt__(self, other):
        # Comparison logic: memory.ts + memory.importance * 3
        return self.importance * 3 < other.importance * 3
    

class Message:
    def __init__(self, character, message):
        self.character = character
        self.message = message