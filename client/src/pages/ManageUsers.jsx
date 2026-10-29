import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import AdminTabs from '../components/AdminTabs';
import Loading from '../components/Loading';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/dashboard/users');
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="admin-layout d-flex">
      <Sidebar />
      <main className="admin-main-content flex-grow-1 p-4 bg-light">
        <AdminTabs />

        <div className="container-fluid">
          <div className="card shadow-sm border-0 rounded overflow-hidden">
            <div className="admin-table-banner text-center text-white py-3">
              <h4 className="fw-bold m-0">Registered Users Directory</h4>
              <small className="text-light">Total Users: {users.length}</small>
            </div>

            {loading ? (
              <Loading message="Loading registered users..." />
            ) : (
              <div className="table-responsive p-3 bg-white">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Total Bookings</th>
                      <th>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="font-monospace text-muted">{u._id}</td>
                        <td className="fw-bold">{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.role === 'admin' ? 'bg-danger' : 'bg-secondary'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="fw-semibold">{u.bookingsCount || 0}</td>
                        <td className="text-muted">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageUsers;