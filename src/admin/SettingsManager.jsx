import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import API_URL from '../config/api';

const SettingsManager = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [socialRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/api/social-links`),
        fetch(`${API_URL}/api/settings`)
      ]);

      const socialData = await socialRes.json();
      const settingsData = await settingsRes.json();

      setSocialLinks(Array.isArray(socialData) ? socialData : []);
      setContactEmail(settingsData.contact_email || '');
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSaveSocialLink = async (id, url) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/social-links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });

      if (response.ok) {
        setSuccess('Social link updated!');
        setTimeout(() => setSuccess(''), 2000);
        setTimeout(() => fetchData(), 500);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update');
      }
    } catch (err) {
      setError('Error updating social link');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contact_email: contactEmail })
      });

      if (response.ok) {
        setSuccess('Contact email updated!');
        setTimeout(() => setSuccess(''), 2000);
        setTimeout(() => fetchData(), 500);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update');
      }
    } catch (err) {
      setError('Error updating email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Settings & Social Links</h2>

      {/* Contact Email */}
      <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Email</h3>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Email for contact form submissions
          </label>
          <div className="flex gap-4">
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
              placeholder="Enter contact email"
            />
            <button
              onClick={handleSaveEmail}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 space-y-6">
        <h3 className="text-xl font-semibold">Social Media Links</h3>

        {socialLinks.map((link) => (
          <div key={link.id} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              {link.platform}
            </label>
            <div className="flex gap-4">
              <input
                type="url"
                value={link.url}
                onChange={(e) => {
                  setSocialLinks(socialLinks.map(l => 
                    l.id === link.id ? { ...l, url: e.target.value } : l
                  ));
                }}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                placeholder={`Enter ${link.platform} URL`}
              />
              <button
                onClick={() => handleSaveSocialLink(link.id, link.url)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                Save
              </button>
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default SettingsManager;
