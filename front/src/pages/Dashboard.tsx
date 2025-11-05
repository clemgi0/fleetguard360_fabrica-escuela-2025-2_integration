import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Route, Users, Clock, Bell } from "lucide-react";
import { getAuthData } from "@/services/api";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://fabricaescuela-2025-2.onrender.com/api";

export default function Dashboard() {
  const [rutasActivas, setRutasActivas] = useState<number>(0);
  const [conductores, setConductores] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const authData = getAuthData();
      const token = authData.token;

      // Cargar rutas
      const rutasResponse = await fetch(`${API_BASE_URL}/rutas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (rutasResponse.ok) {
        const rutasData = await rutasResponse.json();
        setRutasActivas(Array.isArray(rutasData) ? rutasData.length : 0);
      }

      // Cargar conductores
      const conductoresResponse = await fetch(`${API_BASE_URL}/conductores`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (conductoresResponse.ok) {
        const conductoresData = await conductoresResponse.json();
        setConductores(Array.isArray(conductoresData) ? conductoresData.length : 0);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout showLogin={false}>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            Panel de Control
          </h1>
          <p className="text-muted-foreground">
            Gestiona rutas, conductores y operaciones de transporte de manera eficiente.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Route className="h-4 w-4" aria-hidden="true" />
                Rutas Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? "..." : rutasActivas}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Rutas en operación
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" aria-hidden="true" />
                Conductores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? "..." : conductores}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Conductores registrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Viajes Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">34</div>
              <p className="text-xs text-muted-foreground mt-1">
                Viajes completados
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Eficiencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Puntualidad promedio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-primary" aria-hidden="true" />
                Gestión de Rutas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Administra las rutas de transporte, horarios y paradas del sistema.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="bg-primary hover:bg-primary-hover">
                  <Link to="/routes">
                    <Route className="h-4 w-4 mr-2" />
                    Ver Rutas
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/routes">
                    <Plus className="h-4 w-4 mr-2" />
                    + Nueva Ruta
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                Gestión de Conductores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Administra la información de conductores, licencias y asignaciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="bg-primary hover:bg-primary-hover">
                  <Link to="/drivers">
                    <Users className="h-4 w-4 mr-2" />
                    Ver Conductores
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/drivers">
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Conductor
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                Gestión de Turnos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Asigna y gestiona los turnos de trabajo de conductores en rutas.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="bg-primary hover:bg-primary-hover">
                  <Link to="/turnos">
                    <Clock className="h-4 w-4 mr-2" />
                    Ver Turnos
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/turnos">
                    <Plus className="h-4 w-4 mr-2" />
                    + Asignar Turno
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
                Notificaciones de Jornada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Consulta y gestiona las alertas configuradas para los conductores en tiempo real.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="flex-1 min-w-0 bg-primary hover:bg-primary-hover">
                  <Link to="/driver-notifications" className="flex items-center gap-2 truncate">
                    <Bell className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Ver Notificaciones</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 min-w-0">
                  <Link to="/driver-dashboard" className="flex items-center gap-2 truncate">
                    <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Ir al Panel de Conductor</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}