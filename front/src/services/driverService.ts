import { getCookie } from '@/utils/cookies';

const API_BASE_URL = 'https://fabricaescuela-2025-2.onrender.com/api';

export interface Usuario {
  id: number;
  correo: string;
}

export interface Conductor {
  id: number;
  nombreCompleto: string;
  licencia: string;
  telefono: string;
  usuario: Usuario;
}

const getAuthHeaders = () => {
  const token = getCookie();
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const getConductores = async (): Promise<Conductor[]> => {
  const response = await fetch(`${API_BASE_URL}/conductores`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error al obtener la lista de conductores');
  }

  return await response.json();
};

