import React, { useState } from 'react';
import { Session, FileTransfer } from '../../types';
import FileDropArea from '../FileDropArea';
import FileReceiver from '../FileReceiver';

interface SessionInterfaceProps {
  session: Session;
  connectedDevices: string[];
  onBackToMenu: () => void;
}

const SessionInterface: React.FC<SessionInterfaceProps> = ({ 
  session, 
  connectedDevices, 
  onBackToMenu 
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const [filesToSend, setFilesToSend] = useState<FileTransfer[]>([]);
  const [receivedFiles, setReceivedFiles] = useState<FileTransfer[]>([]);

  const handleFilesSelected = (files: FileTransfer[]) => {
    setFilesToSend(prev => [...prev, ...files]);
    
    // Simulate file upload progress
    files.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Update file status to completed
          setFilesToSend(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, progress: 100, status: 'completed' }
                : f
            )
          );
        } else {
          // Update progress
          setFilesToSend(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, progress: Math.round(progress), status: 'uploading' }
                : f
            )
          );
        }
      }, 500);
    });
  };

  const handleDownloadFile = (fileId: string) => {
    console.log('Downloading file:', fileId);
    // TODO: Implement actual download logic
  };

  const timeLeft = Math.max(0, session.expiresAt.getTime() - Date.now());
  const minutesLeft = Math.floor(timeLeft / 60000);
  const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="dark-card border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.png" 
                alt="SwiftDrop Logo" 
                className="w-8 h-8"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-xl font-bold text-white">Session {session.code}</h1>
                <p className="text-sm text-gray-400">
                  {connectedDevices.length} device{connectedDevices.length !== 1 ? 's' : ''} connected • 
                  Expires in <span className="text-green-400">{minutesLeft}:{secondsLeft.toString().padStart(2, '0')}</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={onBackToMenu}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="dark-card rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${connectedDevices.length > 1 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium text-white">
              {connectedDevices.length > 1 
                ? 'Connected and ready to transfer files' 
                : 'Waiting for another device to join...'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="dark-card rounded-lg">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('send')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'send'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Send Files ({filesToSend.length})
              </button>
              <button
                onClick={() => setActiveTab('receive')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'receive'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Received Files ({receivedFiles.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'send' ? (
              <FileDropArea 
                onFilesSelected={handleFilesSelected}
                files={filesToSend}
              />
            ) : (
              <FileReceiver 
                receivedFiles={receivedFiles}
                onDownloadFile={handleDownloadFile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionInterface;