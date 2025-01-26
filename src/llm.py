import time
import openai
import json

def chatcompletion(prompt, max_retries=5, wait_time=5):
    for attempt in range(max_retries):
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )

            json_output = json.loads(response.choices[0].message['content'])
            return json_output
        except openai.RateLimitError as e:
            print(f"RateLimitError: {e}. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
        except json.JSONDecodeError:
            return {}
        except Exception as e:
            print(f"Error: {e}")
            return {}
    print("Max retries exceeded.")
    return {}