from world import World
import simulations.prisoners_dilemna as simulation

def main():
    ts = 0
    max_ts = 20
    k = 20

    world = World(simulation.world_setting, simulation.characters, simulation.initial_memory_stream)
    
    print(f"Starting simulation with {len(world.characters)} characters and {len(world.memory_stream)} memories.")
    while ts < max_ts:
        if world.memory_stream:
            world.distribute_memory()

        for _, character in world.characters.items():
            if character.reflection_score >= character.reflection_threshold:
                reflection = character.reflect(top_memories)
                world.memory_stream.append(reflection)

            top_memories = character.retrieve_top_k_memories(k)
            observation = character.observe(top_memories, world.setting, ts)
            print(f"observation: {observation}, character: {character.name}")
            if observation is not None:
                character.reflection_score += observation.importance
                world.memory_stream.append(observation)
        
        ts += 1

    for character in world.characters:
        decision = character.make_decision()
        print(f"decision: {decision}, character: {character.name}")

main()