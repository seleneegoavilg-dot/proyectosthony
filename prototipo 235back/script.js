 document.addEventListener("DOMContentLoaded", () => {const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.volume = 0.5;
    bgMusic.play().catch(() => {
      // Si el navegador bloquea el autoplay sin clic previo, suena al primer toque
      document.addEventListener("click", () => bgMusic.play(), { once: true });
    });
  }
  // Generar partículas amarillo neón
  const particlesContainer = document.getElementById("particles-container");
  if (particlesContainer) {
    for (let i = 0; i < 35; i++) {
      const p = document.createElement("div");
      p.classList.add("neon-particle");
      const size = Math.random() * 6 + 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}vw`;
      p.style.animationDuration = `${Math.random() * 6 + 5}s`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      particlesContainer.appendChild(p);
    }
  }

  // Referencias de pantallas
  const loaderScreen = document.getElementById("loader-screen");
  const packScreen = document.getElementById("pack-screen");
  const secretCardScreen = document.getElementById("secret-card-screen");
  const bouquetScreen = document.getElementById("bouquet-screen");

  // Elementos interactivos
  const progressFill = document.getElementById("progress-fill");
  const boosterPack = document.getElementById("booster-pack");
  const holoCard = document.getElementById("holo-card");
  const btnToBouquet = document.getElementById("btn-to-bouquet");
  const btnViewSecret = document.getElementById("btn-view-secret");
  const chatBubble = document.getElementById("chat-bubble");
  const botAvatar = document.getElementById("bot-avatar");

  function switchScreen(hide, show) {
    hide.classList.remove("active");
    setTimeout(() => {
      show.classList.add("active");
    }, 300);
  }

  // 1. SIMULACIÓN DE CARGA INICIAL
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += 5;
    progressFill.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        switchScreen(loaderScreen, packScreen);
        chatBubble.textContent = "¡Sobre listo! Rasga la parte superior para abrirlo ✂️";
      }, 400);
    }
  }, 90);

  // 2. ABRIR EL SOBRE (BOOSTER PACK)
  boosterPack.addEventListener("click", () => {
    const bgMusic = document.getElementById("bg-music");
    if (bgMusic) {
      bgMusic.volume = 0.5; // Volumen al 50% para que no aturda
      bgMusic.play();
    }
    // ... aquí sigue tu código normal de abrir el sobre
    boosterPack.classList.add("ripped");
    
    chatBubble.textContent = "¡WOOOW! ¡Es una carta de rareza ÚNICA en el universo! ✨";
    setTimeout(() => {
      switchScreen(packScreen, secretCardScreen);
    }, 800);
  });

  // 3. EFECTO 3D HOLOGRÁFICO EN LA CARTA SECRETA
  holoCard.addEventListener("mousemove", (e) => {
    const rect = holoCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    holoCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  holoCard.addEventListener("mouseleave", () => {
    holoCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  });

  // 4. NAVEGACIÓN AL RAMO Y REGRESO A LA CARTA
  btnToBouquet.addEventListener("click", () => {
    switchScreen(secretCardScreen, bouquetScreen);
    chatBubble.textContent = "¡Mira! Las cartas han florecido especialmente para ti 💜🤖";
  });

  btnViewSecret.addEventListener("click", () => {
    switchScreen(bouquetScreen, secretCardScreen);
  });

  // 5. FRASES DE CHAT v1 AL TOCARLO
  const botPhrases = [
    "Las Pokéballs y Masterballs guardan un mensaje especial para ti ✨",
    "Soy CHAT v1 y certifico que hacen el mejor equipo 🤖✨",
    "Pasa el cursor o tu dedo sobre las cartas para verlas de cerca 🔍"
  ];
  let phraseIndex = 0;

  botAvatar.addEventListener("click", () => {
    chatBubble.textContent = botPhrases[phraseIndex];
    phraseIndex = (phraseIndex + 1) % botPhrases.length;
  });
});
