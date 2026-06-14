import React from 'react'

type ShortcutLinkProps = {
  href: string
  label: string
  icon: React.ReactNode
  external?: boolean
}

export function ShortcutLink({ href, label, icon, external = false }: ShortcutLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      data-magnetic
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#101012] px-4 py-2 text-xs text-[#f8fafc] hover:border-[#22d3ee]/35 hover:text-[#22d3ee] transition-all"
    >
      {icon}
      {label}
    </a>
  )
}

export default ShortcutLink

