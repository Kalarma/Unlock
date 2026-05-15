// cards.js — Base de données des cartes Hantise

export const RITUALS = [
  {
    id: "r01",
    name: "Cercle de Sel",
    symbol: "🧂",
    description: "Tracer un cercle de sel autour de la table de rituel.",
    elements: ["terre", "eau"],
    difficulty: 1,
    clue: "Le sel purifie les âmes errantes.",
    completionText: "Le cercle est tracé. Les esprits ne peuvent franchir cette barrière sacrée."
  },
  {
    id: "r02",
    name: "Invocation des Ombres",
    symbol: "🕯️",
    description: "Allumer sept bougies noires en les nommant une à une.",
    elements: ["feu", "air"],
    difficulty: 2,
    clue: "Sept noms, sept flammes, sept portes entrouvées.",
    completionText: "Les ombres répondent à votre appel. Le voile s'amincit."
  },
  {
    id: "r03",
    name: "Le Miroir Brisé",
    symbol: "🪞",
    description: "Assembler les fragments d'un miroir ancien pour y apercevoir le défunt.",
    elements: ["eau", "lumière"],
    difficulty: 2,
    clue: "Chaque fragment reflète un souvenir perdu.",
    completionText: "Le visage du défunt se forme dans les éclats. Il vous guide."
  },
  {
    id: "r04",
    name: "Planchette de l'Au-delà",
    symbol: "🔮",
    description: "Poser les mains sur la planchette et laisser l'esprit guider vos doigts.",
    elements: ["air", "esprit"],
    difficulty: 3,
    clue: "Ne résistez pas. L'esprit cherche à communiquer.",
    completionText: "La planchette se déplace seule. Un message s'écrit lentement..."
  },
  {
    id: "r05",
    name: "L'Herbier Maudit",
    symbol: "🌿",
    description: "Réunir trois herbes rares mentionnées dans le grimoire : belladone, armoise et ellébore.",
    elements: ["terre", "lune"],
    difficulty: 2,
    clue: "La nature recèle des remèdes pour l'âme comme pour le corps.",
    completionText: "L'encens sacré se consume. Son parfum attire les esprits bienveillants."
  },
  {
    id: "r06",
    name: "Sceau de Salomon",
    symbol: "✡️",
    description: "Tracer le sceau à la craie blanche sur le sol en respectant la géométrie sacrée.",
    elements: ["lumière", "terre"],
    difficulty: 3,
    clue: "Chaque angle a sa signification. La précision est tout.",
    completionText: "Le sceau rayonne d'une lumière froide. Les entités maléfiques s'éloignent."
  },
  {
    id: "r07",
    name: "Chant des Morts",
    symbol: "🎶",
    description: "Entonner le chant funèbre ancestral transmis de médium en médium.",
    elements: ["air", "esprit"],
    difficulty: 1,
    clue: "La mélodie doit venir du cœur, pas de la mémoire.",
    completionText: "Vos voix unies forment un pont entre les mondes."
  },
  {
    id: "r08",
    name: "La Clé Squelette",
    symbol: "🗝️",
    description: "Trouver et ouvrir la porte secrète qui relie ce monde à l'au-delà.",
    elements: ["métal", "esprit"],
    difficulty: 3,
    clue: "La serrure n'est pas visible à l'œil nu. Cherchez avec votre cœur.",
    completionText: "Un courant d'air glacé traverse la pièce. La porte est ouverte."
  },
  {
    id: "r09",
    name: "Offrande de Sang",
    symbol: "💉",
    description: "Sceller le pacte avec une goutte de sang versée sur le grimoire.",
    elements: ["feu", "vie"],
    difficulty: 2,
    clue: "Le sang est le lien le plus puissant entre les vivants et les morts.",
    completionText: "Le grimoire absorbe l'offrande. Les pages révèlent de nouveaux secrets."
  },
  {
    id: "r10",
    name: "Pendule de Vérité",
    symbol: "⚖️",
    description: "Utiliser le pendule de cristal pour localiser l'objet hantée caché dans la pièce.",
    elements: ["air", "cristal"],
    difficulty: 1,
    clue: "Le pendule ne ment jamais. Laissez-le parler.",
    completionText: "Le pendule s'immobilise au-dessus d'un point précis. L'objet est là."
  },
  {
    id: "r11",
    name: "Bain de Lune",
    symbol: "🌙",
    description: "Exposer les talismans à la lumière de la lune pleine pendant le rituel.",
    elements: ["lune", "eau"],
    difficulty: 1,
    clue: "La lune recharge ce que le soleil épuise.",
    completionText: "Les talismans scintillent d'une lueur argentée. Leur pouvoir est décuplé."
  },
  {
    id: "r12",
    name: "Triangle des Maîtres",
    symbol: "🔺",
    description: "Trois médiums se placent aux angles du triangle pour former un canal spirituel.",
    elements: ["esprit", "lumière", "terre"],
    difficulty: 3,
    clue: "L'unité des esprits vivants attire les esprits morts.",
    completionText: "Une colonne de lumière s'élève du centre du triangle. Le contact est établi."
  }
];

