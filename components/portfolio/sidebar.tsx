import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { profile } from "@/data/portfolio-data"

export function Sidebar() {
  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <div className="rounded-md border border-border bg-card p-6 lg:p-8">
        <div className="flex items-start gap-4 lg:flex-col lg:items-start lg:gap-6">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border lg:h-32 lg:w-32">
            <Image
              src="/merph-avatar.jpg"
              alt={`Portrait de ${profile.name}`}
              fill
              sizes="(min-width: 1024px) 128px, 80px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Disponible
              </span>
            </div>
            <h1 className="mt-2 text-xl font-medium text-foreground text-balance lg:text-2xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              @{profile.alias}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {profile.role}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2 border-t border-border pt-6">
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

        <div className="mt-6 flex items-center gap-2 border-t border-border pt-6">
          <SocialLink
            href={profile.github}
            icon={Github}
            label="GitHub"
          />
          <SocialLink
            href={profile.linkedin}
            icon={Linkedin}
            label="LinkedIn"
          />
          <SocialLink
            href={`mailto:${profile.email}`}
            icon={Mail}
            label="Email"
          />
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
    <div className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
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
  icon: typeof Github
  label: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </Link>
  )
}
