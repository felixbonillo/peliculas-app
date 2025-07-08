// peliculas-libros-app/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Busca en el index.html en la raíz del proyecto
    "./main.js",    // Busca en main.js EN LA RAÍZ del proyecto
    "./src/**/*.{js,ts,jsx,tsx}", // Busca en cualquier JS/TS/JSX/TSX dentro de la carpeta src (si aún tienes otros archivos ahí)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
