import React, { useRef, useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('NEgD3IDvT2fa9ootC');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    // Create flowing particle system similar to wave animation
    const particles = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: Math.random() * 2 + 1,
        life: 1,
        angle: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.08 + 0.04
      });
    }

    const animate = () => {
      // Fade effect instead of clear
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.016;

      particles.forEach((p, idx) => {
        // Wave-like motion - smooth movement
        p.angle += p.frequency;
        const waveX = Math.cos(p.angle) * 2;
        const waveY = Math.sin(time * 0.005 + idx) * 2;
        
        p.x += waveX + p.vx;
        p.y += waveY + p.vy;

        // Distance to mouse for attraction
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interaction = Math.max(0, 1 - distance / 300);

        // Attract particles toward cursor
        if (distance < 500) {
          const angle = Math.atan2(dy, dx);
          const attractForce = (1 - distance / 500) * 0.4;
          p.vx += Math.cos(angle) * attractForce;
          p.vy += Math.sin(angle) * attractForce;
        }

        // Damping
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Keep particles on screen by wrapping
        if (p.x < -100) p.x = canvas.width + 100;
        if (p.x > canvas.width + 100) p.x = -100;
        if (p.y < -100) p.y = canvas.height + 100;
        if (p.y > canvas.height + 100) p.y = -100;

        // Draw particle with glow
        const opacity = 0.4 + interaction * 0.5;
        
        // Main particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + interaction * 3, 0, Math.PI * 2);
        
        // Alternating purple and blue colors
        if (idx % 2 === 0) {
          ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`;
        } else {
          ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        }
        ctx.fill();

        // Add strong glow on interaction
        if (interaction > 0.3) {
          ctx.strokeStyle = idx % 2 === 0 ? `rgba(168, 85, 247, ${interaction * 0.8})` : `rgba(59, 130, 246, ${interaction * 0.8})`;
          ctx.lineWidth = 2 + interaction * 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + interaction * 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw connections between particles with enhanced effect
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (150 - dist) / 300;
            ctx.strokeStyle = `rgba(147, 51, 234, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw smooth wave layers in background
      for (let layer = 0; layer < 3; layer++) {
        ctx.strokeStyle = layer === 0 ? `rgba(168, 85, 247, 0.12)` : layer === 1 ? `rgba(59, 130, 246, 0.1)` : `rgba(168, 85, 247, 0.08)`;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x += 20) {
          const y = canvas.height / 2 + Math.sin((x * 0.01 + time * (0.5 + layer * 0.2)) + layer) * (30 + layer * 10);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const templateParams = {
      to_email: 'jobinbabu161@gmail.com',
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    emailjs.send('service_we3byq7', 'template_0fpk4j8', templateParams)
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        alert('Message sent successfully! I will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      }, (error) => {
        console.log('Failed to send email.', error);
        alert('Failed to send message. Please try again.');
      });
  };

  return (
    <section id="contact" className="py-16 md:py-24 px-4 sm:px-8 md:px-12 relative z-10 bg-gradient-to-b from-zinc-950 to-black border-t border-white/10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 -z-10"></div>
      <div className="max-w-6xl mx-auto relative">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4">Let's Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Together</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                <Mail className="text-purple-300 w-5 sm:w-6 h-5 sm:h-6" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Email</h3>
                <p className="text-gray-300 text-sm sm:text-base">jobinbabu161@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                <Phone className="text-blue-300 w-5 sm:w-6 h-5 sm:h-6" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Phone</h3>
                <p className="text-gray-300 text-sm sm:text-base">+91 9953661792</p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                <MapPin className="text-purple-300 w-5 sm:w-6 h-5 sm:h-6" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Location</h3>
                <p className="text-gray-300 text-sm sm:text-base">Badarpur, New Delhi-44</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all resize-none text-sm sm:text-base"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Send size={16} className="sm:w-5 sm:h-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
