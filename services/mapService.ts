// URL base del repositorio de semillas de mapas UC
const BASE_URL = "https://almapp.github.io/uc-maps-seeds/seeds";

export interface ExternalBuilding {
  id: number;
  name: string;
  campus_id: number;
  lat?: number;
  lng?: number;
  // Otros campos que puedan venir en el JSON
}

export const fetchMapData = async (): Promise<ExternalBuilding[]> => {
  try {
    // Intentamos obtener los edificios reales del campus
    const response = await fetch(`${BASE_URL}/buildings.json`);
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filtramos o procesamos si es necesario (ej: solo campus San Joaquín si tuviéramos ese ID)
    // Por ahora retornamos todo para asegurar match
    return data;
  } catch (error) {
    console.error("Falló la carga del mapa externo (uc-maps-seeds):", error);
    // Retornamos array vacío para que la UI no rompa, usará fallback local
    return [];
  }
};