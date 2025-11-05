import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useJourney } from "@/hooks/useJourney";
import { AlertCircle, AlertTriangle, Bell, Clock, Mail, PhoneCall } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type OverlayAccent = "warning" | "destructive";

interface OverlayConfig {
  accent: OverlayAccent;
  title: string;
  description: string;
  notice: string;
  buttonLabel: string;
}

const formatTime = (hours?: number, minutes?: number) => `${hours ?? 0}h ${minutes ?? 0}m`;

const ProgressBar = ({ value, accent }: { value: number; accent: OverlayAccent | null }) => {
  const baseColor = accent === "destructive" ? "bg-destructive" : accent === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full transition-all duration-500 ${baseColor}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        aria-hidden="true"
      />
    </div>
  );
};

export default function DriverNotifications() {
  const { journey, notifications, loading, updateNotificationSettings } = useJourney();
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const { toast } = useToast();
  const lastAlertRef = useRef<string | null>(null);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleSaveNotifications = async () => {
    await updateNotificationSettings(localNotifications);
  };

  const workedHours = journey?.workedHours ?? 0;
  const workedMins = journey?.workedMinutes ?? 0;
  const totalMinutes = journey ? (journey.totalHours ?? 0) * 60 : 0;
  const workedMinutes = workedHours * 60 + workedMins;
  const remainingMinutesRaw = totalMinutes - workedMinutes;
  const remainingMinutes = Math.max(remainingMinutesRaw, 0);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;
  const progress = totalMinutes > 0 ? (workedMinutes / totalMinutes) * 100 : 0;

  const startDateTime = useMemo(() => {
    if (!journey) return null;
    const [startHour, startMinute] = journey.startTime.split(":");
    const date = new Date(journey.date);
    date.setHours(Number(startHour));
    date.setMinutes(Number(startMinute || 0));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }, [journey]);

  const minutesUntilStart = useMemo(() => {
    if (!journey || !startDateTime) return Infinity;
    const diffMs = startDateTime.getTime() - Date.now();
    return Math.floor(diffMs / (1000 * 60));
  }, [journey, startDateTime]);

  const overlayConfig = useMemo<OverlayConfig | null>(() => {
    if (!journey) {
      return null;
    }

    const workedLabel = formatTime(journey.workedHours, journey.workedMinutes);

    if (!journey.isActive && minutesUntilStart <= 30 && minutesUntilStart >= 0) {
      return {
        accent: "warning",
        title: "¡Tu jornada está por empezar!",
        description:
          minutesUntilStart === 0
            ? "Tu jornada inicia ahora mismo. Dirígete al punto de partida para evitar retrasos."
            : `Debes dirigirte a tu sitio de trabajo y empezar tu jornada en los próximos ${minutesUntilStart} minutos.`,
        notice:
          "Aviso: No empezar tu jornada laboral a tiempo puede tener consecuencias en la cantidad de rutas a asignar.",
        buttonLabel: "Contactar Supervisor",
      };
    }

    if (remainingMinutesRaw <= 0) {
      return {
        accent: "destructive",
        title: "¡Límite de jornada alcanzado!",
        description: `Has trabajado ${workedLabel}. Debes finalizar tu jornada laboral inmediatamente para cumplir con la regulación vigente.`,
        notice:
          "Aviso: Continuar trabajando puede violar las regulaciones laborales y generar sanciones.",
        buttonLabel: "Finalizar jornada",
      };
    }

    if (remainingMinutesRaw <= 30) {
      return {
        accent: "destructive",
        title: "¡Límite de jornada está cerca!",
        description: `Has trabajado ${workedLabel}. Debes finalizar tu jornada laboral inmediatamente.`,
        notice:
          "Aviso: Continuar trabajando podría violar las regulaciones laborales.",
        buttonLabel: "Contactar Supervisor",
      };
    }

    return null;
  }, [journey, minutesUntilStart, remainingMinutesRaw]);

  useEffect(() => {
    if (!overlayConfig) {
      lastAlertRef.current = null;
      return;
    }

    const signature = `${overlayConfig.title}-${overlayConfig.description}`;
    if (lastAlertRef.current === signature) {
      return;
    }

    lastAlertRef.current = signature;
    toast({
      title: overlayConfig.title,
      description: overlayConfig.description,
      variant: overlayConfig.accent === "destructive" ? "destructive" : "default",
    });
  }, [overlayConfig, toast]);

  if (loading && !journey) {
    return (
      <Layout showLogin={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </Layout>
    );
  }

  if (!journey) {
    return (
      <Layout showLogin={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">
            No se encontraron datos de jornada para el día de hoy.
          </p>
        </div>
      </Layout>
    );
  }

  const accentStyles: Record<OverlayAccent, {
    iconBg: string;
    notice: string;
    button: string;
    border: string;
    background: string;
    title: string;
    description: string;
  }> = {
    warning: {
      iconBg: "bg-[#FDE68A] text-[#B45309]",
      notice: "text-[#B45309]",
      button: "bg-[#F97316] text-white hover:bg-[#EA580C]",
      border: "border-[#FBBF24]/60",
      background: "bg-[#FFF7E6]",
      title: "text-[#B45309]",
      description: "text-[#7C2D12]",
    },
    destructive: {
      iconBg: "bg-[#FECACA] text-[#B91C1C]",
      notice: "text-[#B91C1C]",
      button: "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
      border: "border-[#F87171]/70",
      background: "bg-[#FFF1F2]",
      title: "text-[#B91C1C]",
      description: "text-[#7F1D1D]",
    },
  };

  const IconMap: Record<OverlayAccent, typeof AlertTriangle> = {
    warning: AlertTriangle,
    destructive: AlertCircle,
  };

  const workedLabel = formatTime(journey.workedHours, journey.workedMinutes);
  const remainingLabel = `${remainingHours}h ${remainingMins}m`;

  return (
    <Layout showLogin={false}>
      <div className="relative space-y-10 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notificaciones de Jornada</h1>
            <p className="text-sm text-muted-foreground">
              Visualiza el progreso de tu jornada y administra tus preferencias de alerta.
            </p>
          </div>
          <div className="rounded-lg bg-muted px-4 py-2">
            <span className="text-sm font-medium text-muted-foreground">Conductor</span>
          </div>
        </div>

        <Card className="border border-border/40 bg-card/95 shadow-lg shadow-primary/5">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-warning/10">
                <Clock className="h-6 w-6 text-warning" aria-hidden="true" />
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-semibold text-foreground">Alerta de Jornada Laboral</h2>
                <p className="text-base text-muted-foreground">
                  {journey.isActive
                    ? `Tu jornada laboral está en progreso. Has trabajado ${workedLabel}.`
                    : "Tu jornada laboral está por iniciar. Asegúrate de estar preparado a tiempo."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
                <span className="text-foreground">Tiempo trabajado: {workedLabel}</span>
                <span className="text-warning">Tiempo restante: {remainingLabel}</span>
              </div>
              <ProgressBar value={progress} accent={overlayConfig?.accent ?? null} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/95 shadow-lg shadow-primary/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Configuración de Notificaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-background/60 p-4">
              <Checkbox
                id="email-notifications"
                checked={localNotifications.email}
                onCheckedChange={(checked) =>
                  setLocalNotifications({ ...localNotifications, email: checked as boolean })
                }
                aria-describedby="email-notifications-description"
                className="mt-1"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="email-notifications"
                  className="flex items-center gap-2 text-base font-semibold"
                >
                  <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                  Recibir por correo
                </Label>
                <p id="email-notifications-description" className="text-sm text-muted-foreground">
                  Enviaremos alertas a tu correo registrado para mantenerte informado.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-background/60 p-4">
              <Checkbox
                id="push-notifications"
                checked={localNotifications.push}
                onCheckedChange={(checked) =>
                  setLocalNotifications({ ...localNotifications, push: checked as boolean })
                }
                aria-describedby="push-notifications-description"
                className="mt-1"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="push-notifications"
                  className="flex items-center gap-2 text-base font-semibold"
                >
                  <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
                  Recibir en la aplicación
                </Label>
                <p id="push-notifications-description" className="text-sm text-muted-foreground">
                  Mostrar notificaciones push en tiempo real mientras estás en servicio.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setLocalNotifications(notifications)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveNotifications}>Guardar Cambios</Button>
            </div>
          </CardContent>
        </Card>

        {overlayConfig && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="pointer-events-auto mx-4 w-full max-w-xl rounded-3xl border border-border/40 bg-card p-8 shadow-2xl">
              <div
                className={`rounded-2xl border ${accentStyles[overlayConfig.accent].border} ${accentStyles[overlayConfig.accent].background} p-6`}
                role="alert"
                aria-live="assertive"
              >
                <div className="flex flex-col gap-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${accentStyles[overlayConfig.accent].iconBg}`}
                    >
                      {(() => {
                        const Icon = IconMap[overlayConfig.accent];
                        return <Icon className="h-6 w-6" aria-hidden="true" />;
                      })()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className={`text-xl font-bold ${accentStyles[overlayConfig.accent].title}`}>
                      {overlayConfig.title}
                    </h2>
                    <p className={`text-base ${accentStyles[overlayConfig.accent].description}`}>
                      {overlayConfig.description}
                    </p>
                  </div>
                  <Button className={`${accentStyles[overlayConfig.accent].button} mx-auto gap-2 px-6`}>
                    <PhoneCall className="h-4 w-4" aria-hidden="true" />
                    {overlayConfig.buttonLabel}
                  </Button>
                  <p className={`text-sm ${accentStyles[overlayConfig.accent].notice}`}>
                    {overlayConfig.notice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
