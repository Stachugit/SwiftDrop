import React, { useState } from 'react';
import SessionManager from './components/SessionManager';
import QRDisplay from './components/QRDisplay';
import { Session } from './types';

function App() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [view, setView] = useState<'menu' | 'session'>('menu');

  const handleSessionCreated = (session: Session) => {
    setCurrentSession(session);
    setView('session');
  };

  const handleJoinSession = (sessionCode: string) => {
    // For now, just simulate joining
    console.log('Joining session:', sessionCode);
    // TODO: Implement actual join logic
  };

  const handleBackToMenu = () => {
    setCurrentSession(null);
    setView('menu');
  };

  return (
    <div className="App">
      {view === 'menu' ? (
        <SessionManager 
          onSessionCreated={handleSessionCreated}
          onJoinSession={handleJoinSession}
        />
      ) : currentSession ? (
        <QRDisplay 
          session={currentSession}
          onBackToMenu={handleBackToMenu}
        />
      ) : null}
    </div>
  );
}

export default App;