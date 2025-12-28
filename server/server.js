import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Database setup
const dbPath = path.join(__dirname, '../data/portfolio.db');
const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
const initializeDB = () => {
  db.serialize(() => {
    // Check if old hero_content table exists and has columns we need
    db.all("PRAGMA table_info(hero_content)", (err, columns) => {
      const columnNames = columns ? columns.map(c => c.name) : [];
      const needsMigration = !columnNames.includes('tag_text') || !columnNames.includes('bio');
      
      if (needsMigration && columns && columns.length > 0) {
        // Migrate old table
        db.run(`ALTER TABLE hero_content ADD COLUMN tag_text TEXT DEFAULT 'Creating Beyond Limits'`);
        db.run(`ALTER TABLE hero_content ADD COLUMN bio TEXT DEFAULT 'I''m a passionate developer dedicated to creating stunning web experiences that blend creativity with functionality. I believe in writing clean code and designing intuitive interfaces.'`);
      }
    });

    // Skills table
    db.run(`
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        level TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        link TEXT,
        order_index INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Hero content table
    db.run(`
      CREATE TABLE IF NOT EXISTS hero_content (
        id INTEGER PRIMARY KEY,
        main_text TEXT,
        sub_text TEXT,
        tag_text TEXT,
        bio TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // About content table
    db.run(`
      CREATE TABLE IF NOT EXISTS about_content (
        id INTEGER PRIMARY KEY,
        bio TEXT,
        photo TEXT,
        approach TEXT,
        drives TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Social links table
    db.run(`
      CREATE TABLE IF NOT EXISTS social_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT UNIQUE NOT NULL,
        url TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table (for contact email, etc)
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        contact_email TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migrate about_content if needed
    db.all("PRAGMA table_info(about_content)", (err, columns) => {
      const columnNames = columns ? columns.map(c => c.name) : [];
      if (!columnNames.includes('approach')) {
        db.run(`ALTER TABLE about_content ADD COLUMN approach TEXT DEFAULT 'I approach every project with excellence, combining modern technologies with creative problem-solving to deliver results that exceed expectations.'`);
      }
      if (!columnNames.includes('drives')) {
        db.run(`ALTER TABLE about_content ADD COLUMN drives TEXT DEFAULT 'My journey is driven by curiosity and a love for solving complex problems. Whether it is frontend magic with React or backend logic with Python, I create seamless experiences.'`);
      }
    });

    // Seed initial data if tables are empty
    db.get('SELECT COUNT(*) as count FROM hero_content', (err, row) => {
      if (row.count === 0) {
        db.run(`INSERT INTO hero_content (id, main_text, sub_text, tag_text, bio) VALUES (1, 'JOBIN BABU', 'Creative Developer & AI/ML Explorer', 'Creating Beyond Limits', 'I''m a passionate developer dedicated to creating stunning web experiences that blend creativity with functionality. I believe in writing clean code and designing intuitive interfaces.')`);
      }
    });

    db.get('SELECT COUNT(*) as count FROM about_content', (err, row) => {
      if (row.count === 0) {
        db.run(`INSERT INTO about_content (id, bio, photo, approach, drives) VALUES (1, 'I am a passionate developer with expertise in modern web technologies. I love creating beautiful, functional applications that solve real problems.', NULL, 'I approach every project with excellence, combining modern technologies with creative problem-solving to deliver results that exceed expectations.', 'My journey is driven by curiosity and a love for solving complex problems. Whether it is frontend magic with React or backend logic with Python, I create seamless experiences.')`);
      }
    });

    // Seed social links if empty
    db.get('SELECT COUNT(*) as count FROM social_links', (err, row) => {
      if (row.count === 0) {
        const socialData = [
          { platform: 'Instagram', url: 'https://instagram.com/_iam_jobin_' },
          { platform: 'GitHub', url: 'https://github.com/jobitech' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/jobin-babu-872462325/' },
          { platform: 'Twitter', url: 'https://twitter.com' }
        ];
        socialData.forEach((social) => {
          db.run(
            'INSERT INTO social_links (platform, url) VALUES (?, ?)',
            [social.platform, social.url]
          );
        });
      }
    });

    // Seed settings if empty
    db.get('SELECT COUNT(*) as count FROM settings', (err, row) => {
      if (row.count === 0) {
        db.run(`INSERT INTO settings (id, contact_email) VALUES (1, 'jobinbabu161@gmail.com')`);
      }
    });

    // Seed initial skills if skills table is empty
    db.get('SELECT COUNT(*) as count FROM skills', (err, row) => {
      if (row.count === 0) {
        const skillsToSeed = [
          { name: 'HTML', level: 'Advanced' },
          { name: 'CSS', level: 'Advanced' },
          { name: 'JavaScript', level: 'Advanced' },
          { name: 'React', level: 'Advanced' },
          { name: 'Tailwind CSS', level: 'Advanced' },
          { name: 'Node.js', level: 'Intermediate' },
        ];

        skillsToSeed.forEach((skill) => {
          db.run(
            'INSERT INTO skills (name, level) VALUES (?, ?)',
            [skill.name, skill.level]
          );
        });
      }
    });
  });
};

initializeDB();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Verify token endpoint
app.post('/api/auth/verify', verifyToken, (req, res) => {
  res.json({ valid: true });
});

// ==================== HERO ROUTES ====================

// Get hero content
app.get('/api/hero', (req, res) => {
  db.get('SELECT * FROM hero_content WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || { id: 1, main_text: '', sub_text: '' });
  });
});

// Update hero content
app.put('/api/hero', verifyToken, (req, res) => {
  const { main_text, sub_text, tag_text, bio } = req.body;
  
  db.run(
    'UPDATE hero_content SET main_text = ?, sub_text = ?, tag_text = ?, bio = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = 1',
    [main_text, sub_text, tag_text, bio],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Hero content updated successfully' });
    }
  );
});

// ==================== ABOUT ROUTES ====================

// Get about content
app.get('/api/about', (req, res) => {
  db.get('SELECT * FROM about_content WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || { id: 1, bio: '', photo: null });
  });
});

// Update about content
app.put('/api/about', verifyToken, upload.single('photo'), (req, res) => {
  const { bio, approach, drives, keep_photo } = req.body;
  const newPhoto = req.file ? `/uploads/${req.file.filename}` : null;

  // Get current about to handle photo replacement
  db.get('SELECT photo FROM about_content WHERE id = 1', (err, row) => {
    if (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: err.message });
    }

    const finalPhoto = keep_photo === 'true' ? row?.photo : (newPhoto || row?.photo);

    // Delete old photo if new one is uploaded
    if (newPhoto && row?.photo) {
      const oldPath = path.join(__dirname, '../public', row.photo);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    db.run(
      'UPDATE about_content SET bio = ?, approach = ?, drives = ?, photo = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = 1',
      [bio, approach, drives, finalPhoto],
      (err) => {
        if (err) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'About content updated successfully', photo: finalPhoto });
      }
    );
  });
});

