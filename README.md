# IKRR Event App

<div align="center">
  <h1>🎭 IK Regal Revelry - Event Management Platform</h1>
  <p><strong>"Your Story, Our Stage"</strong></p>
  <p>A comprehensive event management platform built with Next.js, React, and Prisma</p>
</div>

---

## 🚀 Overview

**IKRR Event App** is a full-featured event management platform designed to seamlessly connect event organizers with attendees. Built with modern web technologies, this application provides a complete solution for discovering, booking, and managing various types of events including weddings, corporate events, birthdays, and more.

The platform features a responsive design optimized for all devices, secure authentication, real-time notifications, and comprehensive admin tools for event management.

---

## ✨ Key Features

### 🎯 Core Functionality
- **Event Discovery & Browsing**: Explore upcoming events with detailed descriptions, schedules, and venue information
- **Smart Event Booking**: Intuitive booking system with multi-date support, custom requirements, and file uploads
- **Real-time Notifications**: Automated email confirmations for bookings and queries
- **Secure Authentication**: Google OAuth integration with role-based access control
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop experiences

### 👤 User Features
- **Personal Dashboard**: View and manage your bookings and queries
- **Event Registration**: Easy-to-use booking forms with multiple event types
- **Query Management**: Submit inquiries and track responses
- **Profile Management**: Secure user profiles with booking history

### 👨‍💼 Admin Features
- **Admin Dashboard**: Comprehensive management interface for all bookings and queries
- **Booking Management**: View, update, and manage all customer bookings with status tracking
- **Query Management**: Handle customer inquiries with status updates and responses
- **Gallery Management**: Upload and organize event photos with drag-and-drop functionality
- **Content Management**: Update about section images and manage event galleries

### 🎨 Event Types Supported
- **Weddings**: Engagement, Mehendi, Sangeet, Bangle Ceremony, Haldi, Lagan Sagai, Shaadi
- **Corporate Events**: Product launches, conferences, team building
- **Social Events**: Birthdays, Kitty Parties, Bachelorette parties
- **Educational Events**: Fresher parties, Farewell events, After-parties

### 🖼️ Gallery Features
- **Event Galleries**: Dedicated photo galleries for each event type
- **Admin Upload**: Secure image upload with caption support
- **Image Management**: Reorder, delete, and organize gallery images
- **Responsive Display**: Optimized image viewing across all devices

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: Native React forms with validation

