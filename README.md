# ⚽ Canchas Ya - FrontEnd 🚀

¡Bienvenido al repositorio del frontend de **Canchas Ya**!

Canchas Ya es una plataforma web diseñada para facilitar la reserva de canchas deportivas y contribuir a la digitalización del deporte amateur en Tucumán. El sistema permite a los usuarios consultar canchas disponibles y gestionar sus reservas, mientras que los complejos deportivos cuentan con herramientas para administrar sus servicios y turnos.

El proyecto está desarrollado mediante una arquitectura modular basada en componentes reutilizables y utiliza TypeScript para mejorar la seguridad de tipos, facilitar el mantenimiento del código y favorecer su escalabilidad.

---

## 🎨 Características principales

- **Reserva de turnos interactiva:** interfaz de selección de horarios mediante una grilla adaptable que facilita la consulta y elección de turnos.
- **Promociones automatizadas:** cálculo de un 20 % de descuento correspondiente a la promoción nocturna, aplicable de lunes a jueves después de las 22:00 h, según las condiciones establecidas.
- **Navegación entre páginas:** gestión de rutas y redirecciones, incluyendo el restablecimiento de la posición de desplazamiento al navegar.
- **Formularios de autenticación:** pantallas de inicio de sesión y registro con validación de campos y funcionalidades de autenticación.
- **Diseño adaptable:** interfaz en modo oscuro, uso de recursos gráficos SVG y estilos responsivos para diferentes tamaños de pantalla.
- **Gestión administrativa:** funcionalidades destinadas a la administración de canchas, categorías, productos, reservas y usuarios.

---

## 🛠️ Stack tecnológico y librerías utilizadas

El frontend de Canchas Ya utiliza las siguientes tecnologías y herramientas:

- **React 19:** biblioteca para construir interfaces de usuario mediante componentes reutilizables.
- **Vite:** herramienta de desarrollo y compilación que permite ejecutar el proyecto localmente y generar los archivos optimizados para producción.
- **TypeScript:** lenguaje que incorpora tipado estático a JavaScript y facilita la detección de errores de tipos durante el desarrollo.
- **Tailwind CSS:** framework de clases utilitarias utilizado para implementar estilos, diseños responsivos y la interfaz visual.
- **React Router DOM v7:** biblioteca de enrutamiento para gestionar la navegación entre páginas, las redirecciones y los parámetros de las URL.
- **React Hook Form:** biblioteca para gestionar formularios, sus estados y validaciones.
- **SweetAlert2:** biblioteca utilizada para mostrar alertas, mensajes y ventanas de confirmación.

---

## 📂 Estructura del proyecto

La aplicación está organizada en módulos para facilitar el desarrollo y mantenimiento de sus funcionalidades.

```text
FrontEnd-Alquiler-cancha/
├── public/
│   ├── _redirects
│   ├── favicon2.svg
│   └── icons.svg
├── src/
│   ├── assets/                  # Imágenes y recursos estáticos
│   │   └── Nosotros/
│   ├── components/              # Componentes y funcionalidades
│   │   ├── NuestrasCanchas/
│   │   └── panelAdmin/
│   │       ├── canchas/
│   │       ├── categorias/
│   │       ├── productos/
│   │       ├── reservas/
│   │       └── usuarios/
│   ├── context/                 # Contextos globales
│   ├── pages/                   # Páginas de la aplicación
│   ├── App.tsx                  # Configuración de rutas
│   ├── main.tsx                 # Punto de entrada de React
│   └── index.css                # Estilos globales
├── .env.example                 # Plantilla de variables de entorno
├── .env                         # Configuración local (ignorada por Git)
├── .gitignore                   # Archivos excluidos de Git
├── eslint.config.js             # Configuración de ESLint
├── index.html                   # Documento HTML principal
├── package.json                 # Dependencias y scripts
├── pnpm-lock.yaml               # Versiones bloqueadas de dependencias
├── pnpm-workspace.yaml          # Configuración del workspace
├── tsconfig.json                # Configuración general de TypeScript
├── tsconfig.app.json            # Configuración TypeScript de la aplicación
├── tsconfig.node.json           # Configuración TypeScript para Node.js
└── vite.config.ts               # Configuración de Vite
```

### Organización de carpetas

- **`assets/`:** almacena imágenes y recursos estáticos utilizados en la interfaz.
- **`components/`:** contiene componentes de interfaz y funcionalidades relacionadas con formularios, carrito, reservas, canchas y administración.
- **`context/`:** gestiona estados compartidos entre diferentes componentes mediante React Context.
- **`pages/`:** reúne las páginas principales de la aplicación, como contacto, perfil y resultados de pago.
- **`public/`:** contiene archivos públicos y recursos de configuración para el despliegue.

---

## 🚀 Instalación y desarrollo local

### Requisitos previos

Para ejecutar el frontend de Canchas Ya es necesario contar con:

- Node.js compatible con la versión de Vite instalada.
- pnpm como gestor de paquetes.
- Acceso al backend de Canchas Ya, ya sea local o publicado.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Angeln0294/FrontEnd-Alquiler-cancha.git
cd FrontEnd-Alquiler-cancha
```

### 2. Instalar las dependencias

```bash
pnpm install
```

### 3. Configurar las variables de entorno

El proyecto utiliza variables de entorno para establecer la comunicación entre el frontend y el backend.

Crear una copia del archivo `.env.example` y renombrarla como `.env`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Para trabajar con el backend local, configurar la siguiente variable dentro del archivo `.env`:

```env
VITE_BACKEND_URL=http://localhost:3003
```

Si se desea utilizar el backend publicado, reemplazar el valor por la dirección HTTPS correspondiente.

El archivo `.env` está excluido del control de versiones mediante `.gitignore` y no debe subirse al repositorio.

### 4. Ejecutar el servidor de desarrollo

```bash
pnpm run dev
```

Abrir en el navegador la dirección indicada por Vite, normalmente:

http://localhost:5173

---

## 🌐 Configuración y compilación de producción

Para el entorno de producción, el frontend debe utilizar la dirección HTTPS pública del backend, en lugar de una dirección local.

La variable de entorno correspondiente es:

```env
VITE_BACKEND_URL=https://backend-alquiler-canchas.onrender.com
```

En la plataforma de alojamiento del frontend, configurar `VITE_BACKEND_URL` como variable de entorno disponible durante la compilación.

### Generar la compilación de producción

Ejecutar el siguiente comando:

```bash
pnpm build
```

Este comando realiza la comprobación de TypeScript y genera los archivos de producción en el directorio `dist/`.

Para visualizar localmente la compilación generada, ejecutar:

```bash
pnpm preview
```

**Importante:** Vite incorpora las variables con prefijo `VITE_` durante la compilación. Si se modifica `VITE_BACKEND_URL` en la plataforma de alojamiento, es necesario volver a compilar y desplegar el frontend para aplicar el cambio.

Las variables con prefijo `VITE_` son accesibles desde el código del navegador, por lo que no deben utilizarse para almacenar contraseñas, claves privadas ni otros datos sensibles.

---

## 👥 Equipo de desarrollo frontend

- Angel Nader
- Abel Almaraz
- Fatima Alfaro