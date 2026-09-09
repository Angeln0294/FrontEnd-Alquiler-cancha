import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: "usuario" | "admin";
  activo: boolean;
  emailVerificado: boolean;
}

interface AuthContextType {
  usuario: Usuario | null;
  cargando: boolean;
  cerrarSesion: () => Promise<void>;
  cargarUsuario: () => Promise<Usuario | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = async (): Promise<Usuario | null> => {
  try {
    const respuesta = await fetch(
      "http://localhost:3003/api/usuario/me",
      {
        credentials: "include",
      }
    );

    if (!respuesta.ok) {
      setUsuario(null);
      return null;
    }

    const resultado = await respuesta.json();

    setUsuario(resultado.usuario);

    return resultado.usuario;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    setUsuario(null);
    return null;
  } finally {
    setCargando(false);
  }
};
  const cerrarSesion = async () => {
    try {
      await fetch("http://localhost:3003/api/usuario/logout", {
        method: "POST",
        credentials: "include",
      });

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