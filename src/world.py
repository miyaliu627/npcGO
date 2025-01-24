import heapq
from src.memory import Memory
from src.character import Character
from typing import String, List
from collections import deque

class World:
    def __init__(self, setting: String, characters: List[Character], memory_stream=deque()):
        self.setting = setting
        self.cycle = 0
        self.memory_stream = memory_stream
        self.characters = {}
        for character in characters:
            self.characters[character.name] = character

    def distribute_memory(self) -> None:
        while self.memory_stream:
            memory = self.memory_stream.popleft()
            for character in memory.characters:
                if character not in self.characters.keys():
                    continue
                heapq.heappush(self.characters[character.name].memories, (memory.ts + memory.importance * 3, memory)) # TODO: adjust weight function
