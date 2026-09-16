# Froyal Amity Store

A complete full-stack eStore starter built with Node.js, Express, MongoDB, React, Axios, and Tailwind CSS. It includes product browsing, cart flow, checkout UI, authentication pages, user orders , Advertisement, and an admin dashboard .

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

### Custom frontend domain (Namecheap)

After connecting your Namecheap domain to the frontend host, configure both deployed services and redeploy them:

1. In the frontend host (for example, Vercel), set `VITE_API_URL` to `https://froyalamitystore.onrender.com/api`.
2. In the backend host (for example, Render), set `CLIENT_URLS` to `https://froyalamity.com,https://www.froyalamity.com`. Include only hosts that actually serve the storefront.
3. Keep both services on HTTPS. The API's `froyal_access_token` cookie is `Secure`, `HttpOnly`, and `SameSite=None` for cross-site frontend/API deployments.

Do not use `*` for CORS: credentialed admin requests require an explicit allowed origin.

## API Reference

Use `http://localhost:5000/api` as the local base URL or `https://froyalamitystore.onrender.com/api` in production. Authentication uses a Secure, HttpOnly `froyal_access_token` cookie; the browser never receives a reusable bearer token.

### System and authentication

```text
GET  /health                         # Checks whether the API is running.
POST /auth/register                  # Creates a customer account and starts a session.
POST /auth/login                     # Checks credentials and starts a session.
POST /auth/logout                    # Clears the current authentication cookie.
GET  /auth/me                        # Returns the currently signed-in user's profile. [Authenticated]
PUT  /auth/profile                   # Updates the signed-in user's profile, address, preferences, or password. [Authenticated]
```

Failed login and registration attempts are limited to 10 per 15 minutes per IP address. Successful logins and normal session checks do not count toward that limit.

Registration body:

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"password": "StrongPassword123"
}
```

### Products

```text
GET    /products                     # Lists public products with optional search, category, featured, paging, and sorting filters.
GET    /products/:idOrSlug           # Returns one product by MongoDB ID or slug.
GET    /products/admin/all           # Lists every product, including drafts and archived products. [Admin]
POST   /products                     # Creates a product. [Admin]
PUT    /products/:id                 # Updates a product. [Admin]
DELETE /products/:id                 # Deletes a product. [Admin]
POST   /products/:id/reviews         # Adds a signed-in customer's product review. [Authenticated]
```

### Categories

```text
GET    /categories                   # Lists active product categories for the storefront.
POST   /categories                   # Creates a category. [Admin]
PUT    /categories/:id               # Updates a category. [Admin]
DELETE /categories/:id               # Deletes a category. [Admin]
```

### Orders

```text
POST /orders                         # Creates an order for the signed-in customer. [Authenticated]
GET  /orders/mine                    # Lists the signed-in customer's orders. [Authenticated]
GET  /orders/:id                     # Returns an order visible to the signed-in customer. [Authenticated]
GET  /orders                         # Lists all orders for administration. [Admin]
PUT  /orders/:id/pay                 # Marks an order as paid. [Admin]
PUT  /orders/:id/deliver             # Marks an order as delivered. [Admin]
```

### Users

```text
GET    /users                        # Lists all users without exposing passwords. [Admin]
GET    /users/:id                    # Returns one user without exposing the password. [Admin]
PUT    /users/:id                    # Updates an administrator-managed user record. [Admin]
DELETE /users/:id                    # Deletes a user account. [Admin]
```

### Image uploads

```text
POST /uploads/image                  # Uploads one image to Cloudinary; send multipart field `image`. [Admin]
```

### Blogs

```text
GET  /blogs                          # Lists published blog posts.
GET  /blogs/:slug                    # Returns one published blog post by slug.
POST /blogs/:slug/comments            # Adds a comment to a blog post. [Authenticated]
```

### Advertisements

```text
GET /advertisements                  # Lists active advertisements for the storefront.
```

### Admin dashboard

All `/admin` endpoints require an authenticated user whose database `role` is `admin`.

```text
GET    /admin/stats                  # Returns dashboard totals for revenue, orders, products, and customers. [Admin]
GET    /admin/orders                 # Lists all orders with customer details. [Admin]
GET    /admin/orders/:id             # Returns one order with customer details. [Admin]
PUT    /admin/orders/:id/status      # Changes an order status and sends configured notifications. [Admin]
GET    /admin/users                  # Lists all users for the dashboard. [Admin]
GET    /admin/blogs                  # Lists all blog posts, including unpublished posts. [Admin]
POST   /admin/blogs                  # Creates a blog post. [Admin]
PUT    /admin/blogs/:id              # Updates a blog post. [Admin]
DELETE /admin/blogs/:id              # Deletes a blog post. [Admin]
GET    /admin/advertisements         # Lists all advertisements for management. [Admin]
POST   /admin/advertisements         # Creates an advertisement. [Admin]
PUT    /admin/advertisements/:id     # Updates an advertisement. [Admin]
DELETE /admin/advertisements/:id     # Deletes an advertisement. [Admin]
```

For protected Postman requests, keep the `froyal_access_token` cookie returned by `/auth/login`.

## Notes

- Cloudinary upload code is prepared as a placeholder utility.
- Admin routes are protected by auth and admin middleware. Make one account an `admin` in MongoDB before using the dashboard.
- Create the first admin once with `cd backend` followed by `npm run create:admin`; the command connects to MongoDB, prompts for credentials, and refuses to create a second admin.
- Customers can save profile, delivery address, notification choices, change password, view order history, and place authenticated orders. The server recalculates prices from products to prevent browser-side price manipulation.
- The frontend currently uses elegant local demo data when the API is unavailable, so you can preview the UI before connecting MongoDB.

## Production safety notes

- Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` to the API URL.
- Use a JWT secret of at least 32 characters. Browser sessions use a Secure, HttpOnly cookie with no browser-accessible bearer-token fallback.
- Orders reserve inventory through a MongoDB transaction. Production MongoDB must support transactions (MongoDB Atlas replica sets do).
- Card payment capture is intentionally not implemented yet. Do not fulfil `processing` orders until a signed, idempotent payment-provider webhook is integrated.
