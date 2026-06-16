import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ExportButton from './ExportButton'
import DeleteButton from './DeleteButton'
import EditButton from './EditButton'

const CONFIG_ESTADO: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  'no iniciada':       { bg: '#f1f0ee', text: '#6b6b5a', dot: '#9a9a8a', label: 'No iniciada' },
  'en diagnóstico':    { bg: '#fff3ed', text: '#9a4a1f', dot: '#d97757', label: 'En diagnóstico' },
  'en acompañamiento': { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', label: 'En acompañamiento' },
  'en evidencias':     { bg: '#f5f3ff', text: '#6d28d9', dot: '#8b5cf6', label: 'En evidencias' },
  'en revisión':       { bg: '#fff1f2', text: '#be123c', dot: '#ef4444', label: 'En revisión' },
  'certificada':       { bg: '#f0fdf4', text: '#166534', dot: '#22c55e', label: 'Certificada' },
}

const ETAPAS = [
  'No iniciada', 'En diagnóstico', 'En acompañamiento',
  'En evidencias', 'En revisión', 'Certificada',
]

function BadgeEstado({ estado }: { estado: string }) {
  const key = estado?.toLowerCase() ?? ''
  const cfg = CONFIG_ESTADO[key] ?? { bg: '#f1f0ee', text: '#6b6b5a', dot: '#9a9a8a', label: estado }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  )
}