export const EVENTS = [
  {
    id: "e01",
    name: "Vent Glacial",
    type: "obstacle",
    symbol: "💨",
    description: "Un vent surnaturel éteint toutes les bougies. Le prochain rituel nécessite un tour supplémentaire.",
    effect: "next_ritual_cost +1",
    duration: 1
  },
  {
    id: "e02",
    name: "Apparition",
    type: "révélation",
    symbol: "👻",
    description: "Un esprit se manifeste brièvement. Chaque médium peut poser une question par oui/non.",
    effect: "reveal_clue",
    duration: 0
  },
  {
    id: "e03",
    name: "Tremblement Spectral",
    type: "obstacle",
    symbol: "⚡",
    description: "L'énergie négative perturbe le rituel en cours. Lancez le dé : 1-3 = rituel annulé, 4-6 = rituel sauvé.",
    effect: "dice_check",
    duration: 0
  },
  {
    id: "e04",
    name: "Aide Ancestrale",
    type: "aide",
    symbol: "✨",
    description: "Un esprit bienveillant vous guide. Révélez l'indice d'un rituel non complété de votre choix.",
    effect: "free_clue",
    duration: 0
  },
  {
    id: "e05",
    name: "Nuit Sans Lune",
    type: "obstacle",
    symbol: "🌑",
    description: "L'obscurité totale voile les esprits. Les rituels liés à 'lune' coûtent un tour de plus ce round.",
    effect: "element_penalize:lune",
    duration: 1
  },
  {
    id: "e06",
    name: "Écho du Passé",
    type: "révélation",
    symbol: "📿",
    description: "Des visions du passé du lieu vous assaillent. Piochez une carte indice supplémentaire.",
    effect: "draw_clue",
    duration: 0
  },
  {
    id: "e07",
    name: "Possession",
    type: "obstacle",
    symbol: "😈",
    description: "Un médium est temporairement possédé. Il ne peut pas participer au prochain rituel.",
    effect: "skip_player",
    duration: 1
  },
  {
    id: "e08",
    name: "Convergence Astrale",
    type: "aide",
    symbol: "⭐",
    description: "Les astres s'alignent favorablement. Ce tour, vous pouvez tenter deux rituels au lieu d'un.",
    effect: "double_ritual",
    duration: 1
  }
];

export const CLUES = [
  { id: "c01", symbol: "🕯️", element: "feu", text: "La flamme attire ce qui était caché dans les ténèbres.", ritual: "r02" },
  { id: "c02", symbol: "💧", element: "eau", text: "L'eau garde la mémoire de tout ce qu'elle a reflété.", ritual: "r03" },
  { id: "c03", symbol: "🌬️", element: "air", text: "Le vent porte les voix de ceux qui ne peuvent plus parler.", ritual: "r04" },
  { id: "c04", symbol: "🌱", element: "terre", text: "La terre est le lit éternel. Elle connaît tous les secrets enfouis.", ritual: "r05" },
  { id: "c05", symbol: "⭐", element: "lumière", text: "La lumière révèle ce que l'ombre protège jalousement.", ritual: "r06" },
  { id: "c06", symbol: "🌕", element: "lune", text: "La lune pleine amplifie les émotions et les communications spectrales.", ritual: "r11" },
  { id: "c07", symbol: "💎", element: "cristal", text: "Le cristal vibre à la même fréquence que les âmes perdues.", ritual: "r10" },
  { id: "c08", symbol: "👁️", element: "esprit", text: "Fermez les yeux pour mieux voir ce qui n'est pas de ce monde.", ritual: "r08" },
  { id: "c09", symbol: "⚙️", element: "métal", text: "Le métal froid conduit l'électricité des esprits.", ritual: "r08" },
  { id: "c10", symbol: "❤️", element: "vie", text: "La vie est le prix ultime pour ouvrir la porte de la mort.", ritual: "r09" }
];

export const PLAYER_ROLES = [
  {
    id: "voyant",
    name: "Le Voyant",
    symbol: "👁️",
    ability: "Peut regarder la première carte du deck Événements une fois par partie.",
    color: "#7c3aed",
    colorHex: "7c3aed"
  },
  {
    id: "gardien",
    name: "La Gardienne",
    symbol: "🛡️",
    ability: "Peut annuler un Événement de type 'obstacle' une fois par partie.",
    color: "#059669",
    colorHex: "059669"
  },
  {
    id: "medium",
    name: "Le Médium",
    symbol: "🔮",
    ability: "Peut partager un indice secret à un autre joueur sans communication verbale.",
    color: "#b45309",
    colorHex: "b45309"
  },
  {
    id: "archiviste",
    name: "L'Archiviste",
    symbol: "📜",
    ability: "Peut consulter le grimoire (règles) à tout moment sans pénalité de temps.",
    color: "#dc2626",
    colorHex: "dc2626"
  },
  {
    id: "necromancien",
    name: "Le Nécromancien",
    symbol: "💀",
    ability: "Peut relancer un dé une fois par tour lors des vérifications rituelles.",
    color: "#6b7280",
    colorHex: "6b7280"
  },
  {
    id: "exorciste",
    name: "L'Exorciste",
    symbol: "✝️",
    ability: "Réduit la durée des événements 'obstacle' de 1 tour.",
    color: "#f59e0b",
    colorHex: "f59e0b"
  },
  {
    id: "sensitif",
    name: "La Sensitive",
    symbol: "🌸",
    ability: "Reçoit un indice supplémentaire au début de chaque tour pair.",
    color: "#ec4899",
    colorHex: "ec4899"
  },
  {
    id: "alchimiste",
    name: "L'Alchimiste",
    symbol: "⚗️",
    ability: "Peut combiner deux éléments pour accomplir un rituel nécessitant un élément manquant.",
    color: "#0891b2",
    colorHex: "0891b2"
  }
];

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildGameDecks(playerCount) {
  const ritualCount = Math.min(3 + playerCount, 7);
  const rituals = shuffle(RITUALS).slice(0, ritualCount);
  const events = shuffle(EVENTS);
  const clues = shuffle(CLUES);
  return { rituals, events, clues };
}
