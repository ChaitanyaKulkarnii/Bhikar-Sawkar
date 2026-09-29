// 3D Stylized Tabletop Character Rigs & Animation Controller for Bhikar Sawkar
import * as THREE from 'three';

// Materials for characters with warm specular highlights
const babanraoSkinMaterial = new THREE.MeshStandardMaterial({
  color: 0xC48956,
  roughness: 0.5,
  metalness: 0.08
});

const dinkarSkinMaterial = new THREE.MeshStandardMaterial({
  color: 0xBA7745,
  roughness: 0.5,
  metalness: 0.08
});

const anandiSkinMaterial = new THREE.MeshStandardMaterial({
  color: 0xD69A68,
  roughness: 0.46,
  metalness: 0.1
});

const playerSkinMaterial = new THREE.MeshStandardMaterial({
  color: 0xC88B58,
  roughness: 0.52,
  metalness: 0.06
});

const babanraoJacketMaterial = new THREE.MeshStandardMaterial({
  color: 0x2D3740, // Dark slate Nehru waistcoat
  roughness: 0.65,
  metalness: 0.08
});

const babanraoShirtMaterial = new THREE.MeshStandardMaterial({
  color: 0xF2ECE1, // Crisp off-white cotton kurta
  roughness: 0.7
});

const dinkarJacketMaterial = new THREE.MeshStandardMaterial({
  color: 0x932626, // Rich maroon varsity jacket
  roughness: 0.5
});

const dinkarSleeveMaterial = new THREE.MeshStandardMaterial({
  color: 0xECE5D8, // Cream varsity sleeves
  roughness: 0.6
});

const anandiDressMaterial = new THREE.MeshStandardMaterial({
  color: 0x17584A, // Rich emerald silk
  roughness: 0.42,
  metalness: 0.2
});

const goldTrimMaterial = new THREE.MeshStandardMaterial({
  color: 0xD4AF37,
  roughness: 0.22,
  metalness: 0.92
});

const woodChairMaterial = new THREE.MeshStandardMaterial({
  color: 0x361F12,
  roughness: 0.55,
  metalness: 0.1
});

const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
  color: 0xFCFCFC,
  roughness: 0.2
});

const pupilMaterial = new THREE.MeshStandardMaterial({
  color: 0x140E0A,
  roughness: 0.1,
  metalness: 0.4
});

const catchlightMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF
});

// Helper: Create expressive 3D eye with sclera, pupil, and catchlight
function createEye(scale = 1.0) {
  const eye = new THREE.Group();
  
  // White eyeball
  const scleraGeo = new THREE.SphereGeometry(0.022 * scale, 12, 12);
  const sclera = new THREE.Mesh(scleraGeo, eyeWhiteMaterial);
  sclera.scale.set(1.1, 0.9, 0.6);
  eye.add(sclera);

  // Dark Iris / Pupil
  const pupilGeo = new THREE.SphereGeometry(0.012 * scale, 10, 10);
  const pupil = new THREE.Mesh(pupilGeo, pupilMaterial);
  pupil.position.set(0, 0, 0.01 * scale);
  pupil.scale.set(1, 1, 0.4);
  eye.add(pupil);

  // Catchlight (tiny reflection dot that brings eyes to life!)
  const dotGeo = new THREE.SphereGeometry(0.0035 * scale, 6, 6);
  const dot = new THREE.Mesh(dotGeo, catchlightMaterial);
  dot.position.set(0.005 * scale, 0.005 * scale, 0.014 * scale);
  eye.add(dot);

  return eye;
}

// Helper to build a classic wooden chair
export function createChair() {
  const chair = new THREE.Group();
  
  // Seat
  const seatGeo = new THREE.BoxGeometry(0.55, 0.06, 0.55);
  const seat = new THREE.Mesh(seatGeo, woodChairMaterial);
  seat.position.y = 0.45;
  chair.add(seat);

  // Backrest Frame
  const backGeo = new THREE.BoxGeometry(0.52, 0.65, 0.05);
  const back = new THREE.Mesh(backGeo, woodChairMaterial);
  back.position.set(0, 0.8, -0.24);
  chair.add(back);

  // Backrest Slats (Classic wooden chair look)
  for (let s = -0.16; s <= 0.16; s += 0.08) {
    const slatGeo = new THREE.BoxGeometry(0.03, 0.55, 0.02);
    const slat = new THREE.Mesh(slatGeo, woodChairMaterial);
    slat.position.set(s, 0.8, -0.21);
    chair.add(slat);
  }

  // 4 Chair Legs
  const legPositions = [
    [-0.23, 0.22, -0.23],
    [0.23, 0.22, -0.23],
    [-0.23, 0.22, 0.23],
    [0.23, 0.22, 0.23]
  ];
  legPositions.forEach(([x, y, z]) => {
    const legGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.45, 8);
    const leg = new THREE.Mesh(legGeo, woodChairMaterial);
    leg.position.set(x, y, z);
    chair.add(leg);
  });

  return chair;
}

// ============================================================================
// Helper: 3D Neat Parted Anime Hair for Roblox Babanrao Avatar (Matching Ref)
// ============================================================================
function createBabanraoHair(hairMat) {
  const hairGroup = new THREE.Group();

  // 1. Crown cap sitting cleanly on top of skull (top of head is at y = 0.11)
  // Front face ends at z = +0.070, staying 40mm BEHIND forehead plane (z = 0.110) to eliminate any z-fighting
  const capGeo = new THREE.BoxGeometry(0.256, 0.065, 0.18);
  const cap = new THREE.Mesh(capGeo, hairMat);
  cap.position.set(0, 0.128, -0.02);
  cap.castShadow = true;
  hairGroup.add(cap);

  // 2. Back hair covering the back of head and nape (z from -0.075 to -0.135)
  const backCap = new THREE.Mesh(new THREE.BoxGeometry(0.256, 0.14, 0.06), hairMat);
  backCap.position.set(0, 0.05, -0.105);
  backCap.castShadow = true;
  hairGroup.add(backCap);

  // 3. Side hair framing ears/temples (ends at z = +0.050, well behind forehead)
  const leftSideHair = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.13, 0.15), hairMat);
  leftSideHair.position.set(-0.128, 0.05, -0.025);
  leftSideHair.castShadow = true;
  const rightSideHair = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.13, 0.15), hairMat);
  rightSideHair.position.set(0.128, 0.05, -0.025);
  rightSideHair.castShadow = true;
  hairGroup.add(leftSideHair, rightSideHair);

  // 4. Side-parted neat swept bangs (sweeping across forehead, tilted forward at z >= 0.122)
  const bangsDef = [
    { pos: [-0.075, 0.092, 0.122], rot: [0.22, 0.2, -0.15], scale: [0.022, 0.044, 0.016] },
    { pos: [-0.035, 0.094, 0.124], rot: [0.24, 0.1, -0.05], scale: [0.024, 0.046, 0.018] },
    { pos: [0.010, 0.095, 0.125], rot: [0.22, -0.05, 0.1], scale: [0.023, 0.045, 0.018] },
    { pos: [0.050, 0.092, 0.123], rot: [0.20, -0.15, 0.2], scale: [0.023, 0.042, 0.016] },
    { pos: [0.082, 0.088, 0.120], rot: [0.18, -0.2, 0.3], scale: [0.020, 0.036, 0.014] }
  ];
  bangsDef.forEach(b => {
    const spikeGeo = new THREE.ConeGeometry(b.scale[0], b.scale[1], 4);
    const spike = new THREE.Mesh(spikeGeo, hairMat);
    spike.position.set(b.pos[0], b.pos[1], b.pos[2]);
    spike.rotation.set(b.rot[0] + Math.PI, b.rot[1], b.rot[2]);
    spike.castShadow = true;
    hairGroup.add(spike);
  });

  // 5. Sideburns framing ears
  [-0.125, 0.125].forEach((x, idx) => {
    const spikeGeo = new THREE.ConeGeometry(0.026, 0.07, 4);
    const spike = new THREE.Mesh(spikeGeo, hairMat);
    spike.position.set(x, 0.03, 0.02);
    spike.rotation.set(Math.PI, 0, (idx === 0 ? -0.2 : 0.2));
    spike.castShadow = true;
    hairGroup.add(spike);
  });

  // 6. Crown subtle layered volume
  const crownTufts = [
    { pos: [-0.04, 0.155, 0.01], rot: [0.1, 0.2, -0.2], scale: [0.032, 0.075, 0.03] },
    { pos: [0.04, 0.155, 0.00], rot: [0.1, -0.2, 0.2], scale: [0.032, 0.075, 0.03] },
    { pos: [0.0, 0.158, -0.04], rot: [-0.2, 0.0, 0.0], scale: [0.034, 0.08, 0.03] }
  ];
  crownTufts.forEach(c => {
    const spikeGeo = new THREE.ConeGeometry(c.scale[0], c.scale[1], 4);
    const spike = new THREE.Mesh(spikeGeo, hairMat);
    spike.position.set(c.pos[0], c.pos[1], c.pos[2]);
    spike.rotation.set(c.rot[0], c.rot[1], c.rot[2]);
    spike.castShadow = true;
    hairGroup.add(spike);
  });

  // 7. Back hair covering nape
  [-0.06, 0.0, 0.06].forEach(x => {
    const spikeGeo = new THREE.ConeGeometry(0.03, 0.07, 4);
    const spike = new THREE.Mesh(spikeGeo, hairMat);
    spike.position.set(x, 0.03, -0.118);
    spike.rotation.set(-0.2 + Math.PI, 0, 0);
    spike.castShadow = true;
    hairGroup.add(spike);
  });

  return hairGroup;
}

