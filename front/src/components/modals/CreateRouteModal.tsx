import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CreateRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteCreated?: () => void;
}

export const CreateRouteModal = ({ open, onOpenChange, onRouteCreated }: CreateRouteModalProps) => {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.nombre) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete código y nombre de la ruta.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Ruta creada",
        description: `La ruta ${formData.codigo} - ${formData.nombre} ha sido creada exitosamente.`,
      });
      setFormData({ codigo: "", nombre: "", descripcion: "" });
      onOpenChange(false);
      onRouteCreated?.();
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({ codigo: "", nombre: "", descripcion: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md" aria-describedby="create-route-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Crear nueva ruta
          </DialogTitle>
        </DialogHeader>
        
        <div id="create-route-description" className="sr-only">
          Formulario para crear una nueva ruta de transporte
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="route-codigo" className="text-foreground font-medium">
              Código de ruta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="route-codigo"
              type="text"
              placeholder="Ej: R006"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="route-nombre" className="text-foreground font-medium">
              Nombre de la ruta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="route-nombre"
              type="text"
              placeholder="Ej: Ruta Metropolitana"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="route-descripcion" className="text-foreground font-medium">
              Descripción
            </Label>
            <Textarea
              id="route-descripcion"
              placeholder="Descripción de la ruta (opcional)"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="bg-input border-border min-h-[80px] resize-none"
              rows={3}
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
              {isLoading ? "Creando..." : "Crear Ruta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};