import React, { useState, useEffect } from 'react';
import { Mic, Send, Package, Truck, AlertCircle, Camera, Check } from 'lucide-react';
import { parseGuardIntent } from '../services/geminiService';
import { LogEntry } from '../types';

interface GuardViewProps {
  onAddLog: (log: LogEntry) => void;
  recentLogs: LogEntry[];
}

const GuardView: React.FC<GuardViewProps> = ({ onAddLog, recentLogs }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState<string | null>(null); // ID of log needing photo

  // Simulate voice input for demo purposes
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      handleVoiceCommand();
    } else {
      setIsListening(true);
      // Simulate "Listening" text appearing
      setTranscript("Listening...");
      setTimeout(() => {
        // Randomly pick a scenario for the demo if user doesn't type
        const scenarios = [
          "Courier for B-302",
          "Water tanker 12000 liters from Balaji Water",
          "Swiggy delivery for A-101",
          "Guest for C-505"
        ];
        setTranscript(scenarios[Math.floor(Math.random() * scenarios.length)]);
      }, 1500);
    }
  };

  const handleVoiceCommand = async () => {
    if (!transcript || transcript === "Listening...") return;
    
    setProcessing(true);
    const result = await parseGuardIntent(transcript);
    setProcessing(false);

    if (result && result.type !== 'UNKNOWN') {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        type: result.type as any,
        description: result.summary || transcript,
        timestamp: new Date(),
        status: 'PENDING',
        details: result.details
      };
      onAddLog(newLog);
      setTranscript('');
      
      // If it's a tanker, prompt for camera
      if (result.type === 'TANKER') {
        setShowCamera(newLog.id);
      }
    } else {
      alert("Could not understand command. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-primary p-4 text-white shadow-md">
        <h1 className="text-xl font-bold font-serif">SocietySync Guard</h1>
        <p className="text-sm opacity-90">Gate 1 • Ramesh Kumar</p>
      </div>

      {/* Main Action Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Tap to Speak</h2>
          <p className="text-gray-500">Supports Hindi, Marathi, Tamil</p>
        </div>

        <button
          onClick={toggleListening}
          className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all transform ${
            isListening ? 'bg-red-500 scale-110 animate-pulse' : 'bg-primary hover:bg-teal-800'
          }`}
        >
          <Mic size={48} className="text-white" />
        </button>

        {/* Manual Fallback Input */}
        <div className="w-full max-w-md flex items-center space-x-2 bg-white p-2 rounded-lg shadow border border-gray-200">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Or type here (e.g., 'Courier for B-302')..."
            className="flex-1 outline-none text-gray-700 px-2"
          />
          <button 
            onClick={handleVoiceCommand}
            disabled={processing}
            className="p-2 bg-secondary text-white rounded-md"
          >
            {processing ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" /> : <Send size={20} />}
          </button>
        </div>
      </div>

      {/* Recent Logs List */}
      <div className="bg-white rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-6 min-h-[40vh]">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <AlertCircle size={18} className="mr-2 text-primary" />
          Recent Activity
        </h3>
        
        <div className="space-y-4">
          {recentLogs.length === 0 && <p className="text-gray-400 text-center py-4">No recent logs.</p>}
          
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${log.type === 'TANKER' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  {log.type === 'TANKER' ? <Truck size={20} /> : <Package size={20} />}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{log.description}</p>
                  <p className="text-xs text-gray-500">{log.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  log.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                  log.status === 'VERIFIED' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {log.status}
                </span>
                {log.type === 'TANKER' && log.status === 'PENDING' && (
                  <button 
                    onClick={() => setShowCamera(log.id)}
                    className="mt-2 text-xs flex items-center text-primary font-semibold"
                  >
                    <Camera size={12} className="mr-1" /> Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm text-center">
            <h3 className="font-bold text-lg mb-2">Verify Water Tanker</h3>
            <p className="text-sm text-gray-500 mb-4">Take a photo of the meter and number plate.</p>
            <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
               <Camera size={48} className="text-gray-400" />
            </div>
            <button 
              onClick={() => {
                // Mock verification
                const log = recentLogs.find(l => l.id === showCamera);
                if (log) log.status = 'VERIFIED';
                setShowCamera(null);
              }}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold"
            >
              Capture & Verify
            </button>
            <button 
              onClick={() => setShowCamera(null)}
              className="mt-3 text-gray-500 text-sm underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuardView;