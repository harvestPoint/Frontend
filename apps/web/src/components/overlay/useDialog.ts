// apps/web/src/components/overlay/useDialog.ts
// Comportamento comum de modal e drawer: Esc fecha, o foco fica preso dentro
// do diálogo, volta para quem abriu ao fechar e a página de trás não rola.
import { useEffect, useRef } from 'react';

const FOCAVEIS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDialog(aberto: boolean, aoFechar: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const fechar = useRef(aoFechar);
  fechar.current = aoFechar;

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    const raiz = ref.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const primeiro = raiz?.querySelector<HTMLElement>('[data-autofocus]') ?? raiz;
    primeiro?.focus();

    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); fechar.current(); return; }
      if (e.key !== 'Tab' || !raiz) return;
      const itens = Array.from(raiz.querySelectorAll<HTMLElement>(FOCAVEIS)).filter((el) => el.offsetParent !== null);
      if (!itens.length) { e.preventDefault(); raiz.focus(); return; }
      const a = itens[0];
      const z = itens[itens.length - 1];
      const ativo = document.activeElement;
      if (e.shiftKey && (ativo === a || ativo === raiz)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && ativo === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', tecla, true);
    return () => {
      document.removeEventListener('keydown', tecla, true);
      document.body.style.overflow = overflow;
      anterior?.focus?.();
    };
  }, [aberto]);

  return ref;
}
