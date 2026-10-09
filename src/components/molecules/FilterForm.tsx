'use client';

import { createContext, useContext, useEffect, useRef, useState, type FormHTMLAttributes } from 'react';

interface FilterFormState {
  /** Ya hidrató en el navegador: antes de eso el botón no se apaga, así el formulario funciona sin JavaScript. */
  readonly ready: boolean;
  /** Hay valores distintos de los que ya están aplicados. */
  readonly dirty: boolean;
}

const FilterFormContext = createContext<FilterFormState>({ ready: false, dirty: true });

/** Estado del filtro que envuelve al botón: lo usa `FilterSubmitButton` para apagarse cuando no hay nada nuevo que aplicar. */
export function useFilterFormState(): FilterFormState {
  return useContext(FilterFormContext);
}

/** Valores del formulario como texto comparable; los vacíos no cuentan (un filtro vacío es lo mismo que no tenerlo). */
function snapshot(form: HTMLFormElement): string {
  return JSON.stringify([...new FormData(form).entries()].filter(([, value]) => typeof value === 'string' && value !== ''));
}

/**
 * Formulario de un filtro de listado (método GET). Además de enviarse como cualquier formulario, sabe si
 * la persona cambió algo respecto de lo que ya está aplicado, para que «Aplicar»/«Buscar» se vea activo solo cuando hay algo que aplicar.
 */
export function FilterForm({ children, ...props }: Readonly<FormHTMLAttributes<HTMLFormElement>>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FilterFormState>({ ready: false, dirty: false });

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const applied = snapshot(form);
    setState({ ready: true, dirty: false });
    const update = () => setState({ ready: true, dirty: snapshot(form) !== applied });
    // Los selectores propios avisan con `change` desde sus campos ocultos.
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    return () => {
      form.removeEventListener('input', update);
      form.removeEventListener('change', update);
    };
  }, []);

  return (
    <FilterFormContext.Provider value={state}>
      <form ref={formRef} {...props}>
        {children}
      </form>
    </FilterFormContext.Provider>
  );
}
