import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Imagen que se ve al compartir el enlace en redes y mensajería (1200×630). */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24,
          padding: 96,
          background: SITE.themeColor,
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 700 }}>{SITE.name}</div>
        <div style={{ fontSize: 52, fontWeight: 600, maxWidth: 900 }}>
          El control de tu cartera que tu cuaderno nunca te va a dar
        </div>
        <div style={{ fontSize: 30, opacity: 0.8 }}>Mora en tiempo real · Cobradores · Cuadre diario</div>
      </div>
    ),
    size,
  );
}