// 1. Build Opponent 1: Babanrao (Roblox Veteran Uncle with Mustache & Linen Shirt from Image 2)
let cachedBabanraoFace = null;
let cachedBabanraoShirtFront = null;
let cachedBabanraoShirtBack = null;

function getBabanraoFaceTexture() {
  if (!cachedBabanraoFace) {
    cachedBabanraoFace = characterTextureLoader.load('/babanrao_face_clean.png');
    cachedBabanraoFace.colorSpace = THREE.SRGBColorSpace;
    cachedBabanraoFace.anisotropy = 8;
  }
  return cachedBabanraoFace;
}

function getBabanraoShirtFrontTexture() {
  if (!cachedBabanraoShirtFront) {
    cachedBabanraoShirtFront = characterTextureLoader.load('/babanrao_shirt_front.png');
    cachedBabanraoShirtFront.colorSpace = THREE.SRGBColorSpace;
    cachedBabanraoShirtFront.anisotropy = 8;
  }
  return cachedBabanraoShirtFront;
}

function getBabanraoShirtBackTexture() {
  if (!cachedBabanraoShirtBack) {
    cachedBabanraoShirtBack = characterTextureLoader.load('/babanrao_shirt_back.png');
    cachedBabanraoShirtBack.colorSpace = THREE.SRGBColorSpace;
    cachedBabanraoShirtBack.anisotropy = 8;
  }
  return cachedBabanraoShirtBack;
}

// ============================================================================
// Helper: Seamless Roblox Character Arm Rig with Connected 3D Block Hands
// ============================================================================
function createRobloxCharacterArm(isRight, skinMat, sleeveMat, isShortSleeve = false, shirtCuffMat = null) {
  const shoulder = new THREE.Group();
  const sideSign = isRight ? 1 : -1;
  shoulder.name = (isRight ? 'Right' : 'Left') + 'Arm';
  // Shoulder pivot at x = +/- 0.24, y = 1.04, z = 0
  shoulder.position.set(sideSign * 0.24, 1.04, 0);

  // 1. Upper Arm Group (angles down, slightly forward, and inward towards body center)
  const upper = new THREE.Group();
  upper.rotation.set(-0.38, sideSign * -0.45, sideSign * 0.12);
  shoulder.add(upper);

  const L1 = 0.21; // Upper arm length
  if (isShortSleeve) {
    // Linen short sleeve for Babanrao
    const sleeveGeo = new THREE.BoxGeometry(0.170, 0.11, 0.170);
    const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
    sleeveMesh.position.set(0, -0.055, 0);
    sleeveMesh.castShadow = true;
    sleeveMesh.receiveShadow = true;
    upper.add(sleeveMesh);

    // 3D Rolled Linen Cuff Ring around bicep
    const cuffGeo = new THREE.BoxGeometry(0.182, 0.040, 0.182);
    const cuffMesh = new THREE.Mesh(cuffGeo, shirtCuffMat || sleeveMat);
    cuffMesh.position.set(0, -0.11, 0);
    cuffMesh.castShadow = true;
    cuffMesh.receiveShadow = true;
    upper.add(cuffMesh);

    // Bare tan skin arm emerging from sleeve down to elbow
    const skinBicepGeo = new THREE.BoxGeometry(0.158, 0.10, 0.158);
    const skinBicepMesh = new THREE.Mesh(skinBicepGeo, skinMat);
    skinBicepMesh.position.set(0, -0.16, 0);
    skinBicepMesh.castShadow = true;
    skinBicepMesh.receiveShadow = true;
    upper.add(skinBicepMesh);
  } else {
    // Full hoodie sleeve for Dinkar & Anandi down to elbow
    const sleeveGeo = new THREE.BoxGeometry(0.168, L1, 0.168);
    const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
    sleeveMesh.position.set(0, -L1 / 2, 0);
    sleeveMesh.castShadow = true;
    sleeveMesh.receiveShadow = true;
    upper.add(sleeveMesh);
  }

  // 2. Elbow Group (pivots at the bottom of upper arm)
  const elbow = new THREE.Group();
  elbow.position.set(0, -L1, 0);
  elbow.rotation.set(-0.80, 0, 0);
  upper.add(elbow);

  const L2 = 0.20; // Forearm length
  const forearmMat = isShortSleeve ? skinMat : sleeveMat;
  const forearmGeo = new THREE.BoxGeometry(isShortSleeve ? 0.158 : 0.165, L2, isShortSleeve ? 0.158 : 0.165);
  const forearmMesh = new THREE.Mesh(forearmGeo, forearmMat);
  forearmMesh.position.set(0, -L2 / 2, 0);
  forearmMesh.castShadow = true;
  forearmMesh.receiveShadow = true;
  elbow.add(forearmMesh);

  // If full hoodie sleeve, add 3D ribbed cuff band at wrist
  if (!isShortSleeve) {
    const wristCuffGeo = new THREE.BoxGeometry(0.176, 0.038, 0.176);
    const wristCuffMesh = new THREE.Mesh(wristCuffGeo, sleeveMat);
    wristCuffMesh.position.set(0, -L2 + 0.016, 0);
    wristCuffMesh.castShadow = true;
    wristCuffMesh.receiveShadow = true;
    elbow.add(wristCuffMesh);
  }

  // 3. Wrist Group (pivots at the end of forearm, flattens horizontally to baize)
  const wrist = new THREE.Group();
  wrist.position.set(0, -L2, 0);
  wrist.rotation.set(1.18, sideSign * 0.25, sideSign * -0.12);
  elbow.add(wrist);

  // 4. Roblox Solid Block Hand Group (nested inside wrist with 15mm overlap for ZERO gap)
  const handGroup = new THREE.Group();
  handGroup.position.set(0, 0, 0.065);
  wrist.add(handGroup);

  // Main Roblox Solid Block Palm/Fist (Thickness 0.080, Width 0.160, Depth 0.130)
  const handBlockGeo = new THREE.BoxGeometry(0.160, 0.080, 0.130);
  const handBlock = new THREE.Mesh(handBlockGeo, skinMat);
  handBlock.position.set(0, 0, 0);
  handBlock.castShadow = true;
  handBlock.receiveShadow = true;
  handGroup.add(handBlock);

  // Classic Roblox Front Grip Lip (resting firmly on table felt)
  const gripLipGeo = new THREE.BoxGeometry(0.154, 0.045, 0.030);
  const gripLip = new THREE.Mesh(gripLipGeo, skinMat);
  gripLip.position.set(0, -0.018, 0.068);
  gripLip.castShadow = true;
  gripLip.receiveShadow = true;
  handGroup.add(gripLip);

  // Thumb tab on inner side (towards body center)
  const thumbGeo = new THREE.BoxGeometry(0.032, 0.065, 0.048);
  const thumb = new THREE.Mesh(thumbGeo, skinMat);
  thumb.position.set(sideSign * -0.082, -0.005, 0.012);
  thumb.rotation.y = sideSign * 0.28;
  thumb.castShadow = true;
  thumb.receiveShadow = true;
  handGroup.add(thumb);

  return shoulder;
}

