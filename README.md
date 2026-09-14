# ⚽ Canchas Ya - FrontEnd 🚀

¡Bienvenido al repositorio del FrontEnd de **Canchas Ya**! Una plataforma web moderna, intuitiva y optimizada diseñada pura y exclusivamente para digitalizar el deporte amateur en Tucumán. Este sistema permite a los complejos deportivos automatizar la gestión de sus turnos y a los usuarios asegurar su hora de juego al instante.

Este desarrollo está construido bajo una arquitectura modular de componentes y aplicando **TypeScript estricto** para garantizar un código robusto, escalable y libre de errores en producción.

---

## 🎨 Características Clave Implementadas

*   **Reserva de Turnos Interactiva:** Mockup dinámico basado en una grilla asimétrica adaptativa de dos columnas para la selección de horarios en tiempo real.
*   **Promociones Inteligentes Automatizadas:** El sistema calcula y aplica de forma reactiva un **20% de descuento** (Promo Nocturna de lunes a jueves después de las 22:00hs) según el horario cliqueado por el usuario.
*   **Navegación Fluida e Interconectada:** Reseteo automático de la posición de la pantalla mediante un componente de control del ciclo de vida del enrutamiento.
*   **Formularios con Validación Avanzada:** Pantallas de Login y Registro fuertemente tipadas con validación nativa de campos (*onTouched*) y soporte para accesos OAuth.
*   **Estética Premium en Modo Oscuro:** Interfaz optimizada con una paleta corporativa oscura utilizando iconos vectoriales originales (SVG) y adaptabilidad simétrica en imágenes de perfil (`object-cover`).

---

## 🛠️ Stack Tecnológico & Librerías Utilizadas

El proyecto utiliza las herramientas más modernas y ágivas del ecosistema web actual:

*   **React 19:** Biblioteca principal para la construcción de interfaces de usuario basadas en componentes declarativos y reutilizables.
*   **Vite:** Servidor de desarrollo de última generación y empaquetador ultra rápido para agilizar el flujo de trabajo local.
*   **TypeScript (Strict Mode):** Tipado estricto habilitado con la directiva `verbatimModuleSyntax` para forzar importaciones explícitas y prevenir errores de lógica en el tipado.
*   **Tailwind CSS:** Framework de diseño utilitario para la maquetación responsiva, estilización del modo oscuro y animaciones fluidas sin escribir CSS plano.
*   **React Router Dom v6:** Motor de enrutamiento centralizado para el manejo de rutas protegidas, redirecciones mediante `useNavigate` y lectura de query params en URL.
*   **React Hook Form:** Gestión eficiente del estado de los formularios, minimizando las re-renderizaciones y optimizando el rendimiento de las validaciones de datos.
*   **SweetAlert2:** Librería de alertas y ventanas emergentes estilizadas en sintonía con el diseño oscuro para mejorar la experiencia de usuario (UX).

---

## 📦 Estructura del Proyecto (Módulos Principales)

```text
src/
├── assets/             # Imágenes locales de los miembros del equipo y recursos estáticos
├── components/         # Componentes core y maquetados interactivos (Navbar, Footer, ScrollToTop)
├── context/            # Proveedores de estado global para la sesión del sistema (AuthContext)
├── pages/              # Vistas principales del enrutador (Inicio, NuestrasCanchas, ReservarTurnos)
├── App.tsx             # Enrutador centralizado y configuración jerárquica de rutas protegidas
└── main.tsx            # Punto de entrada de la aplicación y renderizado en el DOM
```

---

## 🚀 Instalación y Desarrollo Local

Para levantar el entorno de desarrollo en tu computadora, ejecutá la siguiente secuencia ordenada de comandos en tu terminal:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com
    cd FrontEnd-alquiler-cancha
    ```

2.  **Instalar las dependencias oficiales:**
    ```bash
    pnpm install
    ```

3.  **Iniciar el servidor de desarrollo local de Vite:**
    ```bash
    pnpm run dev
    ```
    *Abrí tu navegador en [http://localhost:5173](http://localhost:5173) para ver la aplicación corriendo en vivo.*


## 👥 Equipo de Desarrollo Frontend

*   Ángel Nader, Abel Almaraz, Fatima Alfaro


