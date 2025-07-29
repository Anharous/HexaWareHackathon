import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-white border-opacity-30 rounded-full animate-pulse mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading SkillArise</h2>
        <p className="text-blue-100">Preparing your learning experience...</p>
      </div>
    </div>
  );
}