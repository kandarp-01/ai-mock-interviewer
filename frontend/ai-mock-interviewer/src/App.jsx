import { useState } from "react"

function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  const getFeedback = async () => {
    setLoading(true)
    const response = await fetch("http://127.0.0.1:8000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer })
    })
    const data = await response.json()
    setFeedback(data)
    setLoading(false)
  }

  return (
    <div>
      <h1>AI Mock Interviewer</h1>

      <input
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <textarea
        placeholder="Enter your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button onClick={getFeedback}>
        {loading ? "Analyzing..." : "Get Feedback"}
      </button>

      {feedback && (
        <div>
          <p>Sentiment: {feedback.sentiment}</p>
          <p>Confidence: {feedback.confidence}</p>
          <p>Feedback: {feedback.feedback}</p>
        </div>
      )}
    </div>
  )
}

export default App
