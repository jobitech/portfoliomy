import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = ({ onOpenMenu }) => {

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-4 sm:px-8 md:px-12 py-4 sm:py-6 flex justify-between items-center mix-blend-difference text-white">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex flex-col items-center">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold text-lg sm:text-xl rounded-full">
            J
          </div>
          <span className="text-xs font-mono tracking-widest text-purple-400 mt-1 hidden sm:block">Creative Dev</span>
        </div>
        <span className="font-bold tracking-widest text-sm sm:text-lg hidden sm:block">JOBIN BABU</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenMenu}
          className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono uppercase tracking-widest hover:text-purple-400 transition-colors"
        >
          Menu <Menu size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;