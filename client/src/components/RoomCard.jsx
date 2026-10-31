import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../services/api';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // Handle image URL fallback
  const getImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
    if (img.startsWith('http')) return img;
    return `${BACKEND_URL}${img}`;
  };

  return (
    <div className="card h-100 room-card shadow-sm border-0">
      <div className="room-img-container position-relative">
        <img
          src={getImageUrl(room.image)}
          alt={room.roomName}
          className="card-img-top room-card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {!room.isAvailable && (
          <span className="badge bg-danger position-absolute top-0 end-0 m-2">
            Unavailable
          </span>
        )}
      </div>

      {/* Body strictly styled following Screenshot 3 */}
      <div className="card-body p-4 d-flex flex-column">
        <h5 className="card-title fw-bold mb-3">Room Type: {room.roomType || 'ordinary'}</h5>
        
        <p className="room-meta-text mb-1">
          <strong>Room Capacity:</strong> {room.maxGuests} People
        </p>
        <p className="room-meta-text mb-1">
          <strong>Rent:</strong> {room.pricePerNight} per day
        </p>
        <p className="room-meta-text mb-1">
          <strong>Type:</strong> {room.roomType || 'ordinary'}
        </p>
        <p className="room-meta-text text-truncate mb-4" title={room.description}>
          <strong>Description:</strong> {room.description || 'Welcome to Roomly'}
        </p>

        <div className="mt-auto d-flex gap-2">
          <Link
            to={`/rooms/${room._id}`}
            className="btn btn-primary px-4 py-2 text-uppercase fw-semibold flex-grow-1"
          >
            LEARN MORE
          </Link>
          <button
            onClick={() => navigate(`/booking/${room._id}`)}
            className="btn btn-outline-primary px-3 py-2 fw-semibold"
            disabled={!room.isAvailable}
          >
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;