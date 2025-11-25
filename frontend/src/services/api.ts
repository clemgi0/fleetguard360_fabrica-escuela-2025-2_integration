// frontend/src/services/api.ts
<<<<<<< HEAD:frontend/src/services/api.ts
// Cliente HTTP para conectar con el backend de FleetGuard360
// Importar tipos desde otros servicios
import type { AsignacionTurno } from './asignacionesService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ========================================
// GESTIÓN DE AUTENTICACIÓN
// ========================================

const getToken = (): string | null => localStorage.getItem('token');

=======

const API_BASE_URL = __API_BASE_URL__ || 'https://fabricaescuela-2025-2.onrender.com/api';

// Obtener token
const getToken = (): string | null => localStorage.getItem('token');

// Guardar auth
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/api.ts
export const saveAuth = (token: string, correo: string, rol: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('correo', correo);
    localStorage.setItem('rol', rol);
};

<<<<<<< HEAD:frontend/src/services/api.ts
=======
// Limpiar auth
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/api.ts
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('correo');
    localStorage.removeItem('rol');
};

<<<<<<< HEAD:frontend/src/services/api.ts
=======
// Obtener datos de auth
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/api.ts
export const getAuthData = () => ({
    token: localStorage.getItem('token'),
    correo: localStorage.getItem('correo'),
    rol: localStorage.getItem('rol'),
});

<<<<<<< HEAD:frontend/src/services/api.ts
export const isAuthenticated = (): boolean => !!getToken();

// ========================================
// CLIENTE HTTP GENÉRICO
// ========================================

async function fetchAPI<T = unknown>(
=======
// Fetch genérico
async function fetchAPI<T = any>(
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/api.ts
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

<<<<<<< HEAD:frontend/src/services/api.ts
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Manejo de respuesta 401 (no autorizado)
        if (response.status === 401) {
            clearAuth();
            window.location.href = '/login';
            throw new Error('Sesión expirada');
        }

        // Manejo de respuesta 204 (sin contenido)
        if (response.status === 204) {
            return null as T;
        }

        // Manejo de errores HTTP
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.mensaje || error.message || `Error ${response.status}`);
        }

        return response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error de conexión con el servidor');
    }
}

// ========================================
// API GENÉRICA
// ========================================

const api = {
    get: <T = unknown>(endpoint: string) => fetchAPI<T>(endpoint),

    post: <T = unknown>(endpoint: string, data?: unknown) =>
=======
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        clearAuth();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.mensaje || `Error ${response.status}`);
    }

    return response.json();
}

// API genérica
const api = {
    get: <T = any>(endpoint: string) => fetchAPI<T>(endpoint),
    post: <T = any>(endpoint: string, data?: any) =>
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/api.ts
        fetchAPI<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),
<<<<<<< HEAD:frontend/src/services/api.ts

    put: <T = unknown>(endpoint: string, data?: unknown) =>
=======
    put: <T = any>(endpoint: string, data?: any) =>
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/api.ts
        fetchAPI<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),
<<<<<<< HEAD:frontend/src/services/api.ts

    patch: <T = unknown>(endpoint: string, data?: unknown) =>
=======
    patch: <T = any>(endpoint: string, data?: any) =>
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/api.ts
        fetchAPI<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),
<<<<<<< HEAD:frontend/src/services/api.ts

    delete: <T = unknown>(endpoint: string) =>
=======
    delete: <T = any>(endpoint: string) =>
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/api.ts
        fetchAPI<T>(endpoint, { method: 'DELETE' }),
};

export default api;

<<<<<<< HEAD:frontend/src/services/api.ts
// ========================================
// INTERFACES DE RESPUESTA
// ========================================

interface AuthResponse {
    token: string;
    correo: string;
    rol: string;
    mensaje: string;
}

interface MessageResponse {
    mensaje: string;
}

interface Conductor {
    id: number;
    nombreCompleto: string;  // ✅ Cambiar de nombre/apellido a nombreCompleto
    cedula: string;
    telefono: string;
    correo: string;
    email?: string;  // ✅ Agregar email como opcional
    licencia?: string;  // ✅ Agregar licencia
    password?: string; // ✅ Solo se usa en create
    username?: string; // ✅ Alias para el frontend
    estado?: string;   // ✅ Mantener como opcional
}