export function createBabanrao() {
  const group = new THREE.Group();
  group.name = 'Babanrao';

  // Materials sampled from user's Image 2 reference (warm golden Indian skin, distinct from linen shirt)
  const babanraoSkinMat = new THREE.MeshStandardMaterial({
    color: 0xCD9B6D, // Warm golden tan Indian skin
    roughness: 0.50,
    metalness: 0.04
  });

  const babanraoHairMat = new THREE.MeshStandardMaterial({
    color: 0x27201C, // Dark espresso / charcoal hair
    roughness: 0.85,
    metalness: 0.02
  });

  const babanraoShirtMat = new THREE.MeshStandardMaterial({
    color: 0xDDD6CA, // Warm cream linen shirt
    roughness: 0.82,
    metalness: 0.02
  });

  const babanraoPantsMat = new THREE.MeshStandardMaterial({
    color: 0x2A2827, // Dark charcoal trousers
    roughness: 0.85,
    metalness: 0.02
  });

  const babanraoLeatherMat = new THREE.MeshStandardMaterial({
    color: 0x362B24, // Dark brown leather for bag & strap
    roughness: 0.65,
    metalness: 0.12
  });

  const babanraoSoleMat = new THREE.MeshStandardMaterial({
    color: 0x3E2718, // Traditional sandal leather sole
    roughness: 0.70,
    metalness: 0.08
  });

  const babanraoFaceMat = new THREE.MeshStandardMaterial({
    map: getBabanraoFaceTexture(),
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -4.0,
    roughness: 0.55,
    metalness: 0.04
  });

  const babanraoShirtFrontMat = new THREE.MeshStandardMaterial({
    map: getBabanraoShirtFrontTexture(),
    roughness: 0.82,
    metalness: 0.02
  });

  const babanraoShirtBackMat = new THREE.MeshStandardMaterial({
    map: getBabanraoShirtBackTexture(),
    roughness: 0.82,
    metalness: 0.02
  });

  // 1. Lower Body / Trousers & Leather Sandals (Sitting on chairTop at y = 0.45)
  const lowerBodyGroup = new THREE.Group();

  // Pelvis / Hips resting on chair seat
  const hipsGeo = new THREE.BoxGeometry(0.36, 0.10, 0.22);
  const hips = new THREE.Mesh(hipsGeo, babanraoPantsMat);
  hips.position.set(0, 0.52, -0.02);
  hips.castShadow = true;
  hips.receiveShadow = true;
  lowerBodyGroup.add(hips);

  // Thighs extending horizontally forward toward table edge
  const thighGeo = new THREE.BoxGeometry(0.15, 0.15, 0.28);
  const leftThigh = new THREE.Mesh(thighGeo, babanraoPantsMat);
  leftThigh.position.set(-0.10, 0.52, 0.12);
  leftThigh.castShadow = true;
  leftThigh.receiveShadow = true;

  const rightThigh = new THREE.Mesh(thighGeo, babanraoPantsMat);
  rightThigh.position.set(0.10, 0.52, 0.12);
  rightThigh.castShadow = true;
  rightThigh.receiveShadow = true;
  lowerBodyGroup.add(leftThigh, rightThigh);

  // Shins / Lower legs extending downward from knees toward floor
  const shinGeo = new THREE.BoxGeometry(0.14, 0.36, 0.14);
  const leftShin = new THREE.Mesh(shinGeo, babanraoPantsMat);
  leftShin.position.set(-0.10, 0.24, 0.23);
  leftShin.castShadow = true;

  const rightShin = new THREE.Mesh(shinGeo, babanraoPantsMat);
  rightShin.position.set(0.10, 0.24, 0.23);
  rightShin.castShadow = true;
  lowerBodyGroup.add(leftShin, rightShin);

  // Traditional Indian Leather Strap Sandals / Chappals (Matching Image 2)
  [-0.10, 0.10].forEach(xPos => {
    const sandalGroup = new THREE.Group();
    sandalGroup.position.set(xPos, 0, 0.24);

    // Leather Sole
    const soleGeo = new THREE.BoxGeometry(0.15, 0.025, 0.22);
    const sole = new THREE.Mesh(soleGeo, babanraoSoleMat);
    sole.position.y = 0.012;
    sole.castShadow = true;
    sandalGroup.add(sole);

    // Bare Foot Block with Toes
    const footGeo = new THREE.BoxGeometry(0.13, 0.045, 0.19);
    const foot = new THREE.Mesh(footGeo, babanraoSkinMat);
    foot.position.y = 0.045;
    foot.castShadow = true;
    sandalGroup.add(foot);

    // Leather Cross-straps
    const toeStrap = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.014, 0.035), babanraoLeatherMat);
    toeStrap.position.set(0, 0.07, 0.05);
    const bridgeStrap = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.014, 0.03), babanraoLeatherMat);
    bridgeStrap.position.set(0, 0.07, -0.01);
    sandalGroup.add(toeStrap, bridgeStrap);

    lowerBodyGroup.add(sandalGroup);
  });

  group.add(lowerBodyGroup);

  // 2. Torso / Cream Linen Short-Sleeve Button-Down Shirt
  const torsoMaterials = [
    babanraoShirtMat,      // +X
    babanraoShirtMat,      // -X
    babanraoShirtMat,      // +Y
    babanraoPantsMat,      // -Y
    babanraoShirtFrontMat, // +Z (Front with buttons, pocket, and strap artwork)
    babanraoShirtBackMat   // -Z (Back with diagonal strap artwork)
  ];
  const torsoGeo = new THREE.BoxGeometry(0.38, 0.44, 0.22);
  const torso = new THREE.Mesh(torsoGeo, torsoMaterials);
  torso.position.y = 0.88;
  torso.castShadow = true;
  torso.receiveShadow = true;
  group.add(torso);

  // 3D Shirt Spread Collar around neck
  const collarGeo = new THREE.TorusGeometry(0.115, 0.02, 8, 20, Math.PI * 1.5);
  const collar = new THREE.Mesh(collarGeo, babanraoShirtMat);
  collar.position.set(0, 1.10, 0.01);
  collar.rotation.x = Math.PI / 2.2;
  collar.rotation.z = Math.PI / 4;
  group.add(collar);

  // 3D Diagonal Cross-Body Leather Strap (Right Shoulder to Left Hip)
  const strapGeo = new THREE.BoxGeometry(0.045, 0.50, 0.012);
  const strap = new THREE.Mesh(strapGeo, babanraoLeatherMat);
  strap.position.set(-0.02, 0.90, 0.116);
  strap.rotation.z = -0.52; // diagonal across chest
  strap.castShadow = true;
  group.add(strap);

  // 3D Leather Messenger Bag at Left Hip (Matching Image 2)
  const bagGeo = new THREE.BoxGeometry(0.07, 0.16, 0.14);
  const bag = new THREE.Mesh(bagGeo, babanraoLeatherMat);
  bag.position.set(-0.21, 0.62, 0.03);
  bag.castShadow = true;
  group.add(bag);

  const bagFlap = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.09, 0.145), babanraoLeatherMat);
  bagFlap.position.set(-0.21, 0.67, 0.03);
  group.add(bagFlap);

  // 3. Neck
  const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.08, 12);
  const neck = new THREE.Mesh(neckGeo, babanraoSkinMat);
  neck.position.y = 1.13;
  group.add(neck);

  // 4. Head (Solid Tan Skin Tone + Transparent Mustache Face Decal)
  const headGeo = new THREE.BoxGeometry(0.24, 0.22, 0.22);
  const head = new THREE.Mesh(headGeo, babanraoSkinMat);
  head.position.y = 1.28;
  head.castShadow = true;
  head.receiveShadow = true;

  // Face Decal (Clean mature anime eyes, eyebrows, and classic mustache)
  // Sized 0.18 x 0.13 centered at y = -0.015, leaving upper forehead (y = +0.05 to +0.11) 100% clean
  const faceDecalGeo = new THREE.PlaneGeometry(0.18, 0.13);
  const faceDecal = new THREE.Mesh(faceDecalGeo, babanraoFaceMat);
  faceDecal.position.set(0, -0.015, 0.1108);
  faceDecal.renderOrder = 1;
  faceDecal.castShadow = false;
  head.add(faceDecal);

  // Add 3D Neatly Parted Hair
  const hair = createBabanraoHair(babanraoHairMat);
  head.add(hair);

  group.add(head);

  // 5. Short-Sleeve Linen Shirt Arms with Rolled Cuffs & Connected Block Hands
  const leftArm = createRobloxCharacterArm(false, babanraoSkinMat, babanraoShirtMat, true, babanraoShirtMat);
  group.add(leftArm);

  const rightArm = createRobloxCharacterArm(true, babanraoSkinMat, babanraoShirtMat, true, babanraoShirtMat);
  group.add(rightArm);

  group.userData = {
    head,
    torso,
    rightArm,
    leftArm,
    headBaseY: 1.28,
    torsoBaseY: 0.88,
    animTime: 0
  };

  return group;
}

