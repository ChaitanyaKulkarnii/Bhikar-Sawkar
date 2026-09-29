// Core Bhikar Sawkar Engine
import { dealCards, shuffle } from './cards.js';
import { BOT_PROFILES, getRandomQuote } from './dialogue.js';

export class BhikarSawkarEngine {
  constructor(options = {}) {
    this.playerCount = options.playerCount || 4;
    this.mode = options.mode || 'classic'; // 'classic' or 'president'
    this.ruleVariation = options.ruleVariation || 'rank'; // 'rank', 'suit', 'color_rank'
    this.gameSpeed = options.gameSpeed || 'normal'; // 'normal' (900ms), 'fast' (450ms), 'turbo' (180ms)
    this.playMode = options.playMode || 'ai'; // 'ai' or 'pass_and_play'
    this.humanName = options.humanName || 'Bhau';
    this.humanAvatar = options.humanAvatar || '/avatars/sawkar.png';
    this.humanRole = options.humanRole || 'The Sawkar';

    this.players = [];
    this.centralPile = [];
    this.turnIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.winner = null;
    this.eliminatedOrder = [];
    this.turnTimeout = null;
    this.stats = {
      roundFlips: 0,
      matchesCount: 0,
      biggestPot: 0
    };

    this.listeners = {
      onStateChange: [],
      onCardPlayed: [],
      onMatch: [],
      onElimination: [],
      onVictory: [],
      onBanter: []
    };
  }

