import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import AdminTabs from '../components/AdminTabs';
import Loading from '../components/Loading';
import {
  FaBed,
  FaCalendarCheck,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, revRes, bookingsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/revenue'),
          api.get('/dashboard/bookings'),
        ]);

        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (revRes.data.success) setRevenueData(revRes.data.revenue);
        if (bookingsRes.data.success) setRecentBookings(bookingsRes.data.bookings);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading message="Loading Admin Dashboard..." />;

  return (
    <div className="admin-layout d-flex">
      <Sidebar />
      <main className="admin-main-content flex-grow-1 p-4 bg-light">
        <AdminTabs />

        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Dashboard Overview</h2>
            <span className="text-muted small">Updated in real-time</span>
          </div>

          {/* 8 Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-xl-3 col-md-6">
              <div className="card stat-card shadow-sm border-0 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold">TOTAL ROOMS</span>
                    <h3 className="fw-bold mb-0 mt-1">{stats?.totalRooms || 0}</h3>
                  </div>
                  <div className="stat-icon bg-primary text-white"><FaBed /></div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card stat-card shadow-sm border-0 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold">AVAILABLE ROOMS</span>
                    <h3 className="fw-bold text-success mb-0 mt-1">{stats?.availableRooms || 0}</h3>
                  </div>
                  <div className="stat-icon bg-success text-white"><FaCheckCircle /></div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card stat-card shadow-sm border-0 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold">OCCUPIED ROOMS</span>
                    <h3 className="fw-bold text-warning mb-0 mt-1">{stats?.occupiedRooms || 0}</h3>
                  </div>
                  <div className="stat-icon bg-warning text-white"><FaBed /></div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card stat-card shadow-sm border-0 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold">TOTAL REVENUE</span>
                    <h3 className="fw-bold text-primary mb-0 mt-1">₹{stats?.totalRevenue || 0}</h3>
                  </div>
                  <div className="stat-icon bg-info text-white"><FaDollarSign /></div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card stat-card shadow-sm border-0 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold">TOTAL BOOKINGS</span>
                    <h3 className="fw-bold mb-0 mt-1">{stats?.totalBookings || 0}</h3>
                  </div>
                  <div className="stat-icon bg-secondary text-white"><FaCalendarCheck /></div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card stat-card shadow-sm border-0 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold">CONFIRMED BOOKINGS</span>
                    <h3 className="fw-bold text-success mb-0 mt-1">{stats?.confirmedBookings || 0}</h3>
                  </div>
                  <div className="stat-icon bg-success text-white"><FaCheckCircle /></div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card stat-card shadow-sm border-0 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold">PENDING BOOKINGS</span>
                    <h3 className="fw-bold text-warning mb-0 mt-1">{stats?.pendingBookings || 0}</h3>
                  </div>
                  <div className="stat-icon bg-warning text-white"><FaClock /></div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card stat-card shadow-sm border-0 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold">REGISTERED USERS</span>
                    <h3 className="fw-bold mb-0 mt-1">{stats?.totalUsers || 0}</h3>
                  </div>
                  <div className="stat-icon bg-dark text-white"><FaUsers /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart Overview (Responsive SVG visualization) */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 p-4 bg-white h-100">
                <h5 className="fw-bold mb-3">Revenue Overview (Monthly)</h5>
                <div className="chart-bar-container d-flex align-items-end justify-content-between pt-4" style={{ height: '220px' }}>
                  {revenueData.map((d, i) => {
                    const maxRev = Math.max(...revenueData.map(item => item.revenue), 1000);
                    const heightPercent = Math.max(12, (d.revenue / maxRev) * 100);
                    return (
                      <div key={i} className="text-center flex-grow-1 mx-1">
                        <div
                          className="chart-bar bg-primary rounded-top mx-auto"
                          style={{ height: `${heightPercent}%`, width: '22px' }}
                          title={`${d.month}: ₹${d.revenue}`}
                        ></div>
                        <small className="d-block text-muted mt-2 fw-semibold" style={{ fontSize: '11px' }}>
                          {d.month}
                        </small>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 p-4 bg-white h-100">
                <h5 className="fw-bold mb-3">Room Occupancy</h5>
                <div className="text-center py-3">
                  <div className="display-4 fw-bold text-primary mb-2">
                    {stats?.totalRooms > 0
                      ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100)
                      : 0}
                    %
                  </div>
                  <p className="text-muted mb-4">Current Occupancy Rate</p>
                  <div className="progress mb-3" style={{ height: '14px' }}>
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${
                          stats?.totalRooms > 0
                            ? (stats.availableRooms / stats.totalRooms) * 100
                            : 0
                        }%`,
                      }}
                      title="Available"
                    ></div>
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${
                          stats?.totalRooms > 0
                            ? (stats.occupiedRooms / stats.totalRooms) * 100
                            : 0
                        }%`,
                      }}
                      title="Occupied"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Available: {stats?.availableRooms}</span>
                    <span>Occupied: {stats?.occupiedRooms}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;