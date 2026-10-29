const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

dotenv.config();

const sampleRooms = [
  {
    roomName: 'Delux Room',
    roomNumber: '101',
    roomType: 'delux',
    description: 'luxury rooms with lake view, comfortable king bed and modern facilities',
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
    description: 'luxury rooms with balcony and city view',
    pricePerNight: 1200,
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat TV', 'Room Service'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Delux Room',
    roomNumber: '103',
    roomType: 'delux',
    description: 'luxury rooms with high-speed internet and soundproofing',
    pricePerNight: 1200,
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Desk Workstation'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Family Room',
    roomNumber: '104',
    roomType: 'delux',
    description: 'luxury rooms designed for groups and families with extra bedding',
    pricePerNight: 900,
    maxGuests: 5,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Extra Beds', 'Living Area'],
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Standard Room',
    roomNumber: '105',
    roomType: 'ordinary',
    description: 'Welcome to Roomly - budget friendly, comfortable and quiet room',
    pricePerNight: 1000,
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Comfortable Bed'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    roomName: 'Presidential Suite',
    roomNumber: '201',
    roomType: 'suite',
    description: 'Ultra-luxurious suite with private jacuzzi, panoramic view, and butler service',
    pricePerNight: 2400,
    maxGuests: 4,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Jacuzzi', 'Breakfast Included', 'Private Balcony', 'Mini Bar'],
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel');
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    console.log(' Cleared old data.');

    // Create users
    const adminUser = await User.create({
      name: 'Admin Hotel',
      email: 'admin@hotel.com',
      phone: '9876543210',
      password: 'admin123',
      role: 'admin',
    });

    const standardUser = await User.create({
      name: 'sun',
      email: 'sun@gmail.com',
      phone: '9704927807',
      password: 'user123',
      role: 'user',
    });

    console.log(' Admin user created: admin@hotel.com / admin123');
    console.log(' Demo user created: sun@gmail.com / user123');

    // Create rooms
    const createdRooms = await Room.insertMany(sampleRooms);
    console.log(` Created ${createdRooms.length} sample rooms.`);

    // Create sample bookings matching screenshots
    const deluxRoom = createdRooms.find((r) => r.roomNumber === '101');
    const deluxRoom2 = createdRooms.find((r) => r.roomNumber === '102');

    await Booking.create([
      {
        user: standardUser._id,
        room: deluxRoom._id,
        checkIn: new Date('2025-09-23'),
        checkOut: new Date('2025-09-24'),
        guests: 2,
        totalPrice: 2400,
        customerPhone: '9704927807',
        bookingStatus: 'Cancelled',
      },
      {
        user: standardUser._id,
        room: deluxRoom2._id,
        checkIn: new Date('2025-09-23'),
        checkOut: new Date('2025-09-24'),
        guests: 2,
        totalPrice: 2400,
        customerPhone: '9704927807',
        bookingStatus: 'Booked',
      },
      {
        user: standardUser._id,
        room: deluxRoom._id,
        checkIn: new Date('2025-09-25'),
        checkOut: new Date('2025-09-27'),
        guests: 2,
        totalPrice: 2700,
        customerPhone: '9704927800',
        bookingStatus: 'Cancelled',
      },
    ]);

    console.log(' Created sample bookings.');
    console.log(' Database seeded successfully! Exiting...');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding error:', error);
    process.exit(1);
  }
};

seedDB();