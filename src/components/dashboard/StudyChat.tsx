import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Bot, Code, MessageCircle, Brain, FileText, Video, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  aiType?: string;
}

interface AIAssistant {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
}

export default function StudyChat() {
  const [selectedAI, setSelectedAI] = useState<AIAssistant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const aiAssistants: AIAssistant[] = [
    {
      id: 'code-reviewer',
      name: 'Code Reviewer',
      description: 'Reviews your code, finds bugs, and suggests improvements',
      icon: <Code className="w-6 h-6" />,
      color: 'bg-green-500',
      placeholder: 'Paste your code here for review...'
    },
    {
      id: 'interview-coach',
      name: 'Interview Coach',
      description: 'Helps you prepare for technical interviews',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-blue-500',
      placeholder: 'Ask me interview questions or share your practice answers...'
    },
    {
      id: 'concept-explainer',
      name: 'Concept Explainer',
      description: 'Explains complex programming concepts in simple terms',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-purple-500',
      placeholder: 'What concept would you like me to explain?'
    },
    {
      id: 'documentation-helper',
      name: 'Doc Helper',
      description: 'Helps create documentation and README files',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-orange-500',
      placeholder: 'Describe your project and I\'ll help document it...'
    },
    {
      id: 'debugging-assistant',
      name: 'Debug Detective',
      description: 'Helps troubleshoot and debug code issues',
      icon: <Bot className="w-6 h-6" />,
      color: 'bg-red-500',
      placeholder: 'Describe the issue you\'re facing...'
    },
    {
      id: 'ui-ux-advisor',
      name: 'UI/UX Advisor',
      description: 'Provides feedback on user interface and experience design',
      icon: <Video className="w-6 h-6" />,
      color: 'bg-pink-500',
      placeholder: 'Describe your UI/UX challenge or share your design...'
    }
  ];

  // Check connection status on mount
  useEffect(() => {
    checkAIHealth();
  }, []);

  useEffect(() => {
    if (aiAssistants.length > 0 && !selectedAI) {
      setSelectedAI(aiAssistants[0]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedAI) {
      setMessages([]);
      setError(null);
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Hello! I'm ${selectedAI.name}. ${selectedAI.description}. How can I help you today?`,
        timestamp: new Date(),
        aiType: selectedAI.id
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedAI]);

  const checkAIHealth = async () => {
    try {
      setConnectionStatus('checking');
      const response = await fetch('http://localhost:4001/api/ai/health');
      const data = await response.json();
      setConnectionStatus(data.healthy ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Health check failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedAI || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    console.log(`[StudyChat] Sending message to ${selectedAI.id}:`, currentInput.substring(0, 100) + '...');

    try {
      const requestBody = {
        message: currentInput,
        aiType: selectedAI.id,
        conversationHistory: messages.slice(-10) // Send last 10 messages for context
      };

      console.log('[StudyChat] Request body:', {
        ...requestBody,
        message: requestBody.message.substring(0, 100) + '...',
        historyCount: requestBody.conversationHistory.length
      });

      const response = await fetch('http://localhost:4001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`[StudyChat] Response status: ${response.status}`);

      const data = await response.json();
      console.log('[StudyChat] Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          aiType: selectedAI.id
        };

        setMessages(prev => [...prev, aiMessage]);
        setConnectionStatus('connected');
        console.log(`[StudyChat] Successfully received response from ${selectedAI.id}`);
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }

    } catch (error) {
      console.error('[StudyChat] Failed to get AI response:', error);
      
      let errorMessage = 'Failed to connect to AI assistant. Please try again.';
      let aiResponseContent = `I apologize, but I'm having trouble connecting right now. Please try again in a moment.`;

      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Connection error. Please check if the server is running.';
          aiResponseContent = 'I cannot connect to the server. Please make sure the backend is running on port 4001.';
          setConnectionStatus('disconnected');
        } else if (error.message.includes('API_KEY')) {
          errorMessage = 'AI service configuration error.';
          aiResponseContent = 'There\'s a configuration issue with the AI service. Please check the API key setup.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'Rate limit reached. Please try again later.';
          aiResponseContent = 'I\'m experiencing high demand right now. Please try again in a few moments.';
        } else {
          errorMessage = error.message;
          aiResponseContent = `Error: ${error.message}. If the problem persists, please check the console for more details.`;
        }
      }

      setError(errorMessage);
      
      // Add error message to chat
      const errorMessage2: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponseContent,
        timestamp: new Date(),
        aiType: selectedAI.id
      };
      setMessages(prev => [...prev, errorMessage2]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    if (selectedAI) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Hello! I'm ${selectedAI.name}. ${selectedAI.description}. How can I help you today?`,
        timestamp: new Date(),
        aiType: selectedAI.id
      };
      setMessages([welcomeMessage]);
      setError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* AI Assistant Sidebar */}
      <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Study AI Assistants</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Choose your learning companion</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className={`text-xs ${
                connectionStatus === 'connected' ? 'text-green-600 dark:text-green-400' :
                connectionStatus === 'disconnected' ? 'text-red-600 dark:text-red-400' :
                'text-yellow-600 dark:text-yellow-400'
              }`}>
                {connectionStatus === 'connected' ? 'Powered by Gemini AI' :
                 connectionStatus === 'disconnected' ? 'AI Offline' : 'Checking...'}
              </span>
            </div>
            <button
              onClick={checkAIHealth}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Check connection"
            >
              {connectionStatus === 'connected' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {aiAssistants.map((ai) => (
            <div
              key={ai.id}
              onClick={() => setSelectedAI(ai)}
              className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedAI?.id === ai.id
                  ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`${ai.color} p-2 rounded-lg text-white`}>
                  {ai.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{ai.name}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{ai.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedAI ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`${selectedAI.color} p-2 rounded-lg text-white`}>
                  {selectedAI.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedAI.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedAI.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
                }`} title={`AI Status: ${connectionStatus}`}></div>
                <button
                  onClick={clearChat}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900 border-b border-red-200 dark:border-red-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex space-x-3 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : selectedAI.color
                  }`}>
                    {message.type === 'user' 
                      ? user?.name?.charAt(0)?.toUpperCase() || 'U'
                      : selectedAI.icon
                    }
                  </div>
                  <div className="flex-1">
                    <div className={`flex items-center space-x-2 mb-1 ${message.type === 'user' ? 'justify-end' : ''}`}>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {message.type === 'user' ? (user?.name || 'You') : selectedAI.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div className={`rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed break-words">{message.content}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-3xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${selectedAI.color} flex-shrink-0`}>
                    {selectedAI.icon}
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{selectedAI.name} is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex space-x-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedAI.placeholder}
                disabled={isLoading || connectionStatus === 'disconnected'}
                rows={1}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 resize-none min-h-[48px] max-h-32"
                style={{ 
                  height: 'auto',
                  minHeight: '48px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || connectionStatus === 'disconnected'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[60px]"
                title={connectionStatus === 'disconnected' ? 'AI is offline' : 'Send message'}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>💡 Tip: Be specific with your questions for better assistance!</span>
              <div className="flex items-center space-x-4">
                <span>Press Enter to send • Shift+Enter for new line</span>
                {connectionStatus === 'disconnected' && (
                  <button
                    onClick={checkAIHealth}
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    Retry Connection
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">Select an AI assistant to start learning</p>
            <p className="text-sm">Choose from our specialized AI tutors on the left</p>
          </div>
        </div>
      )}
    </div>
  );
}