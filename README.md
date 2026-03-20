# 🐾 Chaitanya Pets Kennels — Full-Stack Website

> **Premium, modern pet kennels website for Hyderabad's #1 pet shop.**  
> Built with React.js + Node.js + MongoDB · JWT Auth · Admin Panel · Chart Analytics

---

## 📸 Features at a Glance

### 🌐 Public Website
| Feature | Details |
|---|---|
| **Homepage** | Hero banner, stats, featured pets, reviews preview, CTA |
| **Pet Listings** | Filter by breed, price, availability · Card layout |
| **Pet Detail** | Image gallery slider, breed info, WhatsApp enquiry button |
| **AI Recommendations** | Related pets by breed & price range shown on detail page |
| **Gallery** | Masonry grid · Category filter · Lightbox preview |
| **Reviews** | Star ratings, add review form, average rating display |
| **Contact** | Google Maps embed, WhatsApp form, phone/address |
| **Dark Mode** | Toggle in navbar · Persisted via localStorage |
| **WhatsApp Button** | Floating button on all pages · Pre-filled messages |
| **Responsive** | Mobile-first · Works on all screen sizes |

### 🔐 Admin Panel (`/admin`)
| Feature | Details |
|---|---|
| **Login** | JWT-based secure login |
| **Dashboard** | Stats cards + 3 charts (Line, Pie, Bar) |
| **Manage Pets** | Add · Edit · Delete · Image upload · Status toggle |
| **Gallery Mgmt** | Upload images · Category tags · Delete |
| **Review Mgmt** | View all · Delete inappropriate reviews |
| **View Website** | Direct link to live frontend |

---

## 🗂️ Project Structure

```
chaitanya-pets/
├── backend/
│   ├── models/
│   │   ├── Pet.js            # Pet schema
│   │   ├── Review.js         # Review schema
│   │   ├── Admin.js          # Admin schema (bcrypt)
│   │   └── Gallery.js        # Gallery schema
│   ├── routes/
│   │   ├── auth.js           # POST /login, GET /me
│   │   ├── pets.js           # Full CRUD + stats
│   │   ├── reviews.js        # Add/Get/Delete + stats
│   │   └── gallery.js        # Upload/Get/Delete
│   ├── middleware/
│   │   ├── auth.js           # JWT protect middleware
│   │   └── upload.js         # Multer image upload
│   ├── uploads/              # Local image storage
│   ├── server.js             # Express app entry
│   ├── seed.js               # DB seeder (sample data)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         # Responsive navbar + dark mode
│   │   │   ├── Footer.js         # Rich footer with links
│   │   │   ├── PetCard.js        # Pet listing card
│   │   │   ├── WhatsAppButton.js # Floating WhatsApp CTA
│   │   │   └── Skeleton.js       # Loading skeletons
│   │   ├── context/
│   │   │   └── AppContext.js     # ThemeProvider + AuthProvider
│   │   ├── pages/
│   │   │   ├── Home.js           # Landing page
│   │   │   ├── Pets.js           # Pet listing + filters
│   │   │   ├── PetDetail.js      # Pet detail + recommendations
│   │   │   ├── Gallery.js        # Masonry gallery + lightbox
│   │   │   ├── Reviews.js        # Reviews + add form
│   │   │   ├── Contact.js        # Contact form + map
│   │   │   └── admin/
│   │   │       ├── AdminLogin.js
│   │   │       ├── AdminLayout.js    # Sidebar layout
│   │   │       ├── AdminDashboard.js # Charts + stats
│   │   │       ├── AdminPets.js      # Pet CRUD
│   │   │       ├── AdminGallery.js   # Image management
│   │   │       └── AdminReviews.js   # Review management
│   │   ├── utils/
│   │   │   └── api.js            # Axios API client
│   │   ├── App.js                # Routes
│   │   └── index.css             # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── package.json                  # Root scripts (concurrently)
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **MongoDB** (local) OR [MongoDB Atlas](https://cloud.mongodb.com) (free cloud)
- **npm** v9+

---

## 🚀 Setup & Run Locally

### Step 1 — Clone / Download the project

```bash
cd chaitanya-pets
```

### Step 2 — Install all dependencies

```bash
# Install root tools
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Or use the combined script from root:
# npm run install:all
```

### Step 3 — Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and update:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chaitanya-pets
JWT_SECRET=your_super_secret_key_here_change_this
JWT_EXPIRE=7d

# Cloudinary (optional — for cloud image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=chaitanya2024

FRONTEND_URL=http://localhost:3000
```

> 💡 **MongoDB Atlas** (free cloud): replace MONGODB_URI with your Atlas connection string, e.g.  
> `mongodb+srv://username:password@cluster0.mongodb.net/chaitanya-pets`

### Step 4 — Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

`frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5 — Seed the Database (Sample Data)

This creates the admin account + sample pets, reviews, and gallery images:

```bash
cd backend
npm run seed
```

You'll see:
```
✅ Admin created - Username: admin, Password: chaitanya2024
✅ 8 pets created
✅ 6 reviews created
✅ 8 gallery images created
🎉 Database seeded successfully!
```

### Step 6 — Start the App

**Option A: Run both servers together (from root)**
```bash
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

