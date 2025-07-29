# YKY Electricals - Complete Web Application

A modern, professional web application for YKY Electricals, offering electrical installation and repair services.

## 🚀 Features

### Frontend Features
- **Modern Hero Section** with compelling call-to-action
- **Responsive Project Gallery** with filtering capabilities
- **Professional Contact Form** with Google Maps integration
- **Complete Service Booking System** with status tracking
- **User Authentication** for customers and admin
- **Admin Dashboard** for managing bookings and projects
- **Mobile-first Responsive Design**

### Backend Features
- **RESTful API** built with Node.js and Express
- **SQLite Database** for data persistence
- **JWT Authentication** for secure user sessions
- **Email Notifications** for booking updates
- **File Upload** for project images
- **Rate Limiting** and security middleware
- **Admin Panel** with comprehensive management tools

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **SQLite3** database
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email notifications
- **Multer** for file uploads
- **Helmet** for security

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yky-electricals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   
   # JWT Secret (change this in production)
   JWT_SECRET=your-super-secret-jwt-key
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@ykyelectricals.com
   ```

## 🚀 Running the Application

### Development Mode

1. **Start both frontend and backend**
   ```bash
   npm run dev:full
   ```

   Or run them separately:

2. **Start the backend server**
   ```bash
   npm run dev:server
   ```

3. **Start the frontend (in another terminal)**
   ```bash
   npm run dev
   ```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   NODE_ENV=production npm run dev:server
   ```

## 👤 Default Admin Account

The application creates a default admin account:
- **Email**: admin@ykyelectricals.com
- **Password**: admin123

**⚠️ Important**: Change the admin password after first login in production!

## 📊 Database

The application uses SQLite with the following tables:
- **users** - User accounts and authentication
- **bookings** - Service booking requests
- **contact_messages** - Contact form submissions
- **projects** - Project gallery items

The database file is automatically created at `server/database.sqlite`.

## 📧 Email Configuration

To enable email notifications:

1. **For Gmail**, use App Passwords:
   - Enable 2-factor authentication
   - Generate an App Password
   - Use the App Password in `SMTP_PASS`

2. **For other providers**, update SMTP settings in `.env`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Bookings
- `POST /api/bookings` - Create booking (authenticated)
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/all` - Get all bookings (admin)
- `PUT /api/bookings/:id/status` - Update booking status (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (admin)
- `PUT /api/contact/:id/read` - Mark as read (admin)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/recent-activities` - Get recent activities

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **Helmet** for security headers
- **Input Validation** and sanitization
- **File Upload Security** with type and size limits

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** interface elements
- **Optimized images** and loading states

## 🎨 Design System

- **Colors**: Professional blue and orange palette
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: 8px grid system
- **Components**: Consistent card-based layouts
- **Animations**: Smooth transitions and hover effects

## 📈 Performance

- **Vite** for fast development and optimized builds
- **Code Splitting** with React Router
- **Image Optimization** with proper sizing
- **Database Indexing** for fast queries
- **Caching Headers** for static assets

## 🧪 Testing

Run the linter:
```bash
npm run lint
```

## 📄 License

This project is proprietary software for YKY Electricals.

## 🤝 Support

For support and questions, contact the development team or refer to the API documentation.

---

**Built with ❤️ for YKY Electricals**
