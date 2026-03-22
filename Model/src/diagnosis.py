import json
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from utils.json_loader import load_json

load_dotenv()

model = init_chat_model(
    "google_genai:gemini-2.5-flash-lite",
    model_kwargs={"max_output_tokens": 300}
)

report_template = """
ROLE:
You are a professional automated diagnostic assistant for Retinopathy. 
Your task is to take technical JSON data from an AI screening and transform it into a 
"Simple-Professional" medical report for a physician to review.

PATIENT DATA (JSON):
{json_data}

REPORT REQUIREMENTS:
1. Tone: Professional, concise, and clinical.
2. Structure: 
   - Patient Summary
   - Key Findings
   - Severity Assessment
   - Recommendation/Next Steps.
3. Language: Clear and simple.

Generated Report:
"""

prompt = ChatPromptTemplate.from_template(report_template)
chain = prompt | model | StrOutputParser()

def generate_retinopathy_report(json_input):
    json_str = json.dumps(json_input, indent=2)
    return chain.invoke({"json_data": json_str})

if __name__ == "__main__":
    print("Generating Report...\n")

    sample_patient_data = load_json("test_data/patient1.json")

    diagnosis_report = generate_retinopathy_report(sample_patient_data)
    
    print("-" * 30)
    print(diagnosis_report)
    print("-" * 30)