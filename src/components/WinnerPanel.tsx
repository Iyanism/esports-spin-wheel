import React from 'react';
import { Trophy } from 'lucide-react';

interface WinnerPanelProps {
  winners: string[];
}

const WinnerPanel: React.FC<WinnerPanelProps> = ({ winners }) => {
  return (
    <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Winners Pool</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">Names selected for the final round</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {winners.map((name, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl animate-in slide-in-from-right duration-500"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-black text-white text-xs font-bold rounded-full">
                {winners.length - index}
              </div>
              <span className="text-base font-medium text-gray-900">{name}</span>
            </div>
          ))}
          {winners.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <p className="text-sm">Spin the wheel to pick winners!</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-gray-500">Total Selected:</span>
          <span className="text-black">{winners.length}</span>
        </div>
      </div>
    </div>
  );
};

export default WinnerPanel;
