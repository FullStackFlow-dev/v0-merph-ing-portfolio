-- Insert les 11 projets initiaux
INSERT INTO projects (title, category, description, tags, link, display_order) VALUES
('EcoPredict AI', 'Data Science', 'Prédiction de consommation énergétique avec LSTM et Prophet pour optimiser les ressources.', '["Python", "LSTM", "Prophet", "TensorFlow"]', 'https://github.com/FullStackFlow-dev', 110),
('Analyse des Flux de Vente', 'Analyste de Données', 'Analyse exploratoire des prix d''appartements et immeubles avec tableau de bord prédictif.', '["SQL", "Power BI", "Pandas", "Tableau"]', 'https://github.com/FullStackFlow-dev', 100),
('KPI Dashboard RFM', 'Analyste de Données', 'Tableau de bord des indicateurs clés de performance avec segmentation RFM.', '["SQL", "Power BI", "Excel", "DAX"]', 'https://github.com/FullStackFlow-dev', 95),
('DataPipeline Pro', 'Ingénieur de Données', 'Pipeline ETL Airflow orchestrant l''ingestion vers BigQuery avec monitoring complet.', '["Airflow", "BigQuery", "Python", "GCP"]', 'https://github.com/FullStackFlow-dev', 90),
('SentimentFlow LLM', 'Deep Learning & LLM', 'Interface RAG avec Llama 3 pour l''analyse de sentiment multilingue.', '["Llama 3", "LangChain", "RAG", "Python"]', 'https://github.com/FullStackFlow-dev', 80),
('VisionGuard AI', 'Deep Learning & LLM', 'Détection d''objets en temps réel avec YOLOv8 pour systèmes de surveillance.', '["YOLOv8", "PyTorch", "OpenCV", "CUDA"]', 'https://github.com/FullStackFlow-dev', 75),
('API Gateway Nexus', 'Ingénieur Back-end', 'Passerelle API haute performance avec authentification JWT et rate limiting.', '["Node.js", "Express", "JWT", "Redis"]', 'https://github.com/FullStackFlow-dev', 70),
('Plateforme E-Commerce', 'Ingénieur Back-end', 'Backend e-commerce complet avec intégration Stripe et gestion des commandes.', '["Node.js", "PostgreSQL", "Stripe", "Docker"]', 'https://github.com/FullStackFlow-dev', 65),
('FinDash Pro', 'Ingénieur Front-end', 'Tableau de bord financier en temps réel avec WebSocket et visualisations avancées.', '["React", "WebSocket", "Recharts", "TypeScript"]', 'https://github.com/FullStackFlow-dev', 60),
('HealthTrack Mobile', 'Développeur Mobile', 'Application santé multiplateforme avec intégration HealthKit et Google Fit.', '["React Native", "HealthKit", "Google Fit", "Expo"]', 'https://github.com/FullStackFlow-dev', 50),
('BankApp Sénégal', 'Développeur Mobile', 'Application bancaire native avec authentification biométrique et transactions sécurisées.', '["Swift", "Kotlin", "Biometric", "Firebase"]', 'https://github.com/FullStackFlow-dev', 45),
('Tableau de bord Nexus', 'Full Stack', 'Plateforme de surveillance des flottes IoT avec analytiques temps réel.', '["Next.js", "IoT", "PostgreSQL", "MQTT"]', 'https://github.com/FullStackFlow-dev', 40)
ON CONFLICT DO NOTHING;
