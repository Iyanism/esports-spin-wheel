import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomeMode from './pages/HomeMode';
import SingleMode from './pages/SingleMode';
import TeamSelectionMode from './pages/TeamSelectionMode';

function App() {
  return (
    <BrowserRouter>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-1 p-1.5 bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] max-w-[90vw] overflow-x-auto no-scrollbar">
        <NavLink 
          to="/" 
          className={({ isActive }) => `
            px-6 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
            ${isActive ? 'bg-black text-white shadow-lg' : 'text-black hover:bg-black/5'}
          `}
        >
          Main Engine
        </NavLink>
        <NavLink 
          to="/single" 
          className={({ isActive }) => `
            px-6 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
            ${isActive ? 'bg-black text-white shadow-lg' : 'text-black hover:bg-black/5'}
          `}
        >
          Single Mode
        </NavLink>
        <NavLink 
          to="/team-selection" 
          className={({ isActive }) => `
            px-6 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
            ${isActive ? 'bg-black text-white shadow-lg' : 'text-black hover:bg-black/5'}
          `}
        >
          VS Battle
        </NavLink>
      </div>

      <Routes>
        <Route path="/" element={<HomeMode />} />
        <Route path="/single" element={<SingleMode />} />
        <Route path="/team-selection" element={<TeamSelectionMode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
