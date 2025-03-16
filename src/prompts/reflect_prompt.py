from typing import List
from memory import Memory, Message
import json

def complete_reflect_prompt(setting, character_description, top_memories: List[Memory], top_messages: List[Message]):
    return (
        "You are an AI storyteller. Analyze the following details and suggest what the character realizes, thinks, or feels.\n\n"
        
        "### Story Context ###\n"
        f"- **Story Setting:** {setting}\n"
        f"- **Character Description:** {character_description}\n\n"
        
        "### Character's Top Memories ###\n"
        f"{json.dumps([{'content': m.content, 'importance': m.importance} for m in top_memories], indent=2)}\n\n"
        
        "### Most Recent Conversations Between Characters ###\n"
        f"{json.dumps([{'character': m.character, 'message': m.message} for m in top_messages], indent=2)}\n\n"

        "**Instruction:**\n"
        "Reflect on this information and generate the character's thoughts and emotions.\n"
        "Ensure the response follows this **exact** structure in JSON format **without additional text**:\n"
        "Keep the message less than 50 words.\n"
        "```json\n"
        "{\n"
        '  "content": "<character reflection>",\n'
        '  "characters": ["<related character 1>", "<related character 2>", ...]\n'
        "}\n"
        "```"
    )