// ============================================================================
// Helper: 3D Layered Spiky Anime Hair for Roblox Dinkar Avatar (Matching Ref)
// ============================================================================
function createRobloxHair(hairMat) {
  const hairGroup = new THREE.Group();

  // 1. Crown cap sitting cleanly on top of skull (top of head is at y = 0.11)
  // Front face ends at z = +0.070, staying 40mm BEHIND forehead plane (z = 0.110) to eliminate any z-fighting
  const capGeo = new THREE.BoxGeometry(0.256, 0.065, 0.18);
  const cap = new THREE.Mesh(capGeo, hairMat);
  cap.position.set(0, 0.128, -0.02);
  cap.castShadow = true;
  hairGroup.add(cap);

  // 2. Back hair covering the back of head and nape (z from -0.075 to -0.135)
  const backCap = new THREE.Mesh(new THREE.BoxGeometry(0.256, 0.14, 0.06), hairMat);
  backCap.position.set(0, 0.05, -0.105);
  backCap.castShadow = true;
  hairGroup.add(backCap);

  // 3. Side hair framing ears/temples (ends at z = +0.050, well behind forehead)
  const leftSideHair = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.13, 0.15), hairMat);
  leftSideHair.position.set(-0.128, 0.05, -0.025);
  leftSideHair.castShadow = true;
  const rightSideHair = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.13, 0.15), hairMat);
  rightSideHair.position.set(0.128, 0.05, -0.025);
  rightSideHair.castShadow = true;
  hairGroup.add(leftSideHair, rightSideHair);

  // 4. Front bangs (messy layered anime fringe, tilted forward at z >= 0.122, completely clear of forehead)
  const bangsDef = [
    { pos: [-0.075, 0.092, 0.122], rot: [0.22, 0.1, -0.2], scale: [0.022, 0.042, 0.016] },
    { pos: [-0.038, 0.095, 0.125], rot: [0.25, -0.05, -0.06], scale: [0.024, 0.045, 0.018] },
    { pos: [0.005, 0.096, 0.126], rot: [0.24, 0.06, 0.08], scale: [0.023, 0.044, 0.018] },
    { pos: [0.045, 0.093, 0.124], rot: [0.22, 0.04, 0.18], scale: [0.024, 0.046, 0.018] },
    { pos: [0.080, 0.090, 0.121], rot: [0.18, -0.08, 0.25], scale: [0.020, 0.038, 0.015] }
  ];

  bangsDef.forEach(b => {
    const spikeGeo = new THREE.ConeGeometry(b.scale[0], b.scale[1], 4);
    const spike = new THREE.Mesh(spikeGeo, hairMat);
    spike.position.set(b.pos[0], b.pos[1], b.pos[2]);
    spike.rotation.set(b.rot[0] + Math.PI, b.rot[1], b.rot[2]); // points down to hairline
    spike.castShadow = true;
    hairGroup.add(spike);
  });

  // 5. Sideburns / Side locks hugging ears (outside the face at x = +/- 0.125)
  const sideTufts = [
    { pos: [-0.125, 0.02, 0.04], rot: [0.1, 0.2, -0.25], scale: [0.028, 0.08, 0.03] },
    { pos: [0.125, 0.02, 0.04], rot: [0.1, -0.2, 0.25], scale: [0.028, 0.08, 0.03] },
    { pos: [-0.128, 0.03, -0.04], rot: [-0.1, 0.2, -0.22], scale: [0.028, 0.08, 0.03] },
    { pos: [0.128, 0.03, -0.04], rot: [-0.1, -0.2, 0.22], scale: [0.028, 0.08, 0.03] }
  ];
  sideTufts.forEach(s => {
    const spikeGeo = new THREE.ConeGeometry(s.scale[0], s.scale[1], 4);
    const spike = new THREE.Mesh(spikeGeo, hairMat);
    spike.position.set(s.pos[0], s.pos[1], s.pos[2]);
    spike.rotation.set(s.rot[0] + Math.PI, s.rot[1], s.rot[2]);
    spike.castShadow = true;
    hairGroup.add(spike);
  });

  // 6. Crown and silhouette spikes (messy layered anime spikes pointing up & outward)
  const crownSpikes = [
    { pos: [-0.07, 0.155, 0.01], rot: [0.2, 0.1, -0.45], scale: [0.035, 0.09, 0.032] },
    { pos: [0.06, 0.158, 0.00], rot: [0.15, -0.1, 0.42], scale: [0.036, 0.095, 0.032] },
    { pos: [-0.01, 0.165, -0.04], rot: [-0.25, 0.05, 0.1], scale: [0.038, 0.10, 0.034] },
    { pos: [-0.08, 0.135, -0.07], rot: [-0.4, 0.2, -0.35], scale: [0.032, 0.085, 0.030] },
    { pos: [0.08, 0.135, -0.07], rot: [-0.4, -0.2, 0.35], scale: [0.032, 0.085, 0.030] },
    { pos: [0.0, 0.145, 0.05], rot: [0.35, 0.0, 0.0], scale: [0.032, 0.08, 0.028] }
  ];
  crownSpikes.forEach(c => {
    const spikeGeo = new THREE.ConeGeometry(c.scale[0], c.scale[1], 4);
    const spike = new THREE.Mesh(spikeGeo, hairMat);
    spike.position.set(c.pos[0], c.pos[1], c.pos[2]);
    spike.rotation.set(c.rot[0], c.rot[1], c.rot[2]);
    spike.castShadow = true;
    hairGroup.add(spike);
  });

  // 7. Back layered hair covering nape/neck (Matching Back View)
  const backTufts = [
    { pos: [-0.065, 0.02, -0.118], rot: [-0.25, 0.1, -0.15], scale: [0.032, 0.08, 0.028] },
    { pos: [0.0, 0.015, -0.122], rot: [-0.3, 0.0, 0.0], scale: [0.035, 0.085, 0.030] },
    { pos: [0.065, 0.02, -0.118], rot: [-0.25, -0.1, 0.15], scale: [0.032, 0.08, 0.028] }
  ];
  backTufts.forEach(bt => {
    const spikeGeo = new THREE.ConeGeometry(bt.scale[0], bt.scale[1], 4);
    const spike = new THREE.Mesh(spikeGeo, hairMat);
    spike.position.set(bt.pos[0], bt.pos[1], bt.pos[2]);
    spike.rotation.set(bt.rot[0] + Math.PI, bt.rot[1], bt.rot[2]);
    spike.castShadow = true;
    hairGroup.add(spike);
  });

  return hairGroup;
}

