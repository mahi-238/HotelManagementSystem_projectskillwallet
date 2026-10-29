import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BookingCard from '../components/BookingCard';
import Loading from '../components/Loading';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const res = await api.delete(`/bookings/${bookingId}`);
      if (res.data.success) {
        setSuccessMsg('Booking cancelled successfully.');
        fetchBookings();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling booking');
    }
  };

  return (
    <div className="my-bookings-page py-4">
      <div className="container">
        {/* Title matching screenshot 4 */}
        <h3 className="text-center fw-bold mb-4">My Bookings</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {loading ? (
          <Loading message="Loading your bookings..." />
        ) : bookings.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm">
            <h5 className="fw-bold text-muted">You have no bookings yet.</h5>
            <p className="text-muted">Explore our rooms and make your first reservation!</p>
          </div>
        ) : (
          <>
            <div className="row">
              {bookings.map((booking) => (
                <div key={booking._id} className="col-md-6">
                  <BookingCard
                    booking={booking}
                    onCancel={handleCancelBooking}
                  />
                </div>
              ))}
            </div>

            {/* Total Bookings footer count matching Screenshot 4 */}
            <div className="text-center text-muted fw-bold mt-4">
              Total Bookings: {bookings.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;