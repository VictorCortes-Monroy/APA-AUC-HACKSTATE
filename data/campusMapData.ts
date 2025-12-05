// Simulación de datos extraídos de un repositorio de mapas (GeoJSON/SVG paths)
// Representación abstracta del Campus San Joaquín para el MVP

export interface MapFeature {
  id: string;
  name: string;
  type: 'building' | 'green_area' | 'path';
  path: string; // SVG Path data
  labelPos: { x: number; y: number }; // Centroide visual para etiquetas/pines
}

// ViewBox 0 0 800 600
export const CAMPUS_GEOMETRY: MapFeature[] = [
  // --- EDIFICIOS PRINCIPALES ---
  {
    id: 'library',
    name: 'Biblioteca',
    type: 'building',
    path: 'M 360 220 L 440 220 L 440 300 L 360 300 Z', // Cuadrado central
    labelPos: { x: 400, y: 260 }
  },
  {
    id: 'hall_univ',
    name: 'Edificio A - Hall',
    type: 'building',
    path: 'M 100 150 L 300 150 L 300 200 L 100 200 Z', // Tira larga izquierda
    labelPos: { x: 200, y: 175 }
  },
  {
    id: 'engineering',
    name: 'Patio de Ingeniería',
    type: 'building',
    path: 'M 500 250 L 700 250 L 700 450 L 500 450 Z', // Complejo grande derecha
    labelPos: { x: 600, y: 350 }
  },
  {
    id: 'cafeteria',
    name: 'Cafetería Central',
    type: 'building',
    path: 'M 320 350 L 400 350 L 420 400 L 300 400 Z', // Trapezoide central bajo
    labelPos: { x: 360, y: 380 }
  },
  {
    id: 'labs',
    name: 'Laboratorios de Cómputo',
    type: 'building',
    path: 'M 150 400 L 250 400 L 250 500 L 150 500 Z', // Abajo izquierda
    labelPos: { x: 200, y: 450 }
  },
  {
    id: 'innovation',
    name: 'Centro Innovación',
    type: 'building',
    path: 'M 550 100 L 650 100 L 650 200 L 550 200 Z', // Arriba derecha
    labelPos: { x: 600, y: 150 }
  },
  
  // --- ÁREAS VERDES / CAMINOS (Contexto Visual) ---
  {
    id: 'green_central',
    name: 'Áreas Verdes',
    type: 'green_area',
    path: 'M 300 200 L 500 200 L 500 400 L 300 400 Z', // Fondo central
    labelPos: { x: 0, y: 0 }
  }
];

// Mapeo de los nombres "humanos" de las solicitudes a IDs del mapa
export const LOCATION_MAPPING: Record<string, string> = {
  "Biblioteca - Piso 1": "library",
  "Biblioteca - Piso 2": "library",
  "Biblioteca - Piso 3": "library",
  "Cafetería Central": "cafeteria",
  "Patio de Ingeniería": "engineering",
  "Edificio A - Hall": "hall_univ",
  "Laboratorios de Cómputo": "labs"
};