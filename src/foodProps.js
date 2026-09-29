// 3D Realistic Indian Tabletop Snacks: Mumbai Vada Pav, Samosas, Cutting Chai, Steel Thali & Gentle Steam
import * as THREE from 'three';

// Realistic PBR Food & Tableware Materials
const steelPlateMaterial = new THREE.MeshStandardMaterial({
  color: 0xE8ECF2,
  metalness: 0.95,
  roughness: 0.16
});

const katoriBowlMaterial = new THREE.MeshStandardMaterial({
  color: 0x1E222A, // Dark stoneware/steel dip bowl as in reference image
  metalness: 0.65,
  roughness: 0.35
});

// Pav (Bread Bun) Materials
const pavCrustMaterial = new THREE.MeshStandardMaterial({
  color: 0xBA6B22, // Warm golden-brown baked bakery crust
  roughness: 0.62,
  metalness: 0.02
});

const pavInnerCrumbMaterial = new THREE.MeshStandardMaterial({
  color: 0xF8F1E4, // Soft, fluffy, pale cream bakery bread crumb interior
  roughness: 0.95
});

const pavSideCrumbMaterial = new THREE.MeshStandardMaterial({
  color: 0xECD8BA, // Pale wheat pull-apart bread edge
  roughness: 0.88
});

// Batata Vada (Potato Patty) Materials
const batataVadaMaterial = new THREE.MeshStandardMaterial({
  color: 0xE6A522, // Vibrant golden-yellow turmeric gram-flour (besan) batter
  roughness: 0.58,
  metalness: 0.04
});

const batataVadaToastedMaterial = new THREE.MeshStandardMaterial({
  color: 0xAC6814, // Crispy toasted fried besan crust patches & blisters
  roughness: 0.65
});

const churaCrumbMaterial = new THREE.MeshStandardMaterial({
  color: 0xD8961E, // Crispy fried besan droplets / boondi flakes
  roughness: 0.60
});

// Chutneys & Spices
const redGarlicChutneyMaterial = new THREE.MeshStandardMaterial({
  color: 0xDC3814, // Fiery bright orange-red coarse dry garlic (lasun) chutney powder
  roughness: 0.95
});

const greenChutneyMaterial = new THREE.MeshStandardMaterial({
  color: 0x3E7A1E, // Zesty fresh mint-coriander green chutney spread
  roughness: 0.85
});

// Fried Green Chilli (Taleli Mirchi)
const greenChilliMaterial = new THREE.MeshStandardMaterial({
  color: 0x34721D, // Glossy blistered fried green chilli skin
  roughness: 0.28,
  metalness: 0.06
});

const chilliStemMaterial = new THREE.MeshStandardMaterial({
  color: 0x224412,
  roughness: 0.70
});

const saltCrystalMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  roughness: 0.15
});

// Samosa Materials
const samosaPastryMaterial = new THREE.MeshStandardMaterial({
  color: 0xC8832A, // Golden-brown crispy fried pastry
  roughness: 0.55,
  metalness: 0.04
});

const samosaCrimpMaterial = new THREE.MeshStandardMaterial({
  color: 0xA4621A, // Toasted crimped pastry seam
  roughness: 0.62,
  metalness: 0.02
});

