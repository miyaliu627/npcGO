from memory import Memory
def complete_importance_prompt(content, characters):
    return (
        f"On a scale of 1 to 10, where 1 represents purely mundane events "
        f"(e.g., brushing teeth, making a bed) and 10 represents extremely poignant moments "
        f"(e.g., a breakup, college acceptance), rate the likely poignancy of the following memory.\n\n"
        f"Memory Details:\n"
        f"Content: {content}\n"
        f"Characters Involved: {characters}\n\n"
        f"Respond only in JSON format with the following structure:\n"
        f"{{'importance': int}}"
    )
