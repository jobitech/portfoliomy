import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';

const HeroEditor = () => {
  const [heroContent, setHeroContent] = useState({
    main_text: '',
    sub_text: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hero');
      const data = await response.json();
      setHeroContent(data);
    } catch (err) {
      console.error('Error fetching hero content:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(heroContent)
      });

      if (response.ok) {
        setSuccess('Hero section updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update hero section');
      }
    } catch (err) {
      setError('Error updating hero section');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">Edit Hero Section</h2>
        
        <div className="space-y-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Main Heading Text
            </label>
            <textarea
              value={heroContent.main_text}
              onChange={(e) => setHeroContent({ ...heroContent, main_text: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all resize-none"
              rows="3"
              placeholder="Enter main heading text"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Subheading Text
            </label>
            <textarea
              value={heroContent.sub_text}
              onChange={(e) => setHeroContent({ ...heroContent, sub_text: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all resize-none"
              rows="2"
              placeholder="Enter subheading text"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
              {success}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
