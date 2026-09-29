// High-Resolution Procedural & Loaded Textures for 3D Cards and Table Baize
import * as THREE from 'three';
import { SUITS } from './cards.js';

const textureCache = new Map();
const textureLoader = new THREE.TextureLoader();

// 1. Luxury Art Deco Card Back Texture from user's uploaded image
let cachedCardBack = null;
export function getCardBackTexture() {
  if (cachedCardBack) return cachedCardBack;

  cachedCardBack = textureLoader.load('/card_back.png');
  cachedCardBack.colorSpace = THREE.SRGBColorSpace;
  cachedCardBack.anisotropy = 16;
  cachedCardBack.generateMipmaps = true;
  cachedCardBack.minFilter = THREE.LinearMipmapLinearFilter;
  cachedCardBack.magFilter = THREE.LinearFilter;
  return cachedCardBack;
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

  // Sharp outer border (ensures card separation on table)
  ctx.strokeStyle = '#1D2128';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);

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

// 3. Billiard Felt Baize Texture
export function getFeltTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#12372F';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Tactile felt grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = 8;
  return texture;
}
