import React, { useState, useEffect } from 'react';
import { useAnimatedBackground } from './AnimatedBackgrounds';

const About = () => {
  const canvasRef = useAnimatedBackground('about-canvas', 'floatingOrbs');
  const [aboutContent, setAboutContent] = useState({
    bio: 'I\'m a passionate developer dedicated to creating stunning web experiences that blend creativity with functionality. I believe in writing clean code and designing intuitive interfaces.'
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/about');
      const data = await response.json();
      if (data && data.bio) {
        setAboutContent(data);
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Content Section - Left and Center */}
          <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
            <div className="group">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></span>
                Who I Am
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {aboutContent.bio}
              </p>
            </div>

            <div className="group">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></span>
                My Approach
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                I approach every project with <span className="text-blue-300 font-semibold">excellence</span>, combining <span className="text-purple-300 font-semibold">modern technologies</span> with <span className="text-cyan-300 font-semibold">creative problem-solving</span> to deliver results that exceed expectations.
              </p>
            </div>

            <div className="group">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full"></span>
                What Drives Me
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                My journey is driven by <span className="text-cyan-300 font-semibold">curiosity</span> and a love for <span className="text-blue-300 font-semibold">solving complex problems</span>. Whether it's <span className="text-purple-300 font-semibold">frontend magic</span> with React or backend logic with Python, I create seamless experiences.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 py-6 md:py-8 border-t border-b border-white/10">
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
            </div>

            {/* Button */}
            <a
              href="#contact"
              className="inline-block px-6 md:px-8 py-3 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold text-sm md:text-base hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Get In Touch
            </a>
          </div>

          {/* Image Section - Right */}
          <div className="lg:col-span-6 relative group flex justify-center lg:justify-end items-start order-first lg:order-2 pt-0 lg:pt-8">
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              {/* Animated background orbs */}
              <div className="absolute -inset-12 rounded-full bg-gradient-to-br from-purple-600/40 via-blue-600/20 to-cyan-600/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Outer decorative ring with gradient */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-md"></div>
              
              {/* Premium metallic frame - double border effect */}
              <div className="absolute -inset-3.5 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="absolute -inset-3 rounded-full border-2 border-gradient-to-r from-purple-500/60 via-blue-500/40 to-cyan-500/60 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Inner bright ring */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              
              {/* Main image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl group-hover:shadow-purple-500/60 transition-all duration-500">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/30 z-5"></div>
                
                {/* Image */}
                <img 
                  src="/src/assets/profile 1 .jpeg" 
                  alt="Jobin Babu" 
                  className="w-full h-full object-cover object-center scale-125 group-hover:scale-150 transition-transform duration-700"
                  style={{ objectPosition: '50% 40%' }}
                />
                
                {/* Darken overlay - visible normally, hidden on hover */}
                <div className="absolute inset-0 bg-black/25 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                
                {/* Premium overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-full"></div>
              </div>
              
              {/* Floating accent elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