  on(event, fn) {
    if (this.listeners[event]) {
      this.listeners[event].push(fn);
    }
  }

  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(fn => fn(...args));
    }
  }

  getSpeedDelay() {
    if (this.gameSpeed === 'turbo') return 200;
    if (this.gameSpeed === 'fast') return 480;
    return 1000;
  }

  initMatch() {
    clearTimeout(this.turnTimeout);
    this.centralPile = [];
    this.eliminatedOrder = [];
    this.winner = null;
    this.stats = { roundFlips: 0, matchesCount: 0, biggestPot: 0 };

    const hands = dealCards(this.playerCount);

    this.players = [];
    
    // Player 0 is always local human
    this.players.push({
      id: 'p0',
      name: this.humanName,
      isHuman: true,
      avatar: this.humanAvatar || '/avatars/sawkar.png',
      role: this.humanRole || 'The Sawkar',
      deck: hands[0],
      eliminated: false,
      cardsWon: 0,
      matchesWon: 0
    });

    // Other players (Bots or Pass-and-play players)
    for (let i = 1; i < this.playerCount; i++) {
      const botProfile = BOT_PROFILES[(i - 1) % BOT_PROFILES.length];
      const isHuman = this.playMode === 'pass_and_play';
      this.players.push({
        id: `p${i}`,
        name: isHuman ? `Player ${i + 1}` : botProfile.name,
        botId: botProfile.id,
        isHuman: isHuman,
        avatar: isHuman ? `${i + 1}` : botProfile.avatar,
        role: isHuman ? 'Player' : botProfile.role,
        deck: hands[i],
        eliminated: false,
        cardsWon: 0,
        matchesWon: 0
      });
    }

    this.turnIndex = Math.floor(Math.random() * this.playerCount);
    this.isPlaying = true;
    this.isPaused = false;

    this.emit('onStateChange', this.getState());
    this.emit('onBanter', {
      player: this.players[this.turnIndex],
      text: 'डाव सुरू झाला! बघूया कोण सावकार बनतं आणि कोण भिकारी!'
    });

    this.checkNextTurn();
  }

  getActivePlayers() {
    return this.players.filter(p => !p.eliminated && p.deck.length > 0);
  }

  isMatch(playedCard, topCard) {
    if (!topCard || !playedCard) return false;

    if (this.ruleVariation === 'rank') {
      return playedCard.rank === topCard.rank;
    } else if (this.ruleVariation === 'suit') {
      return playedCard.suit === topCard.suit;
    } else if (this.ruleVariation === 'color_rank') {
      const isColorMatch = (playedCard.suit === 'hearts' || playedCard.suit === 'diamonds') === 
                           (topCard.suit === 'hearts' || topCard.suit === 'diamonds');
      return playedCard.rank === topCard.rank && isColorMatch;
    }
    return playedCard.rank === topCard.rank;
  }

  // Current active player plays top card
  playTurn() {
    if (!this.isPlaying || this.isPaused) return;

    const currentPlayer = this.players[this.turnIndex];
    if (!currentPlayer || currentPlayer.eliminated || currentPlayer.deck.length === 0) {
      this.advanceTurn();
      return;
    }

    // Flip top card from deck
    const playedCard = currentPlayer.deck.shift();
    this.stats.roundFlips++;

    const previousTopCard = this.centralPile.length > 0 ? this.centralPile[this.centralPile.length - 1] : null;
    
    // Add to central pile
    this.centralPile.push(playedCard);
    if (this.centralPile.length > this.stats.biggestPot) {
      this.stats.biggestPot = this.centralPile.length;
    }

    this.emit('onCardPlayed', {
      player: currentPlayer,
      card: playedCard,
      potSize: this.centralPile.length,
      previousCard: previousTopCard
    });

    // Check Match
    const matched = previousTopCard && this.isMatch(playedCard, previousTopCard);

    if (matched) {
      // SAWKAR MATCH!
      this.isPaused = true;
      this.stats.matchesCount++;
      currentPlayer.matchesWon++;

      const capturedCount = this.centralPile.length;
      currentPlayer.cardsWon += capturedCount;

      // Wait 300ms for card throw animation to land on table before triggering match sweep
      setTimeout(() => {
        const wonCards = [...this.centralPile];
        this.centralPile = [];
        currentPlayer.deck.push(...shuffle(wonCards));

        this.emit('onMatch', {
          player: currentPlayer,
          matchedCard: playedCard,
          underneathCard: previousTopCard,
          capturedCount: capturedCount,
          newDeckCount: currentPlayer.deck.length
        });

        if (!currentPlayer.isHuman && currentPlayer.botId) {
          this.emit('onBanter', {
            player: currentPlayer,
            text: getRandomQuote(currentPlayer.botId, 'onMatch')
          });
        }

        // Wait for sweep animation to finish before proceeding to next lead turn
        setTimeout(() => {
          this.isPaused = false;
          this.verifyEliminations();
          if (this.checkVictory()) return;

          // Capturing player leads the next round
          this.emit('onStateChange', this.getState());
          this.checkNextTurn();
        }, Math.max(800, this.getSpeedDelay() * 1.5));
      }, 300);

    } else {
      // Normal non-match card played
      // Check if current player just emptied their deck without a match
      if (currentPlayer.deck.length === 0) {
        this.eliminatePlayer(currentPlayer);
      }

      if (this.checkVictory()) return;

      // Move turn to next player
      this.advanceTurn();
    }
  }

  advanceTurn() {
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length <= 1) {
      this.checkVictory();
      return;
    }

    let nextIndex = (this.turnIndex + 1) % this.players.length;
    while (this.players[nextIndex].eliminated || this.players[nextIndex].deck.length === 0) {
      nextIndex = (nextIndex + 1) % this.players.length;
    }

    this.turnIndex = nextIndex;
    this.emit('onStateChange', this.getState());
    this.checkNextTurn();
  }

  pause() {
    this.isPaused = true;
    clearTimeout(this.turnTimeout);
    this.emit('onStateChange', this.getState());
  }

  resume() {
    if (!this.isPlaying) return;
    this.isPaused = false;
    this.emit('onStateChange', this.getState());
    this.checkNextTurn();
  }

  checkNextTurn() {
    if (!this.isPlaying || this.isPaused) return;

    const currentPlayer = this.players[this.turnIndex];
    if (!currentPlayer) return;

    if (currentPlayer.isHuman && this.playMode === 'ai') {
      // Waiting for user click/tap/spacebar
      return;
    }

    // Bot's turn or Auto turn
    clearTimeout(this.turnTimeout);
    this.turnTimeout = setTimeout(() => {
      if (this.isPlaying && !this.isPaused) {
        this.playTurn();
      }
    }, this.getSpeedDelay());
  }

  eliminatePlayer(player) {
    if (player.eliminated) return;
    player.eliminated = true;
    this.eliminatedOrder.push(player);

    this.emit('onElimination', {
      player: player,
      rank: this.players.length - this.eliminatedOrder.length + 1
    });

    if (!player.isHuman && player.botId) {
      this.emit('onBanter', {
        player: player,
        text: getRandomQuote(player.botId, 'onEliminated')
      });
    }
  }

  verifyEliminations() {
    for (const player of this.players) {
      if (!player.eliminated && player.deck.length === 0) {
        this.eliminatePlayer(player);
      }
    }
  }

  checkVictory() {
    const activePlayers = this.getActivePlayers();

    if (activePlayers.length === 1) {
      this.winner = activePlayers[0];
      this.isPlaying = false;
      clearTimeout(this.turnTimeout);

      // Collect any lingering cards in the pot
      if (this.centralPile.length > 0) {
        this.winner.deck.push(...this.centralPile);
        this.centralPile = [];
      }

      this.emit('onVictory', {
        sawkar: this.winner,
        stats: this.stats,
        eliminated: [...this.eliminatedOrder].reverse()
      });

      this.emit('onStateChange', this.getState());
      return true;
    }
    return false;
  }

  // Shedding (President / Daifugo) mode logic
  initPresidentMatch() {
    // Mode toggle setup
    this.mode = 'president';
    this.initMatch();
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      winner: this.winner,
      turnIndex: this.turnIndex,
      activePlayer: this.players[this.turnIndex],
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role,
        avatar: p.avatar,
        isHuman: p.isHuman,
        cardCount: p.deck.length,
        eliminated: p.eliminated,
        matchesWon: p.matchesWon,
        cardsWon: p.cardsWon
      })),
      centralPileCount: this.centralPile.length,
      topCard: this.centralPile.length > 0 ? this.centralPile[this.centralPile.length - 1] : null,
      previousTopCard: this.centralPile.length > 1 ? this.centralPile[this.centralPile.length - 2] : null,
      stats: this.stats,
      gameSpeed: this.gameSpeed,
      ruleVariation: this.ruleVariation,
      playMode: this.playMode
    };
  }
}
