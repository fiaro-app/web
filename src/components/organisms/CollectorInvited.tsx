import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { COLLECTORS_TEXT } from '@/content/collectors';

export interface CollectorInvitedProps {
  readonly invited: { readonly fullName: string; readonly tempPassword: string | null };
}

/**
 * Confirmación de "Cobrador registrado". Si la persona no tenía cuenta muestra la contraseña
 * temporal, que la API entrega una sola vez; si ya tenía, solo avisa que quedó vinculada.
 */
export function CollectorInvited({ invited }: Readonly<CollectorInvitedProps>) {
  const text = COLLECTORS_TEXT.invited;
  const { fullName, tempPassword } = invited;

  return (
    <section aria-labelledby="invited-title" className="flex max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="title" as="h1" weight="bold" id="invited-title" className="text-foreground">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {tempPassword === null ? text.existingAccount(fullName) : text.withPassword(fullName)}
        </Text>
      </div>

      {tempPassword !== null && (
        <div className="flex flex-col gap-1 rounded-md bg-surface p-5">
          <Text variant="caption" className="font-semibold text-foreground/65">
            {text.passwordLabel}
          </Text>
          <output className="font-mono text-h3 font-semibold break-all text-foreground select-all">{tempPassword}</output>
        </div>
      )}

      <ButtonLink href="/cobradores">{text.done}</ButtonLink>
    </section>
  );
}
