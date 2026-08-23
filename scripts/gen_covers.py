import asyncio, os, base64, json
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')
from emergentintegrations.llm.chat import LlmChat, UserMessage

stories = json.load(open('/tmp/covers_todo.json'))
OUT = '/app/frontend/public/covers'
os.makedirs(OUT, exist_ok=True)
sem = asyncio.Semaphore(4)

STYLE = (
    'epic book cover illustration, portrait 3:4 orientation, dramatic cinematic lighting, rich detail, '
    'vibrant colors with deep dark tones, fantasy web novel cover art style. '
    'ABSOLUTELY NO text, NO letters, NO words, NO typography, NO watermarks anywhere in the image.'
)

async def gen(s):
    async with sem:
        path = f"{OUT}/{s['slug']}.png"
        if os.path.exists(path):
            print('SKIP', s['slug'], flush=True)
            return
        prompt = f"Create {STYLE} Cover for the story '{s['title']}' (genre: {s['genre']}). Scene: {s['desc']}"
        try:
            chat = LlmChat(api_key=os.environ['EMERGENT_LLM_KEY'], session_id=f"cover-{s['slug']}", system_message='You are a master fantasy cover artist.')
            chat.with_model('gemini', 'gemini-3.1-flash-image-preview').with_params(modalities=['image', 'text'])
            text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
            if images:
                with open(path, 'wb') as f:
                    f.write(base64.b64decode(images[0]['data']))
                print('OK', s['slug'], flush=True)
            else:
                print('NOIMG', s['slug'], flush=True)
        except Exception as e:
            print('FAIL', s['slug'], str(e)[:150], flush=True)

async def main():
    await asyncio.gather(*[gen(s) for s in stories])
    done = [s['slug'] for s in stories if os.path.exists(f"{OUT}/{s['slug']}.png")]
    print('DONE', len(done), 'covers:', done, flush=True)

asyncio.run(main())
