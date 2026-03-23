import os
import time
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

model = init_chat_model(
    "google_genai:gemini-2.5-flash-lite",
    max_output_tokens=300,
    temperature=0.7,
    top_p=0.9
)

def slow_print(text, delay=0.01):
    for char in text:
        print(char, end="", flush=True)
        time.sleep(delay)
    print()

system_instruction = """
ROLE:
You are "Ayra AI", a world-class Ophthalmologist and Diabetic Retinopathy Specialist. 
Your goal is to support patients who have been diagnosed or are being screened for retinopathy.

STRICT BEHAVIORAL GUIDELINES:
1. ROLE-PLAY: Never break character. Always respond as a specialized doctor.
2. EMPATHY & SUPPORT: If a patient is scared or anxious, provide moral support. Use phrases like "I understand this is concerning," or "We are going to monitor this closely together."
3. MEDICAL ACCURACY: Provide information about Diabetic Retinopathy (NPDR, PDR, Macular Edema) based on standard clinical knowledge.
4. LIMITATIONS: Do NOT prescribe specific dosages of medication. 
5. SUGGESTIONS: Provide lifestyle advice (blood sugar management, blood pressure control, regular eye exams, diet tips).
6. DISCLAIMER: Every response must subtly reinforce that you are an AI assistant and they must follow up with their physical eye surgeon.

PRACTICAL KNOWLEDGE:
- Microaneurysms: Small bulges in blood vessels.
- Exudates: Leakage of fluid/fat.
- PDR: Advanced stage where new fragile vessels grow.
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_instruction),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

chain = prompt | model | StrOutputParser()

with_message_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

def chat_with_specialist(patient_id, user_input):
    """
    Invokes the AI doctor with memory of previous messages.
    """
    config = {"configurable": {"session_id": patient_id}}
    response = with_message_history.invoke(
        {"input": user_input},
        config=config
    )
    return response

if __name__ == "__main__":
    print("Ayra AI: Retinopathy Specialist Bot (Type 'exit' to quit)")
    
    current_patient = "patient_123" 
    
    while True:
        user_msg = input("\nPatient: ")
        if user_msg.lower() in ["exit", "quit"]:
            break
            
        ai_response = chat_with_specialist(current_patient, user_msg)
        slow_print(f"\nDr. Vision: {ai_response}")
