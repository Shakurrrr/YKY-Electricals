import express from 'express';
import { getDatabase } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();

  const queries = [
    'SELECT COUNT(*) as total_bookings FROM bookings',
    'SELECT COUNT(*) as pending_bookings FROM bookings WHERE status = "pending"',
    'SELECT COUNT(*) as approved_bookings FROM bookings WHERE status = "approved"',
    'SELECT COUNT(*) as rejected_bookings FROM bookings WHERE status = "rejected"',
    'SELECT COUNT(*) as total_users FROM users WHERE role = "user"',
    'SELECT COUNT(*) as unread_messages FROM contact_messages WHERE status = "unread"',
    'SELECT COUNT(*) as total_projects FROM projects'
  ];

  const stats = {};
  let completed = 0;

  queries.forEach((query, index) => {
    db.get(query, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const key = Object.keys(result)[0];
      stats[key] = result[key];
      completed++;

      if (completed === queries.length) {
        res.json({ stats });
      }
    });
  });
});

// Get recent activities
router.get('/recent-activities', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();

  const activities = [];
  let completed = 0;
  const totalQueries = 3;

  // Recent bookings
  db.all(
    'SELECT "booking" as type, name, email, service_type, created_at FROM bookings ORDER BY created_at DESC LIMIT 5',
    (err, bookings) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      bookings.forEach(booking => {
        activities.push({
          type: 'booking',
          message: `New booking: ${booking.service_type} by ${booking.name}`,
          timestamp: booking.created_at
        });
      });

      completed++;
      if (completed === totalQueries) {
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json({ activities: activities.slice(0, 10) });
      }
    }
  );

  // Recent contact messages
  db.all(
    'SELECT "contact" as type, name, email, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5',
    (err, messages) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      messages.forEach(message => {
        activities.push({
          type: 'contact',
          message: `New contact message from ${message.name}`,
          timestamp: message.created_at
        });
      });

      completed++;
      if (completed === totalQueries) {
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json({ activities: activities.slice(0, 10) });
      }
    }
  );

  // Recent user registrations
  db.all(
    'SELECT "user" as type, email, first_name, last_name, created_at FROM users WHERE role = "user" ORDER BY created_at DESC LIMIT 5',
    (err, users) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      users.forEach(user => {
        activities.push({
          type: 'user',
          message: `New user registration: ${user.email}`,
          timestamp: user.created_at
        });
      });

      completed++;
      if (completed === totalQueries) {
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json({ activities: activities.slice(0, 10) });
      }
    }
  );
});

export default router;