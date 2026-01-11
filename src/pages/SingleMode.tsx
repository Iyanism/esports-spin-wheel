import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EntryPanel from '../components/EntryPanel';
import SpinWheel from '../components/SpinWheel';
import CongratsModal from '../components/CongratsModal';
import { ArrowLeft, Gift } from 'lucide-react';

const REWARDS = ['99', '199', '299', '399', '499', '599', '699', '799', '899'];

// INTERNAL: Set a name here to force it as the winner if it exists in the entry list
const FORCED_WINNER = ""; 
// INTERNAL: Set a reward here (from REWARDS list) to force it if the FORCED_WINNER is picked
const FORCED_REWARD = ""; 

function SingleMode() {
  const [phase, setPhase] = useState<1 | 2>(1);
  const [names, setNames] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [reward, setReward] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for Phase 2 spinning
  const [isSpinningReward, setIsSpinningReward] = useState(false);

  const handleAddNames = (newNames: string[]) => {
    setNames(prev => [...prev, ...newNames]);
  };

  const handleRemoveName = (index: number) => {
    setNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setNames([]);
    setWinner(null);
    setReward(null);
  };

  const handleFirstWheelWinner = (pickedWinner: string) => {
    setWinner(pickedWinner);
    // Automatically proceed to Phase 2 (Reward Wheel)
    setTimeout(() => {
      setPhase(2);
    }, 1500);
  };

  const handleRewardWinner = (selectedReward: string) => {
    setReward(selectedReward);
    setIsSpinningReward(false);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 1000);
  };

  const startRewardSpin = () => {
    setReward(null);
    setIsSpinningReward(true);
  };

  const handleRestart = () => {
    setIsModalOpen(false);
    setPhase(1);
    setWinner(null);
    setReward(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <header className="py-6 px-10 flex border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
            <Gift className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-black uppercase">
            Spin<span className="text-gray-400">Single</span>
          </h1>
        </div>
        
        <div className="px-4 py-1.5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest">
          {phase === 1 ? 'Select Winner' : 'Choose Reward'}
        </div>
      </header>

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {phase === 1 ? (
            <motion.div
              key="single-phase1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex flex-col md:flex-row min-h-[calc(100vh-89px)] p-4 md:p-6 gap-6"
            >
              {/* Left Panel */}
              <div className="w-full md:w-96 shrink-0">
                <EntryPanel 
                  names={names} 
                  onAddNames={handleAddNames} 
                  onRemoveName={handleRemoveName} 
                  onClearAll={handleClearAll}
                />
              </div>

              {/* Center: Large Wheel */}
              <div className="flex-1 flex flex-col items-center justify-center glass rounded-3xl relative overflow-hidden py-12 min-h-[500px] md:min-h-[600px] border border-white/40">
                <div className="md:absolute top-10 text-center mb-8 md:mb-0 px-4">
                  <h2 className="text-3xl md:text-4xl font-black text-black mb-2 tracking-tight uppercase">The Draw</h2>
                  <p className="text-gray-500 font-medium text-sm md:text-base">Spin to pick the lucky finalist</p>
                </div>
                
                <div className="scale-[0.8] md:scale-100 transition-transform duration-500">
                  <SpinWheel 
                    items={names} 
                    onWinner={handleFirstWheelWinner} 
                    size={500}
                    forcedWinner={FORCED_WINNER}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="single-phase2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-89px)] p-4 md:p-6 gap-8 text-center"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-black">
                   Winner Selected
                </div>
                <h2 className="text-5xl font-black text-black mb-2 tracking-tight capitalize">{winner}</h2>
                <p className="text-gray-500 font-medium">Now, spin for the grand reward!</p>
              </div>

              <div className="scale-[0.85] md:scale-105 transition-transform">
                <SpinWheel 
                  items={REWARDS} 
                  onWinner={handleRewardWinner} 
                  size={450} 
                  spinning={isSpinningReward}
                  forcedWinner={winner === FORCED_WINNER ? FORCED_REWARD : undefined}
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={startRewardSpin}
                  disabled={isSpinningReward}
                  className="px-24 py-6 bg-black text-white rounded-full font-black text-xl hover:shadow-2xl active:scale-95 transition-all disabled:bg-gray-300 uppercase tracking-widest shadow-xl"
                >
                  {isSpinningReward ? 'Spinning Reward...' : 'Spin for Reward'}
                </button>
                <button 
                  onClick={() => setPhase(1)}
                  className="flex items-center gap-2 text-gray-400 hover:text-black font-bold text-sm transition-colors"
                >
                  <ArrowLeft size={16} /> Back to participants
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CongratsModal 
        isOpen={isModalOpen}
        winner={winner || ''}
        reward={reward || ''}
        onRestart={handleRestart}
      />
    </div>
  );
}

export default SingleMode;
