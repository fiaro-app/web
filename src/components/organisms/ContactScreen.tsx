'use client';

import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StateIcon } from '@/components/atoms/StateIcon';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ContactForm } from '@/components/organisms/ContactForm';
import { CONTACT_CONTENT } from '@/content/contact';
import { useContactForm } from '@/features/leads/use-contact-form';

export interface ContactScreenProps {
  /** A dónde lleva «Crear mi cuenta gratis» tras enviar el mensaje. */
  readonly signupHref: string;
  readonly homeHref: string;
}

/** El formulario de contacto y, una vez enviado, la confirmación. La lógica vive en `useContactForm`. */
export function ContactScreen({ signupHref, homeHref }: Readonly<ContactScreenProps>) {
  const form = useContactForm();
  const sent = CONTACT_CONTENT.sent;

  if (form.isSent) {
    return (
      <EmptyState
        size="compact"
        icon={<StateIcon name="bell" />}
        title={sent.title}
        description={sent.description}
        action={
          <>
            <ButtonLink href={signupHref}>{sent.signup}</ButtonLink>
            <ButtonLink href={homeHref} variant="outline">
              {sent.home}
            </ButtonLink>
          </>
        }
      />
    );
  }
  return <ContactForm form={form} />;
}
