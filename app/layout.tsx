import type { Metadata, Viewport } from "next"
import { Instrument_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-instrument",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Merph-dev — Data Scientist, IA & Full Stack Engineer | Dakar",
  description:
    "Portfolio de Merphy Mademba (Merph-dev), Data Scientist, LLM Engineer et développeur Full Stack basé à Dakar, Sénégal. Expertise en IA, Deep Learning, Back-end, Front-end et Mobile.",
  keywords: [
    "Data Scientist Dakar",
    "Full Stack Sénégal",
    "LLM Engineer",
    "Merphy Mademba",
    "Merph-dev",
    "IA Sénégal",
    "Data Engineer",
    "Deep Learning Dakar",
    "Développeur Mobile Dakar",
  ],
  authors: [{ name: "Merphy Mademba", url: "https://github.com/FullStackFlow-dev" }],
  creator: "Merphy Mademba",
  openGraph: {
    type: "website",
    locale: "fr_SN",
    title: "Merph-dev — Data Scientist, IA & Full Stack Engineer",
    description:
      "Spécialiste multi-domaines: Data Science, IA/LLM, Back-end, Front-end et Mobile. Basé à Dakar, Sénégal.",
    siteName: "Merph-dev Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merph-dev — Data Scientist & Full Stack Engineer",
    description: "Portfolio professionnel multi-domaines. Dakar, Sénégal.",
    creator: "@merphdev",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Merphy Mademba",
  alternateName: "Merph-dev",
  url: "https://merph-dev.vercel.app",
  email: "merphy97@gmail.com",
  telephone: "+221765587877",
  jobTitle: "Data Scientist & Full Stack Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dakar",
    addressCountry: "SN",
  },
  sameAs: ["https://github.com/FullStackFlow-dev", "https://linkedin.com/in/merph-dev"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${instrumentSans.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
