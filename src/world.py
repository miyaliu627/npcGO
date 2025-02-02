import heapq
from memory import Memory
from character import Character
from typing import List
from collections import deque

class World:
    def __init__(self, setting: str, characters: List[Character], message_stream=deque()):
        self.setting = setting
        self.cycle = 0
        self.message_stream = deque(message_stream)
        self.characters = {}
        for character in characters:
            self.characters[character.name] = character

    # def distribute_memory(self) -> None:
    #     while self.memory_stream:
    #         memory = self.memory_stream.popleft()
    #         for name in memory.characters:
    #             if name not in self.characters.keys():
    #                 continue
    #             character = self.characters[name]
    #             heapq.heappush(self.characters[character.name].memories, memory) # TODO: adjust weight function
