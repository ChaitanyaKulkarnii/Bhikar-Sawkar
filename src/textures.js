// High-Resolution Procedural & Loaded Textures for 3D Cards and Table Baize
import * as THREE from 'three';
import { SUITS } from './cards.js';

const textureCache = new Map();
const textureLoader = new THREE.TextureLoader();

// 1. Luxury Art Deco Card Back Texture from user's uploaded image
let cachedCardBack = null;
export function getCardBackTexture() {
  if (cachedCardBack) return cachedCardBack;

  cachedCardBack = textureLoader.load('/card_back.png?v=3');
  cachedCardBack.colorSpace = THREE.SRGBColorSpace;
  cachedCardBack.anisotropy = 16;
  cachedCardBack.generateMipmaps = true;
  cachedCardBack.minFilter = THREE.LinearMipmapLinearFilter;
  cachedCardBack.magFilter = THREE.LinearFilter;
  return cachedCardBack;
}

// 1b. Procedural Stacked Card Deck Rim Texture (Real Paper Edge Separation Lines)
let cachedDeckRim = null;
export function getDeckRimTexture() {
  if (cachedDeckRim) return cachedDeckRim;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base off-white card core stock
  ctx.fillStyle = '#F5F2EB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const totalCards = 48;
  const cardH = canvas.height / totalCards;

  for (let i = 0; i < totalCards; i++) {
    const y = i * cardH;

    // Organic ivory / linen card paper core with subtle per-card variation
    const v = (Math.sin(i * 7.7) * 0.5 + 0.5) * 14 - 7;
    const r = Math.round(Math.min(255, Math.max(220, 246 + v)));
    const g = Math.round(Math.min(255, Math.max(215, 242 + v)));
    const b = Math.round(Math.min(255, Math.max(205, 233 + v)));

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, y, canvas.width, cardH);

    // Specular highlight on upper paper rim of card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(0, y, canvas.width, 2.4);

    // Ambient micro-shadow above the cut
    ctx.fillStyle = 'rgba(60, 48, 35, 0.50)';
    ctx.fillRect(0, y + cardH - 5.5, canvas.width, 2.5);

    // Deep shadow groove between stacked individual cards (crisp high-contrast separation line!)
    ctx.fillStyle = 'rgba(18, 12, 6, 0.95)';
    ctx.fillRect(0, y + cardH - 3.2, canvas.width, 3.2);

    // Micro paper fibers
    for (let f = 0; f < 3; f++) {
      const fx = Math.random() * canvas.width;
      const fw = 14 + Math.random() * 36;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.10)';
      ctx.fillRect(fx, y + 1 + Math.random() * (cardH - 3), fw, 1);
    }
  }

  // Top card features the royal blue card back lip
  ctx.fillStyle = '#1D3B68';
  ctx.fillRect(0, 0, canvas.width, 3.5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  cachedDeckRim = texture;
  return cachedDeckRim;
}

// 1c. Bump Map for Card Deck Rim (Normal map / relief calculation under spotlight)
let cachedDeckRimBump = null;
export function getDeckRimBumpMap() {
  if (cachedDeckRimBump) return cachedDeckRimBump;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const totalCards = 48;
  const cardH = canvas.height / totalCards;

  for (let i = 0; i < totalCards; i++) {
    const y = i * cardH;

    // Card face surface height (slightly raised)
    ctx.fillStyle = '#C8C8C8';
    ctx.fillRect(0, y, canvas.width, cardH);

    // Card top edge bevel highlight (raised ridge)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, y, canvas.width, 2.5);

    // Deep grooved cut between cards (low indented slot)
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, y + cardH - 3.5, canvas.width, 3.5);

    // Gradient leading into groove
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, y + cardH - 5.5, canvas.width, 2.0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  cachedDeckRimBump = texture;
  return cachedDeckRimBump;
}

