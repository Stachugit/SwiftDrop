import React, { useState, useEffect } from 'react';
import SessionManager from './components/SessionManager';
import QRDisplay from './components/QRDisplay';
import SessionInterface from './components/SessionInterface';
import { Session } from './types';

function App() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [view, setView] = useState<'menu' | 'qr' | 'session'>('menu');
  const [connectedDevices, setConnectedDevices] = useState<string[]>(['device1']); // Start with current device
  const [isJoining, setIsJoining] = useState(false);

  // Check for session code in URL (for QR code scanning)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    
    if (joinCode) {
      handleJoinSession(joinCode);
    }
  }, []);

  // Session expiration timer
  useEffect(() => {
    if (currentSession) {
      const timer = setInterval(() => {
        const timeLeft = currentSession.expiresAt.getTime() - Date.now();
        if (timeLeft <= 0) {
          handleSessionExpired();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentSession]);

  const handleSessionCreated = (session: Session) => {
    setCurrentSession(session);
    setView('qr');
    console.log('Session created:', session.code);
  };

  const handleJoinSession = async (sessionCode: string) => {
    setIsJoining(true);
    
    // Simulate API call to join session
    setTimeout(() => {
      // For demo purposes, create a session if joining
      const session: Session = {
        id: `session_${sessionCode}`,
        code: sessionCode,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isActive: true
      };
      
      setCurrentSession(session);
      setConnectedDevices(['device1', 'device2']); // Simulate connection
      setView('session');
      setIsJoining(false);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      console.log('Joined session:', sessionCode);
    }, 1000);
  };

  const handleBackToMenu = () => {
    setCurrentSession(null);
    setConnectedDevices(['device1']);
    setView('menu');
    
    // Clean URL if needed
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleSessionExpired = () => {
    alert('Session expired!');
    handleBackToMenu();
  };

  const handleStartSession = () => {
    if (currentSession && view === 'qr') {
      setConnectedDevices(['device1', 'device2']); // Simulate another device joining
      setView('session');
    }
  };

  // Show loading screen when joining
  if (isJoining) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Joining Session...</h2>
          <p className="text-gray-600">Connecting to session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {view === 'menu' && (
        <SessionManager 
          onSessionCreated={handleSessionCreated}
          onJoinSession={handleJoinSession}
        />
      )}
      
      {view === 'qr' && currentSession && (
        <div>
          <QRDisplay 
            session={currentSession}
            onBackToMenu={handleBackToMenu}
          />
          
          {/* Demo button to simulate another device joining */}
          <div className="fixed bottom-4 right-4">
            <button
              onClick={handleStartSession}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200"
            >
              🧪 Simulate Device Join
            </button>
          </div>
        </div>
      )}
      
      {view === 'session' && currentSession && (
        <SessionInterface 
          session={currentSession}
          connectedDevices={connectedDevices}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;