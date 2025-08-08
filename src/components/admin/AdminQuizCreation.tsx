import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipboardEdit, Trash2, User, Brain } from 'lucide-react';

type Question = {
  question: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

type Quiz = {
  _id: string;
  title: string;
  role: string;
  skill: string;
  timeLimit: number;
  questions: Question[];
};

export default function AdminQuizCreation() {
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [skill, setSkill] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correct: 0, difficulty: 'easy' }]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [timeLimit, setTimeLimit] = useState<number>(10); 

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get<Quiz[]>('http://localhost:4001/api/quizzes');
      setQuizzes(res.data);
      console.log("Fetching quizzes after delete/update...");
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct: 0, difficulty: 'easy' }]);
  };

  const handleQuestionChange = (
    i: number,
    field: 'question' | 'options' | 'correct' | 'difficulty',
    value: any
  ) => {
    const updated = [...questions];
    const question = updated[i];

    if (field === 'options') {
      question.options = value;
    } else if (field === 'question') {
      question.question = value;
    } else if (field === 'correct') {
      question.correct = value;
    } else if (field === 'difficulty') {
      question.difficulty = value;
    }

    setQuestions(updated);
  };

  const handleSubmit = async () => {
    const quiz = { title, role, skill, questions, timeLimit };
    try {
      if (editingId) {
        await axios.put(`http://localhost:4001/api/quizzes/${editingId}`, quiz);
        alert('Quiz updated!');
        setEditingId(null);
      } else {
        await axios.post(`http://localhost:4001/api/quizzes`, quiz);
        alert('Quiz created!');
      }
      resetForm();
      fetchQuizzes();
    } catch (err) {
      alert('Error saving quiz');
    }
  };

  const resetForm = () => {
    setTitle('');
    setRole('');
    setSkill('');
    setTimeLimit(10);
    setQuestions([{ question: '', options: ['', '', '', ''], correct: 0, difficulty: 'easy' }]);
  };

  const handleEdit = (quiz: any) => {
    console.log("Editing quiz:", quiz);
    setTitle(quiz.title);
    setRole(quiz.role);
    setSkill(quiz.skill);
    setTimeLimit(quiz.timeLimit || 10);
    setQuestions(quiz.questions);
    setEditingId(quiz._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this quiz?')) {
      try {
        console.log("Deleting quiz with ID:", id);
        await axios.delete(`http://localhost:4001/api/quizzes/${id}`);
        alert("Quiz deleted successfully!");
        fetchQuizzes();
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to delete quiz. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          {editingId ? 'Edit Quiz' : 'Create New Quiz'}
        </h2>

        <div className="grid gap-4 mb-6">
          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            placeholder="Target Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            placeholder="Skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <input
            type="number"
            min={1}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            placeholder="Time Limit (in minutes)"
            value={timeLimit}
            onChange={(e) => setTimeLimit(parseInt(e.target.value))}
           />

        </div>

        {questions.map((q, i) => (
          <div key={i} className="mb-6 border border-gray-200 dark:border-gray-700 p-5 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-white mb-3">Question {i + 1}</h4>

            <input
              className="w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
              placeholder="Question Text"
              value={q.question}
              onChange={(e) => handleQuestionChange(i, 'question', e.target.value)}
            />

            {q.options.map((opt, j) => (
              <input
                key={j}
                className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 dark:text-white"
                placeholder={`Option ${j + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...q.options];
                  newOpts[j] = e.target.value;
                  handleQuestionChange(i, 'options', newOpts);
                }}
              />
            ))}

            <input
              type="number"
              min={0}
              max={3}
              className="w-full mb-3 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 dark:text-white"
              placeholder="Correct Option (0-3)"
              value={q.correct}
              onChange={(e) => handleQuestionChange(i, 'correct', parseInt(e.target.value))}
            />

            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-white"
              value={q.difficulty}
              onChange={(e) => handleQuestionChange(i, 'difficulty', e.target.value)}
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        ))}

        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            onClick={handleAddQuestion}
          >
            + Add Question
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            onClick={handleSubmit}
          >
            {editingId ? 'Update Quiz' : 'Submit Quiz'}
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-bold mt-10 mb-6 text-gray-800 dark:text-white">All Quizzes</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((q) => (
          <div
            key={q._id}
            className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">{q.title}</h4>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              <span><strong>Role:</strong> {q.role}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
              <Brain className="w-4 h-4 mr-2 text-green-500" />
              <span><strong>Skill:</strong> {q.skill}</span>
            </div>

            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-600">
              <button
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-sm font-medium"
                onClick={() => handleEdit(q)}
              >
                <ClipboardEdit className="w-4 h-4" />
                Edit
              </button>
              <button
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 text-sm font-medium"
                onClick={() => handleDelete(q._id)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
