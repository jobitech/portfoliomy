import React, { useState, useMemo, useRef } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { getAllProjects, searchProjects } from '../data/projectsData';
import { useAnimatedBackground } from './AnimatedBackgrounds';

const ProjectsGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);
  const canvasRef = useAnimatedBackground('gallery-canvas', 'waves');

  const filteredProjects = useMemo(() => {
    if (searchQuery.trim()) {
      return searchProjects(searchQuery);
    }
    return getAllProjects();
  }, [searchQuery]);

  // Duplicate projects for seamless loop
  const loopProjects = [...filteredProjects, ...filteredProjects];

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!carouselRef.current) return;
    
    const difference = touchStart - touchEnd;
    const carousel = carouselRef.current;
    
    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        carousel.scrollBy({ left: 400, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: -400, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
      {/* Animated Background Canvas - Full screen behind */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 opacity-50 pointer-events-none z-0"
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-12 sm:mb-16 text-center max-w-6xl mx-auto px-4 sm:px-8">
          <span className="text-cyan-500 font-mono text-xs sm:text-sm tracking-widest uppercase">All Work</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            Projects <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Gallery</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Explore all my projects and creative works
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 sm:mb-12 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus-within:border-purple-500 transition-colors">
            <Search className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 mr-2 sm:mr-3" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 sm:mb-8 max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-gray-400 text-sm sm:text-base">
            Found <span className="text-purple-400 font-semibold">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Carousel Container with Animation Behind */}
        {filteredProjects.length > 0 ? (
          searchQuery.trim() ? (
            // Grid view when searching - centered
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl">
                  {filteredProjects.map((project, index) => (
                    <div
                      key={project.id}
                      className="group relative flex-shrink-0 h-80 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                        <span className="text-gray-700 font-bold text-5xl opacity-20">{String(index + 1).padStart(2, '0')}</span>
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                        <div className="mb-3">
                          <p className="text-purple-400 font-mono text-xs mb-2">{project.category}</p>
                          <h3 className="text-2xl font-bold text-white group-hover:translate-x-2 transition-transform">
                            {project.title}
                          </h3>
                          <p className="text-gray-300 text-sm mt-2 line-clamp-1">{project.description}</p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-purple-500 transition-colors">
                            <ExternalLink size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Carousel view - now with touch support
            <div className="overflow-hidden relative mb-12">
              {/* Gradient fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-30 pointer-events-none hidden md:block"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-30 pointer-events-none hidden md:block"></div>
              
              <div 
                ref={carouselRef}
                className="flex gap-8 px-4 sm:px-8 relative z-20 overflow-x-auto scroll-smooth scrollbar-hide md:overflow-x-hidden"
                style={{
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Desktop: animated carousel */}
                <style>{`
                  @media (min-width: 768px) {
                    .carousel-loop {
                      animation: scroll ${Math.max(15, filteredProjects.length * 2)}s linear infinite;
                    }
                  }
                  @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-100% / 2)); }
                  }
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                
                <div 
                  className="flex gap-8 md:carousel-loop"
                  style={{
                    minWidth: 'max-content',
                  }}
                >
                  {loopProjects.map((project, index) => (
                  <div
                    key={`${project.id}-${index}`}
                    className="group relative flex-shrink-0 w-96 h-80 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                      <span className="text-gray-700 font-bold text-5xl opacity-20">{String((index % filteredProjects.length) + 1).padStart(2, '0')}</span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                      <div className="mb-3">
                        <p className="text-purple-400 font-mono text-xs mb-2">{project.category}</p>
                        <h3 className="text-2xl font-bold text-white group-hover:translate-x-2 transition-transform">
                          {project.title}
                        </h3>
                        <p className="text-gray-300 text-sm mt-2 line-clamp-1">{project.description}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-purple-500 transition-colors">
                          <ExternalLink size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-20 max-w-6xl mx-auto px-8">
            <p className="text-gray-400 text-lg">No projects found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsGallery;