// 2. High-Resolution (1024x1456) Crisp Card Face Texture
export function getCardFaceTexture(card) {
  const cacheKey = `card_${card.suit}_${card.rank}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1456;
  const ctx = canvas.getContext('2d');

  // Crisp Pure Ivory Base with high contrast
  ctx.fillStyle = '#FCFBF8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Slim, elegant outer border (softened from bold line)
  ctx.strokeStyle = '#1D2128';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  // Inner decorative gold hairline
  ctx.strokeStyle = 'rgba(201, 162, 75, 0.7)';
  ctx.lineWidth = 5;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  const isRed = (card.suit === 'hearts' || card.suit === 'diamonds');
  const suitColor = isRed ? '#D02B2B' : '#14171E';
  const suitSymbol = SUITS[card.suit.toUpperCase()]?.symbol || '♠';

  // Draw High-Contrast Corner Indices
  function drawCorner(x, y, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = suitColor;
    ctx.font = 'bold 125px Outfit, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.rank, 0, 0);

    ctx.font = '105px serif';
    ctx.fillText(suitSymbol, 0, 105);

    ctx.restore();
  }

  drawCorner(130, 150, 0);
  drawCorner(canvas.width - 130, canvas.height - 150, Math.PI);

  // Draw Center Art
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  const isCourt = ['J', 'Q', 'K', 'A'].includes(card.rank);
  if (isCourt) {
    // Elegant Art-Deco Gold Medallion for Face Cards
    ctx.fillStyle = 'rgba(201, 162, 75, 0.12)';
    ctx.beginPath();
    ctx.arc(0, 0, 260, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(201, 162, 75, 0.75)';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(20, 24, 32, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 280, 0, Math.PI * 2);
    ctx.stroke();

    // Large Bold Court Rank
    ctx.fillStyle = suitColor;
    ctx.font = '900 280px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.rank, 0, -25);

    // Suit below rank
    ctx.font = '150px serif';
    ctx.fillText(suitSymbol, 0, 150);
  } else {
    // Number Cards: Bold prominent central suit
    ctx.fillStyle = suitColor;
    ctx.font = '280px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(suitSymbol, 0, 0);

    // Subtle rank watermark in background
    ctx.fillStyle = 'rgba(201, 162, 75, 0.18)';
    ctx.font = 'bold 360px Outfit, sans-serif';
    ctx.fillText(card.rank, 0, 0);
  }

  ctx.restore();

  // Create High-Quality Three.js Texture with Mipmapping
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

// 3. Luxurious High-Detail Billiard Felt Baize Texture (2048x2048)
export function getFeltTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // 1. Deep Billiard Green Felt Base with Radial Lighting
  const baseGrad = ctx.createRadialGradient(cx, cy, 100, cx, cy, 980);
  baseGrad.addColorStop(0, '#18473C');   // brighter warm center under lamp
  baseGrad.addColorStop(0.65, '#12372F'); // standard rich baize
  baseGrad.addColorStop(1, '#0C231E');   // deep shadow toward mahogany rim
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Micro Woven Felt Fibers (tactile texture)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.032)';
  for (let i = 0; i < 45000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1.8, 1.8);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.055)';
  for (let i = 0; i < 45000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1.8, 1.8);
  }

  // 3. Outer Concentric Gold Borders
  ctx.strokeStyle = 'rgba(201, 162, 75, 0.65)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 940, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(229, 191, 101, 0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 915, 0, Math.PI * 2);
  ctx.stroke();

  // Fine dashed decorative track
  ctx.setLineDash([12, 12]);
  ctx.strokeStyle = 'rgba(201, 162, 75, 0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 890, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Central Pot Arena Ring (Where cards land)
  const potGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 420);
  potGrad.addColorStop(0, 'rgba(201, 162, 75, 0.1)');
  potGrad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
  ctx.fillStyle = potGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 400, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#C9A24B';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, 400, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(229, 191, 101, 0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 380, 0, Math.PI * 2);
  ctx.stroke();

  // Central Art Deco Medallion (Clean luxury baize without text)
  ctx.save();
  ctx.translate(cx, cy);

  // Subtle central glow ring
  ctx.strokeStyle = 'rgba(201, 162, 75, 0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Ornate Geometric Rosette
  ctx.strokeStyle = 'rgba(201, 162, 75, 0.28)';
  ctx.lineWidth = 3;
  for (let a = 0; a < 8; a++) {
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-75, -75, 150, 150);
  }

  // Polished gold center diamond
  ctx.fillStyle = 'rgba(201, 162, 75, 0.4)';
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.lineTo(24, 0);
  ctx.lineTo(0, 32);
  ctx.lineTo(-24, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // 5. Four Player Deck Placement Wells (Gold Frames on Felt)
  const deckPositions = [
    { x: cx, y: cy + 620, label: 'YOU' },             // Bottom (Player)
    { x: cx, y: cy - 620, label: 'BABANRAO' },        // Top
    { x: cx - 620, y: cy, label: 'DINKAR' },          // Left
    { x: cx + 620, y: cy, label: 'ANANDI' }           // Right
  ];

  deckPositions.forEach(({ x, y, label }) => {
    ctx.save();
    ctx.translate(x, y);

    // Subtle dark well shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(-110, -150, 220, 300);

    // Gold Double Border
    ctx.strokeStyle = '#C9A24B';
    ctx.lineWidth = 4;
    ctx.strokeRect(-110, -150, 220, 300);

    ctx.strokeStyle = 'rgba(229, 191, 101, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-102, -142, 204, 284);

    // Corner Ornaments
    const cornerSize = 16;
    ctx.fillStyle = '#C9A24B';
    ctx.fillRect(-112, -152, cornerSize, cornerSize);
    ctx.fillRect(112 - cornerSize, -152, cornerSize, cornerSize);
    ctx.fillRect(-112, 152 - cornerSize, cornerSize, cornerSize);
    ctx.fillRect(112 - cornerSize, 152 - cornerSize, cornerSize, cornerSize);

    // Station Name Label
    ctx.fillStyle = 'rgba(201, 162, 75, 0.7)';
    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 175);

    ctx.restore();
  });

  // 6. Embossed Gold Suits in 4 Quadrants
  const suitEmblems = [
    { char: '♠', x: cx - 480, y: cy - 480 },
    { char: '♥', x: cx + 480, y: cy - 480 },
    { char: '♦', x: cx + 480, y: cy + 480 },
    { char: '♣', x: cx - 480, y: cy + 480 }
  ];

  suitEmblems.forEach(({ char, x, y }) => {
    ctx.save();
    ctx.fillStyle = 'rgba(201, 162, 75, 0.35)';
    ctx.font = '130px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, x, y);

    // Outer circle
    ctx.strokeStyle = 'rgba(201, 162, 75, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 90, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// ============================================================================
// Architectural Brutalist Concrete Room Textures
// ============================================================================
let cachedConcreteWall = null;
export function getConcreteWallTexture() {
  if (cachedConcreteWall) return cachedConcreteWall;
  cachedConcreteWall = textureLoader.load('/concrete_back_wall.png');
  cachedConcreteWall.colorSpace = THREE.SRGBColorSpace;
  cachedConcreteWall.anisotropy = 16;
  cachedConcreteWall.generateMipmaps = true;
  return cachedConcreteWall;
}

let cachedConcreteWallBump = null;
export function getConcreteWallBumpMap() {
  if (cachedConcreteWallBump) return cachedConcreteWallBump;
  cachedConcreteWallBump = textureLoader.load('/concrete_back_wall_bump.png');
  cachedConcreteWallBump.anisotropy = 8;
  cachedConcreteWallBump.generateMipmaps = true;
  return cachedConcreteWallBump;
}

let cachedConcreteFloor = null;
export function getConcreteFloorTexture() {
  if (cachedConcreteFloor) return cachedConcreteFloor;
  cachedConcreteFloor = textureLoader.load('/concrete_floor_arch.png');
  cachedConcreteFloor.colorSpace = THREE.SRGBColorSpace;
  cachedConcreteFloor.wrapS = THREE.RepeatWrapping;
  cachedConcreteFloor.wrapT = THREE.RepeatWrapping;
  cachedConcreteFloor.repeat.set(3, 3);
  cachedConcreteFloor.anisotropy = 16;
  cachedConcreteFloor.generateMipmaps = true;
  return cachedConcreteFloor;
}

let cachedConcreteTile = null;
export function getConcreteTileTexture() {
  if (cachedConcreteTile) return cachedConcreteTile;
  cachedConcreteTile = textureLoader.load('/concrete_tile.png');
  cachedConcreteTile.colorSpace = THREE.SRGBColorSpace;
  cachedConcreteTile.wrapS = THREE.RepeatWrapping;
  cachedConcreteTile.wrapT = THREE.RepeatWrapping;
  cachedConcreteTile.repeat.set(3, 2);
  cachedConcreteTile.anisotropy = 16;
  cachedConcreteTile.generateMipmaps = true;
  return cachedConcreteTile;
}

let cachedConcreteTileBump = null;
export function getConcreteTileBumpMap() {
  if (cachedConcreteTileBump) return cachedConcreteTileBump;
  cachedConcreteTileBump = textureLoader.load('/concrete_tile_bump.png');
  cachedConcreteTileBump.wrapS = THREE.RepeatWrapping;
  cachedConcreteTileBump.wrapT = THREE.RepeatWrapping;
  cachedConcreteTileBump.repeat.set(3, 2);
  cachedConcreteTileBump.anisotropy = 8;
  cachedConcreteTileBump.generateMipmaps = true;
  return cachedConcreteTileBump;
}

