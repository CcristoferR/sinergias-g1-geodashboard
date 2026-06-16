import { supabase } from '@/lib/supabase'
import MapWrapper from '@/components/mapa/MapWrapper'
import BadgeEstado from '@/components/instituciones/BadgeEstado'

export default async function DashboardPage() {
  const { data: instituciones } = await supabase
    .from('instituciones')
    .select('*')
    .order('created_at', { ascending: false })

  const total        = instituciones?.length ?? 0
  const certificadas = instituciones?.filter(i => i.estado_general?.toLowerCase() === 'certificada').length ?? 0
  const comunas      = new Set(instituciones?.map(i => i.comuna)).size ?? 0
  const enProceso    = instituciones?.filter(i => {
    const e = i.estado_general?.toLowerCase()
    return e && e !== 'certificada' && e !== 'no iniciada'
  }).length ?? 0

  const recientes = instituciones?.slice(0, 6) ?? []
  const geoData   = instituciones?.filter(i => i.latitud && i.longitud) ?? []

  return (
    <div className="p-6 md:p-8 space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[#2d8f7f] font-medium mb-1">
          Resumen general
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0a2e1a]">
          Dashboard
        </h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total instituciones', value: total,        color: '#2d8f7f' },
          { label: 'Certificadas',        value: certificadas, color: '#6b8e4e' },
          { label: 'Comunas activas',     value: comunas,      color: '#0f4747' },
          { label: 'En proceso',          value: enProceso,    color: '#d97757' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl border border-[#e0d9c8] p-5 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ background: kpi.color }}
            />
            <p className="text-[11px] uppercase tracking-widest text-[#5a6664] mb-2">
              {kpi.label}
            </p>
            <p className="text-4xl font-semibold text-[#0a2e1a]">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Mapa + Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Mapa */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e0d9c8] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[#0a2e1a]">Mapa de instituciones</h2>
            <span className="text-xs bg-[#e1f5ee] text-[#0f6e56] px-2.5 py-1 rounded-full font-medium">
              {geoData.length} georeferenciadas
            </span>
          </div>
          <MapWrapper instituciones={geoData} />
        </div>

        {/* Últimas registradas */}
        <div className="bg-white rounded-xl border border-[#e0d9c8] p-4">
          <h2 className="font-semibold text-[#0a2e1a] mb-4">Últimas registradas</h2>
          <div className="space-y-3">
            {recientes.length === 0 && (
              <p className="text-sm text-[#5a6664]">Sin instituciones registradas aún.</p>
            )}
            {recientes.map((inst) => (
              <div
                key={inst.id}
                className="flex flex-col gap-1 pb-3 border-b border-[#f0ebe0] last:border-0 last:pb-0"
              >
                <p className="text-sm font-medium text-[#1a2421] truncate">
                  {inst.nombre}
                </p>
                <p className="text-xs text-[#5a6664]">
                  {inst.comuna} · {inst.tipo_institucion}
                </p>
                <BadgeEstado estado={inst.estado_general} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}