// 2. Build Opponent 2: Dinkar (Roblox Black Hoodie Avatar from Image 1)
const characterTextureLoader = new THREE.TextureLoader();
let cachedRobloxFace = null;
let cachedRobloxHoodie = null;
let cachedRobloxBack = null;

function getRobloxFaceTexture() {
  if (!cachedRobloxFace) {
    cachedRobloxFace = characterTextureLoader.load('/roblox_face_clean.png');
    cachedRobloxFace.colorSpace = THREE.SRGBColorSpace;
    cachedRobloxFace.anisotropy = 8;
  }
  return cachedRobloxFace;
}

function getRobloxHoodieTexture() {
  if (!cachedRobloxHoodie) {
    cachedRobloxHoodie = characterTextureLoader.load('/roblox_hoodie_texture.png');
    cachedRobloxHoodie.colorSpace = THREE.SRGBColorSpace;
    cachedRobloxHoodie.anisotropy = 8;
  }
  return cachedRobloxHoodie;
}

function getRobloxBackTexture() {
  if (!cachedRobloxBack) {
    cachedRobloxBack = characterTextureLoader.load('/roblox_back_texture.png');
    cachedRobloxBack.colorSpace = THREE.SRGBColorSpace;
    cachedRobloxBack.anisotropy = 8;
  }
  return cachedRobloxBack;
}

export function createDinkar() {
  const group = new THREE.Group();
  group.name = 'Dinkar';

  // Materials sampled directly from user's provided Roblox reference image
  const robloxSkinMat = new THREE.MeshStandardMaterial({
    color: 0xF5BA8E,
    roughness: 0.48,
    metalness: 0.04
  });

  const robloxHairMat = new THREE.MeshStandardMaterial({
    color: 0x2E2421,
    roughness: 0.85,
    metalness: 0.02
  });

  const robloxHoodieMat = new THREE.MeshStandardMaterial({
    color: 0x2A2A2B,
    roughness: 0.62,
    metalness: 0.04
  });

  const robloxPantsMat = new THREE.MeshStandardMaterial({
    color: 0x202020,
    roughness: 0.88,
    metalness: 0.02
  });

  const robloxSneakerMat = new THREE.MeshStandardMaterial({
    color: 0x141414,
    roughness: 0.75,
    metalness: 0.04
  });

  const robloxWhiteTrimMat = new THREE.MeshStandardMaterial({
    color: 0xEDEAE6,
    roughness: 0.5,
    metalness: 0.05
  });

  const robloxFaceMat = new THREE.MeshStandardMaterial({
    map: getRobloxFaceTexture(),
    roughness: 0.55,
    metalness: 0.04
  });

  const robloxHoodieFrontMat = new THREE.MeshStandardMaterial({
    map: getRobloxHoodieTexture(),
    roughness: 0.85,
    metalness: 0.02
  });

  const robloxHoodieBackMat = new THREE.MeshStandardMaterial({
    map: getRobloxBackTexture(),
    roughness: 0.85,
    metalness: 0.02
  });

  // 1. Lower Body / Cargo Joggers & Sneakers (Seated cleanly on chair at y = 0.45)
  const lowerBodyGroup = new THREE.Group();

  // Pelvis / Hips resting on chair seat
  const hipsGeo = new THREE.BoxGeometry(0.36, 0.10, 0.22);
  const hips = new THREE.Mesh(hipsGeo, robloxPantsMat);
  hips.position.set(0, 0.52, -0.02);
  hips.castShadow = true;
  hips.receiveShadow = true;
  lowerBodyGroup.add(hips);

  // Thighs extending horizontally forward toward table edge
  const thighGeo = new THREE.BoxGeometry(0.15, 0.15, 0.28);
  const leftThigh = new THREE.Mesh(thighGeo, robloxPantsMat);
  leftThigh.position.set(-0.10, 0.52, 0.12);
  leftThigh.castShadow = true;
  leftThigh.receiveShadow = true;

  const rightThigh = new THREE.Mesh(thighGeo, robloxPantsMat);
  rightThigh.position.set(0.10, 0.52, 0.12);
  rightThigh.castShadow = true;
  rightThigh.receiveShadow = true;
  lowerBodyGroup.add(leftThigh, rightThigh);

  // 3D Cargo Side Flap Pockets on outer thighs (Matching Ref Image)
  const pocketGeo = new THREE.BoxGeometry(0.035, 0.10, 0.13);
  const leftPocket = new THREE.Mesh(pocketGeo, robloxPantsMat);
  leftPocket.position.set(-0.19, 0.52, 0.12);
  leftPocket.castShadow = true;

  const rightPocket = new THREE.Mesh(pocketGeo, robloxPantsMat);
  rightPocket.position.set(0.19, 0.52, 0.12);
  rightPocket.castShadow = true;
  lowerBodyGroup.add(leftPocket, rightPocket);

  // Shins / Lower legs extending downward from knees toward floor
  const shinGeo = new THREE.BoxGeometry(0.14, 0.36, 0.14);
  const leftShin = new THREE.Mesh(shinGeo, robloxPantsMat);
  leftShin.position.set(-0.10, 0.24, 0.23);
  leftShin.castShadow = true;

  const rightShin = new THREE.Mesh(shinGeo, robloxPantsMat);
  rightShin.position.set(0.10, 0.24, 0.23);
  rightShin.castShadow = true;
  lowerBodyGroup.add(leftShin, rightShin);

  // Chunky Black Streetwear Sneakers with White Soles and Double White Laces
  [-0.10, 0.10].forEach(xPos => {
    const sneakerGroup = new THREE.Group();
    sneakerGroup.position.set(xPos, 0, 0.24);

    // Thick White Outsole
    const soleGeo = new THREE.BoxGeometry(0.16, 0.03, 0.22);
    const sole = new THREE.Mesh(soleGeo, robloxWhiteTrimMat);
    sole.position.y = 0.015;
    sole.castShadow = true;
    sneakerGroup.add(sole);

    // Upper Shoe
    const shoeGeo = new THREE.BoxGeometry(0.15, 0.065, 0.21);
    const shoe = new THREE.Mesh(shoeGeo, robloxSneakerMat);
    shoe.position.y = 0.062;
    shoe.castShadow = true;
    sneakerGroup.add(shoe);

    // Double White Stripes across toe / tongue
    const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.008, 0.022), robloxWhiteTrimMat);
    stripe1.position.set(0, 0.096, 0.04);
    const stripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.008, 0.022), robloxWhiteTrimMat);
    stripe2.position.set(0, 0.096, 0.075);
    sneakerGroup.add(stripe1, stripe2);

    lowerBodyGroup.add(sneakerGroup);
  });

  group.add(lowerBodyGroup);

  // 2. Torso / Matte Black Roblox Hoodie
  const torsoMaterials = [
    robloxHoodieMat,      // +X
    robloxHoodieMat,      // -X
    robloxHoodieMat,      // +Y
    robloxPantsMat,       // -Y
    robloxHoodieFrontMat, // +Z (Front with hoodie artwork & Kangaroo pouch)
    robloxHoodieBackMat   // -Z (Back with folded hood artwork)
  ];
  const torsoGeo = new THREE.BoxGeometry(0.38, 0.44, 0.22);
  const torso = new THREE.Mesh(torsoGeo, torsoMaterials);
  torso.position.y = 0.88;
  torso.castShadow = true;
  torso.receiveShadow = true;
  group.add(torso);

  // 3D Hoodie Collar around neck
  const collarGeo = new THREE.TorusGeometry(0.115, 0.022, 8, 20);
  const collar = new THREE.Mesh(collarGeo, robloxHoodieMat);
  collar.position.set(0, 1.10, 0.01);
  collar.rotation.x = Math.PI / 2.2;
  group.add(collar);

  // 3D Hanging Drawstrings with Silver/White Aglets
  [-0.042, 0.042].forEach(x => {
    // Cord
    const cordGeo = new THREE.CylinderGeometry(0.0035, 0.0035, 0.12, 8);
    const cord = new THREE.Mesh(cordGeo, robloxHoodieMat);
    cord.position.set(x, 1.01, 0.122);
    group.add(cord);

    // Silver Aglet Tip
    const agletGeo = new THREE.CylinderGeometry(0.0045, 0.0045, 0.022, 8);
    const aglet = new THREE.Mesh(agletGeo, robloxWhiteTrimMat);
    aglet.position.set(x, 0.94, 0.122);
    group.add(aglet);
  });

  // 3D Folded Hood on Back (Matching Back View)
  const backHoodGeo = new THREE.BoxGeometry(0.24, 0.16, 0.05);
  const backHood = new THREE.Mesh(backHoodGeo, robloxHoodieMat);
  backHood.position.set(0, 0.98, -0.12);
  backHood.rotation.x = -0.22;
  backHood.castShadow = true;
  group.add(backHood);

  // 3. Neck
  const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.08, 12);
  const neck = new THREE.Mesh(neckGeo, robloxSkinMat);
  neck.position.y = 1.13;
  group.add(neck);

  // 4. Head (Classic Roblox Blocky Head in seamless uniform skin tone)
  const headGeo = new THREE.BoxGeometry(0.24, 0.22, 0.22);
  const head = new THREE.Mesh(headGeo, robloxSkinMat);
  head.position.y = 1.28;
  head.castShadow = true;
  head.receiveShadow = true;

  // Face Decal (Antialiased anime eyes, eyebrows, and smile on transparent background)
  // Sized 0.18 x 0.13 centered at y = -0.015, leaving upper forehead (y = +0.05 to +0.11) 100% clean
  const faceDecalGeo = new THREE.PlaneGeometry(0.18, 0.13);
  const faceDecalMat = new THREE.MeshStandardMaterial({
    map: getRobloxFaceTexture(),
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -4.0,
    roughness: 0.55,
    metalness: 0.04
  });
  const faceDecal = new THREE.Mesh(faceDecalGeo, faceDecalMat);
  faceDecal.position.set(0, -0.015, 0.1108);
  faceDecal.renderOrder = 1;
  faceDecal.castShadow = false;
  head.add(faceDecal);

  // Add 3D Spiky Anime Hair resting naturally on top of head
  const hair = createRobloxHair(robloxHairMat);
  head.add(hair);

  group.add(head);

  // 5. Roblox Blocky Arms & Connected Block Hands resting on table felt
  const leftArm = createRobloxCharacterArm(false, robloxSkinMat, robloxHoodieMat, false);
  group.add(leftArm);

  const rightArm = createRobloxCharacterArm(true, robloxSkinMat, robloxHoodieMat, false);
  group.add(rightArm);

  group.userData = {
    head,
    torso,
    rightArm,
    leftArm,
    headBaseY: 1.28,
    torsoBaseY: 0.88,
    animTime: 0
  };

  return group;
}

