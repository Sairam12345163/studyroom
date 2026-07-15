import { useState } from "react";
import API from "../utils/axios";

const AIQuiz = ({ courseTitle, category, level }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setQuiz(null);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelected(null);

    try {
      const { data } = await API.post("/ai/quiz", {
        courseTitle,
        category,
        level,
      });
      setQuiz(data.quiz);
    } catch (error) {
      console.error(error);
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

  const getScore = () => {
    return answers.filter(
      (ans, i) => ans === quiz.questions[i].correctAnswer
    ).length;
  };

  const getScoreColor = (score, total) => {
    const percent = (score / total) * 100;
    if (percent >= 80) return "text-green-600";
    if (percent >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-2xl">
            🧠
          </div>
          <div>
            <h2 className="text-white font-extrabold text-xl">
              AI Quiz Generator
            </h2>
            <p className="text-orange-100 text-sm">
              Test your knowledge with AI-generated questions
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Generate Button */}
        {!quiz && !loading && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Ready to test your knowledge?
            </h3>
            <p className="text-gray-500 mb-6">
              AI will generate 5 personalized questions based on{" "}
              <span className="font-semibold text-purple-600">
                {courseTitle}
              </span>
            </p>
            <button
              onClick={generateQuiz}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Generate Quiz with AI 🤖
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              AI is generating your quiz... 🤖
            </p>
            <p className="text-gray-400 text-sm mt-1">
              This takes a few seconds
            </p>
          </div>
        )}

        {/* Quiz Questions */}
        {quiz && !showResult && (
          <div>
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQ + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm font-medium text-purple-600">
                {Math.round(((currentQ) / quiz.questions.length) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(currentQ / quiz.questions.length) * 100}%`,
                }}
              ></div>
            </div>

            {/* Question */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-5">
              <p className="font-bold text-gray-800 text-lg leading-relaxed">
                {quiz.questions[currentQ].question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-5">
              {quiz.questions[currentQ].options.map((option, i) => {
                const isCorrect =
                  i === quiz.questions[currentQ].correctAnswer;
                const isSelected = selected === i;

                let optionStyle =
                  "border-2 border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 cursor-pointer";

                if (selected !== null) {
                  if (isCorrect) {
                    optionStyle = "border-2 border-green-500 bg-green-50";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-2 border-red-500 bg-red-50";
                  } else {
                    optionStyle = "border-2 border-gray-200 bg-gray-50 opacity-60";
                  }
                }

                return (
                  <div
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`${optionStyle} rounded-xl p-4 transition-all duration-200 flex items-center gap-3`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      selected !== null && isCorrect
                        ? "bg-green-500 text-white"
                        : selected !== null && isSelected && !isCorrect
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-600"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-gray-800 font-medium">{option}</span>
                    {selected !== null && isCorrect && (
                      <span className="ml-auto text-green-500 text-xl">✅</span>
                    )}
                    {selected !== null && isSelected && !isCorrect && (
                      <span className="ml-auto text-red-500 text-xl">❌</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`rounded-xl p-4 mb-4 ${
                selected === quiz.questions[currentQ].correctAnswer
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}>
                <p className="font-bold mb-1 text-sm">
                  {selected === quiz.questions[currentQ].correctAnswer
                    ? "✅ Correct!"
                    : "❌ Incorrect!"}
                </p>
                <p className="text-sm text-gray-700">
                  {quiz.questions[currentQ].explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {selected !== null && (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
              >
                {currentQ + 1 < quiz.questions.length
                  ? "Next Question →"
                  : "See Results 🏆"}
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {showResult && quiz && (
          <div className="text-center py-6">
            <div className="text-7xl mb-4">
              {getScore() === quiz.questions.length
                ? "🏆"
                : getScore() >= quiz.questions.length * 0.6
                  ? "🎉"
                  : "📚"}
            </div>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
              Quiz Complete!
            </h3>
            <div className={`text-5xl font-extrabold mb-2 ${getScoreColor(getScore(), quiz.questions.length)}`}>
              {getScore()}/{quiz.questions.length}
            </div>
            <p className="text-gray-500 mb-2">
              {Math.round((getScore() / quiz.questions.length) * 100)}% Score
            </p>
            <p className="text-gray-600 mb-6 font-medium">
              {getScore() === quiz.questions.length
                ? "Perfect score! You're a master! 🌟"
                : getScore() >= quiz.questions.length * 0.8
                  ? "Excellent work! Almost perfect! 🎯"
                  : getScore() >= quiz.questions.length * 0.6
                    ? "Good job! Keep practicing! 💪"
                    : "Keep learning and try again! 📚"}
            </p>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-green-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-green-600">
                  {getScore()}
                </div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-red-600">
                  {quiz.questions.length - getScore()}
                </div>
                <div className="text-xs text-gray-500">Wrong</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-purple-600">
                  {quiz.questions.length}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>

            <button
              onClick={generateQuiz}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Try New Quiz 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQuiz;