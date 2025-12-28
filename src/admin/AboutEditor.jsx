import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader } from 'lucide-react';

const AboutEditor = () => {
  const [aboutContent, setAboutContent] = useState({
    bio: '',
    photo: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/about`);
      const data = await response.json();
      setAboutContent(data);
      if (data.photo) {
        setPhotoPreview(`${API_URL}${data.photo}`);
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('bio', aboutContent.bio);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await fetch(`${API_URL}/api/about`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setAboutContent(data);
        setPhotoFile(null);
        setSuccess('About section updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update about section');
      }
    } catch (err) {
      setError('Error updating about section');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">Edit About Section</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bio Editor */}
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Biography
              </label>
              <textarea
                value={aboutContent.bio}
                onChange={(e) => setAboutContent({ ...aboutContent, bio: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all resize-none"
                rows="8"
                placeholder="Enter your biography"
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
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Photo Upload */}
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Profile Photo
              </label>
              
              {photoPreview && (
                <div className="mb-4 relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <label className="block">
                <span className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/15 hover:text-white transition-all cursor-pointer">
                  <Upload size={20} />
                  Choose Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutEditor;
