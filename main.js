import "./src/style.css";

//Referencias al dom
const moviesContainer = document.querySelector("#movies-container");
const messageArea = document.querySelector("#message-area");
const searchInput = document.querySelector("#search-input");
const genreSelect = document.querySelector("#genre-select");

//Referencias a los elementos del modal
const movieModal = document.querySelector("#movie-modal");
const modalCloseButton = document.querySelector("#modal-close-btn");
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
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los géneros");
    }
    const data = await response.json();
    genresList = data.genres; //Guarda la lista de generos

    //Limpia y rellena el slector de generos
    genreSelect.innerHTML = `<option value="">Todos los géneros</option>`; //Opcion por defecto
    genresList.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    showMessage("Error al cargar los géneros", error);
  }
}

//Funcion principal para obtener y renderizar las peliculas
async function fetchAndRenderMovies(searchTerm = "", genreId = "") {
  moviesContainer.innerHTML = ""; //Limpia el contenedor de peliculas
  showMessage("Cargando películas...", "info");
  hideMessage();
  let url = "";
  if (searchTerm) {
    url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(
      searchTerm
    )}`;
  } else if (genreId) {
    url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&with_genres=${genreId}`;
  } else {
    url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener las películas");
    }
    const data = await response.json();
    const movies = data.results;

    moviesContainer.innerHTML = ""; //Limpia el contenedor de peliculas

    if (movies.length === 0) {
      showMessage("No se encontraron películas", "info");
      return;
    } else {
      movies.forEach((movie) => {
        const movieCard = renderMovieCard(movie);
        moviesContainer.appendChild(movieCard);
      });
      hideMessage(); // Oculta el mensaje de carga
    }
  } catch (error) {
    console.error(error);
    showMessage(
      "Error al cargar las películas. Por favor, intentalo de nuevo más tarde.",
      "error"
    );
    moviesContainer.innerHTML =
      '<p class="text-center text-red-500 col-span-full">No se pudieron cargar las películas.</p>';
  }
}

//Funciones para el modal de detalles de pelicula

async function openMovieDetailsModal(movieId) {
  try {
    //Muestra un mensaje de carga dentro del modal
    modalTitle.textContent = "Cargando detalles...";
    modalOverview.textContent = "";
    modalImage.src = TMDB_PLACEHOLDER_IMAGE;
    modalReleaseDate.textContent = "Fecha de lanzamiento: ...";
    modalRating.textContent = "Valoración: ...";
    movieModal.classList.remove("hidden"); //Muestra el fondo oscuro del modal

    //Obtener detalles completos de la pelicula
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los detalles de la película");
    }
    const movieDetails = await response.json();

    //Rellenar el modal con los detalles de la pelicula
    modalImage.src = movieDetails.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`
      : TMDB_PLACEHOLDER_IMAGE;
    modalTitle.textContent = movieDetails.title || "Titulo desconocido";
    modalReleaseDate.textContent = `Fecha de lanzamiento: ${
      movieDetails.release_date || "Fecha desconocida"
    }`;
    modalRating.textContent = `Valoración: ${
      movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : "N/A"
    } / 10`;
    modalOverview.textContent =
      movieDetails.overview || "No hay sinopsis disponible.";
  } catch (error) {
    console.error("Error al obtener detalles de la película:", error);
    showMessage(
      "Error al cargar los detalles de la película. Por favor, inténtalo de nuevo más tarde.",
      "error"
    );
    closeMovieDetailsModal();
  }
}

//Funcion para cerrar el modal
function closeMovieDetailsModal() {
  movieModal.classList.add("hidden"); //Oculta el fondo oscuro del modal
}

//Event Listeners

//Event Listener para el buscador ***Debounce aplicado***
searchInput.addEventListener(
  "input",
  debounce(() => {
    const searchTerm = searchInput.value.trim();
    genreSelect.value = ""; //Resetea el selector de generos
    fetchAndRenderMovies(searchTerm);
  }, 500)
); //Delay espera 500ms antes de ejecutar la funcion

//Event listener para el selector de generos
genreSelect.addEventListener("change", () => {
  const genreId = genreSelect.value;
  searchInput.value = ""; //Resetea el input de busqueda
  fetchAndRenderMovies("", genreId);
});

//Event listener para manejar clics en las tarjetas de peliculas
moviesContainer.addEventListener("click", (event) => {
  const target = event.target;
  //Si se hizo clic en el boton de ver detalles
  if (target.tagName === "BUTTON" && target.dataset.action === "view-details") {
    const movieId = target.dataset.id;
    openMovieDetailsModal(movieId);
  }
  //Si se hizo clic en la tarjeta de pelicula
  else {
    //Busca el padre mas cercano que sea una tarjeta de pelicula
    const movieCard = target.closest(".rounded-lg.shadow-lg.overflow-hidden");
    if (movieCard && movieCard.dataset.movieId) {
      const movieId = movieCard.dataset.movieId;
      openMovieDetailsModal(movieId);
    }
  }
});

//Event listener para cerrar el modal
modalCloseButton.addEventListener("click", closeMovieDetailsModal);


//Event listener para cerrar el modal al hacer clic fuera de el
movieModal.addEventListener("click", (event) => {
  if (event.target === movieModal) {
    // Si se hizo clic en el fondo del modal
    closeMovieDetailsModal();
  }
});

//Inicializar la aplicacion
document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderGenres();
  fetchAndRenderMovies(); // Carga las peliculas populares al inicio
});
// Nota: La funcion fetchAndRenderMovies se llama sin parametros para cargar las peliculas populares al inicio
// y se actualiza con los parametros de busqueda o genero cuando el usuario interactua con el buscador o el selector de generos.
// La funcion fetchAndRenderGenres se llama al inicio para cargar los generos disponibles en el selector.
