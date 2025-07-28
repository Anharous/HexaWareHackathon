import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Upload, FileText, Target, TrendingUp, CheckCircle, X } from 'lucide-react';

export default function SkillAnalysis() {
  const { user, updateUser } = useAuth();
  const { skillGaps } = useData();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(!!user?.profileComplete);
  const [showUpload, setShowUpload] = useState(!user?.profileComplete);

  const currentSkills = user?.skills || ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'];
  const desiredRole = user?.desiredRole || 'Senior Full Stack Developer';

  const requiredSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Docker',
    'AWS', 'System Design', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL'
  ];

  const skillMatch = currentSkills.filter(skill =>
    requiredSkills.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  );

  const missingSkills = requiredSkills.filter(skill =>
    !currentSkills.some(current => current.toLowerCase().includes(skill.toLowerCase()))
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setTimeout(() => {
        setAnalysisComplete(true);
        updateUser({ profileComplete: true });
        setShowUpload(false);
      }, 2000);
    }
  };

  const skillCategories = [
    { name: 'Frontend', skills: ['JavaScript', 'TypeScript', 'React'], color: 'blue' },
    { name: 'Backend', skills: ['Node.js', 'Python', 'GraphQL'], color: 'green' },
    { name: 'Database', skills: ['MongoDB', 'PostgreSQL', 'Redis'], color: 'purple' },
    { name: 'DevOps', skills: ['Docker', 'AWS', 'System Design'], color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Gap Analysis</h2>
          <p className="text-gray-600 dark:text-gray-300">Discover what skills you need to reach your goals</p>
        </div>
        {analysisComplete && (
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Update Resume</span>
          </button>
        )}
      </div>

      {showUpload ? (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Your Resume</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Upload your resume to get a personalized skill analysis and learning recommendations
            </p>
            <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-8 hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center space-y-3"
              >
                <FileText className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Drop your resume here or click to upload
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              </label>
            </div>
            {uploadedFile && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  <span className="text-blue-800 dark:text-blue-100 font-medium">{uploadedFile.name}</span>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-300"></div>
                    <span className="text-blue-600 dark:text-blue-200 text-sm">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-800 p-6 rounded-xl border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Matching Skills</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{skillMatch.length}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-300" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900 dark:to-rose-800 p-6 rounded-xl border border-red-200 dark:border-red-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">Skill Gaps</p>
                  <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">{missingSkills.length}</p>
                </div>
                <Target className="w-10 h-10 text-red-600 dark:text-red-300" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-800 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Match Rate</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                    {Math.round((skillMatch.length / requiredSkills.length) * 100)}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          {/* Role Analysis */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role Analysis</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Target Role</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{desiredRole}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Readiness Score</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    {Math.round((skillMatch.length / requiredSkills.length) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skillCategories.map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className={`text-lg font-semibold mb-4 text-${category.color}-700 dark:text-${category.color}-300`}>
                  {category.name} Skills
                </h4>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => {
                    const hasSkill = currentSkills.includes(skill);
                    return (
                      <div key={skillIndex} className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white font-medium">{skill}</span>
                        {hasSkill ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-green-600 dark:text-green-300 font-medium">Have</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <X className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-red-600 dark:text-red-300 font-medium">Need</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommended Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Priority Skills to Learn</h4>
                <div className="space-y-2">
                  {missingSkills.slice(0, 3).map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 dark:text-blue-100 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">Your Strengths</h4>
                <div className="space-y-2">
                  {skillMatch.slice(0, 3).map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 dark:text-green-100 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
