import asyncio
from typing import AsyncGenerator
from datetime import datetime

from fastapi import FastAPI, Body, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from PIL import Image

from pymongo import MongoClient

from AiChatbot import with_message_history
from diagnosis import generate_retinopathy_report
from inference_model import predict_image

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["retinopathy_db"]
collection = db["patients"]

app = FastAPI(title="Ayra AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

async def generate_chat_response(patient_id: str, user_input: str) -> AsyncGenerator[str, None]:
    config = {"configurable": {"session_id": patient_id}}

    async for chunk in with_message_history.astream(
        {"input": user_input},
        config=config
    ):
        yield chunk
        await asyncio.sleep(0.02)

@app.post("/chat")
async def chat_endpoint(
    patient_id: str = Body(..., embed=True),
    message: str = Body(..., embed=True)
):
    return StreamingResponse(
        generate_chat_response(patient_id, message),
        media_type="text/plain"
    )

@app.post("/predict")
async def predict_endpoint(
    user_id: str = Body(...),
    file: UploadFile = File(...)
):
    try:
        image = Image.open(file.file).convert("RGB")

        result = predict_image(image)

        patient_data = {
            "user_id": user_id,
            "prediction": result["prediction"],
            "confidence_score": result["confidence"],
            "created_at": datetime.utcnow(),
            "report": None
        }

        collection.insert_one(patient_data)

        return {
            "status": "success",
            "prediction": result
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/generate-report")
async def generate_report(user_id: str = Body(..., embed=True)):
    try:
        patient = collection.find_one(
            {"user_id": user_id},
            sort=[("created_at", -1)]
        )

        if not patient:
            return {"status": "error", "message": "No data found"}

        if patient.get("report"):
            return {"report": patient["report"], "cached": True}

        report = generate_retinopathy_report(patient)

        collection.update_one(
            {"_id": patient["_id"]},
            {"$set": {"report": report}}
        )

        return {"report": report, "cached": False}

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def health_check():
    return {"status": "Ayra AI is online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)