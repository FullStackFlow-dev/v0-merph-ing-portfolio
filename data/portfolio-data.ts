import type { LucideIcon } from "lucide-react"
import {
  BrainCircuit,
  BarChart3,
  Database,
  Sparkles,
  Server,
  Layout,
  Smartphone,
} from "lucide-react"

export const profile = {
  name: "Merphy Mademba",
  alias: "Merph-dev",
  role: "Data Scientist & Full Stack Engineer",
  bio: "Spécialiste multi-domaines en Data Science, IA/LLM, Back-end, Front-end et Mobile. Je transforme les données en produits, et les idées en systèmes robustes, mesurables et élégants.",
  phone: "+221 76 558 78 77",
  location: "Dakar, Sénégal",
  email: "merphy97@gmail.com",
  github: "https://github.com/FullStackFlow-dev",
  linkedin: "https://linkedin.com/in/merph-dev",
  githubHandle: "FullStackFlow-dev",
  linkedinHandle: "merph-dev",
}

export type Domain = {
  id: string
  title: string
  icon: LucideIcon
  description: string
  skills: string[]
}

export const domains: Domain[] = [
  {
    id: "data-science",
    title: "Science des données & Ingénieur IA",
    icon: BrainCircuit,
    description:
      "Extraction de connaissances à partir de données complexes et déploiement de modèles prédictifs en production.",
    skills: [
      "Python (Pandas, NumPy, Scikit-learn)",
      "R & Statistiques Bayésiennes",
      "Visualisation (Matplotlib, Seaborn)",
      "MLOps & Model Deployment",
    ],
  },
  {
    id: "data-analyst",
    title: "Analyste de données",
    icon: BarChart3,
    description:
      "Analyse exploratoire, création de rapports et tableaux de bord pour la prise de décision stratégique.",
    skills: [
      "SQL avancé (PostgreSQL, MySQL)",
      "Power BI / Tableau",
      "Excel avancé (VBA, Power Query)",
      "Google Analytics, A/B Testing",
    ],
  },
  {
    id: "data-engineer",
    title: "Ingénieur de données",
    icon: Database,
    description:
      "Conception de pipelines ETL, data warehousing et architectures de données distribuées.",
    skills: [
      "Apache Spark / Kafka",
      "Airflow / Luigi",
      "Snowflake / BigQuery",
      "PySpark, Dask, AWS / GCP / Azure",
    ],
  },
  {
    id: "deep-learning",
    title: "Deep Learning & LLM",
    icon: Sparkles,
    description:
      "Conception de réseaux de neurones profonds et intégration de modèles de langage à grande échelle.",
    skills: [
      "PyTorch / TensorFlow",
      "Computer Vision (YOLO, ResNet)",
      "NLP & Transformers",
      "Fine-tuning LLMs (Llama, GPT, Gemini)",
      "LangChain / RAG",
    ],
  },
  {
    id: "backend",
    title: "Ingénieur Back-end",
    icon: Server,
    description:
      "APIs robustes, microservices et systèmes distribués scalables.",
    skills: [
      "Node.js / Express / Fastify",
      "Python (Django, FastAPI)",
      "REST & GraphQL",
      "PostgreSQL / MongoDB / Redis",
      "Docker / Kubernetes",
    ],
  },
  {
    id: "frontend",
    title: "Ingénieur Front-end",
    icon: Layout,
    description:
      "Interfaces utilisateur modernes, performantes et accessibles avec les dernières technologies web.",
    skills: [
      "React / Next.js / Vue.js",
      "TypeScript / JavaScript ES6+",
      "Tailwind CSS / Styled Components",
      "Zustand / Redux",
      "Optimisation des performances",
    ],
  },
  {
    id: "mobile",
    title: "Développeur Mobile iOS & Android",
    icon: Smartphone,
    description:
      "Applications mobiles natives et multiplateformes pour iOS et Android.",
    skills: [
      "React Native / Expo",
      "Swift / SwiftUI (iOS)",
      "Kotlin / Jetpack Compose (Android)",
      "Flutter / Dart",
      "CI/CD (Fastlane, App Center)",
    ],
  },
]

export const analyticsStats = [
  { label: "Précision Modèle", value: "98%" },
  { label: "Temps Inférence", value: "45ms" },
  { label: "Uptime", value: "99.9%" },
  { label: "Code Coverage", value: "92%" },
]

export const performanceData = [
  { month: "Jan", modèle: 82, système: 95 },
  { month: "Fév", modèle: 85, système: 96 },
  { month: "Mar", modèle: 88, système: 97 },
  { month: "Avr", modèle: 91, système: 97 },
  { month: "Mai", modèle: 93, système: 98 },
  { month: "Jun", modèle: 95, système: 99 },
  { month: "Jul", modèle: 98, système: 99.9 },
]
