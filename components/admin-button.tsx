'use client'

import Link from "next/link"
import { Lock } from "lucide-react"

/**
 * Renders a responsive floating "Admin" link button that navigates to the /admin route.
 *
 * The button is hidden on small screens and appears fixed near the bottom-right on medium screens and larger. It includes a lock icon, label, and a subtle gradient glow on hover.
 *
 * @returns A JSX element for the responsive floating Admin link button.
 */
export function AdminButton() {
  return (
    <div className="hidden md:fixed md:bottom-8 md:right-8 md:flex md:z-50">
      <Link
        href="/admin"
        className="group relative inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95"
      >
        {/* Subtle glow effect */}
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
        
        {/* Content */}
        <Lock className="h-4 w-4 relative" strokeWidth={2} />
        <span className="relative">Admin</span>
      </Link>
    </div>
  )
}