// 3. Build Opponent 3: Anandi (Roblox Streetwear Avatar with Bindi from Image 1)
let cachedAnandiFace = null;
function getAnandiFaceTexture() {
  if (!cachedAnandiFace) {
    cachedAnandiFace = characterTextureLoader.load('/anandi_face_clean.png');
    cachedAnandiFace.colorSpace = THREE.SRGBColorSpace;
    cachedAnandiFace.anisotropy = 8;
  }
  return cachedAnandiFace;
}

export function createAnandi() {
  const group = new THREE.Group();
  group.name = 'Anandi';

  const robloxSkinMat = new THREE.MeshStandardMaterial({
    color: 0xF5BA8E,
    roughness: 0.48,
    metalness: 0.04
  });

  const robloxHairMat = new THREE.MeshStandardMaterial({
    color: 0x2E2421,
    roughness: 0.85,
    metalness: 0.02
  });

  const robloxHoodieMat = new THREE.MeshStandardMaterial({
    color: 0x2A2A2B,
    roughness: 0.62,
    metalness: 0.04
  });

  const robloxPantsMat = new THREE.MeshStandardMaterial({
    color: 0x202020,
    roughness: 0.88,
    metalness: 0.02
  });

  const robloxSneakerMat = new THREE.MeshStandardMaterial({
    color: 0x141414,
    roughness: 0.75,
    metalness: 0.04
  });

  const robloxWhiteTrimMat = new THREE.MeshStandardMaterial({
    color: 0xEDEAE6,
    roughness: 0.5,
    metalness: 0.05
  });

  const anandiFaceMat = new THREE.MeshStandardMaterial({
    map: getAnandiFaceTexture(),
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -4.0,
    roughness: 0.55,
    metalness: 0.04
  });

  const robloxHoodieFrontMat = new THREE.MeshStandardMaterial({
    map: getRobloxHoodieTexture(),
    roughness: 0.85,
    metalness: 0.02
  });

  const robloxHoodieBackMat = new THREE.MeshStandardMaterial({
    map: getRobloxBackTexture(),
    roughness: 0.85,
    metalness: 0.02
  });

  // 1. Lower Body / Cargo Joggers & Sneakers (Seated on chairRight at y = 0.45)
  const lowerBodyGroup = new THREE.Group();

  const hipsGeo = new THREE.BoxGeometry(0.36, 0.10, 0.22);
  const hips = new THREE.Mesh(hipsGeo, robloxPantsMat);
  hips.position.set(0, 0.52, -0.02);
  hips.castShadow = true;
  hips.receiveShadow = true;
  lowerBodyGroup.add(hips);

  const thighGeo = new THREE.BoxGeometry(0.15, 0.15, 0.28);
  const leftThigh = new THREE.Mesh(thighGeo, robloxPantsMat);
  leftThigh.position.set(-0.10, 0.52, 0.12);
  leftThigh.castShadow = true;
  leftThigh.receiveShadow = true;

  const rightThigh = new THREE.Mesh(thighGeo, robloxPantsMat);
  rightThigh.position.set(0.10, 0.52, 0.12);
  rightThigh.castShadow = true;
  rightThigh.receiveShadow = true;
  lowerBodyGroup.add(leftThigh, rightThigh);

  const pocketGeo = new THREE.BoxGeometry(0.035, 0.10, 0.13);
  const leftPocket = new THREE.Mesh(pocketGeo, robloxPantsMat);
  leftPocket.position.set(-0.19, 0.52, 0.12);
  leftPocket.castShadow = true;

  const rightPocket = new THREE.Mesh(pocketGeo, robloxPantsMat);
  rightPocket.position.set(0.19, 0.52, 0.12);
  rightPocket.castShadow = true;
  lowerBodyGroup.add(leftPocket, rightPocket);

  const shinGeo = new THREE.BoxGeometry(0.14, 0.36, 0.14);
  const leftShin = new THREE.Mesh(shinGeo, robloxPantsMat);
  leftShin.position.set(-0.10, 0.24, 0.23);
  leftShin.castShadow = true;

  const rightShin = new THREE.Mesh(shinGeo, robloxPantsMat);
  rightShin.position.set(0.10, 0.24, 0.23);
  rightShin.castShadow = true;
  lowerBodyGroup.add(leftShin, rightShin);

  [-0.10, 0.10].forEach(xPos => {
    const sneakerGroup = new THREE.Group();
    sneakerGroup.position.set(xPos, 0, 0.24);

    const soleGeo = new THREE.BoxGeometry(0.16, 0.03, 0.22);
    const sole = new THREE.Mesh(soleGeo, robloxWhiteTrimMat);
    sole.position.y = 0.015;
    sole.castShadow = true;
    sneakerGroup.add(sole);

    const shoeGeo = new THREE.BoxGeometry(0.15, 0.065, 0.21);
    const shoe = new THREE.Mesh(shoeGeo, robloxSneakerMat);
    shoe.position.y = 0.062;
    shoe.castShadow = true;
    sneakerGroup.add(shoe);

    const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.008, 0.022), robloxWhiteTrimMat);
    stripe1.position.set(0, 0.096, 0.04);
    const stripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.008, 0.022), robloxWhiteTrimMat);
    stripe2.position.set(0, 0.096, 0.075);
    sneakerGroup.add(stripe1, stripe2);

    lowerBodyGroup.add(sneakerGroup);
  });

  group.add(lowerBodyGroup);

  // 2. Torso / Matte Black Roblox Hoodie
  const torsoMaterials = [
    robloxHoodieMat,
    robloxHoodieMat,
    robloxHoodieMat,
    robloxPantsMat,
    robloxHoodieFrontMat,
    robloxHoodieBackMat
  ];
  const torsoGeo = new THREE.BoxGeometry(0.38, 0.44, 0.22);
  const torso = new THREE.Mesh(torsoGeo, torsoMaterials);
  torso.position.y = 0.88;
  torso.castShadow = true;
  torso.receiveShadow = true;
  group.add(torso);

  const collarGeo = new THREE.TorusGeometry(0.115, 0.022, 8, 20);
  const collar = new THREE.Mesh(collarGeo, robloxHoodieMat);
  collar.position.set(0, 1.10, 0.01);
  collar.rotation.x = Math.PI / 2.2;
  group.add(collar);

  [-0.042, 0.042].forEach(x => {
    const cordGeo = new THREE.CylinderGeometry(0.0035, 0.0035, 0.12, 8);
    const cord = new THREE.Mesh(cordGeo, robloxHoodieMat);
    cord.position.set(x, 1.01, 0.122);
    group.add(cord);

    const agletGeo = new THREE.CylinderGeometry(0.0045, 0.0045, 0.022, 8);
    const aglet = new THREE.Mesh(agletGeo, robloxWhiteTrimMat);
    aglet.position.set(x, 0.94, 0.122);
    group.add(aglet);
  });

  const backHoodGeo = new THREE.BoxGeometry(0.24, 0.16, 0.05);
  const backHood = new THREE.Mesh(backHoodGeo, robloxHoodieMat);
  backHood.position.set(0, 0.98, -0.12);
  backHood.rotation.x = -0.22;
  backHood.castShadow = true;
  group.add(backHood);

  // 3. Neck
  const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.08, 12);
  const neck = new THREE.Mesh(neckGeo, robloxSkinMat);
  neck.position.y = 1.13;
  group.add(neck);

  // 4. Head (Classic Roblox Blocky Head with Bindi Face Decal)
  const headGeo = new THREE.BoxGeometry(0.24, 0.22, 0.22);
  const head = new THREE.Mesh(headGeo, robloxSkinMat);
  head.position.y = 1.28;
  head.castShadow = true;
  head.receiveShadow = true;

  // Face Decal (Sweet anime eyes, smile, and iconic forehead bindi)
  // Sized 0.18 x 0.13 centered at y = -0.015, leaving upper forehead (y = +0.05 to +0.11) 100% clean
  const faceDecalGeo = new THREE.PlaneGeometry(0.18, 0.13);
  const faceDecal = new THREE.Mesh(faceDecalGeo, anandiFaceMat);
  faceDecal.position.set(0, -0.015, 0.1108);
  faceDecal.renderOrder = 1;
  faceDecal.castShadow = false;
  head.add(faceDecal);

  // Add 3D Spiky Anime Hair
  const hair = createRobloxHair(robloxHairMat);
  head.add(hair);

  group.add(head);

  // 5. Roblox Blocky Arms & Connected Block Hands resting on table felt
  const leftArm = createRobloxCharacterArm(false, robloxSkinMat, robloxHoodieMat, false);
  group.add(leftArm);

  const rightArm = createRobloxCharacterArm(true, robloxSkinMat, robloxHoodieMat, false);
  group.add(rightArm);

  group.userData = {
    head,
    torso,
    rightArm,
    leftArm,
    headBaseY: 1.28,
    torsoBaseY: 0.88,
    animTime: 0
  };

  return group;
}

