'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const TIPOS = [
  { group: 'Educativo secundario', items: ['Humanista Científico', 'Técnico Profesional', 'Polivalente'] },
  { group: 'Educativo terciario', items: ['CFT', 'IP', 'Universidad'] },
  { group: 'Privado', items: ['Micro empresa', 'Pequeña empresa', 'Mediana empresa', 'Gran empresa', 'Holding'] },
  { group: 'Público', items: ['Municipio', 'Institución descentralizada', 'Seremía', 'Gobierno regional'] },
  { group: 'Sociedad Civil', items: ['ONG', 'ONGD', 'Fundación', 'Corporación', 'Agrupación', 'Club', 'Taller'] },
]

const COMUNAS = [
  'Puerto Montt', 'Calbuco', 'Maullín', 'Cochamó', 'Hualaihué',
  'Castro', 'Ancud', 'Quellón', 'Dalcahue', 'Curaco de Vélez',
  'Quinchao', 'Puqueldón', 'Chonchi', 'Queilén', 'Los Muermos',
]

const ESTADOS = [
  { value: 'No iniciada',       color: '#9a9a8a', bg: '#f1f0ee' },
  { value: 'En diagnóstico',    color: '#d97757', bg: '#fff3ed' },
  { value: 'En acompañamiento', color: '#3b82f6', bg: '#eff6ff' },
  { value: 'En evidencias',     color: '#8b5cf6', bg: '#f5f3ff' },
  { value: 'En revisión',       color: '#ef4444', bg: '#fff1f2' },
  { value: 'Certificada',       color: '#22c55e', bg: '#f0fdf4' },
]

const INICIATIVAS = [
  'Destinos Sostenibles',
  'Ecosistemas Formativos para Destinos Sostenibles',
]

const inputClass = "w-full border border-[#e0d9c8] rounded-xl px-4 py-3 text-sm text-[#1a2421] bg-white focus:outline-none focus:border-[#2d8f7f] focus:ring-2 focus:ring-[#2d8f7f]/10 transition-all placeholder:text-[#c0b8a8]"
const labelClass = "block text-[11px] uppercase tracking-widest text-[#9a8a7a] font-semibold mb-2"

