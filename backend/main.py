from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

feedback_model = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

class Answer(BaseModel):
    question: str
    answer: str

@app.get("/")
def home():
    return {"message": "AI Mock Interviewer Running!"}

@app.post("/feedback")
def get_feedback(data: Answer):
    word_count = len(data.answer.strip().split())

    if word_count < 10:
        return {
            "question": data.question,
            "answer": data.answer,
            "sentiment": "TOO SHORT",
            "confidence": "N/A",
            "feedback": f"Your answer is too short ({word_count} words). Please elaborate with at least 10 words."
        }

    result = feedback_model(data.answer)
    sentiment = result[0]["label"]
    score = round(result[0]["score"] * 100, 2)

    if sentiment == "POSITIVE" and score >= 90:
        detail = "Excellent answer! Very confident and clear."
    elif sentiment == "POSITIVE" and score >= 75:
        detail = "Good answer! Try adding specific examples."
    elif sentiment == "POSITIVE":
        detail = "Decent answer. Work on structure and clarity."
    elif sentiment == "NEGATIVE" and score >= 90:
        detail = "Answer needs improvement. Stay positive and confident."
    else:
        detail = "Try to restructure your answer more positively."

    return {
        "question": data.question,
        "answer": data.answer,
        "sentiment": sentiment,
        "confidence": f"{score}%",
        "feedback": detail
    }
