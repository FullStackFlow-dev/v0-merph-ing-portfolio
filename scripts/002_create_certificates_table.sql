-- Table certificates
CREATE TABLE IF NOT EXISTS certificates (
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_certificates_domain ON certificates(domain);
CREATE INDEX IF NOT EXISTS idx_certificates_order ON certificates(display_order ASC, date_obtained DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_date ON certificates(date_obtained DESC);

-- Comments for documentation
COMMENT ON TABLE certificates IS 'Professional certificates and certifications grouped by domain';
COMMENT ON COLUMN certificates.domain IS 'Domain or expertise area (e.g., "Data Scientist IBM", "Deep Learning et TensorFlow")';
COMMENT ON COLUMN certificates.display_order IS 'Display order within domain (ascending)';
COMMENT ON COLUMN certificates.certificate_url IS 'URL to verify or download the certificate';
COMMENT ON COLUMN certificates.image_url IS 'Main certificate image/screenshot URL';
COMMENT ON COLUMN certificates.badge_url IS 'Badge/issuer logo URL';