interface Ruta {
    id: number;
    nombre: string;
    origen: string;
    destino: string;
    distanciaKm: number;
    duracionEstimadaMinutos: number;
    descripcion?: string;
}

interface Turno {
    id: number;
    rutaId: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    numeroSemana: number;
}



// ========================================
// API DE AUTENTICACIÓN
// ========================================

export const authAPI = {
    /**
     * Login paso 1: Envía código de 6 dígitos al correo
     */
    login: (correo: string, password: string): Promise<MessageResponse> =>
        api.post('/api/auth/login', { correo, password }),

    /**
     * Login paso 2: Verifica el código y retorna token JWT
     */
    verify: (correo: string, codigo: string): Promise<AuthResponse> =>
        api.post('/api/auth/verify', { correo, codigo }),

    /**
     * Login directo con cédula (sin verificación de código)
     */
    loginConCedula: (cedula: string, password: string): Promise<AuthResponse> =>
        api.post('/api/auth/login-cedula', { cedula, password }),

    /**
     * Valida el token JWT actual
     */
    validate: (): Promise<AuthResponse> => api.get('/api/auth/validate'),
};

// ========================================
// API DE CONDUCTORES (HU-3)
// ========================================

export const conductoresAPI = {
    getAll: (): Promise<Conductor[]> => api.get('/api/conductores'),

    getById: (id: number): Promise<Conductor> => api.get(`/api/conductores/${id}`),

    create: (data: Omit<Conductor, 'id'>): Promise<Conductor> =>
        api.post('/api/conductores', data),

    update: (id: number, data: Omit<Conductor, 'id'>): Promise<Conductor> =>
        api.put(`/api/conductores/${id}`, data),

    delete: (id: number): Promise<void> => api.delete(`/api/conductores/${id}`),

    buscar: (termino: string): Promise<Conductor[]> =>
        api.get(`/api/conductores/buscar?termino=${encodeURIComponent(termino)}`),
};

// ========================================
// API DE RUTAS (HU-4)
// ========================================

export const rutasAPI = {
    getAll: (): Promise<Ruta[]> => api.get('/api/rutas'),

    getById: (id: number): Promise<Ruta> => api.get(`/api/rutas/${id}`),

    create: (data: Omit<Ruta, 'id'>): Promise<Ruta> =>
        api.post('/api/rutas', data),

    update: (id: number, data: Omit<Ruta, 'id'>): Promise<Ruta> =>
        api.put(`/api/rutas/${id}`, data),

    delete: (id: number): Promise<void> => api.delete(`/api/rutas/${id}`),
};

// ========================================
// API DE TURNOS (HU-5)
// ========================================

export const turnosAPI = {
    getAll: (): Promise<Turno[]> => api.get('/api/turnos'),

    getByRuta: (rutaId: number): Promise<Turno[]> =>
        api.get(`/api/turnos/ruta/${rutaId}`),

    getByRutaYSemana: (rutaId: number, semana: number): Promise<Turno[]> =>
        api.get(`/api/turnos/ruta/${rutaId}/semana/${semana}`),

    create: (data: Omit<Turno, 'id'>): Promise<Turno> =>
        api.post('/api/turnos', data),

    /**
     * ⭐ NUEVO: Previsualizar turnos automáticos sin crearlos
     */
    previsualizarAuto: (
        rutaId: number,
        horaInicio: string,
        horaFin: string,
        numeroSemana: number
    ): Promise<{
        rutaNombre: string;
        horaInicio: string;
        horaFin: string;
        turnosPorDia: number;
        totalTurnos: number;
        turnosMuestra: Array<{
            horaInicio: string;
            horaFin: string;
            duracionHoras: number;
        }>;
        minutosRestantes?: number;
        horasRestantes?: number;
        advertencia?: string;
    }> => {
        const params = new URLSearchParams({
            rutaId: rutaId.toString(),
            horaInicio,
            horaFin,
            numeroSemana: numeroSemana.toString(),
        });
        return api.get(`/api/turnos/previsualizar?${params}`);
    },

    /**
     * Crea turnos automáticamente para toda la semana
     */
    createAuto: (
        rutaId: number,
        horaInicio: string,
        horaFin: string,
        numeroSemana: number
    ): Promise<{
        mensaje: string;
        totalTurnos: number;
        turnosPorDia: number;
        turnos: Turno[];
    }> => {
        const params = new URLSearchParams({
            rutaId: rutaId.toString(),
            horaInicio,
            horaFin,
            numeroSemana: numeroSemana.toString(),
        });
        return api.post(`/api/turnos/auto?${params}`);
    },

    delete: (id: number): Promise<void> => api.delete(`/api/turnos/${id}`),
};

