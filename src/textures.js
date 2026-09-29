// High-Resolution Procedural Canvas Textures for 3D Cards and Table Baize
import * as THREE from 'three';
import { SUITS } from './cards.js';

// Cache generated textures so we don't recreate them needlessly
const textureCache = new Map();

// Generate vintage ivory card face texture with crisp fonts & suits
export function getCardFaceTexture(card) {
  const cacheKey = `card_${card.suit}_${card.rank}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 728;
  const ctx = canvas.getContext('2d');

  // 1. Linen Ivory Base
  ctx.fillStyle = '#F5F0E6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle paper grain
  ctx.fillStyle = 'rgba(0, 0, 0, 0.018)';
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // 2. Vintage inner border
  ctx.strokeStyle = 'rgba(40, 30, 20, 0.15)';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  ctx.strokeStyle = 'rgba(201, 162, 75, 0.35)'; // gold hairline
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  const suitColor = (card.suit === 'hearts' || card.suit === 'diamonds') ? '#D4463B' : '#1F242D';
  const suitSymbol = SUITS[card.suit.toUpperCase()]?.symbol || '♠';

  // 3. Draw Corner Indices (Top-Left & Bottom-Right)
  function drawCorner(x, y, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = suitColor;
    ctx.font = 'bold 58px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.rank, 0, 0);

    ctx.font = '48px serif';
    ctx.fillText(suitSymbol, 0, 48);

    ctx.restore();
  }

  drawCorner(65, 80, 0);
  drawCorner(canvas.width - 65, canvas.height - 80, Math.PI);

  // 4. Center Content
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  const isCourt = ['J', 'Q', 'K', 'A'].includes(card.rank);
  if (isCourt) {
    // Ornate Court Card styling
    ctx.fillStyle = 'rgba(201, 162, 75, 0.15)';
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(201, 162, 75, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = suitColor;
    ctx.font = '900 160px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.rank, 0, -10);

    ctx.font = '64px serif';
    ctx.fillText(suitSymbol, 0, 95);
  } else {
    // Pip Card
    ctx.fillStyle = suitColor;
    ctx.font = '140px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(suitSymbol, 0, 0);
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  textureCache.set(cacheKey, texture);
  return texture;
}

// Generate Ornate Crimson & Gold Card Back Texture
export function getCardBackTexture() {
  const cacheKey = 'card_back_crimson';
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 728;
  const ctx = canvas.getContext('2d');

  // Crimson red background
  ctx.fillStyle = '#8B1E1E';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Crosshatch / Diamond Pattern
  ctx.strokeStyle = '#681313';
  ctx.lineWidth = 3;
  const step = 28;
  for (let x = -canvas.height; x < canvas.width + canvas.height; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + canvas.height, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, canvas.height);
    ctx.lineTo(x + canvas.height, 0);
    ctx.stroke();
  }

  // Double Gold Border
  ctx.strokeStyle = '#C9A24B';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

  ctx.strokeStyle = '#E5BF65';
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, canvas.width - 76, canvas.height - 76);

  // Center Seal
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  ctx.fillStyle = '#171B22';
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#C9A24B';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Ornate center star
  ctx.strokeStyle = '#E5BF65';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-25, -25, 50, 50);
  }

  // Devanagari Inscription
  ctx.fillStyle = '#C9A24B';
  ctx.font = 'bold 36px "Yatra One", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('भिकार', 0, -22);
  ctx.fillText('सावकार', 0, 22);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  textureCache.set(cacheKey, texture);
  return texture;
}

// Generate Billiard Felt Baize Texture
export function getFeltTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#12372F';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle felt noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1, 1);
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}
