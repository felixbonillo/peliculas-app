🎬 CineSphere: Tu Universo Cinematográfico
🚀 Descripción del Proyecto
CineSphere es una aplicación web interactiva diseñada para explorar el vasto mundo del cine. Permite a los usuarios buscar películas, filtrar por género y navegar a través de los resultados mediante un sistema de paginación intuitivo. Al hacer clic en una película, se muestra un modal con detalles adicionales como la fecha de lanzamiento, la puntuación y una sinopsis.

Este proyecto ha sido desarrollado con un enfoque en la simplicidad, la eficiencia y una experiencia de usuario fluida, utilizando tecnologías modernas de frontend para un diseño responsivo y atractivo.

✨ Características Principales
Búsqueda de Películas: Encuentra tus películas favoritas por título.

Filtrado por Género: Explora películas por categorías específicas (acción, comedia, drama, etc.).

Paginación Dinámica: Navega fácilmente entre las diferentes páginas de resultados.

Detalles de Película (Modal): Visualiza información ampliada de cada película en un modal interactivo.

Diseño Responsivo: Interfaz adaptada para funcionar y lucir bien en cualquier dispositivo, desde móviles hasta escritorios.

Feedback Visual: Mensajes de carga y error para una mejor experiencia de usuario.

🛠️ Tecnologías Utilizadas
Este proyecto está construido exclusivamente con tecnologías de frontend, comunicándose con la API de The Movie Database (TMDB).

Categoría

Tecnología

Logo

Descripción

Frontend

HTML5

<img src="https://placehold.co/60x60/000000/FFFFFF?text=HTML5" alt="Logo de HTML5" width="60" height="60">

Estructura el contenido de la aplicación.



JavaScript (Vanilla)

<img src="https://placehold.co/60x60/000000/FFFFFF?text=JS" alt="Logo de JavaScript" width="60" height="60">

Proporciona la interactividad y la lógica del cliente.



Tailwind CSS

<img src="https://placehold.co/60x60/000000/FFFFFF?text=Tailwind" alt="Logo de Tailwind CSS" width="60" height="60">

Framework CSS de utilidad para un diseño rápido y responsivo.



Fetch API

<img src="https://placehold.co/60x60/000000/FFFFFF?text=Fetch" alt="Logo de Fetch API" width="60" height="60">

Para realizar peticiones HTTP a la API de TMDB.

API Externa

TMDB API

<img src="https://placehold.co/60x60/000000/FFFFFF?text=TMDB" alt="Logo de TMDB" width="60" height="60">

Fuente de datos para películas y géneros.

⚙️ Requisitos
Para ejecutar este proyecto localmente, solo necesitas un navegador web moderno. Sin embargo, para el desarrollo y la gestión de dependencias, se recomienda tener:

Node.js (versión 14.x o superior recomendada)

npm (viene con Node.js) o Yarn

🚀 Instalación y Uso
Sigue estos pasos para configurar y ejecutar CineSphere en tu máquina local:

Clona el repositorio:

git clone https://github.com/felixbonillo/peliculas-app.git
cd peliculas-libros-app


Instala las dependencias (si usas Vite para desarrollo):

npm install
# o si usas yarn
# yarn install

Configura tu API Key de TMDB:

Obtén una API Key gratuita de The Movie Database (TMDB).

Abre el archivo main.js (ubicado en la raíz de tu proyecto o en src/main.js si usas una estructura Vite).

Busca la línea const TMDB_API_KEY = 'TU_API_KEY_TMDB'; y reemplaza 'TU_API_KEY_TMDB' con tu clave real.

Ejecuta la aplicación:

Si estás usando Vite para el desarrollo (como sugiere la estructura de tus archivos):

npm run dev
# o si usas yarn
# yarn dev

Esto iniciará un servidor de desarrollo local (normalmente en http://localhost:5173/). Abre esta URL en tu navegador.

Si solo quieres abrir el archivo HTML directamente (menos recomendado para desarrollo con módulos):

Simplemente abre el archivo index.html en tu navegador. Ten en cuenta que algunas funcionalidades (como las peticiones fetch para APIs externas) pueden tener restricciones de CORS si abres el archivo directamente sin un servidor local.

📁 Estructura del Proyecto
peliculas-libros-app/
├── public/                 # Archivos estáticos (HTML, CSS, JS) si usas Vite
│   ├── index.html          # La interfaz de usuario principal
│   └── vite.svg            # Icono por defecto de Vite
├── src/                    # Contiene el CSS principal
│   └── style.css           # Estilos CSS (importa Tailwind)
├── main.js                 # Lógica JavaScript principal de la aplicación
├── postcss.config.js       # Configuración de PostCSS para Tailwind (si usas Vite)
├── package.json            # Metadatos del proyecto y dependencias
├── vite.config.js          # Configuración de Vite
└── README.md               # Este archivo

📞 Contacto
Si tienes alguna pregunta o sugerencia, no dudes en contactarme:

Nombre: Felix Bonillo

Email: felix.bonillo3@gmail.com

LinkedIn: https://www.linkedin.com/in/felix-bonillo-b9368936b/

GitHub: https://github.com/felixbonillo
