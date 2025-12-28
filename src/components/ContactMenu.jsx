import React, { useState, useEffect, useRef } from 'react';
import { X, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

const ContactMenu = ({ isOpen, onClose }) => {
  const [animateLetters, setAnimateLetters] = useState(false);
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setAnimateLetters(true);
    }
  }, [isOpen]);

  // Canvas animation for menu background
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    // Initialize particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1,
        life: 1,
        maxLife: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interaction = Math.max(0, 1 - distance / 300);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + interaction * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${0.3 + interaction * 0.5})`;
        ctx.fill();

        // Draw glow
        if (interaction > 0.2) {
          ctx.strokeStyle = `rgba(59, 130, 246, ${interaction * 0.6})`;
          ctx.lineWidth = 1.5 + interaction * 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + interaction * 8, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw connections to nearby particles
        particles.forEach((otherP, otherIdx) => {
          if (otherIdx > idx) {
            const dx2 = otherP.x - p.x;
            const dy2 = otherP.y - p.y;
            const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (dist < 200) {
              ctx.strokeStyle = `rgba(147, 51, 234, ${(200 - dist) / 500})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(otherP.x, otherP.y);
              ctx.stroke();
            }
          }
        });
      });

      // Draw mouse attraction lines
      particles.forEach(p => {
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interaction = Math.max(0, 1 - distance / 250);

        if (interaction > 0.3) {
          ctx.strokeStyle = `rgba(59, 130, 246, ${interaction * 0.4})`;
          ctx.lineWidth = 1 + interaction;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.stroke();
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isOpen]);

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  const menuItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'work' },
    { name: 'Projects', id: 'projects-gallery' },
    { name: 'Contact', id: 'contact' }
  ];

  const fullName = 'JOBIN BABU';

  return (
    <div 
      className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-50 transition-transform duration-700 cubic-bezier(0.77, 0, 0.175, 1) ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
    >
      {/* Animated canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none opacity-70" />
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 -z-10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10 mix-blend-screen -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 mix-blend-screen -z-10"></div>

      <div className="h-full flex flex-col p-8 md:p-12 text-white relative z-10">
        <div className="flex justify-between items-center mb-16">
          {/* Animated Name */}
          <div className="flex gap-1 overflow-hidden">
            {fullName.split('').map((letter, idx) => (
              <span
                key={idx}
                className="font-bold text-2xl tracking-widest inline-block transform transition-all duration-500"
                style={{
                  animation: isOpen ? `slideInUp 0.6s ease-out ${idx * 0.05}s forwards` : 'none',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
                  {letter}
                </span>
              </span>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:rotate-90 transition-transform duration-300 hover:text-purple-400"
          >
            <X size={32} />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-12">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {menuItems.map((item, idx) => (
              <div 
                key={item.id} 
                onClick={() => handleNavClick(item.id)}
                className="group flex items-center gap-6 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300"
              >
                <span className="font-mono text-sm text-purple-400">0{idx + 1}</span>
                <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-500">
                  {item.name}
                </h2>
              </div>
            ))}
          </div>

          <div className="md:w-1/3 flex flex-col justify-end pb-12 border-t md:border-t-0 md:border-l border-purple-500/30 md:pl-12">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Connect</h3>
            <div className="grid grid-cols-2 gap-4 mb-12">
              {[
                { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/_iam_jobin_' },
                { name: 'GitHub', icon: Github, url: 'https://github.com/jobitech' },
                { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/jobin-babu-872462325/' },
                { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' }
              ].map(social => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors group">
                  <social.icon size={16} />
                  <span className="text-sm">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ContactMenu;