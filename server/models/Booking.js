const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide check-out date'],
    },
    guests: {
      type: Number,
      required: [true, 'Please provide number of guests'],
      default: 1,
      min: [1, 'At least 1 guest required'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    customerPhone: {
      type: String,
      default: '',
    },
    bookingStatus: {
      type: String,
      enum: ['Booked', 'Confirmed', 'Pending', 'Cancelled', 'Completed'],
      default: 'Booked',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
