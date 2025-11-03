import { getCookie } from '@/utils/cookies';

const API_BASE_URL = 'https://fabricaescuela-2025-2.onrender.com/api';

export interface Ruta {
  id: number;
  nombre: string;
  origen: string;
  destino: string;
  duracionEnMinutos: number;
}

const getAuthHeaders = () => {
  const token = getCookie();
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const getRutas = async (): Promise<Ruta[]> => {
  const response = await fetch(`${API_BASE_URL}/rutas`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error al obtener la lista de rutas');
  }

  return await response.json();
};

