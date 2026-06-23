import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage"


function Summary() {

  const location = useLocation()
  const navigate = useNavigate()

  const topic = location.state?.topic
  const summary = location.state?.summaryData  
  const pdfContent = location.state?.pdfContent

  const [error, setError] = useState("")

  async function handleQuiz() {

    navigate("/quiz", {
        state: {
          topic,
          summaryData: summary,
          pdfContent
        }
    })
  
  }
  if (!summary) {
    return <h2>No summary available.</h2>
  }
  return (
    <div className="summary-page">
        <div className="summary-container">
            <div className="summary-card">

            <h1 className="summary-title">{topic}</h1>

            <div className="summary-section">
                <h2>📖 Summary</h2>
                <p className="summary-text">{summary.summary}</p>
            </div>

            <div className="summary-section">
                <h2>💡 Key Points</h2>
                <ul className="summary-list">
                {summary.key_points?.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
                </ul>
            </div>

            <div className="summary-section">
                <h2>🎯 Important Concepts</h2>
                <ul className="summary-list">
                {summary.important_concepts?.map((concept, index) => (
                    <li key={index}>{concept}</li>
                ))}
                </ul>
            </div>

            <button
                className="quiz-button"
                onClick={handleQuiz}
            >
                Generate Quiz
            </button>
            {error && (
              <ErrorMessage message={error} />
            )}
          </div>
        </div>
    </div>
  )
}

export default Summary