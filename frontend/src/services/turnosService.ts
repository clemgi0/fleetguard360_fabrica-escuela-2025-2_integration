<<<<<<< HEAD:frontend/src/services/turnosService.ts
// frontend/src/services/turnosService.ts
// Servicio REAL para gestión de turnos (plantillas de horarios)
// Reemplaza el mock anterior conectándose con el backend

import { turnosAPI } from './api';

// ========================================
// INTERFACES
// ========================================

export interface Turno {
  id: number;
  ruta: {
    id: number;
    nombre: string;
    origen: string;
    destino: string;
  };
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  numeroSemana: number;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface TurnoForm {
  rutaId: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  numeroSemana: number;
}

export interface PreviewTurno {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
}

export interface PreviewResponse {
  totalTurnos: number;
  turnosPorDia: number;
  turnos: PreviewTurno[];
  advertencias?: string[];
}

export interface CreateAutoRequest {
  rutaId: number;
  horaInicio: string;
  horaFin: string;
  numeroSemana: number;
}

// ========================================
// FUNCIONES DEL SERVICIO
// ========================================

/**
 * Obtiene todos los turnos (plantillas)
 */
export const obtenerTurnos = async (): Promise<Turno[]> => {
  try {
    return await turnosAPI.getAll();
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    throw error;
  }
};

/**
 * Obtiene un turno por ID
 */
export const obtenerTurnoPorId = async (id: number): Promise<Turno> => {
  try {
    return await turnosAPI.getById(id);
  } catch (error) {
    console.error(`Error al obtener turno ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene turnos por ruta
 */
export const obtenerTurnosPorRuta = async (rutaId: number): Promise<Turno[]> => {
  try {
    return await turnosAPI.getByRuta(rutaId);
  } catch (error) {
    console.error(`Error al obtener turnos de ruta ${rutaId}:`, error);
    throw error;
  }
};

/**
 * Obtiene turnos por ruta y semana
 */
export const obtenerTurnosPorRutaYSemana = async (
    rutaId: number,
    numeroSemana: number
): Promise<Turno[]> => {
  try {
    return await turnosAPI.getByRutaAndSemana(rutaId, numeroSemana);
  } catch (error) {
    console.error(`Error al obtener turnos de ruta ${rutaId} semana ${numeroSemana}:`, error);
    throw error;
  }
};

/**
 * Previsualiza turnos automáticos antes de crear
 */
export const previsualizarTurnosAutomaticos = async (
    rutaId: number,
    horaInicio: string,
    horaFin: string,
    numeroSemana: number
): Promise<PreviewResponse> => {
  try {
    return await turnosAPI.previsualizarAuto(rutaId, horaInicio, horaFin, numeroSemana);
  } catch (error) {
    console.error('Error al previsualizar turnos:', error);
    throw error;
  }
};

/**
 * Crea turnos automáticamente
 */
export const crearTurnosAutomaticos = async (
    data: CreateAutoRequest
): Promise<PreviewResponse> => {
  try {
    return await turnosAPI.createAuto(
        data.rutaId,
        data.horaInicio,
        data.horaFin,
        data.numeroSemana
    );
  } catch (error) {
    console.error('Error al crear turnos automáticos:', error);
    throw error;
  }
};

/**
 * Crea un turno manual
 */
export const crearTurno = async (data: TurnoForm): Promise<Turno> => {
  try {
    return await turnosAPI.create(data);
  } catch (error) {
    console.error('Error al crear turno:', error);
    throw error;
  }
};

/**
 * Actualiza un turno existente
 */
export const actualizarTurno = async (
    id: number,
    data: TurnoForm
): Promise<Turno> => {
  try {
    return await turnosAPI.update(id, data);
  } catch (error) {
    console.error(`Error al actualizar turno ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un turno
 */
export const eliminarTurno = async (id: number): Promise<void> => {
  try {
    await turnosAPI.delete(id);
  } catch (error) {
    console.error(`Error al eliminar turno ${id}:`, error);
    throw error;
  }
};

// ========================================
// UTILIDADES Y VALIDACIONES
// ========================================

/**
 * Valida el formato de hora (HH:mm)
 */
export const validarFormatoHora = (hora: string): boolean => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(hora);
};

/**
 * Valida que hora fin sea mayor que hora inicio
 */
export const validarRangoHorario = (horaInicio: string, horaFin: string): boolean => {
  if (!validarFormatoHora(horaInicio) || !validarFormatoHora(horaFin)) {
    return false;
  }

  const [horaIni, minIni] = horaInicio.split(':').map(Number);
  const [horaFin2, minFin] = horaFin.split(':').map(Number);

  const minutosInicio = horaIni * 60 + minIni;
  const minutosFin = horaFin2 * 60 + minFin;

  return minutosFin > minutosInicio;
};

/**
 * Calcula la duración en horas entre dos horarios
 */
export const calcularDuracion = (horaInicio: string, horaFin: string): number => {
  const [horaIni, minIni] = horaInicio.split(':').map(Number);
  const [horaFin2, minFin] = horaFin.split(':').map(Number);

  const minutosInicio = horaIni * 60 + minIni;
  const minutosFin = horaFin2 * 60 + minFin;

  return (minutosFin - minutosInicio) / 60;
};

/**
 * Formatea la duración en formato legible (ej: "8h", "7.5h")
 */
export const formatearDuracion = (horas: number): string => {
  const horasEnteras = Math.floor(horas);
  const minutos = Math.round((horas - horasEnteras) * 60);

  if (minutos === 0) {
    return `${horasEnteras}h`;
  }
  return `${horasEnteras}h ${minutos}m`;
};

/**
 * Días de la semana en español
 */
export const DIAS_SEMANA = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO'
] as const;

/**
 * Obtiene el nombre del día en formato legible
 */
export const formatearDiaSemana = (dia: string): string => {
  const dias: Record<string, string> = {
    'LUNES': 'Lunes',
    'MARTES': 'Martes',
    'MIERCOLES': 'Miércoles',
    'JUEVES': 'Jueves',
    'VIERNES': 'Viernes',
    'SABADO': 'Sábado',
    'DOMINGO': 'Domingo'
  };
  return dias[dia] || dia;
};

/**
 * Obtiene el color del badge según el estado
 */
export const obtenerColorEstado = (estado: string): string => {
  switch (estado) {
    case 'ACTIVO':
      return 'bg-green-100 text-green-800';
    case 'INACTIVO':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Valida los datos del formulario de turno manual
 */
export const validarFormularioTurno = (data: TurnoForm): {
  valid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  if (!data.rutaId) {
    errors.rutaId = 'Debe seleccionar una ruta';
  }

  if (!data.diaSemana) {
    errors.diaSemana = 'Debe seleccionar un día de la semana';
  }

  if (!data.horaInicio) {
    errors.horaInicio = 'La hora de inicio es requerida';
  } else if (!validarFormatoHora(data.horaInicio)) {
    errors.horaInicio = 'Formato de hora inválido (use HH:mm)';
  }

  if (!data.horaFin) {
    errors.horaFin = 'La hora de fin es requerida';
  } else if (!validarFormatoHora(data.horaFin)) {
    errors.horaFin = 'Formato de hora inválido (use HH:mm)';
  }

  if (data.horaInicio && data.horaFin && !validarRangoHorario(data.horaInicio, data.horaFin)) {
    errors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
  }

  const duracion = calcularDuracion(data.horaInicio, data.horaFin);
  if (duracion > 8) {
    errors.horaFin = 'El turno no puede superar las 8 horas';
  }

  if (!data.numeroSemana || data.numeroSemana < 1 || data.numeroSemana > 52) {
    errors.numeroSemana = 'El número de semana debe estar entre 1 y 52';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
=======
// Mock service for shift management
// TODO: Replace with actual Supabase/API integration when backend is ready

import turnosMock from '@/mocks/turnosMock.json';
import driversMock from '@/mocks/driversMock.json';
import routesMock from '@/mocks/routesData.json';

export interface Turno {
  id: string;
  driverId: string;
  driverName: string;
  driverLicense: string;
  routeId: string;
  routeName: string;
  startDate: string;
  startTime: string;
  duration: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  duration: string;
}

// In-memory storage (simulating database)
let turnos: Turno[] = [...turnosMock] as Turno[];
const drivers: Driver[] = [...driversMock] as Driver[];

// Parse duration string (e.g., "1h 30m") to hours
const parseDuration = (durationStr: string): number => {
  const match = durationStr.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  return hours + minutes / 60;
};

// Get all shifts
export const getTurnos = async (): Promise<Turno[]> => {
  // TODO: Replace with actual API call
  // const { data, error } = await supabase.from('turnos').select('*');
  return new Promise((resolve) => {
    setTimeout(() => resolve([...turnos]), 300);
  });
};

// Get all drivers
export const getDrivers = async (): Promise<Driver[]> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => resolve([...drivers]), 300);
  });
};

// Get all routes
export const getRoutes = async (): Promise<Route[]> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => resolve([...routesMock]), 300);
  });
};

