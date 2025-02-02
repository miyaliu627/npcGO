import time
import openai
import json
import re

client = openai.Client()

def chatcompletion(prompt, max_retries=2, wait_time=5):
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )
        
            message_content = response.choices[0].message.content
            
            # if message_content.startswith("```json"):
            #     message_content = message_content[7:] 
            # if message_content.endswith("```"):
            #     message_content = message_content[:-3]
            json_match = re.search(r'\{.*\}', message_content, re.DOTALL)
            if not json_match:
                print("Error: No valid JSON found in response.")
                return {}
            
            message_content = json_match.group(0)

            return json.loads(message_content)
        
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