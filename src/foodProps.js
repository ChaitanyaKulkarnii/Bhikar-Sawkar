// 3D Authentic Indian Tabletop Snacks: Samosas, Vada Pav, Cutting Chai, Steel Plates & Steam Particles
import * as THREE from 'three';

// Shared PBR Materials
const steelPlateMaterial = new THREE.MeshStandardMaterial({
  color: 0xE4E8F0,
  metalness: 0.94,
  roughness: 0.18
});

const samosaPastryMaterial = new THREE.MeshStandardMaterial({
  color: 0xC8832A, // Golden-brown crispy fried pastry
  roughness: 0.55,
  metalness: 0.04
});

const samosaCrimpMaterial = new THREE.MeshStandardMaterial({
  color: 0xA4621A, // Darker toasted crimped pastry seam
  roughness: 0.62,
  metalness: 0.02
});

const pavDoughMaterial = new THREE.MeshStandardMaterial({
  color: 0xE8CFAB, // Soft pillowy bread crumb
  roughness: 0.82
});

const pavCrustMaterial = new THREE.MeshStandardMaterial({
  color: 0xB87428, // Golden-brown buttery toasted pav top
  roughness: 0.50,
  metalness: 0.06
});

const batataVadaMaterial = new THREE.MeshStandardMaterial({
  color: 0xDDA426, // Turmeric gram-flour (besan) golden crispy batter
  roughness: 0.60,
  metalness: 0.04
});

const redChutneyMaterial = new THREE.MeshStandardMaterial({
  color: 0x9E2414, // Spicy dry garlic (lasun) chutney powder
  roughness: 0.92
});

const greenChilliMaterial = new THREE.MeshStandardMaterial({
  color: 0x3E7D22, // Glossy blistered fried green chilli
  roughness: 0.30,
  metalness: 0.08
});

const chilliStemMaterial = new THREE.MeshStandardMaterial({
  color: 0x2A4E16,
  roughness: 0.65
});

const saltSpeckMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  roughness: 0.2
});

// 1. Classic Indian Stainless Steel Plate (Thali)
export function createSteelThali(radius = 0.155) {
  const plate = new THREE.Group();

  // Circular base with slight dish depression
  const baseGeo = new THREE.CylinderGeometry(radius, radius * 0.92, 0.005, 32);
  const baseMesh = new THREE.Mesh(baseGeo, steelPlateMaterial);
  baseMesh.position.y = 0.0025;
  baseMesh.receiveShadow = true;
  plate.add(baseMesh);

  // Raised rolled lip/rim (Classic stainless steel dinnerware rim)
  const rimGeo = new THREE.TorusGeometry(radius, 0.007, 12, 40);
  const rimMesh = new THREE.Mesh(rimGeo, steelPlateMaterial);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = 0.008;
  rimMesh.castShadow = true;
  rimMesh.receiveShadow = true;
  plate.add(rimMesh);

  // Beveled inner rim ring
  const innerRingGeo = new THREE.TorusGeometry(radius * 0.88, 0.003, 8, 36);
  const innerRingMesh = new THREE.Mesh(innerRingGeo, steelPlateMaterial);
  innerRingMesh.rotation.x = Math.PI / 2;
  innerRingMesh.position.y = 0.005;
  plate.add(innerRingMesh);

  return plate;
}

// 2. Golden Triangular Samosa
export function createSamosa() {
  const samosa = new THREE.Group();

  // Pyramidal 3-sided fried pastry body
  const bodyGeo = new THREE.ConeGeometry(0.045, 0.065, 3);
  const bodyMesh = new THREE.Mesh(bodyGeo, samosaPastryMaterial);
  bodyMesh.position.y = 0.032;
  bodyMesh.scale.set(1.15, 1.0, 0.95);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  samosa.add(bodyMesh);

  // Crimped base seam
  const crimpGeo = new THREE.TorusGeometry(0.042, 0.0055, 6, 3);
  const crimpMesh = new THREE.Mesh(crimpGeo, samosaCrimpMaterial);
  crimpMesh.rotation.x = Math.PI / 2;
  crimpMesh.position.y = 0.004;
  crimpMesh.castShadow = true;
  samosa.add(crimpMesh);

  // Golden fried crust blisters
  const blisterGeo = new THREE.SphereGeometry(0.006, 6, 6);
  const blisterMat = new THREE.MeshStandardMaterial({ color: 0x935216, roughness: 0.5 });
  
  [
    [0.015, 0.025, 0.02],
    [-0.018, 0.035, 0.01],
    [0.005, 0.048, -0.015]
  ].forEach(([x, y, z]) => {
    const blister = new THREE.Mesh(blisterGeo, blisterMat);
    blister.position.set(x, y, z);
    blister.scale.set(1.4, 0.6, 1.2);
    samosa.add(blister);
  });

  return samosa;
}

