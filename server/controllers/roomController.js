const Room = require('../models/Room');

// @desc    Get all rooms with filter/search/sort
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const { search, type, minPrice, maxPrice, guests, isAvailable, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { roomName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomType: { $regex: search, $options: 'i' } },
      ];
    }

    if (type && type !== 'all') {
      query.roomType = type.toLowerCase();
    }

    if (isAvailable !== undefined && isAvailable !== '') {
      query.isAvailable = isAvailable === 'true';
    }

    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { pricePerNight: 1 };
    if (sort === 'price-desc') sortOption = { pricePerNight: -1 };
    if (sort === 'capacity-desc') sortOption = { maxGuests: -1 };

    const rooms = await Room.find(query).sort(sortOption);
    res.json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get available rooms
// @route   GET /api/rooms/available
// @access  Public
const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  try {
    const {
      roomName,
      roomNumber,
      roomType,
      description,
      pricePerNight,
      maxGuests,
      amenities,
      isAvailable,
    } = req.body;

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} already exists`,
      });
    }

    let imagePath = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image && req.body.image.trim()) {
      imagePath = req.body.image.trim();
    }

    let parsedAmenities = [];
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        parsedAmenities = amenities.split(',').map((a) => a.trim());
      }
    } else if (Array.isArray(amenities)) {
      parsedAmenities = amenities;
    }

    const room = await Room.create({
      roomName,
      roomNumber,
      roomType: roomType ? roomType.toLowerCase() : 'standard',
      description,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests) || 2,
      amenities: parsedAmenities.length ? parsedAmenities : ['Free Wi-Fi', 'AC', 'TV'],
      image: imagePath,
      isAvailable: isAvailable !== undefined ? isAvailable === 'true' || isAvailable === true : true,
    });

    res.status(201).json({ success: true, message: 'Room created successfully', room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const updates = { ...req.body };

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    if (updates.amenities && typeof updates.amenities === 'string') {
      try {
        updates.amenities = JSON.parse(updates.amenities);
      } catch (e) {
        updates.amenities = updates.amenities.split(',').map((a) => a.trim());
      }
    }

    if (updates.pricePerNight) updates.pricePerNight = Number(updates.pricePerNight);
    if (updates.maxGuests) updates.maxGuests = Number(updates.maxGuests);
    if (updates.roomType) updates.roomType = updates.roomType.toLowerCase();
    if (updates.isAvailable !== undefined) {
      updates.isAvailable = updates.isAvailable === 'true' || updates.isAvailable === true;
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Room updated successfully', room: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
