# Merph-dev Portfolio

Portfolio professionnel de **Merphy Mademba** (Merph-dev) -- Data Scientist, Ingénieur IA/LLM et Développeur Full Stack basé à Dakar, Sénégal.

## A propos

Spécialiste multi-domaines en Data Science, IA/LLM, Back-end, Front-end et Mobile. Je transforme les données en produits, et les idées en systèmes robustes, mesurables et élégants.

### Domaines d'expertise

- **Science des donnees & IA** -- Python, R, Scikit-learn, MLOps
- **Analyse de donnees** -- SQL, Power BI, Tableau, Excel avance
- **Ingenier de base de données donnees** -- Spark, Kafka, Airflow, BigQuery
- **Deep Learning & LLM** -- PyTorch, TensorFlow, LangChain, RAG
- **Back-end** -- Node.js, Django, FastAPI, PostgreSQL, Docker
- **Front-end** -- React, Next.js, Vue.js, TypeScript, Tailwind CSS
- **Mobile** -- React Native, Swift, Kotlin, Flutter

## Stack technique

| Categorie | Technologies |
|-----------|-------------|
| Framework | Next.js 16 (App Router, RSC) |
| Langage | TypeScript |
| Style | Tailwind CSS 4, tw-animate-css |
| Composants | shadcn/ui (New York) |
| Base de donnees | Neon PostgreSQL (serverless) |
| Email | Resend |
| Analytics | Vercel Analytics |
| Deploiement | Vercel |

## Structure du projet

```
app/
  page.tsx              # Page principale du portfolio
  layout.tsx            # Layout racine (SEO, fonts, JSON-LD)
  globals.css           # Variables CSS, animations, glow effects
  admin/                # Tableau de bord admin (messages, projets)
  api/                  # Routes API (contact, projects, CRUD)
components/
  portfolio/            # Composants du portfolio (sidebar, hero, tabs, etc.)
  admin/                # Composants d'administration
  ui/                   # Composants shadcn/ui
data/
  portfolio-data.ts     # Profils, domaines, stats, categories
hooks/                  # Hooks personnalises
lib/
  db.ts                 # Connexion Neon PostgreSQL
  send-email.ts         # Service d'envoi d'emails (Resend)
  utils.ts              # Utilitaires (cn)
scripts/
  001_create_tables.sql # Schema de la base de donnees
  002_seed_projects.sql # Donnees initiales
```

## Demarrage local

```bash
# Installer les dependances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir DATABASE_URL et RESEND_API_KEY

# Lancer le serveur de developpement
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Variables d'environnement

| Variable | Description | Requise |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion Neon PostgreSQL | Oui |
| `RESEND_API_KEY` | Cle API Resend pour les notifications email | Non |

## Deploiement

Le projet est deploye sur [Vercel](https://vercel.com). Chaque push sur `main` declenche un deploiement automatique.

### Configuration sur Vercel

1. **Connecter le depot GitHub a Vercel**
   - Importez le repository dans Vercel via https://vercel.com/new

2. **Configurer les variables d'environnement**
   - Allez dans **Settings → Environment Variables**
   - Ajoutez les variables :
     - `DATABASE_URL` -- URL de connexion Neon PostgreSQL (ex: `postgresql://user:pass@host/db`)
     - `RESEND_API_KEY` -- Cle API Resend pour notifications email (optionnel)

3. **Deployer**
   - Le deploiement se declenche automatiquement sur chaque push a `main`
   - Les variables d'environnement seront disponibles a l'execution

**Note**: Ne modifiez pas `vercel.json` pour ajouter des variables. Utilisez le dashboard Vercel pour configurer les environment variables sous Settings → Environment Variables.

## Auteur

**Merphy Mademba** ([@FullStackFlow-dev](https://github.com/FullStackFlow-dev))

- LinkedIn : [merph-dev](https://linkedin.com/in/merph-dev)
- Email : merphy97@gmail.com
- Site : [merph-dev-portfolio.vercel.app](https://merph-dev-portfolio.vercel.app/)

## Licence

<a href="https://v0.app/chat/api/kiro/clone/FullStackFlow-dev/v0-merph-ing-portfolio" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>


## Admin security env vars
- `ADMIN_PASSWORD_HASH`: SHA-256 hash du mot de passe admin.
- `ADMIN_SESSION_SECRET`: secret long aléatoire pour signer la session.
Exemple hash: `echo -n "Dev!2026" | sha256sum`
Tous droits reserves. Concu et developpe a Dakar, Senegal.
