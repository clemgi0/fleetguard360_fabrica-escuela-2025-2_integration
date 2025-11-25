<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Play, Square, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useJourney } from '@/hooks/useJourney';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function DriverNotifications() {
  const { journey, notifications, loading, startJourney, stopJourney, updateNotificationSettings } = useJourney();
  const navigate = useNavigate();
  const [localNotifications, setLocalNotifications] = useState(notifications);
=======
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
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
  // Redirect to dashboard if journey is already active
  useEffect(() => {
    if (journey?.isActive) {
      navigate('/driver-dashboard');
    }
  }, [journey?.isActive, navigate]);

  const handleStartJourney = async () => {
    await startJourney();
    toast({
      title: 'Jornada iniciada',
      description: 'Tu jornada laboral ha comenzado exitosamente.',
      className: 'bg-success/10 border-success/20 text-success'
    });
  };

=======
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
  const handleSaveNotifications = async () => {
    await updateNotificationSettings(localNotifications);
  };

<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
  if (loading) {
    return (
      <Layout showLogin={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
=======
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
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </Layout>
    );
  }

<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
  const totalMinutes = (journey?.totalHours || 8) * 60;
  const workedMinutes = (journey?.workedHours || 0) * 60 + (journey?.workedMinutes || 0);
  const progressPercentage = (workedMinutes / totalMinutes) * 100;
  const remainingMinutes = totalMinutes - workedMinutes;
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;
  
  // Check if journey is about to end (less than 30 minutes remaining)
  const isJourneyEndingSoon = journey?.isActive && remainingMinutes <= 30 && remainingMinutes > 0;

  return (
    <Layout showLogin={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Notificaciones de Jornada</h1>
          <div className="px-4 py-2 bg-muted rounded-lg">
=======
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
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
            <span className="text-sm font-medium text-muted-foreground">Conductor</span>
          </div>
        </div>

<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
        {/* Journey About to End Alert */}
        {isJourneyEndingSoon && (
          <Alert className="bg-warning/10 border-warning/20">
            <AlertCircle className="h-5 w-5 text-warning" />
            <AlertDescription className="text-warning">
              <span className="font-semibold">Atención:</span> Tu jornada laboral está por finalizar. 
              Solo quedan {remainingHours}h {remainingMins}m de trabajo.
            </AlertDescription>
          </Alert>
        )}

        {/* Journey Start Alert */}
        {!journey?.isActive && (
          <Alert className="bg-primary/10 border-primary/20">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <AlertDescription className="text-primary">
              <span className="font-semibold">Listo para comenzar:</span> Tu jornada laboral está programada para hoy. 
              Presiona "Iniciar Jornada" cuando estés listo.
            </AlertDescription>
          </Alert>
        )}

        {/* Journey Alert Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Alerta de Jornada Laboral
                </h2>
                <p className="text-muted-foreground">
                  {journey?.isActive 
                    ? `Tu jornada laboral está por finalizar. Has trabajado ${journey.workedHours}h ${journey.workedMinutes}m.`
                    : 'Tu jornada laboral está por iniciar. Has trabajado 0h 0m.'}
=======
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
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
                </p>
              </div>
            </div>

<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">
                  Tiempo trabajado: {journey?.workedHours || 0}h {journey?.workedMinutes || 0}m
                </span>
                <span className="font-medium text-warning">
                  Tiempo restante: {remainingHours}h {remainingMins}m
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
                aria-label={`Progreso de jornada: ${Math.round(progressPercentage)}%`}
              />
            </div>

            {/* Journey Control Button */}
            <div className="mt-6 flex justify-center">
              {!journey?.isActive ? (
                <Button
                  onClick={handleStartJourney}
                  size="lg"
                  className="gap-2"
                  aria-label="Iniciar jornada laboral"
                >
                  <Play className="h-5 w-5" aria-hidden="true" />
                  Iniciar Jornada
                </Button>
              ) : (
                <Button
                  onClick={stopJourney}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                  aria-label="Finalizar jornada laboral"
                >
                  <Square className="h-5 w-5" aria-hidden="true" />
                  Finalizar Jornada
                </Button>
              )}
=======
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
                <span className="text-foreground">Tiempo trabajado: {workedLabel}</span>
                <span className="text-warning">Tiempo restante: {remainingLabel}</span>
              </div>
              <ProgressBar value={progress} accent={overlayConfig?.accent ?? null} />
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
            </div>
          </CardContent>
        </Card>

<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
        {/* Notification Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Notificaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3">
=======
        <Card className="border border-border/40 bg-card/95 shadow-lg shadow-primary/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Configuración de Notificaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-background/60 p-4">
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
              <Checkbox
                id="email-notifications"
                checked={localNotifications.email}
                onCheckedChange={(checked) =>
                  setLocalNotifications({ ...localNotifications, email: checked as boolean })
                }
                aria-describedby="email-notifications-description"
<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
=======
                className="mt-1"
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
              />
              <div className="space-y-1">
                <Label
                  htmlFor="email-notifications"
<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
                  className="text-base font-medium cursor-pointer"
                >
                  Recibir por correo
                </Label>
                <p id="email-notifications-description" className="text-sm text-muted-foreground">
                  Enviaremos alertas a tu correo registrado
=======
                  className="flex items-center gap-2 text-base font-semibold"
                >
                  <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                  Recibir por correo
                </Label>
                <p id="email-notifications-description" className="text-sm text-muted-foreground">
                  Enviaremos alertas a tu correo registrado para mantenerte informado.
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
                </p>
              </div>
            </div>

<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
            <div className="flex items-start space-x-3">
=======
            <div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-background/60 p-4">
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
              <Checkbox
                id="push-notifications"
                checked={localNotifications.push}
                onCheckedChange={(checked) =>
                  setLocalNotifications({ ...localNotifications, push: checked as boolean })
                }
                aria-describedby="push-notifications-description"
<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
=======
                className="mt-1"
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
              />
              <div className="space-y-1">
                <Label
                  htmlFor="push-notifications"
<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
                  className="text-base font-medium cursor-pointer"
                >
                  Recibir en la aplicación
                </Label>
                <p id="push-notifications-description" className="text-sm text-muted-foreground">
                  Mostrar notificaciones push en tiempo real
=======
                  className="flex items-center gap-2 text-base font-semibold"
                >
                  <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
                  Recibir en la aplicación
                </Label>
                <p id="push-notifications-description" className="text-sm text-muted-foreground">
                  Mostrar notificaciones push en tiempo real mientras estás en servicio.
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
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
<<<<<<< HEAD:frontend/src/pages/DriverNotifications.tsx
              <Button onClick={handleSaveNotifications}>
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>
=======
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
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/src/pages/DriverNotifications.tsx
      </div>
    </Layout>
  );
}
