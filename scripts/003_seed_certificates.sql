-- Sample certificates data for testing and demonstration
-- This file should be run after 002_create_certificates_table.sql

-- Note: These are example data. Update URLs with actual certificate images and links.

-- Ingénieur Logiciel Généraliste
INSERT INTO certificates (title, issuer, domain, date_obtained, certificate_url, display_order)
VALUES 
  ('Backend Development', 'Google Cloud', 'Ingénieur Logiciel Généraliste', '2024-03-15', 'https://example.com/certs/backend', 1),
  ('Frontend Development', 'Meta', 'Ingénieur Logiciel Généraliste', '2024-02-20', 'https://example.com/certs/frontend', 2),
  ('Database Design', 'Coursera', 'Ingénieur Logiciel Généraliste', '2024-01-10', 'https://example.com/certs/database', 3),
  ('Mobile Development', 'Google', 'Ingénieur Logiciel Généraliste', '2023-12-05', 'https://example.com/certs/mobile', 4)
ON CONFLICT DO NOTHING;

-- Développeur Logiciel Full Stack IBM
INSERT INTO certificates (title, issuer, domain, date_obtained, certificate_url, display_order)
VALUES 
  ('Full Stack Developer Specialization', 'IBM', 'Développeur Logiciel Full Stack IBM', '2024-06-01', 'https://example.com/certs/fullstack-ibm', 1)
ON CONFLICT DO NOTHING;

-- DevOps et Ingénierie Logiciel IBM
INSERT INTO certificates (title, issuer, domain, date_obtained, certificate_url, display_order)
VALUES 
  ('IBM DevOps and Software Engineering', 'IBM', 'DevOps et Ingénierie Logiciel IBM', '2024-05-15', 'https://example.com/certs/devops-ibm', 1),
  ('Cloud Infrastructure with IBM Cloud', 'IBM', 'DevOps et Ingénierie Logiciel IBM', '2024-04-20', 'https://example.com/certs/cloud-ibm', 2)
ON CONFLICT DO NOTHING;

-- Data Scientist IBM
INSERT INTO certificates (title, issuer, domain, date_obtained, certificate_url, display_order)
VALUES 
  ('Data Science Professional Certificate', 'IBM', 'Data Scientist IBM', '2024-07-10', 'https://example.com/certs/data-science-ibm', 1),
  ('Machine Learning with Python', 'IBM', 'Data Scientist IBM', '2024-06-25', 'https://example.com/certs/ml-python-ibm', 2)
ON CONFLICT DO NOTHING;

-- Data Analyst Meta
INSERT INTO certificates (title, issuer, domain, date_obtained, certificate_url, display_order)
VALUES 
  ('Data Analytics Professional', 'Meta', 'Data Analyst Meta', '2024-08-01', 'https://example.com/certs/data-analyst-meta', 1)
ON CONFLICT DO NOTHING;

-- Deep Learning et TensorFlow
INSERT INTO certificates (title, issuer, domain, date_obtained, certificate_url, display_order)
VALUES 
  ('Deep Learning Specialization', 'Coursera', 'Deep Learning et TensorFlow', '2024-05-30', 'https://example.com/certs/deep-learning', 1),
  ('TensorFlow Developer Certificate', 'Google', 'Deep Learning et TensorFlow', '2024-04-15', 'https://example.com/certs/tensorflow', 2)
ON CONFLICT DO NOTHING;

-- Apprentissage Automatique avec Python
INSERT INTO certificates (title, issuer, domain, date_obtained, certificate_url, display_order)
VALUES 
  ('Machine Learning with Python', 'Coursera', 'Apprentissage Automatique avec Python', '2024-06-10', 'https://example.com/certs/ml-python', 1),
  ('Advanced Python for Data Science', 'Udacity', 'Apprentissage Automatique avec Python', '2024-05-01', 'https://example.com/certs/python-advanced', 2)
ON CONFLICT DO NOTHING;

-- Application avec Python (Supervisé et Non Supervisé)
INSERT INTO certificates (title, issuer, domain, date_obtained, certificate_url, display_order)
VALUES 
  ('Supervised Learning Applications', 'Coursera', 'Application avec Python', '2024-07-20', 'https://example.com/certs/supervised', 1),
  ('Unsupervised Learning Applications', 'Coursera', 'Application avec Python', '2024-07-25', 'https://example.com/certs/unsupervised', 2)
ON CONFLICT DO NOTHING;
