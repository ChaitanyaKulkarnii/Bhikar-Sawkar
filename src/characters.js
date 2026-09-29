// 3D Stylized Tabletop Character Rigs & Animation Controller for Bhikar Sawkar
import * as THREE from 'three';

// Materials for characters
const skinMaterial = new THREE.MeshStandardMaterial({
  color: 0xC68642,
  roughness: 0.6,
  metalness: 0.05
});

const babanraoJacketMaterial = new THREE.MeshStandardMaterial({
  color: 0x2A3439, // Dark slate Nehru waistcoat
  roughness: 0.7
});

const babanraoShirtMaterial = new THREE.MeshStandardMaterial({
  color: 0xEAE4D8, // Off-white cotton kurta
  roughness: 0.75
});

const dinkarJacketMaterial = new THREE.MeshStandardMaterial({
  color: 0x8A2B2B, // Deep maroon varsity jacket
  roughness: 0.55
});

const anandiDressMaterial = new THREE.MeshStandardMaterial({
  color: 0x1E4D43, // Deep emerald silk
  roughness: 0.45,
  metalness: 0.15
});

const woodChairMaterial = new THREE.MeshStandardMaterial({
  color: 0x26170E,
  roughness: 0.7
});

const goldBangleMaterial = new THREE.MeshStandardMaterial({
  color: 0xC9A24B,
  roughness: 0.3,
  metalness: 0.8
});

// Helper to build a wooden chair
export function createChair() {
  const chair = new THREE.Group();
  
  // Seat
  const seatGeo = new THREE.BoxGeometry(0.55, 0.05, 0.55);
  const seat = new THREE.Mesh(seatGeo, woodChairMaterial);
  seat.position.y = 0.45;
  chair.add(seat);

  // Backrest
  const backGeo = new THREE.BoxGeometry(0.52, 0.65, 0.05);
  const back = new THREE.Mesh(backGeo, woodChairMaterial);
  back.position.set(0, 0.8, -0.24);
  chair.add(back);

  return chair;
}

// 1. Build Opponent 1: Babanrao (The Veteran Uncle across the table)
export function createBabanrao() {
  const group = new THREE.Group();
  group.name = 'Babanrao';

  // Torso / Kurta & Jacket
  const torsoGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.65, 16);
  const torso = new THREE.Mesh(torsoGeo, babanraoJacketMaterial);
  torso.position.y = 0.82;
  torso.castShadow = true;
  group.add(torso);

  // Shoulders (Smooth anatomical blend)
  const shoulderGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, babanraoJacketMaterial);
  leftShoulder.position.set(-0.25, 1.08, 0);
  const rightShoulder = new THREE.Mesh(shoulderGeo, babanraoJacketMaterial);
  rightShoulder.position.set(0.25, 1.08, 0);
  group.add(leftShoulder, rightShoulder);

  // Neck & Kurta collar
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 12);
  const neck = new THREE.Mesh(neckGeo, skinMaterial);
  neck.position.y = 1.18;
  group.add(neck);

  const collarGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.06, 12);
  const collar = new THREE.Mesh(collarGeo, babanraoShirtMaterial);
  collar.position.y = 1.14;
  group.add(collar);

  // Head
  const headGeo = new THREE.SphereGeometry(0.15, 20, 20);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  head.position.y = 1.32;
  head.castShadow = true;
  group.add(head);

  // Fitted Graying Hair (Cleanly covers back and sides of skull)
  const hairGeo = new THREE.SphereGeometry(0.154, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62);
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x484B52, roughness: 0.85 });
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 1.325;
  hair.rotation.x = -0.15;
  group.add(hair);

  // Signature Marathi Mustache
  const stacheGeo = new THREE.BoxGeometry(0.12, 0.028, 0.04);
  const stacheMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
  const stache = new THREE.Mesh(stacheGeo, stacheMat);
  stache.position.set(0, 1.27, 0.142);
  group.add(stache);

  // Spectacles
  const glassesGroup = new THREE.Group();
  const rimGeo = new THREE.TorusGeometry(0.032, 0.005, 8, 16);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xC9A24B, metalness: 0.9, roughness: 0.2 });
  const leftRim = new THREE.Mesh(rimGeo, rimMat);
  leftRim.position.set(-0.045, 1.33, 0.145);
  const rightRim = new THREE.Mesh(rimGeo, rimMat);
  rightRim.position.set(0.045, 1.33, 0.145);
  glassesGroup.add(leftRim, rightRim);

  const bridgeGeo = new THREE.BoxGeometry(0.025, 0.005, 0.005);
  const bridge = new THREE.Mesh(bridgeGeo, rimMat);
  bridge.position.set(0, 1.33, 0.148);
  glassesGroup.add(bridge);
  group.add(glassesGroup);

  // Left Arm (Resting on table)
  const leftArm = createArm(babanraoShirtMaterial, skinMaterial, false);
  leftArm.position.set(-0.25, 1.05, 0);
  leftArm.rotation.set(0.7, 0.3, -0.4);
  group.add(leftArm);

  // Right Arm (Animated for card play & table slap)
  const rightArm = createArm(babanraoShirtMaterial, skinMaterial, true);
  rightArm.position.set(0.25, 1.05, 0);
  rightArm.rotation.set(0.7, -0.3, 0.4);
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

