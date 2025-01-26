import heapq
from memory import Memory
from prompts.observe_prompt import complete_observe_prompt
from prompts.importance_prompt import complete_importance_prompt
from typing import List
from llm import chatcompletion

class Character:
    def __init__(self, name: str, description: str, reflection_score: int, reflection_threshold: int):
        self.name = name
        self.description = description
        self.memories = []
        self.reflection_score = reflection_score
        self.reflection_threshold = reflection_threshold

    def observe(self, top_memories: List[Memory], setting: str, ts: int) -> Memory:
        observe_prompt = complete_observe_prompt(setting, self.description, top_memories)
        memory_json = chatcompletion(observe_prompt)
        if "content" not in memory_json or "characters" not in memory_json:
            raise KeyError("MEMORY JSON is missing required keys.")

        content = memory_json.get("content")
        characters = memory_json.get("characters")
   
        importance_prompt = complete_importance_prompt(content, characters)
        importance_json = chatcompletion(importance_prompt)
        if "importance" not in importance_json:
            raise KeyError("Importance key not found in importance_json.")
        
        importance = importance_json.get("importance")
  
        new_memory = Memory(ts, content, importance, characters)
        print(f"NEW MEMORY GENERATED for {self.name}: {new_memory}")
        return new_memory

    def reflect(self, top_memories: List[Memory]) -> Memory:
        pass

    def make_decision(self, top_memories: List[Memory]) -> Memory:
        pass

    def retrieve_top_k_memories(self, k) -> List[Memory]:
        return heapq.nlargest(k, self.memories)
    