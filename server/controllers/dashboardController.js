const Room = require('../models/Room');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ isAvailable: true });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ bookingStatus: 'Pending' });
    const confirmedBookings = await Booking.countDocuments({
      bookingStatus: { $in: ['Confirmed', 'Booked'] },
    });
    const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'Cancelled' });
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Calculate revenue from active/completed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { bookingStatus: { $in: ['Booked', 'Confirmed', 'Completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;
    const occupiedRooms = Math.min(totalRooms, confirmedBookings);

    res.json({
      success: true,
      stats: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        totalUsers,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get revenue overview
// @route   GET /api/dashboard/revenue
// @access  Private/Admin
const getRevenue = async (req, res) => {
  try {
    const revenueByMonth = await Booking.aggregate([
      { $match: { bookingStatus: { $in: ['Booked', 'Confirmed', 'Completed'] } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = months.map((month, index) => {
      const found = revenueByMonth.find((item) => item._id === index + 1);
      return {
        month,
        revenue: found ? found.revenue : 0,
        bookings: found ? found.bookings : 0,
      };
    });

    res.json({ success: true, revenue: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent bookings
// @route   GET /api/dashboard/bookings
// @access  Private/Admin
const getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered users with booking counts
// @route   GET /api/dashboard/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const count = await Booking.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          bookingsCount: count,
        };
      })
    );
    res.json({ success: true, count: usersWithStats.length, users: usersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStats,
  getRevenue,
  getRecentBookings,
  getUsers,
};