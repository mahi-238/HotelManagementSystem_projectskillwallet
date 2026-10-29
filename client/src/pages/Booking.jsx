import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { FaCalendarCheck, FaShieldAlt } from 'react-icons/fa';

const Booking = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [phone, setPhone] = useState(user?.phone || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        if (res.data.success) {
          setRoom(res.data.room);
          if (user?.phone) setPhone(user.phone);
        }
      } catch (err) {
        setError('Error loading room for booking.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, isAuthenticated]);

  // Calculate nights and price
  const calculateTotal = () => {
    if (!checkIn || !checkOut || !room) return 0;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = d2 - d1;
    if (diff <= 0) return 0;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days * room.pricePerNight;
  };

  const totalNights = () => {
    if (!checkIn || !checkOut) return 0;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = d2 - d1;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!checkIn || !checkOut) {
      setError('Please select both Check-In and Check-Out dates');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-Out date must be strictly after Check-In date');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/bookings', {
        roomId: room._id,
        checkIn,
        checkOut,
        guests: Number(guests),
        customerPhone: phone,
      });

      if (res.data.success) {
        setSuccess('Booking confirmed successfully! Redirecting to your bookings...');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Booking failed. Room might be reserved.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading booking details..." />;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <h3 className="fw-bold mb-2">Complete Your Hotel Reservation</h3>
            <p className="text-muted mb-4">Instant booking for {room?.roomName} (Room #{room?.roomNumber})</p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleBookingSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Check-In Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Check-Out Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Number of Guests</label>
                  <input
                    type="number"
                    className="form-control"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                    max={room?.maxGuests || 5}
                    required
                  />
                  <small className="text-muted">Max {room?.maxGuests} guests allowed for this room.</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Contact Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter mobile phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-light p-3 rounded my-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Room Rate:</span>
                  <span className="fw-bold">₹{room?.pricePerNight} / night</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Nights:</span>
                  <span className="fw-bold">{totalNights()} nights</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold text-primary">
                  <span>Total Payable:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 fw-bold py-3"
                disabled={submitting || calculateTotal() === 0}
              >
                {submitting ? 'PROCESSING RESERVATION...' : 'CONFIRM & BOOK ROOM'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;