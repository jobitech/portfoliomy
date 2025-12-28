import React, { useEffect, useRef } from 'react';

export const useAnimatedBackground = (canvasId, animationType = 'particles') => {
  const canvasRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouse = { x: width / 2, y: height / 2 };
    let particles = [];

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
    // Only add mousemove listener for animations that use mouse interaction
    if (animationType === 'grid' || animationType === 'waves' || animationType === 'particles') {
      window.addEventListener('mousemove', updateMouse);
    }

    // Initialize particles for certain animations
    if (animationType === 'particles' || animationType === 'floatingOrbs' || animationType === 'skillsAnimation' || animationType === 'projectsAnimation' || animationType === 'contactAnimation' || animationType === 'simpleAnimation') {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 2 + 1,
          life: 1
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (animationType === 'particles') {
        // Enhanced floating particles with purple and blue trails
        particles.forEach((particle, idx) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;

          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const interaction = Math.max(0, 1 - distance / 300);

          // Particle glow - alternating purple and blue
          const isPurple = idx % 2 === 0;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius + interaction * 4, 0, Math.PI * 2);
          ctx.fillStyle = isPurple 
            ? `rgba(168, 85, 247, ${0.3 + interaction * 0.6})`
            : `rgba(59, 130, 246, ${0.3 + interaction * 0.6})`;
          ctx.fill();

          // Particle trail - mixed colors
          if (interaction > 0.2) {
            ctx.strokeStyle = isPurple 
              ? `rgba(59, 130, 246, ${interaction * 0.5})`
              : `rgba(168, 85, 247, ${interaction * 0.5})`;
            ctx.lineWidth = 1 + interaction * 2;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius + interaction * 8, 0, Math.PI * 2);
            ctx.stroke();
          }
        });

      } else if (animationType === 'waves') {
        // Enhanced wave animation with purple and blue colors
        const waveCount = 5;
        const wavesTime = Date.now() * 0.0008;
        
        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const baseAlpha = 0.25 + w * 0.12;
          
          for (let x = 0; x <= width; x += 15) {
            const dist = Math.sqrt((mouse.x - x) ** 2 + (mouse.y - height / 2) ** 2);
            const mouseInfluence = Math.max(0, 1 - dist / 400);
            
            const y = height / 2 + 
                     Math.sin((x * 0.008 + wavesTime + w * 1.5) * Math.PI) * (60 + mouseInfluence * 100) + 
                     Math.cos(wavesTime * 0.5) * 30;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          
          // Alternate between purple and blue for gradient effect
          const isPurple = w % 2 === 0;
          if (isPurple) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${baseAlpha + w * 0.08})`;
          } else {
            ctx.strokeStyle = `rgba(59, 130, 246, ${baseAlpha + w * 0.08})`;
          }
          ctx.lineWidth = 2.5 + w * 0.7;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }

      } else if (animationType === 'skillsAnimation') {
        // Amazing floating gradient blobs animation - device-compatible
        const time = Date.now() * 0.0005;
        const blobCount = 5;
        
        for (let i = 0; i < blobCount; i++) {
          // Calculate orbital positions for blobs
          const angle = (time + (i / blobCount) * Math.PI * 2) * 0.5;
          const orbitRadius = 200 + Math.sin(time * 0.3 + i * 0.8) * 100;
          
          const x = width / 2 + Math.cos(angle) * orbitRadius;
          const y = height / 2 + Math.sin(angle) * orbitRadius + Math.sin(time * 0.4 + i) * 80;
          
          // Blob size variation
          const size = 80 + Math.sin(time * 0.6 + i * 1.2) * 40;
          
          // Alternate between purple and blue
          const isPurple = i % 2 === 0;
          const hue = isPurple ? 270 : 200;
          const saturation = 70 + Math.sin(time * 0.3 + i) * 20;
          const lightness = 50 + Math.sin(time * 0.4 + i * 0.5) * 15;
          
          // Main blob with gradient
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
          gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 15}%, 0.6)`);
          gradient.addColorStop(0.7, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`);
          gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Soft glow around blob
          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 10}%, 0.4)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, size + 20, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Add some floating particles
        particles.forEach((particle, idx) => {
          particle.x += Math.sin(time + idx * 0.5) * 0.3;
          particle.y += Math.cos(time + idx * 0.5) * 0.3;
          
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
          
          const isPurple = idx % 2 === 0;
          const hue = isPurple ? 270 : 200;
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2 + Math.sin(time * 0.8 + idx) * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${0.4 + Math.sin(time + idx) * 0.3})`;
          ctx.fill();
        });

      } else if (animationType === 'projectsAnimation') {
        // Amazing rotating gradient rings animation
        const time = Date.now() * 0.0004;
        const ringCount = 8;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Draw multiple rotating rings
        for (let i = 0; i < ringCount; i++) {
          const rotation = time + (i * Math.PI / (ringCount / 2));
          const radius = 150 + i * 40;
          const opacity = 0.4 - (i * 0.05);
          
          const isPurple = i % 2 === 0;
          
          ctx.strokeStyle = isPurple
            ? `rgba(168, 85, 247, ${opacity})`
            : `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 2.5 + Math.sin(time + i) * 1;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
          
          // Add rotating dots on rings
          for (let d = 0; d < 4; d++) {
            const angle = rotation + (d * Math.PI / 2);
            const dotX = centerX + Math.cos(angle) * radius;
            const dotY = centerY + Math.sin(angle) * radius;
            
            ctx.fillStyle = isPurple
              ? `rgba(168, 85, 247, ${opacity + 0.2})`
              : `rgba(59, 130, 246, ${opacity + 0.2})`;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 3 + Math.sin(time * 1.5 + d) * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        // Central pulsing core
        const corePulse = Math.sin(time * 1.2) * 0.5 + 0.5;
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
        coreGradient.addColorStop(0, `rgba(168, 85, 247, ${0.5 + corePulse * 0.3})`);
        coreGradient.addColorStop(0.7, `rgba(59, 130, 246, ${0.3 + corePulse * 0.2})`);
        coreGradient.addColorStop(1, `rgba(147, 51, 234, 0)`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80 + corePulse * 30, 0, Math.PI * 2);
        ctx.fill();

      } else if (animationType === 'contactAnimation') {
        // Beautiful flowing wave and particle system without mouse tracking
        const time = Date.now() * 0.0006;
        
        // Animate particles with flowing motion
        particles.forEach((particle, idx) => {
          particle.x += Math.sin(time + idx * 0.3) * 0.4;
          particle.y += Math.cos(time * 0.7 + idx * 0.2) * 0.4;
          
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
          
          const isPurple = idx % 2 === 0;
          const hue = isPurple ? 270 : 200;
          const pulse = Math.sin(time * 0.8 + idx) * 0.5 + 0.5;
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2.5 + pulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${0.4 + pulse * 0.4})`;
          ctx.fill();
          
          // Soft glow
          ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${(0.2 + pulse * 0.3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 6 + pulse * 3, 0, Math.PI * 2);
          ctx.stroke();
        });
        
        // Draw flowing waves
        for (let wave = 0; wave < 4; wave++) {
          ctx.beginPath();
          const baseAlpha = 0.2 - wave * 0.04;
          const waveHeight = 40 + Math.sin(time * 0.3 + wave) * 20;
          
          for (let x = 0; x <= width; x += 20) {
            const y = height / 2 + 
                     Math.sin((x * 0.008 + time * 0.5 + wave * 1.5) * Math.PI) * waveHeight +
                     Math.cos(time * 0.4 + wave) * 30;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          
          const isPurple = wave % 2 === 0;
          ctx.strokeStyle = isPurple
            ? `rgba(168, 85, 247, ${baseAlpha})`
            : `rgba(59, 130, 246, ${baseAlpha})`;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
        
        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[j].x - particles[i].x;
            const dy = particles[j].y - particles[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 200) {
              const opacity = (200 - dist) / 400;
              ctx.strokeStyle = `rgba(147, 51, 234, ${opacity * 0.3})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

      } else if (animationType === 'simpleAnimation') {
        // Simple and amazing gradient mesh animation
        const time = Date.now() * 0.0005;
        const gridSize = 150;
        const noiseScale = 0.8;
        
        // Draw beautiful gradient mesh
        for (let x = 0; x < width; x += gridSize) {
          for (let y = 0; y < height; y += gridSize) {
            // Calculate wave based on position and time
            const waveX = Math.sin(x * 0.005 + time * 0.3) * 30;
            const waveY = Math.cos(y * 0.005 + time * 0.25) * 30;
            
            const posX = x + waveX;
            const posY = y + waveY;
            
            const isPurple = (x / gridSize + y / gridSize) % 2 === 0;
            const hue = isPurple ? 270 : 200;
            const saturation = 60 + Math.sin(time * 0.2) * 20;
            const lightness = 50 + Math.sin(time * 0.15 + x * 0.002) * 15;
            
            // Draw gradient circle at each point
            const gradient = ctx.createRadialGradient(posX, posY, 0, posX, posY, 100);
            gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`);
            gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`);
            gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(posX, posY, 100, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw connecting lines
            if (x + gridSize < width) {
              const nextX = x + gridSize + Math.sin((x + gridSize) * 0.005 + time * 0.3) * 30;
              const nextY = y + Math.cos(y * 0.005 + time * 0.25) * 30;
              
              ctx.strokeStyle = isPurple
                ? `hsla(270, 60%, 50%, 0.15)`
                : `hsla(200, 60%, 50%, 0.15)`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(posX, posY);
              ctx.lineTo(nextX, nextY);
              ctx.stroke();
            }
            
            if (y + gridSize < height) {
              const nextX = x + Math.sin(x * 0.005 + time * 0.3) * 30;
              const nextY = y + gridSize + Math.cos((y + gridSize) * 0.005 + time * 0.25) * 30;
              
              ctx.strokeStyle = isPurple
                ? `hsla(270, 60%, 50%, 0.15)`
                : `hsla(200, 60%, 50%, 0.15)`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(posX, posY);
              ctx.lineTo(nextX, nextY);
              ctx.stroke();
            }
          }
        }
        // Enhanced interactive grid with purple and blue
        const spacing = 80;
        const gridTime = Date.now() * 0.0003;
        
        for (let x = 0; x < width; x += spacing) {
          for (let y = 0; y < height; y += spacing) {
            const dist = Math.sqrt((mouse.x - x) ** 2 + (mouse.y - y) ** 2);
            const interaction = Math.max(0, 1 - dist / 350);
            const isAlternate = ((x / spacing) + (y / spacing)) % 2 === 0;
            
            // Grid point - alternating colors
            ctx.fillStyle = isAlternate
              ? `rgba(168, 85, 247, ${0.15 + interaction * 0.5})`
              : `rgba(59, 130, 246, ${0.15 + interaction * 0.5})`;
            const size = 3 + interaction * 6;
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
            
            // Interaction rings - mixed colors
            if (interaction > 0.1) {
              ctx.strokeStyle = isAlternate
                ? `rgba(59, 130, 246, ${interaction * 0.7})`
                : `rgba(168, 85, 247, ${interaction * 0.7})`;
              ctx.lineWidth = 1.5 + interaction * 2;
              ctx.beginPath();
              ctx.arc(x, y, 15 + interaction * 25, 0, Math.PI * 2);
              ctx.stroke();
            }

            // Focusing arrows on hover
            if (interaction > 0.3) {
              const angle = Math.atan2(mouse.y - y, mouse.x - x);
              const arrowLength = 20 + interaction * 15;
              
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(angle);
              
              // Arrow line
              ctx.beginPath();
              ctx.moveTo(-arrowLength, 0);
              ctx.lineTo(arrowLength, 0);
              ctx.strokeStyle = isAlternate
                ? `rgba(168, 85, 247, ${interaction * 0.8})`
                : `rgba(59, 130, 246, ${interaction * 0.8})`;
              ctx.lineWidth = 2 + interaction;
              ctx.stroke();
              
              // Arrow head
              ctx.beginPath();
              ctx.moveTo(arrowLength, 0);
              ctx.lineTo(arrowLength - 8, -5);
              ctx.lineTo(arrowLength - 8, 5);
              ctx.closePath();
              ctx.fillStyle = isAlternate
                ? `rgba(168, 85, 247, ${interaction})`
                : `rgba(59, 130, 246, ${interaction})`;
              ctx.fill();
              
              ctx.restore();
            }
          }
        }

      } else if (animationType === 'dots') {
        // Enhanced connected dots with purple and blue colors
        const dotCount = 25;
        const dotsTime = Date.now() * 0.0004;
        
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2 + dotsTime * 0.3;
          const radius = 250 + Math.sin(dotsTime * 0.5 + i) * 120;
          const x = width / 2 + Math.cos(angle) * radius;
          const y = height / 2 + Math.sin(angle) * radius;
          
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const interaction = Math.max(0, 1 - distance / 250);
          const isPurple = i % 2 === 0;
          
          // Orbital dot
          ctx.beginPath();
          ctx.arc(x, y, 4 + interaction * 6, 0, Math.PI * 2);
          ctx.fillStyle = isPurple
            ? `rgba(168, 85, 247, ${0.4 + interaction * 0.6})`
            : `rgba(59, 130, 246, ${0.4 + interaction * 0.6})`;
          ctx.fill();
          
          // Glow halo - mixed colors
          ctx.strokeStyle = isPurple
            ? `rgba(59, 130, 246, ${interaction * 0.5})`
            : `rgba(168, 85, 247, ${interaction * 0.5})`;
          ctx.lineWidth = 1.5 + interaction * 2;
          ctx.beginPath();
          ctx.arc(x, y, 8 + interaction * 12, 0, Math.PI * 2);
          ctx.stroke();
          
          // Connection lines to neighbors
          const nextAngle = ((i + 1) / dotCount) * Math.PI * 2 + dotsTime * 0.3;
          const nextRadius = 250 + Math.sin(dotsTime * 0.5 + i + 1) * 120;
          const nextX = width / 2 + Math.cos(nextAngle) * nextRadius;
          const nextY = height / 2 + Math.sin(nextAngle) * nextRadius;
          
          ctx.strokeStyle = isPurple
            ? `rgba(168, 85, 247, ${(0.1 + interaction * 0.2)})`
            : `rgba(59, 130, 246, ${(0.1 + interaction * 0.2)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
        
        // Pulsing center - gradient purple to blue
        const centerPulse = Math.sin(dotsTime) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 8 + centerPulse * 10, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${0.6 + centerPulse * 0.3})`;
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 8 + centerPulse * 10, 0, Math.PI * 2);
        ctx.stroke();

      } else if (animationType === 'floatingOrbs') {
        // Floating orbs with purple and blue color scheme - more visible
        particles.forEach((particle, idx) => {
          const time = Date.now() * 0.001;
          
          // Gentle floating motion
          particle.x += Math.sin(time + idx) * 0.5;
          particle.y += Math.cos(time + idx) * 0.5;

          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;

          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const interaction = Math.max(0, 1 - distance / 400);
          const isPurple = idx % 2 === 0;

          // Main orb - alternating colors with increased opacity
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 5 + interaction * 8, 0, Math.PI * 2);
          ctx.fillStyle = isPurple
            ? `rgba(168, 85, 247, ${0.35 + interaction * 0.65})`
            : `rgba(59, 130, 246, ${0.35 + interaction * 0.65})`;
          ctx.fill();

          // Outer glow - mixed colors with increased visibility
          ctx.strokeStyle = isPurple
            ? `rgba(59, 130, 246, ${0.35 + interaction * 0.75})`
            : `rgba(168, 85, 247, ${0.35 + interaction * 0.75})`;
          ctx.lineWidth = 2.5 + interaction * 4;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 10 + interaction * 15, 0, Math.PI * 2);
          ctx.stroke();

          // Connection to nearby orbs with better visibility
          particles.forEach((otherParticle, otherIdx) => {
            if (otherIdx !== idx) {
              const dx2 = otherParticle.x - particle.x;
              const dy2 = otherParticle.y - particle.y;
              const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
              
              if (dist2 < 200) {
                ctx.strokeStyle = isPurple
                  ? `rgba(168, 85, 247, ${(200 - dist2) / 300})`
                  : `rgba(59, 130, 246, ${(200 - dist2) / 300})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
              }
            }
          });
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationType === 'grid' || animationType === 'waves' || animationType === 'particles') {
        window.removeEventListener('mousemove', updateMouse);
      }
      cancelAnimationFrame(requestRef.current);
    };
  }, [animationType]);

  return canvasRef;
};

// Animation components for each section
export const AnimatedAboutBackground = () => {
  const canvasRef = useAnimatedBackground('about-canvas', 'floatingOrbs');
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};

export const AnimatedSkillsBackground = () => {
  const canvasRef = useAnimatedBackground('skills-canvas', 'waves');
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};

export const AnimatedProjectsBackground = () => {
  const canvasRef = useAnimatedBackground('projects-canvas', 'grid');
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};

export const AnimatedContactBackground = () => {
  const canvasRef = useAnimatedBackground('contact-canvas', 'dots');
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};
