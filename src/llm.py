import time
import openai
import json
import re

client = openai.Client()

def chatcompletion(prompt, system_prompt="", max_retries=2, wait_time=5):
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}]
            )
        
            message_content = response.choices[0].message.content
            
            json_match = re.search(r'\{.*\}', message_content, re.DOTALL)
            if not json_match:
                print("Error: No valid JSON found in response.")
                return {}
            
            message_content = json_match.group(0)
            if "'" in message_content and '"' not in message_content:
                message_content = message_content.replace("'", '"')

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


def generate_image(prompt, max_retries=2, wait_time=5): 
    for attempt in range(max_retries): 
        try: 
            response = client.images.generate( 
                model="dall-e-3", 
                prompt=prompt, 
                size="1024x1024", 
                quality="standard", 
                n=1, 
            ) 
            return response.data[0].url 
        except openai.RateLimitError as e: 
            print(f"RateLimitError: {e}. Retrying in {wait_time} seconds...") 
            time.sleep(wait_time) 
        except json.JSONDecodeError: 
            return None 
        except Exception as e: 
            print(f"Error: {e}") 
            return None 
        print("Max retries exceeded.") 
        return None