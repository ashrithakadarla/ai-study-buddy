import './Home.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";

const features = [
  {
    icon: '📝',
    title: 'Smart Quizzes',
    description:
      'Turn your notes into personalized quizzes instantly. AI generates questions that match your material and learning goals.',
  },
  {
    icon: '🎯',
    title: 'Adaptive Learning',
    description:
      'Difficulty adjusts as you go. Focus on what you struggle with and skip what you already know.',
  },
  {
    icon: '📊',
    title: 'Progress Insights',
    description:
      'Track streaks, scores, and weak topics at a glance. See exactly where to spend your study time.',
  },
  {
    icon: '💬',
    title: 'AI Study Chat',
    description:
      'Ask follow-up questions, get clear explanations, and explore concepts without leaving your session.',
  },
]

function Home() {
  const [backendMessage, setBackendMessage] = useState("");
useEffect(() => {
  fetch("http://127.0.0.1:5000/")
    .then((response) => response.json())
    .then((data) => {
      setBackendMessage(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}, []);
  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header__inner">
          <Link to="/" className="home-logo">
            <span className="home-logo__mark" aria-hidden="true">
              ✦
            </span>
            LearnMate AI – An Adaptive Tutor for Personalized Exam Preparation
          </Link>
          <nav className="home-nav" aria-label="Main">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__content">
          <p className="hero__eyebrow">Your personal learning companion</p>
          <h1 className="hero__title">
            Study smarter with <span className="hero__highlight">AI</span> by
            your side
          </h1>
          <p className="hero__subtitle">
            Generate quizzes from your notes, get instant feedback, and build
            lasting knowledge — all in one focused workspace built for students.
          </p>
          <div className="hero__actions">
            <Link to="/study-plan" className="btn btn--primary">
              Get started
            </Link>
            <a href="#features" className="btn btn--secondary">
              See features
            </a>
            <p>Backend Status: {backendMessage}</p>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero-card hero-card--back">
            <span className="hero-card__label">Quiz score</span>
            <strong>92%</strong>
          </div>
          <div className="hero-card hero-card--front">
            <span className="hero-card__label">Today&apos;s focus</span>
            <p>Cell biology · Chapter 4</p>
            <div className="hero-card__progress">
              <span style={{ width: '68%' }} />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="features__header">
          <h2>Everything you need to learn better</h2>
          <p>
            Four powerful tools that work together so you spend less time
            guessing and more time mastering your subjects.
          </p>
        </div>
        <div className="features__grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="cta">
        <h2>Ready to ace your next exam?</h2>
        <p>Upload your material, take a quiz, and let AI guide the rest.</p>
        <Link to="/study-plan" className="btn btn--primary">
          Start studying free
        </Link>
      </section>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} AI Study Buddy</p>
      </footer>
    </div>
  )
}

export default Home
