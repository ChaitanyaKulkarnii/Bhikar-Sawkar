// Authentic Marathi & English tabletop hangout banter for Bhikar Sawkar

export const BOT_PROFILES = [
  {
    id: 'babanrao',
    name: 'Babanrao',
    role: 'The Suspicious Veteran',
    avatar: '2',
    bio: 'Plays cards at the katta every evening. Swears the deck is rigged.',
    quotes: {
      onPlay: [
        'बघू आता काय निघतंय...',
        'माझं नशीब नेहमीच खडतर असतं.',
        'एक एक्का तरी पडू दे रे देवा!'
      ],
      onMatch: [
        'हाहा! बबनरावला हलक्यात घेऊ नका, डाव माझा!',
        'सावकार झालो रे पोरांनो! सगळी पानं इकडे आणा!',
        'कसं वाटलं? अनुभवाला तोड नसते!'
      ],
      onMiss: [
        'थोडक्यात हुकलं राव!',
        'एक नंबरने चुकलं... शिट!'
      ],
      onOpponentMatch: [
        'काय नशीब आहे या पोराचं!',
        'काहीतरी गडबड आहे... व्यवस्थित पिसलं होतं का?',
        'अरे देवा, एवढा मोठा ढीग नेला!'
      ],
      onEliminated: [
        'गेलो भिकारी! पुढच्या वेळी बघतो तुम्हाला...',
        'माझी पानं संपली? अरेरे, दिवाळखोरी झाली!'
      ]
    }
  },
  {
    id: 'dinkar',
    name: 'Dinkar',
    role: 'The Hype Guy',
    avatar: '3',
    bio: 'Screams "ठोक!" at every card and drinks too much cutting chai.',
    quotes: {
      onPlay: [
        'ठोक आता जोरात!',
        'बघा जादू! असा पत्ता पडेल की बघत राहाल!',
        'देवा, राजा पडू दे!'
      ],
      onMatch: [
        'अरे वा वा वा! सावकार झालो रे मी!',
        'सगळा ढीग माझा! बाबाजी का ठुल्लू बाकीच्यांना!',
        'कडक मॅच! याला म्हणतात नशीब!'
      ],
      onMiss: [
        'अरे यार, दोन नंबरने गेला!',
        'थांबा रे जरा, पुढच्या वेळी बघतो!'
      ],
      onOpponentMatch: [
        'अरे यार! माझ्याच तोंडावर मॅच मारलीस!',
        'एवढा मोठा ढीग देऊन बसलो फुकट...',
        'थांब, बदला घेणार पुढच्या फेरीत!'
      ],
      onEliminated: [
        'अय्या! संपली सगळी पानं? भिकारी झालो यार!',
        'भावांनो, २-३ पानं उसने द्या ना प्लीज!'
      ]
    }
  },
  {
    id: 'anandi',
    name: 'Anandi',
    role: 'The Calm Mastermind',
    avatar: '4',
    bio: 'Quietly stacks cards and smiles right before sweeping the entire table.',
    quotes: {
      onPlay: [
        'चला, माझी पाळी...',
        'शांत राहा, डाव मोठा होतोय...',
        'पत्ता विचारपूर्वक पडला पाहिजे.'
      ],
      onMatch: [
        'थँक यू व्हेरी मच! सगळा ढीग माझ्याकडे!',
        'मी आधीच सांगितलं होतं, सावकार मीच होणार.',
        'सगळे पत्ते माझ्या तिजोरीत जमा!'
      ],
      onMiss: [
        'ठीक आहे, पुढची संधी माझीच आहे.',
        'काही हरकत नाही...'
      ],
      onOpponentMatch: [
        'वा, छान मॅच लागली.',
        'काही वेळ मजा करा, शेवटी मीच जिंकणार आहे.',
        'ढिगाऱ्याला नजर लागली!'
      ],
      onEliminated: [
        'अरेरे, दुर्दैव! आज माझा दिवस नव्हता.',
        'पुढच्या डावात सावकार बनून दाखवेन!'
      ]
    }
  }
];

export function getRandomQuote(botId, situation) {
  const bot = BOT_PROFILES.find(b => b.id === botId);
  if (!bot || !bot.quotes[situation]) {
    return '...';
  }
  const quotes = bot.quotes[situation];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
