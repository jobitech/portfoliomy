import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import profileImage from '../assets/profile 1 .jpeg';

const Hero = () => {
  const [heroContent, setHeroContent] = useState({
    main_text: 'JOBIN BABU',
    sub_text: 'Full Stack Developer & Creative Technologist',
    bio: 'I\'m a passionate developer dedicated to creating stunning web experiences that blend creativity with functionality. I believe in writing clean code and designing intuitive interfaces.'
  });

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hero');
      const data = await response.json();
      if (data && data.main_text) {
        setHeroContent(data);
      }
    } catch (err) {
      console.error('Error fetching hero content:', err);
    }
  };

  const handleViewWork = () => {
    const element = document.getElementById('projects-gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Jobin_Babu_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 pt-20 pb-20 relative z-10">
      <div className="max-w-6xl mx-auto w-full">
        {/* Decorative elements - top left */}
        <div className="absolute top-32 left-4 md:left-12 flex gap-2 opacity-60 pointer-events-none">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
        </div>

        {/* Decorative elements - top right */}
        <div className="absolute top-48 right-4 md:right-12 flex flex-col gap-2 opacity-60 pointer-events-none">
          <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-transparent"></div>
          <div className="h-1 w-6 bg-gradient-to-r from-blue-400 to-transparent"></div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Profile Image */}
          <div className="flex justify-center md:justify-start order-1 md:order-1">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 group">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-colors duration-500"></div>
              <div className="absolute -inset-4 rounded-full border border-purple-400/20 group-hover:border-purple-400/40 transition-colors duration-500"></div>
              
              {/* Image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl group-hover:shadow-purple-500/60 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/30 z-5"></div>
                <img 
                  src={profileImage} 
                  alt="Jobin Babu" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: '50% 40%' }}
                />
                <div className="absolute inset-0 bg-black/10 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
              </div>

              {/* Decorative nails */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -top-3 -right-3 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity delay-100"></div>
              <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity delay-200"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-70 group-hover:opacity-100 transition-opacity delay-300"></div>
            </div>
          </div>

          {/* Right side - Text content */}
          <div className="flex flex-col justify-center order-2 md:order-2">
            <div className="mb-4 sm:mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-gradient-to-r from-purple-500 to-blue-500"></span>
              <span className="font-mono text-purple-400 uppercase tracking-widest text-xs sm:text-sm">Who Am I</span>
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1] mb-4 sm:mb-6 text-white">
              {heroContent.main_text.split(' ').map((word, idx) => (
                <React.Fragment key={idx}>
                  {word === 'BABU' ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                  {idx < heroContent.main_text.split(' ').length - 1 && ' '}
                  <br />
                </React.Fragment>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-purple-300 font-mono mb-6 sm:mb-8">
              {heroContent.sub_text}
            </p>

            {/* About Bio */}
            <p className="max-w-md text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed mb-8 sm:mb-10">
              {heroContent.bio}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-fit">
              <button onClick={handleViewWork} className="group flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-8 py-3 sm:py-4 border border-purple-500/50 rounded-full text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:border-transparent transition-all duration-300 text-sm sm:text-base">
                <span className="font-bold tracking-widest uppercase">View Work</span>
                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center group-hover:bg-white group-hover:text-purple-600 transition-colors">
                  <ArrowUpRight size={14} />
                </div>
              </button>

              <button onClick={handleResumeDownload} className="group flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-8 py-3 sm:py-4 border border-purple-500/50 rounded-full text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:border-transparent transition-all duration-300 text-sm sm:text-base">
                <span className="font-bold tracking-widest uppercase">Resume</span>
                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center group-hover:bg-white group-hover:text-purple-600 transition-colors">
                  <Download size={16} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements - bottom */}
        <div className="absolute bottom-20 right-4 md:right-12 flex flex-col gap-3 opacity-60 pointer-events-none">
          <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-transparent"></div>
          <div className="h-1 w-8 bg-gradient-to-r from-cyan-400 to-transparent"></div>
          <div className="h-1 w-4 bg-gradient-to-r from-cyan-300 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;