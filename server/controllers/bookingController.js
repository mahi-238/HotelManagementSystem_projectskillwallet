const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, customerPhone } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, checkIn date, and checkOut date',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid check-in or check-out date' });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const requestedGuests = Number(guests) || 1;
    if (requestedGuests > room.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed guests for this room is ${room.maxGuests}`,
      });
    }

    // Check for overlapping bookings (not Cancelled)
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      bookingStatus: { $ne: 'Cancelled' },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This room is already booked for the selected dates. Please choose another date or room.',
      });
    }

    // Calculate nights & total price
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = diffDays * room.pricePerNight;

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: requestedGuests,
      totalPrice,
      customerPhone: customerPhone || req.user.phone || '',
      bookingStatus: 'Booked',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Room booked successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate('room')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    let filteredBookings = bookings;
    if (search) {
      const q = search.toLowerCase();
      filteredBookings = bookings.filter((b) => {
        return (
          b._id.toString().includes(q) ||
          (b.room && b.room.roomName.toLowerCase().includes(q)) ||
          (b.user && b.user.name.toLowerCase().includes(q)) ||
          (b.customerPhone && b.customerPhone.includes(q))
        );
      });
    }

    res.json({
      success: true,
      count: filteredBookings.length,
      bookings: filteredBookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership if not admin
    if (
      req.user.role !== 'admin' &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (User can cancel own, Admin can set any status)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'admin') {
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
      }
      if (status !== 'Cancelled') {
        return res.status(403).json({ success: false, message: 'Users can only cancel bookings' });
      }
    }

    booking.bookingStatus = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email phone');

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (
      req.user.role !== 'admin' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    booking.bookingStatus = 'Cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
