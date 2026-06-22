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

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text

        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        return json.loads(text)
    except Exception as e:
        print("Gemini Error:", e)

        return {
            "plan": [
                {
                    "day": 1,
                    "topic": "Fallback Study Plan",
                    "goal": "Gemini quota exceeded"
                }
            ]
        }
def generate_study_plan(content,days_left):

    prompt = f"""
    Create a detailed {days_left}-day study plan based on the following study material.

    Study Material:
    {content[:5000]}

    Rules:
    - Return exactly {days_left} days.
    - Focus only on topics present in the material.
    - Start from fundamentals.
    - Gradually move to advanced topics.
    - Reserve the last day for revision and mock tests.
    - Include a goal for each day.

    Return ONLY valid JSON.

    {{
    "plan":[
        {{
        "day":1,
        "topic":"...",
        "goal":"..."
        }}
    ]
    }}
    """

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        return json.loads(text)
    
    except Exception as e:
        print("Gemini Error:", e)

        return {
            "plan": [
                {
                    "day": 1,
                    "topic": "Fallback Study Plan",
                    "goal": "Gemini quota exceeded"
                }
            ]
        }

def generate_summary(topic, content):

    prompt = f"""
    Topic:
    {topic}

    Study Material:
    {content}

    Create:

    1. Short Summary
    2. Key Points
    3. Important Concepts

    Return ONLY valid JSON.

    {{
      "summary":"...",
      "key_points":[
        "...",
        "..."
      ],
      "important_concepts":[
        "...",
        "..."
      ]
    }}
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        return json.loads(text)
    except Exception as e:
        print("Gemini Error:", e)

        return {
            "summary": "Unable to generate summary right now.",
            "key_points": [],
            "important_concepts": []
        }

def generate_topic_quiz(topic, content):

    prompt = f"""
    Create 5 multiple-choice questions from this topic.

    Topic:
    {topic}

    Study Material:
    {content}

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
          "answer":"A) ...",
          "explanation":"..."
        }}
      ]
    }}
    """

    try:
        print("TOPIC QUIZ ROUTE HIT")
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        return json.loads(text)

    except Exception as e:
        print("Quiz Error:", e)

        return {
        "error": "Quiz generation unavailable. Gemini quota exceeded.",
        "questions": []
    }