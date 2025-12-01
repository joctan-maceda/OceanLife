// Cargar datos
fetch("data.json")
  .then(res => res.json())
  .then(data => renderCards(data));

function renderCards(data) {
  const container = document.getElementById("cards-container");

  data.forEach(animal => {
    const card = document.createElement("div");
    card.className = "card shadow-md";
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-depth", animal.profundidad);

    card.innerHTML = `
      <img src="${animal.imagen}" class="rounded-md w-full mb-3">
      <h2 class="text-xl font-bold">${animal.nombre}</h2>
      <p class="text-sm mb-2">${animal.descripcion}</p>
      <p class="text-xs opacity-70 mb-3">Profundidad: ${animal.profundidad}m</p>

      <button class="play-btn bg-sky-600 px-3 py-1 rounded text-sm">
        Reproducir sonido
      </button>
    `;

    const sound = new Howl({
      src: [animal.audio]
    });

    card.querySelector(".play-btn").addEventListener("click", () => {
      sound.play();
    });

    container.appendChild(card);
  });
}


// CAMBIO DE FONDO SEGÚN SCROLL
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const max = document.body.scrollHeight - window.innerHeight;

  let percent = scrollY / max;

  document.body.style.background = 
    `linear-gradient(to bottom, 
      rgba(60,150,255,1), 
      rgba(0,0,50, ${percent})
    )`;
});
