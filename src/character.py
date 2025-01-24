import heapq
from src.memory import Memory
from src.main import cycle
from src.prompts.observe_prompt import complete_observe_prompt
from typing import List, String

class Character:
    def __init__(self, name: String, description: String, reflection_score: int, reflection_threshold: int):
        self.name = name
        self.description = description
        self.memories = []
        self.reflection_score = reflection_score
        self.reflection_threshold = reflection_threshold

    def observe(self, top_memories: List[Memory], setting: String) -> Memory:
        # parse memories into a prompt template
        complete_observe_prompt(setting, self.description, top_memories)
        # call llm
        new_memory = Memory(cycle, )
        return new_memory

    def reflect(self, top_memories: List[Memory]) -> Memory:
        pass

    def make_decision(self, top_memories: List[Memory]) -> Memory:
        pass

    def retrieve_top_k_memories(self, k) -> List[Memory]:
        return heapq.nlargest(k, self.memories)

def chatcompletion(prompt):
    pass



