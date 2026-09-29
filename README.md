# Bhikar Sawkar (भिकार सावकार) 🎴👑

> **"A moody, high-stakes tabletop card game inspired by Buckshot aesthetics and late-night Maharashtrian card sessions."**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg)](https://vitejs.dev/)

---

## 📖 About the Game

**Bhikar Sawkar (भिकार सावकार)**, meaning *Beggar–Moneylender*, is a beloved traditional card game from Maharashtra played by two or more players during late-night hangouts, hostel katte, and family gatherings.

The core objective is to win every card in the 52-card deck to become the **Sawkar (सावकार - The Wealthy Moneylender)**, while players who lose all their cards go bankrupt and are eliminated as **Bhikar (भिकारी - Beggar)**!

---

## 🎮 Gameplay & Rules

1. **Setup**:
   - Standard 52-card deck (Jokers removed).
   - All cards are shuffled and dealt out evenly among 2 to 4 players face-down.
   - Players keep their cards in a face-down draw pile and are not allowed to look ahead.

2. **Playing a Turn**:
   - Players take turns in clockwise order flipping the top card of their personal pile face-up into a common central table pot.

3. **Capturing the Central Pile (The Match Rule)**:
   - Whenever a player lays down a card that matches the **same rank** as the card immediately beneath it (e.g., a 7 played directly on a 7, or a Queen on a Queen), that player **captures the entire central pile**!
   - The capturing player places the won cards at the bottom of their personal deck (shuffled in), and leads the next card to restart the pile.

4. **Elimination & Victory**:
   - When a player runs out of cards, they become **Bhikar (भिकारी)** and are eliminated from the table.
   - The game ends when only one player remains holding all 52 cards. That player is crowned **The Maha Sawkar (महा सावकार)**!

---

## 🎨 Aesthetic: "Midnight Table"

Inspired by the dark, high-tension atmosphere of games like *Buckshot Roulette* on Roblox:
- **Background**: Ink Dark (`#0E1116`)
- **Table Felt**: Deep desaturated billiard green (`#12372F`)
- **Accent & Gold Trims**: Vintage brass gold (`#C9A24B`)
- **Card Faces**: Tactile linen ivory (`#F5F0E6`)
- **Card Backs**: Ornate crimson filigree (`#8B1E1E`)
- **Overhead Suspended Lamp**: Dynamic warm spotlight casting soft illumination over the table baize.
- **Audio Synthesizer**: Custom Web Audio API procedural sound engine with realistic card flicks, felt slaps, brass bells, defeat gongs, and ambient room tone.
- **Table Chatter**: Authentic witty Marathi banter and quotes from character bots:
  - **Babanrao (बबनराव)** - The suspicious veteran card uncle.
  - **Dinkar (दिनकर)** - The energetic hype man screaming *"ठोक!"*.
  - **Anandi (आनंदी)** - The calm mastermind quietly building her fortune.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Launch

```bash
# Clone the repository
git clone https://github.com/ChaitanyaKulkarnii/Bhikar-Sawkar.git
cd Bhikar-Sawkar

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## ⌨️ Controls
- **[SPACE] or Click on Deck**: Flip top card on your turn
- **[ESC]**: Close any open modal
- **🔊 Button**: Mute / Unmute procedural audio
- **⚡ Button**: Cycle turn speed (Normal ➔ Fast ➔ Turbo)
- **📜 Button**: View complete rules and lore
- **⚙️ Button**: Configure table size (2, 3, or 4 players), rules, and modes (Vs Bots or Local Pass & Play)
