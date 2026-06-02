'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const COMUNAS = [
  'Puerto Montt', 'Calbuco', 'Maullín', 'Cochamó', 'Hualaihué',
  'Castro', 'Ancud', 'Quellón', 'Dalcahue', 'Curaco de Vélez',
  'Quinchao', 'Puqueldón', 'Chonchi', 'Queilén', 'Los Muermos',
]

const ESTADOS = [
  'No iniciada', 'En diagnóstico', 'En acompañamiento',
  'En evidencias', 'En revisión', 'Certificada',
]

const INICIATIVAS = [
  'Destinos Sostenibles',
  'Ecosistemas Formativos para Destinos Sostenibles',
]

const CONFIG_ESTADO: Record<string, { bg: string; text: string; dot: string }> = {
  'no iniciada':        { bg: '#f1f0ee', text: '#6b6b5a', dot: '#9a9a8a' },
  'en diagnóstico':     { bg: '#fff3ed', text: '#9a4a1f', dot: '#d97757' },
  'en acompañamiento':  { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  'en evidencias':      { bg: '#f5f3ff', text: '#6d28d9', dot: '#8b5cf6' },
  'en revisión':        { bg: '#fff1f2', text: '#be123c', dot: '#ef4444' },
  'certificada':        { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
}

function BadgeEstado({ estado }: { estado: string }) {
  const key = estado?.toLowerCase() ?? ''
  const cfg = CONFIG_ESTADO[key] ?? { bg: '#f1f0ee', text: '#6b6b5a', dot: '#9a9a8a' }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {estado ?? 'Sin estado'}
    </span>
  )
}

interface Institucion {
  id: string
  nombre: string
  comuna: string
  tipo_institucion: string
  iniciativa: string
  estado_general: string
  responsable_seguimiento?: string
  created_at: string
}

export default function InstitucionesPage() {
  const [instituciones, setInstituciones] = useState<Institucion[]>([])
  const [filtroComuna, setFiltroComuna] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroIniciativa, setFiltroIniciativa] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [vista, setVista] = useState<'tabla' | 'cards'>('tabla')

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('instituciones')
        .select('*')
        .order('created_at', { ascending: false })
      setInstituciones(data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtradas = useMemo(() => {
    return instituciones.filter(inst => {
      const matchComuna     = filtroComuna     ? inst.comuna === filtroComuna : true
      const matchEstado     = filtroEstado     ? inst.estado_general === filtroEstado : true
      const matchIniciativa = filtroIniciativa ? inst.iniciativa === filtroIniciativa : true
      const matchBusqueda   = busqueda
        ? inst.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          inst.comuna.toLowerCase().includes(busqueda.toLowerCase())
        : true
      return matchComuna && matchEstado && matchIniciativa && matchBusqueda
    })
  }, [instituciones, filtroComuna, filtroEstado, filtroIniciativa, busqueda])

  const hayFiltros = filtroComuna || filtroEstado || filtroIniciativa || busqueda

  const limpiar = () => {
    setFiltroComuna(''); setFiltroEstado('')
    setFiltroIniciativa(''); setBusqueda('')
  }

  // Stats rápidas
  const stats = useMemo(() => ({
    total: instituciones.length,
    certificadas: instituciones.filter(i => i.estado_general?.toLowerCase() === 'certificada').length,
    enProceso: instituciones.filter(i => {
      const e = i.estado_general?.toLowerCase()
      return e && e !== 'certificada' && e !== 'no iniciada'
    }).length,
    comunas: new Set(instituciones.map(i => i.comuna)).size,
  }), [instituciones])

  const selectClass = "border border-[#e0d9c8] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d8f7f]/20 focus:border-[#2d8f7f] text-[#1a2421] transition-all"

  return (
    <div className="min-h-screen bg-[#f0f2ef]">
      <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">


        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#2d8f7f] font-semibold mb-1">
              Listado completo
            </p>
            <h1 className="text-3xl font-semibold text-[#0a2e1a]">
              Instituciones
            </h1>
            <p className="text-sm text-[#5a6664] mt-1">
              Región de Los Lagos · Iniciativa Destinos Sostenibles
            </p>
          </div>
          <Link
            href="/registrar"
            className="inline-flex items-center gap-2 bg-[#0a2e1a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0f4030] transition-colors shadow-sm"
          >
            <span className="text-lg leading-none">+</span>
            Registrar institución
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total, color: '#2d8f7f' },
            { label: 'Certificadas', value: stats.certificadas, color: '#166534' },
            { label: 'En proceso', value: stats.enProceso, color: '#d97757' },
            { label: 'Comunas', value: stats.comunas, color: '#6d28d9' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-[#e0d9c8] px-5 py-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: s.color + '18' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0a2e1a]">{s.value}</p>
                <p className="text-xs text-[#5a6664]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-[#e0d9c8] p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap gap-3">
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a8a]"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o comuna..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full border border-[#e0d9c8] rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d8f7f]/20 focus:border-[#2d8f7f] transition-all"
              />
            </div>

            <select value={filtroComuna} onChange={e => setFiltroComuna(e.target.value)} className={selectClass}>
              <option value="">Todas las comunas</option>
              {COMUNAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className={selectClass}>
              <option value="">Todos los estados</option>
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <select value={filtroIniciativa} onChange={e => setFiltroIniciativa(e.target.value)} className={selectClass}>
              <option value="">Todas las iniciativas</option>
              {INICIATIVAS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>

            {/* Toggle vista */}
            <div className="flex border border-[#e0d9c8] rounded-lg overflow-hidden">
              <button onClick={() => setVista('tabla')}
                className={`px-3 py-2 text-sm transition-colors ${vista === 'tabla' ? 'bg-[#0a2e1a] text-white' : 'bg-white text-[#5a6664] hover:bg-[#f5f5f3]'}`}>
                ☰
              </button>
              <button onClick={() => setVista('cards')}
                className={`px-3 py-2 text-sm transition-colors ${vista === 'cards' ? 'bg-[#0a2e1a] text-white' : 'bg-white text-[#5a6664] hover:bg-[#f5f5f3]'}`}>
                ⊞
              </button>
            </div>
          </div>

          {hayFiltros && (
            <div className="flex items-center justify-between pt-2 border-t border-[#f0ebe0]">
              <p className="text-xs text-[#5a6664]">
                Mostrando <span className="font-semibold text-[#0a2e1a]">{filtradas.length}</span> de {instituciones.length} instituciones
              </p>
              <button onClick={limpiar} className="text-xs text-[#2d8f7f] hover:underline font-medium">
                Limpiar filtros ×
              </button>
            </div>
          )}
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="bg-white rounded-xl border border-[#e0d9c8] p-16 text-center">
            <div className="w-8 h-8 border-2 border-[#2d8f7f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#5a6664]">Cargando instituciones...</p>
          </div>
        ) : filtradas.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e0d9c8] p-16 text-center">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-sm font-medium text-[#1a2421]">Sin resultados</p>
            <p className="text-xs text-[#5a6664] mt-1">Prueba con otros filtros</p>
            <button onClick={limpiar} className="mt-3 text-xs text-[#2d8f7f] hover:underline">
              Limpiar filtros
            </button>
          </div>
        ) : vista === 'tabla' ? (

          /* Vista tabla */
          <div className="bg-white rounded-xl border border-[#e0d9c8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e2d8] bg-[#f8f6f2]">
                    {['Institución', 'Comuna', 'Tipo', 'Iniciativa', 'Estado', 'Acción'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-[#8a8070] font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe0]">
                  {filtradas.map((inst) => (
                    <tr key={inst.id} className="hover:bg-[#faf8f5] transition-colors group">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0a2e1a] group-hover:text-[#2d8f7f] transition-colors">
                          {inst.nombre}
                        </p>
                        {inst.responsable_seguimiento && (
                          <p className="text-xs text-[#9a9a8a] mt-0.5">
                            {inst.responsable_seguimiento}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[#5a6664] whitespace-nowrap">{inst.comuna}</td>
                      <td className="px-5 py-4 text-[#5a6664] max-w-[180px]">
                        <span className="line-clamp-2">{inst.tipo_institucion}</span>
                      </td>
                      <td className="px-5 py-4 text-[#5a6664] max-w-[160px]">
                        <span className="line-clamp-1 text-xs">{inst.iniciativa}</span>
                      </td>
                      <td className="px-5 py-4">
                        <BadgeEstado estado={inst.estado_general} />
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/instituciones/${inst.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2d8f7f] hover:text-[#0a2e1a] transition-colors"
                        >
                          Ver ficha
                          <span className="text-base leading-none">→</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer tabla */}
            <div className="px-5 py-3 border-t border-[#f0ebe0] bg-[#faf8f5]">
              <p className="text-xs text-[#9a9a8a]">
                {filtradas.length} institución{filtradas.length !== 1 ? 'es' : ''} mostrada{filtradas.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

        ) : (

          /* Vista cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtradas.map(inst => (
              <div key={inst.id}
                className="bg-white rounded-xl border border-[#e0d9c8] p-5 hover:shadow-md transition-all hover:border-[#c8d9c8] group">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f0f8f4] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#2d8f7f]">
                    {inst.nombre.charAt(0)}
                  </div>
                  <BadgeEstado estado={inst.estado_general} />
                </div>
                <h3 className="font-semibold text-[#0a2e1a] text-sm leading-snug mb-1 group-hover:text-[#2d8f7f] transition-colors">
                  {inst.nombre}
                </h3>
                <p className="text-xs text-[#5a6664] mb-0.5">{inst.comuna}</p>
                <p className="text-xs text-[#9a9a8a] mb-4 line-clamp-1">{inst.tipo_institucion}</p>
                <Link
                  href={`/instituciones/${inst.id}`}
                  className="text-xs font-semibold text-[#2d8f7f] hover:underline"
                >
                  Ver ficha →
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}