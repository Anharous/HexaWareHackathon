import React, { useState } from 'react';
import axios from 'axios';
import {
  Upload,
  FileText,
  CheckCircle,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AnalysisResult {
  required_skills: string[];
  current_skills: string[];
  missing_skills: string[];
  skill_match: string[];
  skill_categories: {
    name: string;
    color: string;
    skills: string[];
  }[];
  motivation: string;
  desired_role: string;
}

export default function SkillAnalysis() {
  const [showUpload, setShowUpload] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [desiredRole, setDesiredRole] = useState('');

  const handleDownloadReport = () => {
  if (!analysisResult) return;

  const {
    desired_role,
    current_skills,
    required_skills,
    missing_skills,
    skill_match,
    motivation,
    skill_categories
  } = analysisResult;

  const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY?: number } };

  doc.setFontSize(16);
  doc.text("Skill Gap Analysis Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Target Role: ${desired_role}`, 14, 30);
  doc.text(`Match Rate: ${Math.round((skill_match.length / required_skills.length) * 100)}%`, 14, 38);
  const motivationLines = doc.splitTextToSize(`Motivation: ${motivation}`, 180);
  let y = 43;
  motivationLines.forEach((line: string) => {
   doc.text(line, 14, y);
   y += 6;
  });
  const motivationEndY = y-12;

  autoTable(doc, {
    startY: motivationEndY +4,
    head: [['Skill', 'Status']],
    body: required_skills.map(skill => [
      skill,
      skill_match.map(s => s.toLowerCase()).includes(skill.toLowerCase()) ? 'Have' : 'Need'
    ])
  });

  autoTable(doc, {
    startY: (doc.lastAutoTable?.finalY ?? 60) + 10,

    head: [['Top 3 Missing Skills']],
    body: missing_skills.slice(0, 3).map(skill => [skill])
  });

  autoTable(doc, {
    startY: (doc.lastAutoTable?.finalY ?? 60) + 10,
    head: [['Top 3 Strengths']],
    body: skill_match.slice(0, 3).map(skill => [skill])
  });

  doc.save(`Skill_Report_${desired_role.replace(/\s+/g, '_')}.pdf`);
};

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File selected:", file);
    if (!file || !desiredRole) {
      alert("Please upload a file and enter a desired role");
      return;
    }

    setUploadedFile(file);
    setAnalysisComplete(false);

    try {
      // Step 1: Upload resume
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('desiredRole', desiredRole);

      await axios.post('http://localhost:5001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      // Step 2: Analyze based on desired role
      const response = await axios.post<AnalysisResult>(
        'http://localhost:5001/analyze',
        { target_role: desiredRole },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      setAnalysisResult(response.data);
      setAnalysisComplete(true);
      setShowUpload(false);
    } catch (error) {
      console.error('Error analyzing skills:', error);
      alert("Something went wrong during skill analysis. Check backend logs.");
    }
  };

  // ... keep the rest of your component unchanged (it works perfectly) ...



 if (!analysisResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Gap Analysis</h2>
            <p className="text-gray-600 dark:text-gray-300">Discover what skills you need to reach your goals</p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="desired-role" className="block text-lg font-medium text-gray-700 dark:text-gray-200 text-left">
            Desired Role
          </label>
          <input
            type="text"
            id="desired-role"
            value={desiredRole}
            onChange={(e) => setDesiredRole(e.target.value)}
            placeholder="e.g., Frontend Developer"
            className="mt-2 block w-full h-12 text-base pl-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:shadow-lg"
          />
        </div>

        {showUpload && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Your Resume</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload your resume to get a personalized skill analysis and learning recommendations
              </p>

              <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-8 hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={!desiredRole}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center space-y-3">
                  <FileText className="w-12 h-12 text-blue-500" />
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
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 dark:text-blue-400 font-medium">{uploadedFile.name}</span>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-blue-600 dark:text-blue-400 text-sm">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const {
    required_skills,
    current_skills,
    missing_skills,
    skill_match,
    skill_categories,
    desired_role,
  } = analysisResult;

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Matching Skills</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{skill_match.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 p-6 rounded-xl border border-red-200 dark:border-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">Skill Gaps</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">{missing_skills.length}</p>
            </div>
            <Target className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Match Rate</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                {Math.round((skill_match.length / required_skills.length) * 100)}%
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Role Analysis */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role Analysis</h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Target Role</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{desired_role}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Readiness Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((skill_match.length / required_skills.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skill_categories.map((category, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className={`text-lg font-semibold mb-4 text-${category.color}-700 dark:text-${category.color}-300`}>
              {category.name} Skills
            </h4>
            <div className="space-y-3">
              {category.skills.map((skill, i) => {
                const hasSkill = current_skills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white font-medium">{skill}</span>
                    {hasSkill ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Have</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <X className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">Need</span>
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
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Priority Skills to Learn</h4>
            <div className="space-y-2">
              {missing_skills.slice(0, 3).map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800 dark:text-blue-300 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-700">
            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Your Strengths</h4>
            <div className="space-y-2">
              {skill_match.slice(0, 3).map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 dark:text-green-300 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleDownloadReport}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
          Download Report
        </button>
      </div>

    </div>
    
  );
}



