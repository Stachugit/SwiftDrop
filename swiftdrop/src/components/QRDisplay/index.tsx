import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Session } from '../../types';

interface QRDisplayProps {
  session: Session;
  onBackToMenu: () => void;
}

const QRDisplay: React.FC<QRDisplayProps> = ({ session, onBackToMenu }) => {
  const qrValue = `${window.location.origin}?join=${session.code}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(session.code);
  };

  const timeLeft = Math.max(0, session.expiresAt.getTime() - Date.now());
  const minutesLeft = Math.floor(timeLeft / 60000);
  const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="dark-card rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          {/* Logo */}
          <img 
            src="/logo.png" 
            alt="SwiftDrop Logo" 
            className="w-12 h-12 mx-auto mb-4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h2 className="text-2xl font-bold text-white mb-2">Session Ready</h2>
          <p className="text-gray-400">Scan QR code or enter session code</p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-xl border-2 border-light-green mb-6">
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="M"
            includeMargin={true}
            className="mx-auto"
          />
        </div>

        {/* Session Code */}
        <div className="mb-6">
          <div className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-600">
            <p className="text-sm text-gray-400 mb-2">Session Code</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-mono font-bold text-light-green tracking-wider">
                {session.code}
              </span>
              <button
                onClick={copyToClipboard}
                className="text-light-green hover:text-green-400 p-1"
                title="Copy to clipboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Timer */}
          <p className="text-sm text-gray-400">
            Expires in <span className="text-light-green font-mono">{minutesLeft}:{secondsLeft.toString().padStart(2, '0')}</span>
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={onBackToMenu}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default QRDisplay;