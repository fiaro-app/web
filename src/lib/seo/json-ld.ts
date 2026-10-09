import { parseAmount } from '@/lib/amount';
import { SITE } from '@/lib/site';

/** Un nodo de datos estructurados de schema.org. */
export type JsonLdNode = Readonly<Record<string, unknown>>;

/** Los datos mínimos de un plan que necesita el marcado de ofertas. */
export interface PricedPlan {
  readonly name: string;
  /** Precio tal como se muestra ("$79.000") o un texto sin cifra ("Hablemos"). */
  readonly price: string;
  readonly description: string;
}

/** La organización detrás del sitio. */
export function organizationJsonLd(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon`,
    description: SITE.description,
  };
}

/**
 * La aplicación con sus planes como ofertas. Solo entran los planes con precio en pesos: uno que
 * dice "Hablemos" no es una oferta con valor, y el marcado debe coincidir con lo que ve la persona.
 */
export function softwareApplicationJsonLd(plans: readonly PricedPlan[]): JsonLdNode {
  const offers = plans.flatMap((plan) => {
    const price = parseAmount(plan.price);
    return price === null
      ? []
      : [{ '@type': 'Offer', name: plan.name, description: plan.description, price, priceCurrency: 'COP' }];
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: SITE.language,
    description: SITE.description,
    url: SITE.url,
    ...(offers.length > 0 && { offers }),
  };
}

/** Una pregunta frecuente con su respuesta. */
export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

/** Preguntas frecuentes (`FAQPage`): debe contener exactamente lo que se muestra en la sección. */
export function faqJsonLd(entries: readonly FaqEntry[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

/**
 * Serializa para incrustarlo en un `<script type="application/ld+json">`. Escapa `<` (y los
 * separadores de línea de Unicode) para que un texto con `</script>` no pueda cerrar la etiqueta.
 */
export function serializeJsonLd(nodes: JsonLdNode | readonly JsonLdNode[]): string {
  return JSON.stringify(nodes)
    .replaceAll('<', String.raw`\u003c`)
    .replaceAll('\u2028', String.raw`\u2028`)
    .replaceAll('\u2029', String.raw`\u2029`);
}
