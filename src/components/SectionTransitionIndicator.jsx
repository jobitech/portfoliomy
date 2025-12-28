import React, { useState, useEffect } from 'react';

const SectionTransitionIndicator = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTransition, setShowTransition] = useState(false);

  const sections = [
    { id: 'home', name: 'Home', color: 'from-purple-500 to-blue-500' },
    { id: 'about', name: 'About', color: 'from-blue-500 to-cyan-500' },
    { id: 'work', name: 'Work', color: 'from-cyan-500 to-purple-500' },
    { id: 'contact', name: 'Contact', color: 'from-purple-500 to-pink-500' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            if (currentSection !== section.id) {
              setCurrentSection(section.id);
              setShowTransition(true);
              setTimeout(() => setShowTransition(false), 600);
            }
          }
        }
      });
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentSection, sections]);

  const current = sections.find(s => s.id === currentSection);

  return (
    <>
      {/* Animated transition effect */}
      {showTransition && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse opacity-30"></div>
          <div className={`absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent animate-ping opacity-30`}></div>
        </div>
      )}

      {/* Section indicator at bottom right */}
      <div className="fixed bottom-8 right-8 z-30 hidden lg:block">
        <div className={`bg-gradient-to-r ${current?.color} p-px rounded-full`}>
          <div className="bg-black px-6 py-3 rounded-full">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${current?.color} animate-pulse`}></div>
              <span className="text-sm font-mono tracking-widest text-white">
                {current?.name}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {sections.indexOf(current || sections[0]) + 1}/{sections.length}
              </span>
            </div>
          </div>
        </div>

        {/* Mouse follower particles */}
        <div className="fixed pointer-events-none">
          <div 
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
              transition: 'all 0.1s ease-out'
            }}
          ></div>
        </div>
      </div>

      {/* Mobile indicator */}
      <div className="fixed bottom-4 left-4 z-30 lg:hidden">
        <div className={`bg-gradient-to-r ${current?.color} p-px rounded-lg`}>
          <div className="bg-black px-4 py-2 rounded-lg">
            <span className="text-xs font-mono tracking-widest text-white">
              {current?.name}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sectionChange {
          0% {
            opacity: 0;
            scale: 0.8;
          }
          50% {
            opacity: 1;
            scale: 1.1;
          }
          100% {
            opacity: 0;
            scale: 0.8;
          }
        }

        @keyframes particleFloat {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) translateX(50px);
          }
        }
      `}</style>
    </>
  );
};

export default SectionTransitionIndicator;
