from character import parse_characters
from flask import Flask, jsonify, request
from memory import Memory, Message
from world import World, run_world, generate_next, harry_world_setting, harry_characters_json

app = Flask(__name__)

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

@app.route('/simulate_next', methods=['GET'])
def simulate_next():
    """
    Simulates the next step in the simulation
    """
    global current_world, user_controlled_character

    if current_world is None:
        return jsonify({"error": "No world is initialized. Set the world first using /set_world."}), 400

    random_character_name, new_observation, new_reflection = generate_next(current_world, user_controlled_character)

    return jsonify({
        "character": random_character_name,
        "new_observation": new_observation.to_dict() if isinstance(new_observation, Message) else {"message": "No new observation."},
        "new_reflection": new_reflection.to_dict() if isinstance(new_reflection, Memory) else new_reflection,
        "total_messages": len(current_world.message_stream)
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


if __name__ == '__main__':
    app.run(debug=True)