import { motion, AnimatePresence } from 'framer-motion';
import { Sword, RotateCcw } from 'lucide-react';

interface VSModalProps {
  isOpen: boolean;
  team1: string;
  team2: string;
  onRestart: () => void;
}

const VSModal: React.FC<VSModalProps> = ({ isOpen, team1, team2, onRestart }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onRestart}
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-red-500 via-white to-blue-500" />
            
            <div className="p-12 flex flex-col items-center text-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 mb-8"
              >
                Match Ready
              </motion.div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full py-8">
                {/* Team 1 */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-4 border-2 border-red-100 shadow-inner">
                    <span className="text-4xl">🔴</span>
                  </div>
                  <h3 className="text-2xl font-black text-black capitalize truncate max-w-[200px]">{team1}</h3>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1">Challenger</span>
                </motion.div>

                {/* VS Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="relative flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl z-10 border-4 border-white">
                    <Sword size={24} />
                  </div>
                  <div className="absolute inset-0 blur-xl bg-black/20" />
                </motion.div>

                {/* Team 2 */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-4 border-2 border-blue-100 shadow-inner">
                    <span className="text-4xl">🔵</span>
                  </div>
                  <h3 className="text-2xl font-black text-black capitalize truncate max-w-[200px]">{team2}</h3>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Defender</span>
                </motion.div>
              </div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={onRestart}
                className="mt-12 flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95 group"
              >
                <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                New Matchup
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VSModal;
