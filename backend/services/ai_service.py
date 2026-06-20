from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_quiz(subject):

    prompt = f"""
    Generate 5 multiple choice questions about {subject}.

    Return ONLY valid JSON.

    {{
        "questions":[
        {{
            "question":"...",
            "options":[
                "A) ...",
                "B) ...",
                "C) ...",
                "D) ..."
            ],
            "answer":"C) ...",
            "explanation":"..."
        }}
    ]
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    return json.loads(text)
def generate_study_plan(subject):

    prompt = f"""
    Create a 7-day study plan for {subject}.

    Return ONLY valid JSON.

    {{
      "plan":[
        {{
          "day":1,
          "topic":"..."
        }}
      ]
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    return json.loads(text)