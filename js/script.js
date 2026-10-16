// Configuración de la escena Three.js
const canvas = document.getElementById("webgl-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

camera.position.set(0, 5, 15);

// --- CONTROLES DE CÁMARA 360° ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enabled = false;

// --- 1. FONDO DE ESTRELLAS DESTELLANTES ---
const starCount = 2000;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 130;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    transparent: true,
    opacity: 0.9
});
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// --- 2. GALAXIA ESPIRAL MORADA ---
const galaxyGroup = new THREE.Group();
const particleCount = 12000;
const galaxyGeometry = new THREE.BufferGeometry();
const galaxyPositions = new Float32Array(particleCount * 3);
const galaxyColors = new Float32Array(particleCount * 3);

const colorInside = new THREE.Color('rgb(70, 36, 90)');
const colorOutside = new THREE.Color('hsl(267, 87%, 49%)');

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 8.5 + 0.5;
    const spinAngle = radius * 2.2;
    const branchAngle = ((i % 4) * Math.PI * 2) / 4;

    const randomX = (Math.random() - 0.5) * 0.35 * radius;
    const randomY = (Math.random() - 0.5) * 0.2 * radius;
    const randomZ = (Math.random() - 0.5) * 0.35 * radius;

    galaxyPositions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    galaxyPositions[i3 + 1] = randomY;
    galaxyPositions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / 8.5);

    galaxyColors[i3] = mixedColor.r;
    galaxyColors[i3 + 1] = mixedColor.g;
    galaxyColors[i3 + 2] = mixedColor.b;
}

galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

const galaxyMaterial = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending
});

const galaxyParticles = new THREE.Points(galaxyGeometry, galaxyMaterial);
galaxyGroup.add(galaxyParticles);

// --- 3. CORAZÓN 3D FLOTANTE ---
const heartParticleCount = 1300;
const heartGeometry = new THREE.BufferGeometry();
const heartPositions = new Float32Array(heartParticleCount * 3);

for (let i = 0; i < heartParticleCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const u = (Math.random() - 0.5) * Math.PI;

    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    const z = u * 4;

    const scale = 0.085;
    heartPositions[i * 3] = x * scale + (Math.random() - 0.5) * 0.1;
    heartPositions[i * 3 + 1] = y * scale + (Math.random() - 0.5) * 0.1;
    heartPositions[i * 3 + 2] = z * scale + (Math.random() - 0.5) * 0.1;
}

heartGeometry.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));
const heartMaterial = new THREE.PointsMaterial({
    color: 0xe67e22,
    size: 0.1,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.95
});

const heartMesh = new THREE.Points(heartGeometry, heartMaterial);
heartMesh.position.set(0, 1.8, 0);
galaxyGroup.add(heartMesh);

// Configuración inicial de la galaxia
galaxyGroup.position.y = -1;
galaxyGroup.rotation.x = 0.35;
galaxyGroup.scale.set(0.01, 0.01, 0.01);
galaxyMaterial.opacity = 0;
galaxyGroup.visible = false;
scene.add(galaxyGroup);

