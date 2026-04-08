# Garden Care Backend - Setup Guide

## Prerequisites
- Node.js v16+ 
- MySQL Server 8.0+
- npm or yarn

## Installation & Setup

### 1. Clone & Navigate
```bash
cd back-end
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and update with your database credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=garden_care
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_with_mixed_case!
API_PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

⚠️ **Important**: JWT_SECRET must be at least 32 characters with mixed case and numbers.

### 4. Setup Database
```bash
# Login to MySQL
mysql -u root -p

# Import schema
source back-end/database/schema.sql;

# Optional: Import sample data
source database/sample_data_vietnamese.sql;
```

### 5. Start Server
```bash
# Development with hot reload
npm run dev

# Production
npm start
```

Server will run at: `http://localhost:5000`
API Docs available at: `http://localhost:5000/api-docs`

## Database Tables
- `users` - User accounts with roles (user, staff, admin)
- `services` - Garden care services catalog
- `bookings` - Service booking records
- `reviews` - Customer reviews

## API Routes

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### User Profile
- `GET /api/users/profile` - Get current user info
- `PUT /api/users/profile` - Update user info

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update status
- `PUT /api/bookings/:id/payment` - Update payment
- `DELETE /api/bookings/:id` - Cancel booking

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/staff` - Staff list
- `GET /api/admin/reviews` - Reviews management

### Services
- `GET /api/services` - List all services
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service

### Revenue
- `GET /api/revenue` - Total revenue
- `GET /api/revenue/by-date` - Revenue by date

## Middleware
- `authMiddleware` - JWT token verification
- `adminMiddleware` - Admin role verification
- `staffMiddleware` - Staff role verification
- `createRateLimiter` - Rate limiting for auth routes

## Key Features
✅ JWT-based authentication  
✅ Role-based access control (RBAC)  
✅ Swagger API documentation  
✅ Request validation with Joi  
✅ CORS enabled for frontend  
✅ Error handling & logging  
✅ Parameterized queries (SQL injection prevention)  

## Testing
```bash
npm test
```

## Development Tips
- Use Postman collection at `back-end/postman/` for API testing
- Enable CORS_ORIGINS matching your frontend URL
- Check logs in console for error details
- Rate limiter: 20 requests/15min for register, 10/15min for login

## Deployment
1. Set `NODE_ENV=production`
2. Update `.env` with production database credentials
3. Ensure MongoDB is running
4. Deploy to server (Heroku, AWS, DigitalOcean, etc.)

## Troubleshooting
**Can't connect to database?**
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database `garden_care` exists

**JWT_SECRET error?**
- Must be exactly 32+ characters
- Include mixed case and numbers
- No quotes in `.env` value

**CORS errors?**
- Add your frontend URL to `CORS_ORIGINS` in `.env`
- Use comma-separated list for multiple origins
