import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CreateDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDriverCreated?: () => void;
}

export const CreateDriverModal = ({ open, onOpenChange, onDriverCreated }: CreateDriverModalProps) => {
  const [formData, setFormData] = useState({
    cedula: "",
    usuario: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cedula || !formData.usuario || !formData.email || !formData.password) {
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
        title: "Conductor registrado",
        description: `El conductor ${formData.usuario} ha sido registrado exitosamente.`,
      });
      setFormData({ cedula: "", usuario: "", email: "", password: "" });
      onOpenChange(false);
      onDriverCreated?.();
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({ cedula: "", usuario: "", email: "", password: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md" aria-describedby="create-driver-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Registrar conductor
          </DialogTitle>
        </DialogHeader>
        
        <div id="create-driver-description" className="sr-only">
          Formulario para registrar un nuevo conductor en el sistema
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cedula" className="text-foreground font-medium">
              Cédula
            </Label>
            <Input
              id="cedula"
              type="text"
              placeholder="Ingrese la cédula"
              value={formData.cedula}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usuario" className="text-foreground font-medium">
              Usuario
            </Label>
            <Input
              id="usuario"
              type="text"
              placeholder="Ingrese el usuario"
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingrese la contraseña"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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