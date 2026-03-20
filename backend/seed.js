const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Admin = require('./models/Admin');
const Pet = require('./models/Pet');
const Review = require('./models/Review');
const Gallery = require('./models/Gallery');

const samplePets = [
  {
    name: 'Max',
    breed: 'Golden Retriever',
    price: 35000,
    description: 'Beautiful, healthy Golden Retriever puppy. Vaccinated, dewormed and vet checked. Very friendly and playful.',
    status: 'Available',
    age: '2 months',
    gender: 'Male',
    vaccinated: true,
    features: ['Vaccinated', 'Dewormed', 'KCI Registered', 'Healthy'],
    images: [
      { url: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=500', public_id: '' },
      { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500', public_id: '' }
    ]
  },
  {
    name: 'Bella',
    breed: 'Labrador Retriever',
    price: 25000,
    description: 'Adorable Labrador puppy, very energetic and loving. Great with families and kids.',
    status: 'Available',
    age: '6 weeks',
    gender: 'Female',
    vaccinated: true,
    features: ['Vaccinated', 'Dewormed', 'Family Friendly'],
    images: [
      { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500', public_id: '' }
    ]
  },
  {
    name: 'Rocky',
    breed: 'German Shepherd',
    price: 40000,
    description: 'Premium German Shepherd puppy from champion bloodline. Highly intelligent and trainable.',
    status: 'Available',
    age: '3 months',
    gender: 'Male',
    vaccinated: true,
    features: ['Champion Bloodline', 'KCI Registered', 'Vaccinated', 'Microchipped'],
    images: [
      { url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', public_id: '' }
    ]
  },
  {
    name: 'Coco',
    breed: 'Beagle',
    price: 20000,
    description: 'Cute and cuddly Beagle puppy. Very social and loves being around people.',
    status: 'Sold',
    age: '2 months',
    gender: 'Female',
    vaccinated: false,
    features: ['Dewormed', 'Vet Checked'],
    images: [
      { url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500', public_id: '' }
    ]
  },
  {
    name: 'Bruno',
    breed: 'Rottweiler',
    price: 45000,
    description: 'Powerful and loyal Rottweiler puppy. Well-built with excellent temperament.',
    status: 'Available',
    age: '10 weeks',
    gender: 'Male',
    vaccinated: true,
    features: ['KCI Registered', 'Vaccinated', 'Dewormed'],
    images: [
      { url: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=500', public_id: '' }
    ]
  },
  {
    name: 'Luna',
    breed: 'Siberian Husky',
    price: 55000,
    description: 'Stunning Siberian Husky with blue eyes. Rare and beautiful breed, very playful.',
    status: 'Available',
    age: '2 months',
    gender: 'Female',
    vaccinated: true,
    features: ['Rare Blue Eyes', 'KCI Registered', 'Vaccinated', 'Premium'],
    images: [
      { url: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500', public_id: '' }
    ]
  },
  {
    name: 'Charlie',
    breed: 'Pomeranian',
    price: 18000,
    description: 'Tiny and adorable Pomeranian. Very fluffy, playful, and makes a great lap dog.',
    status: 'Available',
    age: '3 months',
    gender: 'Male',
    vaccinated: false,
    features: ['Fluffy Coat', 'Dewormed', 'Vet Checked'],
    images: [
      { url: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500', public_id: '' }
    ]
  },
  {
    name: 'Daisy',
    breed: 'Shih Tzu',
    price: 22000,
    description: 'Gorgeous Shih Tzu puppy, very friendly and loves attention. Low shedding breed.',
    status: 'Sold',
    age: '2.5 months',
    gender: 'Female',
    vaccinated: true,
    features: ['Low Shedding', 'Vaccinated', 'Family Friendly'],
    images: [
      { url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=500', public_id: '' }
    ]
  }
];

const sampleReviews = [
  { name: 'Rajesh Kumar', rating: 5, comment: 'Excellent service! Got a beautiful Golden Retriever puppy. Very healthy and well-cared for. Highly recommended!' },
  { name: 'Priya Sharma', rating: 5, comment: 'Best pet store in Hyderabad. The team is very knowledgeable and helped us choose the right breed for our family.' },
  { name: 'Suresh Reddy', rating: 4, comment: 'Good quality puppies. My German Shepherd is growing up beautifully. Will visit again for another pet.' },
  { name: 'Anitha Rao', rating: 5, comment: 'Amazing experience! The staff is very caring and the puppies are so healthy. Got my Labrador from here 2 years ago.' },
  { name: 'Mohammad Ali', rating: 4, comment: 'Very professional service. Transparent about pricing and health certificates. Trust worthy place.' },
  { name: 'Kavitha Nair', rating: 5, comment: 'My Pomeranian from Chaitanya Pets is the cutest! They provided all vaccination records and follow-up support.' }
];

const sampleGallery = [
  { url: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600', category: 'Puppies', caption: 'Golden Retriever puppies' },
  { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600', category: 'Dogs', caption: 'Happy dogs at our kennel' },
  { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600', category: 'Puppies', caption: 'Adorable Labrador puppy' },
  { url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600', category: 'Dogs', caption: 'German Shepherd beauty' },
  { url: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600', category: 'Puppies', caption: 'Husky puppies' },
  { url: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=600', category: 'Puppies', caption: 'Fluffy Pomeranian' },
  { url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600', category: 'Dogs', caption: 'Beagle exploring' },
  { url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600', category: 'Facilities', caption: 'Our kennel facilities' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chaitanya-pets');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Pet.deleteMany({});
    await Review.deleteMany({});
    await Gallery.deleteMany({});

    // Create admin
    const admin = new Admin({ username: 'admin', password: 'chaitanya2024' });
    await admin.save();
    console.log('✅ Admin created - Username: admin, Password: chaitanya2024');

    // Create pets
    await Pet.insertMany(samplePets);
    console.log(`✅ ${samplePets.length} pets created`);

    // Create reviews
    await Review.insertMany(sampleReviews);
    console.log(`✅ ${sampleReviews.length} reviews created`);

    // Create gallery
    await Gallery.insertMany(sampleGallery);
    console.log(`✅ ${sampleGallery.length} gallery images created`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
