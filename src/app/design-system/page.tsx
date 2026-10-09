import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Divider } from '@/components/atoms/Divider';
import { IconButton } from '@/components/atoms/IconButton';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Link } from '@/components/atoms/Link';
import { LoadingDots } from '@/components/atoms/LoadingDots';
import { Radio } from '@/components/atoms/Radio';
import { Select } from '@/components/atoms/Select';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Spinner } from '@/components/atoms/Spinner';
import { StatusChip } from '@/components/atoms/StatusChip';
import { Text } from '@/components/atoms/Text';
import { TextButton } from '@/components/atoms/TextButton';
import { Alert } from '@/components/molecules/Alert';
import { ClientRow } from '@/components/molecules/ClientRow';
import { EmptyState } from '@/components/molecules/EmptyState';
import { HistoryRow } from '@/components/molecules/HistoryRow';
import { InfoRow } from '@/components/molecules/InfoRow';
import { Stepper } from '@/components/molecules/Stepper';
import { Toast } from '@/components/molecules/Toast';
import { TopBar } from '@/components/organisms/TopBar';
import { FilterPill } from '@/components/atoms/FilterPill';
import { AmountDemo } from './AmountDemo';
import { MoleculesDemo } from './MoleculesDemo';

export const metadata: Metadata = { title: 'Sistema de diseño · Fiaro' };

/**
 * Catálogo de átomos con todos sus estados, para revisarlos contra el diseño sin armar una
 * pantalla. Solo existe en desarrollo: en producción responde 404.
 */
