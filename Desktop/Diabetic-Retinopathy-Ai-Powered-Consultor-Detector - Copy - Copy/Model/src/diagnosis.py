import json
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from utils.json_loader import load_json

load_dotenv()

model = init_chat_model(
    "google_genai:gemini-2.5-flash-lite",
    max_output_tokens=300,
    temperature=0.7,
    top_p=0.9
)

report_template = """
ROLE:
You are a clinical AI assistant specialized in diabetic retinopathy screening reports.

INPUT:
You will receive structured JSON data from an AI model.

TASK:
Convert it into a strictly structured medical report.

OUTPUT FORMAT (MANDATORY):

Patient Summary:
- ...

Key Findings:
- ...

Severity Assessment:
- ...

Recommendation:
- ...

RULES:
- Do not add extra sections
- Do not include explanations about AI or JSON
- Keep language clinical and concise
- Base conclusions strictly on provided data

JSON DATA:
{json_data}
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