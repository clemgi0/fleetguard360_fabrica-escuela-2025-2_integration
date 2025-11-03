import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Truck, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { login, verifyCode } from "@/services/authService";
import { setCookie } from "@/utils/cookies";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.username || !formData.password) {
      setError("Por favor ingrese correo y contraseña.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const loginResponse = await login({
        correo: formData.username,
        password: formData.password
      });
      
      // Automáticamente verificamos el código recibido
      const verifyResponse = await verifyCode({
        correo: formData.username,
        codigo: loginResponse.codigo
      });
      
      setCookie(verifyResponse.token);
      setIsLoading(false);
      
      toast({
        title: "Autenticación exitosa",
        description: verifyResponse.mensaje || "Bienvenido a Momentum Fleet",
      });
      
      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout showLogin={false}>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-border bg-card">
          <CardContent className="p-8">
            {/* Logo and Title */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-primary p-4 rounded-xl mb-4">
                <Truck className="h-12 w-12 text-primary-foreground" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-bold text-center text-card-foreground">
                Momentum Fleet
              </h1>
              <p className="text-muted-foreground text-center mt-1">
                Acceso al sistema de gestión
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-card-foreground font-medium">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="username"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10 bg-input border-border"
                    aria-describedby={error ? "login-error" : undefined}
                    aria-invalid={error ? "true" : "false"}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-input border-border"
                    aria-describedby={error ? "login-error" : undefined}
                    aria-invalid={error ? "true" : "false"}
                    autoComplete="current-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                disabled={isLoading}
                aria-describedby={error ? "login-error" : undefined}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              {error && (
                <div 
                  id="login-error"
                  className="text-destructive text-sm text-center bg-red-50 border border-red-200 rounded-md p-3"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}