// Check if time ranges overlap
const timeRangesOverlap = (
  start1: string,
  duration1: number,
  start2: string,
  duration2: number
): boolean => {
  const [h1, m1] = start1.split(':').map(Number);
  const [h2, m2] = start2.split(':').map(Number);
  
  const start1Minutes = h1 * 60 + m1;
  const end1Minutes = start1Minutes + duration1 * 60;
  const start2Minutes = h2 * 60 + m2;
  const end2Minutes = start2Minutes + duration2 * 60;
  
  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
};

// Validate shift assignment
export const validateShiftAssignment = async (
  driverId: string,
  routeId: string,
  startDate: string,
  startTime: string,
  excludeShiftId?: string
): Promise<{ valid: boolean; error?: string; totalHours?: number }> => {
  const route = routesMock.find(r => r.id === routeId);
  if (!route) {
    return { valid: false, error: 'Ruta no encontrada' };
  }

  const duration = parseDuration(route.duration);
  
  // Get all shifts for this driver on the same date
  const driverShifts = turnos.filter(
    t => t.driverId === driverId && 
         t.startDate === startDate && 
         t.id !== excludeShiftId &&
         t.status === 'active'
  );

  // Check for time conflicts with driver
  for (const shift of driverShifts) {
    if (timeRangesOverlap(startTime, duration, shift.startTime, shift.duration)) {
      return { 
        valid: false, 
        error: 'Error de asignación: El conductor o la ruta ya están ocupados en el horario especificado.' 
      };
    }
  }

  // Check for time conflicts with route
  const routeShifts = turnos.filter(
    t => t.routeId === routeId && 
         t.startDate === startDate && 
         t.id !== excludeShiftId &&
         t.status === 'active'
  );

  for (const shift of routeShifts) {
    if (timeRangesOverlap(startTime, duration, shift.startTime, shift.duration)) {
      return { 
        valid: false, 
        error: 'Error de asignación: El conductor o la ruta ya están ocupados en el horario especificado.' 
      };
    }
  }

  // Calculate total hours for the driver on this date
  const totalHours = driverShifts.reduce((sum, shift) => sum + shift.duration, 0) + duration;

  // Check if total hours exceed 7.5
  if (totalHours > 7.5) {
    return { 
      valid: false, 
      error: 'Límite de jornada excedido: Este turno supera las 7.5 horas de trabajo para el conductor en este día.',
      totalHours 
    };
  }

  return { valid: true, totalHours };
};

