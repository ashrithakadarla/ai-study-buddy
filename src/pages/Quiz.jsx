import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Quiz.css";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [weakAreas, setWeakAreas] = useState([]);
  const location = useLocation();
  const subject = location.state?.subject || "General";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:5000/generate-quiz?subject=${subject}`
      );
  
      const data = await response.json();
  
      setQuestions(data.questions);
      setCurrentQuestion(0);
      setScore(null);
      setWeakAreas([]);
      setSelectedAnswers({});
    } catch(error){
      console.error(error);
      setError("Failed to generate quiz.");
    }
    finally{
      setLoading(false);
    }
  };
  const handleSubmit = () => {
    let marks = 0;
    let wrong = [];
  
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) {
        marks++;
      } else {
        wrong.push({
          question:q.question,
          yourAnswer:selectedAnswers[i],
          correct: q.answer,
          explanation:q.explanation
        });
      }
    });
  
    setScore(marks);
    setWeakAreas(wrong);
  };

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">🧠 {subject} Quiz</h1>
  
      <button
        className="quiz-button"
        onClick={handleGenerateQuiz}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>
  
      <div className="quiz-list">
      {questions.length > 0 && score === null && (
          <div className="quiz-card">
  
            <h3 className="quiz-question">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
  
            <p>{questions[currentQuestion].question}</p>
  
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="quiz-option">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={selectedAnswers[currentQuestion] === option}
                  onChange={() =>
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [currentQuestion]: option
                    })
                  }
                />
                <label>{option}</label>
              </div>
            ))}
  
            {/* Navigation Buttons */}
            {currentQuestion < questions.length - 1 ? (
              <button
                className="quiz-button"
                disabled = { !selectedAnswers[currentQuestion] }
                onClick={() =>
                  setCurrentQuestion(currentQuestion + 1)
                }
              >
                Next Question →
              </button>
            ) : (
              <button className="quiz-button" onClick={handleSubmit}>
                Submit Quiz
              </button>
            )}
  
          </div>
        )}
        {score !== null && (
          <div>
            <h2>Score: {score}/{questions.length}</h2>
            {score === questions.length ? (
              <p>🔥 Excellent! You mastered this topic.</p>
            ) : score >= questions.length / 2 ? (
              <p>👍 Good job! Revise the weak areas below.</p>
            ) : (
              <p>📚 Needs improvement. Focus on fundamentals.</p>
            )}

            {weakAreas.length > 0 && (
              <div className="quiz-card">
                <h3>🧠 Learning Feedback</h3>
                {weakAreas.map((item, index) => (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <p><b>Question:</b> {item.question}</p>

                    <p style={{ color: "red" }}>
                      ❌ Your Answer: {item.yourAnswer}
                    </p>

                    <p style={{ color: "green" }}>
                      ✔ Correct Answer: {item.correct}
                    </p>

                    <p style={{ color: "#555" }}>
                      💡 Explanation: {item.explanation}
                    </p>
                    </div>
                    ))}
                </div>
            )}
            <button className="quiz-button"
              onClick={handleGenerateQuiz} >
              Restart Quiz
            </button>
            {error && <p>{error}</p>}
      </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;