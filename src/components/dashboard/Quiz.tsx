import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  Brain,
  Clock,
  CheckCircle,
  X,
  Trophy,
  Target,
  RotateCcw,
  Star
} from 'lucide-react';

export default function Quiz() {
  const { user, updateUser } = useAuth();
  const { quizzes, updateQuizScore } = useData();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQuiz = quizzes.find(q => q.id === selectedQuiz);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleQuizComplete();
    }
  }, [timeLeft, quizStarted, showResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = (quizId: string) => {
    setSelectedQuiz(quizId);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(300);
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (currentQuestion < (currentQuiz?.questions.length || 0) - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        handleQuizComplete(newAnswers);
      }
    }
  };

  const handleQuizComplete = (finalAnswers = answers) => {
    if (!currentQuiz) return;
    
    const correctAnswers = finalAnswers.filter((answer, index) => 
      answer === currentQuiz.questions[index]?.correct
    ).length;
    
    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    const xpGained = Math.max(50, score);
    
    updateQuizScore(currentQuiz.id, score);
    updateUser({ 
      xp: (user?.xp || 0) + xpGained,
      level: Math.floor(((user?.xp || 0) + xpGained) / 1000) + 1
    });
    
    setShowResult(true);
    setQuizStarted(false);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizStarted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

if (selectedQuiz && !showResult) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentQuiz?.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {currentQuiz?.questions.length}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={resetQuiz}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestion + 1) / (currentQuiz?.questions.length || 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / (currentQuiz?.questions.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Question */}
        {currentQuiz?.questions[currentQuestion] && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentQuiz.questions[currentQuestion].question}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuiz.questions[currentQuestion].difficulty)}`}>
                  {currentQuiz.questions[currentQuestion].difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {currentQuiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {selectedAnswer === index && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>
                  {currentQuestion < (currentQuiz?.questions.length || 0) - 1 ? 'Next Question' : 'Complete Quiz'}
                </span>
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

if (showResult && currentQuiz) {
  const correctAnswers = answers.filter((answer, index) => 
    answer === currentQuiz.questions[index]?.correct
  ).length;
  const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
  const xpGained = Math.max(50, score);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
          <p className="text-gray-600 dark:text-gray-400">Great job on completing {currentQuiz.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{score}%</p>
            <p className="text-blue-700 dark:text-blue-400">Final Score</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">{correctAnswers}/{currentQuiz.questions.length}</p>
            <p className="text-green-700 dark:text-green-400">Correct Answers</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">+{xpGained}</p>
            <p className="text-purple-700 dark:text-purple-400">XP Earned</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Another Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}


  return (
  <div className="space-y-6 text-gray-900 dark:text-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Adaptive Quiz Engine</h2>
        <p className="text-gray-600 dark:text-gray-400">Test your knowledge with personalized quizzes</p>
      </div>
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Difficulty adapts to your performance
        </span>
      </div>
    </div>

    {/* Quiz Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
        <Brain className="w-8 h-8 text-blue-600 mb-2" />
        <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{quizzes.length}</p>
        <p className="text-blue-700 dark:text-blue-300 text-sm">Available Quizzes</p>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-xl border border-green-200 dark:border-green-700">
        <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
        <p className="text-2xl font-bold text-green-900 dark:text-green-200">
          {quizzes.filter(q => q.completed).length}
        </p>
        <p className="text-green-700 dark:text-green-300 text-sm">Completed</p>
      </div>
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
        <Target className="w-8 h-8 text-yellow-600 mb-2" />
        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
          {quizzes.filter(q => q.score).reduce((avg, q) => avg + (q.score || 0), 0) / Math.max(quizzes.filter(q => q.score).length, 1)}%
        </p>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">Average Score</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
        <Star className="w-8 h-8 text-purple-600 mb-2" />
        <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{user?.xp || 0}</p>
        <p className="text-purple-700 dark:text-purple-300 text-sm">Total XP</p>
      </div>
    </div>

    {/* Available Quizzes */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{quiz.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4" />
                  <span>{quiz.questions.length} questions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>5 minutes</span>
                </div>
              </div>
            </div>
            {quiz.completed && (
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{quiz.score}%</span>
              </div>
            )}
          </div>

          {/* Question Difficulty Distribution */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Difficulty Distribution:</p>
            <div className="flex space-x-2">
              {['easy', 'medium', 'hard'].map((difficulty) => {
                const count = quiz.questions.filter(q => q.difficulty === difficulty).length;
                if (count === 0) return null;

                return (
                  <span
                    key={difficulty}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}
                  >
                    {count} {difficulty}
                  </span>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => startQuiz(quiz.id)}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
          >
            <Brain className="w-5 h-5" />
            <span>{quiz.completed ? 'Retake Quiz' : 'Start Quiz'}</span>
          </button>
        </div>
      ))}
    </div>
  </div>
);

}