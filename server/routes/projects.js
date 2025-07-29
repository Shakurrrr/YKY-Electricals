import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/projects');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all projects
router.get('/', (req, res) => {
  const { category } = req.query;
  const db = getDatabase();

  let query = 'SELECT * FROM projects';
  let params = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, projects) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ projects });
  });
});

// Create project (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const imageUrl = req.file ? `/uploads/projects/${req.file.filename}` : null;
    const db = getDatabase();

    db.run(
      'INSERT INTO projects (title, description, category, image_url) VALUES (?, ?, ?, ?)',
      [title, description, category, imageUrl],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to create project' });
        }

        res.status(201).json({
          message: 'Project created successfully',
          project: {
            id: this.lastID,
            title,
            description,
            category,
            image_url: imageUrl
          }
        });
      }
    );
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project (admin only)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const db = getDatabase();

    // Get current project to handle image replacement
    db.get('SELECT * FROM projects WHERE id = ?', [id], (err, project) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      let imageUrl = project.image_url;
      
      // If new image uploaded, delete old one and use new one
      if (req.file) {
        if (project.image_url) {
          const oldImagePath = path.join(__dirname, '..', project.image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        imageUrl = `/uploads/projects/${req.file.filename}`;
      }

      db.run(
        'UPDATE projects SET title = ?, description = ?, category = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, description, category, imageUrl, id],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to update project' });
          }

          res.json({
            message: 'Project updated successfully',
            project: {
              id: parseInt(id),
              title,
              description,
              category,
              image_url: imageUrl
            }
          });
        }
      );
    });
  } catch (error) {
    console.error('Project update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  // Get project to delete associated image
  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, project) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete image file if exists
    if (project.image_url) {
      const imagePath = path.join(__dirname, '..', project.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete project from database
    db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete project' });
      }

      res.json({ message: 'Project deleted successfully' });
    });
  });
});

export default router;