import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Route, Users, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getConductores } from "@/services/driverService";
import { getRutas } from "@/services/routeService";

export default function Dashboard() {
  const [activeRoutes, setActiveRoutes] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [rutas, conductores] = await Promise.all([
        getRutas(),
        getConductores()
      ]);
      
      setActiveRoutes(rutas.length);
      setTotalDrivers(conductores.length);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setIsLoading(false);
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
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">{activeRoutes}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rutas en operación
                  </p>
                </>
              )}
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
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">{totalDrivers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Conductores registrados
                  </p>
                </>
              )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Link to="/routes/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Ruta
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
                  <Link to="/drivers/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Conductor
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