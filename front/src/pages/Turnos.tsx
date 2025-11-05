import { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AssignShiftModal } from "@/components/modals/AssignShiftModal";
import { getTurnos, deleteShift, type Turno } from "@/services/turnosService";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Plus, Search } from "lucide-react";

export default function Turnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [filteredTurnos, setFilteredTurnos] = useState<Turno[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Turno | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTurnos();
  }, []);

  const filterTurnos = useCallback((term: string, source: Turno[]) => {
    if (!term.trim()) return source;
    const normalized = term.trim().toLowerCase();
    return source.filter((turno) =>
      turno.driverName.toLowerCase().includes(normalized) ||
      turno.driverLicense.includes(normalized) ||
      turno.routeName.toLowerCase().includes(normalized)
    );
  }, []);

  useEffect(() => {
    setFilteredTurnos(filterTurnos(searchTerm, turnos));
  }, [filterTurnos, searchTerm, turnos]);

  const loadTurnos = async () => {
    try {
      setLoading(true);
      const data = await getTurnos();
      setTurnos(data);
      setFilteredTurnos(data);
    } catch (error) {
      console.error('Error loading turnos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los turnos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (turno: Turno) => {
    try {
      const result = await deleteShift(turno.id);
      if (result.success) {
        toast({
          title: 'Turno eliminado',
          description: 'El turno ha sido eliminado correctamente'
        });
        loadTurnos();
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

  const handleEdit = (turno: Turno) => {
    setEditingShift(turno);
    setShowAssignModal(true);
  };

  const handleAssignSuccess = () => {
    loadTurnos();
    setEditingShift(undefined);
  };

  const handleModalClose = (open: boolean) => {
    setShowAssignModal(open);
    if (!open) {
      setEditingShift(undefined);
    }
  };

  const formatDateLabel = useCallback((date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  const getEndTimeLabel = useCallback((startTime: string, duration: number) => {
    const [hour, minute] = startTime.split(":").map(Number);
    if (Number.isNaN(hour)) return "--:--";
    const totalMinutes = hour * 60 + minute + Math.round(duration * 60);
    const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
    const endHour = Math.floor(normalized / 60);
    const endMinute = normalized % 60;
    return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
  }, []);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilteredTurnos(filterTurnos(searchTerm, turnos));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Layout showLogin={false}>
      <div className="space-y-8 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Gestión de turnos</h1>
          <p className="text-sm text-muted-foreground">
            Controla asignaciones, horarios y disponibilidad de conductores en tiempo real.
          </p>
        </header>

        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-[#E5E7EB] bg-white/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative w-full sm:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar turnos por conductor, ruta o cédula..."
              aria-label="Buscar turnos"
              className="h-12 w-full rounded-full border-[#E5E7EB] bg-[#F9FAFB] pl-11 text-sm shadow-inner focus-visible:ring-1 focus-visible:ring-[#DC2626]"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={handleClearSearch}
              variant="outline"
              className="rounded-full border-[#E5E7EB] px-5 text-sm font-medium text-muted-foreground hover:bg-[#F3F4F6]"
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-[#DC2626] px-6 text-sm font-semibold text-white shadow hover:bg-[#B91C1C]"
            >
              Buscar
            </Button>
            <Button
              type="button"
              onClick={() => setShowAssignModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#DC2626] px-6 text-sm font-semibold text-white shadow-lg shadow-[#DC2626]/30 hover:bg-[#B91C1C]"
            >
              <Plus className="h-4 w-4" />
              Asignar turno
            </Button>
          </div>
        </form>

        <section className="rounded-3xl border border-[#E5E7EB] bg-white shadow-sm">
          {loading ? (
            <div className="space-y-3 p-8">
              <div className="h-4 w-40 rounded-full bg-[#F3F4F6]" />
              <div className="space-y-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-14 w-full rounded-2xl bg-[#F9FAFB]" />
                ))}
              </div>
            </div>
          ) : filteredTurnos.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center text-muted-foreground">
              <span className="text-lg font-semibold text-foreground">No se encontraron turnos.</span>
              <p className="max-w-md text-sm">
                {searchTerm
                  ? 'Ajusta los filtros de búsqueda o intenta con otro término.'
                  : 'Aún no has programado turnos. Asigna el primero para comenzar.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#F9FAFB]">
                <TableRow className="border-0">
                  <TableHead className="py-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Cédula</TableHead>
                  <TableHead className="py-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Conductor</TableHead>
                  <TableHead className="py-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Ruta</TableHead>
                  <TableHead className="py-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Fecha</TableHead>
                  <TableHead className="py-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Hora inicio</TableHead>
                  <TableHead className="py-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Hora fin</TableHead>
                  <TableHead className="py-5 text-right text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTurnos.map((turno) => (
                  <TableRow
                    key={turno.id}
                    className="border-0 bg-white odd:bg-white even:bg-[#FDFDFE] hover:bg-[#F3F4F6]"
                  >
                    <TableCell className="text-sm font-semibold text-[#111827]">{turno.driverLicense}</TableCell>
                    <TableCell className="text-sm text-[#1F2937]">{turno.driverName}</TableCell>
                    <TableCell className="text-sm text-[#1F2937]">{turno.routeName}</TableCell>
                    <TableCell className="text-sm text-[#1F2937]">{formatDateLabel(turno.startDate)}</TableCell>
                    <TableCell className="text-sm text-[#1F2937]">{turno.startTime}</TableCell>
                    <TableCell className="text-sm text-[#1F2937]">
                      {getEndTimeLabel(turno.startTime, turno.duration)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(turno)}
                          aria-label={`Editar turno de ${turno.driverName}`}
                          className="rounded-lg border-[#E5E7EB] bg-[#F3F4F6] px-4 text-xs font-semibold text-[#374151] hover:bg-[#E5E7EB]"
                        >
                          Editar
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              aria-label={`Eliminar turno de ${turno.driverName}`}
                              className="rounded-lg bg-[#DC2626] px-4 text-xs font-semibold text-white hover:bg-[#B91C1C]"
                            >
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-md rounded-3xl">
                            <AlertDialogHeader className="space-y-3">
                              <div className="flex justify-center">
                                <div className="rounded-full bg-[#FEE2E2] p-3">
                                  <AlertTriangle className="h-5 w-5 text-[#DC2626]" />
                                </div>
                              </div>
                              <AlertDialogTitle className="text-center text-lg font-semibold text-[#111827]">
                                Eliminar turno
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-center text-sm text-[#4B5563]">
                                ¿Deseas eliminar el turno asignado a <span className="font-semibold">{turno.driverName}</span> para la ruta <span className="font-semibold">{turno.routeName}</span>?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="sm:justify-center sm:space-x-3">
                              <AlertDialogCancel className="rounded-full border-[#E5E7EB] px-6 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6]">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(turno)}
                                className="rounded-full bg-[#DC2626] px-6 text-sm font-semibold text-white hover:bg-[#B91C1C]"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>

        <AssignShiftModal
          open={showAssignModal}
          onOpenChange={handleModalClose}
          onSuccess={handleAssignSuccess}
          editingShift={editingShift}
        />
      </div>
    </Layout>
  );
}