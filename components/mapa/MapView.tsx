'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix icono de leaflet con Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

interface Institucion {
  id: string
  nombre: string
  latitud: number
  longitud: number
  comuna: string
  tipo_institucion: string
  estado_general: string
}

export default function MapView({ 
  instituciones,
  altura = '400px'
}: { 
  instituciones: Institucion[]
  altura?: string
}) {
  return (
    <MapContainer
      center={[-41.8, -73.5]}
      zoom={7}
      style={{ height: altura, width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {instituciones.map((inst) => (
        <Marker key={inst.id} position={[inst.latitud, inst.longitud]} icon={icon}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{inst.nombre}</p>
              <p style={{ fontSize: 12, color: '#5a6664' }}>{inst.comuna}</p>
              <p style={{ fontSize: 12, color: '#5a6664' }}>{inst.tipo_institucion}</p>
              <p style={{ fontSize: 12, color: '#0f6e56', marginTop: 4 }}>
                ● {inst.estado_general}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}