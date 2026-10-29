import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import BookingCard from '../components/BookingCard';
import Loading from '../components/Loading';
import { FaUserCircle, FaBed, FaCalendarAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get('/bookings/my');
        if (res.data.success) {
          setMyBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="container py-5">
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 text-center">
            <div className="mb-3 text-primary">
              <FaUserCircle size={70} />
            </div>
            <h4 className="fw-bold mb-1">{user?.name}</h4>
            <span className="badge bg-secondary mb-3">{user?.role}</span>
            <p className="text-muted small mb-1"><FaEnvelope className="me-2" />{user?.email}</p>
            <p className="text-muted small mb-3"><FaPhone className="me-2" />{user?.phone}</p>
            <Link to="/rooms" className="btn btn-primary w-100">
              Browse Rooms
            </Link>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h4 className="fw-bold mb-3">Account Overview</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded text-center">
                  <h6 className="text-muted mb-1">Total Reservations</h6>
                  <h3 className="fw-bold text-primary mb-0">{myBookings.length}</h3>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded text-center">
                  <h6 className="text-muted mb-1">Active Bookings</h6>
                  <h3 className="fw-bold text-success mb-0">
                    {myBookings.filter((b) => b.bookingStatus === 'Booked' || b.bookingStatus === 'Confirmed').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0">Recent Bookings</h5>
              <Link to="/my-bookings" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>

            {loading ? (
              <Loading message="Loading bookings..." />
            ) : myBookings.length === 0 ? (
              <p className="text-muted">No reservations found.</p>
            ) : (
              <div className="row">
                {myBookings.slice(0, 2).map((booking) => (
                  <div key={booking._id} className="col-md-12">
                    <BookingCard booking={booking} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;