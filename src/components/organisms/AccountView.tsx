import { Text } from '@/components/atoms/Text';
import { SettingsSection } from '@/components/molecules/SettingsSection';
import { AccountDeactivate } from '@/components/organisms/AccountDeactivate';
import { AccountPasswordForm } from '@/components/organisms/AccountPasswordForm';
import { AccountProfileForm } from '@/components/organisms/AccountProfileForm';
import { AccountSessions } from '@/components/organisms/AccountSessions';
import { EmailVerificationForm } from '@/components/organisms/EmailVerificationForm';
import { ACCOUNT_TEXT } from '@/content/account';
import type { SessionRow } from '@/features/account/sessions-view-model';

export interface AccountViewProps {
  readonly fullName: string;
  readonly phoneNumber: string;
  readonly contactEmail: string | null;
  readonly contactEmailVerified: boolean;
  /** Sesiones abiertas de la persona; vacío si no se pudieron traer. */
  readonly sessions?: readonly SessionRow[];
}

/** «Mi cuenta»: datos, verificación del correo, contraseña, sesiones y desactivar la cuenta. Solo presentación. */
export function AccountView({ fullName, phoneNumber, contactEmail, contactEmailVerified, sessions = [] }: Readonly<AccountViewProps>) {
  const text = ACCOUNT_TEXT;
  return (
    <>
      <Text variant="title" as="h1" weight="bold" className="text-foreground">
        {text.title}
      </Text>
      {/* Dos columnas desde `xl`: «tus datos» a la izquierda y «seguridad» a la derecha; en pantallas angostas se apilan. */}
      <div className="grid items-start gap-7 xl:grid-cols-2 *:*:max-w-none">
        <div className="flex flex-col gap-7">
          <SettingsSection title={text.profile.title} description={text.profile.description}>
            <AccountProfileForm key={`${fullName}|${contactEmail ?? ''}`} fullName={fullName} phoneNumber={phoneNumber} contactEmail={contactEmail} />
            {contactEmail && contactEmailVerified && <p className="text-small font-semibold text-success">{text.verification.verified}</p>}
            {contactEmail && !contactEmailVerified && <EmailVerificationForm email={contactEmail} />}
          </SettingsSection>
          <SettingsSection title={text.password.title} description={text.password.description}>
            <AccountPasswordForm />
          </SettingsSection>
        </div>
        <div className="flex flex-col gap-7">
          <SettingsSection title={text.sessions.title} description={text.sessions.description}>
            <AccountSessions sessions={sessions} />
          </SettingsSection>
          <SettingsSection title={text.danger.title} description={text.danger.description} className="border border-destructive/30">
            <AccountDeactivate />
          </SettingsSection>
        </div>
      </div>
    </>
  );
}
