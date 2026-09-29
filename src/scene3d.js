// 3D First-Person Perspective (FPP) Tabletop Scene with Three.js
import * as THREE from 'three';
import {
  createBabanrao,
  createDinkar,
  createAnandi,
  createPlayerArms,
  createChair,
  updateCharacterIdle,
  animateCardThrow,
  animatePlayerThrow
} from './characters.js';
import { getCardFaceTexture, getCardBackTexture, getFeltTexture } from './textures.js';

export class TableScene3D {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    // Three.js Core
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0A0D12);
    this.scene.fog = new THREE.FogExp2(0x0A0D12, 0.28);

    this.camera = new THREE.PerspectiveCamera(54, this.width / this.height, 0.1, 50);
    // Eye level sitting at the table
    this.camera.position.set(0, 1.15, 0.95);
    this.cameraBasePos = this.camera.position.clone();
    this.cameraTarget = new THREE.Vector3(0, 0.74, -0.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Mouse Parallax for natural FPP Head Look
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.initMouseLook();

    // Lighting & Environment
    this.setupLighting();
    this.setupRoomAndTable();

    // Characters
    this.characters = {};
    this.setupCharacters();

    // Foreground Player Hands attached to Camera
    this.playerArms = createPlayerArms();
    this.camera.add(this.playerArms);
    this.scene.add(this.camera);

    // 3D Card Meshes & Stacks
    this.cardGeometry = new THREE.BoxGeometry(0.2, 0.002, 0.28);
    this.cardBackMaterial = new THREE.MeshStandardMaterial({
      map: getCardBackTexture(),
      roughness: 0.4,
      metalness: 0.1
    });

    this.deckStacks = {};
    this.potCards = [];
    this.flyingCards = [];
    this.initDeckStacks();

    // Shake & Impact
    this.shakeAmount = 0;
    this.clock = new THREE.Clock();

    // Resize Handler
    window.addEventListener('resize', () => this.onResize());

    // Start Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initMouseLook() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  setupLighting() {
    // Dim atmospheric room fill
    const ambientLight = new THREE.AmbientLight(0x1B212B, 0.9);
    this.scene.add(ambientLight);

    // Overhead Suspended Industrial Lamp
    this.lampRig = new THREE.Group();
    this.lampRig.position.set(0, 2.15, -0.15);

    // Lamp Shade Mesh
    const shadeGeo = new THREE.ConeGeometry(0.24, 0.25, 16, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0x22262E,
      roughness: 0.5,
      metalness: 0.8,
      side: THREE.DoubleSide
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.rotation.x = Math.PI;
    this.lampRig.add(shade);

    // Brass Socket
    const brassGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xC9A24B, metalness: 0.9, roughness: 0.2 });
    const brass = new THREE.Mesh(brassGeo, brassMat);
    brass.position.y = 0.16;
    this.lampRig.add(brass);

    // Hanging Wire
    const wireGeo = new THREE.CylinderGeometry(0.005, 0.005, 1.5, 8);
    const wire = new THREE.Mesh(wireGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }));
    wire.position.y = 0.9;
    this.lampRig.add(wire);

    // Warm Incandescent Spotlight casting shadows on the green felt
    this.spotLight = new THREE.SpotLight(0xFCE6A2, 4.2);
    this.spotLight.position.set(0, 0, 0);
    this.spotLight.angle = 0.65;
    this.spotLight.penumbra = 0.65;
    this.spotLight.decay = 1.4;
    this.spotLight.distance = 5;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 4;
    this.spotLight.shadow.bias = -0.0008;

    this.spotTarget = new THREE.Object3D();
    this.spotTarget.position.set(0, 0.72, -0.15);
    this.scene.add(this.spotTarget);
    this.spotLight.target = this.spotTarget;

    this.lampRig.add(this.spotLight);
    this.scene.add(this.lampRig);

    // Soft warm point glow inside shade
    const bulbGlow = new THREE.PointLight(0xF8D77B, 1.2, 1.5);
    bulbGlow.position.set(0, -0.05, 0);
    this.lampRig.add(bulbGlow);
  }

  setupRoomAndTable() {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x090C10, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Back Basement Brick/Wood Wall
    const wallGeo = new THREE.PlaneGeometry(12, 6);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x11161D, roughness: 0.85 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 2.5, -3.2);
    this.scene.add(wall);

    // TABLE
    this.tableGroup = new THREE.Group();
    this.tableGroup.position.set(0, 0, -0.15);

    // Outer Wooden Rim
    const rimGeo = new THREE.CylinderGeometry(1.22, 1.18, 0.08, 36);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x342214,
      roughness: 0.45,
      metalness: 0.15
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = 0.69;
    rim.receiveShadow = true;
    this.tableGroup.add(rim);

    // Table Baize / Green Felt Surface
    const feltGeo = new THREE.CylinderGeometry(1.14, 1.14, 0.085, 36);
    const feltMat = new THREE.MeshStandardMaterial({
      map: getFeltTexture(),
      roughness: 0.85,
      metalness: 0.02
    });
    const felt = new THREE.Mesh(feltGeo, feltMat);
    felt.position.y = 0.695;
    felt.receiveShadow = true;
    this.tableGroup.add(felt);

    // Brass Inner Ring
    const brassTrimGeo = new THREE.TorusGeometry(1.14, 0.008, 8, 36);
    const brassTrimMat = new THREE.MeshStandardMaterial({ color: 0xC9A24B, metalness: 0.8, roughness: 0.3 });
    const brassTrim = new THREE.Mesh(brassTrimGeo, brassTrimMat);
    brassTrim.position.y = 0.74;
    brassTrim.rotation.x = Math.PI / 2;
    this.tableGroup.add(brassTrim);

    // Sturdy Wooden Table Base / Pillar
    const baseGeo = new THREE.CylinderGeometry(0.28, 0.42, 0.68, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x22150D, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.34;
    this.tableGroup.add(base);

    this.scene.add(this.tableGroup);
  }

  setupCharacters() {
    // 1. Across table: Babanrao (The Veteran)
    const babanrao = createBabanrao();
    babanrao.position.set(0, 0, -1.35);
    babanrao.rotation.y = 0;
    const chairTop = createChair();
    chairTop.position.set(0, 0, -1.35);
    this.scene.add(chairTop, babanrao);
    this.characters['top'] = babanrao;

    // 2. Left seat: Dinkar (The Hype Guy)
    const dinkar = createDinkar();
    dinkar.position.set(-1.18, 0, -0.42);
    dinkar.rotation.y = Math.PI / 3.2;
    const chairLeft = createChair();
    chairLeft.position.set(-1.18, 0, -0.42);
    chairLeft.rotation.y = Math.PI / 3.2;
    this.scene.add(chairLeft, dinkar);
    this.characters['left'] = dinkar;

    // 3. Right seat: Anandi (The Mastermind)
    const anandi = createAnandi();
    anandi.position.set(1.18, 0, -0.42);
    anandi.rotation.y = -Math.PI / 3.2;
    const chairRight = createChair();
    chairRight.position.set(1.18, 0, -0.42);
    chairRight.rotation.y = -Math.PI / 3.2;
    this.scene.add(chairRight, anandi);
    this.characters['right'] = anandi;
  }

  initDeckStacks() {
    // 4 Player Decks on table
    const stackDefs = {
      bottom: { pos: new THREE.Vector3(0.24, 0.74, 0.52), rot: 0.05 },
      top: { pos: new THREE.Vector3(0.22, 0.74, -0.85), rot: -0.05 },
      left: { pos: new THREE.Vector3(-0.72, 0.74, -0.32), rot: 0.75 },
      right: { pos: new THREE.Vector3(0.72, 0.74, -0.32), rot: -0.75 }
    };

    for (const [seat, def] of Object.entries(stackDefs)) {
      const group = new THREE.Group();
      group.position.copy(def.pos);
      group.rotation.y = def.rot;

      // 3D physical deck mesh
      const deckMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.04, 0.28),
        this.cardBackMaterial
      );
      deckMesh.position.y = 0.02;
      deckMesh.castShadow = true;
      deckMesh.receiveShadow = true;
      group.add(deckMesh);

      this.scene.add(group);
      this.deckStacks[seat] = { group, mesh: deckMesh, basePos: def.pos.clone() };
    }
  }

  // Update physical thickness of player card stacks
  updateDeckCounts(counts) {
    for (const [seat, count] of Object.entries(counts)) {
      const stack = this.deckStacks[seat];
      if (!stack) continue;

      if (count <= 0) {
        stack.group.visible = false;
      } else {
        stack.group.visible = true;
        const height = Math.max(0.004, (count / 52) * 0.07);
        stack.mesh.scale.set(1, height / 0.04, 1);
        stack.mesh.position.y = height / 2;
      }
    }
  }

  // Set visible characters according to player count (2, 3, or 4)
  setPlayerCount(count) {
    if (this.characters['left']) this.characters['left'].visible = count >= 3;
    if (this.characters['right']) this.characters['right'].visible = count >= 4;
    if (this.deckStacks['left']) this.deckStacks['left'].group.visible = count >= 3;
    if (this.deckStacks['right']) this.deckStacks['right'].group.visible = count >= 4;
  }

  // Animate a player or opponent tossing card onto central pot
  playCardThrow(seat, card, onLanded) {
    const potTargetPos = new THREE.Vector3(
      (Math.random() - 0.5) * 0.12,
      0.74 + this.potCards.length * 0.003,
      -0.15 + (Math.random() - 0.5) * 0.12
    );

    const onDrop = () => {
      // Spawn real 3D card flying into the pot
      this.spawnFlyingCard(seat, card, potTargetPos, onLanded);
    };

    if (seat === 'bottom') {
      animatePlayerThrow(this.playerArms, onDrop);
    } else if (this.characters[seat]) {
      animateCardThrow(this.characters[seat], potTargetPos, onDrop);
    } else {
      onDrop();
    }
  }

  // Flying Card Animation Curve
  spawnFlyingCard(seat, card, targetPos, onLanded) {
    const startPos = this.deckStacks[seat]?.basePos.clone() || new THREE.Vector3(0, 0.74, 0.5);
    startPos.y += 0.06;

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xF5F0E6 }), // edge
      new THREE.MeshStandardMaterial({ color: 0xF5F0E6 }), // edge
      new THREE.MeshStandardMaterial({ map: getCardFaceTexture(card), roughness: 0.4 }), // top (face)
      this.cardBackMaterial, // bottom (back)
      new THREE.MeshStandardMaterial({ color: 0xF5F0E6 }), // edge
      new THREE.MeshStandardMaterial({ color: 0xF5F0E6 })  // edge
    ];

    const cardMesh = new THREE.Mesh(this.cardGeometry, materials);
    cardMesh.position.copy(startPos);
    cardMesh.castShadow = true;
    this.scene.add(cardMesh);

    const startTime = performance.now();
    const duration = 260; // snappy, tactile speed
    const rotTarget = (Math.random() - 0.5) * 0.45;

    const animObj = {
      update: (now) => {
        const p = Math.min(1, (now - startTime) / duration);
        // Parabolic arc
        cardMesh.position.lerpVectors(startPos, targetPos, p);
        cardMesh.position.y += Math.sin(p * Math.PI) * 0.18; // lift height

        // Flip card face-up
        cardMesh.rotation.x = Math.PI * (1 - p);
        cardMesh.rotation.y = rotTarget * p;

        if (p >= 1) {
          cardMesh.position.copy(targetPos);
          cardMesh.rotation.set(0, rotTarget, 0);
          this.potCards.push(cardMesh);
          this.triggerCameraShake(0.012);
          if (onLanded) onLanded();
          return false; // remove from flying list
        }
        return true;
      }
    };

    this.flyingCards.push(animObj);
  }

  // Sawkar Match Collection: Cards fly in golden arc into winning player's stack!
  sweepPotToWinner(seat, onComplete) {
    const targetStack = this.deckStacks[seat]?.basePos.clone() || new THREE.Vector3(0, 0.74, 0.5);
    targetStack.y += 0.08;

    const cardsToSweep = [...this.potCards];
    this.potCards = [];

    const startTime = performance.now();
    const duration = 400;

    cardsToSweep.forEach((mesh, idx) => {
      const startPos = mesh.position.clone();
      const delay = idx * 18;

      const animObj = {
        update: (now) => {
          if (now < startTime + delay) return true;
          const p = Math.min(1, (now - (startTime + delay)) / duration);

          mesh.position.lerpVectors(startPos, targetStack, p);
          mesh.position.y += Math.sin(p * Math.PI) * 0.22;
          mesh.rotation.y += 0.1;
          mesh.scale.setScalar(1 - p * 0.25);

          if (p >= 1) {
            this.scene.remove(mesh);
            mesh.geometry?.dispose();
            return false;
          }
          return true;
        }
      };
      this.flyingCards.push(animObj);
    });

    setTimeout(() => {
      if (onComplete) onComplete();
    }, duration + cardsToSweep.length * 18 + 50);
  }

  triggerCameraShake(intensity = 0.02) {
    this.shakeAmount = intensity;
  }

  onResize() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // 1. Mouse Head Look (First Person subtle look-around)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    const lookX = this.cameraTarget.x + this.mouse.x * 0.22;
    const lookY = this.cameraTarget.y + this.mouse.y * 0.12;
    const lookZ = this.cameraTarget.z;

    this.camera.position.x = this.cameraBasePos.x + this.mouse.x * 0.08;
    this.camera.position.y = this.cameraBasePos.y + this.mouse.y * 0.05;

    // Apply Camera Shake
    if (this.shakeAmount > 0.0005) {
      this.camera.position.x += (Math.random() - 0.5) * this.shakeAmount;
      this.camera.position.y += (Math.random() - 0.5) * this.shakeAmount;
      this.shakeAmount *= 0.88;
    }

    this.camera.lookAt(lookX, lookY, lookZ);

    // 2. Hanging Lamp subtle sway
    if (this.lampRig) {
      this.lampRig.rotation.z = Math.sin(time * 0.8) * 0.015;
      this.lampRig.rotation.x = Math.cos(time * 0.7) * 0.012;
    }

    // 3. Update Character Idles (breathing, eye glances)
    for (const char of Object.values(this.characters)) {
      if (char.visible) {
        updateCharacterIdle(char, delta, time);
      }
    }

    // 4. Update Flying Cards
    const now = performance.now();
    for (let i = this.flyingCards.length - 1; i >= 0; i--) {
      const active = this.flyingCards[i].update(now);
      if (!active) {
        this.flyingCards.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
