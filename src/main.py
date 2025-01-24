from src.world import World
import src.simulations.prisoners_dilemna as simulation

global ts
ts = 0
max_ts = 20
k = 20

def main():
    world = World(simulation.world_setting, simulation.characters, simulation.initial_memory_stream)
    
    while ts < max_ts:
        if world.memory_stream:
            world.distribute_memory()

        for character in world.characters:
            if character.reflection_score >= character.reflection_threshhold:
                reflection = character.reflect(top_memories)
                world.memory_stream.append(reflection)

            top_memories = character.retrieve_top_k_memories(k)
            observation = character.observer(top_memories, world.setting)
            character.reflection_score += observation.importance
            world.memory_stream.append(observation)
        
        ts += 1

    for character in world.characters:
        decision = character.make_decision()
        print(f"decision: {decision}, character: {character.name}")
        