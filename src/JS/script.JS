const baseUrl = "https://swapi.tech/api/people/";

// Función para obtener personajes únicos de la API
async function fetchCharacter(id) {
  try {
    const response = await fetch(`${baseUrl}${id}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const { result } = await response.json();
    return result.properties;
  } catch (error) {
    console.error(`Error al obtener el personaje ${id}:`, error);
    return null;
  }
}

// Crear una tarjeta de personaje
function createCharacterCard(character) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <h3>${character.name || "Desconocido"}</h3>
    <p>Estatura: ${character.height || "N/A"} cm</p>
    <p>Peso: ${character.mass || "N/A"} kg</p>
    <small>Género: ${character.gender || "N/A"}</small>
  `;
  return card;
}

// Generar las tarjetas para los personajes
async function generateCardsForRange(start, end) {
  const cardsContainer = document.querySelector(".cards");
  cardsContainer.innerHTML = "<h2>Cargando personajes...</h2>";

  const characterPromises = [];
  for (let id = start; id <= end; id++) {
    characterPromises.push(fetchCharacter(id));
  }

  // Esperar a que se completen todas las solicitudes
  const characters = (await Promise.all(characterPromises)).filter(Boolean);

  // Limpiar contenedor y mostrar tarjetas
  cardsContainer.innerHTML = "";
  if (characters.length) {
    characters.forEach((character) => {
      const card = createCharacterCard(character);
      cardsContainer.appendChild(card);
    });
  } else {
    cardsContainer.innerHTML = "<h2>No se encontraron personajes en este rango.</h2>";
  }
}

// Manejar clic en los rangos
function setupRangeListeners() {
  document.querySelectorAll(".range").forEach((rangeElement) => {
    rangeElement.addEventListener("click", async (e) => {
      const [start, end] = e.currentTarget.dataset.range.split("-").map(Number);
      const charactersContainer = document.querySelector(".characters");

      charactersContainer.innerHTML = "<h2>Cargando personajes...</h2>";

      // Obtener personajes dentro del rango
      const characters = [];
      for (let id = start; id <= end; id++) {
        const character = await fetchCharacter(id);
        if (character) characters.push(character);
      }

      // Mostrar personajes
      charactersContainer.innerHTML = "";
      if (characters.length) {
        characters.forEach((character) => {
          const card = createCharacterCard(character);
          charactersContainer.appendChild(card);
        });
      } else {
        charactersContainer.innerHTML = "<h2>No se encontraron personajes.</h2>";
      }
    });
  });
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", setupRangeListeners);