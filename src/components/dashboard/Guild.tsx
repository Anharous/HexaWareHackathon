import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Users, Hash, UserPlus } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Replace with backend URL in production

interface Message {
  _id?: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  messageType: 'text' | 'image' | 'file';
}

interface Guild {
  _id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  members: Array<{ _id: string; name: string; level: number; xp: number }>;
  moderators: Array<{ _id: string; name: string }>;
  messages: Message[];
  lastActivity: string;
}

export default function Guild() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchGuilds();
  }, []);

  useEffect(() => {
    if (selectedGuild) {
      fetchMessages(selectedGuild._id);
      socket.emit('joinGuild', selectedGuild._id);
    }
  }, [selectedGuild]);

  useEffect(() => {
    socket.on('receiveMessage', (newMessage: Message) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchGuilds = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/guilds');
      const data = await res.json();
      setGuilds(data);
      if (data.length > 0 && !selectedGuild) {
        setSelectedGuild(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch guilds:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (guildId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/guilds/${guildId}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedGuild || !user) return;

    try {
      const res = await fetch(`http://localhost:4000/api/guilds/${selectedGuild._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user._id,
          senderName: user.name,
          content: messageInput.trim()
        })
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => [...prev, newMessage]);
        socket.emit('sendMessage', {
          guildId: selectedGuild._id,
          message: newMessage
        });
        setMessageInput('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const joinGuild = async (guildId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:4000/api/guilds/${guildId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });

      if (res.ok) {
        fetchGuilds();
      }
    } catch (error) {
      console.error('Failed to join guild:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUserMember = (guild: Guild) => {
    return guild.members.some(member => member._id === user?._id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guilds</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Connect with fellow learners</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {guilds.map((guild) => (
            <div
              key={guild._id}
              onClick={() => setSelectedGuild(guild)}
              className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedGuild?._id === guild._id
                  ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{guild.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{guild.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{guild.category}</p>
                  </div>
                </div>
                {!isUserMember(guild) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      joinGuild(guild._id);
                    }}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                  >
                    <UserPlus className="w-4 h-4 text-blue-600" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{guild.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{guild.members.length} members</span>
                </div>
                <span>{new Date(guild.lastActivity).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedGuild ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedGuild.icon}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedGuild.name}</h2>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedGuild.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{selectedGuild.members.length}</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {message.senderName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{message.senderName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-lg">
                    <p className="text-gray-900 dark:text-white">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {isUserMember(selectedGuild) ? (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={`Message #${selectedGuild.name}`}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center">
              <button
                onClick={() => joinGuild(selectedGuild._id)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Join Guild to Chat
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Select a guild to start chatting
        </div>
      )}
    </div>
  );
}
