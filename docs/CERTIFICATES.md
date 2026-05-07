# Certificates Feature Documentation

## Overview

The certificates page (`/certificats`) displays professional certifications and achievements organized by expertise domain. It features a responsive grid layout with domain grouping, certificate cards with images/badges, and verification links.

## File Structure

```
app/certificats/page.tsx          # Main certificates page component
app/api/certificates/route.ts     # API endpoint for certificate data
lib/db.ts                         # Database types and configuration
scripts/002_create_certificates_table.sql  # Database migration
```

## Features

### Page Features
- **Hero Section**: Title "Mes Certifications" with subtitle and decorative elements
- **Domain Grouping**: Certificates organized by 8 expertise domains
- **Responsive Grid**: 1 column on mobile, 2 on tablet, 3 on desktop
- **Certificate Cards**: Display with images/badges, titles, issuer, dates, and verification links
- **Loading State**: Shows spinner while fetching data
- **Error Handling**: Graceful error display if data fetch fails
- **Stats Footer**: Shows total certificates, domains, verifiable items, and badges

### Supported Domains

1. **Ingénieur Logiciel Généraliste**
   - Backend, Frontend, Database, Mobile fundamentals

2. **Développeur Logiciel Full Stack IBM**
   - Complete application development with IBM

3. **DevOps et Ingénierie Logiciel IBM**
   - Infrastructure, deployment, DevOps practices

4. **Data Scientist IBM**
   - Advanced Data Science and machine learning

5. **Data Analyst Meta**
   - Data analysis and insights with Meta

6. **Deep Learning et TensorFlow**
   - Neural networks and deep learning frameworks

7. **Apprentissage Automatique avec Python**
   - ML algorithms and advanced Python

8. **Application avec Python**
   - Supervised and unsupervised learning applications

## Database Schema

```sql
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  date_obtained TIMESTAMP NOT NULL DEFAULT NOW(),
  certificate_url VARCHAR(500),
  image_url VARCHAR(500),
  badge_url VARCHAR(500),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Column Descriptions

- **title**: Certificate name/title
- **issuer**: Organization that issued the certificate
- **domain**: Expertise domain (must match one from DOMAIN_ORDER)
- **date_obtained**: Date the certificate was earned
- **certificate_url**: Link to verify/download the certificate
- **image_url**: Main certificate image/screenshot (displayed as card background)
- **badge_url**: Badge or issuer logo (displayed as fallback)
- **display_order**: Sort order within domain (ascending)

## API Endpoint

### GET /api/certificates

Fetches all certificates from the database.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Full Stack Developer Specialization",
    "issuer": "IBM",
    "domain": "Développeur Logiciel Full Stack IBM",
    "date_obtained": "2024-03-15T00:00:00Z",
    "certificate_url": "https://example.com/cert/123",
    "image_url": "https://example.com/images/cert.jpg",
    "badge_url": "https://example.com/badges/ibm.png",
    "display_order": 1,
    "created_at": "2024-03-15T10:30:00Z",
    "updated_at": "2024-03-15T10:30:00Z"
  },
  ...
]
```

### POST /api/certificates

Creates a new certificate entry.

**Request Body:**
```json
{
  "title": "Machine Learning with Python",
  "issuer": "Coursera",
  "domain": "Apprentissage Automatique avec Python",
  "date_obtained": "2024-02-20",
  "certificate_url": "https://example.com/verify/456",
  "image_url": "https://example.com/images/ml-cert.jpg",
  "badge_url": "https://example.com/badges/coursera.png",
  "display_order": 2
}
```

## Styling

The page uses Tailwind CSS with:
- Dark theme (slate/blue gradient background)
- Hover effects with smooth transitions
- Gradient accents on domain headers
- Card glow effects on interaction
- Responsive typography and spacing

### Color Scheme
- **Background**: Slate gradient (slate-900 to slate-800)
- **Accents**: Blue, Purple, Green, Amber gradients
- **Text**: White for headings, Slate-300 for secondary text

## Component Structure

### CertificateCard Component
Reusable card component for individual certificates featuring:
- Image/badge display with fallback
- Hover animations and scale effects
- Domain indicator dot
- Date formatting in French
- External link to certificate verification

### Page Logic
- Fetches data on component mount
- Groups certificates by domain
- Sorts domains according to DOMAIN_ORDER
- Sorts certificates within each domain by display_order and date
- Shows loading, error, and empty states

## Usage

### Adding a Certificate

1. Insert into database:
```sql
INSERT INTO certificates (title, issuer, domain, date_obtained, certificate_url, image_url, badge_url, display_order)
VALUES ('Certification Name', 'Issuer', 'Domain Name', NOW(), 'url', 'image_url', 'badge_url', 1);
```

2. Or use the POST endpoint:
```bash
curl -X POST http://localhost:3000/api/certificates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Certification Name",
    "issuer": "Issuer",
    "domain": "Domain Name",
    "certificate_url": "https://example.com/cert",
    "image_url": "https://example.com/image.jpg",
    "display_order": 1
  }'
```

### Displaying Images

For best results:
- **image_url**: Use high-quality screenshot or certificate document (1200x800px recommended)
- **badge_url**: Use company logo or badge (200x200px recommended)
- Images are cached by Next.js for performance

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- Image alt text for accessibility
- External links have `rel="noopener noreferrer"` for security
- Proper color contrast for text readability
- Loading states provide user feedback

## Performance

- Client-side data fetching with proper loading states
- Indexed database queries for fast sorting and filtering
- Image optimization through Next.js Image system
- CSS transitions use transform properties for smooth GPU acceleration
- Responsive images with appropriate breakpoints

## Testing

### Manual Testing Checklist
- [ ] All 8 domains display correctly
- [ ] Certificates sort by display_order within each domain
- [ ] Certificate cards display images/badges correctly
- [ ] External links open in new tab
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Error state displays when API fails
- [ ] Empty state shows when no certificates exist
- [ ] Date formatting displays in French locale
- [ ] Stats footer calculates correctly

## Future Enhancements

- Filter by domain
- Search functionality
- Export certificates as PDF
- Certificate verification badge system
- Skill tags for each certificate
- Certificate expiry date tracking
- Achievement timeline view
- Certificate share functionality
