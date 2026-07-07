# LifeLink - Blood Donation Platform (Client)

A modern, responsive blood donation platform built with React that connects donors with patients in need across Bangladesh.

## Live URL
`https://your-frontend-url.vercel.app` *(update after deployment)*

## Purpose
LifeLink facilitates blood donation by allowing users to register as donors, create and manage blood donation requests, search for donors by location and blood group, and contribute funds to support the organization.

## Key Features
- User registration & login with JWT authentication
- Role-based dashboards (Donor, Admin, Volunteer)
- Blood donation request management with status tracking
- Donor search by blood group, district, and upazila
- Stripe payment integration for organizational funding
- Profile management with ImageBB avatar upload
- Responsive sidebar dashboard layout
- Admin user management (block/unblock, role assignment)
- Pagination and filtering on donation requests
- Charts and statistics on admin/volunteer dashboard

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
