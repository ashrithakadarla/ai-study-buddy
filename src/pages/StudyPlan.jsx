import { useState } from 'react'
import { fetchStudyPlan } from '../services/studyPlanService'
import { Link } from "react-router-dom";
import './StudyPlan.css'

function StudyPlan() {
  const [subject, setSubject] = useState('')
  const [examDate, setExamDate] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState('')
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const result = await fetchStudyPlan({
      subject,
      examDate,
      hoursPerDay: Number(hoursPerDay),
    })

    if (!result.success) {
      setPlan(null)
      setError(result.error)
      return
    }

    setPlan(result.plan)
  }

  return (
    <div className="study-plan">
      <div className="study-plan__container">
        <header className="study-plan__header">
          <p className="study-plan__eyebrow">Plan your success</p>
          <h1 className="study-plan__title">Build Your Study Plan</h1>
          <p className="study-plan__subtitle">
            Enter your subject and exam details to generate a personalized daily
            schedule that keeps you on track.
          </p>
        </header>

        <div className="study-plan__layout">
          <section className="study-plan__card study-plan__form-card">
            <h2 className="study-plan__card-title">Study Details</h2>
            <form className="study-plan__form" onSubmit={handleSubmit}>
              <div className="study-plan__field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="e.g. Biology, Calculus"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  required
                />
              </div>

              <div className="study-plan__field">
                <label htmlFor="examDate">Exam Date</label>
                <input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(event) => setExamDate(event.target.value)}
                  required
                />
              </div>

              <div className="study-plan__field">
                <label htmlFor="hoursPerDay">Hours Per Day</label>
                <input
                  id="hoursPerDay"
                  type="number"
                  min="1"
                  max="12"
                  step="0.5"
                  placeholder="e.g. 2"
                  value={hoursPerDay}
                  onChange={(event) => setHoursPerDay(event.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="study-plan__error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="study-plan__button">
                Generate Plan
              </button>
            </form>
          </section>

          {plan && (
            <section
              className="study-plan__card study-plan__result-card"
              aria-live="polite"
            >
              <h2 className="study-plan__result-title">
                📅 Personalized Study Plan
              </h2>
              <p className="study-plan__result-meta">
                <span>{plan.subject}</span>
                <span>Exam: {plan.examDate}</span>
                <span>{plan.hoursPerDay} hrs/day</span>
                <span>{plan.daysRemaining} days left</span>
                <span>{plan.totalStudyHours} total hrs</span>
              </p>
              <ol className="study-plan__days">
                {plan.days.map((day) => (
                  <li key={day.dayNumber} className="study-plan__day">
                    <span className="study-plan__day-number">
                      {day.dayNumber}
                    </span>
                    <div className="study-plan__day-content">
                      <span className="study-plan__day-label">{day.label}</span>
                      <span className="study-plan__day-text">{day.topic}</span>
                      <span className="study-plan__day-hours">
                        {day.hours} {day.hours === 1 ? 'hour' : 'hours'} planned
                      </span>
                    </div>
                  </li>
                ))}
              </ol>

              <Link to="/quiz">
                <button className="study-plan__quiz-btn">Start Quiz</button>
              </Link>
              
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudyPlan
