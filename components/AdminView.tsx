import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Droplets, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { LogEntry } from '../types';

interface AdminViewProps {
  logs: LogEntry[];
}

const AdminView: React.FC<AdminViewProps> = ({ logs }) => {
  // Mock Data for the chart
  const waterData = [
    { name: 'Jan', verified: 12000, billed: 12500 },
    { name: 'Feb', verified: 13000, billed: 13000 },
    { name: 'Mar', verified: 13500, billed: 14500 }, // Discrepancy
    { name: 'Apr', verified: 14000, billed: 16000 }, // Big Discrepancy
    { name: 'May', verified: 14200, billed: 14300 },
  ];

  const tankerLogs = logs.filter(l => l.type === 'TANKER');

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Resource Dashboard</h1>
        <p className="text-gray-600">RWA Secretary View • Mr. Sharma</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Water Spend</p>
              <h3 className="text-2xl font-bold text-gray-900">₹45,200</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <span className="font-bold mr-1">↓ 12%</span> vs last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Leaks Detected</p>
              <h3 className="text-2xl font-bold text-gray-900">2</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Saved approx ₹4,000</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Tankers Verified</p>
              <h3 className="text-2xl font-bold text-gray-900">98%</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Via Guard App</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Water Consumption: Verified vs. Billed</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="verified" name="Verified Liters" stroke="#0F766E" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="billed" name="Billed Amount" stroke="#F59E0B" strokeDasharray="5 5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 mt-4 italic">
          *Discrepancies in March and April flagged automatically.
        </p>
      </div>

      {/* Recent Tanker Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Recent Water Tanker Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 uppercase font-medium">
              <tr>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Volume</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tankerLogs.length > 0 ? tankerLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}</td>
                  <td className="px-6 py-4">{log.details?.vendor || 'Unknown'}</td>
                  <td className="px-6 py-4">{log.details?.amount || 0} {log.details?.unit || 'L'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      log.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No logs today.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;