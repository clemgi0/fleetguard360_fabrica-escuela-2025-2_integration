import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CreateDriverModal } from "@/components/modals/CreateDriverModal";
import { EditDriverModal } from "@/components/modals/EditDriverModal";
import { Search, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const drivers = [
  { id: "12345678", username: "john.martinez", email: "john.martinez@email.com" },
  { id: "87654321", username: "sofia.chen", email: "sofia.chen@email.com" },
  { id: "11223344", username: "maria.rodriguez", email: "maria.rodriguez@email.com" },
  { id: "55667788", username: "carlos.lopez", email: "carlos.lopez@email.com" },
  { id: "99887766", username: "ana.gutierrez", email: "ana.gutierrez@email.com" },
];

export default function Drivers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<typeof drivers[0] | undefined>();
  const { toast } = useToast();

  const filteredDrivers = drivers.filter(driver =>
    driver.id.includes(searchTerm) ||
    driver.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (driver: typeof drivers[0]) => {
    setSelectedDriver(driver);
    setEditModalOpen(true);
  };

  const handleDelete = (driverId: string, username: string) => {
    toast({
      title: "Conductor eliminado",
      description: `El conductor ${username} ha sido eliminado del sistema.`,
      variant: "destructive",
    });
  };

  return (
    <Layout showLogin={false}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestión de conductores
          </h1>
          <p className="text-muted-foreground">
            Administra la información de conductores registrados en el sistema.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Buscar conductor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input"
              aria-label="Buscar conductores por cédula, usuario o correo"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="bg-primary hover:bg-primary-hover"
              aria-label="Buscar conductores"
            >
              Buscar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary-hover"
              onClick={() => setCreateModalOpen(true)}
              aria-label="Registrar nuevo conductor"
            >
              <Plus className="h-4 w-4 mr-2" />
              Registrar conductor
            </Button>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-foreground">CÉDULA</TableHead>
                <TableHead className="font-semibold text-foreground">USUARIO</TableHead>
                <TableHead className="font-semibold text-foreground">CORREO</TableHead>
                <TableHead className="font-semibold text-foreground text-right">ACCIONES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No se encontraron conductores que coincidan con tu búsqueda." : "No hay conductores registrados."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDrivers.map((driver) => (
                  <TableRow key={driver.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium text-foreground">{driver.id}</TableCell>
                    <TableCell className="text-foreground">{driver.username}</TableCell>
                    <TableCell className="text-foreground">{driver.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-foreground hover:bg-muted"
                          onClick={() => handleEdit(driver)}
                          aria-label={`Editar conductor ${driver.username}`}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              aria-label={`Eliminar conductor ${driver.username}`}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="bg-red-100 p-2 rounded-full">
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                                </div>
                                <AlertDialogTitle className="text-lg font-semibold text-foreground">
                                  Eliminar Conductor
                                </AlertDialogTitle>
                              </div>
                              <AlertDialogDescription className="text-muted-foreground">
                                ¿Desea eliminar el conductor {driver.username}?
                                <br />
                                <span className="text-destructive font-medium">
                                  Esta acción no se puede deshacer.
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(driver.id, driver.username)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredDrivers.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredDrivers.length} de {drivers.length} conductores
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateDriverModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen}
        onDriverCreated={() => {
          // Refresh driver list here if needed
        }}
      />
      
      <EditDriverModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen}
        driver={selectedDriver}
        onDriverUpdated={() => {
          // Refresh driver list here if needed
        }}
      />
    </Layout>
  );
}