### Backend & Database
- **Database**: [PostgreSQL](https://postgresql.org/)
- **ORM**: [Prisma](https://prisma.io/) with Prisma Client
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Google OAuth
- **API**: Next.js API Routes

### Development Tools
- **Language**: [TypeScript](https://typescriptlang.org/)
- **Linting**: [ESLint](https://eslint.org/)
- **Package Manager**: [npm](https://npmjs.com/)
- **Environment**: [dotenv](https://npmjs.com/package/dotenv)

### Additional Libraries
- **Email Service**: [Resend](https://resend.com/) for transactional emails
- **Date Picker**: [React DatePicker](https://reactdatepicker.com/)
- **File Uploads**: Native browser APIs with cloud storage

---

## 📁 Project Structure

```
ikrr_event_app/
├── prisma/
│   ├── schema.prisma          # Database schema and models
│   └── migrations/            # Database migration files
├── public/                    # Static assets (images, icons)
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── about/         # About section image management
│   │   │   ├── auth/          # NextAuth configuration
│   │   │   ├── bookings/      # Booking CRUD operations
│   │   │   ├── contact/       # Contact form and queries
│   │   │   ├── gallery/       # Gallery image management
│   │   │   └── queries/       # Query management (admin)
│   │   ├── book-event/        # Event booking page
│   │   ├── bookings/          # Admin bookings dashboard
│   │   ├── components/        # Reusable React components
│   │   │   ├── AuthSessionProvider.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── GalleryImageCard.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   └── Navbar.tsx
│   │   ├── events/            # Event category pages
│   │   ├── gallery/           # Gallery pages
│   │   ├── queries/           # Admin queries dashboard
│   │   ├── your-bookings/     # User bookings page
│   │   ├── your-queries/      # User queries page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── auth.ts                # Authentication configuration
│   ├── lib/
│   │   ├── email.ts           # Email service functions
│   │   └── prisma.ts          # Database client
│   └── types/
│       └── next-auth.d.ts     # TypeScript definitions
├── .env.example               # Environment variables template
├── .env.local                 # Local environment variables
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🗄️ Database Schema

### Core Models

#### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(CUSTOMER)

  // Relations
  accounts      Account[]
  sessions      Session[]
  bookings      EventQuery[]
  simpleQueries SimpleQuery[]
}
```

#### EventQuery Model (Bookings)
```prisma
model EventQuery {
  id              String        @id @default(cuid())
  eventTypes      String[]
  eventDates      String[]
  eventTimes      String[]
  eventVenue      String
  attendeeCount   Int
  budget          String
  status          BookingStatus @default(PENDING)
  brandingFileUrl String?
  setupDetails    String?
  themeDetails    String?
  avNeeds         String?
  foodNeeds       String?
  brandingNeeds   String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  userId          String?
  user            User?         @relation("UserBookings", fields: [userId], references: [id])
}
```

#### SimpleQuery Model (Contact Forms)
```prisma
model SimpleQuery {
  id        String      @id @default(cuid())
  name      String
  email     String
  phone     String?
  message   String
  status    QueryStatus @default(NEW)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  userId    String?
  user      User?       @relation("UserQueries", fields: [userId], references: [id])
}
```

#### GalleryImage Model
```prisma
model GalleryImage {
  id        String  @id @default(cuid())
  imageUrl  String
  caption   String?
  eventId   String
  order     Int     @default(0)
  createdAt DateTime @default(now())
}
```

### Enums
- **Role**: `CUSTOMER`, `ADMIN`
- **BookingStatus**: `PENDING`, `CONFIRMED`, `CANCELLED`
- **QueryStatus**: `NEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v8 or higher (comes with Node.js)
- **PostgreSQL**: v12 or higher
- **Git**: For version control

### 1. Clone the Repository
```bash
git clone https://github.com/harshsharma2004/ikrr-event-app.git
cd ikrr-event-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

#### Copy Environment Template
```bash
cp .env.example .env.local
```

#### Configure Environment Variables
Edit `.env.local` with your values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ikrr_event_app"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL="admin@ikrr.co.in"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"

# File Upload (Optional - for cloud storage)
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"
```

### 4. Database Setup

#### Initialize Prisma
```bash
npx prisma generate
```

#### Run Database Migrations
```bash
npx prisma db push
```

#### (Optional) Seed Database
```bash
npx prisma db seed
```

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### 6. Email Service Setup (Resend)

1. Sign up at [Resend](https://resend.com/)
2. Get your API key
3. Verify your domain for sending emails
4. Add the API key to your `.env.local`

### 7. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- `DATABASE_URL` - Production PostgreSQL connection
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Secure random string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_ADMIN_EMAIL`

### Recommended Deployment Platforms
- **Vercel**: Seamless Next.js deployment with automatic scaling
- **Railway**: Full-stack deployment with PostgreSQL
- **Render**: Cloud application hosting
- **AWS/GCP**: For enterprise deployments

---

## 📡 API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers
- `GET /api/auth/signin` - Sign-in page
- `POST /api/auth/signout` - Sign-out handler

### Bookings
- `GET /api/bookings` - Get user's bookings (authenticated)
- `POST /api/bookings` - Create new booking (authenticated)
- `GET /api/bookings/[bookingId]` - Get specific booking
- `PUT /api/bookings/[bookingId]` - Update booking (admin only)
- `DELETE /api/bookings/[bookingId]` - Delete booking (admin only)

### Queries/Contact
- `GET /api/contact` - Get user's queries (authenticated)
- `POST /api/contact` - Submit new query
- `GET /api/queries` - Get all queries (admin only)
- `GET /api/queries/[queryId]` - Get specific query (admin only)
- `PUT /api/queries/[queryId]` - Update query status (admin only)

### Gallery
- `GET /api/gallery/[eventId]` - Get gallery images for event
- `POST /api/gallery/upload` - Upload new image (admin only)
- `DELETE /api/gallery/delete` - Delete image (admin only)

### About Section
- `GET /api/about` - Get about section image
- `POST /api/about` - Update about section image (admin only)

---

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First**: Optimized for mobile devices (320px+)
- **Tablet Support**: Enhanced layouts for tablets (768px+)
- **Desktop Experience**: Full-featured desktop interface (1024px+)

### Navigation
- **Smart Navbar**: Changes appearance based on scroll position and page
- **Dropdown Menus**: Click-based navigation for better mobile experience
- **User Profile**: Context-aware menu with role-based options

### Forms & Interactions
- **Progressive Enhancement**: Works without JavaScript
- **Real-time Validation**: Client-side form validation
- **Loading States**: Visual feedback for all async operations
- **Error Handling**: User-friendly error messages

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color combinations

---

## 🔐 Security Features

### Authentication & Authorization
- **OAuth 2.0**: Secure Google authentication
- **Session Management**: Secure HTTP-only cookies
- **Role-Based Access**: Admin and customer role separation
- **API Protection**: Route-level authentication checks

### Data Protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: React's built-in XSS prevention
- **CSRF Protection**: NextAuth.js CSRF tokens

### File Upload Security
- **File Type Validation**: Only allowed image types
- **Size Limits**: Maximum file size restrictions
- **Secure Storage**: Cloud storage with access controls

---

## 📧 Email System

### Automated Emails
- **Booking Confirmation**: Sent when booking is submitted
- **Query Acknowledgment**: Sent when contact form is submitted
- **Status Updates**: Admin can trigger status update emails

### Email Templates
- **HTML Templates**: Professional, branded email designs
- **Responsive Layouts**: Mobile-friendly email templates
- **Dynamic Content**: Personalized with user data

### Configuration
```typescript
// Email service configuration
const emailConfig = {
  from: 'noreply@ikrr.co.in',
  replyTo: 'info@ikrr.co.in',
  templates: {
    bookingConfirmation: 'booking-confirmation.html',
    queryAcknowledgment: 'query-acknowledgment.html',
  }
};
```

---

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```
__tests__/
├── components/     # Component tests
├── pages/         # Page tests
├── api/           # API route tests
├── lib/           # Utility function tests
└── e2e/           # End-to-end tests
```

---

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Make** your changes and add tests
4. **Run** the linter: `npm run lint`
5. **Commit** your changes: `git commit -m 'Add your feature'`
6. **Push** to your branch: `git push origin feature/your-feature`
7. **Create** a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with React rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

### Branch Naming
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `docs/` - Documentation updates

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Prisma Team** for the excellent ORM
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons
- **Resend** for reliable email delivery

---

## 📞 Support

For support, email info@ikrr.co.in or create an issue in this repository.

**IK Regal Revelry** - Making every event unforgettable! 🎉