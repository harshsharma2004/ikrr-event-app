# Admin Gallery Management System - Setup & Usage Guide

## Overview
This guide explains how to use the new admin gallery system that allows the admin (harsh.141615.gmail.com) to upload and manage photos on the three gallery event pages (Event 1, Event 2, Event 3).

## Setup Instructions

### 1. Environment Configuration
Add the following to your `.env.local` file (in the root of your project):

```env
NEXT_PUBLIC_ADMIN_EMAIL=harsh.141615.gmail.com
DATABASE_URL=your_postgresql_database_url
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

**Note:** The `NEXT_PUBLIC_ADMIN_EMAIL` is exposed in the client code because it's only used for UI display. The actual authorization happens in the API routes via session validation.

### 2. Database Migration
Run the following command to apply the database migration:

```bash
npx prisma migrate dev --name "add_gallery_images"
```

Or if using the migration file I created:

```bash
npx prisma db push
```

This will create the `GalleryImage` table in your PostgreSQL database.

### 3. Restart Your Development Server
Make sure to restart your Next.js development server after environment changes:

```bash
npm run dev
```

## How to Use

### For Admins (harsh.141615.gmail.com)

#### Adding Photos
1. Navigate to one of the gallery pages:
   - `/gallery/event-1` - Grand Wedding Celebration
   - `/gallery/event-2` - Tech Horizon Corporate Launch
   - `/gallery/event-3` - Exclusive Private Soirée

2. Log in with your Google account (harsh.141615.gmail.com)

3. You'll see an "Add Photo" button in the top right corner of the page

4. Click "Add Photo" to open the upload modal

5. Enter the image URL and optional caption:
   - **Image URL:** Paste the full URL of your image (e.g., `https://example.com/image.jpg`)
   - **Caption:** Optional description of the photo

6. Click "Add Photo" to save the image to the gallery

#### Image URL Sources
You can get image URLs from:
- **Firebase Storage** - Upload images and get shareable URLs
- **Cloudinary** - Image hosting with built-in URL generation
- **AWS S3** - Cloud storage with URL access
- **Imgur** - Quick image sharing
- **Any public image URL** - Direct links from your own server

#### Deleting Photos
1. Hover over any photo in the gallery
2. A red delete button (trash icon) will appear in the top right corner
3. Click the delete button
4. Confirm the deletion in the popup
5. The image will be removed from the gallery

### For Regular Visitors

- Regular visitors see the gallery with all admin-uploaded photos
- If no photos are uploaded, placeholder images are displayed
- Visitors cannot add, delete, or modify photos

## Features

### Photo Management
- **Add photos:** Upload images by providing direct URLs
- **Add captions:** Include descriptions for each photo
- **Delete photos:** Remove unwanted images
- **Automatic ordering:** Photos are automatically ordered by upload time
- **Persistent storage:** All photos are saved in the PostgreSQL database

### Admin Features
- **Admin-only access:** Only the configured admin email can add/delete photos
- **Real-time updates:** Photos appear immediately after uploading
- **Visual feedback:** Admin mode indicator shows when you're logged in as admin
- **Error handling:** Clear error messages for upload/delete failures

### Gallery Features
- **Three separate galleries:** Each event has its own gallery
- **Placeholder fallback:** Shows placeholder images when no photos are uploaded
- **Responsive design:** Works on desktop, tablet, and mobile
- **Image cards:** Clean card layout with captions and info

## Database Schema

### GalleryImage Table
```prisma
model GalleryImage {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  imageUrl  String   // URL of the image
  caption   String?  // Optional photo description
  eventId   String   // "event-1", "event-2", or "event-3"
  order     Int      @default(0) // Display order
}
```

## API Endpoints

### Upload Image
**POST** `/api/gallery/upload`
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "caption": "Photo description",
  "eventId": "event-1"
}
```

### Delete Image
**DELETE** `/api/gallery/delete`
```json
{
  "imageId": "image_id_here"
}
```

### Fetch Images
**GET** `/api/gallery/[eventId]`

Returns all images for the specified event.

## Troubleshooting

### Images not appearing after upload
- Check browser console for errors (F12 → Console tab)
- Verify the image URL is publicly accessible
- Ensure you're logged in with the admin email

### "Unauthorized" error
- You must be logged in with the admin email: harsh.141615.gmail.com
- Clear browser cookies and log back in
- Verify your Google account email matches the admin email

### Database errors
- Ensure PostgreSQL database is running
- Check DATABASE_URL in .env.local
- Run `npx prisma db push` to sync schema

### Images not loading
- Check that the image URL is publicly accessible
- Test the URL in a new browser tab to confirm
- Some URLs may require authentication headers

## Component Reference

### ImageUpload Component
Located in: `src/app/components/ImageUpload.tsx`

Props:
- `eventId: string` - The event ID ("event-1", "event-2", or "event-3")
- `onImageAdded: () => void` - Callback when image is successfully added
- `isAdmin: boolean` - Whether the current user is an admin

### GalleryImageCard Component
Located in: `src/app/components/GalleryImageCard.tsx`

Props:
- `id: string` - Image ID
- `src: string` - Image URL
- `alt: string` - Alt text
- `caption?: string` - Image caption
- `isAdmin: boolean` - Whether to show delete button
- `onDelete?: (id: string) => Promise<void>` - Delete handler

## Security Notes

- Admin email is checked on the server side using session validation
- Image URLs are validated to be public accessible
- Unauthorized requests return 401 status
- All changes are logged in database with timestamps

## Next Steps

1. Configure Google OAuth in Next.js/NextAuth
2. Set up PostgreSQL database
3. Add environment variables
4. Run database migration
5. Start uploading photos!

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check server logs with `npm run dev`
4. Verify environment variables are set correctly
