# Queries Management System - Setup & Usage Guide

## Overview
This guide explains the complete queries management system that allows customers to submit queries through the contact form and manage them, while admins can view and manage all customer queries.

## Features

### For Customers
- **Submit Queries:** Send queries through the contact form in the footer
- **View Your Queries:** Access `/your-queries` to see all your submitted queries
- **Track Status:** Monitor the status of your queries (NEW, IN_PROGRESS, RESOLVED, CLOSED)
- **Automatic Tracking:** Queries are linked to your account when logged in

### For Admin (harsh.141615.gmail.com)
- **View All Queries:** Access `/queries` to see all customer queries
- **Manage Status:** Update query status (NEW, IN_PROGRESS, RESOLVED, CLOSED)
- **Add Notes:** Add admin notes to queries for internal reference
- **Delete Queries:** Remove queries from the system
- **Full CRUD:** Complete Create, Read, Update, Delete operations

## Database Schema

### SimpleQuery Model
```prisma
model SimpleQuery {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Form fields
  name      String
  email     String
  phone     String?
  message   String
  
  // Status and management
  status    String   @default("NEW")
  notes     String?
  
  // Relation to User
  user   User?   @relation("UserQueries", fields: [userId], references: [id], onDelete: SetNull)
  userId String?
}
```

## Setup Instructions

### 1. Database Migration
Run the migration to update the database schema:

```bash
npx prisma migrate dev
```

This will:
- Add `updatedAt` field to track last modification
- Add `status` field (default: "NEW")
- Add `notes` field for admin comments
- Make `userId` optional (for non-logged-in submissions)

### 2. Environment Variables
Ensure your `.env.local` has:

```env
NEXT_PUBLIC_ADMIN_EMAIL=harsh.141615.gmail.com
DATABASE_URL=your_postgresql_url
```

### 3. Restart Development Server
```bash
npm run dev
```

## Pages & Routes

### Customer Pages

#### `/your-queries`
- **Access:** Logged-in customers only
- **Shows:** Only queries submitted by the logged-in user
- **Features:**
  - View query details
  - Track query status
  - See submission date and last update
  - View admin responses

### Admin Pages

#### `/queries`
- **Access:** Admin only (harsh.141615.gmail.com)
- **Shows:** All queries from all customers
- **Features:**
  - Filter by status (NEW, IN_PROGRESS, RESOLVED, CLOSED)
  - Edit query status and add notes
  - Delete queries
  - View customer contact information
  - See linked user account (if logged in)

## API Endpoints

### Submit Query (Contact Form)
**POST** `/api/contact`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "message": "I would like to book an event"
}
```

Response:
```json
{
  "message": "Query submitted successfully",
  "query": {
    "id": "cxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "NEW",
    "createdAt": "2024-02-20T10:30:00Z",
    "userId": "user-id-if-logged-in"
  }
}
```

### Get User's Queries
**GET** `/api/contact`

Requires: Authentication (logged-in user)

Response:
```json
{
  "queries": [
    { ...query details... }
  ]
}
```

### Get All Queries (Admin)
**GET** `/api/queries/all`

Requires: Admin authentication

Response:
```json
{
  "queries": [
    {
      "id": "query-id",
      "name": "Customer Name",
      "email": "customer@example.com",
      "message": "Query details",
      "status": "NEW",
      "notes": "Admin notes",
      "createdAt": "2024-02-20T10:30:00Z",
      "user": { "id": "...", "email": "..." }
    }
  ]
}
```

### Get Specific Query (Admin)
**GET** `/api/queries/[queryId]`

Requires: Admin authentication

### Update Query (Admin)
**PATCH** `/api/queries/[queryId]`

Request:
```json
{
  "status": "IN_PROGRESS",
  "notes": "We are working on this request"
}
```

### Delete Query (Admin)
**DELETE** `/api/queries/[queryId]`

Requires: Admin authentication

## User Flows

### Customer Flow: Submit Query
1. Customer fills out contact form in footer
2. Form submits to `/api/contact`
3. Query is saved to database with user ID (if logged in)
4. Customer sees success message
5. Customer can view query at `/your-queries`

### Customer Flow: View Their Queries
1. Customer logs in
2. Navigates to "Your Queries" from profile menu
3. Views all their submitted queries
4. Can see status and updates from admin

### Admin Flow: Manage Queries
1. Admin logs in with harsh.141615.gmail.com
2. Navigates to "Manage All Queries" from profile menu
3. Views all customer queries (filtered by status)
4. Clicks edit button on a query
5. Updates status and adds notes
6. Saves changes
7. Can also delete queries if needed

## Query Status Meanings

- **NEW:** Query just received, not yet reviewed
- **IN_PROGRESS:** Admin is working on the query
- **RESOLVED:** Query has been resolved/answered
- **CLOSED:** Query is closed and no longer active

## Security & Access Control

### Authentication
- All query operations require NextAuth session validation
- User session checked on both client and server

### Authorization
- **Customers:** Can only view their own queries
- **Admin:** Can view and modify all queries
- **Non-authenticated users:** Can submit queries but need to log in to view them

### Validation
- Email verification on submission
- Admin email verified via session (`harsh.141615.gmail.com`)
- Proper error handling with clear messages

## Code Components

### Pages
- `src/app/your-queries/page.tsx` - Customer query dashboard
- `src/app/queries/page.tsx` - Admin query management

### API Routes
- `src/app/api/contact/route.ts` - Submit and get user queries
- `src/app/api/queries/[queryId]/route.ts` - Admin CRUD operations

### Components
- `src/app/components/Footer.tsx` - Contact form
- `src/app/components/Navbar.tsx` - Navigation links

## Troubleshooting

### Query submission fails
- Check browser console (F12 → Console)
- Ensure email is valid format
- Verify database connection

### "Unauthorized" error
- For admin access: Ensure logged in with harsh.141615.gmail.com
- For customer access: Must be logged in to view own queries

### Queries not appearing
- Refresh the page (Ctrl+R)
- Check database connection
- Verify session is active

### Admin can't see all queries
- Verify email is exactly: harsh.141615.gmail.com
- Clear browser cookies and re-login
- Check NEXT_PUBLIC_ADMIN_EMAIL environment variable

## Testing

### Test Submission (Not Logged In)
1. Go to home page
2. Scroll to footer contact form
3. Fill out form and submit
4. Verify success message

### Test Submission (Logged In)
1. Log in as any user
2. Submit query from contact form
3. Navigate to "Your Queries"
4. Verify query appears

### Test Admin Access
1. Log in as harsh.141615.gmail.com
2. Click profile → "Manage All Queries"
3. Verify all queries are listed
4. Test edit, update, and delete functionality

## Performance Notes

- Queries are indexed by userId for fast retrieval
- `createdAt` order for latest-first display
- Lazy loading for large query lists (if needed)

## Future Enhancements

Possible improvements:
- Pagination for large query lists
- Email notifications when query status changes
- Search and advanced filtering
- Bulk operations for admin
- Query categories/tags
- Attachment support
- Email reply functionality
