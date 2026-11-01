import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BACKEND_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaUserFriends,
  FaMoneyBillWave,
  FaArrowLeft,
} from 'react-icons/fa';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        if (res.data.success) {
          setRoom(res.data.room);
        }
      } catch (err) {
        setError('Room not found or error loading room details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const getImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  if (loading) return <Loading message="Loading room details..." />;
  if (error || !room) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error || 'Room not found'}</div>
        <button onClick={() => navigate('/rooms')} className="btn btn-primary">
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button
        onClick={() => navigate('/rooms')}
        className="btn btn-outline-secondary mb-4 d-inline-flex align-items-center gap-2"
      >
        <FaArrowLeft /> Back to Rooms
      </button>

      <div className="row g-4">
        {/* Left Column: Image & Description */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm overflow-hidden mb-4">
            <img
              src={getImageUrl(room.image)}
              alt={room.roomName}
              className="w-100 room-detail-img"
              style={{ maxHeight: '420px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div className="card border-0 shadow-sm p-4">
            <h3 className="fw-bold mb-3">{room.roomName} - Room #{room.roomNumber}</h3>
            <p className="lead text-muted">{room.description || 'Welcome to Roomly. Experience the ultimate comfort with premium amenities.'}</p>

            <h5 className="fw-bold mt-4 mb-3">Room Facilities & Amenities</h5>
            <div className="row g-2">
              {room.amenities && room.amenities.map((item, index) => (
                <div key={index} className="col-md-6 d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reservation / Details Card */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '90px' }}>
            <h4 className="fw-bold mb-3">Pricing & Booking Details</h4>

            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <span className="text-muted">Rent / Day</span>
              <span className="fs-3 fw-bold text-primary">₹{room.pricePerNight}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <span className="text-muted">Room Type</span>
              <span className="badge bg-info text-dark text-uppercase">{room.roomType}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <span className="text-muted">Maximum Capacity</span>
              <span className="fw-bold">{room.maxGuests} Guests</span>
            </div>

            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
              <span className="text-muted">Status</span>
              {room.isAvailable ? (
                <span className="badge bg-success">Available for Booking</span>
              ) : (
                <span className="badge bg-danger">Currently Booked / Unavailable</span>
              )}
            </div>

            <button
              onClick={() => navigate(`/booking/${room._id}`)}
              className="btn btn-primary btn-lg w-100 fw-bold py-3"
              disabled={!room.isAvailable}
            >
              PROCEED TO BOOK
            </button>

            <p className="text-muted small text-center mt-3 mb-0">
              Free cancellation up to 24 hours prior to check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;