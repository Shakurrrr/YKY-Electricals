import express from 'express';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { sendContactConfirmation } from '../utils/email.js';


const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message must be less than 1000 characters' });
    }

    const db = getDatabase();

    db.run(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message],
      async function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to submit contact form' });
        }

        // Send confirmation email
        try {
          await sendContactConfirmation({ name, email, message });
        } catch (emailError) {
          console.error('Email confirmation error:', emailError);
          // Don't fail the request if email fails
        }

        res.status(201).json({
          message: 'Contact form submitted successfully',
          id: this.lastID
        });
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all contact messages (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();

  db.all(
    'SELECT * FROM contact_messages ORDER BY created_at DESC',
    (err, messages) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ messages });
    }
  );
});

// Mark message as read (admin only)
router.put('/:id/read', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  db.run(
    'UPDATE contact_messages SET status = "read" WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update message status' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }

      res.json({ message: 'Message marked as read' });
    }
  );
});

export default router;