const estados: Record<string, { label: string; bg: string; color: string }> = {
  'no iniciada':        { label: 'No iniciada',       bg: '#f1efea', color: '#5a6664' },
  'en diagnóstico':     { label: 'En diagnóstico',    bg: '#faeeda', color: '#854f0b' },
  'en acompañamiento':  { label: 'En acompañamiento', bg: '#e6f1fb', color: '#185fa5' },
  'en evidencias':      { label: 'En evidencias',     bg: '#eeedfe', color: '#534ab7' },
  'en revisión':        { label: 'En revisión',       bg: '#fcebeb', color: '#a32d2d' },
  'certificada':        { label: 'Certificada',       bg: '#e1f5ee', color: '#0f6e56' },
}

export default function BadgeEstado({ estado }: { estado: string }) {
  const config = estados[estado?.toLowerCase()] ?? {
    label: estado ?? 'Sin estado',
    bg: '#f1efea',
    color: '#5a6664',
  }

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full w-fit"
      style={{ background: config.bg, color: config.color }}
    >
      ● {config.label}
    </span>
  )
}