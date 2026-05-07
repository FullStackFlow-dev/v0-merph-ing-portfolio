# Admin Panel Setup Guide

This guide covers the admin dashboard implementation for managing projects, messages, and certificates.

## Overview

The admin panel provides a secure, password-protected interface for managing portfolio content with three main sections:

1. **Gestion des Projets** - Project Management
2. **Gestion des Messages** - Message Management  
3. **Gestion des Certificats** - Certificate Management

## Architecture

### Files Created/Updated

```
app/
├── api/
│   └── admin/
│       └── auth/
│           └── route.ts                    # Authentication endpoint
└── admin/
    └── page.tsx                            # Main admin page

components/
├── admin/
│   ├── admin-auth.tsx                      # Authentication form component
│   ├── projects-manager.tsx                # Projects CRUD interface
│   ├── messages-manager.tsx                # Messages dashboard
│   └── certificates-manager.tsx            # Certificates CRUD interface
```

## Authentication

### Password Protection

The admin panel uses a simple password-based authentication system:

1. **Environment Variable**: Set `ADMIN_PASSWORD` in your `.env.local` or Vercel environment variables
   ```bash
   ADMIN_PASSWORD=your_secure_password
   ```

2. **Default Password**: If not set, defaults to `admin123` (not recommended for production)

3. **API Endpoint**: `/api/admin/auth`
   - Method: `POST`
   - Body: `{ password: string }`
   - Response: `{ success: true, token: string }`

### Session Storage

- Authentication tokens are stored in **both** `sessionStorage` and `localStorage`
- This allows sessions to persist across browser restarts
- Sessions remain active as long as tokens are not manually cleared

**To logout**: Click the "Logout" button which clears both storage locations

## Components

### 1. Admin Auth Component
**File**: `/components/admin/admin-auth.tsx`

Features:
- Secure password input with masking
- Loading states during authentication
- Error handling with user feedback
- Gradient-styled authentication form
- Auto-focus on password field

### 2. Admin Page
**File**: `/app/admin/page.tsx`

Features:
- Sticky header with dashboard branding and logout button
- Tab navigation with emoji indicators
- Responsive layout (mobile-friendly tab icons)
- Automatic data fetching on load
- Beautiful gradient background

### 3. Projects Manager
**File**: `/components/admin/projects-manager.tsx`

Features:
- **Table View**: Display all projects with key information
- **Create/Edit Modal**: Add or update project details
- **Image Upload**: 
  - Drag-and-drop or click to upload
  - Base64 encoding for local storage or API upload
  - Preview of selected image
  - Support for common image formats (JPG, PNG, WebP, etc.)
- **Tags Management**: Comma-separated tags with preview
- **Link Management**: Optional external project links
- **Display Order**: Control project display sequence
- **Actions**: View external link, edit, and delete buttons

### 4. Messages Manager
**File**: `/components/admin/messages-manager.tsx`

Features:
- **Statistics Cards**: 
  - Total message count
  - Unread count (blue)
  - Read count (green)
- **Filter Buttons**: View All, Unread, or Read messages
- **Message List**:
  - Sender name and email
  - Message preview with line clamping
  - Timestamp formatting
  - Visual indicator for unread messages
  - Unread badge (blue dot)
- **Actions**:
  - Mark as read/unread toggle
  - Delete message
  - Click to view full message
- **Detail Modal**:
  - Full message display
  - Formatted timestamp
  - Read/unread status badge
  - Actions to change status or delete
- **Auto-refresh**: Messages refresh every 30 seconds
- **Responsive Design**: Mobile-optimized layout

### 5. Certificates Manager
**File**: `/components/admin/certificates-manager.tsx`

Features:
- **Domain-based Organization**: Certificates grouped by expertise domain
- **Domain Sections**:
  - Collapsible domain cards
  - Certificate count per domain
  - Clear visual hierarchy
- **CRUD Operations**:
  - Create new certificates
  - Edit existing certificates
  - Delete certificates
- **Form Fields**:
  - Title (required)
  - Issuer (required)
  - Domain (dropdown select)
  - Date obtained (date picker)
  - Certificate URL (optional)
  - Image URL (optional)
  - Badge URL (optional)
  - Display order (number)
- **Certificate Links**: External link button to verification
- **Supported Domains** (8 expertise areas):
  1. Ingénieur Logiciel Généraliste
  2. Développeur Logiciel Full Stack IBM
  3. DevOps et Ingénierie Logiciel IBM
  4. Data Scientist IBM
  5. Data Analyst Meta
  6. Deep Learning et TensorFlow
  7. Apprentissage Automatique avec Python
  8. Application avec Python

## Styling

### Design System