// 2. Build Opponent 2: Dinkar (The Hype Guy)
export function createDinkar() {
  const group = new THREE.Group();
  group.name = 'Dinkar';

  // Torso / Varsity Jacket
  const torsoGeo = new THREE.CylinderGeometry(0.25, 0.21, 0.65, 16);
  const torso = new THREE.Mesh(torsoGeo, dinkarJacketMaterial);
  torso.position.y = 0.82;
  torso.castShadow = true;
  group.add(torso);

  // Shoulders
  const shoulderGeo = new THREE.SphereGeometry(0.085, 12, 12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, dinkarJacketMaterial);
  leftShoulder.position.set(-0.26, 1.08, 0);
  const rightShoulder = new THREE.Mesh(shoulderGeo, dinkarJacketMaterial);
  rightShoulder.position.set(0.26, 1.08, 0);
  group.add(leftShoulder, rightShoulder);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 12);
  const neck = new THREE.Mesh(neckGeo, skinMaterial);
  neck.position.y = 1.18;
  group.add(neck);

  // Head
  const headGeo = new THREE.SphereGeometry(0.15, 20, 20);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  head.position.y = 1.32;
  head.castShadow = true;
  group.add(head);

  // Fitted Modern Hair Cap
  const hairGeo = new THREE.SphereGeometry(0.155, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x161311, roughness: 0.8 });
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 1.33;
  hair.rotation.x = -0.1;
  group.add(hair);

  // Sunglasses on eyes
  const shadesGroup = new THREE.Group();
  const frameGeo = new THREE.BoxGeometry(0.16, 0.045, 0.02);
  const shadesMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9 });
  const frame = new THREE.Mesh(frameGeo, shadesMat);
  frame.position.set(0, 1.33, 0.145);
  shadesGroup.add(frame);
  group.add(shadesGroup);

  // Arms
  const leftArm = createArm(dinkarJacketMaterial, skinMaterial, false);
  leftArm.position.set(-0.26, 1.05, 0);
  leftArm.rotation.set(0.7, 0.2, -0.3);
  group.add(leftArm);

  const rightArm = createArm(dinkarJacketMaterial, skinMaterial, true);
  rightArm.position.set(0.26, 1.05, 0);
  rightArm.rotation.set(0.7, -0.2, 0.3);
  group.add(rightArm);

  group.userData = { head, torso, rightArm, leftArm, animTime: 0 };
  return group;
}

// 3. Build Opponent 3: Anandi (The Calm Mastermind)
export function createAnandi() {
  const group = new THREE.Group();
  group.name = 'Anandi';

  // Torso / Elegant Emerald Saree/Kurti
  const torsoGeo = new THREE.CylinderGeometry(0.21, 0.19, 0.62, 16);
  const torso = new THREE.Mesh(torsoGeo, anandiDressMaterial);
  torso.position.y = 0.82;
  torso.castShadow = true;
  group.add(torso);

  // Shoulders
  const shoulderGeo = new THREE.SphereGeometry(0.075, 12, 12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, anandiDressMaterial);
  leftShoulder.position.set(-0.22, 1.08, 0);
  const rightShoulder = new THREE.Mesh(shoulderGeo, anandiDressMaterial);
  rightShoulder.position.set(0.22, 1.08, 0);
  group.add(leftShoulder, rightShoulder);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.12, 12);
  const neck = new THREE.Mesh(neckGeo, skinMaterial);
  neck.position.y = 1.18;
  group.add(neck);

  // Head
  const headGeo = new THREE.SphereGeometry(0.14, 20, 20);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  head.position.y = 1.30;
  head.castShadow = true;
  group.add(head);

  // Traditional Fitted Hair & Bun
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x0A0808, roughness: 0.75 });
  const hairGeo = new THREE.SphereGeometry(0.145, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.65);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 1.305;
  hair.rotation.x = -0.15;
  group.add(hair);

  const bunGeo = new THREE.SphereGeometry(0.07, 14, 14);
  const bun = new THREE.Mesh(bunGeo, hairMat);
  bun.position.set(0, 1.31, -0.135);
  group.add(bun);

  // Arms with Gold Bangles
  const leftArm = createArm(anandiDressMaterial, skinMaterial, false, true);
  leftArm.position.set(-0.23, 1.05, 0);
  leftArm.rotation.set(0.7, 0.3, -0.3);
  group.add(leftArm);

  const rightArm = createArm(anandiDressMaterial, skinMaterial, true, true);
  rightArm.position.set(0.23, 1.05, 0);
  rightArm.rotation.set(0.7, -0.3, 0.3);
  group.add(rightArm);

  group.userData = { head, torso, rightArm, leftArm, animTime: 0 };
  return group;
}