// 3. Iconic Mumbai Vada Pav
export function createVadaPav() {
  const vadaPav = new THREE.Group();

  // Bottom Pav Bun (sliced soft bread)
  const botGeo = new THREE.CylinderGeometry(0.052, 0.048, 0.020, 18);
  const botMesh = new THREE.Mesh(botGeo, pavDoughMaterial);
  botMesh.position.y = 0.010;
  botMesh.castShadow = true;
  vadaPav.add(botMesh);

  // Batata Vada Patty (Deep fried spiced potato ball coated in golden besan)
  const vadaGeo = new THREE.SphereGeometry(0.042, 16, 14);
  const vadaMesh = new THREE.Mesh(vadaGeo, batataVadaMaterial);
  vadaMesh.position.set(0, 0.034, 0);
  vadaMesh.scale.set(1.15, 0.72, 1.15);
  vadaMesh.castShadow = true;
  vadaPav.add(vadaMesh);

  // Spicy Dry Garlic (Lasun) Chutney powder sprinkled inside
  const chutneyGeo = new THREE.TorusGeometry(0.046, 0.006, 8, 18);
  const chutneyMesh = new THREE.Mesh(chutneyGeo, redChutneyMaterial);
  chutneyMesh.rotation.x = Math.PI / 2;
  chutneyMesh.position.y = 0.022;
  vadaPav.add(chutneyMesh);

  // Top Pav Bun (Glazed dome bun)
  const topGeo = new THREE.SphereGeometry(0.054, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.54);
  const topMesh = new THREE.Mesh(topGeo, pavCrustMaterial);
  topMesh.position.y = 0.038;
  topMesh.castShadow = true;
  vadaPav.add(topMesh);

  // Bread slice seam
  const seamGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.006, 18);
  const seamMesh = new THREE.Mesh(seamGeo, pavDoughMaterial);
  seamMesh.position.y = 0.036;
  vadaPav.add(seamMesh);

  return vadaPav;
}

// 4. Fried Salted Green Chilli (Taleli Mirchi)
export function createFriedMirchi() {
  const mirchi = new THREE.Group();

  // Tapered curved chilli body
  const bodyGeo = new THREE.CylinderGeometry(0.006, 0.0018, 0.075, 10);
  const bodyMesh = new THREE.Mesh(bodyGeo, greenChilliMaterial);
  bodyMesh.rotation.z = Math.PI / 2;
  bodyMesh.position.set(0.03, 0.006, 0);
  bodyMesh.castShadow = true;
  mirchi.add(bodyMesh);

  // Stalk / stem
  const stemGeo = new THREE.CylinderGeometry(0.0025, 0.0025, 0.022, 6);
  const stemMesh = new THREE.Mesh(stemGeo, chilliStemMaterial);
  stemMesh.rotation.z = Math.PI / 2 + 0.35;
  stemMesh.position.set(-0.015, 0.010, 0);
  mirchi.add(stemMesh);

  // Coarse salt crystals along fried slit
  for (let s = 0; s < 4; s++) {
    const salt = new THREE.Mesh(
      new THREE.BoxGeometry(0.002, 0.002, 0.002),
      saltSpeckMaterial
    );
    salt.position.set(0.01 + s * 0.012, 0.011, (Math.random() - 0.5) * 0.004);
    salt.rotation.set(Math.random(), Math.random(), 0);
    mirchi.add(salt);
  }

  return mirchi;
}

// 5. Complete Samosa & Mirchi Steel Platter
export function createSamosaPlatter() {
  const group = new THREE.Group();

  // Steel plate
  const plate = createSteelThali(0.165);
  group.add(plate);

  // Samosa 1
  const s1 = createSamosa();
  s1.position.set(-0.045, 0.005, -0.02);
  s1.rotation.y = 0.35;
  s1.rotation.z = -0.06;
  group.add(s1);

  // Samosa 2
  const s2 = createSamosa();
  s2.position.set(0.052, 0.005, 0.025);
  s2.rotation.y = -1.15;
  s2.rotation.z = 0.08;
  group.add(s2);

  // Fried Mirchi 1
  const m1 = createFriedMirchi();
  m1.position.set(-0.02, 0.006, 0.075);
  m1.rotation.y = 0.45;
  group.add(m1);

  // Fried Mirchi 2
  const m2 = createFriedMirchi();
  m2.position.set(0.035, 0.006, 0.095);
  m2.rotation.y = -0.25;
  group.add(m2);

  return group;
}

