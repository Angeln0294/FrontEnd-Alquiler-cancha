import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    // Envía el scroll al inicio de la pantalla de forma instantánea al cambiar de ruta
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
