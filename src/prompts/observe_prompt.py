from typing import List
from memory import Memory, Message
import json

def complete_observe_prompt(setting, name, character_description, top_memories: List[Memory], top_messages):
    return (
        "You are an master fanfic writer. Generate the next message in a conversation for the specified character in a natural, engaging voice.\n\n"

        "### Dialogue Writing Principles ###\n"
        "- **Stay in Character:** Reflect {name}'s personality, mannerisms, and past experiences.\n"
        "- **Use Subtext:** Avoid stating emotions directly; imply them through tone and wording.\n"
        "- **The “Instant Hook” Principle**: Every sentence should propel the reader forward.\n"
        "- **Conflict is King**: Scenes should have friction, even if characters are on the same side. Tension keeps readers engaged.\n"
        "- **Ensure Natural Flow:** If {name} spoke last, continue their thought seamlessly.\n"
        "- **Be Concise:** Keep responses under 50 words, making each line impactful.\n\n"

        "### Context ###\n"
        f"- **Setting:** {setting}\n"
        f"- **Character Description:** {character_description}\n\n"

        "### Character’s Key Memories ###\n"
        f"{json.dumps([{'content': m.content, 'importance': m.importance} for m in top_memories], indent=2)}\n\n"

        "### Recent Conversation ###\n"
        f"{json.dumps([{'character': m.character, 'message': m.message} for m in top_messages], indent=2)}\n\n"

        "**Output Format:**\n"
        "Return a JSON object with the following structure:\n"
        "```json\n"
        "{\n"
        '  "character": "<character name>",\n'
        '  "message": "<character message>"\n'
        "}\n"
        "```"
    )
