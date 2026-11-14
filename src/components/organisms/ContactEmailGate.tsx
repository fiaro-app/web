import { Text } from '@/components/atoms/Text';
import { AccountProfileForm } from '@/components/organisms/AccountProfileForm';
import { EmailVerificationForm } from '@/components/organisms/EmailVerificationForm';
import { VERIFY_EMAIL_CONTENT } from '@/content/verify-email';

export interface ContactEmailGateProps {
  readonly fullName: string;
  readonly phoneNumber: string;
  readonly contactEmail: string | null;
}

/**
 * Pide a la dueña agregar su correo y verificarlo. Reutiliza los formularios de «Mi cuenta»: sin
 * correo muestra solo el de agregarlo; con correo sin verificar, el código y, debajo, el de
 * corregirlo.
 */
export function ContactEmailGate({ fullName, phoneNumber, contactEmail }: Readonly<ContactEmailGateProps>) {
  const text = VERIFY_EMAIL_CONTENT;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Text variant="h2" as="h1">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.subtitle}
        </Text>
      </div>
      {contactEmail && (
        <section aria-label={text.verifyTitle} className="flex flex-col gap-3">
          <EmailVerificationForm email={contactEmail} />
        </section>
      )}
      <section aria-label={contactEmail ? text.fixTitle : text.addTitle} className="flex flex-col gap-3">
        <Text variant="label" as="h2">
          {contactEmail ? text.fixTitle : text.addTitle}
        </Text>
        <AccountProfileForm fullName={fullName} phoneNumber={phoneNumber} contactEmail={contactEmail} />
      </section>
    </div>
  );
}
