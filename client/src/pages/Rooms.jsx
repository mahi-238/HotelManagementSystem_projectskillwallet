import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import Loading from '../components/Loading';
import { FaSearch, FaFilter, FaRedo } from 'react-icons/fa';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [guests, setGuests] = useState(searchParams.get('guests') || '');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sort, setSort] = useState('newest');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (type && type !== 'all') params.append('type', type);
      if (guests) params.append('guests', guests);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/rooms?${params.toString()}`);
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [type, guests, maxPrice, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const resetFilters = () => {
    setSearch('');
    setType('all');
    setGuests('');
    setMaxPrice(3000);
    setSort('newest');
  };

  return (
    <div className="rooms-page container py-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h2 className="fw-bold mb-1">Available Hotel Rooms</h2>
          <p className="text-muted mb-0">Browse and book luxury rooms suited to your preferences</p>
        </div>
        <div className="col-md-6 text-md-end mt-3 mt-md-0">
          <span className="badge bg-primary fs-6 px-3 py-2">
            Total Available: {rooms.length} Rooms
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 p-3 mb-4 bg-white">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">All Room Types</option>
              <option value="delux">Deluxe Room</option>
              <option value="ordinary">Ordinary / Standard</option>
              <option value="suite">Suite</option>
              <option value="family">Family Room</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            >
              <option value="">Any Guests</option>
              <option value="1">1+ Guest</option>
              <option value="2">2+ Guests</option>
              <option value="4">4+ Guests</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small text-muted mb-0 d-flex justify-content-between">
              <span>Max Rent:</span>
              <span className="fw-bold text-dark">₹{maxPrice}/day</span>
            </label>
            <input
              type="range"
              className="form-range"
              min="500"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="col-md-2 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-grow-1">
              Filter
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-outline-secondary"
              title="Reset Filters"
            >
              <FaRedo />
            </button>
          </div>
        </form>
      </div>

      {/* Room Grid */}
      {loading ? (
        <Loading message="Fetching rooms from database..." />
      ) : rooms.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm rounded">
          <h4 className="fw-bold text-muted">No rooms found</h4>
          <p className="text-muted">Try relaxing your search filters or resetting them.</p>
          <button onClick={resetFilters} className="btn btn-primary px-4">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room._id} className="col-lg-4 col-md-6">
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;