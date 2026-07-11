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

2. Add your MongoDB, JWT, and Cloudinary credentials later.

3. Install dependencies:

```bash
npm run install:all
```

4. Run both apps:

```bash
npm run dev
```

## Default URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Notes

- Cloudinary upload code is prepared as a placeholder utility.
- Admin routes are protected by auth and admin middleware.
- The frontend currently uses elegant local demo data when the API is unavailable, so you can preview the UI before connecting MongoDB.
