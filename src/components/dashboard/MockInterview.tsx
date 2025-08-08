import { useState, useRef, useEffect } from 'react';
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
  CheckCircle,
  AlertTriangle,
  Target,
  Award
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
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  // Question interface
  interface Question {
    id: number;
    category: string;
    question: string;
    tips: string;
    keywords: string[];
  }

  // Extended question pool
  const questionPool: Question[] = [
    // General Questions
    { id: 1, category: 'General', question: "Tell me about yourself and your professional background.", tips: "Focus on your relevant experience and skills", keywords: ['experience', 'background', 'skills', 'professional', 'career'] },
    { id: 2, category: 'General', question: "Why are you interested in this position?", tips: "Connect your goals with the role requirements", keywords: ['motivation', 'interest', 'goals', 'passion', 'fit'] },
    { id: 3, category: 'General', question: "What are your greatest strengths?", tips: "Provide specific examples to support your claims", keywords: ['strengths', 'skills', 'abilities', 'expertise', 'competencies'] },
    { id: 4, category: 'General', question: "What is your biggest weakness?", tips: "Show self-awareness and improvement efforts", keywords: ['weakness', 'improvement', 'development', 'learning', 'growth'] },
    { id: 5, category: 'General', question: "Why are you leaving your current job?", tips: "Stay positive and focus on growth opportunities", keywords: ['change', 'opportunity', 'growth', 'challenge', 'career'] },

    // Technical Questions
    { id: 6, category: 'Technical', question: "How do you approach solving complex technical problems?", tips: "Describe your problem-solving methodology", keywords: ['problem-solving', 'methodology', 'approach', 'analysis', 'solution'] },
    { id: 7, category: 'Technical', question: "Describe a challenging technical project you worked on.", tips: "Use specific technical details and outcomes", keywords: ['technical', 'project', 'challenge', 'implementation', 'results'] },
    { id: 8, category: 'Technical', question: "How do you stay updated with new technologies?", tips: "Show continuous learning and adaptability", keywords: ['learning', 'technology', 'updates', 'research', 'development'] },
    { id: 9, category: 'Technical', question: "Explain a complex technical concept to a non-technical person.", tips: "Demonstrate communication skills and simplification", keywords: ['communication', 'explanation', 'simplification', 'clarity', 'understanding'] },
    { id: 10, category: 'Technical', question: "How do you ensure code quality and maintainability?", tips: "Discuss best practices, testing, and documentation", keywords: ['quality', 'maintainability', 'testing', 'documentation', 'standards'] },

    // Behavioral Questions
    { id: 11, category: 'Behavioral', question: "Describe a time when you had to work under pressure.", tips: "Use the STAR method (Situation, Task, Action, Result)", keywords: ['pressure', 'stress', 'deadline', 'management', 'performance'] },
    { id: 12, category: 'Behavioral', question: "Tell me about a time you failed at something.", tips: "Focus on learning and recovery from failure", keywords: ['failure', 'learning', 'recovery', 'resilience', 'improvement'] },
    { id: 13, category: 'Behavioral', question: "Describe a situation where you had to adapt to change.", tips: "Show flexibility and positive attitude toward change", keywords: ['adaptation', 'change', 'flexibility', 'adjustment', 'resilience'] },
    { id: 14, category: 'Behavioral', question: "Give an example of when you went above and beyond.", tips: "Highlight initiative and dedication", keywords: ['initiative', 'dedication', 'extra', 'commitment', 'excellence'] },
    { id: 15, category: 'Behavioral', question: "Describe a time you had to learn something new quickly.", tips: "Show learning agility and resourcefulness", keywords: ['learning', 'quick', 'adaptation', 'resourcefulness', 'skill'] },

    // Leadership Questions
    { id: 16, category: 'Leadership', question: "How do you handle working with difficult team members?", tips: "Show emotional intelligence and conflict resolution", keywords: ['teamwork', 'conflict', 'resolution', 'communication', 'management'] },
    { id: 17, category: 'Leadership', question: "Describe your leadership style.", tips: "Provide examples of successful leadership", keywords: ['leadership', 'style', 'management', 'influence', 'guidance'] },
    { id: 18, category: 'Leadership', question: "How do you motivate team members?", tips: "Discuss various motivation techniques", keywords: ['motivation', 'team', 'inspiration', 'encouragement', 'support'] },
    { id: 19, category: 'Leadership', question: "Tell me about a time you had to make a difficult decision.", tips: "Show decision-making process and reasoning", keywords: ['decision', 'difficult', 'process', 'reasoning', 'outcome'] },
    { id: 20, category: 'Leadership', question: "How do you handle disagreements within your team?", tips: "Demonstrate mediation and communication skills", keywords: ['disagreement', 'mediation', 'communication', 'resolution', 'teamwork'] },

    // Growth Questions
    { id: 21, category: 'Growth', question: "Where do you see yourself in 5 years?", tips: "Align your goals with the role and company", keywords: ['goals', 'future', 'career', 'growth', 'ambition'] },
    { id: 22, category: 'Growth', question: "What motivates you in your work?", tips: "Show intrinsic motivation and passion", keywords: ['motivation', 'passion', 'drive', 'purpose', 'satisfaction'] },
    { id: 23, category: 'Growth', question: "How do you handle constructive criticism?", tips: "Show openness to feedback and improvement", keywords: ['feedback', 'criticism', 'improvement', 'learning', 'growth'] },
    { id: 24, category: 'Growth', question: "What are your salary expectations?", tips: "Research market rates and be flexible", keywords: ['salary', 'compensation', 'expectations', 'value', 'negotiation'] },
    { id: 25, category: 'Growth', question: "What questions do you have for us?", tips: "Ask thoughtful questions about the role and company", keywords: ['questions', 'curiosity', 'interest', 'research', 'engagement'] },

    // Communication Questions
    { id: 26, category: 'Communication', question: "Describe a time you had to present to a large audience.", tips: "Highlight presentation and public speaking skills", keywords: ['presentation', 'audience', 'communication', 'speaking', 'confidence'] },
    { id: 27, category: 'Communication', question: "How do you handle miscommunication in the workplace?", tips: "Show problem-solving and clarification skills", keywords: ['miscommunication', 'clarification', 'resolution', 'understanding', 'clarity'] },
    { id: 28, category: 'Communication', question: "Give an example of when you had to explain something complex.", tips: "Demonstrate ability to break down complex ideas", keywords: ['explanation', 'complex', 'simplification', 'clarity', 'understanding'] },

    // Problem-Solving Questions
    { id: 29, category: 'Problem-Solving', question: "Describe your approach to debugging a complex issue.", tips: "Show systematic problem-solving methodology", keywords: ['debugging', 'systematic', 'methodology', 'analysis', 'solution'] },
    { id: 30, category: 'Problem-Solving', question: "How do you prioritize tasks when everything seems urgent?", tips: "Demonstrate time management and prioritization", keywords: ['prioritization', 'time management', 'urgency', 'organization', 'efficiency'] }
  ];

  // Dynamic feedback analysis function
  const analyzeResponses = (responses: string[], questions: Question[]) => {
    const analysis = {
      overallScore: 0,
      confidence: 0,
      clarity: 0,
      technical: 0,
      communication: 0,
      completeness: 0,
      suggestions: [] as string[]
    };

    let totalWords = 0;
    let totalKeywordMatches = 0;
    let totalExpectedKeywords = 0;
    let technicalQuestionCount = 0;
    let technicalScore = 0;

    responses.forEach((response, index) => {
      const question = questions[index];
      const words = response.toLowerCase().split(/\s+/).filter(word => word.length > 2);
      totalWords += words.length;

      // Keyword matching for relevance
      const keywordMatches = question.keywords.filter((keyword: string) => 
        response.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      totalKeywordMatches += keywordMatches;
      totalExpectedKeywords += question.keywords.length;

      // Technical question analysis
      if (question.category === 'Technical' || question.category === 'Problem-Solving') {
        technicalQuestionCount++;
        const technicalWords = ['implement', 'algorithm', 'solution', 'design', 'architecture', 'optimize', 'debug', 'test'];
        const techWordCount = technicalWords.filter((word: string) => 
          response.toLowerCase().includes(word)
        ).length;
        technicalScore += Math.min(100, (techWordCount / technicalWords.length) * 100 + (words.length > 30 ? 20 : 0));
      }
    });

    // Calculate scores
    const avgWordsPerResponse = totalWords / responses.length;
    const keywordRelevance = (totalKeywordMatches / totalExpectedKeywords) * 100;

    // Completeness based on response length
    analysis.completeness = Math.min(100, (avgWordsPerResponse / 50) * 100);
    
    // Clarity based on word count and structure
    analysis.clarity = Math.min(100, 
      (avgWordsPerResponse > 20 ? 80 : avgWordsPerResponse * 4) +
      (responses.every(r => r.includes('.')) ? 10 : 0) +
      (keywordRelevance > 30 ? 10 : 0)
    );

    // Confidence based on response length and assertive language
    const assertiveWords = ['achieved', 'led', 'created', 'improved', 'solved', 'managed', 'developed'];
    let assertiveWordCount = 0;
    responses.forEach((response: string) => {
      assertiveWordCount += assertiveWords.filter((word: string) => 
        response.toLowerCase().includes(word)
      ).length;
    });
    analysis.confidence = Math.min(100, 
      (assertiveWordCount * 10) + 
      (analysis.completeness > 60 ? 20 : 0) +
      (keywordRelevance > 40 ? 20 : 0)
    );

    // Technical score
    analysis.technical = technicalQuestionCount > 0 ? technicalScore / technicalQuestionCount : 75;

    // Communication score
    analysis.communication = Math.min(100,
      (analysis.clarity * 0.4) + 
      (analysis.completeness * 0.3) + 
      (keywordRelevance * 0.3)
    );

    // Overall score
    analysis.overallScore = Math.round(
      (analysis.completeness * 0.25) +
      (analysis.clarity * 0.25) +
      (analysis.confidence * 0.2) +
      (analysis.technical * 0.15) +
      (analysis.communication * 0.15)
    );

    // Generate dynamic suggestions
    if (analysis.completeness < 60) {
      analysis.suggestions.push("Provide more detailed responses with specific examples");
    }
    if (analysis.clarity < 70) {
      analysis.suggestions.push("Structure your answers more clearly with better flow");
    }
    if (analysis.confidence < 70) {
      analysis.suggestions.push("Use more assertive language and highlight your achievements");
    }
    if (analysis.technical < 75 && technicalQuestionCount > 0) {
      analysis.suggestions.push("Include more technical details and methodology in technical answers");
    }
    if (keywordRelevance < 40) {
      analysis.suggestions.push("Ensure your answers directly address the question asked");
    }
    if (avgWordsPerResponse < 30) {
      analysis.suggestions.push("Expand your answers with more context and examples");
    }
    if (analysis.overallScore > 85) {
      analysis.suggestions.push("Excellent performance! Continue practicing to maintain consistency");
    }

    return analysis;
  };

  // Function to select random questions avoiding recent ones
  const selectRandomQuestions = (): Question[] => {
    const availableQuestions = questionPool.filter((q: Question) => !usedQuestionIds.includes(q.id));
    
    // If we've used too many questions, reset but keep the last 10
    if (availableQuestions.length < 6) {
      const recentQuestions = usedQuestionIds.slice(-10);
      const resetAvailable = questionPool.filter((q: Question) => !recentQuestions.includes(q.id));
      setUsedQuestionIds(recentQuestions);
      return resetAvailable.sort(() => 0.5 - Math.random()).slice(0, 6);
    }
    
    return availableQuestions.sort(() => 0.5 - Math.random()).slice(0, 6);
  };

  useEffect(() => {
    if (interviewStarted && videoEnabled) {
      startCamera();
    }
  }, [interviewStarted, videoEnabled]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoURL(url);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      console.log("📹 Recording started");

    } catch (err) {
      console.error("❌ Error accessing camera or microphone:", err);
    }
  };

  const stopCamera = () => {
    console.log("🛑 stopCamera() triggered");

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;

      if (stream && stream.getTracks) {
        const tracks = stream.getTracks();
        console.log("📷 Tracks before stop:", tracks.map(t => `${t.kind}: ${t.readyState}`));
        tracks.forEach((track) => {
          track.stop();
        });

        console.log("📷 Tracks after stop:", stream.getTracks().map(t => `${t.kind}: ${t.readyState}`));
      }

      videoRef.current.srcObject = null;
      console.log("🎥 videoRef srcObject cleared");
    }

    streamRef.current = null;
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
    } else if (streamRef.current) {
      if (!interviewCompleted) 
        startCamera();
    }

    setIsRecording(!isRecording);
  };

  const startInterview = () => {
    const questions = selectRandomQuestions();
    setSelectedQuestions(questions);
    setUsedQuestionIds((prev: number[]) => [...prev, ...questions.map((q: Question) => q.id)]);
    setInterviewStarted(true);
    setCurrentQuestion(0);
    setResponses([]);
    setShowFeedback(false);
    setInterviewCompleted(false);
  };

  const nextQuestion = () => {
    if (currentResponse.trim()) {
      setResponses([...responses, currentResponse]);
      setCurrentResponse('');
    }
    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    stopCamera(); 
    setInterviewStarted(false);
    setShowFeedback(true);
    setInterviewCompleted(true);
    updateUser({
      xp: (user?.xp || 0) + 150,
      level: Math.floor(((user?.xp || 0) + 150) / 1000) + 1
    });
  };

  const resetInterview = () => {
    stopCamera(); 
    setInterviewStarted(false);
    setShowFeedback(false);
    setCurrentQuestion(0);
    setResponses([]);
    setCurrentResponse('');
    setInterviewCompleted(false);
    setSelectedQuestions([]);
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => {
      const newVal = !prev;
      if (!newVal) {
        stopCamera();
      } else if (interviewStarted) {
        startCamera();
      }
      return newVal;
    });
  };

  const handleNextOrComplete = async () => {
    const updatedResponses = currentResponse.trim() ? [...responses, currentResponse] : responses;
    
    if (currentQuestion < selectedQuestions.length - 1) {
      nextQuestion();
    } else {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      
      setResponses(updatedResponses);
      setInterviewCompleted(true);
      completeInterview();
    }
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => {
      const newVal = !prev;
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => {
          track.enabled = newVal;
        });
      }
      return newVal;
    });
  };

  useEffect(() => {
    if (interviewCompleted) {
      console.log("🎤 Interview completed. Stopping camera & recording...");
      stopCamera(); 
    }
  }, [interviewCompleted]);

  useEffect(() => {
    return () => {
      console.log("🧼 Component unmounting, cleaning up camera");
      stopCamera();
    };
  }, []);

  // Dynamic feedback calculation
  const feedbackData = responses.length > 0 ? analyzeResponses(responses, selectedQuestions) : {
    overallScore: 0,
    confidence: 0,
    clarity: 0,
    technical: 0,
    communication: 0,
    completeness: 0,
    suggestions: []
  };

  const textPrimary = 'text-gray-900 dark:text-white';
  const textSecondary = 'text-gray-600 dark:text-gray-400';
  const cardBg = 'bg-white dark:bg-gray-900';
  const borderColor = 'border-gray-200 dark:border-gray-700';

  if (showFeedback) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 ${feedbackData.overallScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : feedbackData.overallScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-pink-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {feedbackData.overallScore >= 80 ? <Award className="w-10 h-10 text-white" /> : 
             feedbackData.overallScore >= 60 ? <Target className="w-10 h-10 text-white" /> : 
             <AlertTriangle className="w-10 h-10 text-white" />}
          </div>
          <h2 className={`text-3xl font-bold ${textPrimary} mb-2`}>Interview Complete!</h2>
          <p className={textSecondary}>Here's your personalized performance analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-xl border ${borderColor}`}>
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-300 mb-2" />
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{Math.round(feedbackData.overallScore)}%</p>
            <p className="text-blue-700 dark:text-blue-400">Overall Score</p>
          </div>
          <div className={`bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-xl border ${borderColor}`}>
            <Star className="w-8 h-8 text-green-600 dark:text-green-300 mb-2" />
            <p className="text-3xl font-bold text-green-900 dark:text-green-200">{Math.round(feedbackData.confidence)}%</p>
            <p className="text-green-700 dark:text-green-400">Confidence Level</p>
          </div>
          <div className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-6 rounded-xl border ${borderColor}`}>
            <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-300 mb-2" />
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">{Math.round(feedbackData.clarity)}%</p>
            <p className="text-purple-700 dark:text-purple-400">Communication Clarity</p>
          </div>
        </div>
        
        <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Detailed Skills Analysis</h3>
          <div className="space-y-4">
            {[
              { skill: 'Response Completeness', score: feedbackData.completeness, color: 'blue' },
              { skill: 'Technical Knowledge', score: feedbackData.technical, color: 'green' },
              { skill: 'Communication Skills', score: feedbackData.communication, color: 'purple' },
              { skill: 'Confidence Level', score: feedbackData.confidence, color: 'yellow' },
              { skill: 'Clarity & Structure', score: feedbackData.clarity, color: 'pink' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium text-gray-700 dark:text-gray-300`}>{item.skill}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(item.score)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 h-3 rounded-full transition-all duration-1000`}
                    style={{ width: `${Math.round(item.score)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Personalized Recommendations</h3>
          <div className="space-y-3">
            {feedbackData.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">{suggestion}</p>
              </div>
            ))}
          </div>
          
          {responses.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className={`font-medium ${textPrimary} mb-3`}>Response Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Questions Answered:</span>
                  <span className={`ml-2 font-medium ${textPrimary}`}>{responses.length}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Avg Response Length:</span>
                  <span className={`ml-2 font-medium ${textPrimary}`}>
                    {Math.round(responses.reduce((sum, r) => sum + r.split(' ').length, 0) / responses.length)} words
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center flex justify-center gap-5">
          <button
            onClick={resetInterview}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Another Interview</span>
          </button>
          {recordedVideoURL && (
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = recordedVideoURL;
                a.download = "mock_interview.webm";
                a.click();
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center space-x-2"
            >
              <Video className="w-5 h-5" />
              <span>Download Recording</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (interviewStarted && selectedQuestions.length > 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-6`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>AI Mock Interview</h2>
              <p className={textSecondary}>
                Question {currentQuestion + 1} of {selectedQuestions.length}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleVideo}
                className={`p-2 rounded-lg ${videoEnabled ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'}`}
              >
                {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleAudio}
                className={`p-2 rounded-lg ${audioEnabled ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'}`}
              >
                {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Interview Progress</span>
              <span>{Math.round(((currentQuestion + 1) / selectedQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / selectedQuestions.length) * 100}%` }}
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
                   onClick={handleRecordingToggle}
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
                    {selectedQuestions[currentQuestion].category}
                  </span>
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>
                  {selectedQuestions[currentQuestion].question}
                </h3>
                <p className={textSecondary}>
                  💡 {selectedQuestions[currentQuestion].tips}
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
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Word count: {currentResponse.split(/\s+/).filter(word => word.length > 0).length}
                </div>
              </div>

              <button
                onClick={handleNextOrComplete}
                disabled={!currentResponse.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                <span>
                  {currentQuestion < selectedQuestions.length - 1 ? 'Next Question' : 'Complete Interview'}
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
        <p className={textSecondary}>Practice interviews with AI-powered feedback and dynamic question selection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-xl border ${borderColor}`}>
          <Video className="w-8 h-8 text-blue-600 dark:text-blue-300 mb-3" />
          <h3 className={`font-semibold text-blue-900 dark:text-blue-200 mb-2`}>Smart Question Pool</h3>
          <p className="text-blue-700 dark:text-blue-400 text-sm">30+ questions with intelligent randomization</p>
        </div>
        <div className={`bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-xl border ${borderColor}`}>
          <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-300 mb-3" />
          <h3 className={`font-semibold text-green-900 dark:text-green-200 mb-2`}>Dynamic Analysis</h3>
          <p className="text-green-700 dark:text-green-400 text-sm">Real-time feedback based on your responses</p>
        </div>
        <div className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-6 rounded-xl border ${borderColor}`}>
          <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-300 mb-3" />
          <h3 className={`font-semibold text-purple-900 dark:text-purple-200 mb-2`}>Performance Tracking</h3>
          <p className="text-purple-700 dark:text-purple-400 text-sm">Detailed analytics and improvement suggestions</p>
        </div>
      </div>

      <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Available Question Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { category: 'General', count: questionPool.filter(q => q.category === 'General').length, color: 'blue' },
            { category: 'Technical', count: questionPool.filter(q => q.category === 'Technical').length, color: 'green' },
            { category: 'Behavioral', count: questionPool.filter(q => q.category === 'Behavioral').length, color: 'purple' },
            { category: 'Leadership', count: questionPool.filter(q => q.category === 'Leadership').length, color: 'yellow' },
            { category: 'Growth', count: questionPool.filter(q => q.category === 'Growth').length, color: 'blue' },
            { category: 'Communication', count: questionPool.filter(q => q.category === 'Communication').length, color: 'green' },
            { category: 'Problem-Solving', count: questionPool.filter(q => q.category === 'Problem-Solving').length, color: 'red' }
          ].map((item, idx) => (
            <div key={idx} className={`p-4 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 dark:from-${item.color}-900 dark:to-${item.color}-800 rounded-lg text-center border border-${item.color}-200 dark:border-${item.color}-700`}>
              <h4 className={`font-medium text-${item.color}-900 dark:text-${item.color}-200 mb-1`}>{item.category}</h4>
              <p className={`text-sm text-${item.color}-700 dark:text-${item.color}-400`}>
                {item.count} questions available
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
            </div>
            <h4 className={`font-medium ${textPrimary} mb-2`}>Smart Selection</h4>
            <p className={`text-sm ${textSecondary}`}>AI selects 6 unique questions from our pool, avoiding recently asked ones</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 dark:text-green-300 font-bold">2</span>
            </div>
            <h4 className={`font-medium ${textPrimary} mb-2`}>Real-time Analysis</h4>
            <p className={`text-sm ${textSecondary}`}>Your responses are analyzed for completeness, clarity, and relevance</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 dark:text-purple-300 font-bold">3</span>
            </div>
            <h4 className={`font-medium ${textPrimary} mb-2`}>Personalized Feedback</h4>
            <p className={`text-sm ${textSecondary}`}>Get detailed insights and actionable improvement suggestions</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white text-center">
        <div className="flex items-center justify-center mb-4">
          <Star className="w-8 h-8 mr-2 text-blue-200" />
          <Video className="w-12 h-12 text-blue-200" />
          <TrendingUp className="w-8 h-8 ml-2 text-blue-200" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Ready for Your Enhanced Mock Interview?</h3>
        <p className="text-blue-100 mb-2">
          Experience our advanced interview simulation with:
        </p>
        <div className="flex justify-center space-x-8 mb-6 text-sm">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>30+ Dynamic Questions</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>AI-Powered Analysis</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Personalized Feedback</span>
          </div>
        </div>
        <button
          onClick={startInterview}
          className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto font-semibold"
        >
          <Play className="w-5 h-5" />
          <span>Start Enhanced Interview</span>
        </button>
      </div>
    </div>
  );
}