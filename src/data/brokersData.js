/*
 * Brokers recommandés par PHI Academy.
 *
 * ► Pour activer vos codes partenaires : collez votre lien partenaire dans
 *   `partnerUrl` de chaque broker. Tant qu'il est vide, le bouton ouvre le
 *   site officiel (sans code partenaire).
 */

export const SUPPORT_WHATSAPP = "22656918108";

export const ACCOMPANIMENT_PRICE = 5000; // FCFA

export const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "africa", label: "Afrique" },
  { id: "france", label: "France" },
  { id: "crypto", label: "Crypto" },
];

export const BROKERS = [
  {
    id: "exness",
    name: "Exness",
    initials: "EX",
    region: "africa",
    regionLabel: "Idéal pour l'Afrique",
    type: "Forex • CFD",
    summary:
      "Courtier en ligne international très utilisé par les traders africains. Une bonne option pour débuter avec la plateforme MetaTrader.",
    points: [
      "Compte démo gratuit pour s'entraîner",
      "Fonctionne avec MetaTrader 4 et 5",
      "Moyens de dépôt locaux selon votre pays",
    ],
    officialUrl: "https://www.exness.com",
    partnerUrl: "",
  },
  {
    id: "weltrade",
    name: "Weltrade",
    initials: "WT",
    region: "africa",
    regionLabel: "Afrique & international",
    type: "Forex • CFD",
    summary:
      "Courtier Forex international qui propose des comptes adaptés aux débutants. À considérer comme alternative selon votre pays.",
    points: [
      "Comptes pensés pour les débutants",
      "Compte démo pour tester sans risque",
      "Plateforme MetaTrader",
    ],
    officialUrl: "https://www.weltrade.com",
    partnerUrl: "",
  },
  {
    id: "ig",
    name: "IG",
    initials: "IG",
    region: "france",
    regionLabel: "Idéal pour la France",
    type: "CFD • Actions • Indices",
    summary:
      "Courtier historique, surveillé par les autorités financières en Europe, avec une plateforme et un service client en français.",
    points: [
      "Cadre réglementaire européen",
      "Plateforme et support en français",
      "Principalement pour les résidents d'Europe",
    ],
    officialUrl: "https://www.ig.com/fr",
    partnerUrl: "",
  },
  {
    id: "binance",
    name: "Binance",
    initials: "BN",
    region: "crypto",
    regionLabel: "Crypto-monnaies",
    type: "Plateforme crypto",
    summary:
      "Plateforme d'échange de crypto-monnaies. Pour ceux qui veulent acheter, vendre et conserver des cryptos plutôt que trader des CFD.",
    points: [
      "Achat et vente de crypto-monnaies",
      "Application mobile",
      "Disponibilité variable selon votre pays",
    ],
    officialUrl: "https://www.binance.com",
    partnerUrl: "",
  },
];