// 4. First-Person Player Hands (Foreground in front of camera)
export function createPlayerArms() {
  const group = new THREE.Group();
  group.name = 'PlayerArms';

  // Left Arm resting on table edge
  const leftArm = new THREE.Group();
  const leftForearm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.04, 0.55, 10),
    skinMaterial
  );
  leftForearm.position.set(0, -0.22, 0.1);
  leftForearm.rotation.x = 1.2;
  leftArm.add(leftForearm);

  const leftHand = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.04, 0.13),
    skinMaterial
  );
  leftHand.position.set(0, -0.06, 0.32);
  leftHand.rotation.x = 0.2;
  leftArm.add(leftHand);

  leftArm.position.set(-0.38, -0.25, -0.45);
  group.add(leftArm);

  // Right Arm (Ready to flip cards into the pot!)
  const rightArm = new THREE.Group();
  const rightForearm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.04, 0.55, 10),
    skinMaterial
  );
  rightForearm.position.set(0, -0.22, 0.1);
  rightForearm.rotation.x = 1.2;
  rightArm.add(rightForearm);

  const rightHand = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.04, 0.13),
    skinMaterial
  );
  rightHand.position.set(0, -0.06, 0.32);
  rightHand.rotation.x = 0.2;
  rightArm.add(rightHand);

  rightArm.position.set(0.38, -0.25, -0.45);
  group.add(rightArm);

  group.userData = {
    leftArm,
    rightArm,
    initialRightPos: rightArm.position.clone(),
    initialRightRot: rightArm.rotation.clone()
  };

  return group;
}

// Helper: Articulated Arm
function createArm(sleeveMat, handSkinMat, isRight = false, addBangle = false) {
  const arm = new THREE.Group();

  // Upper arm
  const upperGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.35, 10);
  const upper = new THREE.Mesh(upperGeo, sleeveMat);
  upper.position.y = -0.16;
  arm.add(upper);

  // Forearm
  const foreGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.34, 10);
  const fore = new THREE.Mesh(foreGeo, handSkinMat);
  fore.position.set(0, -0.42, 0.12);
  fore.rotation.x = 0.8;
  arm.add(fore);

  // Hand
  const handGeo = new THREE.BoxGeometry(0.08, 0.035, 0.11);
  const hand = new THREE.Mesh(handGeo, handSkinMat);
  hand.position.set(0, -0.52, 0.24);
  hand.rotation.x = 0.2;
  arm.add(hand);

  // Gold Bangle for Anandi
  if (addBangle) {
    const bangleGeo = new THREE.TorusGeometry(0.046, 0.007, 8, 16);
    const bangle = new THREE.Mesh(bangleGeo, goldBangleMaterial);
    bangle.position.set(0, -0.48, 0.2);
    bangle.rotation.x = Math.PI / 2;
    arm.add(bangle);
  }

  arm.userData = { upper, fore, hand, isRight };
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
  const duration = 450; // ms

  let dropped = false;

  function step() {
    const now = performance.now();
    const progress = Math.min(1, (now - startTime) / duration);

    if (progress < 0.45) {
      // 1. Reach down toward deck & lift
      const p = progress / 0.45;
      arm.rotation.x = origRot.x - p * 0.6;
      arm.rotation.z = origRot.z + p * 0.3;
    } else if (progress < 0.75) {
      // 2. Thrust forward into the center pot!
      const p = (progress - 0.45) / 0.3;
      arm.rotation.x = origRot.x - 0.6 + p * 0.9;
      arm.rotation.y = origRot.y + (character.position.x < 0 ? -0.4 : 0.4) * p;

      if (!dropped && progress > 0.6) {
        dropped = true;
        if (onDrop) onDrop();
      }
    } else {
      // 3. Return to rest
      const p = (progress - 0.75) / 0.25;
      arm.rotation.x = origRot.x + 0.3 * (1 - p);
      arm.rotation.y = origRot.y * (1 - p);
      arm.rotation.z = origRot.z * (1 - p);
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

    if (progress < 0.4) {
      // Reach down to personal stack
      const p = progress / 0.4;
      rightArm.position.y = startPos.y - 0.08 * p;
      rightArm.position.z = startPos.z - 0.15 * p;
    } else if (progress < 0.7) {
      // Throw card forward toward pot
      const p = (progress - 0.4) / 0.3;
      rightArm.position.y = startPos.y + 0.12 * p;
      rightArm.position.z = startPos.z + 0.25 * p;
      rightArm.position.x = startPos.x - 0.15 * p;

      if (!dropped && progress > 0.55) {
        dropped = true;
        if (onDrop) onDrop();
      }
    } else {
      // Recover back to rest
      const p = (progress - 0.7) / 0.3;
      rightArm.position.lerpVectors(
        new THREE.Vector3(startPos.x - 0.15, startPos.y + 0.12, startPos.z + 0.25),
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
