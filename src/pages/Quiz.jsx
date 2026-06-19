import { useState } from "react";
import "./Quiz.css";

function Quiz() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const handleGenerateQuiz = () => {
    const sampleQuestions = [
      {
        question: `What is a key concept in ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
      },
      {
        question: `Which statement about ${topic} is correct?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
      },
      {
        question: `What is an important feature of ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
      },
      {
        question: `Which best describes ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
      },
      {
        question: `Why is ${topic} useful?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
      },
    ];

    setQuestions(sampleQuestions);
    setCurrentQuestion(0);
  };

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">🧠 Quiz Generator</h1>
  
      <input
        className="quiz-input"
        type="text"
        placeholder="Enter Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
  
      <button className="quiz-button" onClick={handleGenerateQuiz}>
        Generate Quiz
      </button>
  
      <div className="quiz-list">
        {questions.length > 0 && (
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
                  onChange={(e) => setSelectedAnswers({
                    ...selectedAnswers,
                    [currentQuestion]: option
                  })}
                />
                <label>{option}</label>
              </div>
            ))}
  
            {/* Navigation Buttons */}
            {currentQuestion < questions.length - 1 ? (
              <button
                className="quiz-button"
                onClick={() =>
                  setCurrentQuestion(currentQuestion + 1)
                }
              >
                Next Question →
              </button>
            ) : (
              <button className="quiz-button">
                Submit Quiz
              </button>
            )}
  
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;