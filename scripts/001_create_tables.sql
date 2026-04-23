-- Table contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_read ON contact_messages(read) WHERE read = false;

-- Table projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  tags JSONB DEFAULT '[]' NOT NULL,
  link VARCHAR(500),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(display_order DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
