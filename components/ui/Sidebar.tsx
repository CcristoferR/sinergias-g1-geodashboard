'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard',     href: '/dashboard',    icon: '◎' },
  { label: 'Instituciones', href: '/instituciones', icon: '⊞' },
  { label: 'Mapa',          href: '/mapa',          icon: '◈' },
  { label: 'Registrar',     href: '/registrar',     icon: '⊕' },
]

function NavContent({
  pathname,
  onClose,
}: {
  pathname: string
  onClose?: () => void
}) {
  return (
    <div className="h-full w-72 bg-[#0a2e1a] text-white flex flex-col">

     <div className="px-6 py-6 border-b border-white/10">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src="/logo-sinergias.png"
    alt="SINERGIAS"
    className="h-10 object-contain"
  />
  <p className="text-[10px] text-[#5eb5a3] uppercase tracking-widest mt-3">
    GeoDashboard · Grupo 1
  </p>
</div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-widest text-white/30 px-3 mb-2">
          Navegación
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all border-l-2 ${
                isActive
                  ? 'bg-[#2d8f7f]/20 text-white border-[#5eb5a3] font-medium'
                  : 'text-white/60 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-white/10 space-y-1">
        <p className="text-[10px] text-white/30">Iniciativa Destinos Sostenibles</p>
        <p className="text-[10px] text-white/20">Región de Los Lagos · 2025</p>
      </div>

    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile: top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a2e1a] px-4 flex items-center justify-between h-14">
        <div className="bg-white rounded-md px-2 py-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-sinergias.png"
            alt="SINERGIAS"
            className="h-6 object-contain"
          />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-white text-xl p-1"
          aria-label="Abrir menú"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile: overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile: drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent pathname={pathname} onClose={() => setOpen(false)} />
      </div>

      {/* Desktop: sidebar */}
      <div className="hidden md:block sticky top-0 h-screen shrink-0">
        <NavContent pathname={pathname} />
      </div>
    </>
  )
}