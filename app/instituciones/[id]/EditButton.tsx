'use client'

import Link from 'next/link'

export default function EditButton({ id }: { id: string }) {
  return (
    <Link
      href={`/instituciones/${id}/Editar`}
      className="inline-flex items-center gap-2 bg-[#2d8f7f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#25786b] transition-colors"
    >
      ✏️ Editar
    </Link>
  )
}