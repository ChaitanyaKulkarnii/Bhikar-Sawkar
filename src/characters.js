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

// 1. Build Opponent 1: Babanrao (The Veteran Uncle across the table)
export function createBabanrao() {
  const group = new THREE.Group();
  group.name = 'Babanrao';

  // Torso / Kurta & Jacket
  const torsoGeo = new THREE.CylinderGeometry(0.25, 0.22, 0.65, 16);
  const torso = new THREE.Mesh(torsoGeo, babanraoJacketMaterial);
  torso.position.y = 0.82;
  torso.castShadow = true;
  torso.receiveShadow = true;
  group.add(torso);

  // Kurta chest placket visible between open Nehru jacket
  const placketGeo = new THREE.PlaneGeometry(0.09, 0.52);
  const placket = new THREE.Mesh(placketGeo, babanraoShirtMaterial);
  placket.position.set(0, 0.85, 0.238);
  group.add(placket);

  // Brass buttons down jacket
  for (let b = 0; b < 4; b++) {
    const btnGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 10);
    const btn = new THREE.Mesh(btnGeo, goldTrimMaterial);
    btn.position.set(0, 0.72 + b * 0.09, 0.245);
    btn.rotation.x = Math.PI / 2;
    group.add(btn);
  }

  // Shoulders (Smooth anatomical blend)
  const shoulderGeo = new THREE.SphereGeometry(0.085, 12, 12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, babanraoJacketMaterial);
  leftShoulder.position.set(-0.26, 1.08, 0);
  const rightShoulder = new THREE.Mesh(shoulderGeo, babanraoJacketMaterial);
  rightShoulder.position.set(0.26, 1.08, 0);
  group.add(leftShoulder, rightShoulder);

  // Neck & Kurta collar
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 12);
  const neck = new THREE.Mesh(neckGeo, babanraoSkinMaterial);
  neck.position.y = 1.18;
  group.add(neck);

  const collarGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.06, 12);
  const collar = new THREE.Mesh(collarGeo, babanraoShirtMaterial);
  collar.position.y = 1.14;
  group.add(collar);

  // Head
  const headGeo = new THREE.SphereGeometry(0.155, 22, 22);
  const head = new THREE.Mesh(headGeo, babanraoSkinMaterial);
  head.position.y = 1.32;
  head.castShadow = true;
  group.add(head);

  // Eyes with life and focus
  const leftEye = createEye(0.95);
  leftEye.position.set(-0.048, 1.332, 0.138);
  const rightEye = createEye(0.95);
  rightEye.position.set(0.048, 1.332, 0.138);
  group.add(leftEye, rightEye);

  // Subtle graying eyebrows
  const browMat = new THREE.MeshStandardMaterial({ color: 0x4A4D54, roughness: 0.9 });
  const browGeo = new THREE.BoxGeometry(0.04, 0.009, 0.015);
  const leftBrow = new THREE.Mesh(browGeo, browMat);
  leftBrow.position.set(-0.048, 1.362, 0.145);
  leftBrow.rotation.z = -0.1;
  const rightBrow = new THREE.Mesh(browGeo, browMat);
  rightBrow.position.set(0.048, 1.362, 0.145);
  rightBrow.rotation.z = 0.1;
  group.add(leftBrow, rightBrow);

  // Fitted Graying Hair (Cleanly covers back and sides of skull)
  const hairGeo = new THREE.SphereGeometry(0.158, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62);
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x484B52, roughness: 0.85 });
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 1.325;
  hair.rotation.x = -0.15;
  group.add(hair);

  // Signature Marathi Mustache with highlight
  const stacheGeo = new THREE.BoxGeometry(0.13, 0.032, 0.045);
  const stacheMat = new THREE.MeshStandardMaterial({ color: 0x2A2B2E, roughness: 0.85 });
  const stache = new THREE.Mesh(stacheGeo, stacheMat);
  stache.position.set(0, 1.265, 0.145);
  group.add(stache);

  // Spectacles with gleaming gold rims
  const glassesGroup = new THREE.Group();
  const rimGeo = new THREE.TorusGeometry(0.034, 0.0055, 8, 20);
  const leftRim = new THREE.Mesh(rimGeo, goldTrimMaterial);
  leftRim.position.set(-0.048, 1.332, 0.15);
  const rightRim = new THREE.Mesh(rimGeo, goldTrimMaterial);
  rightRim.position.set(0.048, 1.332, 0.15);
  glassesGroup.add(leftRim, rightRim);

  const bridgeGeo = new THREE.BoxGeometry(0.026, 0.005, 0.006);
  const bridge = new THREE.Mesh(bridgeGeo, goldTrimMaterial);
  bridge.position.set(0, 1.332, 0.152);
  glassesGroup.add(bridge);
  group.add(glassesGroup);

  // Left Arm (Resting on table)
  const leftArm = createArm(babanraoShirtMaterial, babanraoSkinMaterial, false, false, 'babanrao');
  leftArm.position.set(-0.25, 1.06, 0);
  group.add(leftArm);

  // Right Arm (Resting on table / animated for card play)
  const rightArm = createArm(babanraoShirtMaterial, babanraoSkinMaterial, true, false, 'babanrao');
  rightArm.position.set(0.25, 1.06, 0);
  group.add(rightArm);

  group.userData = {
    head,
    torso,
    rightArm,
    leftArm,
    baseY: 0,
    animTime: 0
  };

  return group;
}

