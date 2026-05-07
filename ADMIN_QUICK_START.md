# Admin Panel - Quick Start Guide

## 5-Minute Setup

### 1. Set Environment Variable

Add to `.env.local` (local development):
```bash
ADMIN_PASSWORD=your_secure_password
```

Or in Vercel Settings → Environment Variables (production):
```
ADMIN_PASSWORD=your_secure_password
```

### 2. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

### 3. Access Admin Panel

Open your browser and navigate to:
```
http://localhost:3000/admin
```

### 4. Login

Enter your admin password and click "Access Dashboard"

## What You Can Do

### Projects Management
- **View All**: See all projects in a table
- **Add New**: Click "New Project" → fill form → upload image → create
- **Edit**: Click edit icon → update details → save
- **Delete**: Click trash icon → confirm → done
- **Image Upload**: Drag-and-drop or click to upload from your computer

### Messages Management
- **View Stats**: See total, unread, and read message counts
- **Filter**: Click buttons to filter All/Unread/Read
- **Read Details**: Click any message to view full content
- **Mark Read**: Toggle read status with eye icon
- **Delete**: Remove messages with trash icon
- **Auto-refresh**: Messages update every 30 seconds

### Certificates Management
- **Organize by Domain**: Certificates grouped into 8 expertise categories
- **Add New**: Click "New Certificate" → select domain → fill details → create
- **Edit**: Click edit icon in certificate row → update → save
- **Delete**: Click trash icon → confirm → done
- **Verify Links**: External link icon opens certificate verification URL

## Features Overview

| Feature | Projects | Messages | Certificates |
|---------|----------|----------|--------------|
| Add Items | ✓ | ✗ | ✓ |
| Edit Items | ✓ | ✗ | ✓ |
| Delete Items | ✓ | ✓ | ✓ |
| Image Upload | ✓ | ✗ | ✗ |
| Filters | ✗ | ✓ | ✗ |
| Statistics | ✗ | ✓ | ✗ |
| Search | ✗ | ✗ | ✗ |
| Sorting | ✗ | ✗ | ✗ |

## Common Tasks

### Adding a Project

1. Navigate to "Gestion des Projets" tab
2. Click "New Project" button
3. **Upload Image** (optional):
   - Drag image into upload area OR click "Click to upload image"
   - Image preview appears
4. **Fill Form**:
   - Title (required)
   - Category (required)
   - Description (required)
   - Tags (optional, comma-separated)
   - Link (optional)
   - Order (number for display priority)
5. Click "Create" button
6. Project appears in table

### Managing Messages

1. Navigate to "Gestion des Messages" tab
2. **View Statistics**: See card counts at top
3. **Filter Messages**: 
   - Click "All" to see everything
   - Click "Unread" to see new messages
   - Click "Read" to see reviewed messages
4. **Interact with Message**:
   - Click message to view full details
   - Click eye icon to toggle read status
   - Click trash icon to delete
5. **Detail View**:
   - Opens modal with full message
   - Shows sender name and email
   - Displays timestamp
   - Provides action buttons

### Adding a Certificate

1. Navigate to "Gestion des Certificats" tab
2. Click "New Certificate" button
3. **Fill Required Fields**:
   - Title (e.g., "Professional Developer Certification")
   - Issuer (e.g., "IBM", "Coursera")
   - Domain (select from dropdown - 8 options)
   - Date Obtained (date picker)
4. **Fill Optional Fields**:
   - Certificate URL (link to verify)
   - Image URL (certificate image)
   - Badge URL (issuer badge)
   - Display Order (priority number)
5. Click "Create" button
6. Certificate appears under its domain section

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Focus Password | `Tab` (at login) |
| Submit Login | `Enter` (with password field focused) |
| Close Modal | `Escape` (not implemented, use X button) |
| Focus Next Tab | `Tab` (tab navigation) |

## Tips & Tricks

### Organizing Projects
- Use display order numbers to control visibility
- Lower numbers appear first
- Spaces: 0, 10, 20 for easy reordering

### Tagging Projects
- Use consistent, lowercase tags
- Separate with commas and spaces
- Examples: "react", "typescript", "ai"
- Maximum 5-7 tags recommended

### Message Management
- Unread messages have blue border and dot indicator
- Messages auto-refresh - don't need to refresh manually
- Delete permanently removes message
- No undo available - confirm before deleting

### Certificate Display
- Certificates organized by 8 domains
- Each domain shows certificate count
- Higher display_order = later in list
- Date format: YYYY-MM-DD

## Troubleshooting

### Can't Login
- Check password matches `ADMIN_PASSWORD` env variable
- Password is case-sensitive
- Clear browser cache and cookies
- Try private/incognito window

### Images Not Uploading
- Check file size (keep under 5MB)
- Ensure file is valid image (JPG, PNG, WebP)
- Check browser console for errors
- Verify database can store image data

### Messages Not Loading
- Check database connection
- Verify `/api/messages` endpoint exists
- Check browser console for errors
- Auto-refresh happens every 30 seconds

### Session Lost
- Session persists across page refresh
- Logout button clears session
- Closing browser tab may clear sessionStorage
- Use localStorage for permanent persistence

## API Reference

### Authentication
```bash
POST /api/admin/auth
Content-Type: application/json

{ "password": "your_password" }

Response: { "success": true, "token": "..." }
```

### Projects
```bash
# List all
GET /api/projects

# Create
POST /api/projects
{ "title": "...", "category": "...", ... }

# Update
PUT /api/projects/[id]
{ updated fields }

# Delete
DELETE /api/projects/[id]
```

### Messages
```bash
# List all
GET /api/messages

# Mark as read/unread
PATCH /api/messages/[id]
{ "is_read": true/false }

# Delete
DELETE /api/messages/[id]
```

### Certificates
```bash
# List all
GET /api/certificates

# Create
POST /api/certificates
{ "title": "...", "issuer": "...", ... }

# Update
PUT /api/certificates/[id]
{ updated fields }

# Delete
DELETE /api/certificates/[id]
```

## Support

### Need Help?

1. Check `ADMIN_PANEL_SETUP.md` for detailed documentation
2. Check `CLAUDE.md` for project architecture
3. Review component files in `components/admin/`
4. Check browser console for error messages
5. Verify all API endpoints are working

### Reporting Issues

When reporting issues, include:
- What you were trying to do
- Error message (if any)
- Browser type and version
- Environment (local/production)
- Steps to reproduce

---

**Last Updated**: May 2026

For detailed information, see `ADMIN_PANEL_SETUP.md`
