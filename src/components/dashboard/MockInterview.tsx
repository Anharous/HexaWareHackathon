import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Play,
  Square,
  RotateCcw,
  MessageSquare,
  Star,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export default function MockInterview() {
  const { user, updateUser } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const interviewQuestions = [
    {
      category: 'General',
      question: "Tell me about yourself and your professional background.",
      tips: "Focus on your relevant experience and skills"
    },
    {
      category: 'Technical',
      question: "How do you approach solving complex technical problems?",
      tips: "Describe your problem‑solving methodology"
    },
    {
      category: 'Behavioral',
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      tips: "Use the STAR method (Situation, Task, Action, Result)"
    },
    {
      category: 'Leadership',
      question: "How do you handle working with difficult team members?",
      tips: "Show emotional intelligence and conflict resolution"
    },
    {
      category: 'Growth',
      question: "Where do you see yourself in 5 years professionally?",
      tips: "Align your goals with the role and company"
    }
  ];

  useEffect(() => {
    if (interviewStarted && videoEnabled) {
      startCamera();
    }
  }, [interviewStarted, videoEnabled]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setCurrentQuestion(0);
    setResponses([]);
    setShowFeedback(false);
  };

  const nextQuestion = () => {
    if (currentResponse.trim()) {
      setResponses([...responses, currentResponse]);
      setCurrentResponse('');
    }
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    setInterviewStarted(false);
    setShowFeedback(true);
    updateUser({
      xp: (user?.xp || 0) + 150,
      level: Math.floor(((user?.xp || 0) + 150) / 1000) + 1
    });
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setShowFeedback(false);
    setCurrentQuestion(0);
    setResponses([]);
    setCurrentResponse('');
  };

  const feedbackData = {
    overallScore: 85,
    confidence: 78,
    clarity: 92,
    technical: 88,
    communication: 85,
    suggestions: [
      "Great technical knowledge demonstrated",
      "Consider providing more specific examples",
      "Excellent communication skills",
      "Work on reducing filler words"
    ]
  };

  const textPrimary = 'text-gray-900 dark:text-white';
  const textSecondary = 'text-gray-600 dark:text-gray-400';
  const cardBg = 'bg-white dark:bg-gray-900';
  const borderColor = 'border-gray-200 dark:border-gray-700';

  if (showFeedback) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className={`text-3xl font-bold ${textPrimary} mb-2`}>Interview Complete!</h2>
          <p className={textSecondary}>Here’s your detailed performance analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-xl border ${borderColor}`}>
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-300 mb-2" />
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{feedbackData.overallScore}%</p>
            <p className="text-blue-700 dark:text-blue-400">Overall Score</p>
          </div>
          <div className={`bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-xl border ${borderColor}`}>
            <Star className="w-8 h-8 text-green-600 dark:text-green-300 mb-2" />
            <p className="text-3xl font-bold text-green-900 dark:text-green-200">{feedbackData.confidence}%</p>
            <p className="text-green-700 dark:text-green-400">Confidence Level</p>
          </div>
          <div className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-6 rounded-xl border ${borderColor}`}>
            <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-300 mb-2" />
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">{feedbackData.clarity}%</p>
            <p className="text-purple-700 dark:text-purple-400">Communication Clarity</p>
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Skills Breakdown</h3>
          <div className="space-y-4">
            {[
              { skill: 'Technical Knowledge', score: feedbackData.technical, color: 'blue' },
              { skill: 'Communication', score: feedbackData.communication, color: 'green' },
              { skill: 'Confidence', score: feedbackData.confidence, color: 'purple' },
              { skill: 'Clarity', score: feedbackData.clarity, color: 'yellow' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium text-gray-700 dark:text-gray-300`}>{item.skill}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.score}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 h-3 rounded-full`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Personalized Feedback</h3>
          <div className="space-y-3">
            {feedbackData.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetInterview}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Another Interview</span>
          </button>
        </div>
      </div>
    );
  }

  if (interviewStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>AI Mock Interview</h2>
              <p className={textSecondary}>
                Question {currentQuestion + 1} of {interviewQuestions.length}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setVideoEnabled(!videoEnabled)}
                className={`p-2 rounded-lg ${videoEnabled ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'}`}
              >
                {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg ${audioEnabled ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'}`}
              >
                {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Interview Progress</span>
              <span>{Math.round(((currentQuestion + 1) / interviewQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / interviewQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                {videoEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500 text-center">
                    <VideoOff className="w-12 h-12 mx-auto mb-2" />
                    <p>Camera is disabled</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } transition-colors`}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {interviewQuestions[currentQuestion].category}
                  </span>
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>
                  {interviewQuestions[currentQuestion].question}
                </h3>
                <p className={textSecondary}>
                  💡 {interviewQuestions[currentQuestion].tips}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Response
                </label>
                <textarea
                  value={currentResponse}
                  onChange={(e) => setCurrentResponse(e.target.value)}
                  placeholder="Type your response here, or use voice recording..."
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                />
              </div>

              <button
                onClick={nextQuestion}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>
                  {currentQuestion < interviewQuestions.length - 1 ? 'Next Question' : 'Complete Interview'}
                </span>
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${textPrimary}`}>AI Mock Interview Arena</h2>
        <p className={textSecondary}>Practice interviews with AI‑powered feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-xl border ${borderColor}`}>
          <Video className="w-8 h-8 text-blue-600 dark:text-blue-300 mb-3" />
          <h3 className={`font-semibold text-blue-900 dark:text-blue-200 mb-2`}>Video Recording</h3>
          <p className="text-blue-700 dark:text-blue-400 text-sm">Practice with camera to improve body language</p>
        </div>
        <div className={`bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-xl border ${borderColor}`}>
          <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-300 mb-3" />
          <h3 className={`font-semibold text-green-900 dark:text-green-200 mb-2`}>AI Feedback</h3>
          <p className="text-green-700 dark:text-green-400 text-sm">Get personalized insights on your performance</p>
        </div>
        <div className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-6 rounded-xl border ${borderColor}`}>
          <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-300 mb-3" />
          <h3 className={`font-semibold text-purple-900 dark:text-purple-200 mb-2`}>Progress Tracking</h3>
          <p className="text-purple-700 dark:text-purple-400 text-sm">Monitor improvement over multiple sessions</p>
        </div>
      </div>

      <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Interview Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {['General', 'Technical', 'Behavioral', 'Leadership', 'Growth'].map((category, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <h4 className={`font-medium text-gray-900 dark:text-gray-200 mb-1`}>{category}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category === 'General' && 'Background & experience'}
                {category === 'Technical' && 'Problem‑solving skills'}
                {category === 'Behavioral' && 'Past experiences'}
                {category === 'Leadership' && 'Team management'}
                {category === 'Growth' && 'Career goals'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white text-center">
        <Video className="w-16 h-16 mx-auto mb-4 text-blue-200" />
        <h3 className="text-2xl font-bold mb-2">Ready for Your Mock Interview?</h3>
        <p className="text-blue-100 mb-6">
          Practice with our AI interviewer and get instant feedback on your performance
        </p>
        <button
          onClick={startInterview}
          className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto font-semibold"
        >
          <Play className="w-5 h-5" />
          <span>Start Mock Interview</span>
        </button>
      </div>
    </div>
  );
}
