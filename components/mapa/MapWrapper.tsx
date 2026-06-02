'use client'

import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] bg-[#f0f2f0] rounded-lg flex items-center justify-center text-sm text-[#5a6664]">
      Cargando mapa...
    </div>
  ),
})

interface Institucion {
  id: string
  nombre: string
  latitud: number
  longitud: number
  comuna: string
  tipo_institucion: string
  estado_general: string
}

export default function MapWrapper({ instituciones }: { instituciones: Institucion[] }) {
  return <MapView instituciones={instituciones} />
}