import React from 'react';
import { Instagram, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/_iam_jobin_' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/jobitech' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/jobin-babu-872462325/' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' }
  ];

  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 relative z-10 border-t border-white/10 bg-black text-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 md:gap-24 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto">
          <div className="flex gap-4">
            {socialLinks.map(social => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                title={social.name}
              >
                <social.icon size={18} className="sm:w-5 sm:h-5" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 pl-0 sm:pl-4 sm:border-l border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-mono text-xs text-gray-400">AVAILABLE FOR WORK</span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 text-center sm:text-left text-xs text-gray-600 font-mono">
        © 2025 JOBIN BABU. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};

export default Footer;