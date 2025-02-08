from memory import Memory

def complete_importance_prompt(content, characters):
    return (
        "You are an AI assistant. Your task is to rate the importance of a memory on a scale of 1 to 10. "
        "A rating of 1 represents a mundane event (e.g., brushing teeth), and 10 represents an extremely important moment (e.g., life-changing event). "
        "Only return a JSON response in the following format:\n\n"
        "{'importance': int}\n\n"
        "Now, evaluate this memory:\n"
        f"Memory Details:\nContent: {content}\nCharacters Involved: {characters}\n\n"
        "JSON Output:"
    )