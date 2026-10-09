import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

// font.display / font.body / font.mono del diseño.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.title,
    description: SITE.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={SITE.language}
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
