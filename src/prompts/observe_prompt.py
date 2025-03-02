from typing import List
from memory import Memory, Message
import json

def complete_observe_prompt(setting, name, character_description, top_memories: List[Memory], top_messages):
    return (
        "You are an AI storyteller. You must produce the next message for the specified character in a natural, coherent voice.\n\n"
        
        "### Important Note About Consecutive Dialogue ###\n"
        "If the last speaker in the conversation was the **same** character (i.e., this character speaking again), "
        "treat it as a continuous line of thought, "
        "an ongoing monologue, or a natural pause followed by more speaking. It should read naturally—like one person "
        "continuing their own speech—rather than having them appear to have a conversation with themselves.\n\n"
        
        "### Character Name ###\n"
        f"{name}\n\n"
        
        "### Story Context ###\n"
        f"- **Story Setting:** {setting}\n"
        f"- **Character Description:** {character_description}\n\n"
        
        "### Character's Top Memories ###\n"
        f"{json.dumps([{'content': m.content, 'importance': m.importance} for m in top_memories], indent=2)}\n\n"
        
        "### Most Recent Conversations Between Characters ###\n"
        f"{json.dumps([{'character': m.character, 'message': m.message} for m in top_messages], indent=2)}\n\n"
        
        "**Instruction:**\n"
        f"Generate {name}'s next message in JSON format **without any additional text**. The message should be in the voice of {name}.\n"
        "Stay true to the context of the conversation, and if this is consecutive dialogue by the same character, "
        "make sure it remains one continuous line of thought (not them responding to themselves). Keep it coherent.\n"
        "\n"
        "Ensure the response follows this **exact** structure:\n"
        "```json\n"
        "{\n"
        '  "character": "<character name>",\n'
        '  "message": "<character message>"\n'
        "}\n"
        "```"
    )
