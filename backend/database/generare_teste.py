import pymongo
import json
import unicodedata
from bson import ObjectId
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from transformers import T5ForConditionalGeneration, T5Tokenizer
from argostranslate import translate
import torch

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# MongoDB
uri = "mongodb+srv://maria:maria22@brainit.iuj2zxy.mongodb.net/?retryWrites=true&w=majority&appName=BrainIT"
client = pymongo.MongoClient(uri, tls=True, tlsAllowInvalidCertificates=True)
db = client["BrainIT"]
lessons_collection = db["lectii"]
articles_collection = db["articole"]

# Model
model_name = "mrm8488/t5-base-finetuned-question-generation-ap"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name).to(device)

# App
app = FastAPI()

# CORS (ca să poți face requesturi din Node.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def remove_diacritics(text):
    return ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')

def load_translation_models():
    translate.load_installed_languages()
    langs = translate.get_installed_languages()
    ro = next((l for l in langs if l.code == "ro"), None)
    en = next((l for l in langs if l.code == "en"), None)
    return ro.get_translation(en), en.get_translation(ro) if ro and en else (None, None)

def translate_text(text, translator):
    return translator.translate(text)

def generate_questions(sentences, max_q=5):
    questions = []
    inputs = [f"generate question: {s}" for s in sentences if len(s) > 20]

    if not inputs:
        return []

    input_ids = tokenizer(inputs, return_tensors="pt", padding=True, truncation=True).input_ids.to(device)
    outputs = model.generate(input_ids, max_length=64, num_beams=4, early_stopping=True)

    for output in outputs:
        q = tokenizer.decode(output, skip_special_tokens=True)
        if q and "?" in q and q not in questions:
            questions.append(q)
        if len(questions) >= max_q:
            break
    return questions

@app.get("/generate-questions")
def generate_from_lesson(lesson_id: str = Query(...)):
    try:
        lesson = lessons_collection.find_one({"_id": ObjectId(lesson_id)})
        if not lesson:
            return {"error": "Lectia nu a fost gasita"}

        articole_ids = lesson.get("articole", [])
        total_content = ""

        for article_id in articole_ids:
            article = articles_collection.find_one({"_id": ObjectId(article_id)})
            if article and "continut" in article:
                total_content += article["continut"] + " "

        if not total_content.strip():
            return {"error": "Continutul articolelor este gol"}

        ro_en, en_ro = load_translation_models()
        if not ro_en or not en_ro:
            return {"error": "Traducatori indisponibili"}

        en_text = translate_text(total_content, ro_en)
        sentences = [s.strip() for s in en_text.split('.') if len(s.strip()) > 20]
        questions_en = generate_questions(sentences)

        questions_ro = [
            remove_diacritics(translate_text(q, en_ro)).removeprefix("intrebare:").strip().capitalize()
            for q in questions_en
        ]

        return {"intrebari": questions_ro}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("generare_teste:app", host="127.0.0.1", port=8002, reload=False)
