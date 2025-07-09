import "./src/style.css";

//Referencias al dom
const moviesContainer = document.querySelector("#movies-container");
const messageArea = document.querySelector("#message-area");
const searchInput = document.querySelector("#search-input");
const genreSelect = document.querySelector("#genre-select");

//Referencias a los elementos del modal
const movieModal = document.querySelector("#movie-modal");
const modalCloseButton = document.querySelector("#modal-close-button");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalReleaseDate = document.querySelector("#modal-release-date");
const modalRating = document.querySelector("#modal-rating");
const modalOverview = document.querySelector("#modal-overview");

//Referencias de la Apikey TMDB
const TMDB_API_KEY = "48e2687c38e644a1fbdf7bd3b07687d7";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_PLACEHOLDER_IMAGE =
  "https://placehold.co/500x750/333333/FFFFFF?text=No+Poster";

//Almacenar lista de generos

let genresList = [];

//Funcion para el buscador
//Evita que la funcion se ejecute demasiadas veces mientras el usuario escribe

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

//Funcion para mostrar mensajes (carga, error)
function showMessage(message, type = "info") {
  messageArea.textContent = message;
  messageArea.classList.remove(
    "hidden",
    "text-red-500",
    "text-green-500",
    "text-gray-500"
  );
  if (type === "error") {
    messageArea.classList.add("text-red-500");
  } else if (type === "success") {
    messageArea.classList.add("text-green-500");
  } else {
    messageArea.classList.add("text-gray-500");
  }
  messageArea.classList.remove("hidden");
}

//Funcion para ocultar mensajes
function hideMessage() {
  messageArea.classList.add("hidden");
  messageArea.textContent = "";
}

//Funcion para renderizar una sola tarjeta de pelicula
function renderMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.className = `bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer hover:shadow-2xl`;
  movieCard.dataset.movieId = movie.id; //Guarda el ID de la pelicula para el modal

  //Evalua con un ternario si la pelicula tiene un poster
  const imageUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : TMDB_PLACEHOLDER_IMAGE; // Usa la imagen del poster o una imagen de placeholder si no hay poster

  movieCard.innerHTML = `
    <img src= "${imageUrl}" alt"${
    movie.title || "Pelicula sin titulo"
  }" class="w-full h-64 object-cover">
    <div class= "p-4
    <h3 class="text-xl font-bold text-gray-100 mb-2 truncate">${
      movie.title || "Titulo desconocido"
    }</h3>
    <p class="text-sm text-gray-400">
      Lanzamiento: ${
        movie.release_date ? movie.release_date : "Fecha desconocida"
      }
      </p>
      <p class="text-sm text-yellow-400 mt-1 font-semibold">
      Valoracion: ${
        movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
      } / 10
    </p>
    <button class="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800" data-id= "${
      movie.id
    }" data-action="view-details">
      Ver Detalles
    </button>
  `;
  return movieCard;
}

//Funcion para obtener y renderizar las peliculas en el selector de generos
async function fetchAndRenderGenres() {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error("Error al obtener los géneros");
    }
    const data = await response.json();
    genresList = data.genres; //Guarda la lista de generos

    //Limpia y rellena el slector de generos
    genreSelect.innerHTML = `<option value="">Todos los géneros</option>`; //Opcion por defecto
    genresList.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
      
    });

  } catch (error) {
    console.error(error);
    showMessage("Error al cargar los géneros", "error");
  }
}

