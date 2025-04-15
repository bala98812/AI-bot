from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from googletrans import Translator
from dotenv import load_dotenv
import audio  # Import your updated Murf audio module

# Load environment variables 
load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app)

generator = pipeline("text-generation", model="gpt2")
translator = Translator()

# ✅ Function to Translate to Tamil
def translate_to_tamil(text):
    translated = translator.translate(text, dest="ta")
    return translated.text

@app.route("/generate-story", methods=["POST"])
def generate_story_endpoint():
    data = request.json
    prompt = data.get("prompt", "")
    story_in_english = generator(prompt, max_length=100, temperature=0.9)[0]["generated_text"]
    story_in_tamil = translate_to_tamil(story_in_english)

    print("Story generated Success")
    return jsonify({"english_story": story_in_english, "tamil_story": story_in_tamil})

@app.route("/generate-audio", methods=["POST"])
def generate_audio_endpoint():
    print("A - step 1")
    data = request.json
    print("A - step 2")
    text = data.get("text", "")
    print("A - step 3")
    if not text.strip():
        print("A - step 3 - error")
        return jsonify({"error": "No text provided"}), 400
    
    print("A - step 4")
    audio_url = audio.generate_audio(text)
    print("A - step 5")
    if "error" in audio_url:
        print("A - step 5 - error")
        return jsonify({"error": audio_url["error"]}), 500
    
    print("A - step 6")
    return jsonify({"audio_url": audio_url})

if __name__ == "__main__":
    print("A - step 7")
    app.run(debug=True, port=5001)
