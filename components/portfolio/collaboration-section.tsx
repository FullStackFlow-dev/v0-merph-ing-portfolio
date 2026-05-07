'use client'

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CollaborationSection() {
  return (
    <section className="relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-b from-blue-950 via-slate-900 to-black py-20 md:py-32 mt-16">
      {/* Animated snow/particles container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-0 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-4px`,
              animation: `snow ${3 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: Math.random() > 0.5 ? `0 0 ${2 + Math.random() * 4}px rgba(255, 255, 255, 0.8)` : 'none',
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div className="relative z-10 mx-auto flex flex-col items-center justify-center gap-6 px-4 text-center md:px-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Prêt à collaborer ?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Discutons de votre prochaine projet data, web, ou mobile.
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="#contact"
          className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-white text-slate-900 px-6 py-3 font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
        >
          Commencer
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </Link>
      </div>

      {/* CSS Animations in style tag */}
      <style jsx>{`
        @keyframes snow {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--tx, 0));
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-snow {
          animation-timing-function: linear;
        }

        /* Add subtle horizontal drift to particles */
        div[style*="animation"] {
          --tx: ${Math.random() * 100 - 50}px;
        }
      `}</style>
    </section>
  )
}
