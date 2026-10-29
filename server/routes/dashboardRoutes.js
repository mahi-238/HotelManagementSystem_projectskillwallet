const express = require('express');
const router = express.Router();
const {
  getStats,
  getRevenue,
  getRecentBookings,
  getUsers,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/stats', protect, admin, getStats);
router.get('/revenue', protect, admin, getRevenue);
router.get('/bookings', protect, admin, getRecentBookings);
router.get('/users', protect, admin, getUsers);

module.exports = router;