function SectionHeader({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-8 h-8 rounded-full bg-[#0a2e1a] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {num}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-[#0a2e1a]">{title}</h2>
        <p className="text-xs text-[#9a8a7a] mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

export default function RegistrarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.nombre.trim())        return setError('El nombre público es obligatorio.')
    if (!form.tipo_institucion)     return setError('Debes seleccionar un tipo de institución.')
    if (!form.iniciativa)           return setError('Debes seleccionar una iniciativa.')
    if (!form.comuna)               return setError('Debes seleccionar una comuna.')

    setLoading(true)
    const { error: sbError } = await supabase.from('instituciones').insert({
      nombre:                  form.nombre.trim(),
      tipo_institucion:        form.tipo_institucion,
      iniciativa:              form.iniciativa,
      region:                  'Los Lagos',
      comuna:                  form.comuna,
      direccion:               form.direccion || null,
      latitud:                 form.latitud  ? parseFloat(form.latitud)  : null,
      longitud:                form.longitud ? parseFloat(form.longitud) : null,
      estado_general:          form.estado_general,
      responsable_seguimiento: form.responsable_seguimiento || null,
      fecha_actualizacion:     new Date().toISOString(),
    })
    setLoading(false)

    if (sbError) {
      setError('Error al guardar: ' + sbError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/instituciones'), 1500)
  }

  const estadoActual = ESTADOS.find(e => e.value === form.estado_general)

  return (
    <div className="min-h-screen bg-[#f0f2ef] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#2d8f7f] font-semibold mb-1">
              Nueva institución
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#0a2e1a]">
              Registrar institución
            </h1>
            <p className="text-sm text-[#5a6664] mt-1">
              Región de Los Lagos · Iniciativa Destinos Sostenibles
            </p>
          </div>
          <Link
            href="/instituciones"
            className="inline-flex items-center gap-1.5 border border-[#e0d9c8] bg-white px-4 py-2 rounded-xl text-sm text-[#5a6664] hover:bg-[#f5f5f3] transition-colors shadow-sm font-medium shrink-0 mt-1"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        </div>

        {/* Sección 1: Identificación */}
        <div className="bg-white rounded-xl border border-[#e0d9c8] p-6 shadow-sm">
          <SectionHeader
            num="1"
            title="Identificación institucional"
            desc="Datos básicos para identificar la institución en el sistema"
          />
          <div className="space-y-5">

            <div>
              <label className={labelClass}>
                Nombre público <span className="text-red-400 normal-case tracking-normal">*</span>
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Liceo Politécnico de Castro"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Tipo de institución <span className="text-red-400 normal-case tracking-normal">*</span>
              </label>
              <select
                name="tipo_institucion"
                value={form.tipo_institucion}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Selecciona un tipo...</option>
                {TIPOS.map(({ group, items }) => (
                  <optgroup key={group} label={group}>
                    {items.map(i => (
                      <option key={i} value={`${group} - ${i}`}>{i}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Iniciativa asociada <span className="text-red-400 normal-case tracking-normal">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INICIATIVAS.map(ini => (
                  <button
                    key={ini}
                    type="button"
                    onClick={() => setForm({ ...form, iniciativa: ini })}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      form.iniciativa === ini
                        ? 'border-[#2d8f7f] bg-[#e1f5ee] text-[#0f6e56] font-semibold'
                        : 'border-[#e0d9c8] text-[#5a6664] hover:border-[#2d8f7f]/40 hover:bg-[#f8f6f2]'
                    }`}
                  >
                    <span className="block text-[10px] uppercase tracking-widest mb-1 opacity-60">
                      {form.iniciativa === ini ? '✓ Seleccionada' : 'Iniciativa'}
                    </span>
                    {ini}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Responsable de seguimiento
              </label>
              <input
                name="responsable_seguimiento"
                value={form.responsable_seguimiento}
                onChange={handleChange}
                placeholder="Nombre completo del responsable"
                className={inputClass}
              />
            </div>

          </div>
        </div>

        {/* Sección 2: Ubicación */}
        <div className="bg-white rounded-xl border border-[#e0d9c8] p-6 shadow-sm">
          <SectionHeader
            num="2"
            title="Ubicación geográfica"
            desc="Localización en la Región de Los Lagos y Archipiélago de Chiloé"
          />
          <div className="space-y-5">

            <div>
              <label className={labelClass}>
                Comuna <span className="text-red-400 normal-case tracking-normal">*</span>
              </label>
              <select
                name="comuna"
                value={form.comuna}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Selecciona una comuna...</option>
                {COMUNAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Dirección exacta</label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Ej: Av. Pedro Montt 123"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Coordenadas GPS</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[#9a8a7a] font-semibold">LAT</span>
                  <input
                    name="latitud"
                    value={form.latitud}
                    onChange={handleChange}
                    placeholder="-42.4827"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[#9a8a7a] font-semibold">LNG</span>
                  <input
                    name="longitud"
                    value={form.longitud}
                    onChange={handleChange}
                    placeholder="-73.7618"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#9a8a7a] mt-2">
                💡 Puedes obtener las coordenadas desde Google Maps haciendo clic derecho en el mapa.
              </p>
            </div>

          </div>
        </div>

        {/* Sección 3: Estado */}
        <div className="bg-white rounded-xl border border-[#e0d9c8] p-6 shadow-sm">
          <SectionHeader
            num="3"
            title="Estado en el proceso Biosphere"
            desc="Etapa actual de la institución en el proceso de certificación"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ESTADOS.map(est => (
              <button
                key={est.value}
                type="button"
                onClick={() => setForm({ ...form, estado_general: est.value })}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center gap-2 ${
                  form.estado_general === est.value
                    ? 'scale-105 shadow-sm'
                    : 'border-[#e0d9c8] opacity-60 hover:opacity-90'
                }`}
                style={
                  form.estado_general === est.value
                    ? { background: est.bg, borderColor: est.color, color: est.color }
                    : { background: '#fafaf8', color: '#5a6664' }
                }
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: form.estado_general === est.value ? est.color : '#c0b8a8' }}
                />
                {est.value}
              </button>
            ))}
          </div>

          {estadoActual && (
            <div
              className="mt-4 px-4 py-3 rounded-xl border text-sm flex items-center gap-3"
              style={{ background: estadoActual.bg, borderColor: estadoActual.color + '40' }}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: estadoActual.color }} />
              <span style={{ color: estadoActual.color }} className="font-semibold">
                Estado seleccionado:
              </span>
              <span className="text-[#1a2421]">{estadoActual.value}</span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-[#f0fdf4] border border-[#22c55e]/30 text-[#166534] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Institución registrada correctamente. Redirigiendo...
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0a2e1a] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#0d3d22] transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Registrar institución
              </>
            )}
          </button>
          <button
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1 sm:flex-none border border-[#e0d9c8] bg-white px-8 py-3 rounded-xl text-sm text-[#5a6664] hover:bg-[#f5f5f3] transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}