// 6. Complete Vada Pav & Mirchi Steel Platter
export function createVadaPavPlatter() {
  const group = new THREE.Group();

  // Steel plate
  const plate = createSteelThali(0.165);
  group.add(plate);

  // Vada Pav 1
  const vp1 = createVadaPav();
  vp1.position.set(-0.048, 0.004, -0.015);
  vp1.rotation.y = 0.25;
  group.add(vp1);

  // Vada Pav 2
  const vp2 = createVadaPav();
  vp2.position.set(0.052, 0.004, 0.025);
  vp2.rotation.y = -0.75;
  group.add(vp2);

  // Fried Mirchi 1
  const m1 = createFriedMirchi();
  m1.position.set(-0.015, 0.006, 0.08);
  m1.rotation.y = 0.6;
  group.add(m1);

  // Fried Mirchi 2
  const m2 = createFriedMirchi();
  m2.position.set(0.04, 0.006, 0.095);
  m2.rotation.y = -0.15;
  group.add(m2);

  return group;
}

// 7. Dynamic Animated Steam / Smoke Particle System
export class SteamParticleSystem {
  constructor(scene, emitterConfigs) {
    this.scene = scene;
    this.emitters = emitterConfigs; // array of { pos: Vector3, particleCount: number, maxRadius: number }
    this.particles = [];

    // Shared soft steam material with additive blending for natural vapor look
    const steamMat = new THREE.MeshBasicMaterial({
      color: 0xEEF3F8,
      transparent: true,
      opacity: 0.20,
      depthWrite: false
    });

    const steamGeo = new THREE.SphereGeometry(0.012, 8, 8);

    // Create particle pools for each emitter
    this.emitters.forEach((emitter) => {
      const count = emitter.particleCount || 16;
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(steamGeo, steamMat.clone());
        mesh.visible = true;
        this.scene.add(mesh);

        const maxLife = 1.6 + Math.random() * 0.9;
        const initialLife = Math.random() * maxLife;

        const pObj = {
          mesh,
          emitterPos: emitter.pos,
          life: initialLife,
          maxLife,
          speedY: 0.075 + Math.random() * 0.045,
          driftAngle: Math.random() * Math.PI * 2,
          driftSpeed: 0.015 + Math.random() * 0.02,
          radius: emitter.maxRadius || 0.035
        };

        this.particles.push(pObj);
      }
    });
  }

  update(delta, time) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.life += delta;

      // Reset when particle reaches end of lifetime
      if (p.life >= p.maxLife) {
        p.life = 0;
        p.driftAngle = Math.random() * Math.PI * 2;
        p.speedY = 0.075 + Math.random() * 0.045;
      }

      const progress = p.life / p.maxLife;

      // Soft natural opacity bell curve (fade in as it rises from hot food, fade out at top)
      let opacity = 0;
      if (progress < 0.25) {
        opacity = (progress / 0.25) * 0.22;
      } else {
        opacity = 0.22 * (1 - (progress - 0.25) / 0.75);
      }
      p.mesh.material.opacity = Math.max(0, opacity);

      // Steam expands as it disperses upward
      const scale = 1.0 + progress * 3.2;
      p.mesh.scale.set(scale, scale * 1.3, scale);

      // Curling organic motion
      const curlX = Math.sin(time * 2.5 + p.driftAngle) * p.driftSpeed * progress;
      const curlZ = Math.cos(time * 2.2 + p.driftAngle) * p.driftSpeed * progress;

      p.mesh.position.set(
        p.emitterPos.x + curlX + Math.sin(p.driftAngle) * p.radius * 0.5,
        p.emitterPos.y + progress * 0.24,
        p.emitterPos.z + curlZ + Math.cos(p.driftAngle) * p.radius * 0.5
      );
    }
  }

  dispose() {
    this.particles.forEach((p) => {
      this.scene.remove(p.mesh);
      if (p.mesh.geometry) p.mesh.geometry.dispose();
      if (p.mesh.material) p.mesh.material.dispose();
    });
    this.particles = [];
  }
}
