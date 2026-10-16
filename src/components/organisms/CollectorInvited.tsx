import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { COLLECTORS_TEXT } from '@/content/collectors';

/** Los textos de la confirmación de un alta. */
export interface InvitedText {
  readonly title: string;
  readonly withPassword: (name: string) => string;
  readonly existingAccount: (name: string) => string;
  readonly passwordLabel: string;
  readonly done: string;
}

export interface CollectorInvitedProps {
  readonly invited: { readonly fullName: string; readonly tempPassword: string | null };
  /** Los textos de la confirmación; por defecto, los de «Cobrador registrado». */
  readonly text?: InvitedText;
  /** A dónde vuelve el botón final; por defecto, a cobradores. */
  readonly backHref?: string;
}

/**
 * Confirmación de "Cobrador registrado". Si la persona no tenía cuenta muestra la contraseña
 * temporal, que la API entrega una sola vez; si ya tenía, solo avisa que quedó vinculada.
 */
export function CollectorInvited({ invited, text = COLLECTORS_TEXT.invited, backHref = '/cobradores' }: Readonly<CollectorInvitedProps>) {
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

      <ButtonLink href={backHref}>{text.done}</ButtonLink>
    </section>
  );
}
