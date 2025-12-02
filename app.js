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
      <button class="nav-btn" onclick="open3D('${a.modelo}')">Ver modelo 3D</button>
      <button class="nav-btn" onclick="openAR('${a.modelo}')">Ver en AR</button>
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

/////////////////////////////////////////////////////////////////////////
// Barra lateral por profundidad
/////////////////////////////////////////////////////////////////////////

const depthBar = document.getElementById("depthBar");
const depthIndicator = document.getElementById("depthIndicator");

// Permite profundidades reales del océano
const MAX_DEPTH = 4000;

depthBar.addEventListener("click", (event) => {
    const rect = depthBar.getBoundingClientRect();

    // Posición del click en porcentaje (0 = arriba, 1 = abajo)
    const y = (event.clientY - rect.top) / rect.height;

    const targetDepth = Math.floor(y * MAX_DEPTH);

    moveIndicator(y);
    goToDepth(targetDepth); 
});

// Mueve la línea blanca (indicador)
function moveIndicator(relativeY) {
    const barHeight = depthBar.offsetHeight;
    const finalY = relativeY * (barHeight - 10); 
    depthIndicator.style.transform = `translateY(${finalY}px)`;
}

// Cambia a la carta del animal más cercano a la profundidad dada
function goToDepth(depthRequested) {
    let bestIndex = 0;
    let bestDiff = Infinity;

    animales.forEach((a, i) => {
        let d = Math.abs(a.profundidad - depthRequested);
        if (d < bestDiff) {
            bestDiff = d;
            bestIndex = i;
        }
    });

    currentIndex = bestIndex;
    mostrarAnimal(currentIndex);
}




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