// --- 4. FUNCIÓN PARA CREAR TEXTOS FLOTANTES ---
function createTextSprite(text) {
    const textCanvas = document.createElement('canvas');
    const ctx = textCanvas.getContext('2d');
    textCanvas.width = 512;
    textCanvas.height = 128;

    ctx.font = 'Bold 42px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgb(47, 7, 63)';
    ctx.shadowBlur = 15;
    ctx.fillText(text, 256, 70);

    const texture = new THREE.CanvasTexture(textCanvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(3.2, 0.8, 1);
    return sprite;
}

// Frases flotantes que rodean la galaxia
const floatingPhrases = [" FELIZCUMPLE AMOR :3 🎉 ", "TEAMOO MUCHO ✨", " MIMESEROFAVORITO 💖 ", " NUESTROUNIVERSO 🌌 ",
" PARAELMEJORNOVIO 💖 "," QHOYLAPASESSUPER:D ","💖💖💖💖💖",
 " ORGULOSADETUSLOGROS "," MI NIÑOBONITO:3 "];
floatingPhrases.forEach((phrase, idx) => {
    const sprite = createTextSprite(phrase);
    const angle = (idx / floatingPhrases.length) * Math.PI * 2 + 0.5;
    const radius = 6.8;
    sprite.position.set(Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius);
    galaxyGroup.add(sprite);
});

// --- 5. TUS 6 POKÉMON EN ÓRBITA ---
// --- 10 POKÉMON EN ÓRBITA ---
const cardsData = [
    // --- 6 Interiores ---
    { name: "Gengar", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png", msg: "¡Contigo las risas nunca faltan! 💜", radius: 4.8 },
    { name: "Giratina", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/487.png", msg: "crearemos nuestro propio universo particulaxparticula asi como nuestro hogar✨", radius: 4.8 },
    { name: "Hydreigon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/635.png", msg: "¡Tienes la energía para lograr lo que te propongas! 🐉", radius: 4.8 },
    { name: "Aegislash", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/681.png", msg: "Siempre admiro cada logro que haces y tu determinacion para hacerlo⚔️", radius: 4.8 },
    { name: "Heracross", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/214.png", msg: "seremos solo los dos en este universo que cree💪", radius: 4.8 },
    { name: "Fuecoco", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/909.png", msg: "¡no sabes como me encanta tu sonrisa :3", radius: 4.8 },

    // --- 4 Exteriores (En la orilla) ---
    { name: "Totodile", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png", msg: "no encontraras a nadie que te ame tanto como yo🐊💙", radius: 7.2 },
    { name: "Horsea", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/116.png", msg: "me gustan tus besos sabor a chocolate🌊✨", radius: 7.2 },
    { name: "Grimer Shiny", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/88.png", msg: "siempre tendre algo debajo en la manga para demostrarte mi amor 💚✨", radius: 7.2 },
    { name: "Tyrunt Shiny", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/696.png", msg: "con esto te deseo un muy feliz cumpleaños💙🦖", radius: 7.2 }
];
const interactiveObjects = [];
cardsData.forEach((data, index) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(data.img, (texture) => {
        const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        const geo = new THREE.PlaneGeometry(1.2, 1.2);
        const mesh = new THREE.Mesh(geo, mat);

        mesh.userData = {
            ...data,
            angle: (index / cardsData.length) * Math.PI * 2,
            radius: data.radius || 10// Usa el radio propio de cada Pokémon
        };

        galaxyGroup.add(mesh);
        interactiveObjects.push(mesh);
    });
});
// --- ANIMACIÓN / RENDER LOOP ---
let isZooming = false;
let galaxyAppearing = false;

function animate() {
    requestAnimationFrame(animate);

    starField.rotation.y += 0.0003;

    // Viaje al pulsar botón
    if (isZooming) {
        starField.scale.x += 0.1;
        starField.scale.y += 0.1;
        starField.scale.z += 0.12;

        if (camera.position.z > 9) {
            camera.position.z -= 0.1;
        } else {
            isZooming = false;
            starField.visible = false;
            galaxyGroup.visible = true;
            galaxyAppearing = true;
        }
    }

    // Galaxia aparece suavemente
    if (galaxyAppearing) {
        if (galaxyGroup.scale.x < 1) {
            galaxyGroup.scale.x += 0.015;
            galaxyGroup.scale.y += 0.015;
            galaxyGroup.scale.z += 0.015;
            galaxyMaterial.opacity = Math.min(galaxyMaterial.opacity + 0.02, 1);
        } else {
            galaxyAppearing = false;
            controls.enabled = true;
        }
    }

    // Animaciones continuas dentro de la galaxia
    if (galaxyGroup.visible) {
        galaxyParticles.rotation.y += 0.0018;

        // Palpitar del corazón
        const time = Date.now() * 0.002;
        heartMesh.rotation.y += 0.005;
        heartMesh.scale.setScalar(1 + Math.sin(time * 2) * 0.08);

        // Órbita fluida de las 6 tarjetas Pokémon
        interactiveObjects.forEach((obj) => {
            obj.userData.angle += 0.0035;
            obj.position.x = Math.cos(obj.userData.angle) * obj.userData.radius;
            obj.position.z = Math.sin(obj.userData.angle) * obj.userData.radius;
            obj.position.y = Math.sin(obj.userData.angle * 2) * 0.3;
            obj.lookAt(camera.position);
        });
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

// --- LÓGICA DE INTERACCIÓN ---
const startBtn = document.getElementById("start-button");
const welcomeScreen = document.getElementById("welcome-screen");
const modal = document.getElementById("card-modal");

startBtn.addEventListener("click", () => {
    // 1. Obtener y reproducir la música de fondo
    const music = document.getElementById("background-music");
    if (music) {
        music.volume = 0.8; // Volumen al 80%
        music.play().catch(error => console.log("Error al reproducir audio:", error));
    }

    // 2. Ocultar pantalla de bienvenida e iniciar zoom
    welcomeScreen.classList.add("hidden");
    isZooming = true;
});
// Clic en las tarjetas Pokémon
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
    if (!galaxyGroup.visible) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        const clickedObj = intersects[0].object.userData;
        document.getElementById("modal-title").innerText = clickedObj.name;
        document.getElementById("modal-image").src = clickedObj.img;
        document.getElementById("modal-text").innerText = clickedObj.msg;
        modal.classList.remove("hidden");
    }
});

document.getElementById("close-modal-btn").addEventListener("click", () => {
    modal.classList.add("hidden");
});

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});