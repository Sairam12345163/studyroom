import { useState } from "react";
import API from "../utils/axios";

const AIQuiz = ({ courseTitle, category, level }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setQuiz(null);
    setError(null);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelected(null);
    setShowExplanation(false);

    try {
      const { data } = await API.post("/ai/quiz", {
        courseTitle,
        category,
        level,
      });

      if (data.quiz) {
        setQuiz(data.quiz);
      } else {
        setError("Unable to generate quiz. Please try again.");
      }
    } catch (error) {
      setError("Unable to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    setAnswers((prev) => [...prev, index]);
  };

  const handleNext = () => {
    if (currentQ + 1 < quiz.questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const getScore = () =>
    answers.filter((ans, i) => ans === quiz.questions[i].correctAnswer).length;

  const getScoreLabel = (score, total) => {
    const pct = (score / total) * 100;
    if (pct === 100) return { label: "Perfect!", color: "text-emerald-600" };
    if (pct >= 80) return { label: "Excellent", color: "text-emerald-600" };
    if (pct >= 60) return { label: "Good work", color: "text-amber-600" };
    return { label: "Keep practicing", color: "text-red-500" };
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">AI Quiz Generator</h2>
          <p className="text-sm text-slate-500">
            Test your knowledge with AI-generated questions
          </p>
        </div>
      </div>

      <div className="p-6">

        {/* Generate Button */}
        {!quiz && !loading && !error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Ready to test your knowledge?
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              AI will generate 5 personalized questions based on{" "}
              <span className="font-medium text-slate-700">{courseTitle}</span>
            </p>
            <button
              onClick={generateQuiz}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors"
            >
              Generate Quiz
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 text-sm text-red-600">
              {error}
            </div>
            <button
              onClick={generateQuiz}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium text-sm">
              AI is generating your quiz...
            </p>
            <p className="text-slate-400 text-xs mt-1">This takes a few seconds</p>
          </div>
        )}

        {/* Quiz */}
        {quiz && !showResult && (
          <div>
            {/* Progress */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-slate-500">
                Question {currentQ + 1} of {quiz.questions.length}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {Math.round((currentQ / quiz.questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
              <div
                className="bg-slate-900 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(currentQ / quiz.questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question */}
            <p className="font-semibold text-slate-900 mb-5 leading-relaxed">
              {quiz.questions[currentQ].question}
            </p>

            {/* Options */}
            <div className="space-y-3 mb-5">
              {quiz.questions[currentQ].options.map((option, i) => {
                const isCorrect = i === quiz.questions[currentQ].correctAnswer;
                const isSelected = selected === i;

                let style = "border-gray-200 bg-white hover:border-slate-300 hover:bg-slate-50 cursor-pointer";
                if (selected !== null) {
                  if (isCorrect) style = "border-emerald-500 bg-emerald-50 cursor-default";
                  else if (isSelected) style = "border-red-400 bg-red-50 cursor-default";
                  else style = "border-gray-100 bg-gray-50 opacity-50 cursor-default";
                }

                return (
                  <div
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`border-2 rounded-xl p-4 transition-all duration-150 flex items-center gap-3 ${style}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      selected !== null && isCorrect
                        ? "bg-emerald-500 text-white"
                        : selected !== null && isSelected && !isCorrect
                          ? "bg-red-400 text-white"
                          : "bg-slate-100 text-slate-600"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm text-slate-700 font-medium">{option}</span>
                    {selected !== null && isCorrect && (
                      <svg className="w-5 h-5 text-emerald-500 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {selected !== null && isSelected && !isCorrect && (
                      <svg className="w-5 h-5 text-red-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`rounded-xl p-4 mb-5 text-sm ${
                selected === quiz.questions[currentQ].correctAnswer
                  ? "bg-emerald-50 border border-emerald-100 text-emerald-800"
                  : "bg-red-50 border border-red-100 text-red-800"
              }`}>
                <span className="font-semibold">
                  {selected === quiz.questions[currentQ].correctAnswer
                    ? "Correct! "
                    : "Incorrect. "}
                </span>
                {quiz.questions[currentQ].explanation}
              </div>
            )}

            {/* Next */}
            {selected !== null && (
              <button
                onClick={handleNext}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors"
              >
                {currentQ + 1 < quiz.questions.length
                  ? "Next Question →"
                  : "View Results"}
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {showResult && quiz && (() => {
          const score = getScore();
          const { label, color } = getScoreLabel(score, quiz.questions.length);
          return (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className={`text-3xl font-bold ${color}`}>
                  {score}/{quiz.questions.length}
                </span>
              </div>
              <h3 className={`text-xl font-bold mb-1 ${color}`}>{label}</h3>
              <p className="text-slate-500 text-sm mb-6">
                You scored {Math.round((score / quiz.questions.length) * 100)}% on this quiz
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <div className="text-xl font-bold text-emerald-600">{score}</div>
                  <div className="text-xs text-slate-500">Correct</div>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <div className="text-xl font-bold text-red-500">
                    {quiz.questions.length - score}
                  </div>
                  <div className="text-xs text-slate-500">Incorrect</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-xl font-bold text-slate-700">
                    {quiz.questions.length}
                  </div>
                  <div className="text-xs text-slate-500">Total</div>
                </div>
              </div>

              <button
                onClick={generateQuiz}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors"
              >
                Generate New Quiz
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default AIQuiz;