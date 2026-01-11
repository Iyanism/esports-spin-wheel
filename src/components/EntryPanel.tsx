import React, { useState } from 'react';
import { Trash2, UserPlus, FileText, X } from 'lucide-react';

interface EntryPanelProps {
  names: string[];
  onAddNames: (newNames: string[]) => void;
  onRemoveName: (index: number) => void;
  onClearAll: () => void;
}

const EntryPanel: React.FC<EntryPanelProps> = ({ names, onAddNames, onRemoveName, onClearAll }) => {
  const [singleName, setSingleName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleName.trim()) {
      onAddNames([singleName.trim()]);
      setSingleName('');
    }
  };

  const handleAddBulk = () => {
    const list = bulkNames
      .split(/[,\n\s]+/)
      .map(name => name.trim())
      .filter(name => name !== '');
    if (list.length > 0) {
      onAddNames(list);
      setBulkNames('');
      setShowBulk(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-8 border-b border-gray-50 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Entrants</h2>
        
        <form onSubmit={handleAddSingle} className="flex gap-3 mb-6">
          <input
            type="text"
            value={singleName}
            onChange={(e) => setSingleName(e.target.value)}
            placeholder="Enter name..."
            className="flex-1 px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
          />
          <button
            type="submit"
            className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-md hover:shadow-lg"
          >
            <UserPlus size={22} />
          </button>
        </form>

        <button
          onClick={() => setShowBulk(!showBulk)}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
        >
          {showBulk ? <X size={18} /> : <FileText size={18} />}
          {showBulk ? 'Close Bulk Input' : 'Bulk Import'}
        </button>

        {showBulk && (
          <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <textarea
              value={bulkNames}
              onChange={(e) => setBulkNames(e.target.value)}
              placeholder="Paste names separated by commas, newlines, or spaces..."
              className="w-full h-40 px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all resize-none text-sm leading-relaxed"
            />
            <button
              onClick={handleAddBulk}
              className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-md"
            >
              Add All Names
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">List Count</span>
            <span className="text-2xl font-black text-black">{names.length}</span>
          </div>
          {names.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-2">
          {names.map((name, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-gray-700 truncate">{name}</span>
              <button
                onClick={() => onRemoveName(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {names.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <p className="text-sm">No names added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryPanel;