// Assign new shift
export const assignShift = async (
  driverId: string,
  routeId: string,
  startDate: string,
  startTime: string
): Promise<{ success: boolean; error?: string; shift?: Turno }> => {
  // TODO: Replace with actual API call
  // const { data, error } = await supabase.from('turnos').insert({...});
  
  const driver = drivers.find(d => d.id === driverId);
  if (!driver) {
    return { success: false, error: 'Conductor no encontrado' };
  }

  if (driver.status === 'inactive') {
    return { success: false, error: 'El conductor seleccionado no se encuentra en estado \'activo\'' };
  }

  const route = routesMock.find(r => r.id === routeId);
  if (!route) {
    return { success: false, error: 'Ruta no encontrada' };
  }

  const validation = await validateShiftAssignment(driverId, routeId, startDate, startTime);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const newShift: Turno = {
    id: `T${String(turnos.length + 1).padStart(3, '0')}`,
    driverId,
    driverName: driver.name,
    driverLicense: driver.license,
    routeId,
    routeName: route.name,
    startDate,
    startTime,
    duration: parseDuration(route.duration),
    status: 'active'
  };

  turnos.push(newShift);

  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, shift: newShift }), 300);
  });
};

// Edit existing shift
export const editShift = async (
  shiftId: string,
  driverId: string,
  routeId: string,
  startDate: string,
  startTime: string
): Promise<{ success: boolean; error?: string; shift?: Turno }> => {
  // TODO: Replace with actual API call
  // const { data, error } = await supabase.from('turnos').update({...}).eq('id', shiftId);

  const driver = drivers.find(d => d.id === driverId);
  if (!driver) {
    return { success: false, error: 'Conductor no encontrado' };
  }

  if (driver.status === 'inactive') {
    return { success: false, error: 'El conductor seleccionado no se encuentra en estado \'activo\'' };
  }

  const route = routesMock.find(r => r.id === routeId);
  if (!route) {
    return { success: false, error: 'Ruta no encontrada' };
  }

  const validation = await validateShiftAssignment(driverId, routeId, startDate, startTime, shiftId);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const shiftIndex = turnos.findIndex(t => t.id === shiftId);
  if (shiftIndex === -1) {
    return { success: false, error: 'Turno no encontrado' };
  }

  const updatedShift: Turno = {
    id: shiftId,
    driverId,
    driverName: driver.name,
    driverLicense: driver.license,
    routeId,
    routeName: route.name,
    startDate,
    startTime,
    duration: parseDuration(route.duration),
    status: 'active'
  };

  turnos[shiftIndex] = updatedShift;

  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, shift: updatedShift }), 300);
  });
};

// Delete shift
export const deleteShift = async (shiftId: string): Promise<{ success: boolean; error?: string }> => {
  // TODO: Replace with actual API call
  // const { error } = await supabase.from('turnos').delete().eq('id', shiftId);

  const shiftIndex = turnos.findIndex(t => t.id === shiftId);
  if (shiftIndex === -1) {
    return { success: false, error: 'Turno no encontrado' };
  }

  turnos = turnos.filter(t => t.id !== shiftId);

  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 300);
  });
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/services/turnosService.ts
};