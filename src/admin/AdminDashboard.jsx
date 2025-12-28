import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import HeroEditor from './HeroEditor';
import AboutEditor from './AboutEditor';
import SkillsManager from './SkillsManager';
import ProjectsManager from './ProjectsManager';
import SettingsManager from './SettingsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'hero', label: 'Hero', icon: '🎯' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '🎨' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings size={28} className="text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 sticky top-16 z-40 bg-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'hero' && <HeroEditor />}
        {activeTab === 'about' && <AboutEditor />}
        {activeTab === 'skills' && <SkillsManager />}
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
