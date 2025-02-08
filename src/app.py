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
    Sets the world configuration and initializes a new simulation state.
    Expects JSON with 'world_setting' and 'characters_json'.
    """
    global current_world

    data = request.json
    if not data or 'world_setting' not in data or 'characters_json' not in data:
        return jsonify({"error": "Missing 'world_setting' or 'characters_json'"}), 400

    world_setting = data['world_setting']
    characters_json = data['characters_json']

    parsed_characters = parse_characters(characters_json)
    current_world = World(world_setting, parsed_characters)

    return jsonify({
        "message": "World initialized",
        "characters_count": len(current_world.characters),
        "initial_memories_count": len(current_world.message_stream)
    })

@app.route('/simulate_next', methods=['GET'])
def simulate_next():
    """
    Simulates the next step in the simulation based on the current world state.
    """
    global current_world

    if current_world is None:
        return jsonify({"error": "No world is initialized. Set the world first using /set_world."}), 400

    random_character_name, new_observation, new_reflection = generate_next(current_world)

    return jsonify({
        "character": random_character_name,
        "new_observation": new_observation.to_dict() if isinstance(new_observation, Message) else {"message": "No new observation."},
        "new_reflection": new_reflection.to_dict() if isinstance(new_observation, Memory) else new_reflection,
        "total_messages": len(current_world.message_stream)
    })

if __name__ == '__main__':
    app.run(debug=True)