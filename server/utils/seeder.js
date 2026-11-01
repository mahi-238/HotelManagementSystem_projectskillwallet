const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

const sampleRooms = [
  {
    roomName: 'Delux Room',
    roomNumber: '101',
    roomType: 'delux',
    description: 'Luxury rooms with lake view, comfortable king bed and modern facilities',
    pricePerNight: 1200,
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat TV', 'Mini Bar', 'Lake View'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Delux Room',
    roomNumber: '102',
    roomType: 'delux',
    description: 'Luxury rooms with balcony, ambient lighting, and panoramic city view',
    pricePerNight: 1200,
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat TV', 'Room Service', 'Balcony'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Delux Room',
    roomNumber: '103',
    roomType: 'delux',
    description: 'Luxury rooms with high-speed internet, workstation, and acoustic soundproofing',
    pricePerNight: 1200,
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Desk Workstation', 'Safe Box'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Family Room',
    roomNumber: '104',
    roomType: 'family',
    description: 'Spacious family room designed for groups and families with extra bedding and living area',
    pricePerNight: 900,
    maxGuests: 5,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Extra Beds', 'Living Area', 'Dining Table'],
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Standard Room',
    roomNumber: '105',
    roomType: 'ordinary',
    description: 'Welcome to Roomly - budget friendly, comfortable and quiet room with essential amenities',
    pricePerNight: 1000,
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Comfortable Bed', 'En-suite Bathroom'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Presidential Suite',
    roomNumber: '201',
    roomType: 'suite',
    description: 'Ultra-luxurious suite with private jacuzzi, panoramic view, lounge, and personalized butler service',
    pricePerNight: 2400,
    maxGuests: 4,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Jacuzzi', 'Breakfast Included', 'Private Balcony', 'Mini Bar', 'Butler Service'],
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Executive Suite',
    roomNumber: '202',
    roomType: 'suite',
    description: 'Sophisticated executive suite with modern aesthetics, king bed, and private lounge',
    pricePerNight: 2100,
    maxGuests: 3,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat TV', 'Mini Bar', 'Living Room', 'Work Desk'],
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Classic Comfort',
    roomNumber: '106',
    roomType: 'ordinary',
    description: 'Peaceful and cozy standard room ideal for business travelers or solo explorers',
    pricePerNight: 950,
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Coffee Maker', 'Desk'],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
];

/**
 * Seed database with initial rooms, users, and sample bookings.
 * @param {boolean} force If true, drops existing collections first.
 */
const seedDatabase = async (force = false) => {
  try {
    if (force) {
      console.log(' [Seed] Force mode active: clearing existing collections...');
      await User.deleteMany();
      await Room.deleteMany();
      await Booking.deleteMany();
      console.log(' [Seed] Cleared old data.');
    }

    let createdRooms = [];
    const currentRoomCount = await Room.countDocuments();

    if (currentRoomCount === 0 || force) {
      console.log(' [Seed] Seeding sample rooms...');
      createdRooms = await Room.insertMany(sampleRooms);
      console.log(` [Seed] Created ${createdRooms.length} sample rooms.`);
    } else {
      console.log(` [Seed] Rooms collection already has ${currentRoomCount} rooms.`);
      createdRooms = await Room.find();
    }

    // Ensure Admin user exists
    let adminUser = await User.findOne({ email: 'admin@hotel.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin Hotel',
        email: 'admin@hotel.com',
        phone: '9876543210',
        password: 'admin123',
        role: 'admin',
      });
      console.log(' [Seed] Created default Admin: admin@hotel.com / admin123');
    }

    // Ensure Demo standard user exists
    let standardUser = await User.findOne({ email: 'sun@gmail.com' });
    if (!standardUser) {
      standardUser = await User.create({
        name: 'sun',
        email: 'sun@gmail.com',
        phone: '9704927807',
        password: 'user123',
        role: 'user',
      });
      console.log(' [Seed] Created demo user: sun@gmail.com / user123');
    }

    // Check bookings
    const currentBookingCount = await Booking.countDocuments();
    if (currentBookingCount === 0 || force) {
      const deluxRoom1 = createdRooms.find((r) => r.roomNumber === '101') || createdRooms[0];
      const deluxRoom2 = createdRooms.find((r) => r.roomNumber === '102') || createdRooms[1];

      if (deluxRoom1 && deluxRoom2 && standardUser) {
        await Booking.create([
          {
            user: standardUser._id,
            room: deluxRoom1._id,
            checkIn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            checkOut: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            guests: 2,
            totalPrice: 2400,
            customerPhone: '9704927807',
            bookingStatus: 'Cancelled',
          },
          {
            user: standardUser._id,
            room: deluxRoom2._id,
            checkIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            guests: 2,
            totalPrice: 2400,
            customerPhone: '9704927807',
            bookingStatus: 'Booked',
          },
          {
            user: standardUser._id,
            room: deluxRoom1._id,
            checkIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            guests: 2,
            totalPrice: 2400,
            customerPhone: '9704927800',
            bookingStatus: 'Cancelled',
          },
        ]);
        console.log(' [Seed] Created sample bookings.');
      }
    }

    const finalRoomsCount = await Room.countDocuments();
    const finalUsersCount = await User.countDocuments();
    const finalBookingsCount = await Booking.countDocuments();

    return {
      success: true,
      rooms: finalRoomsCount,
      users: finalUsersCount,
      bookings: finalBookingsCount,
    };
  } catch (error) {
    console.error(' [Seed] Error during seeding:', error.message);
    throw error;
  }
};

/**
 * Automatically check and seed if the database is brand new / empty
 */
const autoSeed = async () => {
  try {
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      console.log(' [Auto-Seed] No rooms found in database. Initializing default rooms and accounts...');
      await seedDatabase(false);
      console.log(' [Auto-Seed] Database successfully populated!');
    } else {
      console.log(` [Auto-Seed] Database ready with ${roomCount} rooms.`);
    }
  } catch (error) {
    console.error(' [Auto-Seed] Auto-seed check failed:', error.message);
  }
};

module.exports = {
  sampleRooms,
  seedDatabase,
  autoSeed,
};
