import heapq
from src.memory import Memory
from src.character import Character
from typing import String, List

class World:
    def __init__(self, setting: String, characters: List[Character], memory_stream=[]):
        self.setting = setting
        self.cycle = 0
        self.memory_stream = memory_stream
        self.characters = {}
        for character in characters:
            self.characters[character.name] = character

    def distribute_memory(self) -> None:
        for memory in self.memory_stream:
            for character in memory.characters:
                if character not in self.characters.keys():
                    continue
                heapq.heappush(self.characters[character.name].memories, (memory.ts + memory.importance * 3, memory)) # TODO: adjust weight
        self.memory_stream = []

    def update_memory_stream(self, memories: Memory) -> None:
        self.memory_stream = memories
