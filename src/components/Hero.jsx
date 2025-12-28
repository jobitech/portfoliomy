import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronDown, Download } from 'lucide-react';

const Hero = () => {
  const [heroContent, setHeroContent] = useState({
    main_text: 'CREATING BEYOND LIMITS',
    sub_text: 'Full Stack Developer & Creative Technologist'
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
    // Create a link to download resume
    const link = document.createElement('a');
    link.href = '/resume.pdf'; // Make sure you have resume.pdf in public folder
    link.download = 'Jobin_Babu_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 pt-24 sm:pt-20 relative z-10">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-6 sm:mb-8 flex items-center gap-4 animate-fade-in-up">
          <span className="h-px w-12 bg-gradient-to-r from-purple-500 to-blue-500"></span>
          <span className="font-mono text-purple-400 uppercase tracking-widest text-xs sm:text-sm">Creative Developer</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8 md:mb-12 mix-blend-overlay opacity-90 text-white">
           {heroContent.main_text.split(' ').map((word, idx) => (
             <React.Fragment key={idx}>
               {word === 'BEYOND' ? (
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 animate-gradient-x">
                   {word}
                 </span>
               ) : (
                 word
               )}
               {idx < heroContent.main_text.split(' ').length - 1 && ' '}
               {(idx + 1) % 2 === 0 && <br />}
             </React.Fragment>
           ))}
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-end justify-between">
          <p className="max-w-md text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed">
            {heroContent.sub_text}
          </p>

          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full sm:w-fit">
            <button onClick={handleViewWork} className="group flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-8 py-3 sm:py-4 border border-purple-500/50 rounded-full text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:border-transparent transition-all duration-300 w-full sm:w-fit text-sm sm:text-base">
              <span className="font-bold tracking-widest uppercase">View Work</span>
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center group-hover:bg-white group-hover:text-purple-600 transition-colors">
                 <ArrowUpRight size={14} />
              </div>
            </button>

            <button onClick={handleResumeDownload} className="group flex items-center gap-4 px-8 py-4 border border-purple-500/50 rounded-full text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:border-transparent transition-all duration-300 w-fit">
              <span className="font-bold tracking-widest uppercase text-sm">Resume</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center group-hover:bg-white group-hover:text-purple-600 transition-colors">
                 <Download size={16} />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

export default Hero;