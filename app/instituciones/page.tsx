import { supabase } from '@/lib/supabase'

export default async function InstitucionesPage() {
  const { data: instituciones } = await supabase
    .from('instituciones')
    .select('*')

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Instituciones
      </h1>

      <table className="border-collapse border w-full">
        <thead>
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Comuna</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Estado</th>
          </tr>
        </thead>

        <tbody>
          {instituciones?.map((institucion) => (
            <tr key={institucion.id}>
              <td className="border p-2">
                {institucion.nombre}
              </td>

              <td className="border p-2">
                {institucion.comuna}
              </td>

              <td className="border p-2">
                {institucion.tipo_institucion}
              </td>

              <td className="border p-2">
                {institucion.estado_general}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}