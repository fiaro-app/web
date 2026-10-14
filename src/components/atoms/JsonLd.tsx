import { serializeJsonLd, type JsonLdNode } from '@/lib/seo/json-ld';

export interface JsonLdProps {
  readonly data: JsonLdNode | readonly JsonLdNode[];
}

/** Incrusta datos estructurados (schema.org) para los buscadores. No pinta nada visible. */
export function JsonLd({ data }: Readonly<JsonLdProps>) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
