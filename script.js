const scene = new THREE.Scene();

// ==========================
// CAMERA
// ==========================
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 3;

// ==========================
// RENDERER
// ==========================
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xf2f7ff);

document.body.appendChild(renderer.domElement);

// ==========================
// 🌍 CORE SPHERE
// ==========================
const geometry = new THREE.SphereGeometry(1, 128, 128);
const original = geometry.attributes.position.array.slice();

const material = new THREE.PointsMaterial({
  size: 0.02,
  color: 0x009dff,
  transparent: true,
  opacity: 0.95
});

const earth = new THREE.Points(geometry, material);
scene.add(earth);

// ==========================
// 🛰 ORBITS (FIXED PROPERLY)
// ==========================
const orbitGroup = new THREE.Group();
scene.add(orbitGroup);

const orbitData = [];
const ORBIT_COUNT = 3;

for (let o = 0; o < ORBIT_COUNT; o++) {

  const radius = 1.5 + o * 0.35;

  // главный контейнер орбиты
  const orbitSystem = new THREE.Group();

  // 🔥 ВАЖНО: базовая горизонтальная плоскость (XZ)
  orbitSystem.rotation.x = 0;

  // небольшой наклон (как у планет)
  orbitSystem.rotation.z = o * 0.35;

  orbitGroup.add(orbitSystem);

  // ================= ORBIT LINE =================
  const points = [];

  for (let i = 0; i <= 200; i++) {

    const angle = (i / 200) * Math.PI * 2;

    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    );
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0x66ccff,
    transparent: true,
    opacity: 0.25
  });

  const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  orbitSystem.add(orbitLine);

  // ================= ORBIT POINTS =================
  const pointsOnOrbit = [];

  const pointCount = 4 + o;

  for (let p = 0; p < pointCount; p++) {

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00d9ff })
    );

    orbitSystem.add(mesh);

    pointsOnOrbit.push({
      mesh,
      speed: 0.3 + Math.random() * 0.5,
      offset: (Math.PI * 2 / pointCount) * p,
      radius
    });
  }

  orbitData.push({
    system: orbitSystem,
    points: pointsOnOrbit,
    baseRotationZ: orbitSystem.rotation.z
  });
}

// ==========================
// ANIMATION
// ==========================
function animate() {

  requestAnimationFrame(animate);

  const time = Date.now() * 0.0015;

  // sphere rotation
  earth.rotation.y += 0.002;

  // ==========================
  // ORBIT GROUP MOTION (soft global drift)
  // ==========================
  orbitGroup.rotation.y += 0.0008;

  // ==========================
  // ORBIT SYSTEM ANIMATION
  // ==========================
  orbitData.forEach((orbit, i) => {

    // 🌊 мягкое "дыхание" наклона
    orbit.system.rotation.z =
      orbit.baseRotationZ + Math.sin(time + i) * 0.08;

    orbit.system.rotation.y += 0.0005;

    orbit.points.forEach((p) => {

      const angle = time * p.speed + p.offset;

      // строго по окружности
      const x = Math.cos(angle) * p.radius;
      const z = Math.sin(angle) * p.radius;

      // лёгкое вертикальное движение
      const y = Math.sin(angle * 2 + time) * 0.05;

      p.mesh.position.set(x, y, z);
    });

  });

  // ==========================
  // SPHERE WAVE
  // ==========================
  const pos = geometry.attributes.position;

  for (let i = 0; i < pos.count; i++) {

    const ix = i * 3;

    const x = original[ix];
    const y = original[ix + 1];
    const z = original[ix + 2];

    const wave = Math.sin(time + x * 5 + y * 5) * 0.02;

    pos.setXYZ(i,
      x * (1 + wave),
      y * (1 + wave),
      z * (1 + wave)
    );
  }

  pos.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

// ==========================
// RESIZE
// ==========================
window.addEventListener("resize", () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});