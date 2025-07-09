// Importa tu archivo CSS de Tailwind
import "./src/style.css";

// Referencias a elementos del DOM
const moviesContainer = document.querySelector("#movies-container");
const messageArea = document.querySelector("#message-area");
const searchInput = document.querySelector("#search-input");
const genreSelect = document.querySelector("#genre-select");

// Referencias a los elementos del modal
const movieModal = document.querySelector("#movie-modal");
const modalCloseButton = document.querySelector("#modal-close-btn");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalReleaseDate = document.querySelector("#modal-release-date");
const modalRating = document.querySelector("#modal-rating");
const modalOverview = document.querySelector("#modal-overview");

// Referencias a elementos del DOM de paginacion
const prevPageButton = document.querySelector("#prev-page-btn");
const nextPageButton = document.querySelector("#next-page-btn");
const pageInput = document.querySelector("#page-input");
const totalPagesSpan = document.querySelector("#total-pages-span");

// Referencias de la Apikey TMDB
const TMDB_API_KEY = "48e2687c38e644a1fbdf7bd3b07687d7";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_PLACEHOLDER_IMAGE =
  "https://placehold.co/500x750/333333/FFFFFF?text=No+Poster";

// Almacenar lista de generos
let genresList = [];

// Estados para la paginacion
let currentPage = 1; // Pagina actual
let totalPages = 1; // Total de paginas

// Función para el buscador (debounce)
// Evita que la función se ejecute demasiadas veces mientras el usuario escribe
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// Función para mostrar mensajes (carga, error)
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

// Función para ocultar mensajes
function hideMessage() {
  messageArea.classList.add("hidden");
  messageArea.textContent = "";
}

// Función para renderizar una sola tarjeta de pelicula
function renderMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.className = `bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer hover:shadow-2xl`;
  movieCard.dataset.movieId = movie.id; // Guarda el ID de la pelicula para el modal

  // Evalua con un ternario si la pelicula tiene un poster
  const imageUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : TMDB_PLACEHOLDER_IMAGE; // Usa la imagen del poster o una imagen de placeholder si no hay poster

  movieCard.innerHTML = `
        <img src="${imageUrl}" alt="${
    movie.title || "Pelicula sin titulo"
  }" class="w-full h-64 object-cover">
        <div class="p-4">
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
            <button class="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800" data-id="${
              movie.id
            }" data-action="view-details">
                Ver Detalles
            </button>
        </div>
    `;
  return movieCard;
}

// Función para obtener y renderizar los géneros en el selector
async function fetchAndRenderGenres() {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Mensaje de error más específico
    }
    const data = await response.json();
    genresList = data.genres; // Guarda la lista de generos

    // Limpia y rellena el selector de generos
    genreSelect.innerHTML = `<option value="">Todos los géneros</option>`; // Opcion por defecto
    genresList.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar los géneros:", error); // Log más descriptivo
    showMessage("Error al cargar los géneros.", "error"); // Muestra el mensaje de error en la UI
  }
}

// Función para actualizar el estado de los botones de paginación
function updatePaginationControls() {
  pageInput.value = currentPage; // Actualiza el input de pagina actual
  totalPagesSpan.textContent = `de ${totalPages}`; // Actualiza el total de paginas
  prevPageButton.disabled = currentPage === 1; // Deshabilita el boton de pagina anterior si estamos en la primera pagina
  nextPageButton.disabled = currentPage === totalPages; // Deshabilita el boton de pagina siguiente si estamos en la ultima pagina
  console.log(`Paginación actualizada: Página ${currentPage} de ${totalPages}`); // Log de depuración
}

