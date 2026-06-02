import { supabase } from '@/lib/supabase'
import BadgeEstado from '@/components/instituciones/BadgeEstado'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ExportButton from './ExportButton'

export default async function FichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: inst } = await supabase
    .from('instituciones')
    .select('*')
    .eq('id', id)
    .single()

  if (!inst) notFound()

  const campos = [
    { label: 'ID institución',       valor: inst.id },
    { label: 'Nombre público',       valor: inst.nombre },
    { label: 'Tipo de institución',  valor: inst.tipo_institucion },
    { label: 'Iniciativa asociada',  valor: inst.iniciativa },
    { label: 'Región',               valor: inst.region ?? 'Los Lagos' },
    { label: 'Comuna',               valor: inst.comuna },
    { label: 'Dirección',            valor: inst.direccion ?? '—' },
    { label: 'Latitud',              valor: inst.latitud ?? '—' },
    { label: 'Longitud',             valor: inst.longitud ?? '—' },
    { label: 'Responsable',          valor: inst.responsable_seguimiento ?? '—' },
    { label: 'Última actualización', valor: inst.fecha_actualizacion
        ? new Date(inst.fecha_actualizacion).toLocaleDateString('es-CL')
        : new Date(inst.created_at).toLocaleDateString('es-CL') },
  ]

  const etapas = ['No iniciada','En diagnóstico','En acompañamiento','En evidencias','En revisión','Certificada']
  const actual = etapas.findIndex(e => e.toLowerCase() === inst.estado_general?.toLowerCase())

  return (
    <div className="p-6 md:p-8 max-w-3xl space-y-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#2d8f7f] font-medium mb-1">
            Ficha institucional
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0a2e1a]">
            {inst.nombre}
          </h1>
          <div className="mt-2">
            <BadgeEstado estado={inst.estado_general} />
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/instituciones"
            className="border border-[#e0d9c8] px-4 py-2 rounded-lg text-sm text-[#5a6664] hover:bg-[#f5f5f3] transition-colors"
          >
            ← Volver
          </Link>
          <ExportButton />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e0d9c8] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e0d9c8] bg-[#f5f5f3]">
          <p className="text-xs uppercase tracking-widest text-[#5a6664] font-medium">
            Datos generales
          </p>
        </div>
        <div className="divide-y divide-[#f0ebe0]">
          {campos.map(({ label, valor }) => (
            <div key={label} className="flex px-6 py-3.5 gap-4">
              <span className="text-xs uppercase tracking-widest text-[#5a6664] w-48 shrink-0 pt-0.5">
                {label}
              </span>
              <span className="text-sm text-[#1a2421] break-all">
                {String(valor)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e0d9c8] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e0d9c8] bg-[#f5f5f3]">
          <p className="text-xs uppercase tracking-widest text-[#5a6664] font-medium">
            Nivel de avance — Proceso Biosphere
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 flex-wrap">
            {etapas.map((etapa, i) => {
              const isActual = i === actual
              const isPasado = i < actual
              return (
                <div key={etapa} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    isActual
                      ? 'bg-[#0a2e1a] text-white border-[#0a2e1a]'
                      : isPasado
                      ? 'bg-[#e1f5ee] text-[#0f6e56] border-[#b8e0d0]'
                      : 'bg-[#f5f5f3] text-[#9a9a8a] border-[#e0d9c8]'
                  }`}>
                    {isPasado && <span>✓</span>}
                    {etapa}
                  </div>
                  {i < 5 && (
                    <span className={`text-xs ${isPasado || isActual ? 'text-[#2d8f7f]' : 'text-[#c0bdb0]'}`}>
                      →
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </div>
  )
}