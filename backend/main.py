from fastapi import FastAPI
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

feedback_model=pipeline("text-classification",model="distilbert-base-uncased-finetuned-sst-2-english")

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class Answer(BaseModel):
    question: str
    answer: str

@app.get("/")
def home():
    return {"message":"AI mock interview is running!"}

@app.post("/feedback")
def get_feedback(data: Answer):
    result=feedback_model(data.answer)
    sentiment=result[0]['label']
    score=round(result[0]['score']*100,2)
    return {
        "question":data.question,
        "answer":data.answer,
        "sentiment": sentiment,
        "confidence": f"{score}%",
        "feedback": f"Your answer seems {sentiment} with {score}% confidence"
    }


