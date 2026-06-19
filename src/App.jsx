import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import StudyPlan from './pages/StudyPlan.jsx'
import Quiz from "./pages/Quiz";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/study-plan" element={<StudyPlan />} />
      <Route path="/quiz" element={ <Quiz />} />
    </Routes>
  )
}

export default App
