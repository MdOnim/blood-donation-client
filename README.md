# LifeLink - Blood Donation Platform (Client)

A modern, responsive blood donation platform built with React that connects donors with patients in need across Bangladesh.

## Deployment

Deploy both the **server** and **client** on [Vercel](https://vercel.com) — one account, no Render needed.

### 1) MongoDB Atlas (one-time)

1. In [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access** → add `0.0.0.0/0` so Vercel can connect.
2. Copy your Atlas connection string for `MONGODB_URI`.

### 2) Deploy server on Vercel

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub.
2. **Add New Project** → import `MdOnim/blood-donation-server`.
3. Framework: **Other** (Express API).
4. Root directory: leave as `.` (repo root).
5. Add environment variables:

```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
STRIPE_SECRET_KEY=sk_test_your_key
CLIENT_URL=https://your-client-app.vercel.app
```

Use a placeholder for `CLIENT_URL` for now; update it after the client deploys.

6. Deploy and copy your server URL, e.g. `https://blood-donation-server.vercel.app`.

### 3) Seed admin (run once from your PC)

In the `server` folder, make sure `.env` has your **production** `MONGODB_URI`, then run:

```bash
npm run seed:admin
```

Admin login: `admin@lifelink.com` / `Admin@123`

### 4) Deploy client on Vercel

1. **Add New Project** → import `MdOnim/blood-donation-client`.
2. Framework preset: **Vite**.
3. Add environment variables:

```
VITE_API_URL=https://your-server-app.vercel.app/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_IMGBB_API_KEY=your_imgbb_key
```

4. Deploy and copy your client URL, e.g. `https://blood-donation-client.vercel.app`.

### 5) Final step (important)

Go back to the **server** project on Vercel → **Settings → Environment Variables**:

```
CLIENT_URL=https://your-client-app.vercel.app
```

Redeploy the server so Stripe redirects and CORS use the correct frontend URL.

### 6) Test live site

- Register / login
- Create donation request
- Search requests
- Stripe funding (test card: `4242 4242 4242 4242`)
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
