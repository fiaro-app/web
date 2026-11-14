import { CookieNotice } from '@/components/organisms/CookieNotice';
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, IBM_Plex_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

/**
 * font.display / font.body / font.mono. `next/font/google` descarga los archivos al compilar y los
 * sirve desde nuestro dominio: el navegador nunca habla con Google (ver `THIRD_PARTY.md`).
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/**
 * Metadatos por defecto de todo el sitio; cada página los completa o sobrescribe (`title` se
 * convierte en "Página · Fiaro"). `metadataBase` vuelve absolutas las URL de las imágenes sociales
 * y del enlace canónico.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  keywords: [
    'control de cartera',
    'software para prestamistas',
    'cobro diario',
    'gestión de préstamos',
    'cuadre del día',
    'mora en tiempo real',
    'administración de cobradores',
    'software financiero Colombia',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: 'finance',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.title,
    description: SITE.description,
    url: '/',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: SITE.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: ['/opengraph-image'],
  },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang={SITE.language}
      className={`${bricolage.variable} ${figtree.variable} ${plexMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Salto al contenido: el primer tabulador lo muestra, para no recorrer el menú en cada página. */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-label focus:font-medium focus:text-primary-foreground"
        >
          Saltar al contenido
        </a>
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