// 2. Build Opponent 2: Dinkar (The Hype Guy on your left)
export function createDinkar() {
  const group = new THREE.Group();
  group.name = 'Dinkar';

  // Torso / Varsity Jacket with rich maroon fabric
  const torsoGeo = new THREE.CylinderGeometry(0.25, 0.21, 0.65, 16);
  const torso = new THREE.Mesh(torsoGeo, dinkarJacketMaterial);
  torso.position.y = 0.82;
  torso.castShadow = true;
  torso.receiveShadow = true;
  group.add(torso);

  // Varsity collar ribbing
  const ribGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.05, 14);
  const ribMat = new THREE.MeshStandardMaterial({ color: 0xF5F0E6, roughness: 0.6 });
  const rib = new THREE.Mesh(ribGeo, ribMat);
  rib.position.y = 1.13;
  group.add(rib);

  // Shoulders (Varsity cream contrast)
  const shoulderGeo = new THREE.SphereGeometry(0.088, 12, 12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, dinkarSleeveMaterial);
  leftShoulder.position.set(-0.26, 1.08, 0);
  const rightShoulder = new THREE.Mesh(shoulderGeo, dinkarSleeveMaterial);
  rightShoulder.position.set(0.26, 1.08, 0);
  group.add(leftShoulder, rightShoulder);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 12);
  const neck = new THREE.Mesh(neckGeo, dinkarSkinMaterial);
  neck.position.y = 1.18;
  group.add(neck);

  // Bold Gold Chain Necklace!
  const chainGeo = new THREE.TorusGeometry(0.10, 0.012, 8, 24);
  const chain = new THREE.Mesh(chainGeo, goldTrimMaterial);
  chain.position.set(0, 1.12, 0.08);
  chain.rotation.x = Math.PI / 2.6;
  group.add(chain);

  // Head
  const headGeo = new THREE.SphereGeometry(0.152, 22, 22);
  const head = new THREE.Mesh(headGeo, dinkarSkinMaterial);
  head.position.y = 1.32;
  head.castShadow = true;
  group.add(head);

  // Modern styled hair cap
  const hairGeo = new THREE.SphereGeometry(0.158, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x161311, roughness: 0.8 });
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 1.33;
  hair.rotation.x = -0.1;
  group.add(hair);

  // High-End Sunglasses with Gold Rims and Reflection Streaks
  const shadesGroup = new THREE.Group();
  
  // Gold frames
  const frameGeo = new THREE.BoxGeometry(0.165, 0.048, 0.02);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.2 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 1.33, 0.145);
  shadesGroup.add(frame);

  // Dark polarized lenses
  const lensGeo = new THREE.BoxGeometry(0.065, 0.038, 0.008);
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x0A0D12, metalness: 0.9, roughness: 0.05 });
  const leftLens = new THREE.Mesh(lensGeo, lensMat);
  leftLens.position.set(-0.042, 1.33, 0.156);
  const rightLens = new THREE.Mesh(lensGeo, lensMat);
  rightLens.position.set(0.042, 1.33, 0.156);
  shadesGroup.add(leftLens, rightLens);

  // Bright reflection glare strips across sunglasses
  const glareGeo = new THREE.PlaneGeometry(0.035, 0.007);
  const glareMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const leftGlare = new THREE.Mesh(glareGeo, glareMat);
  leftGlare.position.set(-0.042, 1.338, 0.161);
  leftGlare.rotation.z = 0.3;
  const rightGlare = new THREE.Mesh(glareGeo, glareMat);
  rightGlare.position.set(0.042, 1.338, 0.161);
  rightGlare.rotation.z = 0.3;
  shadesGroup.add(leftGlare, rightGlare);

  group.add(shadesGroup);

  // Smirking Mouth
  const smileGeo = new THREE.TorusGeometry(0.026, 0.004, 6, 12, Math.PI * 0.7);
  const smileMat = new THREE.MeshStandardMaterial({ color: 0x4D211A, roughness: 0.6 });
  const smile = new THREE.Mesh(smileGeo, smileMat);
  smile.position.set(0.015, 1.255, 0.145);
  smile.rotation.z = Math.PI * 0.9;
  group.add(smile);

  // Cream Sleeves on Arms resting on table
  const leftArm = createArm(dinkarSleeveMaterial, dinkarSkinMaterial, false, false, 'dinkar');
  leftArm.position.set(-0.25, 1.06, 0);
  group.add(leftArm);

  const rightArm = createArm(dinkarSleeveMaterial, dinkarSkinMaterial, true, false, 'dinkar');
  rightArm.position.set(0.25, 1.06, 0);
  group.add(rightArm);

  group.userData = { head, torso, rightArm, leftArm, animTime: 0 };
  return group;
}

