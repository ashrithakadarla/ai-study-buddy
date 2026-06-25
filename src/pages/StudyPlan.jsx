import { useState, useEffect } from 'react'
import { fetchStudyPlan } from '../services/studyPlanService'
import { Link, useNavigate } from "react-router-dom";
import './StudyPlan.css'
import ErrorMessage from "../components/ErrorMessage";

function StudyPlan() {
  const [subject, setSubject] = useState('')
  const [examDate, setExamDate] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState('')
  
  // Synchronously initialize plan from sessionStorage to persist during navigation within session
  const [plan, setPlan] = useState(() => {
    const savedPlan = sessionStorage.getItem('activeStudyPlan')
    return savedPlan ? JSON.parse(savedPlan) : null
  })
  
  const [error, setError] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfContent, setPdfContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary] = useState(null)
  const [loadingSummary] = useState(false)
  
  // Initialize fileName from stored active plan if it exists
  const [fileName, setFileName] = useState(() => {
    const savedPlan = sessionStorage.getItem('activeStudyPlan')
    if (savedPlan) {
      const parsed = JSON.parse(savedPlan)
      return parsed.fileName || ''
    }
    return ''
  })

  // Synchronously initialize completedDays from localStorage using active plan details
  const [completedDays, setCompletedDays] = useState(() => {
    const savedPlan = sessionStorage.getItem('activeStudyPlan')
    if (savedPlan) {
      const parsed = JSON.parse(savedPlan)
      const initialPlanId = parsed.fileName || parsed.subject || ''
      if (initialPlanId) {
        const saved = localStorage.getItem(`completedDays-${initialPlanId}`)
        return saved ? JSON.parse(saved) : []
      }
    }
    return []
  })

  // Stable storage key strategy: uses fileName for PDF uploads, or plan subject for standard plans.
  const planId = fileName || plan?.fileName || plan?.subject || '';
  const storageKey = planId ? `completedDays-${planId}` : '';

  const daysLeft = examDate
      ? Math.ceil(
          (new Date(examDate) - new Date()) /
          (1000 * 60 * 60 * 24)
        )
      : 0
  const navigate = useNavigate()

  // Save active study plan to sessionStorage whenever it changes
  useEffect(() => {
    if (plan) {
      sessionStorage.setItem('activeStudyPlan', JSON.stringify(plan))
    } else {
      sessionStorage.removeItem('activeStudyPlan')
    }
  }, [plan])

  // Helper to clear all stale/old plans from localStorage and sessionStorage
  function clearStalePlans() {
    const keysToRemove = [
      'studyPlan-plan',
      'studyPlan-subject',
      'studyPlan-examDate',
      'studyPlan-hoursPerDay',
      'studyPlan-fileName',
      'studyPlan-pdfContent'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem('activeStudyPlan');
  }

  // Save progress (completed days) to localStorage whenever progress or storage key changes
  useEffect(() => {
    if (!storageKey) return;
    
    console.log("Saving progress to:", storageKey);
    localStorage.setItem(
      storageKey,
      JSON.stringify(completedDays)
    );
  }, [completedDays, storageKey]);

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    
    // Clear stale plans and active session storage before generating a new plan
    clearStalePlans()
    
    try {
      if (pdfFile) {
        const pdfResult = await uploadPdf()
        setFileName(pdfResult.filename)
        setPdfContent(pdfResult.content)
      
        const newPlan = {
          ...pdfResult.plan,
          subject,
          examDate,
          hoursPerDay,
          daysLeft: pdfResult.daysLeft,
          fileName: pdfResult.filename // Save fileName in the plan for restoration
        }
        setPlan(newPlan)

        // Load progress for this specific new PDF
        const newStorageKey = `completedDays-${pdfResult.filename}`
        const saved = localStorage.getItem(newStorageKey)
        setCompletedDays(saved ? JSON.parse(saved) : [])
        return
      }  
  
      const result = await fetchStudyPlan({
        subject,
        examDate,
        hoursPerDay: Number(hoursPerDay),
        daysLeft
      })
  
      if (!result.success) {
        setPlan(null)
        setError(result.error)
        return
      }
  
      // Normalize standard plan structure to match PDF plan structure (using `plan` key)
      const normalizedPlan = {
        ...result.plan,
        plan: result.plan.days.map(d => ({
          day: d.dayNumber,
          topic: d.topic,
          goal: d.label
        })),
        daysLeft: result.plan.daysRemaining
      }
      setPlan(normalizedPlan)
      setFileName("") // Clear fileName for standard study plan

      // Load progress for this specific new standard study plan
      const newStorageKey = `completedDays-${result.plan.subject}`
      const saved = localStorage.getItem(newStorageKey)
      setCompletedDays(saved ? JSON.parse(saved) : [])
    }
    finally {
      setLoading(false)
    }
  }

  async function uploadPdf() {

    if (!pdfFile) return null

    const formData = new FormData()

    formData.append("file", pdfFile)
    formData.append("examDate", examDate)

    const response = await fetch(
      "http://127.0.0.1:5000/upload-pdf",
      {
        method: "POST",
        body: formData
      }
    )
    return await response.json()
  }
  
  async function openSummary(day) {

    try {
  
      const response = await fetch(
        `http://127.0.0.1:5000/generate-summary?topic=${encodeURIComponent(day.topic)}&content=${encodeURIComponent(pdfContent)}`
      )
  
      const summaryData = await response.json()

      navigate("/summary", {
        state: {
          topic: day.topic,
          summaryData: summaryData,
          pdfContent
        }
      })
  
    } catch(error) {
      console.error(error)
    }
  }
  function toggleDayComplete(dayNumber) {

    if (completedDays.includes(dayNumber)) {
  
      setCompletedDays(
        completedDays.filter(day => day !== dayNumber)
      )
  
    } else {
  
      setCompletedDays([
        ...completedDays,
        dayNumber
      ])
  
    }
  }
  const totalDays =
    plan?.days?.length ||
    plan?.plan?.length ||
    0

  const progress =
    totalDays > 0
      ? Math.round(
          (completedDays.length / totalDays) * 100
        )
      : 0
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

              <div className="study-plan__field">
                <label htmlFor="pdf">Upload Notes PDF</label>
                <input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                />
              </div>

              <ErrorMessage message={error} />

              <button type="submit" className="study-plan__button" disabled={loading}>
                {loading ? "Generating Study Plan...." : "Generate Plan"}
              </button>
            </form>
          </section>
          
          {pdfContent && (
            <section className="study-plan__card">
              <h2>PDF Content Preview</h2>

              <p>
                {pdfContent.substring(0, 500)}
              </p>
            </section>
          )}

          {!plan && (
            <p>Generate a study plan to get started.</p>
          )}
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
                <span>{plan.daysLeft} days left</span>
              </p>
              <div className="progress-container">
                <div className="progress-header">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`
                    }}
                  />
                </div>
              </div>

              <ol className="study-plan__days">
                {plan.plan?.map((day,index) => (
                  <li
                    key={index}
                    className="study-plan__day"
                    onClick={() => openSummary(day)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="study-plan__day-number">
                      {day.day}
                    </span>
                
                    <div className="study-plan__day-content">
                      <span className="study-plan__day-text">
                        {day.topic}
                      </span>
                  
                      {day.goal && (
                        <span className="study-plan__day-label">
                          🎯 {day.goal}
                        </span>
                      )}
                      <button
                        className="complete-btn"
                        onClick={(e) => {e.stopPropagation();
                          toggleDayComplete(day.day);}
                        }
                      >
                        {completedDays.includes(day.day)
                          ? "✅ Completed"
                          : "Mark Complete"}
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
              {loadingSummary && (
                <p>Generating summary...</p>
              )}

              {summary && (
                <div className="study-plan__card">
                  <h3>📖 Summary</h3>

                  <p>{summary.summary}</p>

                  <h4>💡 Key Points</h4>

                  <ul>
                    {summary.key_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>

                  <h4>🎯 Important Concepts</h4>

                  <ul>
                    {summary.important_concepts.map((concept, index) => (
                      <li key={index}>{concept}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Link to="/quiz" state={{
                subject:plan.subject
              }}>
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
