<<<<<<< HEAD:frontend/src/pages/TurnosCalendar.tsx
// frontend/src/pages/TurnosCalendar.tsx
// Vista de calendario para turnos (mock básico - pendiente implementación completa)

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { obtenerTurnos, formatearDiaSemana, type Turno } from '@/services/turnosService';
import { obtenerAsignaciones, type AsignacionTurno } from '@/services/asignacionesService';
import { toast } from '@/hooks/use-toast';

export default function TurnosCalendar() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionTurno[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [turnosData, asignacionesData] = await Promise.all([
        obtenerTurnos(),
        obtenerAsignaciones()
      ]);

      // Filtrar por semana actual
      const turnosFiltrados = turnosData.filter(t => t.numeroSemana === currentWeek);
      setTurnos(turnosFiltrados);
      setAsignaciones(asignacionesData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        variant: 'destructive',
        title: 'Error al cargar datos',
        description: error.message || 'No se pudieron cargar los turnos'
=======
import { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/button';
import { Calendar, momentLocalizer, View, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getTurnos, type Turno } from '@/services/turnosService';
import { AssignShiftModal } from '@/components/modals/AssignShiftModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, User, Route, Calendar as CalendarIcon, AlertTriangle, Table } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { deleteShift } from '@/services/turnosService';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

// Definir el tipo de evento del calendario
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Turno;
}

export default function TurnosCalendar() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState<Turno | undefined>();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [turnoToDelete, setTurnoToDelete] = useState<Turno | null>(null);
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    loadTurnos();
  }, []);

  const loadTurnos = async () => {
    try {
      setLoading(true);
      const data = await getTurnos();
      setTurnos(data);
    } catch (error) {
      console.error('Error loading turnos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los turnos'
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/TurnosCalendar.tsx
      });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD:frontend/src/pages/TurnosCalendar.tsx
  const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  const obtenerTurnosPorDia = (dia: string) => {
    return turnos.filter(t => t.diaSemana === dia);
  };

  const obtenerAsignacionPorTurno = (turnoId: number) => {
    return asignaciones.find(a => a.turno.id === turnoId);
  };

  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < 52) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  return (
      <Layout showLogin={false}>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <BackButton to="/dashboard" label="Volver al Dashboard" />
              <h1 className="text-3xl font-bold text-foreground">
                Calendario de Turnos
              </h1>
            </div>
            <p className="text-muted-foreground">
              Vista semanal de turnos y asignaciones de conductores.
            </p>
          </div>

          {/* Week Navigation */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousWeek}
                    disabled={currentWeek === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>

                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Semana {currentWeek}
                </CardTitle>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextWeek}
                    disabled={currentWeek === 52}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Calendar Grid */}
          {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Cargando calendario...
              </div>
          ) : turnos.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Calendar className="h-12 w-12 mb-2" />
                    <p className="font-medium">No hay turnos para la semana {currentWeek}</p>
                    <p className="text-sm">
                      Crea plantillas de turnos desde la vista de gestión
                    </p>
                  </div>
                </CardContent>
              </Card>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {diasSemana.map((dia) => {
                  const turnosDia = obtenerTurnosPorDia(dia);

                  return (
                      <Card key={dia} className="border-border">
                        <CardHeader className="pb-3 bg-muted/30">
                          <CardTitle className="text-sm font-semibold text-center">
                            {formatearDiaSemana(dia)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-4">
                          {turnosDia.length === 0 ? (
                              <p className="text-xs text-muted-foreground text-center py-4">
                                Sin turnos
                              </p>
                          ) : (
                              turnosDia.map((turno) => {
                                const asignacion = obtenerAsignacionPorTurno(turno.id);

                                return (
                                    <div
                                        key={turno.id}
                                        className="p-3 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                                    >
                                      {/* Ruta */}
                                      <div className="flex items-start gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold text-foreground truncate">
                                            {turno.ruta.nombre}
                                          </p>
                                          <p className="text-xs text-muted-foreground truncate">
                                            {turno.ruta.origen} → {turno.ruta.destino}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Horario */}
                                      <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">
                                          {turno.horaInicio} - {turno.horaFin}
                                        </p>
                                      </div>

                                      {/* Conductor asignado */}
                                      {asignacion ? (
                                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                                            <User className="h-3 w-3 text-green-600" />
                                            <p className="text-xs font-medium text-green-700 truncate">
                                              {asignacion.conductor.nombre} {asignacion.conductor.apellido}
                                            </p>
                                          </div>
                                      ) : (
                                          <Badge variant="outline" className="mt-2 text-xs">
                                            Sin asignar
                                          </Badge>
                                      )}
                                    </div>
                                );
                              })
                          )}
                        </CardContent>
                      </Card>
                  );
                })}
              </div>
          )}

          {/* Info Footer */}
          <Card className="border-border bg-blue-50">
            <CardContent className="py-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Nota:</strong> Esta es una vista de solo lectura. Para crear turnos o asignar conductores,
                usa las opciones desde el Dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
  );
}
=======
  // Convertir turnos a eventos del calendario
  const events: CalendarEvent[] = useMemo(() => {
    return turnos.map(turno => {
      const [hours, minutes] = turno.startTime.split(':').map(Number);
      const startDate = new Date(turno.startDate);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + Math.floor(turno.duration));
      endDate.setMinutes(startDate.getMinutes() + ((turno.duration % 1) * 60));

      return {
        id: turno.id,
        title: `${turno.driverName} - ${turno.routeName}`,
        start: startDate,
        end: endDate,
        resource: turno
      };
    });
  }, [turnos]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedTurno(event.resource);
    setShowDetailsModal(true);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Abrir modal para crear nuevo turno en la fecha seleccionada
    setSelectedTurno(undefined);
    setShowAssignModal(true);
  };

  const handleEdit = () => {
    setShowDetailsModal(false);
    setShowAssignModal(true);
  };

  const handleDeleteClick = () => {
    if (selectedTurno) {
      setTurnoToDelete(selectedTurno);
      setShowDetailsModal(false);
      setShowDeleteDialog(true);
    }
  };

  const handleDelete = async () => {
    if (!turnoToDelete) return;

    try {
      const result = await deleteShift(turnoToDelete.id);
      if (result.success) {
        toast({
          title: 'Turno eliminado',
          description: 'El turno ha sido eliminado correctamente'
        });
        loadTurnos();
        setShowDeleteDialog(false);
        setTurnoToDelete(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'No se pudo eliminar el turno'
        });
      }
    } catch (error) {
      console.error('Error deleting turno:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el turno'
      });
    }
  };

  const handleAssignSuccess = () => {
    loadTurnos();
    setSelectedTurno(undefined);
  };

  const handleModalClose = (open: boolean) => {
    setShowAssignModal(open);
    if (!open) {
      setSelectedTurno(undefined);
    }
  };

  // Personalizar mensajes en español
  const messages = {
    today: 'Hoy',
    previous: 'Anterior',
    next: 'Siguiente',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Turno',
    noEventsInRange: 'No hay turnos en este rango.',
    showMore: (total: number) => `+ Ver más (${total})`
  };

  // Estilos personalizados para los eventos
  const eventStyleGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor: 'hsl(var(--primary))',
      borderRadius: '6px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '0.875rem',
      padding: '4px 8px'
    };
    return { style };
  };

  return (
    <Layout showLogin={false}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-4 mb-2">
            <BackButton to="/dashboard" label="Volver al Dashboard" />
            <h1 className="text-3xl font-bold text-foreground">
              Gestión de Turnos
            </h1>
          </div>
          <p className="text-muted-foreground">
            Visualiza y gestiona los turnos de conductores en un calendario interactivo.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            asChild
            variant="outline"
            className="gap-2"
          >
            <Link to="/turnos/table">
              <Table className="h-4 w-4" aria-hidden="true" />
              Ver como Tabla
            </Link>
          </Button>
          <Button
            onClick={() => {
              setSelectedTurno(undefined);
              setShowAssignModal(true);
            }}
            className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Asignar Turno
          </Button>
        </div>

        {/* Calendar */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm" style={{ height: '700px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Cargando turnos...</p>
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              messages={messages}
              eventPropGetter={eventStyleGetter}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              views={['month', 'week', 'day', 'agenda']}
              step={30}
              showMultiDayTimes
              culture="es"
            />
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedTurno && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Detalles del Turno
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Driver Info */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <User className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Conductor</p>
                  <p className="font-semibold text-foreground">{selectedTurno.driverName}</p>
                  <p className="text-sm text-muted-foreground">Cédula: {selectedTurno.driverLicense}</p>
                </div>
              </div>

              {/* Route Info */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Route className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Ruta</p>
                  <p className="font-semibold text-foreground">{selectedTurno.routeName}</p>
                </div>
              </div>

              {/* Time Info */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-semibold text-foreground">{selectedTurno.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-semibold text-foreground">{selectedTurno.startTime}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Duración</p>
                    <p className="font-semibold text-foreground">{selectedTurno.duration} horas</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Estado:</p>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  {selectedTurno.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Cerrar
              </Button>
              <Button
                variant="secondary"
                onClick={handleEdit}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-destructive/10 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Eliminar Turno
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {turnoToDelete && (
                <>
                  ¿Desea eliminar el turno asignado al conductor{' '}
                  <span className="font-semibold">{turnoToDelete.driverName}</span> para la ruta{' '}
                  <span className="font-semibold">{turnoToDelete.routeName}</span>?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign/Edit Modal */}
      <AssignShiftModal
        open={showAssignModal}
        onOpenChange={handleModalClose}
        onSuccess={handleAssignSuccess}
        editingShift={selectedTurno}
      />
    </Layout>
  );
}
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/TurnosCalendar.tsx