// 3. Build Opponent 3: Anandi (The Calm Mastermind on your right)
export function createAnandi() {
  const group = new THREE.Group();
  group.name = 'Anandi';

  // Torso / Elegant Emerald Silk Kurti / Saree
  const torsoGeo = new THREE.CylinderGeometry(0.22, 0.19, 0.62, 16);
  const torso = new THREE.Mesh(torsoGeo, anandiDressMaterial);
  torso.position.y = 0.82;
  torso.castShadow = true;
  torso.receiveShadow = true;
  group.add(torso);

  // Gold Zari Neckline & Border
  const zariGeo = new THREE.TorusGeometry(0.12, 0.01, 8, 20, Math.PI);
  const zari = new THREE.Mesh(zariGeo, goldTrimMaterial);
  zari.position.set(0, 1.08, 0.15);
  zari.rotation.x = Math.PI / 2.3;
  group.add(zari);

  // Shoulders
  const shoulderGeo = new THREE.SphereGeometry(0.078, 12, 12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, anandiDressMaterial);
  leftShoulder.position.set(-0.23, 1.08, 0);
  const rightShoulder = new THREE.Mesh(shoulderGeo, anandiDressMaterial);
  rightShoulder.position.set(0.23, 1.08, 0);
  group.add(leftShoulder, rightShoulder);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.12, 12);
  const neck = new THREE.Mesh(neckGeo, anandiSkinMaterial);
  neck.position.y = 1.18;
  group.add(neck);

  // Head
  const headGeo = new THREE.SphereGeometry(0.144, 22, 22);
  const head = new THREE.Mesh(headGeo, anandiSkinMaterial);
  head.position.y = 1.30;
  head.castShadow = true;
  group.add(head);

  // Expressive Calm Eyes
  const leftEye = createEye(0.9);
  leftEye.position.set(-0.044, 1.315, 0.132);
  const rightEye = createEye(0.9);
  rightEye.position.set(0.044, 1.315, 0.132);
  group.add(leftEye, rightEye);

  // Traditional Red Bindi on Forehead!
  const bindiGeo = new THREE.SphereGeometry(0.009, 8, 8);
  const bindiMat = new THREE.MeshStandardMaterial({ color: 0xBF1020, roughness: 0.4 });
  const bindi = new THREE.Mesh(bindiGeo, bindiMat);
  bindi.position.set(0, 1.352, 0.141);
  bindi.scale.set(1, 1, 0.4);
  group.add(bindi);

  // Golden Jhumka Earrings!
  [-0.145, 0.145].forEach((x) => {
    const earring = new THREE.Group();
    const studGeo = new THREE.SphereGeometry(0.009, 8, 8);
    const stud = new THREE.Mesh(studGeo, goldTrimMaterial);
    earring.add(stud);

    const bellGeo = new THREE.ConeGeometry(0.016, 0.025, 10);
    const bell = new THREE.Mesh(bellGeo, goldTrimMaterial);
    bell.position.y = -0.024;
    earring.add(bell);

    earring.position.set(x, 1.285, 0.02);
    group.add(earring);
  });

  // Traditional Hair & Voluminous Bun
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x0A0808, roughness: 0.75 });
  const hairGeo = new THREE.SphereGeometry(0.148, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.65);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 1.305;
  hair.rotation.x = -0.15;
  group.add(hair);

  const bunGeo = new THREE.SphereGeometry(0.075, 14, 14);
  const bun = new THREE.Mesh(bunGeo, hairMat);
  bun.position.set(0, 1.31, -0.135);
  group.add(bun);

  // Gold hairpin / Gajra accent on hair bun
  const gajraGeo = new THREE.TorusGeometry(0.065, 0.012, 8, 20);
  const gajra = new THREE.Mesh(gajraGeo, goldTrimMaterial);
  gajra.position.set(0, 1.31, -0.125);
  group.add(gajra);

  // Arms with Gold Bangles on both wrists resting on table
  const leftArm = createArm(anandiDressMaterial, anandiSkinMaterial, false, true);
  leftArm.position.set(-0.23, 1.06, 0);
  group.add(leftArm);

  const rightArm = createArm(anandiDressMaterial, anandiSkinMaterial, true, true);
  rightArm.position.set(0.23, 1.06, 0);
  group.add(rightArm);

  group.userData = { head, torso, rightArm, leftArm, animTime: 0 };
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
    d.torso.position.y = 0.82 + Math.sin(time * 2.2 + char.position.x) * 0.006;
  }
  if (d.head) {
    d.head.position.y = 1.32 + Math.sin(time * 2.2 + char.position.x) * 0.007;
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
