'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const TIPOS = [
  'Educativo secundario - Humanista Científico',
  'Educativo secundario - Técnico Profesional',
  'Educativo secundario - Polivalente',
  'Educativo terciario - CFT',
  'Educativo terciario - IP',
  'Educativo terciario - Universidad',
  'Privado - Micro empresa',
  'Privado - Pequeña empresa',
  'Privado - Mediana empresa',
  'Privado - Gran empresa',
  'Privado - Holding',
  'Público - Municipio',
  'Público - Institución descentralizada',
  'Público - Seremía',
  'Público - Gobierno regional',
  'Sociedad Civil - ONG',
  'Sociedad Civil - ONGD',
  'Sociedad Civil - Fundación',
  'Sociedad Civil - Corporación',
  'Sociedad Civil - Agrupación',
  'Sociedad Civil - Club',
  'Sociedad Civil - Taller',
]

const COMUNAS = [
  'Puerto Montt', 'Calbuco', 'Maullín', 'Cochamó', 'Hualaihué',
  'Castro', 'Ancud', 'Quellón', 'Dalcahue', 'Curaco de Vélez',
  'Quinchao', 'Puqueldón', 'Chonchi', 'Queilén', 'Los Muermos',
]

const ESTADOS = [
  'No iniciada',
  'En diagnóstico',
  'En acompañamiento',
  'En evidencias',
  'En revisión',
  'Certificada',
]

const INICIATIVAS = [
  'Destinos Sostenibles',
  'Ecosistemas Formativos para Destinos Sostenibles',
]

export default function EditarInstitucionPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id
  const [loadingData, setLoadingData] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    tipo_institucion: '',
    iniciativa: '',
    comuna: '',
    direccion: '',
    latitud: '',
    longitud: '',
    estado_general: 'No iniciada',
    responsable_seguimiento: '',
  })
useEffect(() => {
  if (!id) return

  const cargar = async () => {
    const { data, error } = await supabase
      .from('instituciones')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return

    setForm({
      nombre: data.nombre ?? '',
      tipo_institucion: data.tipo_institucion ?? '',
      iniciativa: data.iniciativa ?? '',
      comuna: data.comuna ?? '',
      direccion: data.direccion ?? '',
      latitud: data.latitud ? String(data.latitud) : '',
      longitud: data.longitud ? String(data.longitud) : '',
      estado_general: data.estado_general ?? 'No iniciada',
      responsable_seguimiento: data.responsable_seguimiento ?? '',
    })
  }

  void cargar()
}, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.nombre || !form.tipo_institucion || !form.comuna || !form.iniciativa) {
      setError('Por favor completa los campos obligatorios.')
      return
    }

    setLoading(true)
    const { error: sbError } = await supabase
  .from('instituciones')
  .update({
    nombre: form.nombre,
    tipo_institucion: form.tipo_institucion,
    iniciativa: form.iniciativa,
    region: 'Los Lagos',
    comuna: form.comuna,
    direccion: form.direccion,
    latitud: form.latitud ? parseFloat(form.latitud) : null,
    longitud: form.longitud ? parseFloat(form.longitud) : null,
    estado_general: form.estado_general,
    responsable_seguimiento: form.responsable_seguimiento,
    fecha_actualizacion: new Date().toISOString(),
  })
  .eq('id', id)

    setLoading(false)

    if (sbError) {
      setError('Error al guardar: ' + sbError.message)
      return
    }

    router.push('/instituciones')
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">

      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[#2d8f7f] font-medium mb-1">
          Nueva institución
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0a2e1a]">
          Editar institución
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-[#e0d9c8] p-6 space-y-5">

        {/* Nombre */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#5a6664] mb-1.5">
            Nombre público <span className="text-red-500">*</span>
          </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Liceo Politécnico de Castro"
            className="w-full border border-[#e0d9c8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d8f7f]"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#5a6664] mb-1.5">
            Tipo de institución <span className="text-red-500">*</span>
          </label>
          <select
            name="tipo_institucion"
            value={form.tipo_institucion}
            onChange={handleChange}
            className="w-full border border-[#e0d9c8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d8f7f] bg-white"
          >
            <option value="">Selecciona un tipo...</option>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Iniciativa */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#5a6664] mb-1.5">
            Iniciativa <span className="text-red-500">*</span>
          </label>
          <select
            name="iniciativa"
            value={form.iniciativa}
            onChange={handleChange}
            className="w-full border border-[#e0d9c8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d8f7f] bg-white"
          >
            <option value="">Selecciona una iniciativa...</option>
            {INICIATIVAS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        {/* Comuna */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#5a6664] mb-1.5">
            Comuna <span className="text-red-500">*</span>
          </label>
          <select
            name="comuna"
            value={form.comuna}
            onChange={handleChange}
            className="w-full border border-[#e0d9c8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d8f7f] bg-white"
          >
            <option value="">Selecciona una comuna...</option>
            {COMUNAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#5a6664] mb-1.5">
            Dirección
          </label>
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Ej: Av. Pedro Montt 123"
            className="w-full border border-[#e0d9c8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d8f7f]"
          />
        </div>

        {/* Coordenadas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#5a6664] mb-1.5">
              Latitud
            </label>
            <input
              name="latitud"
              value={form.latitud}
              onChange={handleChange}
              placeholder="-42.4827"
              className="w-full border border-[#e0d9c8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d8f7f]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#5a6664] mb-1.5">
              Longitud
            </label>
            <input
              name="longitud"
              value={form.longitud}
              onChange={handleChange}
              placeholder="-73.7618"
              className="w-full border border-[#e0d9c8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d8f7f]"
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#5a6664] mb-1.5">
            Estado general
          </label>
          <select
            name="estado_general"
            value={form.estado_general}
            onChange={handleChange}
            className="w-full border border-[#e0d9c8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d8f7f] bg-white"
          >
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* Responsable */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#5a6664] mb-1.5">
            Responsable de seguimiento
          </label>
          <input
            name="responsable_seguimiento"
            value={form.responsable_seguimiento}
            onChange={handleChange}
            placeholder="Nombre del responsable"
            className="w-full border border-[#e0d9c8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d8f7f]"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#0a2e1a] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0f4030] transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            onClick={() => router.back()}
            className="border border-[#e0d9c8] px-6 py-2.5 rounded-lg text-sm text-[#5a6664] hover:bg-[#f5f5f3] transition-colors"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}