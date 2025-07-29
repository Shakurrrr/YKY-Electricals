import express from 'express';
import { getDatabase } from '../database/init.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { sendBookingNotification } from '../utils/email.js';


const router = express.Router();

// Create booking
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, email, phone, serviceType, preferredDate, description } = req.body;

    if (!name || !email || !phone || !serviceType || !preferredDate || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return res.status(400).json({ error: 'Please provide a valid phone number' });
    }

    // Validate preferred date is not in the past
    const preferredDateTime = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (preferredDateTime < today) {
      return res.status(400).json({ error: 'Preferred date cannot be in the past' });
    }

    const db = getDatabase();

    db.run(
      `INSERT INTO bookings (user_id, name, email, phone, service_type, preferred_date, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, email, phone, serviceType, preferredDate, description],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to create booking' });
        }

        // Send email notification (optional - don't fail if email fails)
        try {
          // You can add email notification here if needed
        } catch (emailError) {
          console.warn('Email notification failed:', emailError);
        }

        res.status(201).json({
          message: 'Booking created successfully',
          booking: {
            id: this.lastID,
            name,
            email,
            phone,
            serviceType,
            preferredDate,
            description,
            status: 'pending'
          }
        });
      }
    );
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, (req, res) => {
  const db = getDatabase();

  db.all(
    `SELECT id, service_type, preferred_date, description, status, admin_comment, created_at 
     FROM bookings WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.id],
    (err, bookings) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ bookings });
    }
  );
});

// Get all bookings (admin only)
router.get('/all', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { status, search } = req.query;
  const db = getDatabase();

  let query = `SELECT * FROM bookings`;
  let params = [];

  // Add filters
  const conditions = [];
  if (status && status !== 'all') {
    conditions.push('status = ?');
    params.push(status);
  }
  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ? OR service_type LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, bookings) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ bookings });
  });
});

// Update booking status (admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const db = getDatabase();

    // Get booking details for email notification
    db.get('SELECT * FROM bookings WHERE id = ?', [id], (err, booking) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Update booking
      db.run(
        'UPDATE bookings SET status = ?, admin_comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, adminComment || '', id],
        async function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to update booking' });
          }

          // Send email notification
          try {
            await sendBookingNotification({
              ...booking,
              status,
              admin_comment: adminComment || ''
            });
          } catch (emailError) {
            console.error('Email notification error:', emailError);
            // Don't fail the request if email fails
          }

          res.json({
            message: 'Booking status updated successfully',
            booking: {
              ...booking,
              status,
              admin_comment: adminComment || ''
            }
          });
        }
      );
    });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;