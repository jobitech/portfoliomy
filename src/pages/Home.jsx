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
    let time = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01;
      
      // Floating orbs animation
      const orbCount = 6;
      for (let i = 0; i < orbCount; i++) {
        const angle = (i / orbCount) * Math.PI * 2 + time * 0.3;
        const radius = 150 + Math.sin(time * 0.5 + i) * 50;
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius;
        
        const size = 30 + Math.sin(time * 0.7 + i) * 15;
        const opacity = 0.3 + Math.sin(time * 0.6 + i) * 0.2;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        const hue = (i * 60 + time * 30) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, ${opacity})`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 40%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Animated grid lines
      const GRID_SPACING = 60;
      const rows = Math.ceil(height / GRID_SPACING);
      const cols = Math.ceil(width / GRID_SPACING);
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * GRID_SPACING;
          const y = j * GRID_SPACING;
          const distance = Math.sqrt((x - width/2) ** 2 + (y - height/2) ** 2);
          const wave = Math.sin(time * 0.8 - distance * 0.01) * 0.5 + 0.5;
          
          ctx.fillStyle = `rgba(147, 51, 234, ${wave * 0.1})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', handleResize);
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