// Card Deck Engine and Visual Asset Generator for Bhikar Sawkar

export const SUITS = {
  SPADES: { id: 'spades', name: 'Spades', marathi: 'काळ्या', symbol: '♠', color: '#1F242D' },
  HEARTS: { id: 'hearts', name: 'Hearts', marathi: 'लाल बदाम', symbol: '♥', color: '#D4463B' },
  DIAMONDS: { id: 'diamonds', name: 'Diamonds', marathi: 'चौकट', symbol: '♦', color: '#D4463B' },
  CLUBS: { id: 'clubs', name: 'Clubs', marathi: 'किलवर', symbol: '♣', color: '#1F242D' }
};

export const RANKS = [
  { rank: '2', value: 2, label: '2' },
  { rank: '3', value: 3, label: '3' },
  { rank: '4', value: 4, label: '4' },
  { rank: '5', value: 5, label: '5' },
  { rank: '6', value: 6, label: '6' },
  { rank: '7', value: 7, label: '7' },
  { rank: '8', value: 8, label: '8' },
  { rank: '9', value: 9, label: '9' },
  { rank: '10', value: 10, label: '10' },
  { rank: 'J', value: 11, label: 'J', name: 'Jack (गुलाम)' },
  { rank: 'Q', value: 12, label: 'Q', name: 'Queen (राणी)' },
  { rank: 'K', value: 13, label: 'K', name: 'King (राजा)' },
  { rank: 'A', value: 14, label: 'A', name: 'Ace (एक्का)' }
];

export function createDeck() {
  const deck = [];
  let id = 1;
  for (const suitKey of Object.keys(SUITS)) {
    const suit = SUITS[suitKey];
    for (const r of RANKS) {
      deck.push({
        id: `c_${id++}`,
        suit: suit.id,
        suitSymbol: suit.symbol,
        suitColor: suit.color,
        suitMarathi: suit.marathi,
        rank: r.rank,
        value: r.value,
        name: r.name || r.rank,
        code: `${r.rank}${suit.symbol}`
      });
    }
  }
  return deck;
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Deal deck among N players evenly
export function dealCards(playerCount = 4) {
  const deck = shuffle(createDeck());
  const hands = Array.from({ length: playerCount }, () => []);
  
  deck.forEach((card, idx) => {
    hands[idx % playerCount].push(card);
  });

  return hands;
}

// Generate high quality SVG suit icons for crisp display
export function getSuitSvg(suitId, color) {
  if (suitId === 'hearts') {
    return `<svg class="suit-icon" viewBox="0 0 24 24" fill="${color}" width="1em" height="1em">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>`;
  } else if (suitId === 'diamonds') {
    return `<svg class="suit-icon" viewBox="0 0 24 24" fill="${color}" width="1em" height="1em">
      <path d="M12 2L2 12l10 10 10-10L12 2z"/>
    </svg>`;
  } else if (suitId === 'spades') {
    return `<svg class="suit-icon" viewBox="0 0 24 24" fill="${color}" width="1em" height="1em">
      <path d="M12 2.5C9.7 5.5 5 9.5 5 13.5c0 3 2.5 4.5 5 3.5-1 2-2 3-3 4h10c-1-1-2-2-3-4 2.5 1 5-.5 5-3.5 0-4-4.7-8-7-11z"/>
    </svg>`;
  } else {
    // clubs
    return `<svg class="suit-icon" viewBox="0 0 24 24" fill="${color}" width="1em" height="1em">
      <path d="M12 3.5a4 4 0 0 0-4 4c0 1.2.5 2.2 1.3 3A4 4 0 0 0 5 14.5a4 4 0 0 0 4 4c1 0 1.9-.3 2.6-.9l-.6 2.4h2l-.6-2.4c.7.6 1.6.9 2.6.9a4 4 0 0 0 4-4 4 4 0 0 0-4.3-4c.8-.8 1.3-1.8 1.3-3a4 4 0 0 0-4-4z"/>
    </svg>`;
  }
}

// Generate card face HTML
export function renderCardFace(card) {
  if (!card) return '';
  const suitSvg = getSuitSvg(card.suit, card.suitColor);
  const isFaceCard = ['J', 'Q', 'K', 'A'].includes(card.rank);
  const centerContent = isFaceCard 
    ? `<div class="court-graphic ${card.rank.toLowerCase()}">${card.rank}</div>`
    : `<div class="center-pip">${suitSvg}</div>`;

  return `
    <div class="card card-face" data-rank="${card.rank}" data-suit="${card.suit}" style="--suit-color: ${card.suitColor};">
      <div class="card-inner">
        <div class="card-corner top-left">
          <span class="corner-rank">${card.rank}</span>
          ${suitSvg}
        </div>
        <div class="card-center">
          ${centerContent}
        </div>
        <div class="card-corner bottom-right">
          <span class="corner-rank">${card.rank}</span>
          ${suitSvg}
        </div>
      </div>
    </div>
  `;
}

// Generate ornate card back HTML using the luxury Art Deco design
export function renderCardBack() {
  return `
    <div class="card card-back card-back-luxury">
      <img src="/card_back.png" alt="Card Back" class="card-back-img-element" draggable="false" />
    </div>
  `;
}
