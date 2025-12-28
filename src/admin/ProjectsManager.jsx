import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Upload, Loader } from 'lucide-react';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    link: '',
    category: ''
  });
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [projectImagePreview, setProjectImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProjectImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('title', newProject.title);
      formData.append('description', newProject.description);
      formData.append('link', newProject.link);
      formData.append('category', newProject.category);
      if (projectImageFile) {
        formData.append('image', projectImageFile);
      }

      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setProjects([...projects, data]);
        setNewProject({ title: '', description: '', link: '', category: '' });
        setProjectImageFile(null);
        setProjectImagePreview('');
        setSuccess('Project added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add project');
      }
    } catch (err) {
      setError('Error adding project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/projects/${editingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== id));
        setSuccess('Project deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete project');
      }
    } catch (err) {
      setError('Error deleting project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Manage Projects</h2>

      {/* Add New Project */}
      <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 space-y-6">
        <h3 className="text-xl font-semibold">Add New Project</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Project title"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
            />

            <input
              type="text"
              value={newProject.category}
              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
              placeholder="Category"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
            />

            <input
              type="url"
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              placeholder="Project link (optional)"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
            />

            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Project description"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all resize-none"
              rows="4"
            />
          </div>

          <div className="space-y-4">
            {projectImagePreview && (
              <div className="mb-4 relative">
                <img
                  src={projectImagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <label className="block">
              <span className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/15 hover:text-white transition-all cursor-pointer">
                <Upload size={20} />
                Choose Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <button
              onClick={handleAddProject}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : <Plus size={20} />}
              Add Project
            </button>
          </div>
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

      {/* Projects List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Current Projects</h3>
        {projects.length === 0 ? (
          <p className="text-gray-400">No projects added yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg">{project.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300 mt-2">
                      View Project →
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="ml-4 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition-all"
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

export default ProjectsManager;
