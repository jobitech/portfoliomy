# Projects System Guide

## How to Add New Projects

Your portfolio now has a scalable projects system! Here's how to add new projects:

### 1. Add Project to Data File
Edit `/src/data/projectsData.js` and add a new project object:

```javascript
{
  id: 4,  // Use next available number
  title: "Your Project Title",
  category: "Web Dev / Design / Backend",
  description: "Brief description of what this project does",
  tags: ["React", "Tailwind CSS", "Node.js"],  // Add relevant tech
  featured: true,  // Set to true to show on homepage, false for gallery only
  year: 2024
}
```

### 2. Where Projects Appear

- **Homepage (Featured Section)**: Shows only projects with `featured: true` (limited to 3-5 for clean look)
- **Gallery Section**: Shows all projects with search/filter functionality
- **Automatic**: Once added to the data file, projects appear everywhere automatically

### 3. Project Fields Explained

| Field | Purpose |
|-------|---------|
| `id` | Unique number (must be unique) |
| `title` | Project name displayed prominently |
| `category` | Type of project (appears as label) |
| `description` | Brief explanation of the project |
| `tags` | Technologies used (displayed as badges) |
| `featured` | `true` = homepage, `false` = gallery only |
| `year` | Year the project was completed |

### 4. Example: Adding a New Project

```javascript
{
  id: 4,
  title: "AI Chat Assistant",
  category: "Full Stack",
  description: "Real-time chat application with AI integration using OpenAI API",
  tags: ["React", "Node.js", "Socket.io", "OpenAI"],
  featured: false,
  year: 2024
}
```

### 5. Search & Filter

The gallery automatically includes:
- **Search by title**: Find projects by name
- **Search by category**: Filter by project type
- **Search by tags**: Find projects using specific technologies

No extra setup needed!

## File Structure

```
src/
├── data/
│   └── projectsData.js  ← Edit this to add projects
├── components/
│   ├── Projects.jsx     ← Featured projects on homepage
│   └── ProjectsGallery.jsx  ← Full gallery with search
└── pages/
    └── Home.jsx         ← Main page (already integrated)
```

## Helper Functions Available

```javascript
import { 
  getAllProjects,      // Get all projects
  getFeaturedProjects, // Get only featured projects
  searchProjects       // Search by query
} from '../data/projectsData';
```

## Tips

✅ Keep featured projects count to 3-5 for better homepage design
✅ Use consistent category names (makes filtering cleaner)
✅ Add meaningful tags (helps with search)
✅ Update yearly - projects from previous years add credibility!