export default function DesignSystemPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-col gap-1">
        <Text variant="display">Átomos</Text>
        <Text variant="label" className="text-foreground/70">
          Hover, pressed y foco se ven al interactuar; el resto de estados está forzado abajo.
        </Text>
      </header>

      <Section title="Typography">
        <Text variant="display">Display · Fraunces 34</Text>
        <Text variant="h2">H2 · Fraunces 26</Text>
        <Text variant="h3">H3 · Fraunces 20</Text>
        <Text variant="body">Body · IBM Plex Sans 16</Text>
        <Text variant="label" weight="medium">Label · IBM Plex Sans 14 medium</Text>
        <Text variant="caption">Caption · IBM Plex Sans 12</Text>
        <Text variant="mono">Mono · $1.250.000</Text>
      </Section>

      <Section title="Button — 3 estilos × 4 estados">
        {(['primary', 'outline', 'text'] as const).map((variant) => (
          <Row key={variant} label={variant}>
            <Button variant={variant}>Pagar</Button>
            <Button variant={variant} disabled>Pagar</Button>
            <Button variant={variant} loading>Pagar</Button>
            <Button variant={variant} rightIcon="→">Siguiente</Button>
          </Row>
        ))}
        <Row label="TextButton">
          <TextButton>Cancelar</TextButton>
          <TextButton disabled>Cancelar</TextButton>
        </Row>
        <Row label="IconButton">
          <IconButton label="Siguiente" icon="→" />
          <IconButton label="Siguiente" icon="→" disabled />
        </Row>
        <Row label="Link">
          <Link href="/design-system">¿Olvidaste tu contraseña?</Link>
        </Row>
      </Section>

      <Section title="Formularios — reposo / foco (clic) / error / deshabilitado">
        <Row label="Input">
          <div className="flex w-60 flex-col gap-1.5">
            <Label htmlFor="ds-email" required>Correo electrónico</Label>
            <Input id="ds-email" placeholder="tu@correo.com" />
          </div>
          <div className="w-60"><Input placeholder="Monto" invalid aria-label="Con error" /></div>
          <div className="w-60"><Input placeholder="Monto" disabled aria-label="Deshabilitado" /></div>
        </Row>
        <Row label="Select">
          {[{}, { invalid: true }, { disabled: true }].map((props, index) => (
            <div key={index} className="w-50">
              <Select aria-label={`Cobrador ${index}`} {...props}>
                <option>Todos los cobradores</option>
                <option>Luis Albares</option>
              </Select>
            </div>
          ))}
        </Row>
        <Row label="AmountInput">
          <AmountDemo />
          <AmountDemo invalid />
          <AmountDemo disabled />
        </Row>
        <Row label="Checkbox">
          <Checkbox aria-label="Sin marcar" />
          <Checkbox aria-label="Marcada" defaultChecked />
          <Checkbox aria-label="Error" invalid />
          <Checkbox aria-label="Deshabilitada" disabled />
          <Checkbox aria-label="Deshabilitada marcada" disabled defaultChecked />
        </Row>
        <Row label="Radio">
          <Radio name="ds-radio" aria-label="Sin elegir" />
          <Radio name="ds-radio" aria-label="Elegida" defaultChecked />
          <Radio name="ds-radio-dis" aria-label="Deshabilitada" disabled />
        </Row>
      </Section>

      <Section title="Datos">
        <Row label="StatusChip">
          <StatusChip status="current" />
          <StatusChip status="paid" />
          <StatusChip status="late" />
          <StatusChip status="delinquent" />
          <StatusChip status="current" loading />
        </Row>
        <Row label="Avatar">
          <Avatar name="Juan Pérez" />
          <Avatar name="Juan Pérez" loading />
        </Row>
        <Row label="Divider">
          <div className="w-75"><Divider /></div>
        </Row>
      </Section>

      <Section title="Filtros (átomo)">
        <Row label="FilterPill">
          <FilterPill selected>Todos</FilterPill>
          <FilterPill>Al día</FilterPill>
          <FilterPill disabled>Mora</FilterPill>
        </Row>
      </Section>

      <Section title="Moléculas — feedback">
        <div className="flex max-w-md flex-col gap-3">
          <Alert tone="success">Visita registrada correctamente.</Alert>
          <Alert tone="warning">Esta cuota ya tiene 3 días de atraso.</Alert>
          <Alert tone="error">No se pudo guardar. Verifica tu conexión.</Alert>
          <Alert tone="info">Los cambios se sincronizan automáticamente.</Alert>
          <Toast message="Guardado, pendiente de sync" />
        </div>
        <EmptyState
          className="max-w-xs"
          title="Sin clientes asignados hoy"
          description="Cuando tu Lender te asigne una ruta, aparecerá aquí."
        />
      </Section>

      <Section title="Moléculas — listas y datos">
        <div className="flex max-w-md flex-col divide-y divide-foreground/12 overflow-hidden rounded-md border border-skeleton">
          <ClientRow name="Marta Gómez" balance={420000} status="delinquent" daysLate={12} />
          <ClientRow name="Juan Pérez" balance={80000} status="current" />
          <HistoryRow date="12 sep 2026" method="Efectivo" amount={35000} statusLabel="Pagado" statusTone="success" />
          <InfoRow label="Teléfono" value="300 123 4567" />
        </div>
        <Stepper steps={['Tipo de cuenta', 'Configuración', 'Plan']} current={1} />
      </Section>

      <Section title="Moléculas — filtros y modal">
        <MoleculesDemo />
      </Section>

      <Section title="Organismo — TopBar">
        <div className="overflow-hidden rounded-md border border-skeleton">
          <TopBar
            userName="Alejo Zuleta"
            navItems={[
              { label: 'Cartera', href: '/design-system', active: true },
              { label: 'Estadísticas', href: '/design-system' },
              { label: 'Cuadre', href: '/design-system' },
            ]}
          />
        </div>
      </Section>

      <Section title="Carga">
        <Row label="Spinner">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
        <Row label="LoadingDots">
          <LoadingDots />
        </Row>
        <Row label="Skeleton">
          <Skeleton className="h-6 w-40 rounded-sm" />
        </Row>
      </Section>
    </main>
  );
}

function Section({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-skeleton bg-surface p-6">
      <Text variant="h3" as="h2">{title}</Text>
      {children}
    </section>
  );
}

function Row({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Text variant="caption" className="w-24 shrink-0 text-foreground/70">{label}</Text>
      {children}
    </div>
  );
}
