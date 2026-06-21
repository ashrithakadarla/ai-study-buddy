from flask import Flask
from flask_cors import CORS

from routes.quiz import quiz_bp
from routes.study_plan import study_plan_bp

from services.ai_service import generate_quiz
from routes.upload import upload_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(quiz_bp)
app.register_blueprint(study_plan_bp)
app.register_blueprint(upload_bp)

@app.route("/")
def home():
    return {
        "message": "AI Study Buddy Backend Running"
    }

@app.route("/test-ai")
def test_ai():
    return generate_quiz("Java")

@app.route("/check-upload")
def check_upload():
    return "Upload Blueprint Loaded"

if __name__ == "__main__":
    app.run(debug=True)