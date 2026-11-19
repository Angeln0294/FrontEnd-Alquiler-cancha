import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "../services/api";
import {
  obtenerUsuarioActualService,
  cerrarSesionService,
  type UsuarioAuthDTO,
} from "../services/auth.service";


interface AuthContextType {
  usuario: UsuarioAuthDTO | null;
  cargando: boolean;
  cerrarSesion: () => Promise<void>;
  cargarUsuario: () => Promise<UsuarioAuthDTO | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioAuthDTO | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = async (): Promise<UsuarioAuthDTO | null> => {
    try {
      const resultado = await obtenerUsuarioActualService();
setUsuario(resultado.usuario);
return resultado.usuario;

    
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        console.error("Error al obtener usuario:", error);
      }

      setUsuario(null);
      return null;
    } finally {
      setCargando(false);
    }
  };
  const cerrarSesion = async () => {
    try {
     await cerrarSesionService();
setUsuario(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    cargarUsuario();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        cerrarSesion,
        cargarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return contexto;
}
