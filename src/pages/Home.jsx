import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import ProjectsGallery from '../components/ProjectsGallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ContactMenu from '../components/ContactMenu';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canvasRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const GRID_SPACING = 40;
    const NEEDLE_LENGTH = 20;
    let mouse = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const updateMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', updateMouse);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const rows = Math.ceil(height / GRID_SPACING);
      const cols = Math.ceil(width / GRID_SPACING);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * GRID_SPACING + GRID_SPACING / 2;
          const y = j * GRID_SPACING + GRID_SPACING / 2;
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          const maxDist = 400;
          const interaction = Math.max(0, 1 - distance / maxDist);
          
          const length = NEEDLE_LENGTH + (interaction * 15);
          const thickness = 1 + (interaction * 3);
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(-length / 2, 0);
          ctx.lineTo(length / 2, 0);
          
          if (interaction > 0.1) {
            const gradient = ctx.createLinearGradient(-length / 2, 0, length / 2, 0);
            gradient.addColorStop(0, `rgba(147, 51, 234, ${0.3 + interaction})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${0.3 + interaction})`);
            ctx.strokeStyle = gradient;
            ctx.shadowBlur = 10 * interaction;
            ctx.shadowColor = '#7c3aed';
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.shadowBlur = 0;
          }

          ctx.lineWidth = thickness;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', updateMouse);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black font-sans selection:bg-pink-500 selection:text-white overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-0 pointer-events-none"></div>

      <Navbar onOpenMenu={() => setIsMenuOpen(true)} />
      
      <main className="relative">
        <section id="home"><Hero /></section>
        <section id="about"><About /></section>
        <section id="work"><Skills /></section>
        <section id="projects-gallery"><ProjectsGallery /></section>
        <section id="contact"><Contact /></section>
      </main>

      <Footer />
      <ContactMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Home;