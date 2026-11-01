const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../utils/seeder');

// @desc    Seed database with sample rooms, admin, and demo user
// @route   GET /api/seed or POST /api/seed
// @access  Public (for initial setup & emergency reseeding)
router.all('/', async (req, res) => {
  try {
    const force = req.query.force === 'true' || req.body?.force === true;
    const result = await seedDatabase(force);

    res.json({
      success: true,
      message: force
        ? 'Database has been cleanly reseeded with all rooms and sample data!'
        : 'Database initialized/verified with rooms, users, and bookings.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to seed database: ${error.message}`,
    });
  }
});

module.exports = router;
