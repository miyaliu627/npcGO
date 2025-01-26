from character import Character
from memory import Memory

world_setting = (
    "In a bustling city, two criminals, Marcus and Evelyn, are arrested after a failed heist. "
    "The police lack concrete evidence to convict them but offer each a deal to elicit a confession. "
    "The two are held in separate interrogation rooms. Each prisoner faces the same choice: betray the other "
    "(cooperate with the police) or remain silent (stay loyal to their partner). "
    "The consequences of their decisions are as follows:\n"
    "- If both stay silent, they will each be released with minor fines.\n"
    "- If one betrays the other while the other remains silent, the betrayer goes free, and the silent prisoner serves 10 years.\n"
    "- If both betray each other, they will each serve 3 years in prison."
)

prisoner1 = Character(
    "Marcus", 
    "Marcus is a professional thief who recently became a father to a newborn daughter, Sophia. Marcus wants to leave behind his life of crime to be a better role model and caretaker for his family. He is deeply torn between his loyalty to Evelyn, his longtime partner, and his responsibility to his wife, Clara, and their daughter. Marcus knows that if he remains silent and Evelyn betrays him, he could miss the most important years of his daughter’s life. However, he is extremely loyal and dependable as a partner", 
    0, 
    50,
)

prisoner2 = Character(
    "Evelyn", 
    "Evelyn is a brilliant strategist who has always prioritized logic over emotion. She has no family of her own but sees Marcus as more than just a partner—he once saved her life during a dangerous job. She’s aware of Marcus’s growing desire to leave the criminal world, and part of her wonders if his loyalty to her is still strong enough to withstand the pressure of the interrogation.",
    0,
    80,
)

characters = [prisoner1, prisoner2]

initial_memory_stream = [
    Memory(
        ts=0,
        content="Marcus is a professional thief.",
        importance=7,
        characters=["Marcus", "Evelyn"]
    ),
    Memory(
        ts=0,
        content="Marcus recently became a father to a newborn daughter, Sophia.",
        importance=10,
        characters=["Marcus", "Evelyn"]
    ),
    Memory(
        ts=0,
        content="Marcus wants to leave behind his life of crime to be a better role model and caretaker for his family.",
        importance=9,
        characters=["Marcus"]
    ),
    Memory(
        ts=0,
        content="Marcus is deeply torn between his loyalty to Evelyn and his responsibility to his wife, Clara, and their daughter, Sophia.",
        importance=9,
        characters=["Marcus"]
    ),
    Memory(
        ts=0,
        content="Marcus knows that if he remains silent and Evelyn betrays him, he could miss the most important years of his daughter’s life.",
        importance=10,
        characters=["Marcus"]
    ),
    Memory(
        ts=0,
        content="Marcus is extremely loyal and dependable as a partner.",
        importance=7,
        characters=["Marcus", "Evelyn"]
    ),
    Memory(
        ts=1,
        content="Evelyn is a brilliant strategist who has always prioritized logic over emotion.",
        importance=9,
        characters=["Evelyn", "Marcus"]
    ),
    Memory(
        ts=2,
        content="Evelyn has no family of her own.",
        importance=5,
        characters=["Evelyn", "Marcus"]
    ),
    Memory(
        ts=3,
        content="Marcus has once saved Evelyn's life during a dangerous job.",
        importance=10,
        characters=["Evelyn", "Marcus"]
    ),
    Memory(
        ts=0,
        content="Evelyn is aware of Marcus’s growing desire to leave the criminal world.",
        importance=10,
        characters=["Evelyn"]
    ),
    Memory(
        ts=0,
        content="Evelyn wonders if Marcus’s loyalty to her is still strong enough to withstand the pressure of the interrogation.",
        importance=10,
        characters=["Evelyn"]
    )
]