// ==================== SKILLS ROUTES ====================

// Get all skills
app.get('/api/skills', (req, res) => {
  db.all('SELECT * FROM skills ORDER BY createdAt DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Add skill
app.post('/api/skills', verifyToken, (req, res) => {
  const { name, level } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Skill name is required' });
  }

  db.run(
    'INSERT INTO skills (name, level) VALUES (?, ?)',
    [name, level || 'Intermediate'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Skill already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, level, message: 'Skill added successfully' });
    }
  );
});

// Update skill
app.put('/api/skills/:id', verifyToken, (req, res) => {
  const { name, level } = req.body;
  
  db.run(
    'UPDATE skills SET name = ?, level = ? WHERE id = ?',
    [name, level, req.params.id],
    (err) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Skill name already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Skill updated successfully' });
    }
  );
});

// Delete skill
app.delete('/api/skills/:id', verifyToken, (req, res) => {
  db.run(
    'DELETE FROM skills WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Skill deleted successfully' });
    }
  );
});

// ==================== PROJECTS ROUTES ====================

// Get all projects
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY order_index ASC, createdAt DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Add project
app.post('/api/projects', verifyToken, upload.single('image'), (req, res) => {
  const { title, description, link } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Project title is required' });
  }

  db.run(
    'INSERT INTO projects (title, description, image, link, order_index) VALUES (?, ?, ?, ?, ?)',
    [title, description, image, link, Date.now()],
    function(err) {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, title, description, image, link, message: 'Project added successfully' });
    }
  );
});

// Update project
app.put('/api/projects/:id', verifyToken, upload.single('image'), (req, res) => {
  const { title, description, link, keep_image } = req.body;
  const newImage = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Project title is required' });
  }

  // Get current project to handle image replacement
  db.get('SELECT image FROM projects WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: err.message });
    }

    const finalImage = newImage || row.image;

    // Delete old image if new one is uploaded
    if (newImage && row.image) {
      const oldPath = path.join(__dirname, '../public', row.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    db.run(
      'UPDATE projects SET title = ?, description = ?, image = ?, link = ? WHERE id = ?',
      [title, description, finalImage, link, req.params.id],
      (err) => {
        if (err) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Project updated successfully' });
      }
    );
  });
});

// Delete project
app.delete('/api/projects/:id', verifyToken, (req, res) => {
  db.get('SELECT image FROM projects WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    // Delete image file if exists
    if (row && row.image) {
      const imagePath = path.join(__dirname, '../public', row.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    db.run(
      'DELETE FROM projects WHERE id = ?',
      [req.params.id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Project deleted successfully' });
      }
    );
  });
});

// ==================== SOCIAL LINKS ROUTES ====================

// Get all social links
app.get('/api/social-links', (req, res) => {
  db.all('SELECT * FROM social_links ORDER BY id ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Update social link
app.put('/api/social-links/:id', verifyToken, (req, res) => {
  const { url } = req.body;
  
  db.run(
    'UPDATE social_links SET url = ? WHERE id = ?',
    [url, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Social link updated successfully' });
    }
  );
});

// ==================== SETTINGS ROUTES ====================

// Get settings
app.get('/api/settings', (req, res) => {
  db.get('SELECT * FROM settings WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || { id: 1, contact_email: '' });
  });
});

// Update settings
app.put('/api/settings', verifyToken, (req, res) => {
  const { contact_email } = req.body;
  
  db.run(
    'UPDATE settings SET contact_email = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = 1',
    [contact_email],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Settings updated successfully' });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
});
