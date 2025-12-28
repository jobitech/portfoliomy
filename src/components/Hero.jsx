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
    <>
      <style>{`
        @keyframes slideInRight {
          from { width: 0; opacity: 0; }
          to { width: 40px; opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-line { animation: slideInRight 1s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      <section 
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 pt-20 pb-20 relative z-10 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(88,28,135,0.5) 100%), url('${profileImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="fixed bottom-20 right-8 flex flex-col gap-3 opacity-60 pointer-events-none hidden md:flex">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-float" style={{animationDelay: '0.3s'}}></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-float" style={{animationDelay: '0.6s'}}></div>
        </div>

        <div className="max-w-3xl relative z-20 text-center">
          <div className="mb-8 flex items-center gap-4 justify-center">
            <span className="h-px bg-gradient-to-r from-purple-500 to-blue-500 animate-line" style={{width: '40px'}}></span>
            <span className="font-mono text-purple-300 uppercase tracking-widest text-xs sm:text-sm animate-fade-in-up" style={{animation: 'fadeInUp 0.8s ease-out 0.2s forwards', opacity: 0}}>Creative Developer & AI/ML Explorer</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 text-white animate-fade-in-up" style={{animation: 'fadeInUp 0.8s ease-out 0.3s forwards', opacity: 0}}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500">JOBIN BABU</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-purple-200 font-mono mb-6 animate-fade-in-up" style={{animation: 'fadeInUp 0.8s ease-out 0.4s forwards', opacity: 0}}>
            {heroContent.sub_text}
          </p>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed mb-8 animate-fade-in-up" style={{animation: 'fadeInUp 0.8s ease-out 0.5s forwards', opacity: 0}}>
            {heroContent.bio}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-fit animate-fade-in-up" style={{animation: 'fadeInUp 0.8s ease-out 0.6s forwards', opacity: 0}}>
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
      </section>
    </>
  );
};

export default Hero;
