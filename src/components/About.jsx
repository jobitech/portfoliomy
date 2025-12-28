import React, { useState, useEffect } from 'react';
import { useAnimatedBackground } from './AnimatedBackgrounds';
import profileImage from '../assets/profile 1 .jpeg';
import API_URL from '../config/api';

const About = () => {
  const canvasRef = useAnimatedBackground('about-canvas', 'floatingOrbs');
  const [aboutContent, setAboutContent] = useState({
    bio: 'I\'m a passionate developer dedicated to creating stunning web experiences that blend creativity with functionality. I believe in writing clean code and designing intuitive interfaces.',
    approach: 'I approach every project with excellence, combining modern technologies with creative problem-solving to deliver results that exceed expectations.',
    drives: 'My journey is driven by curiosity and a love for solving complex problems. Whether it\'s frontend magic with React or backend logic with Python, I create seamless experiences.'
  });

  useEffect(() => {
    fetchAboutContent();
    // Refetch every 5 seconds to get updates from admin panel
    const interval = setInterval(fetchAboutContent, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/about`);
      const data = await response.json();
      if (data) {
        setAboutContent({
          bio: data.bio || '',
          approach: data.approach || '',
          drives: data.drives || ''
        });
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
    }
  };

  return (
    <section id="about" className="py-16 md:py-24 px-4 md:px-8 lg:px-12 relative z-10 bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-20" />
      
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <span className="text-cyan-500 font-mono text-xs md:text-sm tracking-widest uppercase">About Me</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-2">
            I'm a <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Creative Developer</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base">Building Digital Experiences</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Content Section */}
          <div className="space-y-8 max-w-4xl mx-auto w-full">

            <div className="group">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></span>
                My Approach
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {aboutContent.approach}
              </p>
            </div>

            <div className="group">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full"></span>
                What Drives Me
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {aboutContent.drives}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-6 md:py-8 border-t border-b border-white/10">
              <div className="text-center group">
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">10+</p>
                <p className="text-gray-400 text-xs md:text-sm mt-2 font-semibold">Projects</p>
              </div>
              <div className="text-center group">
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">2+</p>
                <p className="text-gray-400 text-xs md:text-sm mt-2 font-semibold">Years Dev</p>
              </div>
              <div className="text-center group">
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">6</p>
                <p className="text-gray-400 text-xs md:text-sm mt-2 font-semibold">Tech Skills</p>
              </div>
              <div className="text-center group">
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">6 Mo</p>
                <p className="text-gray-400 text-xs md:text-sm mt-2 font-semibold">Experience</p>
              </div>
            </div>

            {/* Button */}
            <a
              href="#contact"
              className="inline-block px-6 md:px-8 py-3 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold text-sm md:text-base hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Get In Touch
            </a>
          </div>


        </div>
      </div>
    </section>
  );
};

export default About;
