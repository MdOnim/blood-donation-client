# LifeLink - Blood Donation Platform (Client)

A modern, responsive blood donation platform built with React that connects donors with patients in need across Bangladesh.

## Deployment

### 1) Deploy server (Render)

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** → **Blueprint** (or **Web Service**).
3. Connect repo: `MdOnim/blood-donation-server`.
4. If using Blueprint, Render reads `render.yaml` automatically.
5. Add these environment variables in Render:

```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
STRIPE_SECRET_KEY=sk_test_your_key
CLIENT_URL=https://your-vercel-app.vercel.app
```

6. Deploy and copy your server URL, e.g. `https://blood-donation-server.onrender.com`.
7. In Render **Shell**, run once after first deploy:

```bash
npm run seed:admin
```

8. In MongoDB Atlas → **Network Access**, allow `0.0.0.0/0` so Render can connect.

### 2) Deploy client (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New Project** → import `MdOnim/blood-donation-client`.
3. Framework preset: **Vite**.
4. Add environment variables:

```
VITE_API_URL=https://your-render-server.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_IMGBB_API_KEY=your_imgbb_key
```

5. Deploy and copy your Vercel URL.

### 3) Final step (important)

Go back to Render and update:

```
CLIENT_URL=https://your-vercel-app.vercel.app
```

Then redeploy the server so CORS allows your live frontend.

### 4) Test live site

- Register / login
- Create donation request
- Search requests
- Stripe funding test payment
- Admin login: `admin@lifelink.com` / `Admin@123`

## Live URL
`https://your-frontend-url.vercel.app` *(add after Vercel deployment)*

## Purpose
LifeLink facilitates blood donation by allowing users to register as donors, create and manage blood donation requests, search for matching requests by location and blood group, and contribute funds to support the organization.

## Key Features
- User registration & login with JWT authentication
- Role-based dashboards (Donor, Admin, Volunteer)
- Blood donation request management with status tracking
- Search donation requests by blood group, division, district, and upazila
- Stripe Checkout funding integration
- Profile management with ImageBB avatar upload
- Responsive sidebar dashboard layout
- Admin user management (block/unblock, role assignment)
- Pagination and filtering on donation requests
- Charts and statistics on admin/volunteer dashboard
- Dark mode and Framer Motion animations

## Admin Credentials (for examiner)
Use the seeded admin account from the server:

```
Email: admin@lifelink.com
Password: Admin@123
```

Run on the server before testing admin features:

```bash
npm run seed:admin
```

## Tech Stack
- React 19 + Vite
- React Router DOM
- Tailwind CSS v4
- Axios
- TanStack React Query
- Framer Motion
- React Hot Toast
- Recharts
- Stripe.js

## Environment Variables
Create a `.env` file based on `.env.example`:

```
VITE_API_URL=http://localhost:5000/api
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

For production, set `VITE_API_URL` to your deployed server URL.

## Getting Started

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## NPM Packages Used
- react, react-dom, react-router-dom
- axios, @tanstack/react-query
- tailwindcss, @tailwindcss/vite
- framer-motion, react-hot-toast, react-icons
- @stripe/stripe-js, @stripe/react-stripe-js
- recharts

## Server Repository
`https://github.com/MdOnim/blood-donation-server`
