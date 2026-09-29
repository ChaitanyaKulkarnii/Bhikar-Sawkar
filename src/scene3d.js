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
    this.scene.fog = new THREE.FogExp2(0x0A0D12, 0.20);

    this.camera = new THREE.PerspectiveCamera(54, this.width / this.height, 0.1, 50);
    // Eye level sitting at the table
    this.camera.position.set(0, 1.15, 0.95);
    this.cameraBasePos = this.camera.position.clone();
    this.camera.rotation.order = 'YXZ';

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // ==========================================================
    // 220° TO 270° FIRST-PERSON FREE-LOOK CONTROLLER
    // ==========================================================
    // Total Horizontal Range: -135° to +135° (270° field of view)
    // Pitch: -38° (down at cards/pot) to +22° (up at characters/lamp)
    this.targetYaw = 0;
    this.currentYaw = 0;
    this.targetPitch = -0.22;
    this.currentPitch = -0.22;
    this.hoverYawOffset = 0;
    this.hoverPitchOffset = 0;

    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    this.initMouseLook();
    this.initKeyboardControls();

    // Lighting & Environment
    this.setupLighting();
    this.setupRoomAndTable();

    // Characters
    this.characters = {};
    this.setupCharacters();

    // Foreground Player Hands resting realistically on table edge
    this.playerArms = createPlayerArms();
    this.playerArms.position.set(0, 0.725, 0.58);
    this.scene.add(this.playerArms);
    this.scene.add(this.camera);

    // 3D Card Meshes & Stacks
    this.cardGeometry = new THREE.BoxGeometry(0.22, 0.003, 0.31);
    this.cardBackMaterial = new THREE.MeshStandardMaterial({
      map: getCardBackTexture(),
      roughness: 0.35,
      metalness: 0.1
    });

    this.deckStacks = {};
    this.potCards = [];
    this.flyingCards = [];
    this.initDeckStacks();

    // Shake & Impact
    this.shakeAmount = 0;
    this.tensionStage = 0;
    this.startTime = performance.now();
    this.lastTime = performance.now();

    // Resize Handler
    window.addEventListener('resize', () => this.onResize());

    // Start Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initMouseLook() {
    const dom = this.container;

    // Pointer Drag to look around freely up to 270 degrees
    dom.addEventListener('pointerdown', (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest('button') || e.target.closest('.modal')) return;

      this.isDragging = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      dom.style.cursor = 'grabbing';
      if (dom.setPointerCapture) {
        try { dom.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastPointerX;
        const dy = e.clientY - this.lastPointerY;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;

        // Smooth 270° horizontal and vertical pitch sensitivity
        this.targetYaw -= dx * 0.0048;
        this.targetPitch -= dy * 0.0036;

        // Clamping to 270° total sweep (-135° to +135°) and -38° to +22° pitch
        this.targetYaw = Math.max(-2.36, Math.min(2.36, this.targetYaw));
        this.targetPitch = Math.max(-0.66, Math.min(0.38, this.targetPitch));
      } else {
        // Natural subtle parallax look when hovering mouse
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        this.hoverYawOffset = -normX * 0.18;
        this.hoverPitchOffset = normY * 0.10;
      }
    });

    const onPointerUp = (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        dom.style.cursor = 'grab';
        if (dom.releasePointerCapture) {
          try { dom.releasePointerCapture(e.pointerId); } catch (_) {}
        }
      }
    };

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  initKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        this.lookAtSeat('left');
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        this.lookAtSeat('right');
      } else if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.lookAtSeat('top');
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.lookAtSeat('bottom');
      } else if (e.code === 'KeyR') {
        this.lookAtSeat('reset');
      }
    });
  }

  // Smooth POV quick-look target switcher
  lookAtSeat(seat) {
    if (seat === 'left') {
      this.targetYaw = -0.82;  // Look directly at Dinkar
      this.targetPitch = -0.06;
    } else if (seat === 'right') {
      this.targetYaw = 0.82;   // Look directly at Anandi
      this.targetPitch = -0.06;
    } else if (seat === 'top') {
      this.targetYaw = 0;      // Look across at Babanrao
      this.targetPitch = -0.08;
    } else if (seat === 'bottom') {
      this.targetYaw = 0;      // Look down at cards and pot
      this.targetPitch = -0.60;
    } else if (seat === 'reset') {
      this.targetYaw = 0;
      this.targetPitch = -0.18;
    }
  }

  setupLighting() {
    // 1. Ambient Light (Balanced neutral room fill so character bodies aren't black)
    const ambientLight = new THREE.AmbientLight(0x323B4A, 1.45);
    this.scene.add(ambientLight);

    // 2. Front Fill Light
    const frontFill = new THREE.DirectionalLight(0xFFE8C7, 1.15);
    frontFill.position.set(0, 3.0, 2.0);
    this.scene.add(frontFill);

    // 3. Back Rim Light (Silhouettes character shoulders and hair cleanly)
    const backRim = new THREE.DirectionalLight(0x6D8BA6, 0.95);
    backRim.position.set(0, 2.5, -2.5);
    this.scene.add(backRim);

    // 4. Overhead Suspended Industrial Lamp
    this.lampRig = new THREE.Group();
    this.lampRig.position.set(0, 2.15, -0.15);

    // Lamp Shade Mesh
    const shadeGeo = new THREE.ConeGeometry(0.24, 0.25, 16, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0x1A1F27,
      roughness: 0.45,
      metalness: 0.85,
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

    // Warm Incandescent Spotlight on Table Pot
    this.spotLight = new THREE.SpotLight(0xFDF1C9, 2.4);
    this.spotLight.position.set(0, 0, 0);
    this.spotLight.angle = 0.72;
    this.spotLight.penumbra = 0.65;
    this.spotLight.decay = 1.2;
    this.spotLight.distance = 5;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 4;
    this.spotLight.shadow.bias = -0.0004;

    this.spotTarget = new THREE.Object3D();
    this.spotTarget.position.set(0, 0.72, -0.15);
    this.scene.add(this.spotTarget);
    this.spotLight.target = this.spotTarget;

    this.lampRig.add(this.spotLight);
    this.scene.add(this.lampRig);

    // Soft warm point glow inside shade
    const bulbGlow = new THREE.PointLight(0xF8D77B, 1.2, 1.8);
    bulbGlow.position.set(0, -0.05, 0);
    this.lampRig.add(bulbGlow);

    // ========================================================
    // 5. THREE DEDICATED WARM KEY LIGHTS FOR CHARACTERS
    // ========================================================
    // Babanrao Key Light (Directly illuminates face, mustache, glasses, and kurta across table)
    const babanraoTarget = new THREE.Object3D();
    babanraoTarget.position.set(0, 1.25, -1.54);
    this.scene.add(babanraoTarget);

    const babanraoLight = new THREE.SpotLight(0xFFE5C4, 3.4);
    babanraoLight.position.set(0, 2.1, -0.95);
    babanraoLight.target = babanraoTarget;
    babanraoLight.angle = 0.65;
    babanraoLight.penumbra = 0.55;
    babanraoLight.distance = 4.5;
    babanraoLight.decay = 1.1;
    this.scene.add(babanraoLight);

    // Dinkar Key Light (Directly illuminates face, sunglasses, varsity jacket, and arms on left)
    const dinkarTarget = new THREE.Object3D();
    dinkarTarget.position.set(-1.32, 1.22, -0.42);
    this.scene.add(dinkarTarget);

    const dinkarLight = new THREE.SpotLight(0xFFDEB0, 3.4);
    dinkarLight.position.set(-0.65, 2.1, 0.0);
    dinkarLight.target = dinkarTarget;
    dinkarLight.angle = 0.68;
    dinkarLight.penumbra = 0.55;
    dinkarLight.distance = 4.5;
    dinkarLight.decay = 1.1;
    this.scene.add(dinkarLight);

    // Anandi Key Light (Directly illuminates face, bindi, earrings, and emerald silk on right)
    const anandiTarget = new THREE.Object3D();
    anandiTarget.position.set(1.32, 1.22, -0.42);
    this.scene.add(anandiTarget);

    const anandiLight = new THREE.SpotLight(0xFFE8D6, 3.4);
    anandiLight.position.set(0.65, 2.1, 0.0);
    anandiLight.target = anandiTarget;
    anandiLight.angle = 0.68;
    anandiLight.penumbra = 0.55;
    anandiLight.distance = 4.5;
    anandiLight.decay = 1.1;
    this.scene.add(anandiLight);

    // 6. Warm Amber Wall Sconces (Background depth and rim illumination)
    const sconceMat = new THREE.MeshStandardMaterial({ color: 0xC9A24B, metalness: 0.9, roughness: 0.2 });
    const lampBulbMat = new THREE.MeshBasicMaterial({ color: 0xFFB347 });

    [
      { x: -2.8, y: 2.1, z: -2.2 },
      { x: 2.8, y: 2.1, z: -2.2 }
    ].forEach((pos) => {
      const sconceGeo = new THREE.BoxGeometry(0.08, 0.22, 0.12);
      const sconce = new THREE.Mesh(sconceGeo, sconceMat);
      sconce.position.set(pos.x, pos.y, pos.z);
      this.scene.add(sconce);

      const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), lampBulbMat);
      bulbMesh.position.set(pos.x, pos.y - 0.06, pos.z + 0.08);
      this.scene.add(bulbMesh);

      const sconceLight = new THREE.PointLight(0xFFA038, 2.2, 6.0, 1.3);
      sconceLight.position.set(pos.x, pos.y - 0.06, pos.z + 0.12);
      this.scene.add(sconceLight);
    });
  }

  setupRoomAndTable() {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(14, 14);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x090C10, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Back Basement Brick/Wood Wall
    const wallGeo = new THREE.PlaneGeometry(14, 6);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x131822, roughness: 0.85 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 2.5, -3.2);
    this.scene.add(wall);

    // Left and Right Side Walls for complete 270° room enclosure
    const sideWallGeo = new THREE.PlaneGeometry(12, 6);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-4.5, 2.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(4.5, 2.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    this.scene.add(rightWall);

    // ========================================================
    // RICH DETAILED TABLE
    // ========================================================
    this.tableGroup = new THREE.Group();
    this.tableGroup.position.set(0, 0, -0.15);

    // 1. Polished Mahogany Outer Rim
    const rimGeo = new THREE.CylinderGeometry(1.23, 1.18, 0.08, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x341D12,
      roughness: 0.38,
      metalness: 0.18
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = 0.69;
    rim.receiveShadow = true;
    this.tableGroup.add(rim);

    // 2. High-Resolution Billiard Green Felt Surface (CircleGeometry ensures 100% full UV coverage [0, 1]x[0, 1])
    const feltGeo = new THREE.CircleGeometry(1.14, 64);
    const feltMat = new THREE.MeshStandardMaterial({
      map: getFeltTexture(),
      roughness: 0.78,
      metalness: 0.02
    });
    const feltSurface = new THREE.Mesh(feltGeo, feltMat);
    feltSurface.rotation.x = -Math.PI / 2;
    feltSurface.position.y = 0.738;
    feltSurface.receiveShadow = true;
    this.tableGroup.add(feltSurface);

    // 3. Luxurious Padded Leather Armrest Rail with Brass Rivets
    const railGeo = new THREE.TorusGeometry(1.155, 0.024, 16, 64);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x1A100B, // Rich dark oxblood leather
      roughness: 0.42,
      metalness: 0.12
    });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.rotation.x = Math.PI / 2;
    rail.position.y = 0.738;
    rail.receiveShadow = true;
    this.tableGroup.add(rail);

    // 48 Golden Brass Upholstery Studs / Rivets
    const rivetGeo = new THREE.SphereGeometry(0.008, 8, 8);
    const rivetMat = new THREE.MeshStandardMaterial({
      color: 0xDAA520,
      metalness: 0.95,
      roughness: 0.2
    });
    for (let r = 0; r < 48; r++) {
      const theta = (r / 48) * Math.PI * 2;
      const rivet = new THREE.Mesh(rivetGeo, rivetMat);
      rivet.position.set(
        Math.cos(theta) * 1.162,
        0.758,
        Math.sin(theta) * 1.162
      );
      this.tableGroup.add(rivet);
    }

    // 4. Inlaid Inner Brass Ring between felt and leather
    const brassTrimGeo = new THREE.TorusGeometry(1.135, 0.005, 8, 64);
    const brassTrimMat = new THREE.MeshStandardMaterial({ color: 0xC9A24B, metalness: 0.9, roughness: 0.22 });
    const brassTrim = new THREE.Mesh(brassTrimGeo, brassTrimMat);
    brassTrim.position.y = 0.740;
    brassTrim.rotation.x = Math.PI / 2;
    this.tableGroup.add(brassTrim);

    // 5. Sturdy Turned Wood Table Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.28, 0.45, 0.68, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x22130C, roughness: 0.75 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.34;
    this.tableGroup.add(base);

    // 6. 3D Stacks of Brass Betting Coins around each player station
    const createCoinStack = (count, x, z) => {
      const stack = new THREE.Group();
      stack.position.set(x, 0.74, z);
      const coinGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.0075, 20);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 0.92,
        roughness: 0.22
      });

      for (let c = 0; c < count; c++) {
        const coin = new THREE.Mesh(coinGeo, coinMat);
        const jx = (Math.sin(c * 2.3) - 0.5) * 0.003;
        const jz = (Math.cos(c * 1.7) - 0.5) * 0.003;
        coin.position.set(jx, 0.004 + c * 0.0075, jz);
        coin.rotation.y = c * 0.45;
        coin.castShadow = true;
        coin.receiveShadow = true;
        stack.add(coin);
      }
      return stack;
    };

    // Stacks near player stations
    this.tableGroup.add(createCoinStack(6, -0.38, 0.55));
    this.tableGroup.add(createCoinStack(4, -0.46, 0.48));
    this.tableGroup.add(createCoinStack(8, -0.65, -0.08));
    this.tableGroup.add(createCoinStack(5, -0.58, -0.16));
    this.tableGroup.add(createCoinStack(7, -0.48, -0.65));
    this.tableGroup.add(createCoinStack(4, -0.55, -0.58));
    this.tableGroup.add(createCoinStack(9, 0.58, -0.10));
    this.tableGroup.add(createCoinStack(6, 0.52, -0.18));

    // 7. Authentic Mumbai Cutting Chai Glass on Brass Saucer
    const chaiGroup = new THREE.Group();
    chaiGroup.position.set(-0.54, 0.74, -0.48);

    const saucerGeo = new THREE.CylinderGeometry(0.056, 0.046, 0.012, 20);
    const saucerMat = new THREE.MeshStandardMaterial({ color: 0xC9A24B, metalness: 0.88, roughness: 0.25 });
    const saucer = new THREE.Mesh(saucerGeo, saucerMat);
    saucer.position.y = 0.006;
    saucer.castShadow = true;
    chaiGroup.add(saucer);

    const glassGeo = new THREE.CylinderGeometry(0.034, 0.024, 0.076, 8);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xE8F5F8,
      transmission: 0.82,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      ior: 1.48
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = 0.046;
    glass.castShadow = true;
    chaiGroup.add(glass);

    const teaGeo = new THREE.CylinderGeometry(0.031, 0.023, 0.052, 8);
    const teaMat = new THREE.MeshStandardMaterial({
      color: 0xBA6B34, // Rich milky ginger chai
      roughness: 0.25
    });
    const tea = new THREE.Mesh(teaGeo, teaMat);
    tea.position.y = 0.036;
    chaiGroup.add(tea);

    this.tableGroup.add(chaiGroup);

    // 8. Vintage Heritage Brass Call Bell
    const bellGroup = new THREE.Group();
    bellGroup.position.set(0.48, 0.74, 0.44);

    const bellBaseGeo = new THREE.CylinderGeometry(0.048, 0.052, 0.015, 20);
    const bellMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.2 });
    const bellBase = new THREE.Mesh(bellBaseGeo, bellMat);
    bellBase.position.y = 0.008;
    bellGroup.add(bellBase);

    const domeGeo = new THREE.SphereGeometry(0.04, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const dome = new THREE.Mesh(domeGeo, bellMat);
    dome.position.y = 0.015;
    bellGroup.add(dome);

    const plungerGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.02, 10);
    const plunger = new THREE.Mesh(plungerGeo, bellMat);
    plunger.position.y = 0.055;
    bellGroup.add(plunger);

    this.tableGroup.add(bellGroup);

    this.scene.add(this.tableGroup);
  }

  setupCharacters() {
    // 1. Across table: Babanrao (The Veteran Uncle)
    // Seated comfortably behind the leather rail with hands resting on felt
    const babanrao = createBabanrao();
    babanrao.position.set(0, 0, -1.54);
    babanrao.rotation.y = 0;
    const chairTop = createChair();
    chairTop.position.set(0, 0, -1.56);
    this.scene.add(chairTop, babanrao);
    this.characters['top'] = babanrao;

    // 2. Left seat: Dinkar (The Hype Guy)
    // Directed squarely toward table center (0, 0, -0.15)
    const dinkar = createDinkar();
    dinkar.position.set(-1.32, 0, -0.42);
    dinkar.rotation.y = 1.369; // 78.4 degrees facing center of table
    const chairLeft = createChair();
    chairLeft.position.set(-1.35, 0, -0.43);
    chairLeft.rotation.y = 1.369;
    this.scene.add(chairLeft, dinkar);
    this.characters['left'] = dinkar;

    // 3. Right seat: Anandi (The Mastermind)
    // Directed squarely toward table center (0, 0, -0.15)
    const anandi = createAnandi();
    anandi.position.set(1.32, 0, -0.42);
    anandi.rotation.y = -1.369; // -78.4 degrees facing center of table
    const chairRight = createChair();
    chairRight.position.set(1.35, 0, -0.43);
    chairRight.rotation.y = -1.369;
    this.scene.add(chairRight, anandi);
    this.characters['right'] = anandi;
  }

  initDeckStacks() {
    // 4 Player Decks on table with the luxury Art Deco card back
    const stackDefs = {
      bottom: { pos: new THREE.Vector3(0.24, 0.74, 0.50), rot: 0.05 },
      top: { pos: new THREE.Vector3(0.22, 0.74, -0.88), rot: -0.05 },
      left: { pos: new THREE.Vector3(-0.74, 0.74, -0.34), rot: 0.75 },
      right: { pos: new THREE.Vector3(0.74, 0.74, -0.34), rot: -0.75 }
    };

    for (const [seat, def] of Object.entries(stackDefs)) {
      const group = new THREE.Group();
      group.position.copy(def.pos);
      group.rotation.y = def.rot;

      // 3D physical deck mesh
      const deckMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.04, 0.31),
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
        const height = Math.max(0.005, (count / 52) * 0.08);
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

  // Clear pot of all meshes to guarantee no overlap or stranded cards
  clearPot() {
    for (const cardMesh of this.potCards) {
      this.scene.remove(cardMesh);
      if (cardMesh.geometry) cardMesh.geometry.dispose();
    }
    this.potCards = [];
  }

  // Animate a player or opponent tossing card onto central pot
  playCardThrow(seat, card, onLanded) {
    // Height increments cleanly with each card in pot (6mm step) to completely prevent z-fighting
    const stackHeight = 0.744 + (this.potCards.length * 0.006);
    
    // Natural organic card scatter on felt
    const potTargetPos = new THREE.Vector3(
      (Math.random() - 0.5) * 0.28,
      stackHeight,
      -0.15 + (Math.random() - 0.5) * 0.22
    );

    const onDrop = () => {
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

    // Crisp materials with polygonOffset to prevent depth-buffer tearing
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: getCardFaceTexture(card),
      roughness: 0.5,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -1 * (this.potCards.length + 1),
      polygonOffsetUnits: -1
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xFAF8F5, roughness: 0.6 });

    const materials = [
      edgeMaterial,          // +X
      edgeMaterial,          // -X
      faceMaterial,          // +Y (Card Face)
      this.cardBackMaterial, // -Y (Card Back)
      edgeMaterial,          // +Z
      edgeMaterial           // -Z
    ];

    const cardMesh = new THREE.Mesh(this.cardGeometry, materials);
    cardMesh.position.copy(startPos);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    this.scene.add(cardMesh);

    const startTime = performance.now();
    const duration = 260; // Snappy, tactile throw
    // Generous, organic rotation angle (-30 to +30 deg)
    const rotTarget = (Math.random() - 0.5) * 1.1;

    const animObj = {
      cardMesh,
      update: (now) => {
        const p = Math.min(1, (now - startTime) / duration);
        
        // Parabolic trajectory
        cardMesh.position.lerpVectors(startPos, targetPos, p);
        cardMesh.position.y += Math.sin(p * Math.PI) * 0.18;

        // Flip card face-up onto table
        cardMesh.rotation.x = Math.PI * (1 - p);
        cardMesh.rotation.y = rotTarget * p;

        if (p >= 1) {
          cardMesh.position.copy(targetPos);
          cardMesh.rotation.set(0, rotTarget, 0);
          this.potCards.push(cardMesh);
          this.triggerCameraShake(0.012);
          if (onLanded) onLanded();
          return false;
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

    // Grab all cards currently in the pot and any currently in mid-air
    const cardsToSweep = [...this.potCards];
    this.potCards = [];

    const startTime = performance.now();
    const duration = 380;

    cardsToSweep.forEach((mesh, idx) => {
      const startPos = mesh.position.clone();
      const delay = idx * 16;

      const animObj = {
        cardMesh: mesh,
        update: (now) => {
          if (now < startTime + delay) return true;
          const p = Math.min(1, (now - (startTime + delay)) / duration);

          mesh.position.lerpVectors(startPos, targetStack, p);
          mesh.position.y += Math.sin(p * Math.PI) * 0.22;
          mesh.rotation.y += 0.12;
          mesh.scale.setScalar(1 - p * 0.25);

          if (p >= 1) {
            this.scene.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            return false;
          }
          return true;
        }
      };
      this.flyingCards.push(animObj);
    });

    setTimeout(() => {
      if (onComplete) onComplete();
    }, duration + cardsToSweep.length * 16 + 40);
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

  setTensionStage(stage) {
    this.tensionStage = Math.max(0, Math.min(4, stage));
  }

  animate() {
    requestAnimationFrame(this.animate);
    const now = performance.now();
    const delta = Math.min(0.1, (now - this.lastTime) / 1000);
    const time = (now - this.startTime) / 1000;
    this.lastTime = now;

    // 1. Smooth 270° Camera Free-Look Lerp
    this.currentYaw += (this.targetYaw + this.hoverYawOffset - this.currentYaw) * 0.08;
    this.currentPitch += (this.targetPitch + this.hoverPitchOffset - this.currentPitch) * 0.08;

    // Heartbeat Camera Recoil & Spotlight Pulse
    let tensionPunch = 0;
    if (this.tensionStage >= 2) {
      const beatFreq = this.tensionStage === 4 ? 7.2 : (this.tensionStage === 3 ? 5.2 : 3.8);
      const beat = Math.pow(Math.max(0, Math.sin(time * beatFreq)), 14);
      tensionPunch = beat * (this.tensionStage * 0.009);

      if (this.spotLight) {
        this.spotLight.intensity = 2.4 + beat * (this.tensionStage * 0.35);
      }
    } else if (this.spotLight) {
      this.spotLight.intensity = 2.4;
    }

    this.camera.position.x = this.cameraBasePos.x;
    this.camera.position.y = this.cameraBasePos.y;
    this.camera.position.z = this.cameraBasePos.z - tensionPunch;

    // Apply Camera Shake
    if (this.shakeAmount > 0.0005) {
      this.camera.position.x += (Math.random() - 0.5) * this.shakeAmount;
      this.camera.position.y += (Math.random() - 0.5) * this.shakeAmount;
      this.shakeAmount *= 0.88;
    }

    // Direct 270° Euler Head Rotation (YXZ order)
    this.camera.rotation.set(this.currentPitch, this.currentYaw, 0, 'YXZ');

    // Dynamically project 3D character head positions to HUD badges
    this.update3DHudPositions();

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
    for (let i = this.flyingCards.length - 1; i >= 0; i--) {
      const active = this.flyingCards[i].update(now);
      if (!active) {
        this.flyingCards.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Project 3D character head coordinates to screen space for HUD badges
  update3DHudPositions() {
    const seatKeys = ['top', 'left', 'right'];
    for (const seat of seatKeys) {
      const char = this.characters[seat];
      const hudEl = document.getElementById(`seat-${seat}`);
      if (!hudEl) continue;

      if (!char || !char.visible) {
        hudEl.style.opacity = '0';
        hudEl.style.pointerEvents = 'none';
        continue;
      }

      const head = char.userData?.head;
      if (!head) continue;

      const worldPos = new THREE.Vector3();
      head.getWorldPosition(worldPos);
      worldPos.y += 0.28; // slightly above head

      worldPos.project(this.camera);

      // In front of camera?
      const inFront = worldPos.z < 1.0;
      if (inFront && worldPos.x >= -1.15 && worldPos.x <= 1.15 && worldPos.y >= -1.15 && worldPos.y <= 1.15) {
        const screenX = (worldPos.x * 0.5 + 0.5) * this.width;
        const screenY = (-(worldPos.y * 0.5) + 0.5) * this.height;
        hudEl.style.left = `${screenX}px`;
        hudEl.style.top = `${screenY}px`;
        hudEl.style.transform = 'translate(-50%, -100%)';
        hudEl.style.opacity = '1';
        hudEl.style.pointerEvents = 'auto';
      } else {
        hudEl.style.opacity = '0';
        hudEl.style.pointerEvents = 'none';
      }
    }
  }
}
