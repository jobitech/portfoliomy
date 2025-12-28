import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader } from 'lucide-react';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills');
      const data = await response.json();
      setSkills(data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      setError('Please enter a skill name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSkill)
      });

      if (response.ok) {
        const data = await response.json();
        setSkills([...skills, data]);
        setNewSkill({ name: '', level: 'Intermediate' });
        setSuccess('Skill added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add skill');
      }
    } catch (err) {
      setError('Error adding skill');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/skills/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSkills(skills.filter(skill => skill.id !== id));
        setSuccess('Skill deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete skill');
      }
    } catch (err) {
      setError('Error deleting skill');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Manage Skills</h2>

      {/* Add New Skill */}
      <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 space-y-6">
        <h3 className="text-xl font-semibold">Add New Skill</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name"
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
          />

          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
          >
            {levels.map(level => (
              <option key={level} value={level} className="bg-gray-900">
                {level}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddSkill}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Plus size={20} />}
            Add Skill
          </button>
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

      {/* Skills List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Current Skills</h3>
        {skills.length === 0 ? (
          <p className="text-gray-400">No skills added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map(skill => (
              <div
                key={skill.id}
                className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-white">{skill.name}</h4>
                  <p className="text-sm text-gray-400">{skill.level}</p>
                </div>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
