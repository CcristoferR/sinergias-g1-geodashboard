'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/mapa/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-[#f0f2ef] rounded-xl flex items-center justify-center text-sm text-[#5a6664]">
      Cargando mapa...
    </div>
  ),
})

const ESTADOS = [
  { valor: '', label: 'Todos los estados', color: '#5a6664' },
  { valor: 'No iniciada', label: 'No iniciada', color: '#9a9a8a' },
  { valor: 'En diagnóstico', label: 'En diagnóstico', color: '#d97757' },
  { valor: 'En acompañamiento', label: 'En acompañamiento', color: '#3b82f6' },
  { valor: 'En evidencias', label: 'En evidencias', color: '#8b5cf6' },
  { valor: 'En revisión', label: 'En revisión', color: '#ef4444' },
  { valor: 'Certificada', label: 'Certificada', color: '#0f6e56' },
]

const INICIATIVAS = [
  'Destinos Sostenibles',
  'Ecosistemas Formativos para Destinos Sostenibles',
]

interface Institucion {
  id: string
  nombre: string
  latitud: number
  longitud: number
  comuna: string
  tipo_institucion: string
  estado_general: string
  iniciativa?: string
}

export default function MapaCliente({ instituciones }: { instituciones: Institucion[] }) {
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroIniciativa, setFiltroIniciativa] = useState('')

  const filtradas = useMemo(() => {
    return instituciones.filter(inst => {
      const matchEstado = filtroEstado
        ? inst.estado_general?.toLowerCase() === filtroEstado.toLowerCase()
        : true
      const matchIniciativa = filtroIniciativa
        ? inst.iniciativa === filtroIniciativa
        : true
      return matchEstado && matchIniciativa
    })
  }, [instituciones, filtroEstado, filtroIniciativa])

  const conteos = useMemo(() => {
    const c: Record<string, number> = {}
    instituciones.forEach(i => {
      const e = i.estado_general?.toLowerCase() ?? 'sin estado'
      c[e] = (c[e] ?? 0) + 1
    })
    return c
  }, [instituciones])

  return (
    <div className="space-y-4">

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {ESTADOS.slice(1).map(e => (
          <button
            key={e.valor}
            onClick={() => setFiltroEstado(filtroEstado === e.valor ? '' : e.valor)}
            className={`rounded-xl border p-3 text-left transition-all ${
              filtroEstado === e.valor
                ? 'border-2 shadow-sm'
                : 'border-[#e0d9c8] bg-white hover:shadow-sm'
            }`}
            style={filtroEstado === e.valor ? {
              borderColor: e.color,
              background: e.color + '11',
            } : {}}
          >
            <p className="text-xl font-bold" style={{ color: e.color }}>
              {conteos[e.valor.toLowerCase()] ?? 0}
            </p>
            <p className="text-[10px] text-[#5a6664] mt-0.5 leading-tight">
              {e.label}
            </p>
          </button>
        ))}
      </div>

      {/* Filtros + Leyenda */}
      <div className="bg-white rounded-xl border border-[#e0d9c8] p-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-3">
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="border border-[#e0d9c8] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2d8f7f]"
          >
            {ESTADOS.map(e => (
              <option key={e.valor} value={e.valor}>{e.label}</option>
            ))}
          </select>

          <select
            value={filtroIniciativa}
            onChange={e => setFiltroIniciativa(e.target.value)}
            className="border border-[#e0d9c8] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2d8f7f]"
          >
            <option value="">Todas las iniciativas</option>
            {INICIATIVAS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>

          {(filtroEstado || filtroIniciativa) && (
            <button
              onClick={() => { setFiltroEstado(''); setFiltroIniciativa('') }}
              className="text-xs text-[#2d8f7f] hover:underline px-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <p className="text-sm text-[#5a6664]">
          <span className="font-semibold text-[#0a2e1a]">{filtradas.length}</span> de {instituciones.length} instituciones
        </p>
      </div>

      {/* Leyenda */}
      <div className="bg-white rounded-xl border border-[#e0d9c8] px-4 py-3 flex flex-wrap gap-4">
        {ESTADOS.slice(1).map(e => (
          <div key={e.valor} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: e.color }} />
            <span className="text-xs text-[#5a6664]">{e.label}</span>
          </div>
        ))}
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-xl border border-[#e0d9c8] p-3">
        <MapView instituciones={filtradas} altura="580px" />
      </div>

    </div>
  )
}