---

## 🌍 Access the App

| URL | Description |
|---|---|
| `http://localhost:3000` | 🌐 Public Website |
| `http://localhost:3000/admin` | 🔐 Admin Panel |
| `http://localhost:3000/admin/login` | 🔑 Admin Login |
| `http://localhost:5000/api/health` | ✅ Backend Health Check |

### 🔑 Admin Credentials
```
Username: admin
Password: chaitanya2024
```

---

## 📡 REST API Reference

### Authentication
```
POST   /api/auth/login       → { username, password } → token
GET    /api/auth/me          → (protected) → admin info
POST   /api/auth/setup       → Creates first admin (run once)
```

### Pets
```
GET    /api/pets             → List all (filters: breed, status, minPrice, maxPrice)
GET    /api/pets/breeds      → All unique breeds
GET    /api/pets/stats       → Dashboard stats + time series (protected)
GET    /api/pets/:id         → Single pet + recommendations
POST   /api/pets             → Add pet with images (protected, multipart)
PUT    /api/pets/:id         → Update pet (protected, multipart)
DELETE /api/pets/:id         → Delete pet (protected)
```

### Reviews
```
GET    /api/reviews          → Approved reviews + avg rating
GET    /api/reviews/all      → All reviews (protected)
GET    /api/reviews/stats    → Reviews over time (protected)
POST   /api/reviews          → Add review { name, rating, comment }
DELETE /api/reviews/:id      → Delete review (protected)
```

### Gallery
```
GET    /api/gallery          → All images (filter: category)
POST   /api/gallery          → Upload image (protected, multipart)
DELETE /api/gallery/:id      → Delete image (protected)
```

---

## 🗄️ MongoDB Schemas

### Pet
```js
{
  name: String,           // required
  breed: String,          // required
  price: Number,          // required
  description: String,    // required
  images: [{ url, public_id }],
  status: 'Available' | 'Sold',
  age: String,
  gender: 'Male' | 'Female' | 'Unknown',
  vaccinated: Boolean,
  features: [String],
  createdAt, updatedAt    // auto
}
```

### Review
```js
{
  name: String,           // required
  rating: Number (1–5),   // required
  comment: String,        // required
  approved: Boolean,
  createdAt, updatedAt
}
```

### Admin
```js
{
  username: String,       // unique
  password: String,       // bcrypt hashed
  createdAt, updatedAt
}
```

### Gallery
```js
{
  url: String,
  public_id: String,
  category: 'General' | 'Puppies' | 'Dogs' | 'Cats' | 'Events' | 'Facilities',
  caption: String,
  createdAt, updatedAt
}
```

---

## ☁️ Cloudinary Setup (Production Image Storage)

1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, API Secret from dashboard
3. Add to `backend/.env`
4. Update `backend/middleware/upload.js` to use Cloudinary storage:

```js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'chaitanya-pets', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] }
});
```

---

## 🚀 Production Deployment

### Backend (Railway / Render / VPS)
```bash
# Set environment variables in your host dashboard
# Start command:
node server.js
```

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the build/ folder
```

Update `REACT_APP_API_URL` to your production backend URL.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Gold | `#d4a017` |
| Light Gold | `#f0c040` |
| Dark Gold | `#b8860b` |
| Brown | `#a0522d` |
| Dark Brown | `#5c3d08` |
| Cream BG | `#fefaf4` |
| Parchment | `#f5ede0` |
| Font Display | Playfair Display |
| Font Body | Lato |
| Font Accent | Dancing Script |

---

## 📞 Business Info

| | |
|---|---|
| **Business** | Chaitanya Pets Kennels |
| **Location** | 12-11-1653/A, Vidya Nagar, Amber Nagar, Warasiguda, Hyderabad |
| **Phone** | +91 96669 85145 |
| **WhatsApp** | [wa.me/919666985145](https://wa.me/919666985145) |
| **Hours** | Mon–Sun: 9:00 AM – 8:00 PM |

---

## 🛠️ Troubleshooting

**MongoDB connection error:**
```bash
# Make sure MongoDB is running locally:
mongod --dbpath /data/db

# Or use MongoDB Atlas cloud (no local install needed)
```

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Frontend can't reach backend:**
```bash
# Check REACT_APP_API_URL in frontend/.env
# Make sure backend is running on port 5000
# Check CORS: FRONTEND_URL in backend/.env must match your React dev URL
```

**Images not displaying:**
```bash
# Make sure the uploads/ folder exists in backend/
mkdir -p backend/uploads
```

---

## 📦 Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Tailwind CSS |
| Animations | CSS animations, Tailwind animate |
| Charts | Chart.js + react-chartjs-2 |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer (local) / Cloudinary (production) |
| State | React Context API |

---

*Made with ❤️ for pet lovers in Hyderabad*
