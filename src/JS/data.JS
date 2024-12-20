// URL base para la API
export const urlBase = "https://swapi.tech/api/people/";

// Template para las tarjetas de personajes
export const template = document.querySelector("#characterCard");

/**
 * Generador de contador
 
  @param {number} from - Inicio del rango.
  @param {number} until - Fin del rango.
 */

export function* counter(from, until) {
  for (let i = from; i <= until; i++) {
    yield i;
  }
  return "end";
}

// Grupos de IDs de personajes
 export const sections = {
  "first-group": { firstId: 1, lastId: 5 },
  "second-group": { firstId: 6, lastId: 10 },
  "third-group": { firstId: 11, lastId: 15 },
  "fourth-group": { firstId: 16, lastId: 20 },
};

// Asocia el generador `counter` a cada grupo en `sections`
for (const section in sections) {
  sections[section].counter = counter(
    sections[section].firstId,
    sections[section].lastId
  );
}

/* Animaciones de aparición*/
export const animationFrames = [
  { opacity: "0", transform: "scale(0)" },
  { opacity: "1", transform: "scale(1)" },
];

export function ready(aFunction) {
  if (document.readyState !== "loading") {
    aFunction();
  } else {
    document.addEventListener("DOMContentLoaded", aFunction);
  }
}