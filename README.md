<div align="center">

# 🎨 Thumblify

### 🚀 AI-Powered YouTube Thumbnail Generator

<p>
  <strong>Generate high-converting thumbnails in seconds using AI</strong><br/>
  Save hours of design time and boost your click-through rate 🚀
</p>

<br/>

<p>
  <a href="https://your-live-link.com">
    <img src="https://img.shields.io/badge/🌐 Live Demo-Click Here-blue?style=for-the-badge" />
  </a>
  &nbsp;
  <a href="../../issues">
    <img src="https://img.shields.io/badge/🐛 Report Bug-red?style=for-the-badge" />
  </a>
  &nbsp;
  <a href="../../issues">
    <img src="https://img.shields.io/badge/✨ Request Feature-purple?style=for-the-badge" />
  </a>
</p>

<br/>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Stability_AI-SDXL-purple?style=flat-square" />
</p>

<br/>

<img src="./screenshots/home.png" alt="Thumblify Banner" width="90%" />

</div>

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Deployment](#-deployment)
- [Developer](#-developer)

---

## 🧠 About

Thumblify is a full-stack AI-powered thumbnail generator built for YouTube creators. Simply type your video title, choose a style and color scheme — and get a professional, click-worthy thumbnail in under 30 seconds.

> Built as a student project using MERN Stack + Stability AI + Cloudinary.

---

## ✨ Features

### 🎯 Core
- **AI Image Generation** — Generate professional thumbnails using Stability AI SDXL
- **Title Text Overlay** — Automatically adds title text on the image using Sharp
- **5 Unique Styles** — Bold & Graphic, Tech/Futuristic, Minimalist, Photorealistic, Illustrated
- **8 Color Schemes** — Vibrant, Neon, Sunset, Forest, Ocean, Pastel, Purple, Monochrome
- **3 Aspect Ratios** — 16:9 (YouTube), 1:1 (Instagram), 9:16 (Shorts)

### 👤 User
- **Auth** — Email/Password + Google OAuth
- **Credits System** — 5 free credits (1 per generation)
- **Profile Page** — Edit name, view total generations
- **Analytics Dashboard** — Monthly bar charts, style & color breakdown

### 🖼️ Thumbnail Management
- **My Generations** — View all thumbnails in one place
- **Regenerate** — Regenerate thumbnails with same or new settings
- **Collections** — Organize thumbnails into folders (Gaming, Tech, Vlogs...)
- **Download / Delete / Copy Link**

### 🔍 Search & Filter
- Search by title
- Filter by style
- Sort by date (Latest / Oldest)

### 🎨 Template Library
- 15+ pre-made templates — Gaming, Tech, Finance, Cooking, Motivation
- One click apply — Automatically fills title, style and color fields

---

## 💼 Real-World Impact

- Solves real problem for YouTube creators
- Reduces thumbnail creation time from hours to seconds
- Implements scalable full-stack architecture
- Uses AI APIs in production-like workflow

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS v4 |
| **Animations** | Framer Motion, Lenis Scroll |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | Express Session + Google OAuth |
| **AI** | Stability AI SDXL (Image Generation) |
| **Image Processing** | Sharp (text overlay) |
| **Storage** | Cloudinary |
| **Charts** | Recharts |

---

## 📸 Screenshots

<p align="center">
  <img src="./screenshots/home.png" alt="Home Page" height="250px" style="object-fit: cover; margin:10px;" />
  <img src="./screenshots/generate.png" alt="Generate Page" height="250px" style="object-fit: cover; margin:10px;" />
</p>

<p align="center">
  <img src="./screenshots/mygeneration.png" alt="My Generations" height="250px" style="object-fit: cover; margin:10px;" />
  <img src="./screenshots/profile.png" alt="Profile Page" height="250px" style="object-fit: cover; margin:10px;" />
</p>

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Stability AI API Key → [stability.ai](https://stability.ai)
- Cloudinary account → [cloudinary.com](https://cloudinary.com)
- Google OAuth credentials *(optional)*

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/thumblify.git
cd thumblify
```

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

Server will run at: `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## ⚙️ Environment Variables

### `server/.env`

```env
PORT=3000
SESSION_SECRET=any_random_string

MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/thumblify

STABILITY_API_KEY=sk-xxxxxxxxxxxxxxxx

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new account |
| `POST` | `/login` | Login user |
| `POST` | `/logout` | Logout user |
| `GET` | `/verify` | Verify session |
| `POST` | `/google` | Google OAuth login |

### Thumbnails — `/api/thumbnail`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/generate` | Generate a new thumbnail |
| `POST` | `/regenerate/:id` | Regenerate an existing thumbnail |
| `DELETE` | `/delete/:id` | Delete a thumbnail |

### User — `/api/user`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/thumbnails` | Fetch all thumbnails |
| `GET` | `/thumbnail/:id` | Fetch a single thumbnail |
| `GET` | `/credits` | Get remaining credits |
| `GET` | `/profile` | Fetch user profile |
| `PUT` | `/profile` | Update user profile |

### Collections — `/api/collection`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all collections |
| `POST` | `/create` | Create a new collection |
| `DELETE` | `/delete/:id` | Delete a collection |
| `PATCH` | `/assign` | Assign thumbnail to a collection |

### Templates — `/api/template`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all templates (with category filter) |
| `POST` | `/seed` | Seed default templates |

---

## 📁 Project Structure

```
Thumblify/
├── frontend/                    # React Frontend
│   └── src/
│       ├── components/          # Reusable UI Components
│       ├── pages/               # Route Pages
│       │   ├── HomePage.tsx
│       │   ├── Generate.tsx     # Main generation page
│       │   ├── MyGeneration.tsx
│       │   ├── Profile.tsx
│       │   ├── Analytics.tsx
│       │   └── About.tsx
│       ├── sections/            # Homepage Sections
│       ├── context/
│       │   └── AuthContext.tsx  # Global auth state
│       └── configs/
│           └── api.ts           # Axios instance
│
└── server/                      # Express Backend
    ├── controller/              # Business Logic
    ├── models/                  # MongoDB Schemas
    ├── routes/                  # API Routes
    ├── middlewares/
    │   └── auth.ts              # Session middleware
    └── server.ts                # Entry point
```

---

## ⚡ How It Works

```
User enters title and selects style & color
        ↓
Credits are validated
        ↓
Image is generated via Stability AI SDXL
        ↓
Title text overlay is added using Sharp
        ↓
Image is uploaded to Cloudinary
        ↓
Data is stored in MongoDB
        ↓
Displayed to the user in Preview ✅
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Set **Root directory** to `frontend`
4. Add environment variables
5. Deploy the project ✅

### Backend → Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set **Root directory** to `server`
4. Add environment variables
5. Deploy the project ✅

---

## 🚧 Future Improvements

- 🎥 Thumbnail preview with animations  
- 💳 Payment integration (Stripe)  
- 📱 Mobile optimization  
- 🤖 More AI styles & templates  

## 📊 Credits System

| Plan | Credits | Price |
|---|---|---|
| Free | 20 thumbnails | ₹0 |
| Pro *(Coming Soon)* | Unlimited | ₹299/month |

---

## 👨‍💻 Developer

**Ankuj Matre**

> Built with ❤️ as a student project using MERN Stack + AI APIs

---

## 🙏 Acknowledgments

- [Stability AI](https://stability.ai) — Image generation model
- [Cloudinary](https://cloudinary.com) — Image storage & CDN
- [MongoDB Atlas](https://mongodb.com) — Cloud database
- [Google OAuth](https://developers.google.com/identity) — Social login

---

<div align="center">

**⭐ If you found this project helpful, please give it a Star on GitHub!**

</div>