'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import BadgeEstado from '@/components/instituciones/BadgeEstado'
import Link from 'next/link'

const COMUNAS = [
  'Castro', 'Ancud', 'Quellón', 'Dalcahue', 'Puerto Montt',
  'Calbuco', 'Maullín', 'Cochamó', 'Hualaihué', 'Curaco de Vélez',
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

interface Institucion {
  id: string
  nombre: string
  comuna: string
  tipo_institucion: string
  iniciativa: string
  estado_general: string
}

export default function InstitucionesPage() {
  const [instituciones, setInstituciones] = useState<Institucion[]>([])
  const [filtroComuna, setFiltroComuna] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroIniciativa, setFiltroIniciativa] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

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

  const filtradas = instituciones.filter(inst => {
    const matchComuna    = filtroComuna    ? inst.comuna === filtroComuna : true
    const matchEstado    = filtroEstado    ? inst.estado_general === filtroEstado : true
    const matchIniciativa = filtroIniciativa ? inst.iniciativa === filtroIniciativa : true
    const matchBusqueda  = busqueda
      ? inst.nombre.toLowerCase().includes(busqueda.toLowerCase())
      : true
    return matchComuna && matchEstado && matchIniciativa && matchBusqueda
  })

  const limpiarFiltros = () => {
    setFiltroComuna('')
    setFiltroEstado('')
    setFiltroIniciativa('')
    setBusqueda('')
  }

  const hayFiltros = filtroComuna || filtroEstado || filtroIniciativa || busqueda

  return (
    <div className="p-6 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#2d8f7f] font-medium mb-1">
            Listado completo
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0a2e1a]">
            Instituciones
          </h1>
        </div>
        <Link
          href="/registrar"
          className="bg-[#0a2e1a] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0f4030] transition-colors"
        >
          + Registrar nueva
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-[#e0d9c8] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="border border-[#e0d9c8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d8f7f]"
          />

          {/* Comuna */}
          <select
            value={filtroComuna}
            onChange={e => setFiltroComuna(e.target.value)}
            className="border border-[#e0d9c8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d8f7f] bg-white"
          >
            <option value="">Todas las comunas</option>
            {COMUNAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Estado */}
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="border border-[#e0d9c8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d8f7f] bg-white"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          {/* Iniciativa */}
          <select
            value={filtroIniciativa}
            onChange={e => setFiltroIniciativa(e.target.value)}
            className="border border-[#e0d9c8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d8f7f] bg-white"
          >
            <option value="">Todas las iniciativas</option>
            {INICIATIVAS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>

        </div>

        {hayFiltros && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0ebe0]">
            <p className="text-xs text-[#5a6664]">
              Mostrando <span className="font-medium text-[#0a2e1a]">{filtradas.length}</span> de {instituciones.length} instituciones
            </p>
            <button
              onClick={limpiarFiltros}
              className="text-xs text-[#2d8f7f] hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#e0d9c8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e0d9c8] bg-[#f5f5f3]">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-[#5a6664] font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-[#5a6664] font-medium">Comuna</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-[#5a6664] font-medium">Tipo</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-[#5a6664] font-medium">Iniciativa</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-[#5a6664] font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-[#5a6664] font-medium">Ficha</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#5a6664]">
                    Cargando...
                  </td>
                </tr>
              )}
              {!loading && filtradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#5a6664]">
                    No se encontraron instituciones con esos filtros.
                  </td>
                </tr>
              )}
              {filtradas.map((inst, i) => (
                <tr
                  key={inst.id}
                  className={`border-b border-[#f0ebe0] last:border-0 hover:bg-[#f9f7f4] transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-[#fdfcfa]'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-[#1a2421]">{inst.nombre}</td>
                  <td className="px-4 py-3 text-[#5a6664]">{inst.comuna}</td>
                  <td className="px-4 py-3 text-[#5a6664] max-w-[180px]">{inst.tipo_institucion}</td>
                  <td className="px-4 py-3 text-[#5a6664] max-w-[160px]">{inst.iniciativa}</td>
                  <td className="px-4 py-3">
                    <BadgeEstado estado={inst.estado_general} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/instituciones/${inst.id}`}
                      className="text-[#2d8f7f] hover:underline text-xs font-medium"
                    >
                      Ver ficha →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}