- **Color Scheme**: Dark theme with blue and cyan accents
  - Primary: Blue (#3B82F6)
  - Secondary: Cyan (#06B6D4)
  - Background: Slate-900 (#0F172A)
  - Card: Slate-800 (#1E293B)

- **Components**:
  - Gradient backgrounds for headers
  - Backdrop blur on modals
  - Rounded corners (6-8px)
  - Smooth transitions (200ms)
  - Hover states for interactivity

- **Icons**: Lucide React icons throughout
- **Responsive**: Mobile-first design with breakpoints at sm, md, lg

### CSS Classes

All components use Tailwind CSS utility classes with a consistent design language:
- Hover effects on interactive elements
- Disabled states for loading
- Error states with red backgrounds
- Success states with green/blue highlights

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin`
2. Enter your admin password
3. Choose a tab: Projects, Messages, or Certificates

### Adding a Project

1. Click "New Project" button
2. Upload an image (optional, drag-and-drop or click)
3. Fill in project details:
   - Title (required)
   - Category (required)
   - Description (required)
   - Tags (comma-separated)
   - Link (optional URL)
   - Display order (number)
4. Click "Create"

### Managing Messages

1. View statistics at the top
2. Filter messages: All, Unread, Read
3. Click a message to view full details
4. Actions:
   - Mark as read/unread
   - Delete
   - Close detail modal

### Managing Certificates

1. Certificates are organized by expertise domain
2. Click "New Certificate" to add
3. Select domain from dropdown
4. Fill in certificate details
5. Add URLs for verification and images (optional)
6. Click "Create" or "Save"

## API Integration

### Required API Endpoints

Ensure these endpoints exist and are functioning:

- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

- `GET /api/messages` - Fetch all messages
- `PATCH /api/messages/[id]` - Update message read status
- `DELETE /api/messages/[id]` - Delete message

- `GET /api/certificates` - Fetch all certificates
- `POST /api/certificates` - Create certificate
- `PUT /api/certificates/[id]` - Update certificate
- `DELETE /api/certificates/[id]` - Delete certificate

- `POST /api/admin/auth` - Authenticate with password

## Environment Configuration

### Required Environment Variables

```bash
# .env.local (development)
ADMIN_PASSWORD=your_secure_password
DATABASE_URL=your_database_url

# Vercel Project Settings (production)
# Add the same variables in Environment Variables section
```

### Setting Up in Vercel

1. Go to Project Settings → Environment Variables
2. Add `ADMIN_PASSWORD` with your secure password
3. Add `DATABASE_URL` if not already set
4. Redeploy the project

## Security Considerations

1. **Password**: Use a strong, unique password
2. **HTTPS Only**: Always use HTTPS in production
3. **Session Storage**: Tokens are stored client-side; use password-protected computers
4. **Database Queries**: All API routes should have proper authentication checks
5. **Input Validation**: All form inputs are validated before submission

## Error Handling

- **Network Errors**: Displayed as user-friendly messages
- **Validation Errors**: Form-level and server-level validation
- **Authentication Errors**: Clear messages for wrong password
- **API Errors**: Captured and displayed in modals

## Performance Optimization

- **Lazy Loading**: Images use preview/lazy loading
- **Auto-refresh**: Messages auto-refresh every 30 seconds
- **Modal Performance**: Modals use fixed positioning and backdrop blur
- **Table Optimization**: Tables show only essential info, expandable on demand

## Troubleshooting

### Admin Page Not Loading

- Check if `ADMIN_PASSWORD` is set in environment
- Verify database connection with `DATABASE_URL`
- Check browser console for errors

### Images Not Uploading

- Ensure image file is valid (JPG, PNG, WebP, etc.)
- Check file size (keep under 5MB for performance)
- Verify API endpoint accepts image data

### Messages Not Appearing

- Check if contact form endpoint is working
- Verify messages are being saved to database
- Check browser console for API errors

### Authentication Issues

- Verify password matches `ADMIN_PASSWORD` env variable
- Clear browser cache and cookies
- Try using incognito/private browsing
- Check server logs for auth errors

## Future Enhancements

Potential improvements for future versions:

- Role-based access control (multiple admin levels)
- Audit logging (track admin actions)
- Batch operations (select multiple items)
- Search and filtering across all managers
- Drag-and-drop reordering
- Image optimization and compression
- Email notifications for new messages
- Two-factor authentication
- Admin user management
- Activity logs and statistics

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check server logs for API errors
4. Verify all environment variables are set correctly
5. Test API endpoints directly with curl or Postman

## Related Documentation

- Project Structure: See `CLAUDE.md`
- Database Schema: See `lib/db.ts`
- API Routes: See `app/api/`
- Components: See `components/admin/`

---

**Last Updated**: May 2026

For the latest information, check the GitHub repository and CLAUDE.md documentation.