// Función principal para obtener y renderizar las peliculas
async function fetchAndRenderMovies(searchTerm = "", genreId = "", page = 1) {
  moviesContainer.innerHTML = ""; // Limpia el contenedor de peliculas
  showMessage("Cargando películas...", "info");
  // hideMessage(); // No ocultar aquí, ya que showMessage lo hace

  let url = "";
  if (searchTerm) {
    url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(
      searchTerm
    )}&page=${page}`;
  } else if (genreId) {
    url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&with_genres=${genreId}&page=${page}`;
  } else {
    url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}`;
  }

  console.log(`Intentando cargar películas desde URL: ${url}`); // Log de depuración

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text(); // Intenta leer el cuerpo del error
      console.error(
        `Error HTTP! Estado: ${response.status}, Mensaje: ${errorText}`
      );
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    const movies = data.results;

    // ¡CORREGIDO! Actualiza el estado de paginación con los datos de la API
    currentPage = data.page;
    totalPages = data.total_pages;
    updatePaginationControls(); // Llama a la función para actualizar los botones y el input

    moviesContainer.innerHTML = ""; // Limpia el mensaje de carga/error del contenedor de películas

    if (movies.length === 0) {
      showMessage(
        "No se encontraron películas con los criterios seleccionados.",
        "info"
      );
      // No hay return aquí para que la paginación se actualice correctamente incluso si no hay resultados
    } else {
      movies.forEach((movie) => {
        const movieCard = renderMovieCard(movie);
        moviesContainer.appendChild(movieCard);
      });
      hideMessage(); // Oculta el mensaje de carga si hay películas
    }
  } catch (error) {
    console.error("Error al cargar las películas:", error);
    showMessage(
      "Error al cargar las películas. Por favor, inténtalo de nuevo más tarde.",
      "error"
    );
    moviesContainer.innerHTML =
      '<p class="text-center text-red-500 col-span-full">No se pudieron cargar las películas.</p>';
  }
}

// Funciones para el modal de detalles de pelicula
async function openMovieDetailsModal(movieId) {
  try {
    // Muestra un mensaje de carga dentro del modal
    modalTitle.textContent = "Cargando detalles...";
    modalOverview.textContent = "";
    modalImage.src = TMDB_PLACEHOLDER_IMAGE;
    modalReleaseDate.textContent = "Fecha de lanzamiento: ...";
    modalRating.textContent = "Valoración: ...";
    movieModal.classList.remove("hidden"); // Muestra el fondo oscuro del modal

    // Obtener detalles completos de la pelicula
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Mensaje de error más específico
    }
    const movieDetails = await response.json();

    // Rellenar el modal con los detalles de la pelicula
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

// Función para cerrar el modal
function closeMovieDetailsModal() {
  movieModal.classList.add("hidden"); // Oculta el modal
}

// Event Listeners

// Event Listener para el buscador (debounce aplicado)
searchInput.addEventListener(
  "input",
  debounce(() => {
    currentPage = 1; // Reinicia la página a 1 al buscar
    const searchTerm = searchInput.value.trim();
    genreSelect.value = ""; // Resetea el selector de generos
    fetchAndRenderMovies(searchTerm, "", currentPage); // ¡CORREGIDO! Pasa currentPage
  }, 500)
);

// Event listener para el selector de generos
genreSelect.addEventListener("change", () => {
  currentPage = 1; // Reinicia la página a 1 al filtrar por género
  const genreId = genreSelect.value;
  searchInput.value = ""; // Resetea el input de busqueda
  fetchAndRenderMovies("", genreId, currentPage); // ¡CORREGIDO! Pasa currentPage
});

// Event listener para manejar clics en las tarjetas de peliculas
moviesContainer.addEventListener("click", (event) => {
  const target = event.target;
  // Si se hizo clic en el boton de ver detalles
  if (target.tagName === "BUTTON" && target.dataset.action === "view-details") {
    const movieId = target.dataset.id;
    openMovieDetailsModal(movieId);
  }
  // Si se hizo clic en la tarjeta de pelicula
  else {
    // Busca el padre mas cercano que sea una tarjeta de pelicula
    const movieCard = target.closest(".rounded-lg.shadow-lg.overflow-hidden");
    if (movieCard && movieCard.dataset.movieId) {
      const movieId = movieCard.dataset.movieId;
      openMovieDetailsModal(movieId);
    }
  }
});

// Event listener para cerrar el modal
modalCloseButton.addEventListener("click", closeMovieDetailsModal);

// Event listener para cerrar el modal al hacer clic fuera de el
movieModal.addEventListener("click", (event) => {
  if (event.target === movieModal) {
    // Si se hizo clic en el fondo del modal
    closeMovieDetailsModal();
  }
});

// Event listener para los botones de paginacion
prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    const searchTerm = searchInput.value;
    const genreId = genreSelect.value;
    fetchAndRenderMovies(searchTerm, genreId, currentPage);
  }
});

nextPageButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    const searchTerm = searchInput.value;
    const genreId = genreSelect.value;
    fetchAndRenderMovies(searchTerm, genreId, currentPage);
  }
});

// Event listener para el input de pagina
pageInput.addEventListener("change", (event) => {
  let newPage = parseInt(event.target.value);
  if (isNaN(newPage) || newPage < 1) {
    newPage = 1; // Si el valor no es un número o es menor que 1, se establece en 1
  } else if (newPage > totalPages) {
    newPage = totalPages; // Si el valor es mayor que el total de paginas, se establece en el total de paginas
  }
  currentPage = newPage; // Actualiza la pagina actual
  const searchTerm = searchInput.value;
  const genreId = genreSelect.value;
  fetchAndRenderMovies(searchTerm, genreId, currentPage);
  // updatePaginationControls(); // No es necesario llamar aquí, ya se llama en fetchAndRenderMovies
});

// Inicializar la aplicacion
document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderGenres();
  fetchAndRenderMovies("", "", currentPage); // ¡CORREGIDO! Pasa currentPage para la carga inicial
});
