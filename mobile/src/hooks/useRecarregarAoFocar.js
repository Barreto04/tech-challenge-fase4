import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// Recarrega a lista quando a tela volta ao foco (ex.: depois de criar ou editar),
// sem duplicar a requisição que o próprio hook de lista já faz ao montar.
export default function useRecarregarAoFocar(recarregar) {
  const primeiroFoco = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (primeiroFoco.current) {
        primeiroFoco.current = false;
        return;
      }
      recarregar({ silencioso: true });
    }, [recarregar])
  );
}
