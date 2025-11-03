const API_BASE_URL = 'https://fabricaescuela-2025-2.onrender.com/api';

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  codigo: string;
}

export interface VerifyRequest {
  correo: string;
  codigo: string;
}

export interface VerifyResponse {
  token: string;
  correo: string;
  rol: string;
  mensaje: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error al iniciar sesión');
  }

  return await response.json();
};

export const verifyCode = async (verifyData: VerifyRequest): Promise<VerifyResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verifyData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error al verificar código');
  }

  return await response.json();
};

