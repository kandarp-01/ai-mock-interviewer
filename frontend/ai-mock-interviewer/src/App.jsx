import { useState } from "react"

function App() {
  const questions = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Why do you want this job?",
  "Where do you see yourself in 5 years?",
  "Tell me about a challenge you faced and how you solved it.",
  "Why should we hire you?",
  "What do you know about our company?",
  "Describe a time you worked in a team.",
]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  const getFeedback = async () => {
    if (answer.trim() === "") {
    setError("Please type your answer first!")
    return
  }
    setError("")
    setLoading(true)
    const response = await fetch("http://127.0.0.1:8000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: questions[currentIndex], answer })
    })
    const data = await response.json()
    setFeedback(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="bg-indigo-500/10 text-indigo-400 text-sm font-medium px-4 py-1 rounded-full border border-indigo-500/20">
            AI Powered
          </span>
          <h1 className="text-4xl font-bold text-white mt-4 mb-2">
            Mock Interviewer
          </h1>
          <p className="text-gray-400">Practice answers and get instant AI feedback</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          <div className="mb-5">
            <label className="block text-gray-300 font-medium mb-2 text-sm">Interview Question</label>
                        {/* Question Card */}
            <div className="mb-5 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <div className="flex justify-between items-center mb-2">
                <span className="text-indigo-400 text-xs font-medium">
                Question {currentIndex + 1} of {questions.length}
                </span>
                <button
                onClick={() => {
                    setCurrentIndex((prev) => (prev + 1) % questions.length)
                    setAnswer("")
                    setFeedback(null)
                }}
                className="text-indigo-400 text-xs hover:text-indigo-300"
                >
                Next Question →
                </button>
            </div>
            <p className="text-white font-medium">{questions[currentIndex]}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2 text-sm">Your Answer</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 h-36 focus:outline-none focus:border-indigo-500 placeholder-gray-500 resize-none"
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            {error && (
                <p className="text-red-400 text-sm mt-2">⚠ {error}</p>
            )}
          </div>

          <button
            onClick={getFeedback}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Analyzing your answer..." : "Get AI Feedback →"}
          </button>

          {feedback && (
            <div className="mt-6 p-5 bg-gray-800 border border-gray-700 rounded-xl">
              <h2 className="text-white font-semibold mb-4">AI Feedback</h2>
              <div className="flex gap-3 mb-4">
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold
                    ${feedback.sentiment === "POSITIVE"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : feedback.sentiment === "TOO SHORT"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                        {feedback.sentiment === "POSITIVE" ? "✓ Positive" :
                        feedback.sentiment === "TOO SHORT" ? "⚠ Too Short" : "✗ Negative"}
                </span>
                <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {feedback.confidence} Confident
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{feedback.feedback}</p>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default App
