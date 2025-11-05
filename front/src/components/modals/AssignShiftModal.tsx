import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { assignShift, editShift, getDrivers, getRoutes, type Driver, type Route, type Turno } from '@/services/turnosService';
import { toast } from '@/hooks/use-toast';

interface AssignShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingShift?: Turno;
}

export const AssignShiftModal = ({ open, onOpenChange, onSuccess, editingShift }: AssignShiftModalProps) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadData();
      if (editingShift) {
        setSelectedDriver(editingShift.driverId);
        setSelectedRoute(editingShift.routeId);
        setStartDate(editingShift.startDate);
        setStartTime(editingShift.startTime);
      } else {
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setStartDate(today);
        setStartTime('08:00');
      }
      setError('');
    }
  }, [open, editingShift]);

  const loadData = async () => {
    try {
      const [driversData, routesData] = await Promise.all([
        getDrivers(),
        getRoutes()
      ]);
      setDrivers(driversData);
      setRoutes(routesData);
    } catch (err) {
      console.error('Error loading data:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar la información necesaria'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedDriver || !selectedRoute || !startDate || !startTime) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);

    try {
      const result = editingShift
        ? await editShift(editingShift.id, selectedDriver, selectedRoute, startDate, startTime)
        : await assignShift(selectedDriver, selectedRoute, startDate, startTime);

      if (result.success) {
        toast({
          title: editingShift ? 'Turno actualizado' : 'Turno asignado',
          description: editingShift 
            ? 'El turno ha sido actualizado correctamente'
            : 'El turno ha sido asignado correctamente'
        });
        onSuccess();
        handleClose();
      } else {
        setError(result.error || 'Error al procesar la solicitud');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDriver('');
    setSelectedRoute('');
    setStartDate('');
    setStartTime('');
    setError('');
    onOpenChange(false);
  };

  const selectedDriverData = drivers.find(d => d.id === selectedDriver);
  const isDriverInactive = selectedDriverData?.status === 'inactive';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="assign-shift-description">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-center text-xl font-semibold text-[#111827]">
            {editingShift ? 'Editar turno' : 'Asignar nuevo turno'}
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Completa los campos para {editingShift ? 'actualizar la asignación' : 'crear un nuevo turno'}.
          </p>
        </DialogHeader>

        <p id="assign-shift-description" className="sr-only">
          {editingShift 
            ? 'Formulario para editar un turno existente' 
            : 'Formulario para asignar un nuevo turno a un conductor'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="driver-select" className="text-sm font-medium text-[#111827]">
                Seleccionar conductor
              </Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger
                  id="driver-select"
                  className={`h-12 rounded-xl border ${isDriverInactive ? 'border-destructive ring-1 ring-destructive/40' : 'border-[#E5E7EB]'} bg-[#F9FAFB] px-4 text-left text-sm shadow-inner hover:bg-white focus:ring-2 focus:ring-[#DC2626]`}
                >
                  <SelectValue placeholder="Selecciona un conductor" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} {driver.status === 'inactive' ? '(Inactivo)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isDriverInactive && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  El conductor seleccionado no se encuentra en estado "activo".
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="route-select" className="text-sm font-medium text-[#111827]">
                Seleccionar ruta
              </Label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger
                  id="route-select"
                  className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-left text-sm shadow-inner hover:bg-white focus:ring-2 focus:ring-[#DC2626]"
                >
                  <SelectValue placeholder="Selecciona una ruta" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-medium text-[#111827]">
                Fecha de inicio
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm shadow-inner focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-time" className="text-sm font-medium text-[#111827]">
                Hora de inicio
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm shadow-inner focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="h-11 rounded-full border-[#E5E7EB] px-6 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || isDriverInactive}
              className="h-11 rounded-full bg-[#DC2626] px-6 text-sm font-semibold text-white shadow hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:bg-[#FECACA] disabled:text-[#7F1D1D]"
            >
              {loading ? 'Procesando…' : editingShift ? 'Guardar cambios' : 'Asignar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};