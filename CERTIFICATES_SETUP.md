# Certificates Feature - Setup Guide

## Overview

This guide explains how to set up and use the certificates feature for the portfolio. The feature includes:

1. A public-facing certificates page at `/certificats`
2. An admin manager component for CRUD operations
3. Database tables and API endpoints
4. Professional UI with domain grouping and certificate cards

## Prerequisites

- Node.js 18+
- PostgreSQL database (Neon or similar)
- Git for version control

## Installation Steps

### 1. Database Setup

Run the migration scripts in order:

```bash
# Create the certificates table
psql -U your_user -d your_database -f scripts/002_create_certificates_table.sql

# (Optional) Seed sample data
psql -U your_user -d your_database -f scripts/003_seed_certificates.sql
```

Or if using Neon's web console, copy-paste the SQL from each script.

### 2. Verify Database Connection

Make sure your `DATABASE_URL` environment variable is set:

```bash
# .env.local (local development)
DATABASE_URL="postgresql://user:password@host/database"

# Vercel project settings (production)
# Add DATABASE_URL in Environment Variables
```

### 3. Install Dependencies

All dependencies are already in `package.json`. If needed:

```bash
npm install
```

### 4. Test the API Endpoint

Start the development server:

```bash
npm run dev
```

Test the API:

```bash
# Fetch all certificates
curl http://localhost:3000/api/certificates

# Create a new certificate
curl -X POST http://localhost:3000/api/certificates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Certificate",
    "issuer": "Test Issuer",
    "domain": "Ingénieur Logiciel Généraliste",
    "date_obtained": "2024-01-15",
    "certificate_url": "https://example.com/cert",
    "display_order": 1
  }'
```

### 5. Access the Public Page

Navigate to:
```
http://localhost:3000/certificats
```

The page should display certificates grouped by domain with:
- Hero section with title
- Domain sections with descriptions
- Certificate cards with images/badges
- External verification links
- Statistics footer

## File Structure

```
app/
├── certificats/
│   └── page.tsx                    # Public certificates page
├── api/
│   └── certificates/
│       ├── route.ts                # GET and POST endpoints
│       └── [id]/
│           └── route.ts            # PUT and DELETE endpoints

components/
└── admin/
    └── certificates-manager.tsx    # Admin manager component

lib/
└── db.ts                           # Database types and config

scripts/
├── 002_create_certificates_table.sql  # Database migration
└── 003_seed_certificates.sql          # Sample data

docs/
└── CERTIFICATES.md                 # Feature documentation
```

## Usage

### Adding to Admin Dashboard

If you have an admin panel, import and use the manager:

```tsx
import { CertificatesManager } from '@/components/admin/certificates-manager'

export default async function AdminPage() {
  // Fetch initial certificates
  const response = await fetch('your-domain/api/certificates')
  const certificates = await response.json()

  return (
    <div>
      <CertificatesManager initialCertificates={certificates} />
    </div>
  )
}
```

### API Endpoints

#### GET /api/certificates
Fetch all certificates

**Response:**
```json
[
  {
    "id": 1,
    "title": "Certificate Title",
    "issuer": "IBM",
    "domain": "Ingénieur Logiciel Généraliste",
    "date_obtained": "2024-03-15T00:00:00Z",
    "certificate_url": "https://example.com/verify",
    "image_url": "https://example.com/image.jpg",
    "badge_url": "https://example.com/badge.png",
    "display_order": 1,
    "created_at": "2024-03-15T10:00:00Z",
    "updated_at": "2024-03-15T10:00:00Z"
  }
]
```

#### POST /api/certificates
Create a new certificate

**Request Body:**
```json
{
  "title": "Certificate Title",
  "issuer": "Issuer Name",
  "domain": "Ingénieur Logiciel Généraliste",
  "date_obtained": "2024-03-15",
  "certificate_url": "https://example.com/verify",
  "image_url": "https://example.com/image.jpg",
  "badge_url": "https://example.com/badge.png",
  "display_order": 1
}
```

#### PUT /api/certificates/[id]
Update a certificate

**Same request body as POST**

#### DELETE /api/certificates/[id]
Delete a certificate

**Response:**
```json
{
  "success": true
}
```

## Supported Domains

The feature supports 8 expertise domains:

