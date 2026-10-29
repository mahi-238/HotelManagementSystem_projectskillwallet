import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import AdminTabs from '../components/AdminTabs';
import BookingCard from '../components/BookingCard';
import Loading from '../components/Loading';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await api.get(`/bookings?${params.toString()}`);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      alert('Error updating booking status');
    }
  };

  return (
    <div className="admin-layout d-flex">
      <Sidebar />
      <main className="admin-main-content flex-grow-1 p-4 bg-light">
        <AdminTabs />

        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">All Bookings</h3>

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID or Guest..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
              />
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Booked">Booked</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loading message="Loading all bookings..." />
          ) : bookings.length === 0 ? (
            <div className="card text-center p-5 border-0 shadow-sm bg-white">
              <h5 className="text-muted fw-bold">No bookings found</h5>
            </div>
          ) : (
            <>
              <div className="row">
                {bookings.map((booking) => (
                  <div key={booking._id} className="col-lg-6">
                    <BookingCard
                      booking={booking}
                      onCancel={(id) => handleStatusChange(id, 'Cancelled')}
                    />
                  </div>
                ))}
              </div>
              <div className="text-center text-muted fw-bold mt-3">
                Total Bookings: {bookings.length}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageBookings;