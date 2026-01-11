import { useState } from 'react';
import { motion } from 'framer-motion';
import EntryPanel from '../components/EntryPanel';
import SpinWheel from '../components/SpinWheel';
import VSModal from '../components/VSModal';
import { Swords, RotateCcw } from 'lucide-react';

const PREDEFINED_MATCHES = [
  { t1: "Hello Kitty Gang", t2: "VIP" },
  { t1: "Define", t2: "ACE" }
];

function TeamSelectionMode() {
  const [names, setNames] = useState<string[]>([]);
  const [team1, setTeam1] = useState<string | null>(null);
  const [team2, setTeam2] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [matchIndex, setMatchIndex] = useState(0);

  const handleAddNames = (newNames: string[]) => {
    setNames((prev: string[]) => [...prev, ...newNames]);
  };

  const handleRemoveName = (index: number) => {
    setNames((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setNames([]);
    setTeam1(null);
    setTeam2(null);
    setMatchIndex(0);
  };

  const handleWinner = (winner: string) => {
    if (!team1) {
      setTeam1(winner);
      setNames((prev: string[]) => prev.filter(name => name !== winner));
    } else if (!team2) {
      setTeam2(winner);
      setNames((prev: string[]) => prev.filter(name => name !== winner));
      setMatchIndex((prev: number) => prev + 1);
      setTimeout(() => setIsModalOpen(true), 1000);
    }
    setIsSpinning(false);
  };

  const handleRestart = () => {
    setIsModalOpen(false);
    setTeam1(null);
    setTeam2(null);
  };

  // Determine forced winner based on current state
  const currentPredefined = PREDEFINED_MATCHES[matchIndex];
  const forcedWinner = !team1 
    ? (currentPredefined?.t1 && names.includes(currentPredefined.t1) ? currentPredefined.t1 : undefined)
    : (currentPredefined?.t2 && names.includes(currentPredefined.t2) ? currentPredefined.t2 : undefined);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <header className="py-6 px-10 flex border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <Swords className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-black uppercase">
            Team<span className="text-gray-400">Battle</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500">
            {!team1 ? 'Picking Team 1' : 'Picking Team 2'}
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-89px)] p-4 md:p-6 gap-6">
          {/* Left Panel */}
          <div className="w-full md:w-96 shrink-0">
            <EntryPanel 
              names={names} 
              onAddNames={handleAddNames} 
              onRemoveName={handleRemoveName} 
              onClearAll={handleClearAll}
            />
          </div>

          {/* Center: Wheel and Matchup State */}
          <div className="flex-1 flex flex-col items-center justify-center glass rounded-[40px] relative overflow-hidden py-12 min-h-[500px] md:min-h-[600px] shadow-sm border border-white/40">
            <div className="md:absolute top-10 flex items-center gap-8 px-6">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${team1 ? 'bg-red-50 border-red-500 shadow-md transform scale-110' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                  {team1 ? '🔴' : ''}
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400">Team 1</span>
              </div>
              
              <div className="text-black font-black text-2xl opacity-20 italic">VS</div>

              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${team2 ? 'bg-blue-50 border-blue-500 shadow-md transform scale-110' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                  {team2 ? '🔵' : ''}
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400">Team 2</span>
              </div>
            </div>
            
            <div className="scale-[0.8] md:scale-100 transition-transform duration-500">
              <SpinWheel 
                items={names} 
                onWinner={handleWinner} 
                size={500}
                spinning={isSpinning}
                forcedWinner={forcedWinner}
              />
            </div>

            {team1 && !team2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                <div className="text-sm font-bold text-red-500 uppercase tracking-[0.2em] mb-1">Coming Up Next</div>
                <div className="text-3xl font-black text-black capitalize mb-8">{team1} vs ...</div>
                <button
                  onClick={() => setIsSpinning(true)}
                  disabled={names.length === 0}
                  className="px-12 py-4 bg-black text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95 disabled:bg-gray-200"
                >
                  Spin for Opponent
                </button>
              </motion.div>
            )}

            {!team1 && team2 && (
              <button 
                onClick={handleRestart}
                className="flex items-center gap-2 text-gray-400 hover:text-black font-bold text-sm mt-8 transition-colors"
              >
                <RotateCcw size={16} /> Reset Battle
              </button>
            )}
          </div>
        </div>
      </main>

      <VSModal 
        isOpen={isModalOpen}
        team1={team1 || ''}
        team2={team2 || ''}
        onRestart={handleRestart}
      />
    </div>
  );
}

export default TeamSelectionMode;
