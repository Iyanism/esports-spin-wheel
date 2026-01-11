import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RefreshCcw } from 'lucide-react';

interface CongratsModalProps {
  isOpen: boolean;
  winner: string;
  reward: string;
  onRestart: () => void;
}

const CongratsModal: React.FC<CongratsModalProps> = ({ isOpen, winner, reward, onRestart }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-black" />
            
            <div className="p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <Trophy size={40} className="text-white" />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Grand Winner
                </h2>
                <h1 className="text-4xl font-black text-gray-900 mb-6 underline decoration-black underline-offset-8">
                  {winner}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="bg-gray-50 px-8 py-4 rounded-2xl border border-gray-100 mb-10"
              >
                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                  <Sparkles size={14} />
                  Reward Earned
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rotate-45 bg-cyan-400 rounded-sm shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                  <div className="text-3xl font-black text-black">{reward} Diamonds</div>
                </div>
              </motion.div>

              <button
                onClick={onRestart}
                className="group flex items-center justify-center gap-3 w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-xl"
              >
                <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                Next Round
              </button>
            </div>
            
            {/* Minimalist accents */}
            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1 opacity-20">
              <div className="w-1 h-1 bg-black rounded-full" />
              <div className="w-1 h-1 bg-black rounded-full" />
              <div className="w-1 h-1 bg-black rounded-full" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CongratsModal;
