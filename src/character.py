import heapq
from memory import Memory, Message
from prompts.observe_prompt import complete_observe_prompt
from prompts.reflect_prompt import complete_reflect_prompt
from prompts.importance_prompt import complete_importance_prompt
from typing import List
from llm import chatcompletion

class Character:
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.memories = []
        self.message_count = 0

    def observe(self, top_memories: List[Memory], recent_messages, setting: str) -> Memory:
        observe_prompt = complete_observe_prompt(setting, self.description, top_memories, recent_messages)
        message_json = chatcompletion(observe_prompt)
        if "message" not in message_json or "character" not in message_json:
            raise KeyError("MESSAGE JSON is missing required keys.")

        message = message_json.get("message")
        character = message_json.get("character")
   
        new_message = Message(character, message)
        print(f"NEW MESSAGE from {self.name}: {new_message.message}")
        self.message_count += 1
        return new_message
        

    def reflect(self, top_memories: List[Memory], recent_messages, setting: str):
        if self.message_count <= 5: # TODO: arbitrary p rn
            return {"message": "No reflection yet."}
        
        # Generate reflection memory
        reflect_prompt = complete_reflect_prompt(setting, self.description, top_memories, recent_messages)
        memory_json = chatcompletion(reflect_prompt)
        if "content" not in memory_json or "characters" not in memory_json:
            raise KeyError("MEMORY JSON is missing required keys.")

        content = memory_json.get("content")
        characters = memory_json.get("characters")
        
        # Rate importance
        importance_prompt = complete_importance_prompt(content, characters)
        importance_json = chatcompletion(importance_prompt)
        if not isinstance(importance_json, dict):
            raise ValueError(f"Unexpected response format from chatcompletion: {importance_json}")
        if "importance" not in importance_json:
            raise KeyError(f"Importance key not found in importance_json. Received: {importance_json}")
        importance = importance_json.get("importance")
        new_memory = Memory(content, importance, characters)
        print(f"NEW MEMORY from {self.name}: {new_memory.content}")
        self.message_count = 0
        self.memories.append(new_memory)
        return new_memory

    def retrieve_top_k_memories(self, k) -> List[Memory]:
        return heapq.nlargest(k, self.memories)
    
    
def parse_characters(characters_json):
    parsed_characters = []
    for _, character_data in characters_json["characters"].items():
        parsed = Character(
            name=character_data["name"],
            description=character_data["description"]
        )
        parsed_characters.append(parsed)
    
    return parsed_characters