// ========================================
// API DE ASIGNACIONES (HU-5 y HU-6)
// ========================================

export const asignacionesAPI = {
    getAll: (): Promise<AsignacionTurno[]> => api.get('/api/asignaciones'),

    getByConductor: (conductorId: number): Promise<AsignacionTurno[]> =>
        api.get(`/api/asignaciones/conductor/${conductorId}`),

    getActivas: (): Promise<AsignacionTurno[]> =>
        api.get('/api/asignaciones/activas'),

    create: (data: {
        conductorId: number;
        turnoId: number;
        fechaInicio: string;  // ⭐ Cambiar nombre
        estado: string;  // ⭐ Agregar estado
    }): Promise<AsignacionTurno> => api.post('/api/asignaciones', data),

    /**
     * Marca una asignación como iniciada (EN_PROGRESO)
     */
    iniciar: (id: number): Promise<AsignacionTurno> =>
        api.patch(`/api/asignaciones/${id}/iniciar`),

    /**
     * Marca una asignación como finalizada (COMPLETADA)
     */
    finalizar: (id: number): Promise<AsignacionTurno> =>
        api.patch(`/api/asignaciones/${id}/finalizar`),

    /**
     * Cancela una asignación
     */
    cancelar: (id: number): Promise<void> =>
        api.delete(`/api/asignaciones/${id}`),
};

// ========================================
// EXPORTACIÓN POR DEFECTO
// ========================================
=======
// Exportar APIs específicas
export const authAPI = {
    login: (correo: string, password: string) =>
        api.post('/auth/login', { correo, password }),
    verify: (correo: string, codigo: string) =>
        api.post('/auth/verify', { correo, codigo }),
    validate: () => api.get('/auth/validate'),
};

export const conductoresAPI = {
    getAll: () => api.get('/conductores'),
    getById: (id: number) => api.get(`/conductores/${id}`),
    create: (data: any) => api.post('/conductores', data),
    update: (id: number, data: any) => api.put(`/conductores/${id}`, data),
    delete: (id: number) => api.delete(`/conductores/${id}`),
};

export const rutasAPI = {
    getAll: () => api.get('/rutas'),
    getById: (id: number) => api.get(`/rutas/${id}`),
    create: (data: any) => api.post('/rutas', data),
    update: (id: number, data: any) => api.put(`/rutas/${id}`, data),
    delete: (id: number) => api.delete(`/rutas/${id}`),
};

export const turnosAPI = {
    getAll: () => api.get('/turnos'),
    getByRuta: (rutaId: number) => api.get(`/turnos/ruta/${rutaId}`),
    getByRutaYSemana: (rutaId: number, semana: number) =>
        api.get(`/turnos/ruta/${rutaId}/semana/${semana}`),
    create: (data: any) => api.post('/turnos', data),
    createAuto: (rutaId: number, horaInicio: string, horaFin: string, numeroSemana: number) =>
        api.post(`/turnos/auto?rutaId=${rutaId}&horaInicio=${horaInicio}&horaFin=${horaFin}&numeroSemana=${numeroSemana}`),
    delete: (id: number) => api.delete(`/turnos/${id}`),
};

export const asignacionesAPI = {
    getAll: () => api.get('/asignaciones'),
    getByConductor: (conductorId: number) =>
        api.get(`/asignaciones/conductor/${conductorId}`),
    getActivas: () => api.get('/asignaciones/activas'),
    create: (data: any) => api.post('/asignaciones', data),
    iniciar: (id: number) => api.patch(`/asignaciones/${id}/iniciar`),
    finalizar: (id: number) => api.patch(`/asignaciones/${id}/finalizar`),
    cancelar: (id: number) => api.delete(`/asignaciones/${id}`),
};
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/api.ts
