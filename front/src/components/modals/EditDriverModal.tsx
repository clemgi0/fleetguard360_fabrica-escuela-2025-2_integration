import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getAuthData } from "@/services/api";

const API_BASE_URL = "https://fabricaescuela-2025-2.onrender.com/api";

interface Driver {
  id: number;
  nombreCompleto: string;
  licencia: string;
  telefono: string;
  usuario: {
    id: number;
    correo: string;
    password: string;
    rol: string;
  };
}

interface EditDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver?: Driver;
  onDriverUpdated?: () => void;
}

export const EditDriverModal = ({ open, onOpenChange, driver, onDriverUpdated }: EditDriverModalProps) => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    telefono: "",
    licencia: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (driver) {
      setFormData({
        nombreCompleto: driver.nombreCompleto || "",
        email: driver.usuario?.correo || "",
        telefono: driver.telefono || "",
        licencia: driver.licencia || "",
      });
    }
  }, [driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!driver) return;

    if (!formData.nombreCompleto || !formData.email) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete: nombre y correo electrónico.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const authData = getAuthData();
      const token = authData.token;

      const response = await fetch(`${API_BASE_URL}/conductores/${driver.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          nombreCompleto: formData.nombreCompleto,
          licencia: formData.licencia || "",
          telefono: formData.telefono || "",
          usuario: {
            id: driver.usuario.id,
            correo: formData.email,
            password: driver.usuario.password,
            rol: driver.usuario.rol
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.message || "Error al actualizar el conductor");
      }

      toast({
        title: "Conductor actualizado",
        description: `Los datos de ${formData.nombreCompleto} han sido actualizados.`,
      });

      onOpenChange(false);
      onDriverUpdated?.(); // Recargar lista

    } catch (error: any) {
      console.error('Error actualizando conductor:', error);
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar el conductor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (driver) {
      setFormData({
        nombreCompleto: driver.nombreCompleto || "",
        email: driver.usuario?.correo || "",
        telefono: driver.telefono || "",
        licencia: driver.licencia || "",
      });
    }
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-md" aria-describedby="edit-driver-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Editar conductor
            </DialogTitle>
          </DialogHeader>

          <div id="edit-driver-description" className="sr-only">
            Formulario para editar la información del conductor
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="edit-nombreCompleto" className="text-foreground font-medium">
                Nombre Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="edit-nombreCompleto"
                  type="text"
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-foreground font-medium">
                Correo electrónico <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-telefono" className="text-foreground font-medium">
                Teléfono
              </Label>
              <Input
                  id="edit-telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-licencia" className="text-foreground font-medium">
                Licencia de conducir
              </Label>
              <Input
                  id="edit-licencia"
                  type="text"
                  value={formData.licencia}
                  onChange={(e) => setFormData({ ...formData, licencia: e.target.value })}
                  className="bg-input border-border"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-border text-foreground hover:bg-muted"
                  disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
};