function CampoFila({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex gap-6 px-6 py-4 border-b border-[#f0ebe0] last:border-0 hover:bg-[#faf8f5] transition-colors">
      <span className="text-[10px] uppercase tracking-widest text-[#9a8a7a] font-semibold w-44 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-[#1a2421] font-medium break-all">
        {valor}
      </span>
    </div>
  )
}

function MapsButton({ lat, lng }: { lat: number; lng: number }) {
  const url = `https://www.google.com/maps?q=${lat},${lng}`
  return (
    <div className="mt-3">
      <p className="text-xs text-center text-[#9a8a7a] mb-2">{lat}, {lng}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full border border-[#e0d9c8] rounded-lg py-2 text-xs font-semibold text-[#2d8f7f] bg-white hover:bg-[#f0f8f5] transition-colors"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Ver en Google Maps
      </a>
    </div>
  )
}

export default async function FichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: inst } = await supabase
    .from('instituciones')
    .select('*')
    .eq('id', id)
    .single()

  if (!inst) notFound()

  const estadoKey = inst.estado_general?.toLowerCase() ?? ''
  const cfgEstado = CONFIG_ESTADO[estadoKey] ?? {
    bg: '#f1f0ee', text: '#6b6b5a', dot: '#9a9a8a', label: inst.estado_general,
  }
  const actualIdx = ETAPAS.findIndex(e => e.toLowerCase() === estadoKey)
  const porcentaje = actualIdx >= 0 ? Math.round((actualIdx / (ETAPAS.length - 1)) * 100) : 0

  const fechaFormateada = inst.fecha_actualizacion
    ? new Date(inst.fecha_actualizacion).toLocaleDateString('es-CL', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : new Date(inst.created_at).toLocaleDateString('es-CL', {
        day: '2-digit', month: 'long', year: 'numeric',
      })

  const resumenCards = [
    { icon: '📍', label: 'Comuna',        valor: inst.comuna ?? '—' },
    { icon: '🏛',  label: 'Tipo',          valor: inst.tipo_institucion?.split(' - ')[0] ?? '—' },
    { icon: '🌿', label: 'Iniciativa',    valor: inst.iniciativa?.includes('Ecosistemas') ? 'Ecosistemas' : 'Destinos Sos.' },
    { icon: '📅', label: 'Actualización', valor: fechaFormateada },
  ]

  return (
    <div className="min-h-screen bg-[#f0f2ef]">
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">

       {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
  <div className="space-y-2">
    <p className="text-xs uppercase tracking-widest text-[#2d8f7f] font-semibold">
      Ficha institucional
    </p>

    <h1 className="text-2xl md:text-3xl font-semibold text-[#0a2e1a] leading-tight">
      {inst.nombre}
    </h1>

    <BadgeEstado estado={inst.estado_general} />
  </div>

  <div className="flex gap-2 shrink-0">
    <Link
      href="/instituciones"
      className="inline-flex items-center gap-1.5 border border-[#e0d9c8] bg-white px-4 py-2.5 rounded-xl text-sm text-[#5a6664] hover:bg-[#f5f5f3] transition-colors shadow-sm font-medium"
    >
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Volver
    </Link>

    <EditButton id={inst.id} />

    <DeleteButton id={inst.id} />

    <ExportButton />
  </div>
</div>

        {/* Cards resumen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {resumenCards.map(c => (
            <div key={c.label} className="bg-white rounded-xl border border-[#e0d9c8] p-4 shadow-sm">
              <p className="text-lg mb-1">{c.icon}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#9a8a7a] font-semibold mb-1">{c.label}</p>
              <p className="text-sm font-semibold text-[#0a2e1a] leading-snug">{c.valor}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Datos generales */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#e0d9c8] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#e8e2d8] bg-[#f8f6f2] flex items-center gap-2">
              <div className="w-1 h-5 bg-[#2d8f7f] rounded-full" />
              <p className="text-[10px] uppercase tracking-widest text-[#8a8070] font-semibold">
                Datos generales
              </p>
            </div>
            <div>
              <CampoFila label="ID institución"       valor={inst.id} />
              <CampoFila label="Nombre público"       valor={inst.nombre} />
              <CampoFila label="Tipo de institución"  valor={inst.tipo_institucion ?? '—'} />
              <CampoFila label="Iniciativa asociada"  valor={inst.iniciativa ?? '—'} />
              <CampoFila label="Región"               valor={inst.region ?? 'Los Lagos'} />
              <CampoFila label="Comuna"               valor={inst.comuna ?? '—'} />
              <CampoFila label="Dirección"            valor={inst.direccion ?? '—'} />
              <CampoFila label="Latitud"              valor={inst.latitud?.toString() ?? '—'} />
              <CampoFila label="Longitud"             valor={inst.longitud?.toString() ?? '—'} />
              <CampoFila label="Responsable"          valor={inst.responsable_seguimiento ?? '—'} />
              <CampoFila label="Última actualización" valor={fechaFormateada} />
            </div>
          </div>

          {/* Panel derecho */}
          <div className="space-y-4">

            {/* Estado */}
            <div className="bg-white rounded-xl border border-[#e0d9c8] overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#e8e2d8] bg-[#f8f6f2] flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: cfgEstado.dot }} />
                <p className="text-[10px] uppercase tracking-widest text-[#8a8070] font-semibold">
                  Estado actual
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: cfgEstado.bg }}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ background: cfgEstado.dot }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0a2e1a]">{cfgEstado.label}</p>
                    <p className="text-xs text-[#5a6664]">Proceso Biosphere</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <p className="text-[10px] text-[#9a8a7a] uppercase tracking-widest font-semibold">Avance</p>
                    <p className="text-[10px] font-bold" style={{ color: cfgEstado.dot }}>{porcentaje}%</p>
                  </div>
                  <div className="h-2 bg-[#f0ebe0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${porcentaje}%`,
                        background: `linear-gradient(90deg, ${cfgEstado.dot}88, ${cfgEstado.dot})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Geolocalización */}
            {inst.latitud && inst.longitud && (
              <div className="bg-white rounded-xl border border-[#e0d9c8] overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[#e8e2d8] bg-[#f8f6f2] flex items-center gap-2">
                  <div className="w-1 h-5 bg-[#6b8e4e] rounded-full" />
                  <p className="text-[10px] uppercase tracking-widest text-[#8a8070] font-semibold">
                    Geolocalización
                  </p>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-[#f8f6f2] rounded-lg p-3">
                      <p className="text-[9px] uppercase tracking-widest text-[#9a8a7a] font-semibold mb-1">Latitud</p>
                      <p className="text-sm font-semibold text-[#0a2e1a]">{inst.latitud}</p>
                    </div>
                    <div className="bg-[#f8f6f2] rounded-lg p-3">
                      <p className="text-[9px] uppercase tracking-widest text-[#9a8a7a] font-semibold mb-1">Longitud</p>
                      <p className="text-sm font-semibold text-[#0a2e1a]">{inst.longitud}</p>
                    </div>
                  </div>
                  <MapsButton lat={inst.latitud} lng={inst.longitud} />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Proceso Biosphere */}
        <div className="bg-white rounded-xl border border-[#e0d9c8] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#e8e2d8] bg-[#f8f6f2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#0a2e1a] rounded-full" />
              <p className="text-[10px] uppercase tracking-widest text-[#8a8070] font-semibold">
                Nivel de avance — Proceso Biosphere
              </p>
            </div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: cfgEstado.bg, color: cfgEstado.text }}
            >
              {porcentaje}% completado
            </span>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-1 flex-wrap">
              {ETAPAS.map((etapa, i) => {
                const isPasado = i < actualIdx
                const isActual = i === actualIdx
                const etapaKey = etapa.toLowerCase()
                const cfg = CONFIG_ESTADO[etapaKey] ?? {
                  bg: '#f1f0ee', text: '#6b6b5a', dot: '#9a9a8a', label: etapa,
                }
                return (
                  <div key={etapa} className="flex items-center gap-1">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        isActual ? 'shadow-sm scale-105' : isPasado ? 'opacity-80' : 'opacity-40'
                      }`}
                      style={
                        isActual
                          ? { background: cfg.dot, color: 'white', borderColor: cfg.dot }
                          : isPasado
                          ? { background: cfg.bg, color: cfg.text, borderColor: cfg.dot + '44' }
                          : { background: '#f5f5f3', color: '#9a9a8a', borderColor: '#e0d9c8' }
                      }
                    >
                      {isPasado && (
                        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {isActual && (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                      {etapa}
                    </div>
                    {i < ETAPAS.length - 1 && (
                      <svg
                        width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        className={isPasado || isActual ? 'text-[#2d8f7f]' : 'text-[#d0ccc0]'}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}