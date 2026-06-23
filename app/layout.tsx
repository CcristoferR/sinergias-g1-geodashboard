import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/ui/Sidebar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SINERGIAS · GeoDashboard',
  description: 'Plataforma de seguimiento institucional — Destinos Sostenibles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-[#f4f4f2] text-[#1a2421]`}>
        <div className="fixed top-4 right-4 z-50 bg-amber-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          DEMO - Uso académico
        </div>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}