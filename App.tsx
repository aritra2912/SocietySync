import React, { useState } from 'react';
import { UserRole, LogEntry } from './types';
import GuardView from './components/GuardView';
import AdminView from './components/AdminView';
import ResidentView from './components/ResidentView';
import { Shield, User, LayoutDashboard, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.GUARD);
  
  // Shared state for demo connectivity (Guard logs -> Admin view / Resident approval)
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '0', type: 'VISITOR', description: 'Swiggy for A-101', timestamp: new Date(), status: 'APPROVED', details: { category: 'Delivery', flat: 'A-101' } }
  ]);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [pendingApprovalId, setPendingApprovalId] = useState<string | null>(null);

  const addLog = (log: LogEntry) => {
    setLogs(prev => [log, ...prev]);
    if (log.type === 'VISITOR') {
      // Simulate WhatsApp Notification Trigger
      setPendingApprovalId(log.id);
      setTimeout(() => setShowWhatsApp(true), 1500); 
    }
  };

  const handleWhatsAppAction = (action: 'APPROVE' | 'DENY') => {
    if (!pendingApprovalId) return;
    
    setLogs(prev => prev.map(log => 
      log.id === pendingApprovalId 
        ? { ...log, status: action === 'APPROVE' ? 'APPROVED' : 'DENIED' } 
        : log
    ));
    setShowWhatsApp(false);
    setPendingApprovalId(null);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white border-x border-gray-200 shadow-2xl overflow-hidden relative">
      
      {/* Simulation Control Bar (Top) */}
      <div className="bg-gray-800 text-white p-2 text-xs flex justify-between items-center z-50">
        <span className="font-mono opacity-70">SocietySync Demo v1.0</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => setRole(UserRole.GUARD)} 
            className={`px-2 py-1 rounded ${role === UserRole.GUARD ? 'bg-primary text-white' : 'bg-gray-700'}`}
          >
            Guard
          </button>
          <button 
            onClick={() => setRole(UserRole.RESIDENT)} 
            className={`px-2 py-1 rounded ${role === UserRole.RESIDENT ? 'bg-primary text-white' : 'bg-gray-700'}`}
          >
            Resident
          </button>
          <button 
            onClick={() => setRole(UserRole.ADMIN)} 
            className={`px-2 py-1 rounded ${role === UserRole.ADMIN ? 'bg-primary text-white' : 'bg-gray-700'}`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {role === UserRole.GUARD && <GuardView onAddLog={addLog} recentLogs={logs} />}
        {role === UserRole.ADMIN && <AdminView logs={logs} />}
        {role === UserRole.RESIDENT && <ResidentView />}

        {/* Floating WhatsApp Simulation Overlay */}
        {showWhatsApp && (
          <div className="absolute top-4 right-4 left-4 bg-[#DCF8C6] border border-green-200 rounded-lg shadow-2xl p-4 z-40 animate-bounce-in">
             <div className="flex items-center space-x-2 mb-2 border-b border-green-200 pb-2">
               <div className="bg-[#25D366] p-1 rounded-full text-white">
                 <MessageCircle size={16} />
               </div>
               <span className="font-bold text-green-900 text-sm">WhatsApp • SocietySync Bot</span>
             </div>
             <p className="text-sm text-gray-800 mb-4">
               Visitor Approval Request:<br/>
               <strong>{logs.find(l => l.id === pendingApprovalId)?.description}</strong>
             </p>
             <div className="flex space-x-2">
               <button 
                 onClick={() => handleWhatsAppAction('APPROVE')}
                 className="flex-1 bg-white text-green-600 font-bold py-2 rounded border border-green-200 shadow-sm hover:bg-green-50"
               >
                 Approve
               </button>
               <button 
                 onClick={() => handleWhatsAppAction('DENY')}
                 className="flex-1 bg-white text-red-500 font-bold py-2 rounded border border-red-100 shadow-sm hover:bg-red-50"
               >
                 Deny
               </button>
             </div>
          </div>
        )}
      </div>

      {/* Bottom Nav (Visual Only - Controls are at top for demo clarity) */}
      <div className="bg-white border-t border-gray-200 p-2 flex justify-around text-gray-400 text-[10px] uppercase tracking-wider">
        <div className={`flex flex-col items-center ${role === UserRole.GUARD ? 'text-primary' : ''}`}>
          <Shield size={20} />
          <span>Security</span>
        </div>
        <div className={`flex flex-col items-center ${role === UserRole.RESIDENT ? 'text-primary' : ''}`}>
          <User size={20} />
          <span>Community</span>
        </div>
        <div className={`flex flex-col items-center ${role === UserRole.ADMIN ? 'text-primary' : ''}`}>
          <LayoutDashboard size={20} />
          <span>RWA</span>
        </div>
      </div>
    </div>
  );
};

export default App;