// 4. First-Person Player Hands (Grounded on table in front of player)
export function createPlayerArms() {
  const group = new THREE.Group();
  group.name = 'PlayerArms';

  // Left Arm resting on table edge
  const leftArm = new THREE.Group();
  const leftForearm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.038, 0.35, 12),
    playerSkinMaterial
  );
  leftForearm.position.set(0, 0.02, 0.08);
  leftForearm.rotation.x = 1.35;
  leftForearm.castShadow = true;
  leftArm.add(leftForearm);

  const leftHand = new THREE.Mesh(
    new THREE.BoxGeometry(0.085, 0.032, 0.12),
    playerSkinMaterial
  );
  leftHand.position.set(0, 0.016, -0.07);
  leftHand.rotation.x = -0.08;
  leftHand.castShadow = true;
  leftHand.receiveShadow = true;
  leftArm.add(leftHand);

  // Watch on left wrist
  const watchGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.018, 12);
  const watch = new THREE.Mesh(watchGeo, goldTrimMaterial);
  watch.position.set(0, 0.024, 0.01);
  watch.rotation.x = 1.35;
  leftArm.add(watch);

  leftArm.position.set(-0.28, 0, 0);
  group.add(leftArm);

  // Right Arm (Ready to flip cards into the pot!)
  const rightArm = new THREE.Group();
  const rightForearm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.038, 0.35, 12),
    playerSkinMaterial
  );
  rightForearm.position.set(0, 0.02, 0.08);
  rightForearm.rotation.x = 1.35;
  rightForearm.castShadow = true;
  rightArm.add(rightForearm);

  const rightHand = new THREE.Mesh(
    new THREE.BoxGeometry(0.085, 0.032, 0.12),
    playerSkinMaterial
  );
  rightHand.position.set(0, 0.016, -0.07);
  rightHand.rotation.x = -0.08;
  rightHand.castShadow = true;
  rightHand.receiveShadow = true;
  rightArm.add(rightHand);

  rightArm.position.set(0.28, 0, 0);
  group.add(rightArm);

  group.userData = {
    leftArm,
    rightArm,
    initialRightPos: rightArm.position.clone(),
    initialRightRot: rightArm.rotation.clone()
  };

  return group;
}

// Helper: Create an anatomically connected limb segment between two 3D points
function createLimbSegment(pA, pB, rTop, rBottom, material, castShadow = true) {
  const dir = new THREE.Vector3().subVectors(pB, pA);
  const len = dir.length();
  const center = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);

  // In Three.js, CylinderGeometry has top cap at +Y and bottom cap at -Y
  // Since unitDir points from pA to pB, +Y will be at pB (rTop) and -Y at pA (rBottom)
  const geo = new THREE.CylinderGeometry(rTop, rBottom, len, 14);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(center);

  const up = new THREE.Vector3(0, 1, 0);
  const unitDir = dir.clone().normalize();
  mesh.quaternion.setFromUnitVectors(up, unitDir);
  mesh.castShadow = castShadow;
  return { mesh, dir: unitDir, length: len, center };
}

