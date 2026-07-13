# Froyal Amity Store

A complete full-stack eStore starter built with Node.js, Express, MongoDB, React, Axios, and Tailwind CSS. It includes product browsing, cart flow, checkout UI, authentication pages, user orders, and an admin dashboard.

## Project Structure

- `backend`: Express API with controllers, routes, middleware, models, and config.
- `frontend`: React app with reusable components, pages, context, Axios API client, and Tailwind styling.

## Setup

1. Copy the backend environment file:

```bash
cp backend/.env.example backend/.env
```

2. Add your MongoDB, JWT, and Cloudinary credentials in `backend/.env`. Start with `backend/.env.example`—it also documents optional Resend email and WhatsApp Cloud API credentials for order-status notifications. Never commit your real `.env` file.

3. Install dependencies:

```bash
npm run install:all
```

4. Run both apps:

```bash
npm run dev
```

## Default URLs

- Frontend: `https://froyalamitystore-nu.vercel.app`
- Backend API: `http://localhost:5000/api`

## Notes

- Cloudinary upload code is prepared as a placeholder utility.
- Admin routes are protected by auth and admin middleware. Make one account an `admin` in MongoDB before using the dashboard.
- Customers can save profile, delivery address, notification choices, change password, view order history, and place authenticated orders. The server recalculates prices from products to prevent browser-side price manipulation.
- The frontend currently uses elegant local demo data when the API is unavailable, so you can preview the UI before connecting MongoDB.
