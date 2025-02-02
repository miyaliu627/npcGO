from typing import List
from memory import Memory, Message
import json

def complete_observe_prompt(setting, character_description, top_memories: List[Memory], top_messages):
    return (
        "You are an AI storyteller. Analyze the following details and suggest the next thing the character should say.\n\n"
        "### Story Context ###\n"
        f"- **Story Setting:** {setting}\n"
        f"- **Character Description:** {character_description}\n\n"
        
        "### Character's Top Memories ###\n"
        f"{json.dumps([{'content': m.content, 'importance': m.importance} for m in top_memories], indent=2)}\n\n"
        
        "### Most Recent Conversations Between Characters ###\n"
        f"{json.dumps([{'character': m.character, 'message': m.message} for m in top_messages], indent=2)}\n\n"

        "**Instruction:**\n"
        "Generate the character's next message in JSON format **without any additional text**.\n"
        "Ensure the response follows this **exact** structure:\n"
        "```json\n"
        "{\n"
        '  "character": "<character name>",\n'
        '  "message": "<character message>"\n'
        "}\n"
        "```"
    )
