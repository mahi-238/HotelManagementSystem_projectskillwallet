import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import AdminTabs from '../components/AdminTabs';
import Loading from '../components/Loading';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Modal / Form state for Add / Edit Room
  const [showModal, setShowModal] = useState(searchParams.get('action') === 'add');
  const [editingRoomId, setEditingRoomId] = useState(null);

  const [formData, setFormData] = useState({
    roomName: 'Delux Room',
    roomNumber: '',
    roomType: 'delux',
    description: 'luxury rooms',
    pricePerNight: '',
    maxGuests: '2',
    amenities: 'Free Wi-Fi, AC, TV',
    image: '',
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rooms');
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openAddModal = () => {
    setEditingRoomId(null);
    setFormData({
      roomName: 'Delux Room',
      roomNumber: '',
      roomType: 'delux',
      description: 'luxury rooms',
      pricePerNight: '',
      maxGuests: '2',
      amenities: 'Free Wi-Fi, AC, TV',
      image: '',
      isAvailable: true,
    });
    setImageFile(null);
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setEditingRoomId(room._id);
    setFormData({
      roomName: room.roomName,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      description: room.description,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities,
      image: room.image || '',
      isAvailable: room.isAvailable,
    });
    setImageFile(null);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, formData[key]);
      });
      if (imageFile) {
        formPayload.append('image', imageFile);
      }

      if (editingRoomId) {
        await api.put(`/rooms/${editingRoomId}`, formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMsg('Room updated successfully!');
      } else {
        await api.post('/rooms', formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMsg('Room added successfully!');
      }

      setShowModal(false);
      fetchRooms();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error saving room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      setSuccessMsg('Room deleted successfully!');
      fetchRooms();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting room');
    }
  };

  return (
    <div className="admin-layout d-flex">
      <Sidebar />
      <main className="admin-main-content flex-grow-1 p-4 bg-light">
        <AdminTabs />

        <div className="container-fluid">
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          {/* Table Container strictly styled matching Screenshot 5 */}
          <div className="card shadow-sm border-0 rounded overflow-hidden">
            {/* Blue Banner Header */}
            <div className="admin-table-banner text-center text-white py-3">
              <h4 className="fw-bold m-0">Hotel Room Booking History</h4>
              <small className="text-light">Total Rooms: {rooms.length}</small>
            </div>

            {loading ? (
              <Loading message="Loading rooms table..." />
            ) : (
              <div className="table-responsive bg-white p-3">
                <div className="d-flex justify-content-end mb-3">
                  <button onClick={openAddModal} className="btn btn-primary d-flex align-items-center gap-2">
                    <FaPlus /> Add New Room
                  </button>
                </div>

                <table className="table align-middle admin-room-table">
                  <thead>
                    <tr>
                      <th className="fw-bold">Room ID</th>
                      <th className="fw-bold">Room Number</th>
                      <th className="fw-bold">Capacity</th>
                      <th className="fw-bold">Rent / Day</th>
                      <th className="fw-bold">Type</th>
                      <th className="fw-bold">Description</th>
                      <th className="fw-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room._id}>
                        <td className="font-monospace text-muted">{room._id}</td>
                        <td className="fw-bold">{room.roomNumber}</td>
                        <td>{room.maxGuests}</td>
                        <td>₹ {room.pricePerNight}</td>
                        <td>
                          {/* Green pill badge matching screenshot 5 */}
                          <span className="badge-room-type">
                            {room.roomType === 'delux' ? 'Delux' : room.roomType}
                          </span>
                        </td>
                        <td className="text-muted">{room.description || 'luxury rooms'}</td>
                        <td className="text-center">
                          <button
                            onClick={() => openEditModal(room)}
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Edit Room"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room._id)}
                            className="btn btn-sm btn-outline-danger"
                            title="Delete Room"
                          >
                            <FaTrash />
                          </button>
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

      {/* Modal for Add / Edit Room */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingRoomId ? 'Edit Room' : 'Add New Hotel Room'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Room Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.roomName}
                        onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Room Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Room Type</label>
                      <select
                        className="form-select"
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                      >
                        <option value="delux">Deluxe Room</option>
                        <option value="ordinary">Ordinary / Standard</option>
                        <option value="suite">Suite</option>
                        <option value="family">Family Room</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Rent / Day (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Capacity (Guests)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.maxGuests}
                        onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Room Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Amenities (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.amenities}
                        onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    {editingRoomId ? 'Update Room' : 'Save Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;