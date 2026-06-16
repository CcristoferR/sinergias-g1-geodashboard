'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()

  const eliminar = async () => {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar esta institución?'
    )

    if (!confirmar) return

    const { error } = await supabase
      .from('instituciones')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }

    alert('Institución eliminada correctamente')
    router.push('/instituciones')
    router.refresh()
  }

  return (
    <button
      onClick={eliminar}
      className="inline-flex items-center gap-1.5 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors shadow-sm font-medium"
    >
      Eliminar
    </button>
  )
}