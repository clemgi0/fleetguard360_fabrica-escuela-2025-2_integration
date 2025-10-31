import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Driver {
  id: string;
  username: string;
  email: string;
}

interface EditDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver?: Driver;
  onDriverUpdated?: () => void;
}

export const EditDriverModal = ({ open, onOpenChange, driver, onDriverUpdated }: EditDriverModalProps) => {
  const [formData, setFormData] = useState({
    cedula: "",
    usuario: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (driver) {
      setFormData({
        cedula: driver.id,
        usuario: driver.username,
        email: driver.email,
      });
    }
  }, [driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cedula || !formData.usuario || !formData.email) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Conductor actualizado",
        description: `Los datos del conductor ${formData.usuario} han sido actualizados.`,
      });
      onOpenChange(false);
      onDriverUpdated?.();
    }, 1000);
  };

  const handleCancel = () => {
    if (driver) {
      setFormData({
        cedula: driver.id,
        usuario: driver.username,
        email: driver.email,
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-cedula" className="text-foreground font-medium">
              Cédula
            </Label>
            <Input
              id="edit-cedula"
              type="text"
              value={formData.cedula}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-usuario" className="text-foreground font-medium">
              Usuario
            </Label>
            <Input
              id="edit-usuario"
              type="text"
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-foreground font-medium">
              Correo electrónico
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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-border text-foreground hover:bg-muted"
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