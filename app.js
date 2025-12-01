let animals = [];
let currentIndex = 0;
let currentSound = null;

const body = document.body;

// Cargar datos
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    animals = data;
    showCard(0);
  });

function getBackgroundClass(depth) {
  if (depth <= 100) return "ocean-surface";
  if (depth <= 500) return "ocean-mid";
  if (depth <= 2000) return "ocean-deep";
  return "ocean-abyss";
}

function showCard(index) {
  if (index < 0 || index >= animals.length) return;

  currentIndex = index;
  const a = animals[index];

  const card = document.getElementById("card");

  // Cambiar fondo animado
  body.className = "";
  body.classList.add(getBackgroundClass(a.profundidad));

  // Animación de aparición
  card.style.transform = "scale(0.5)";
  setTimeout(() => {
    card.innerHTML = `
      <img src="${a.imagen}" class="rounded-md w-full mb-3">
      <h2 class="text-2xl font-bold mb-1">${a.nombre}</h2>
      <p class="text-sm mb-2">${a.descripcion}</p>
      <p class="text-xs opacity-70 mb-3">Profundidad: ${a.profundidad}m</p>
      <button class="btn" onclick="open3D('${a.modelo}')">Ver modelo 3D</button>
      <button class="btn" onclick="openAR('${a.modelo}')">Ver en AR</button>
      <button id="playSound" class="nav-btn text-sm px-4 py-2">🔊 Reproducir sonido</button>
    `;

    card.style.transform = "scale(1)";

    currentSound = new Howl({ src: [a.audio] });

    document.getElementById("playSound").onclick = () => currentSound.play();
  }, 200);
}


// Navegación
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentIndex < animals.length - 1) showCard(currentIndex + 1);
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentIndex > 0) showCard(currentIndex - 1);
});


// Barra lateral por profundidad
document.querySelectorAll(".depth-option").forEach(btn => {
  btn.addEventListener("click", () => {
    const depth = Number(btn.getAttribute("data-depth"));
    const index = animals.findIndex(a => a.profundidad >= depth);
    if (index !== -1) showCard(index);
  });

});

 /* Modal visor 3D */
function open3D(path) {
    document.getElementById("viewer").src = path;
    document.getElementById("modal3D").style.display = "flex";
}
function close3D() {
    document.getElementById("modal3D").style.display = "none";
}

/* Modo AR con marcador */
function openAR(modelPath) {
    window.open("ar.html?model=" + encodeURIComponent(modelPath));
}

