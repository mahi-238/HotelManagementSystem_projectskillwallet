import React from 'react';
import { FaCalendarAlt, FaPhoneAlt, FaDollarSign } from 'react-icons/fa';

const BookingCard = ({ booking, onCancel }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const isCancelled = booking.bookingStatus === 'Cancelled';
  const isBooked = booking.bookingStatus === 'Booked' || booking.bookingStatus === 'Confirmed';

  return (
    <div className="card booking-card shadow-sm border-0 mb-4 p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold mb-0">
          {booking.room?.roomName || 'Delux Room'}
        </h5>
        
        {/* Badge matching screenshot 4: CANCELLED (red pill) or BOOKED (green pill) */}
        {isCancelled ? (
          <span className="badge-cancelled">CANCELLED</span>
        ) : (
          <span className="badge-booked">BOOKED</span>
        )}
      </div>

      <div className="booking-details-list">
        <p className="mb-2">
          <strong>Booking ID:</strong> <span className="font-monospace text-muted">{booking._id}</span>
        </p>
        <p className="mb-2">
          <strong>From:</strong> {formatDate(booking.checkIn)} <span className="mx-2">|</span> <strong>To:</strong> {formatDate(booking.checkOut)}
        </p>
        <p className="mb-2">
          <strong>Total Amount:</strong> ₹{booking.totalPrice}
        </p>
        <p className="mb-3">
          <strong>Customer Phone:</strong> {booking.customerPhone || '9704927807'}
        </p>
      </div>

      {/* Red outline Cancel button if booked */}
      {!isCancelled && onCancel && (
        <div className="mt-2">
          <button
            onClick={() => onCancel(booking._id)}
            className="btn btn-outline-danger w-100 rounded-pill py-2 fw-semibold text-uppercase"
          >
            CANCEL BOOKING
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;