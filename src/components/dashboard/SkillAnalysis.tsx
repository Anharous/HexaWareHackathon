import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../contexts/DataContext';
import {
  Upload,
  FileText,
  CheckCircle,
  Target,
  TrendingUp,
  X,
  ArrowRight,
  Zap,
  BookOpen,
  ChevronDown
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
  priority_skills?: string[];
}

// Add interface for roles response
interface RolesResponse {
  roles: string[];
}

const POPULAR_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Mobile Developer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Cybersecurity Analys'
];

export default function SkillAnalysis() {
  const { setAnalysisResult, generateRoadmapForRole } = useData();
  const [showUpload, setShowUpload] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [localAnalysisResult, setLocalAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [desiredRole, setDesiredRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>(POPULAR_ROLES);

  // Fetch available roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Specify the response type here
        const response = await axios.get<RolesResponse>('http://localhost:5001/roles');
        setAvailableRoles(response.data.roles);
      } catch (error) {
        console.log('Using default roles due to API error');
        setAvailableRoles(POPULAR_ROLES);
      }
    };
    fetchRoles();
  }, []);

  const handleDownloadReport = () => {
    if (!localAnalysisResult) return;

    const {
      desired_role,
      current_skills,
      required_skills,
      missing_skills,
      skill_match,
      motivation,
      skill_categories,
      priority_skills
    } = localAnalysisResult;

    const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY?: number } };

    doc.setFontSize(16);
    doc.text("Skill Gap Analysis Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Target Role: ${desired_role}`, 14, 30);
    doc.text(`Match Rate: ${Math.round((skill_match.length / required_skills.length) * 100)}%`, 14, 38);
    doc.text(`Skills Found: ${skill_match.length}/${required_skills.length}`, 14, 46);
    
    const motivationLines = doc.splitTextToSize(`Motivation: ${motivation}`, 180);
    let y = 54;
    motivationLines.forEach((line: string) => {
      doc.text(line, 14, y);
      y += 6;
    });
    const motivationEndY = y - 6;

    // Priority Skills Section
    if (priority_skills && priority_skills.length > 0) {
      autoTable(doc, {
        startY: motivationEndY + 6,
        head: [['Priority Skills to Learn First']],
        body: priority_skills.slice(0, 5).map(skill => [skill])
      });
    }

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 60) + 10,
      head: [['Skill', 'Status']],
      body: required_skills.map(skill => [
        skill,
        skill_match.map(s => s.toLowerCase()).includes(skill.toLowerCase()) ? '✓ Have' : '✗ Need'
      ])
    });

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 60) + 10,
      head: [['Top Missing Skills']],
      body: missing_skills.slice(0, 8).map(skill => [skill])
    });

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 60) + 10,
      head: [['Your Strengths']],
      body: skill_match.slice(0, 8).map(skill => [skill])
    });

    doc.save(`Skill_Report_${desired_role.replace(/\s+/g, '_')}.pdf`);
  };

  const handleGenerateRoadmap = () => {
    if (localAnalysisResult) {
      setAnalysisResult(localAnalysisResult);
      generateRoadmapForRole(localAnalysisResult.desired_role, localAnalysisResult.missing_skills);
      alert('🎯 Personalized roadmap generated! Check the Learning Path section.');
    }
  };

  const handleRoleSelect = (role: string) => {
    setDesiredRole(role);
    setShowRoleSuggestions(false);
  };

  const filteredRoles = availableRoles.filter(role => 
    role.toLowerCase().includes(desiredRole.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File selected:", file);
    if (!file || !desiredRole) {
      alert("Please upload a file and enter a desired role");
      return;
    }

    setUploadedFile(file);
    setAnalysisComplete(false);
    setIsAnalyzing(true);

    try {
      // Step 1: Upload resume
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('desiredRole', desiredRole);

      await axios.post('http://localhost:5001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      // Step 2: Analyze based on desired role - specify response type here too
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

      setLocalAnalysisResult(response.data);
      setAnalysisComplete(true);
      setShowUpload(false);
    } catch (error) {
      console.error('Error analyzing skills:', error);
      alert("Something went wrong during skill analysis. Check backend logs.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!localAnalysisResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Gap Analysis</h2>
            <p className="text-gray-600 dark:text-gray-300">Discover what skills you need to reach your goals</p>
          </div>
        </div>

        {/* Popular Roles Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Career Paths</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {POPULAR_ROLES.slice(0, 8).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <label htmlFor="desired-role" className="block text-lg font-medium text-gray-700 dark:text-gray-200 text-left mb-2">
            What's your target role?
          </label>
          <div className="relative">
            <input
              type="text"
              id="desired-role"
              value={desiredRole}
              onChange={(e) => {
                setDesiredRole(e.target.value);
                setShowRoleSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowRoleSuggestions(desiredRole.length > 0)}
              placeholder="e.g., Frontend Developer, Data Scientist, DevOps Engineer"
              className="w-full h-12 text-base pl-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:shadow-lg"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          {/* Role Suggestions Dropdown */}
          {showRoleSuggestions && filteredRoles.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

        {showUpload && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Your Resume</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload your resume to get a personalized skill analysis and learning roadmap
              </p>

              <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-8 hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={!desiredRole || isAnalyzing}
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
                      Supports PDF, DOC, DOCX, TXT (Max 10MB)
                    </p>
                  </div>
                </label>
              </div>

              {(uploadedFile || isAnalyzing) && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 dark:text-blue-400 font-medium">
                      {uploadedFile?.name || 'Processing...'}
                    </span>
                    {isAnalyzing && (
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-blue-600 dark:text-blue-400 text-sm">Analyzing...</span>
                      </div>
                    )}
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
    desired_role: analyzedRole,
    motivation,
    priority_skills
  } = localAnalysisResult;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Gap Analysis</h2>
          <p className="text-gray-600 dark:text-gray-300">Analysis complete for {analyzedRole}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setLocalAnalysisResult(null);
              setShowUpload(true);
              setAnalysisComplete(false);
              setDesiredRole('');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
          <button
            onClick={handleGenerateRoadmap}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Generate Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
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
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Target Role</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{analyzedRole}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Readiness Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((skill_match.length / required_skills.length) * 100)}%
              </p>
            </div>
          </div>
          {motivation && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                💡 {motivation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Priority Skills */}
      {priority_skills && priority_skills.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-4">🎯 Priority Skills to Learn First</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {priority_skills.slice(0, 6).map((skill, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-yellow-800 dark:text-yellow-300 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Skills to Learn Next</h4>
            <div className="space-y-2">
              {(priority_skills || missing_skills).slice(0, 4).map((skill, index) => (
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
              {skill_match.slice(0, 4).map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 dark:text-green-300 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleDownloadReport}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <FileText className="w-5 h-5" />
          <span>Download Report</span>
        </button>
        <button
          onClick={handleGenerateRoadmap}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center space-x-2 shadow-lg"
        >
          <Zap className="w-5 h-5" />
          <span>Generate Learning Roadmap</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}