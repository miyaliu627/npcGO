from memory import Memory
from character import Character, parse_characters
from typing import List
from collections import deque
from simulations.harrypotter import harry_world_setting, harry_characters_json
import random as rand

class World:
    def __init__(self, setting: str, characters: List[Character], message_stream=deque()):
        self.setting = setting
        self.cycle = 0
        self.message_stream = deque(message_stream)
        self.characters = {}
        for character in characters:
            self.characters[character.name] = character


def run_world(world_setting, characters_json):
    parsed_characters = parse_characters(characters_json)
    world = World(world_setting, parsed_characters)
    print(f"Starting simulation with {len(world.characters)} characters and {len(world.message_stream)} memories.")
   
    while True:
        generate_next(world)
        
            
def generate_next(world):
    """
    1. first, select a random character from world.characters
    2. retrieve top k most recent messages
    3. retrieve top n most important memories from character
    4. create full observe prompt, then call LLM to get response
    5. Supply that to the frontend, and add it to the memory stream
    6. if reaches p messages since last reflection, do reflection
    """
    
    # Select random character
    random_character_name = rand.choice(list(world.characters.keys()))
    random_character = world.characters[random_character_name]

    # Retrieve top k most recent messages from the story
    top_messages = []
    k = 0
    if len(world.message_stream) > 0:
        k = min(len(world.message_stream), 50)
        top_messages = list(world.message_stream)[-k:] # Most recent memories are at the end of the list
    
    # retrieve top k most important memories for the character
    character_top_memories = random_character.retrieve_top_k_memories(k)
    new_observation = random_character.observe(character_top_memories, top_messages, world.setting)
    
    # 5. Supply that to the frontend, and add it to the memory stream
    world.message_stream.append(new_observation)
    
    # 6. if reaches p messages since last reflection, do reflection (try async later)
    new_reflection = random_character.reflect(character_top_memories, top_messages, world.setting)
    if isinstance(new_reflection, Memory):
        random_character.memories.append(new_reflection)

    return random_character_name, new_observation, new_reflection

run_world(harry_world_setting, harry_characters_json)