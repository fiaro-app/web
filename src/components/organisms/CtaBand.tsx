import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';

export interface CtaBandProps {
  readonly title: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
}

/** Banda de cierre a todo color (el mismo degradado de la portada) con un último llamado a la acción. */
export function CtaBand({ title, description, ctaLabel, ctaHref }: Readonly<CtaBandProps>) {
  return (
    <section className="relative isolate mx-3 mb-3 flex flex-col items-center gap-6 overflow-hidden rounded-[32px] bg-[#241c63] px-6 py-24 text-center text-white lg:mx-6 lg:mb-6 lg:px-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_10%_100%,#e0487a_0%,transparent_60%),radial-gradient(45%_70%_at_95%_0%,#f5a524_0%,transparent_60%),linear-gradient(135deg,#241c63_0%,#4b2fb0_60%,#6b3fd4_100%)]"
      />
      <Text variant="price" as="h2" className="max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] leading-none tracking-[-0.035em] text-white">
        {title}
      </Text>
      <Text variant="lead" className="max-w-150 text-[18px] text-white/90">
        {description}
      </Text>
      <ButtonLink href={ctaHref} variant="inverse" className="h-14 rounded-full bg-white px-9 text-[#241c63] hover:-translate-y-0.5">
        {ctaLabel}
      </ButtonLink>
    </section>
  );
}
