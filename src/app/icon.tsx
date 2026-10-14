import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

/** Ícono de la web y del manifest: la inicial de la marca sobre el anil de Fiaro. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: SITE.themeColor,
          color: '#ffffff',
          fontSize: 340,
          fontWeight: 700,
          borderRadius: 112,
        }}
      >
        F
      </div>
    ),
    size,
  );
}
