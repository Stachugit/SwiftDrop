import React, { useState, useEffect } from 'react';
import { Session } from '../../types';

interface SessionManagerProps {
  onSessionCreated: (session: Session) => void;
  onJoinSession: (sessionCode: string) => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({ onSessionCreated, onJoinSession }) => {
  const [sessionCode, setSessionCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const generateSessionCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createNewSession = async () => {
    setIsCreating(true);
    
    const code = generateSessionCode();
    const session: Session = {
      id: `session_${Date.now()}`,
      code,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isActive: true
    };

    // Simulate API call delay
    setTimeout(() => {
      onSessionCreated(session);
      setIsCreating(false);
    }, 500);
  };

  const handleJoinSession = () => {
    if (sessionCode.trim().length === 6) {
      onJoinSession(sessionCode.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="dark-card rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="mb-6">
            <img 
              src="/logo.png" 
              alt="SwiftDrop Logo" 
              className="w-16 h-16 mx-auto mb-4"
              onError={(e) => {
                // Fallback if logo doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Swift<span className="text-light-green">Drop</span>
          </h1>
          <p className="text-gray-400">Share files instantly between devices</p>
        </div>

        <div className="space-y-6">
          {/* Create New Session */}
          <div>
            <button
              onClick={createNewSession}
              disabled={isCreating}
              className="w-full bg-light-green hover:bg-green-400 disabled:bg-gray-600 text-black font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              {isCreating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              ) : (
                'Start New Session'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">or</span>
            </div>
          </div>

          {/* Join Session */}
          <div>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Enter session code"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="flex-1 px-4 py-3 dark-input rounded-xl focus:ring-2 focus:ring-light-green focus:border-light-green outline-none placeholder-gray-500"
              />
              <button
                onClick={handleJoinSession}
                disabled={sessionCode.length !== 6}
                className="bg-gray-700 hover:bg-light-green hover:text-black disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Sessions expire after 10 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;