1. **Ingénieur Logiciel Généraliste** - Backend, Frontend, Database, Mobile fundamentals
2. **Développeur Logiciel Full Stack IBM** - Complete application development
3. **DevOps et Ingénierie Logiciel IBM** - Infrastructure and deployment
4. **Data Scientist IBM** - Advanced data science and ML
5. **Data Analyst Meta** - Data analysis with Meta
6. **Deep Learning et TensorFlow** - Neural networks and deep learning
7. **Apprentissage Automatique avec Python** - ML algorithms with Python
8. **Application avec Python** - Supervised and unsupervised learning

To add more domains, update the `DOMAIN_ORDER` array in `/app/certificats/page.tsx` and `/components/admin/certificates-manager.tsx`.

## Customization

### Styling

The page uses Tailwind CSS. To customize colors:

1. Edit color values in `/app/certificats/page.tsx`
2. The main colors are defined in the gradient backgrounds and text classes
3. Update the `DOMAIN_DESCRIPTIONS` for custom domain descriptions

### Domain Descriptions

Edit the `DOMAIN_DESCRIPTIONS` object in `/app/certificats/page.tsx`:

```tsx
const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  'Your Domain': 'Your description here',
  // ...
}
```

### Card Design

The certificate cards are customizable in the `CertificateCard` component:
- Image/badge display
- Hover effects
- Text styling
- Link appearance

## Performance Tips

1. **Image Optimization**: Use optimized images (WebP, compressed JPEG)
2. **Database Indexing**: Indexes are created on domain and display_order
3. **Caching**: Consider adding caching headers for static content
4. **Pagination**: For 100+ certificates, implement pagination

## Troubleshooting

### Certificates not loading
1. Check database connection: `echo $DATABASE_URL`
2. Verify migrations were run: `SELECT * FROM certificates;`
3. Check browser console for API errors
4. Check server logs for database errors

### Images not displaying
1. Verify image URLs are accessible
2. Check CORS settings if images are on different domain
3. Ensure URLs are properly encoded

### Admin manager not working
1. Verify form validation passes
2. Check API response for error messages
3. Verify PUT/DELETE endpoints respond correctly

### Database connection error
1. Test connection: `psql $DATABASE_URL -c "SELECT 1;"`
2. Verify DATABASE_URL format
3. Check database credentials
4. Ensure database allows remote connections

## Security Notes

- All links open with `rel="noopener noreferrer"` for security
- SQL uses parameterized queries to prevent injection
- Validate URLs server-side before storing
- Consider adding authentication to admin endpoints
- Sanitize certificate titles and descriptions

## Deployment

### Vercel
1. Set `DATABASE_URL` environment variable in project settings
2. Push to git branch connected to Vercel
3. Vercel will build and deploy automatically
4. Run migrations manually if needed

### Other Platforms
1. Deploy code to your hosting
2. Set `DATABASE_URL` environment variable
3. Run migrations on the remote database
4. Test API endpoints after deployment

## Testing

### Manual Testing Checklist
- [ ] Page loads without errors
- [ ] All 8 domains display correctly
- [ ] Certificates sort properly within domains
- [ ] Images load correctly (or show fallback badge)
- [ ] External links open in new tab
- [ ] Mobile responsive layout works
- [ ] Admin manager creates certificates
- [ ] Admin manager edits certificates
- [ ] Admin manager deletes certificates
- [ ] Date formatting is correct (French locale)

### Automated Testing (Optional)
Consider adding tests for:
- API endpoints
- Database queries
- Component rendering
- Form validation

## Future Enhancements

Ideas for future development:
- Search and filter functionality
- Category-based filtering
- Certificate verification system
- Export to PDF
- Certificate timeline view
- Achievement badges
- Skill tags per certificate
- Certificate expiry tracking
- Social sharing
- Analytics tracking

## Support

For issues or questions:
1. Check the documentation in `/docs/CERTIFICATES.md`
2. Review the code comments
3. Check git history for changes
4. Test with sample data

## Related Files

- Public page: `/app/certificats/page.tsx`
- API routes: `/app/api/certificates/`
- Admin component: `/components/admin/certificates-manager.tsx`
- Database types: `/lib/db.ts`
- Documentation: `/docs/CERTIFICATES.md`
- Sample data: `/scripts/003_seed_certificates.sql`
