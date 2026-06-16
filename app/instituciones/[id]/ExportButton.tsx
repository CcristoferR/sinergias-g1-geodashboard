'use client'

export default function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-[#0a2e1a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0f4030] transition-colors"
    >
      Exportar PDF
    </button>
  )
}