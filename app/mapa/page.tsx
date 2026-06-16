import { supabase } from '@/lib/supabase'
import MapWrapper from '@/components/mapa/MapWrapper'

export default async function MapaPage() {
  const { data: instituciones } = await supabase
    .from('instituciones')
    .select('*')

  const geoData = instituciones?.filter(i => i.latitud && i.longitud) ?? []

  return (
    <div className="p-6 md:p-8 space-y-6">

      <div>
        <p className="text-xs uppercase tracking-widest text-[#2d8f7f] font-medium mb-1">
          Vista geoespacial
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0a2e1a]">
          Mapa de instituciones
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-[#e0d9c8] p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-[#5a6664]">
            Mostrando <span className="font-medium text-[#0a2e1a]">{geoData.length}</span> instituciones georeferenciadas
          </p>
        </div>
        <MapWrapper instituciones={geoData} />
      </div>

    </div>
  )
}