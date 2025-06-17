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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Session {session.code}</h1>
              <p className="text-sm text-gray-500">
                {connectedDevices.length} device{connectedDevices.length !== 1 ? 's' : ''} connected • 
                Expires in {minutesLeft}:{secondsLeft.toString().padStart(2, '0')}
              </p>
            </div>
            
            <button
              onClick={onBackToMenu}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${connectedDevices.length > 1 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium text-gray-900">
              {connectedDevices.length > 1 
                ? 'Connected and ready to transfer files' 
                : 'Waiting for another device to join...'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('send')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'send'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Send Files ({filesToSend.length})
              </button>
              <button
                onClick={() => setActiveTab('receive')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'receive'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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