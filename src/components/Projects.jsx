import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useAnimatedBackground } from './AnimatedBackgrounds';

const Projects = () => {
  const canvasRef = useAnimatedBackground('projects-canvas', 'projectsAnimation');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setProjects(data.slice(0, 3)); // Show first 3 projects
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  return (
    <section className="py-24 px-8 md:px-12 relative z-10 bg-black border-t border-white/10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 -z-10"></div>
      <div className="max-w-6xl mx-auto relative">
         <div className="mb-16 flex justify-between items-end">
          <div>
            <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase">Selected Work</span>
            <h2 className="text-4xl font-bold text-white mt-4">Featured Projects</h2>
          </div>
          <a href="#projects-gallery" className="hidden md:block text-white hover:text-pink-500 font-mono text-sm underline underline-offset-4 transition-colors">View All</a>
        </div>

        <div className="grid gap-8">
          {projects.map((p, idx) => (
            <div key={p.id || idx} className="group relative h-64 md:h-80 w-full border border-white/10 rounded-2xl overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
              <div className="absolute inset-0 bg-gray-900 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                 <span className="text-gray-700 font-bold text-6xl opacity-20">0{idx + 1}</span>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex justify-between items-end">
                <div>
                  <p className="text-pink-500 font-mono text-xs mb-2">{p.category || 'Project'}</p>
                  <h3 className="text-3xl font-bold text-white group-hover:translate-x-2 transition-transform">{p.title}</h3>
                </div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-pink-500 transition-colors">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;