// Helper: Articulated Arm resting naturally and cleanly on the table baize
function createArm(sleeveMat, handSkinMat, isRight = false, addBangle = false, characterType = 'anandi') {
  const arm = new THREE.Group();
  const sideSign = isRight ? 1 : -1;

  // Key Anatomical Reference Points in arm local space (shoulder socket = 0, 0, 0):
  // 1. Shoulder socket: (0, 0, 0)
  const pShoulder = new THREE.Vector3(0, 0, 0);

  // 2. Elbow joint: hangs down beside torso, slightly forward
  const pElbow = new THREE.Vector3(sideSign * 0.035, -0.22, 0.12);

  // 3. Wrist joint: reaches forward & inward, clearing the rail cushion and resting near table felt
  const pWrist = new THREE.Vector3(sideSign * -0.065, -0.312, 0.38);

  // Upper Arm Segment (Shoulder to Elbow)
  // rBottom is at shoulder (0.052), rTop is at elbow (0.046)
  const upperLimb = createLimbSegment(pShoulder, pElbow, 0.046, 0.052, sleeveMat);
  arm.add(upperLimb.mesh);

  // Smooth Anatomical Elbow Joint
  const elbowGeo = new THREE.SphereGeometry(0.046, 14, 14);
  const elbow = new THREE.Mesh(elbowGeo, sleeveMat);
  elbow.position.copy(pElbow);
  elbow.castShadow = true;
  arm.add(elbow);

  // Forearm Segment (Elbow to Wrist)
  // For Babanrao: full sleeve kurta; For Dinkar: cream sleeve with ribbed wrist; For Anandi: bare arm with bangles
  const forearmMat = (characterType === 'babanrao') ? sleeveMat : handSkinMat;
  const foreLimb = createLimbSegment(pElbow, pWrist, 0.034, 0.042, forearmMat);
  arm.add(foreLimb.mesh);

  // If Anandi: Gold sleeve hem border at elbow
  if (addBangle) {
    const sleeveHemGeo = new THREE.TorusGeometry(0.046, 0.006, 8, 18);
    const sleeveHem = new THREE.Mesh(sleeveHemGeo, goldTrimMaterial);
    sleeveHem.position.copy(pElbow);
    sleeveHem.quaternion.copy(foreLimb.mesh.quaternion);
    arm.add(sleeveHem);
  }

  // Wrist Joint Sphere (Smooth transition to hand)
  const wristGeo = new THREE.SphereGeometry(0.032, 12, 12);
  const wrist = new THREE.Mesh(wristGeo, handSkinMat);
  wrist.position.copy(pWrist);
  arm.add(wrist);

  // Gold Bangles on Anandi's wrists
  if (addBangle) {
    const forearmDir = foreLimb.dir;
    [-0.015, -0.030, -0.045].forEach((dist) => {
      const bangleGeo = new THREE.TorusGeometry(0.036, 0.0055, 8, 16);
      const bangle = new THREE.Mesh(bangleGeo, goldTrimMaterial);
      const banglePos = pWrist.clone().addScaledVector(forearmDir, dist);
      bangle.position.copy(banglePos);
      bangle.quaternion.copy(foreLimb.mesh.quaternion);
      arm.add(bangle);
    });
  }

  // Dinkar's ribbed knit wrist cuff
  if (characterType === 'dinkar') {
    const cuffGeo = new THREE.CylinderGeometry(0.038, 0.036, 0.035, 12);
    const cuffMat = new THREE.MeshStandardMaterial({ color: 0x932626, roughness: 0.6 });
    const cuff = new THREE.Mesh(cuffGeo, cuffMat);
    const cuffPos = pWrist.clone().addScaledVector(foreLimb.dir, -0.02);
    cuff.position.copy(cuffPos);
    cuff.quaternion.copy(foreLimb.mesh.quaternion);
    arm.add(cuff);
  }

  // Hand (Palm + Fingers + Thumb) resting flat on the table felt
  const handGroup = new THREE.Group();
  handGroup.position.copy(pWrist);

  // Palm
  const palmGeo = new THREE.BoxGeometry(0.068, 0.018, 0.065);
  const palm = new THREE.Mesh(palmGeo, handSkinMat);
  palm.position.set(sideSign * -0.008, -0.006, 0.035);
  palm.rotation.y = sideSign * -0.15;
  palm.castShadow = true;
  palm.receiveShadow = true;
  handGroup.add(palm);

  // Fingers (Natural forward extension resting flat on baize)
  const fingersGeo = new THREE.BoxGeometry(0.062, 0.014, 0.045);
  const fingers = new THREE.Mesh(fingersGeo, handSkinMat);
  fingers.position.set(sideSign * -0.012, -0.008, 0.085);
  fingers.rotation.y = sideSign * -0.15;
  fingers.castShadow = true;
  fingers.receiveShadow = true;
  handGroup.add(fingers);

  // Thumb
  const thumbGeo = new THREE.BoxGeometry(0.018, 0.014, 0.035);
  const thumb = new THREE.Mesh(thumbGeo, handSkinMat);
  thumb.position.set(sideSign * -0.042, -0.006, 0.032);
  thumb.rotation.y = sideSign * 0.45;
  handGroup.add(thumb);

  arm.add(handGroup);

  arm.userData = {
    pShoulder,
    pElbow,
    pWrist,
    handGroup,
    isRight
  };
  return arm;
}

// Procedural Idle Animation for Characters (Breathing, head glance)
export function updateCharacterIdle(char, delta, time) {
  if (!char || !char.userData) return;
  const d = char.userData;

  // Gentle breathing (torso expansion & slight vertical bob)
  if (d.torso) {
    const baseTorsoY = d.torsoBaseY !== undefined ? d.torsoBaseY : 0.82;
    d.torso.position.y = baseTorsoY + Math.sin(time * 2.2 + char.position.x) * 0.006;
  }
  if (d.head) {
    const baseHeadY = d.headBaseY !== undefined ? d.headBaseY : 1.32;
    d.head.position.y = baseHeadY + Math.sin(time * 2.2 + char.position.x) * 0.007;
    // Micro head glance
    d.head.rotation.y = Math.sin(time * 0.8 + char.position.z) * 0.08;
    d.head.rotation.x = Math.cos(time * 0.6) * 0.04;
  }
}

// Opponent Throw Card Animation
export function animateCardThrow(character, targetPos, onDrop, onComplete) {
  if (!character || !character.userData) {
    if (onDrop) onDrop();
    if (onComplete) onComplete();
    return;
  }

  const arm = character.userData.rightArm;
  if (!arm) {
    if (onDrop) onDrop();
    if (onComplete) onComplete();
    return;
  }

  const origRot = arm.rotation.clone();
  const startTime = performance.now();
  const duration = 440; // ms

  let dropped = false;

  function step() {
    const now = performance.now();
    const progress = Math.min(1, (now - startTime) / duration);

    if (progress < 0.38) {
      // 1. Lift arm up from table
      const p = progress / 0.38;
      arm.rotation.x = -p * 0.45;
      arm.rotation.z = p * 0.15;
    } else if (progress < 0.72) {
      // 2. Thrust forward into the center pot!
      const p = (progress - 0.38) / 0.34;
      arm.rotation.x = -0.45 + p * 0.75;
      arm.rotation.y = (character.position.x < 0 ? -0.35 : 0.35) * p;

      if (!dropped && progress > 0.55) {
        dropped = true;
        if (onDrop) onDrop();
      }
    } else {
      // 3. Return smoothly to resting pose on table
      const p = (progress - 0.72) / 0.28;
      arm.rotation.x = 0.30 * (1 - p);
      arm.rotation.y = (character.position.x < 0 ? -0.35 : 0.35) * (1 - p);
      arm.rotation.z = 0.15 * (1 - p);
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      arm.rotation.copy(origRot);
      if (!dropped && onDrop) onDrop();
      if (onComplete) onComplete();
    }
  }

  requestAnimationFrame(step);
}

// First-Person Player Hand Throw Animation
export function animatePlayerThrow(playerArms, onDrop, onComplete) {
  if (!playerArms || !playerArms.userData) {
    if (onDrop) onDrop();
    if (onComplete) onComplete();
    return;
  }

  const rightArm = playerArms.userData.rightArm;
  const startPos = playerArms.userData.initialRightPos;
  const startTime = performance.now();
  const duration = 380; // snappy response

  let dropped = false;

  function step() {
    const now = performance.now();
    const progress = Math.min(1, (now - startTime) / duration);

    if (progress < 0.35) {
      // 1. Lift slightly and tap personal deck
      const p = progress / 0.35;
      rightArm.position.y = startPos.y + 0.05 * Math.sin(p * Math.PI);
      rightArm.position.z = startPos.z - 0.04 * p;
    } else if (progress < 0.7) {
      // 2. Flick forward into center pot!
      const p = (progress - 0.35) / 0.35;
      rightArm.position.y = startPos.y + 0.09 * Math.sin(p * Math.PI);
      rightArm.position.z = startPos.z - 0.04 - 0.22 * p;
      rightArm.position.x = startPos.x - 0.12 * p;

      if (!dropped && progress > 0.55) {
        dropped = true;
        if (onDrop) onDrop();
      }
    } else {
      // 3. Return smoothly to resting spot beside deck
      const p = (progress - 0.7) / 0.3;
      rightArm.position.lerpVectors(
        new THREE.Vector3(startPos.x - 0.12, startPos.y, startPos.z - 0.26),
        startPos,
        p
      );
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      rightArm.position.copy(startPos);
      if (!dropped && onDrop) onDrop();
      if (onComplete) onComplete();
    }
  }

  requestAnimationFrame(step);
}
