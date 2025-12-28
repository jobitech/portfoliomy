// Centralized projects data - Easy to update and maintain
export const projectsData = [
  {
    id: 1,
    title: "Neon Finance",
    category: "Fintech App",
    description: "A modern financial dashboard with real-time data visualization",
    tags: ["React", "WebGL", "Tailwind CSS"],
    featured: true,
    year: 2024
  },
  {
    id: 2,
    title: "Vortex Gallery",
    category: "Immersive WebGL",
    description: "Interactive 3D gallery with stunning animations",
    tags: ["Three.js", "React", "WebGL"],
    featured: true,
    year: 2024
  },
  {
    id: 3,
    title: "Echo Brand",
    category: "E-commerce",
    description: "Full-featured e-commerce platform with advanced features",
    tags: ["React", "Node.js", "MongoDB"],
    featured: true,
    year: 2024
  },
  // Add more projects here as needed - they'll automatically show up in the gallery
  // {
  //   id: 4,
  //   title: "Project Name",
  //   category: "Category",
  //   description: "Description",
  //   tags: ["Tag1", "Tag2"],
  //   featured: false,
  //   year: 2024
  // }
];

// Get only featured projects for homepage
export const getFeaturedProjects = () => {
  return projectsData.filter(p => p.featured);
};

// Get all projects for gallery
export const getAllProjects = () => {
  return projectsData;
};

// Search projects by title or tags
export const searchProjects = (query) => {
  const lowerQuery = query.toLowerCase();
  return projectsData.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
