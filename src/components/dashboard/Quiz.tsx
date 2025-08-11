import { useState, useEffect } from 'react';
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
  Star,
  Sparkles,
  Zap,
  Plus
} from 'lucide-react';

// Types for the custom quiz
interface CustomQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
  skill: string;
}

interface CustomQuiz {
  _id: string;
  id: string;
  title: string;
  role: string;
  skills: string[];
  questions: CustomQuestion[];
  timeLimit: number;
  completed: boolean;
  isCustom: boolean;
}

interface CustomQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (quiz: CustomQuiz) => void;
}

// Custom Quiz Generator Modal Component
function CustomQuizModal({ isOpen, onClose, onStartQuiz }: CustomQuizModalProps) {
  const [topic, setTopic] = useState('');
  const [numMcq, setNumMcq] = useState(3);
  const [numMatch, setNumMatch] = useState(2);
  const [token, setToken] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const HUGGINGFACE_MODEL = 'google/flan-t5-base';
  const HF_API_URL = `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`;

  const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const randomDifficulty = (): 'easy' | 'medium' | 'hard' => {
    const levels: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  const generateMCQ = async (topic: string, token: string): Promise<CustomQuestion> => {
    if (token) {
      try {
        const prompt = `Generate a multiple choice question about ${topic}. ` +
          `Provide the question and four options followed by the correct option number. ` +
          `Format: question || option1 || option2 || option3 || option4 || answer_index`;
        
        const response = await fetch(HF_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ inputs: prompt })
        });

        if (response.ok) {
          const data = await response.json();
          const text = Array.isArray(data) ? data[0].generated_text || data[0].generated || '' : (data.generated_text || '');
          const parts = text.split('||').map((part: string) => part.trim());
          
          if (parts.length >= 6) {
            return {
              id: `mcq-${Date.now()}-${Math.random()}`,
              question: parts[0],
              options: parts.slice(1, 5),
              correct: parseInt(parts[5], 10) - 1,
              difficulty: randomDifficulty(),
              skill: topic
            };
          }
        }
      } catch (e) {
        console.warn('Failed to fetch from HF API; falling back to heuristic', e);
      }
    }

    // Fallback heuristic
    try {
      const summaryResp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
      if (summaryResp.ok) {
        const data = await summaryResp.json();
        const extract = data.extract || '';
        let firstSentence = extract.split('. ')[0].trim();
        
        if (firstSentence.length === 0) {
          firstSentence = `What is ${topic}?`;
        } else {
          const regex = new RegExp(topic, 'i');
          firstSentence = firstSentence.replace(regex, '_____');
          if (!firstSentence.endsWith('?')) firstSentence += '?';
        }

        const correctAnswer = extract.split('. ')[0].trim();
        const distractors = [
          `A type of technology related to ${topic.toLowerCase()}`,
          `A concept from ancient history`,
          `An abstract mathematical principle`
        ];
        
        const options = [correctAnswer, ...distractors];
        shuffleArray(options);
        const answerIndex = options.indexOf(correctAnswer);

        return {
          id: `mcq-${Date.now()}-${Math.random()}`,
          question: firstSentence,
          options: options,
          correct: answerIndex,
          difficulty: randomDifficulty(),
          skill: topic
        };
      }
    } catch (err) {
      console.warn('Wikipedia lookup failed; using generic fallback', err);
    }

    // Generic fallback
    const genericQuestion = `Which statement about ${topic} is most accurate?`;
    const correctStatement = `${topic} is an important concept in its respective field of study.`;
    const genericDistractors = [
      `${topic} was invented in the 18th century`,
      `${topic} is primarily used in cooking`,
      `${topic} is a type of musical instrument`
    ];
    
    const opts = [correctStatement, ...genericDistractors];
    shuffleArray(opts);

    return {
      id: `mcq-${Date.now()}-${Math.random()}`,
      question: genericQuestion,
      options: opts,
      correct: opts.indexOf(correctStatement),
      difficulty: randomDifficulty(),
      skill: topic
    };
  };

  const generateMatch = async (topic: string, token: string): Promise<CustomQuestion> => {
    if (token) {
      try {
        const prompt = `Generate three pairs of terms and their definitions about ${topic}. ` +
          `Format: term1 :: definition1 || term2 :: definition2 || term3 :: definition3`;
        
        const resp = await fetch(HF_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ inputs: prompt })
        });

        if (resp.ok) {
          const data = await resp.json();
          const text = Array.isArray(data) ? data[0].generated_text || data[0].generated || '' : (data.generated_text || '');
          const pairsRaw = text.split('||').map((item: string) => item.trim()).filter(Boolean);
          const pairs = pairsRaw.map((pairStr: string) => {
            const [term, def] = pairStr.split('::').map((p: string) => p.trim());
            return { term: term, definition: def };
          });

          if (pairs.length > 0) {
            // Convert matching question to MCQ format for consistency
            const pair = pairs[0];
            return {
              id: `match-${Date.now()}-${Math.random()}`,
              question: `What is the definition of "${pair.term}" in the context of ${topic}?`,
              options: [pair.definition, ...pairs.slice(1).map((p: any) => p.definition), `A completely unrelated concept`],
              correct: 0,
              difficulty: randomDifficulty(),
              skill: topic
            };
          }
        }
      } catch (e) {
        console.warn('HF match generation failed, using fallback', e);
      }
    }

    // Fallback for matching questions converted to MCQ
    const defaultDefinitions: Record<string, string> = {
      machine: 'A device that uses power to perform a particular task.',
      learning: 'The process of acquiring knowledge or skills.',
      data: 'Facts and statistics collected for reference or analysis.',
      algorithm: 'A set of rules to solve a problem in a finite number of steps.',
      model: 'A simplified representation used to explain the workings of a real system.'
    };

    const words = topic.split(/\s+/).map((w: string) => w.toLowerCase());
    const word = words[0] || 'concept';
    const definition = defaultDefinitions[word] || `A fundamental aspect related to ${topic}`;

    return {
      id: `match-${Date.now()}-${Math.random()}`,
      question: `In the context of ${topic}, what does "${word}" typically refer to?`,
      options: [
        definition,
        'A type of ancient artifact',
        'A mathematical formula',
        'A geographical location'
      ],
      correct: 0,
      difficulty: randomDifficulty(),
      skill: topic
    };
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    if (numMcq + numMatch === 0) {
      setError('At least one question is required.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const questions = [];

      // Generate MCQs
      for (let i = 0; i < numMcq; i++) {
        const mcq = await generateMCQ(topic, token);
        questions.push(mcq);
      }

      // Generate Match questions (converted to MCQ format)
      for (let i = 0; i < numMatch; i++) {
        const match = await generateMatch(topic, token);
        questions.push(match);
      }

      const customQuiz = {
        _id: `custom-${Date.now()}`,
        id: `custom-${Date.now()}`,
        title: `Custom Quiz: ${topic}`,
        role: 'general',
        skills: [topic],
        questions: questions,
        timeLimit: Math.max(5, Math.ceil(questions.length * 1.5)),
        completed: false,
        isCustom: true
      };

      onStartQuiz(customQuiz);
      onClose();
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Quiz generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Custom Quiz</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Machine Learning, History, Physics"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                MCQ Questions
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={numMcq}
                onChange={(e) => setNumMcq(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Match Questions
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={numMatch}
                onChange={(e) => setNumMatch(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hugging Face API Token (Optional)
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="hf_..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              For AI-powered questions. Falls back to Wikipedia if not provided.
            </p>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Quiz() {
  const { user, updateUser } = useAuth();
  const { quizzes, updateQuizScore } = useData();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [customQuiz, setCustomQuiz] = useState<CustomQuiz | null>(null);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const currentQuiz = customQuiz || quizzes.find(q => q._id === selectedQuiz);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleQuizComplete();
    }
  }, [timeLeft, quizStarted, showResult]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole ? quiz.role === selectedRole : true;
    const matchesSkill = selectedSkill ? quiz.skills?.includes(selectedSkill) : true;

    return matchesSearch && matchesRole && matchesSkill;
  });

  const startQuiz = (quizId: string): void => {
    const quiz = quizzes.find(q => q._id === quizId);
    if (!quiz) return;
    setSelectedQuiz(quizId);
    setCustomQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    const duration = typeof quiz.timeLimit === 'number' ? quiz.timeLimit : 5;
    setTimeLeft(duration * 60);
    setQuizStarted(true);
  };

  const startCustomQuiz = (quiz: CustomQuiz): void => {
    setCustomQuiz(quiz);
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    const duration = typeof quiz.timeLimit === 'number' ? quiz.timeLimit : 5;
    setTimeLeft(duration * 60);
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number): void => {
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

  const handleQuizComplete = (finalAnswers: number[] = answers): void => {
    if (!currentQuiz) return;

    const correctAnswers = finalAnswers.filter((answer, index) =>
      answer === currentQuiz.questions[index]?.correct
    ).length;

    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    const xpGained = Math.max(50, score);

    if (!('isCustom' in currentQuiz) || !currentQuiz.isCustom) {
      updateQuizScore(currentQuiz._id, score);
    }
    
    updateUser({
      xp: (user?.xp || 0) + xpGained,
      level: Math.floor(((user?.xp || 0) + xpGained) / 1000) + 1
    });

    setShowResult(true);
    setQuizStarted(false);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCustomQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizStarted(false);
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (selectedQuiz || customQuiz) {
    if (!showResult) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentQuiz?.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Question {currentQuestion + 1} of {currentQuiz?.questions.length}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round(
                    ((currentQuestion + 1) / (currentQuiz?.questions.length || 1)) * 100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / (currentQuiz?.questions.length || 1)) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Current Question */}
            {currentQuiz?.questions[currentQuestion] && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {currentQuiz.questions[currentQuestion].question}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getDifficultyColor(
                          currentQuiz.questions[currentQuestion].difficulty
                        )
                      }`}
                    >
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
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {selectedAnswer === index && <CheckCircle className="w-4 h-4" />}
                        </div>
                        <span className="font-medium dark:text-white">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <span>
                      {currentQuestion < (currentQuiz?.questions.length || 0) - 1
                        ? 'Next Question'
                        : 'Complete Quiz'}
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
      const correctAnswers = answers.filter(
        (answer, index) => answer === currentQuiz.questions[index]?.correct
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
              <p className="text-gray-600 dark:text-gray-300">
                Great job on completing {currentQuiz.title}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{score}%</p>
                <p className="text-blue-700 dark:text-blue-300">Final Score</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                  {correctAnswers}/{currentQuiz.questions.length}
                </p>
                <p className="text-green-700 dark:text-green-300">Correct Answers</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg">
                <Star className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">+{xpGained}</p>
                <p className="text-purple-700 dark:text-purple-300">XP Earned</p>
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
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Adaptive Quiz Engine</h2>
          <p className="text-gray-600 dark:text-gray-300">Test your knowledge with personalized quizzes</p>
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <Brain className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{quizzes.length + 1}</p>
          <p className="text-blue-700 text-sm dark:text-blue-300">Available Quizzes</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-900 dark:text-green-200">
            {quizzes.filter(q => q.completed).length}
          </p>
          <p className="text-green-700 text-sm dark:text-green-300">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
          <Target className="w-8 h-8 text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
            {Math.round(quizzes.filter(q => q.score).reduce((avg, q) => avg + (q.score || 0), 0) /
              Math.max(quizzes.filter(q => q.score).length, 1))}%
          </p>
          <p className="text-yellow-700 text-sm dark:text-yellow-300">Average Score</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
          <Star className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{user?.xp || 0}</p>
          <p className="text-purple-700 text-sm dark:text-purple-300">Total XP</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="flex-1 md:max-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">All Roles</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="fullstack">Fullstack</option>
        </select>
        
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="flex-1 md:max-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">All Skills</option>
          <option value="javascript">JavaScript</option>
          <option value="react">React</option>
          <option value="node">Node.js</option>
        </select>
      </div>

      {/* Available Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom Quiz Generator - Always First */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl shadow-sm border-2 border-purple-200 dark:border-purple-700 hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full -mr-10 -mt-10 opacity-20"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                    AI-Powered
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Create Custom Quiz
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Generate personalized quizzes on any topic using AI
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>Instant generation</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>Any difficulty</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Features:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                  Multiple Choice
                </span>
                <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs rounded-full">
                  Match Questions
                </span>
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                  AI Enhanced
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCustomModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Create Quiz</span>
            </button>
          </div>
        </div>

        {/* Existing Quizzes */}
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {quiz.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>{quiz.questions.length} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.timeLimit || 5} minutes</span>
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Difficulty Distribution:
              </p>
              <div className="flex space-x-2">
                {["easy", "medium", "hard"].map((difficulty) => {
                  const count = quiz.questions.filter(
                    (q) => q.difficulty === difficulty
                  ).length;
                  if (count === 0) return null;
                  return (
                    <span
                      key={`${quiz._id}-${difficulty}`}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        difficulty
                      )}`}
                    >
                      {count} {difficulty}
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => startQuiz(quiz._id)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <Brain className="w-5 h-5" />
              <span>{quiz.completed ? "Retake Quiz" : "Start Quiz"}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Custom Quiz Modal */}
      <CustomQuizModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onStartQuiz={startCustomQuiz}
      />
    </div>
  );
}