from typing import List
from memory import Memory

def complete_observe_prompt(setting, character_description, top_memories: List[Memory]):
    return (
        f"You are an AI storyteller. Analyze the following details and suggest the next step for the character.\n"
        f"Story Setting: {setting}\n"
        f"Character Description: {character_description}\n"
        f"Character's Top Memories: \n"
        f"{[{'content': m.content, 'importance': m.importance} for m in top_memories]}\n\n"
        f"Based on this information, generate the character's next memory as a result of their actions. "
        f"The output should include:\n"
        f"- A detailed description of the new memory.\n"
        f"- A list of characters who share this memory with the main character.\n\n"
        f"Respond in JSON format with the following structure:\n"
        f"{{'content': 'str', 'characters': ['str']}}"
    )