
import {
    urlBase,
    template,
    sections,
    animationFrames,
    ready,
} from "./src/JS/data.JS";

/* --- Función principal para mostrar un personaje --- */
const show1Character = async (e) => {
    const mainCard = e.target; // Tarjeta principal que activa la interacción
    const groupName = mainCard.parentNode.parentNode.id; // ID del grupo de personajes
    const section = sections[groupName]; // Sección correspondiente al grupo
    const count = section.counter.next(); // Obtener el siguiente ID del personaje

    // Detener si se completó el conteo
    if (count.done) return;

    // Cambiar el estado de la tarjeta a "cargando"
    mainCard.querySelector(".circle-inside").classList.add("loading");

    // Obtener el ID del personaje y los datos asociados
    const characterId = count.value;
    const characterJsonFormat = await get1Character(characterId);

    // Crear la tarjeta del personaje
    const card = createElementCard(characterJsonFormat);
    const row = e.target.parentNode;

    // Restaurar el estado original de la tarjeta principal
    mainCard.querySelector(".circle-inside").classList.remove("loading");

    // Añadir la tarjeta al DOM y animarla
    const newCard = card.children[0];
    row.append(card);
    newCard.animate(animationFrames, { duration: 200 });

    // Actualizar el estado de la tarjeta principal si se completaron todos los personajes
    if (count.value === section.lastId) {
        mainCard.querySelector(".circle-inside").textContent = "✓";
        mainCard.querySelector("h2").textContent = "Todos...";
        mainCard.querySelector("p").textContent =
            "los personajes de esta sección ya han sido desplegados.";
    }
};

/* --- Obtener los datos de un personaje desde la API --- */
const get1Character = async (characterId) => {
    let characterJsonFormat = null;

    try {
        const answer = await fetch(`${urlBase}${characterId}`);
        checkIfFetchAnswerIsOk(answer);
        characterJsonFormat = await answer.json(); // Convertir la respuesta a JSON
    } catch (error) {
        console.error(`Error al obtener el personaje: ${error}`);
    } finally {
        return characterJsonFormat;
    }
};

/* --- Verificar si la respuesta de la API es válida --- */
const checkIfFetchAnswerIsOk = (answer) => {
    if (!answer?.ok) {
        throw new Error(
            `Error al consultar el ID ${characterId}: estado ${answer.status}`
        );
    }
};

/* --- Crear un elemento de tarjeta con los datos del personaje --- */
const createElementCard = (characterJsonFormat) => {
    const clone = template.content.cloneNode(true); // Clonar el template
    const characterId = characterJsonFormat?.id || "Error";

    // Asignar datos a la tarjeta
    clone.querySelector(".circle-inside").textContent = characterId;

    if (characterJsonFormat) {
        const characterName = characterJsonFormat.name;
        const characterMeasurements = `Altura: ${characterJsonFormat.height}cm Peso: ${
            characterJsonFormat.mass.replace(",", ".")
        }kg`;

        clone.querySelector("h3").textContent = characterName;
        clone.querySelector("p").textContent = characterMeasurements;
    } else {
        // Si hay un error, mostrar información de error en la tarjeta
        clone.querySelector("h3").textContent = "Error";
        clone.querySelector("p").textContent =
            "Ver la consola para averiguar el error.";
        clone.children[0].classList.add("error");
    }

    return clone;
};

/* --- Asignar eventos cuando el DOM esté listo --- */
ready(() => {
    document
        .querySelectorAll(".main-card")
        .forEach((card) => card.addEventListener("mouseenter", show1Character));
});