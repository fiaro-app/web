'use client';

import { useEffect, useState } from 'react';
import type { Box, Size } from '@/features/tutorial/tutorial-geometry';
import { findVisible } from '@/features/tutorial/tutorial-dom';

function readViewport(): Size {
  return { width: window.innerWidth, height: window.innerHeight };
}

/**
 * Dónde está en la ventana el elemento que señala un paso del tutorial. Lo acerca a la vista y sigue sus
 * cambios (scroll, tamaño de ventana, relayout). `box` es `null` si el paso no señala nada o el elemento
 * no está a la vista (p. ej. el menú en un celular): la tarjeta sale centrada.
 */
export function useTargetBox(selector: string | null): { readonly box: Box | null; readonly viewport: Size } {
  const [box, setBox] = useState<Box | null>(null);
  const [viewport, setViewport] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const element = selector === null ? null : findVisible(selector);
    element?.scrollIntoView({ block: 'nearest' });

    const measure = () => {
      setViewport(readViewport());
      if (element === null) {
        setBox(null);
        return;
      }
      const rect = element.getBoundingClientRect();
      setBox({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    };
    measure();

    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    const observer = element ? new ResizeObserver(measure) : null;
    if (element) observer?.observe(element);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      observer?.disconnect();
    };
  }, [selector]);

  return { box, viewport };
}