// 1. Classic Indian Stainless Steel Plate (Thali)
export function createSteelThali(radius = 0.16) {
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

// 2. Fried Salted Green Chilli (Taleli Mirchi)
export function createFriedMirchi() {
  const mirchi = new THREE.Group();

  // Curved tapered chilli body
  const bodyGeo = new THREE.CylinderGeometry(0.0055, 0.0016, 0.075, 10);
  const bodyMesh = new THREE.Mesh(bodyGeo, greenChilliMaterial);
  bodyMesh.rotation.z = Math.PI / 2;
  bodyMesh.position.set(0.03, 0.005, 0);
  bodyMesh.castShadow = true;
  mirchi.add(bodyMesh);

  // Stem / stalk
  const stemGeo = new THREE.CylinderGeometry(0.0022, 0.0022, 0.022, 6);
  const stemMesh = new THREE.Mesh(stemGeo, chilliStemMaterial);
  stemMesh.rotation.z = Math.PI / 2 + 0.35;
  stemMesh.position.set(-0.015, 0.009, 0);
  mirchi.add(stemMesh);

  // Coarse salt crystals along fried slit
  for (let s = 0; s < 5; s++) {
    const salt = new THREE.Mesh(
      new THREE.BoxGeometry(0.0018, 0.0018, 0.0018),
      saltCrystalMaterial
    );
    salt.position.set(0.01 + s * 0.011, 0.009, (Math.random() - 0.5) * 0.0035);
    salt.rotation.set(Math.random(), Math.random(), 0);
    mirchi.add(salt);
  }

  return mirchi;
}

// 3. Realistic Mumbai Vada Pav (Modeled accurately from reference photo)
export function createRealisticVadaPav() {
  const vp = new THREE.Group();

  // ==========================================
  // A. BOTTOM PAV BUN (Square/rectangular soft bakery bun)
  // ==========================================
  const botBunGroup = new THREE.Group();

  // Soft bread base
  const botBaseGeo = new THREE.BoxGeometry(0.076, 0.018, 0.076);
  const botBase = new THREE.Mesh(botBaseGeo, pavSideCrumbMaterial);
  botBase.position.y = 0.009;
  botBase.castShadow = true;
  botBunGroup.add(botBase);

  // Open fluffy white crumb interior on top surface
  const crumbGeo = new THREE.BoxGeometry(0.072, 0.003, 0.072);
  const crumbMesh = new THREE.Mesh(crumbGeo, pavInnerCrumbMaterial);
  crumbMesh.position.y = 0.019;
  botBunGroup.add(crumbMesh);

  // Zesty green mint-coriander chutney spread on bottom crumb
  const greenSpreadGeo = new THREE.BoxGeometry(0.062, 0.002, 0.062);
  const greenSpread = new THREE.Mesh(greenSpreadGeo, greenChutneyMaterial);
  greenSpread.position.y = 0.021;
  botBunGroup.add(greenSpread);

  vp.add(botBunGroup);

  // ==========================================
  // B. BATATA VADA PATTY (Golden turmeric deep-fried potato dumpling)
  // ==========================================
  const vadaGroup = new THREE.Group();
  vadaGroup.position.set(0, 0.024, 0.004);

  // Main plump potato ball with turmeric besan batter
  const vadaCoreGeo = new THREE.SphereGeometry(0.028, 18, 14);
  const vadaCore = new THREE.Mesh(vadaCoreGeo, batataVadaMaterial);
  vadaCore.scale.set(1.22, 0.85, 1.15);
  vadaCore.castShadow = true;
  vadaGroup.add(vadaCore);

  // Authentic bumpy fried besan lumps & toasted blister spots
  const blisterGeo = new THREE.SphereGeometry(0.012, 10, 8);
  const blisters = [
    { pos: [0.018, 0.010, 0.016], scale: [1.2, 0.7, 0.9], mat: batataVadaToastedMaterial },
    { pos: [-0.020, 0.008, 0.012], scale: [1.1, 0.8, 1.0], mat: batataVadaMaterial },
    { pos: [0.006, 0.016, -0.018], scale: [0.9, 0.6, 1.1], mat: batataVadaToastedMaterial },
    { pos: [-0.012, -0.008, 0.022], scale: [1.3, 0.7, 0.8], mat: batataVadaMaterial }
  ];

  blisters.forEach(({ pos, scale, mat }) => {
    const bMesh = new THREE.Mesh(blisterGeo, mat);
    bMesh.position.set(...pos);
    bMesh.scale.set(...scale);
    vadaGroup.add(bMesh);
  });

  // Crispy fried besan droplets ("chura" / "boondi" bits) around vada base
  for (let c = 0; c < 6; c++) {
    const chura = new THREE.Mesh(
      new THREE.SphereGeometry(0.0035, 6, 6),
      churaCrumbMaterial
    );
    const angle = (c / 6) * Math.PI * 2;
    chura.position.set(
      Math.cos(angle) * 0.032,
      -0.015,
      Math.sin(angle) * 0.030
    );
    vadaGroup.add(chura);
  }

  // ==========================================
  // C. DRY RED GARLIC (LASUN) CHUTNEY DUSTING
  // ==========================================
  // Generous cluster of fiery orange-red garlic chutney powder on top of the vada
  const chutneyTopGeo = new THREE.SphereGeometry(0.016, 12, 8);
  const chutneyTop = new THREE.Mesh(chutneyTopGeo, redGarlicChutneyMaterial);
  chutneyTop.position.set(0, 0.022, 0.004);
  chutneyTop.scale.set(1.4, 0.35, 1.25);
  vadaGroup.add(chutneyTop);

  // Granular chutney crumbs sprinkled around
  for (let g = 0; g < 8; g++) {
    const crumb = new THREE.Mesh(
      new THREE.BoxGeometry(0.003, 0.0025, 0.003),
      redGarlicChutneyMaterial
    );
    crumb.position.set(
      (Math.random() - 0.5) * 0.036,
      0.020 + Math.random() * 0.005,
      (Math.random() - 0.5) * 0.034
    );
    crumb.rotation.set(Math.random(), Math.random(), 0);
    vadaGroup.add(crumb);
  }

  // ==========================================
  // D. FRIED GREEN CHILLI TUCKED IN VADA PAV (as in photo)
  // ==========================================
  const mirchiOnVada = createFriedMirchi();
  mirchiOnVada.position.set(-0.015, 0.024, 0.016);
  mirchiOnVada.rotation.set(0.18, 0.42, -0.22);
  vadaGroup.add(mirchiOnVada);

  vp.add(vadaGroup);

  // ==========================================
  // E. TOP PAV BUN (Baked golden crust, propped open like a clam)
  // ==========================================
  // Pivot placed at rear hinge so it tilts open upward & backward
  const topBunGroup = new THREE.Group();
  topBunGroup.position.set(0, 0.020, -0.034);
  topBunGroup.rotation.x = -0.52; // Tilted back ~30 degrees, revealing the vada inside!

  // Soft white bread underside of top bun
  const topCrumbGeo = new THREE.BoxGeometry(0.074, 0.004, 0.074);
  const topCrumb = new THREE.Mesh(topCrumbGeo, pavInnerCrumbMaterial);
  topCrumb.position.set(0, 0.002, 0.034);
  topBunGroup.add(topCrumb);

  // Red chutney stains on the inner crumb of top bun
  const stainGeo = new THREE.PlaneGeometry(0.048, 0.048);
  const stainMesh = new THREE.Mesh(stainGeo, redGarlicChutneyMaterial);
  stainMesh.position.set(0, 0.0045, 0.034);
  stainMesh.rotation.x = Math.PI / 2;
  topBunGroup.add(stainMesh);

  // Golden baked dome crust
  const topCrustGeo = new THREE.BoxGeometry(0.078, 0.024, 0.078);
  const topCrust = new THREE.Mesh(topCrustGeo, pavCrustMaterial);
  topCrust.position.set(0, 0.014, 0.034);
  topCrust.castShadow = true;
  topBunGroup.add(topCrust);

  // Rounded top pillow dome
  const domeGeo = new THREE.SphereGeometry(0.044, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.48);
  const dome = new THREE.Mesh(domeGeo, pavCrustMaterial);
  dome.position.set(0, 0.024, 0.034);
  dome.scale.set(0.92, 0.40, 0.92);
  dome.castShadow = true;
  topBunGroup.add(dome);

  vp.add(topBunGroup);

  return vp;
}

// 4. Katori (Small Dip Bowl) filled with Lasun Chutney Powder
export function createChutneyKatori() {
  const katori = new THREE.Group();

  // Dark bowl
  const bowlGeo = new THREE.CylinderGeometry(0.035, 0.028, 0.024, 24);
  const bowl = new THREE.Mesh(bowlGeo, katoriBowlMaterial);
  bowl.position.y = 0.012;
  bowl.castShadow = true;
  bowl.receiveShadow = true;
  katori.add(bowl);

  // Steel inner rim
  const rimGeo = new THREE.TorusGeometry(0.035, 0.002, 8, 24);
  const rim = new THREE.Mesh(rimGeo, steelPlateMaterial);
  rim.position.y = 0.024;
  rim.rotation.x = Math.PI / 2;
  katori.add(rim);

  // Mound of fiery orange-red dry garlic chutney powder
  const moundGeo = new THREE.SphereGeometry(0.032, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const mound = new THREE.Mesh(moundGeo, redGarlicChutneyMaterial);
  mound.position.y = 0.016;
  mound.scale.set(1.0, 0.65, 1.0);
  katori.add(mound);

  // Chutney texture flakes
  for (let f = 0; f < 6; f++) {
    const flake = new THREE.Mesh(
      new THREE.BoxGeometry(0.0035, 0.003, 0.0035),
      redGarlicChutneyMaterial
    );
    flake.position.set(
      (Math.random() - 0.5) * 0.038,
      0.022 + Math.random() * 0.006,
      (Math.random() - 0.5) * 0.038
    );
    flake.rotation.set(Math.random(), Math.random(), 0);
    katori.add(flake);
  }

  return katori;
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

// 6. Complete Mumbai Vada Pav Platter (Matching user's reference photo)
export function createVadaPavPlatter() {
  const group = new THREE.Group();

  // Stainless steel thali plate
  const plate = createSteelThali(0.170);
  group.add(plate);

  // Vada Pav 1 (Front Left, propped open, loaded with vada, chutney, and chilli)
  const vp1 = createRealisticVadaPav();
  vp1.position.set(-0.042, 0.004, 0.025);
  vp1.rotation.y = 0.35;
  group.add(vp1);

  // Vada Pav 2 (Back Left, leaning behind)
  const vp2 = createRealisticVadaPav();
  vp2.position.set(-0.025, 0.004, -0.055);
  vp2.rotation.y = -0.45;
  group.add(vp2);

  // Chutney Katori Bowl (Right side of plate, filled with lasun chutney as in photo!)
  const katori = createChutneyKatori();
  katori.position.set(0.075, 0.004, -0.015);
  group.add(katori);

  // Fried Salted Green Chillies on the plate
  const m1 = createFriedMirchi();
  m1.position.set(0.035, 0.006, 0.065);
  m1.rotation.y = -0.35;
  group.add(m1);

  const m2 = createFriedMirchi();
  m2.position.set(0.075, 0.006, 0.055);
  m2.rotation.y = 0.55;
  group.add(m2);

  return group;
}

// 7. Golden Triangular Samosa
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

// 8. Dynamic Animated Gentle Steam Particle System (Soft, delicate, localized heat shimmer)
export class SteamParticleSystem {
  constructor(scene, emitterConfigs) {
    this.scene = scene;
    this.emitters = emitterConfigs;
    this.particles = [];

    // Faint, delicate warm steam material with soft opacity (NOT dense gray smoke!)
    const steamMat = new THREE.MeshBasicMaterial({
      color: 0xF4F7FA,
      transparent: true,
      opacity: 0.045,
      depthWrite: false
    });

    const steamGeo = new THREE.SphereGeometry(0.0065, 6, 6);

    // Create subtle, small particle pools (only 4-5 faint wisps per food item)
    this.emitters.forEach((emitter) => {
      const count = emitter.particleCount || 5;
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(steamGeo, steamMat.clone());
        mesh.visible = true;
        this.scene.add(mesh);

        const maxLife = 1.4 + Math.random() * 0.7;
        const initialLife = Math.random() * maxLife;

        const pObj = {
          mesh,
          emitterPos: emitter.pos,
          life: initialLife,
          maxLife,
          speedY: 0.05 + Math.random() * 0.03,
          driftAngle: Math.random() * Math.PI * 2,
          driftSpeed: 0.010 + Math.random() * 0.015,
          radius: emitter.maxRadius || 0.025
        };

        this.particles.push(pObj);
      }
    });
  }

  update(delta, time) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        p.life = 0;
        p.driftAngle = Math.random() * Math.PI * 2;
        p.speedY = 0.05 + Math.random() * 0.03;
      }

      const progress = p.life / p.maxLife;

      // Ultra-soft translucent bell curve (barely visible, subtle heat haze)
      let opacity = 0;
      if (progress < 0.28) {
        opacity = (progress / 0.28) * 0.048;
      } else {
        opacity = 0.048 * (1 - (progress - 0.28) / 0.72);
      }
      p.mesh.material.opacity = Math.max(0, opacity);

      // Gentle scale expansion (no big cloud blobs)
      const scale = 1.0 + progress * 1.6;
      p.mesh.scale.set(scale, scale * 1.2, scale);

      // Gentle curling vapor drift
      const curlX = Math.sin(time * 2.2 + p.driftAngle) * p.driftSpeed * progress;
      const curlZ = Math.cos(time * 1.8 + p.driftAngle) * p.driftSpeed * progress;

      p.mesh.position.set(
        p.emitterPos.x + curlX + Math.sin(p.driftAngle) * p.radius * 0.4,
        p.emitterPos.y + progress * 0.14,
        p.emitterPos.z + curlZ + Math.cos(p.driftAngle) * p.radius * 0.4
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
