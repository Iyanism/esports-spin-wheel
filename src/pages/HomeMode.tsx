import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EntryPanel from '../components/EntryPanel';
import WinnerPanel from '../components/WinnerPanel';
import SpinWheel from '../components/SpinWheel';
import CongratsModal from '../components/CongratsModal';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const REWARDS = ['99', '199', '299', '399', '499', '599', '699', '799', '899'];

function HomeMode() {
  const [phase, setPhase] = useState<1 | 2>(1);
  const [names, setNames] = useState<string[]>([]);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  
  const [finalWinner, setFinalWinner] = useState<string | null>(null);
  const [reward, setReward] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for Phase 2 spinning
  const [isSpinningWinner, setIsSpinningWinner] = useState(false);
  const [isSpinningReward, setIsSpinningReward] = useState(false);

  const handleAddNames = (newNames: string[]) => {
    setNames(prev => [...prev, ...newNames]);
  };

  const handleRemoveName = (index: number) => {
    setNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setNames([]);
    setSelectedWinners([]);
  };

  const handlePhase1Winner = (winner: string) => {
    setSelectedWinners(prev => [winner, ...prev]);
    setNames(prev => prev.filter(name => name !== winner));
  };

  const handleFinalWinner = (winner: string) => {
    setFinalWinner(winner);
    setIsSpinningWinner(false);
    checkPhase2Completion(winner, reward);
  };

  const handleRewardWinner = (selectedReward: string) => {
    setReward(selectedReward);
    setIsSpinningReward(false);
    checkPhase2Completion(finalWinner, selectedReward);
  };

  const checkPhase2Completion = (win: string | null, rew: string | null) => {
    if (win && rew) {
      setTimeout(() => setIsModalOpen(true), 1000);
    }
  };

  const startFinalSpin = () => {
    setFinalWinner(null);
    setReward(null);
    setIsSpinningWinner(true);
    setIsSpinningReward(true);
  };

  const handleRestart = () => {
    setIsModalOpen(false);
    setPhase(1);
    setNames([]);
    setSelectedWinners([]);
    setFinalWinner(null);
    setReward(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <header className="py-6 px-10 flex border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-4 h-4 bg-white rotate-45" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-black uppercase">
            Spin<span className="text-gray-400">Hub</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500">
            Phase {phase}
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {phase === 1 ? (
            <motion.div
              key="phase1"
              initial={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col md:flex-row min-h-[calc(100vh-89px)] p-4 md:p-6 gap-6"
            >
              {/* Left Panel */}
              <div className="w-full md:w-96 shrink-0 h-[500px] md:h-auto">
                <EntryPanel 
                  names={names} 
                  onAddNames={handleAddNames} 
                  onRemoveName={handleRemoveName} 
                  onClearAll={handleClearAll}
                />
              </div>

              {/* Center: Wheel */}
              <div className="flex-1 flex flex-col items-center justify-center glass rounded-3xl relative overflow-hidden py-12 min-h-[500px] md:min-h-[600px] shadow-sm border border-white/40">
                <div className="md:absolute top-10 text-center mb-8 md:mb-0 px-4">
                  <h2 className="text-3xl md:text-4xl font-black text-black mb-2 tracking-tight">Main Draw</h2>
                  <p className="text-gray-500 font-medium text-sm md:text-base">Add names and spin to select pool winners</p>
                </div>
                
                <div className="scale-[0.8] md:scale-100 transition-transform duration-500">
                  <SpinWheel 
                    items={names} 
                    onWinner={handlePhase1Winner} 
                    size={500}
                  />
                </div>

                {selectedWinners.length >= 2 && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={() => setPhase(2)}
                    className="mt-8 md:mt-12 group flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                  >
                    Proceed to Finals
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </div>

              {/* Right Panel */}
              <div className="w-full md:w-96 shrink-0 h-[500px] md:h-auto">
                <WinnerPanel winners={selectedWinners} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="phase2"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col min-h-[calc(100vh-89px)] p-4 md:p-6 gap-6"
            >
              <div className="flex items-center gap-4 mb-2">
                <button 
                  onClick={() => setPhase(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-black">Final Championship</h2>
                  <p className="text-gray-500 font-medium text-sm md:text-base">The selected pool competes for rewards</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
                <div className="flex flex-col items-center gap-4 md:gap-6 scale-[0.7] sm:scale-[0.85] md:scale-100 transition-transform">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Winner Wheel</h3>
                  <SpinWheel 
                    items={selectedWinners} 
                    onWinner={handleFinalWinner} 
                    size={400} 
                    spinning={isSpinningWinner}
                  />
                </div>

                <div className="h-40 w-px bg-gray-100 hidden md:block" />

                <div className="flex flex-col items-center gap-4 md:gap-6 scale-[0.7] sm:scale-[0.85] md:scale-100 transition-transform">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Reward Wheel</h3>
                  <SpinWheel 
                    items={REWARDS} 
                    onWinner={handleRewardWinner} 
                    size={400} 
                    spinning={isSpinningReward}
                  />
                </div>
              </div>

              <div className="flex justify-center p-4">
                <button
                  onClick={startFinalSpin}
                  disabled={isSpinningWinner || isSpinningReward}
                  className="w-full md:w-auto px-20 py-5 bg-black text-white rounded-full font-bold text-xl hover:shadow-2xl active:scale-95 transition-all disabled:bg-gray-300"
                >
                  {isSpinningWinner ? 'Finalizing...' : 'Grand Spin'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CongratsModal 
        isOpen={isModalOpen}
        winner={finalWinner || ''}
        reward={reward || ''}
        onRestart={handleRestart}
      />
    </div>
  );
}

export default HomeMode;
