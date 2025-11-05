import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useJourney } from "@/hooks/useJourney";
import { journeyService } from "@/services/mockJourneyService";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Flag,
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from "lucide-react";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  completed: {
    label: "Completada",
    className: "bg-[#E8F9F0] text-[#047857] border border-[#10B981]/30",
  },
  "in-progress": {
    label: "En Progreso",
    className: "bg-[#FEF3C7] text-[#B45309] border border-[#FBBF24]/40",
  },
  scheduled: {
    label: "Programada",
    className: "bg-[#DBEAFE] text-[#1D4ED8] border border-[#60A5FA]/30",
  },
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  completed: CheckCircle2,
  "in-progress": AlertTriangle,
  scheduled: Calendar,
};

const Metric = ({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description?: string;
}) => (
  <div className="rounded-2xl bg-white/60 px-4 py-3 shadow-sm ring-1 ring-black/5">
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/90">{label}</p>
    <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    {description && (
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    )}
  </div>
);

export default function DriverDashboard() {
  const { journey, routes, loading } = useJourney();
  const navigate = useNavigate();
  const [driverInfo, setDriverInfo] = useState<{ name: string; license: string } | null>(null);

  useEffect(() => {
    journeyService.getDriverInfo().then((info) => {
      setDriverInfo({ name: info.name, license: info.license });
    });
  }, []);

  useEffect(() => {
    if (journey && !journey.isActive) {
      navigate("/driver-notifications");
    }
  }, [journey, navigate]);

  const totalMinutes = useMemo(
    () => (journey ? journey.totalHours * 60 : 0),
    [journey]
  );

  const workedMinutes = useMemo(
    () =>
      journey ? journey.workedHours * 60 + journey.workedMinutes : 0,
    [journey]
  );

  const progress = totalMinutes ? (workedMinutes / totalMinutes) * 100 : 0;

  const remainingMinutes = useMemo(
    () => Math.max(totalMinutes - workedMinutes, 0),
    [totalMinutes, workedMinutes]
  );

  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;

  const formattedDate = useMemo(
    () =>
      journey
        ? new Date(journey.date).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
    [journey]
  );

  if (loading || !journey || !driverInfo) {
    return (
      <Layout showLogin={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </Layout>
    );
  }

  const getRouteStatusBadge = (status: string) => {
    const style = STATUS_STYLES[status] || STATUS_STYLES.scheduled;
    const Icon = STATUS_ICONS[status] || STATUS_ICONS.scheduled;
    return (
      <Badge className={`gap-2 px-3 py-1 text-xs font-semibold ${style.className}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        {style.label}
      </Badge>
    );
  };

  const formatHour = (time: string) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));
    return date.toLocaleTimeString("es-ES", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Layout showLogin={false}>
      <div className="space-y-8 pb-12">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
              <h1 className="text-3xl font-bold text-foreground">Dashboard Conductor</h1>
              <p className="text-muted-foreground">
                {driverInfo.name} — Conductor {driverInfo.license}
              </p>
            </div>
            <Badge className="rounded-full bg-[#DBEAFE] px-4 py-2 text-[#1D4ED8]">
              <Navigation className="mr-2 h-4 w-4" /> En servicio
            </Badge>
          </div>
        </header>

        <Card className="border-none bg-gradient-to-br from-white via-white to-[#F1F5FF] shadow-xl ring-1 ring-black/5">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Jornada laboral de hoy</p>
                    <h2 className="text-2xl font-bold text-foreground">{formattedDate}</h2>
                  </div>
                  <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    {progress.toFixed(0)}% completado
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric
                    label="Hora de inicio"
                    value={formatHour(journey.startTime)}
                    description="Inicio de jornada"
                  />
                  <Metric
                    label="Hora proyectada de finalización"
                    value={formatHour(journey.estimatedEndTime)}
                    description="Objetivo para finalizar"
                  />
                  <Metric
                    label="Estado actual"
                    value="En servicio"
                    description={`${journey.workedHours}h ${journey.workedMinutes}m trabajados`}
                  />
                  <Metric
                    label="Tiempo restante"
                    value={`${remainingHours}h ${remainingMins}m`}
                    description={`${journey.totalHours}h totales`}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    <span>Progreso de la jornada</span>
                    <span>
                      {journey.workedHours}h {journey.workedMinutes}m / {journey.totalHours}h
                    </span>
                  </div>
                  <Progress value={progress} className="h-3 overflow-hidden rounded-full bg-[#E0E7FF]">
                    <div
                      className="h-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#9333EA]"
                      style={{ width: `${progress}%` }}
                    />
                  </Progress>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-[#2563EB]" />
                    <span>Última actualización hace 2 minutos</span>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#E0E7FF] bg-white/70 p-5 shadow-sm lg:w-72">
                <div className="flex items-center gap-3">
                  <Flag className="h-5 w-5 text-[#2563EB]" />
                  <p className="text-sm font-semibold text-foreground">Metas del día</p>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#2563EB]" />
                    Concluir rutas asignadas antes de las 20:00 h.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#F97316]" />
                    Reportar novedades al finalizar cada ruta.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#10B981]" />
                    Mantener un mínimo de 95% en puntualidad.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Rutas asignadas para hoy</h2>
            <p className="text-sm text-muted-foreground">
              Mantente al día con tus rutas programadas y su estado actual.
            </p>
          </div>

          <div className="space-y-4">
            {routes.map((route) => (
              <div
                key={route.id}
                className="rounded-3xl border border-transparent bg-white/70 p-6 shadow-lg shadow-[#1D4ED8]/5 ring-1 ring-black/5 transition hover:shadow-xl"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm uppercase tracking-wide text-muted-foreground/80">
                      {route.id}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground">
                      {route.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <MapPin className="mr-2 inline-block h-4 w-4 text-[#2563EB]" />
                      {route.origin} → {route.destination}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {getRouteStatusBadge(route.status)}
                    <div className="rounded-full bg-[#E0E7FF] px-3 py-1 text-xs font-medium text-[#1D4ED8]">
                      {route.distance}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 shadow-sm">
                    <Clock className="h-4 w-4 text-[#2563EB]" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/70">Inicio</p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatHour(route.startTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 shadow-sm">
                    <Clock className="h-4 w-4 text-[#F59E0B]" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/70">Finalización</p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatHour(route.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 shadow-sm">
                    <CalendarDays className="h-4 w-4 text-[#9333EA]" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/70">Duración estimada</p>
                      <p className="text-sm font-semibold text-foreground">{route.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#10B981]" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/70">Pasajeros</p>
                      <p className="text-sm font-semibold text-foreground">{route.passengers}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
