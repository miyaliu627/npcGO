from character import parse_characters
from flask import Flask, jsonify, request
from flask_cors import CORS
from memory import Memory, Message
from world import World, run_world, generate_next, harry_world_setting, harry_characters_json
from llm import generate_image
import itertools


app = Flask(__name__)
CORS(app)

# @app.route('/run_simulation', methods=['POST'])
# def run_simulation():
#     result = run_world(harry_world_setting, harry_characters_json)
#     return jsonify(result)

current_world = None

@app.route('/set_world', methods=['POST'])
def set_world():
    """
    Initializes a new world simulation and allows the user to control a character.
    Expects JSON with:
    - 'world_setting': The world environment.
    - 'characters_json': List of character data.
    - 'user_character': (Optional) The name of the character the user controls.
    """
    global current_world, user_controlled_character

    data = request.json
    if not data or 'world_setting' not in data or 'characters_json' not in data:
        return jsonify({"error": "Missing 'world_setting' or 'characters_json'"}), 400

    world_setting = data['world_setting']
    characters_json = data['characters_json']
    user_character = data.get("user_character")

    parsed_characters = parse_characters(characters_json)
    current_world = World(world_setting, parsed_characters)
    if user_character and user_character in current_world.characters:
        user_controlled_character = user_character
    else:
        user_controlled_character = None

    return jsonify({
        "message": "World initialized",
        "characters_count": len(current_world.characters),
        "user_controlled_character": user_controlled_character,
        "initial_memories_count": len(current_world.message_stream)
    })

@app.route('/update_world', methods=['POST'])
def update_world():
    """
    Updates the setting attribute of the World.
    Expects JSON with:
    - 'new_world_setting': The new world environment.
    """
    global current_world

    data = request.json
    if not data or 'new_world_setting' not in data:
        return jsonify({"error": "Missing 'new_world_setting'"}), 400
    
    if current_world is None:
        return jsonify({"error": "World is not initialized"}), 500
    current_world.setting = data['new_world_setting']

    return jsonify({
        "message": "World setting updated"
    })

@app.route('/update_characters', methods=['POST'])
def update_characters():
    """
    Updates the characters within the simulation.
    Expects JSON with:
    - 'characters_json': List of character data for the characters that are to be updated/added.
    """
    global current_world, user_controlled_character

    data = request.json
    if not data or 'characters_json' not in data:
        return jsonify({"error": "Missing 'characters_json'"}), 400

    characters_json = data['characters_json']
    parsed_characters = parse_characters(characters_json)
    user_character = data.get("user_character")

    for character in parsed_characters:
        if character.name in current_world.characters:
            current_world.characters[character.name].description = character.description
        else:
            current_world.characters[character.name] = character
    
    if user_character and user_character in current_world.characters:
        user_controlled_character = user_character
    else:
        user_controlled_character = None

    return jsonify({
        "message": "Characters updated",
        "characters_count": len(current_world.characters),
        "user_controlled_character": user_controlled_character
    })

@app.route('/simulate_next', methods=['GET'])
def simulate_next():
    """
    Simulates the next step in the simulation
    """
    global current_world, user_controlled_character

    if current_world is None:
        return jsonify({"error": "No world is initialized. Set the world first using /set_world."}), 400

    current_world.cycle += 1
    random_character_name, new_observation, new_reflection = generate_next(current_world, user_controlled_character)
    image_url = None
    if current_world.cycle % 5 == 0:  
        top_messages = list(itertools.islice(current_world.message_stream, max(len(current_world.message_stream) - 5, 0), len(current_world.message_stream)))
        system_prompt = (
            "Create a detailed, artistic illustration for a novel that captures the mood, characters, and setting from the conversation below. "
            "The illustration should be in a cute, graphic novel style with vibrant colors, and it should contain no text or dialogue. "
            "Focus on visual storytelling elements that convey the atmosphere and emotions of the scene."
        )        
        image_description = "\n".join(f"{m.character} said: {m.message}" for m in top_messages)
        image_url = generate_image(system_prompt + image_description, max_retries=2, wait_time=5)
        print("Generated image URL")

    reflection_dict = new_reflection.to_dict() if isinstance(new_reflection, Memory) else None
    if not reflection_dict or reflection_dict.get("message") == "":
        reflection_dict = None
    print("new reflection:", reflection_dict)

    return jsonify({
        "character": random_character_name,
        "new_observation": new_observation.to_dict() if isinstance(new_observation, Message) else {"message": "No new observation."},
        "new_reflection": reflection_dict,
        "total_messages": len(current_world.message_stream),
        "image_url": image_url
    })

@app.route('/user_message', methods=['POST'])
def user_message():
    """
    Allows a user to enter a message as their character.
    Expects JSON:
    - 'message': The message content.
    """
    global current_world, user_controlled_character

    if current_world is None:
        return jsonify({"error": "No world is initialized. Set the world first using /set_world."}), 400

    if not user_controlled_character:
        return jsonify({"error": "No user-controlled character is assigned."}), 400

    data = request.json
    if "message" not in data:
        return jsonify({"error": "Missing 'message' field."}), 400

    user_message_content = data["message"]
    
    user_message = Message(user_controlled_character, user_message_content)
    
    current_world.message_stream.append(user_message)

    return jsonify({
        "message": "User message added",
        "character": user_controlled_character,
        "message_content": user_message_content,
        "total_messages": len(current_world.message_stream)
    })

@app.route('/generate_story_image', methods=['GET'])
def generate_story_image():
    global current_world

    top_messages = []
    k = 0
    if len(current_world.message_stream) > 0:
        k = min(len(current_world.message_stream), 5)
        top_messages = list(current_world.message_stream)[-k:]

    if not top_messages:
        return jsonify({"error": "Message stream is empty, no available messages to generate images"}), 500

    image_description = ""
    for m in top_messages:
        image_description += f"{m.character} said: {m.message}\n"

    photo_url = generate_image(image_description, max_retries=0, wait_time=5)

    if not photo_url:
        return jsonify({"error": "Image generation failed."}), 400

    return jsonify({"photo_url": photo_url})



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)