import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import Loading from '../components/Loading';
import {
  FaCalendarAlt,
  FaUserFriends,
  FaSearch,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaConciergeBell,
  FaParking,
  FaStar,
} from 'react-icons/fa';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search form states
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        if (res.data.success) {
          setFeaturedRooms(res.data.rooms.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (checkIn) query.append('checkIn', checkIn);
    if (checkOut) query.append('checkOut', checkOut);
    if (guests) query.append('guests', guests);
    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section text-white d-flex align-items-center">
        <div className="container py-5 text-center text-md-start">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-3">
                Welcome to RoomsForUse & SB Hotel
              </span>
              <h1 className="hero-title display-4 fw-bold mb-3">
                Find Your Luxurious Stay With Exceptional Comfort
              </h1>
              <p className="hero-subtitle lead mb-4 text-light">
                Discover world-class rooms, seamless reservations, instant confirmation, and an unforgettable vacation experience.
              </p>
            </div>
          </div>

          {/* 4. Booking Search Form */}
          <div className="card hero-search-card shadow-lg p-3 p-md-4 mt-4 border-0">
            <form onSubmit={handleSearch} className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label text-dark fw-semibold small">
                  <FaCalendarAlt className="me-2 text-primary" /> Check-in Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg search-input"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-dark fw-semibold small">
                  <FaCalendarAlt className="me-2 text-primary" /> Check-out Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg search-input"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-dark fw-semibold small">
                  <FaUserFriends className="me-2 text-primary" /> Guests
                </label>
                <select
                  className="form-select form-select-lg search-input"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests (Family)</option>
                </select>
              </div>

              <div className="col-md-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 fw-bold search-btn d-flex align-items-center justify-content-center gap-2"
                >
                  <FaSearch /> Search Rooms
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 9. Featured Rooms Section */}
      <section className="container py-5 my-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h6 className="text-primary text-uppercase fw-bold">Exclusive Selections</h6>
            <h2 className="fw-bold">Featured Hotel Rooms</h2>
          </div>
          <button
            onClick={() => navigate('/rooms')}
            className="btn btn-outline-primary fw-semibold"
          >
            View All Rooms →
          </button>
        </div>

        {loading ? (
          <Loading message="Loading featured rooms..." />
        ) : (
          <div className="row g-4">
            {featuredRooms.map((room) => (
              <div key={room._id} className="col-lg-4 col-md-6">
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 10. Hotel Facilities Section */}
      <section className="bg-light py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h6 className="text-primary text-uppercase fw-bold">First-Class Amenities</h6>
            <h2 className="fw-bold">Hotel Facilities & Services</h2>
            <p className="text-muted">Designed to make your stay peaceful, delightful, and completely hassle-free.</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4 col-6">
              <div className="card facility-card h-100 p-4 border-0 shadow-sm">
                <div className="facility-icon mb-3 text-primary"><FaWifi size={38} /></div>
                <h5 className="fw-bold">Ultra High-Speed Wi-Fi</h5>
                <p className="text-muted small">Seamless 5G internet connection across rooms and suites.</p>
              </div>
            </div>

            <div className="col-md-4 col-6">
              <div className="card facility-card h-100 p-4 border-0 shadow-sm">
                <div className="facility-icon mb-3 text-primary"><FaSwimmingPool size={38} /></div>
                <h5 className="fw-bold">Infinity Pool</h5>
                <p className="text-muted small">Temperature controlled rooftop swimming pool with city view.</p>
              </div>
            </div>

            <div className="col-md-4 col-6">
              <div className="card facility-card h-100 p-4 border-0 shadow-sm">
                <div className="facility-icon mb-3 text-primary"><FaUtensils size={38} /></div>
                <h5 className="fw-bold">Gourmet Dining</h5>
                <p className="text-muted small">Buffet breakfast, international cuisine, and 24/7 room service.</p>
              </div>
            </div>

            <div className="col-md-4 col-6">
              <div className="card facility-card h-100 p-4 border-0 shadow-sm">
                <div className="facility-icon mb-3 text-primary"><FaConciergeBell size={38} /></div>
                <h5 className="fw-bold">24/7 Concierge</h5>
                <p className="text-muted small">Round-the-clock front desk support and luggage handling.</p>
              </div>
            </div>

            <div className="col-md-4 col-6">
              <div className="card facility-card h-100 p-4 border-0 shadow-sm">
                <div className="facility-icon mb-3 text-primary"><FaParking size={38} /></div>
                <h5 className="fw-bold">Valet Parking</h5>
                <p className="text-muted small">Complimentary secured indoor and outdoor parking facilities.</p>
              </div>
            </div>

            <div className="col-md-4 col-6">
              <div className="card facility-card h-100 p-4 border-0 shadow-sm">
                <div className="facility-icon mb-3 text-primary"><FaStar size={38} /></div>
                <h5 className="fw-bold">Spa & Wellness</h5>
                <p className="text-muted small">Relaxing steam bath, massage therapies, and fitness gym.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Customer Testimonials */}
      <section className="container py-5 my-4">
        <div className="text-center mb-5">
          <h6 className="text-primary text-uppercase fw-bold">Testimonials</h6>
          <h2 className="fw-bold">What Our Guests Say</h2>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card testimonial-card p-4 border-0 shadow-sm h-100">
              <div className="text-warning mb-2">★★★★★</div>
              <p className="text-muted">
                "The room was spotless and the lake view was breathtaking. Booking through RoomsForUse took less than 2 minutes!"
              </p>
              <div className="mt-auto fw-bold">- Rajesh Kumar, Bangalore</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card testimonial-card p-4 border-0 shadow-sm h-100">
              <div className="text-warning mb-2">★★★★★</div>
              <p className="text-muted">
                "Exceptional hospitality at SB Hotel. Staff was courteous, check-in was smooth, and cancellation policy is completely transparent."
              </p>
              <div className="mt-auto fw-bold">- Sunita Verma, Mumbai</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card testimonial-card p-4 border-0 shadow-sm h-100">
              <div className="text-warning mb-2">★★★★★</div>
              <p className="text-muted">
                "The presidential suite exceeded all our expectations. High-speed Wi-Fi, jacuzzi, and first-class breakfast service!"
              </p>
              <div className="mt-auto fw-bold">- Alexander Wright, Delhi</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;