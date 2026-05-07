"use client"

import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, Phone, Twitter, Instagram, MessageCircle } from "lucide-react"
import { profile } from "@/data/portfolio-data"

// Facebook icon component
function FacebookIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth || 1.5} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export function Sidebar() {
  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <div className="rounded-lg bg-sidebar p-6 shadow-xl lg:p-8">
        {/* Profile Image - Larger like reference */}
        <div className="flex flex-col items-center text-center lg:items-center">
          <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-2 border-sidebar-border shadow-lg lg:h-44 lg:w-44">
            <Image
              src="/merph-profile.jpg"
              alt={`Portrait de ${profile.name}`}
              fill
              sizes="(min-width: 1024px) 176px, 144px"
              className="object-cover"
              priority
            />
          </div>
          
          <div className="mt-5 w-full">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-sidebar-foreground/70">
                Disponible
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-medium text-sidebar-foreground text-balance">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-sidebar-primary">
              @{profile.alias}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/80">
              {profile.role}
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-3 border-t border-sidebar-border pt-6">
          <ContactRow icon={MapPin} label={profile.location} />
          <ContactRow
            icon={Phone}
            label={profile.phone}
            href={`tel:${profile.phone.replace(/\s/g, "")}`}
          />
          <ContactRow
            icon={Mail}
            label={profile.email}
            href={`mailto:${profile.email}`}
          />
        </div>

        {/* Social Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-sidebar-border pt-6">
          <SocialLink href={profile.linkedin} icon={Linkedin} label="LinkedIn" />
          <SocialLink href={profile.github} icon={Github} label="GitHub" />
          <SocialLink href={profile.twitter} icon={Twitter} label="X (Twitter)" />
          <SocialLink href={profile.instagram} icon={Instagram} label="Instagram" />
          <SocialLink href={profile.discord} icon={MessageCircle} label="Discord" />
          <SocialLink href={profile.facebook} icon={FacebookIcon} label="Facebook" />
        </div>
      </div>
    </aside>
  )
}

function ContactRow({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof MapPin
  label: string
  href?: string
}) {
  const content = (
    <div className="flex items-center gap-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground">
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
      <span className="truncate">{label}</span>
    </div>
  )
  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }
  return content
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: typeof Github | typeof FacebookIcon
  label: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground/70 transition-all hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:scale-105"
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </Link>
  )
}
