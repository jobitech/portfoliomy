import React, { useState, useEffect } from 'react';
import { Code2, Cpu, Globe, Palette } from 'lucide-react';
import { useAnimatedBackground } from './AnimatedBackgrounds';

const Skills = () => {
  const canvasRef = useAnimatedBackground('skills-canvas', 'skillsAnimation');
  const [skills, setSkills] = useState([
    { icon: Code2, title: "HTML", desc: "Markup & Structure", percentage: 100 },
    { icon: Code2, title: "CSS", desc: "Styling & Animations", percentage: 100 },
    { icon: Globe, title: "JavaScript", desc: "Core Scripting", percentage: 90 },
    { icon: Cpu, title: "React", desc: "Frontend Framework", percentage: 40 },
    { icon: Palette, title: "Tailwind CSS", desc: "Styling Framework", percentage: 90 },
    { icon: Cpu, title: "Node.js", desc: "Backend Development", percentage: 50 },
    { icon: Code2, title: "PHP", desc: "Server-side Language", percentage: 100 },
    { icon: Cpu, title: "Python", desc: "AI/ML & Scripting", percentage: 50 },
    { icon: Globe, title: "SQL", desc: "Database Management", percentage: 50 },
  ]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills');
      const data = await response.json();
      if (data && Array.isArray(data)) {
        const skillsWithPercentages = data.map(skill => {
          const levelMap = {
            'Beginner': 40,
            'Intermediate': 70,
            'Advanced': 90,
            'Expert': 100
          };
          return {
            title: skill.name,
            desc: skill.level || 'Technical Skill',
            percentage: levelMap[skill.level] || 50,
            icon: Code2
          };
        });
        setSkills(skillsWithPercentages);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-8 md:px-12 relative bg-zinc-950 border-t border-white/10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 pointer-events-none"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16">
          <span className="text-purple-400 font-mono text-xs sm:text-sm tracking-widest uppercase">Expertise</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
            My <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Skills</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-20">
          {skills.map((skill, idx) => (
            <div key={idx} className="p-6 sm:p-8 border border-white/10 rounded-xl bg-gradient-to-br from-white/5 to-white/0 hover:bg-white/10 transition-all hover:-translate-y-2 duration-300 backdrop-blur-sm hover:border-purple-500/50">
              <skill.icon className="text-purple-400 mb-6 w-7 sm:w-8 h-7 sm:h-8" size={28} />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{skill.title}</h3>
              <p className="text-gray-400 font-mono text-xs sm:text-sm mb-6">{skill.desc}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm font-bold text-purple-400 w-8 sm:w-10 text-right">{skill.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;