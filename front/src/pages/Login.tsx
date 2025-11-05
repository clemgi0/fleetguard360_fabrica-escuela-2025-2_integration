import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Truck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { saveAuth } from "@/services/api";

const API_BASE_URL = "https://fabricaescuela-2025-2.onrender.com/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    correo: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    correo: false,
    password: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ correo: false, password: false });

    // Validación: campos vacíos
    if (!formData.correo || !formData.password) {
      setError("Se debe ingresar correo y contraseña.");
      setFieldErrors({
        correo: !formData.correo,
        password: !formData.password
      });
      return;
    }

    setIsLoading(true);

    try {
      // Paso 1: Llamar al endpoint de login para obtener el código de verificación
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: formData.correo,
          password: formData.password
        })
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.message || "Error al iniciar sesión");
      }

      const loginData = await loginResponse.json() as {
        mensaje: string;
        codigo: string;
      };

      // Mostrar mensaje de que se envió el código
      toast({
        title: "Código de verificación enviado",
        description: loginData.mensaje || "Verificando código automáticamente...",
      });

      setIsLoading(false);
      setIsVerifying(true);

      // Paso 2: Automáticamente verificar el código recibido
      const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: formData.correo,
          codigo: loginData.codigo
        })
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.message || "Error al verificar el código");
      }

      const verifyData = await verifyResponse.json() as {
        token: string;
        correo: string;
        rol: string;
        mensaje: string;
      };

      // Guardar autenticación
      saveAuth(verifyData.token, verifyData.correo, verifyData.rol);

      toast({
        title: "Sesión iniciada exitosamente",
        description: verifyData.mensaje || "Bienvenido a Momentum Fleet",
      });

      // Redirigir según el rol
      if (verifyData.rol === 'ADMIN' || verifyData.rol === 'ADMINISTRADOR') {
        navigate("/dashboard");
      } else if (verifyData.rol === 'CONDUCTOR') {
        navigate("/driver-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error: any) {
      console.error('Error de login:', error);
      setError(error.message || "Error al iniciar sesión. Verifique sus credenciales.");
      setFieldErrors({ correo: true, password: true });
      setIsLoading(false);
      setIsVerifying(false);
    }
  };

  return (
      <Layout showLogin={false} showHeader={false}>
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
                  <Label htmlFor="correo" className="text-card-foreground font-medium">
                    Correo Electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                        id="correo"
                        type="email"
                        placeholder="usuario@ejemplo.com"
                        value={formData.correo}
                        onChange={(e) => {
                          setFormData({ ...formData, correo: e.target.value });
                          setFieldErrors({ ...fieldErrors, correo: false });
                          setError("");
                        }}
                        className={`pl-10 bg-input ${fieldErrors.correo ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
                        aria-describedby={error ? "login-error" : undefined}
                        aria-invalid={fieldErrors.correo ? "true" : "false"}
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
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          setFieldErrors({ ...fieldErrors, password: false });
                          setError("");
                        }}
                        className={`pl-10 pr-10 bg-input ${fieldErrors.password ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
                        aria-describedby={error ? "login-error" : undefined}
                        aria-invalid={fieldErrors.password ? "true" : "false"}
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
                    disabled={isLoading || isVerifying}
                    aria-describedby={error ? "login-error" : undefined}
                >
                  {isVerifying 
                    ? "Verificando código..." 
                    : isLoading 
                    ? "Iniciando sesión..." 
                    : "Iniciar Sesión"}
                </Button>

                {error && (
                    <div
                        id="login-error"
                        className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/30 rounded-md p-3"
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