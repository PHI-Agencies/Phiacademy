/* =========================================================
   CONTENU DU CURSUS
   ---------------------------------------------------------
   Pour modifier le parcours, changez uniquement ce fichier :

   - "video"   : l'identifiant YouTube (les 11 caractères après
                 "v=" dans l'adresse de la vidéo) ;
   - "title"   : le titre de la leçon affiché sur le site ;
   - "channel" : le nom de la chaîne (laissez vide si inconnu) ;
   - "lang"    : "FR" ou "EN" (une étiquette "En anglais" est
                 alors affichée, avec le conseil d'activer les
                 sous-titres).

   Les vidéos sont publiées par des créateurs indépendants. Elles
   sont lues depuis YouTube, PHI Academy ne les héberge pas.
========================================================= */

export const TRACKS = [
  {
    id: "trading",
    prefix: "t",
    label: "Apprendre le trading",
    short: "Trading",
    tagline: "Du premier jour à un plan de trading structuré.",
    description:
      "Un parcours en 10 étapes, des bases jusqu'au plan de trading, avec des vidéos de formateurs différents. Commencez par comprendre les risques, puis avancez dans l'ordre.",
    modules: [
      {
        title: "Les bases du trading",
        description:
          "Ce qu'est vraiment le trading, ses risques et le vocabulaire de départ.",
        lessons: [
          {
            title: "Le trading, c'est quoi ?",
            video: "iWqYXlVwAR8",
            lang: "FR",
          },
          {
            title: "Les risques du trading",
            video: "jtMX-02oV4Q",
            channel: "Autorité des marchés financiers (Consomag)",
            lang: "FR",
          },
          {
            title: "le vocabulaire du debutant",
            video: "B4kWgeiF_Bc",
            lang: "FR",
          },
        ],
      },
      {
        title: "Se protéger des arnaques",
        description:
          "Avant d'aller plus loin : reconnaître les faux gourous, les faux signaux et les promesses de gains faciles.",
        lessons: [
          {
            title: "Comment fonctionnent les faux traders",
            video: "jp5ivkEWjt4",
            lang: "FR",
          },
          {
            title: "Repérer une arnaque financière",
            video: "R3UplS916kM",
            lang: "FR",
          },
          {
            title: "Fausses plateformes et deepfakes",
            video: "9mOIVKEO0rM",
            lang: "FR",
          },
        ],
      },
      {
        title: "Marchés et ordres",
        description:
          "Comment se forment les prix, quels marchés existent et comment passer un ordre.",
        lessons: [
          {
            title: "Les marchés financiers",
            video: "ruPNWEuwrcg",
            lang: "FR",
          },
          {
            title: "L'offre et la demande",
            video: "h62PMKoNwbI",
            lang: "FR",
          },
          {
            title: "Les types d'ordres",
            video: "ruPNWEuwrcg",
            lang: "FR",
          },
        ],
      },
      {
        title: "Lire un graphique",
        description:
          "Chandeliers, tendances, supports, résistances et unités de temps.",
        lessons: [
          {
            title: "Les chandeliers japonais",
            video: "Lfz9DVjpYxw",
            lang: "FR",
          },
          {
            title: "Tendances haussière, baissière et range",
            video: "eYwf79sk7B8",
            lang: "FR",
          },
          {
            title: "Supports et résistances et trendlines",
            video: "9pM8WJw5pDU",
            lang: "FR",
          },
          {
            title: "Les unités de temps",
            video: "0b7VBLxn2jc",
            lang: "FR",
          },
        ],
      },
      {
        title: "Analyse technique de base",
        description:
          "Structure du marché et premiers indicateurs, utilisés avec prudence.",
        lessons: [
          {
            title: "Comprendre la structure de marché",
            video: "XagLzmfh3a0",
            lang: "FR",
          },
          {
            title: "Les moyennes mobiles",
            video: "q-uA6dYhjDg",
            lang: "FR",
          },
          {
            title: "Le RSI pour débutants",
            video: "a64p7fioplw",
            lang: "FR",
          },
        ],
      },
      {
        title: "Price action",
        description:
          "Lire le comportement du prix, repérer les zones et éviter les faux signaux.",
        lessons: [
          {
            title: "Qu'est-ce que le price action ?",
            video: "D7plmzhFlSw",
            lang: "FR",
          },
          {
            title: "Les zones en trading",
            video: "dPFKMZYk_Kc",
            lang: "FR",
          },
          {
            title: "Repérer un faux breakout",
            video: "C1s3339RvBs",
            lang: "FR",
          },
        ],
      },
      {
        title: "Smart Money Concepts (SMC)",
        description:
          "Structure du marché, liquidité, déséquilibres et order blocks : les concepts du « smart money », expliqués en français.",
        lessons: [
          {
            title: "CHoCH et BOS : la structure",
            video: "hC4goqpwF0w",
            lang: "FR",
          },
          {
            title: "Les order blocks",
            video: "1uAcXoVzmZs",
            lang: "FR",
          },
          {
            title: "La liquidité",
            video: "ykIG3OIb7IE",
            lang: "FR",
          },
          {
            title: "Les déséquilibres (FVG)",
            video: "x7ChUc7oGKU",
            lang: "FR",
          },
          {
            title: "Le SMC expliqué de A à Z",
            video: "9Gt1v3NoVDQ",
            lang: "FR",
          },
        ],
      },
      {
        title: "Gestion du risque",
        description:
          "Protéger son capital : perte maximale, stop loss et taille de position.",
        lessons: [
          {
            title: "Limiter ses pertes",
            video: "GL_YSlxzICg",
            lang: "FR",
          },
          {
            title: "Le stop loss",
            video: "uEjU1tZoknY",
            lang: "FR",
          },
          {
            title: "Calculer sa taille de position",
            video: "aX63-wkpGb8",
            lang: "FR",
          },
        ],
      },
      {
        title: "Psychologie du trader",
        description:
          "Peur, avidité, FOMO : comprendre ses émotions pour ne pas les subir.",
        lessons: [
          {
            title: "Le piège de la peur et du FOMO",
            video: "YX9U97AWWAo",
            lang: "FR",
          },
          {
            title: "La psychologie qui ruine un trader",
            video: "jPeKzzAJaUM",
            lang: "FR",
          },
          {
            title: "Psychologie et trading",
            video: "0ggmYGiTu0M",
            lang: "FR",
          },
        ],
      },
      {
        title: "Construire son plan et maîtrise des outils de Trading",
        description:
          "Journal de trading et tests sur le passé : s'entraîner avant de risquer de l'argent réel. Et maîtrise des outils de Trading",
        lessons: [
          {
            title: "Tenir un journal de trading",
            video: "u8HW6YjPdlI",
            lang: "FR",
          },
          {
            title: "Comment bien backtester",
            video: "6-0vWdRAs58",
            lang: "FR",
          },
          {
            title: "Maîtriser MT5 (Meta Trader 5)",
            video: "RWrHimN3Ius",
            lang: "FR",
          },
           {
            title: "Maîtriser Trading View",
            video: "zsZBQn-WLVI",
            lang: "FR",
          },
        ],
      },
    ],
  },

  {
    id: "brvm",
    prefix: "b",
    label: "Comprendre la BRVM",
    short: "BRVM",
    tagline: "La bourse de l'Afrique de l'Ouest, expliquée simplement.",
    description:
      "Comprendre ce qu'est la BRVM, comment fonctionnent les actions et les dividendes, et comment passer par un intermédiaire agréé.",
    modules: [
      {
        title: "Découvrir la BRVM",
        description:
          "Ce qu'est la bourse régionale, comment elle fonctionne et pourquoi des gens y investissent.",
        lessons: [
          {
            title: "Présentation de la BRVM",
            video: "X5f0o6K2SW8",
            lang: "FR",
          },
          {
            title: "La BRVM, cours pour débutant",
            video: "z24-CTFb6WU",
            channel: "ABDOU • Business",
            lang: "FR",
          },
          {
            title: "Pourquoi et comment investir en bourse",
            video: "T-sxl4oBlIA",
            channel: "Richbourse",
            lang: "FR",
          },
        ],
      },
      {
        title: "Dividendes et façons d'investir",
        description:
          "Comprendre ce qu'est un dividende et les différentes manières de placer son argent en bourse.",
        lessons: [
          {
            title: "Comprendre les dividendes",
            video: "27Pqieze5aQ",
            channel: "Daba Finance",
            lang: "FR",
          },
          {
            title: "Les manières d'investir en bourse",
            video: "zASNC1bv1Fw",
            lang: "FR",
          },
        ],
      },
      {
        title: "Passer par une SGI",
        description:
          "Choisir un intermédiaire agréé et comprendre les étapes pour investir concrètement.",
        lessons: [
          {
            title: "Bien choisir sa SGI",
            video: "WRyUEgDkNgc",
            channel: "Richbourse",
            lang: "FR",
          },
          {
            title: "Choisir son partenaire SGI",
            video: "FTm-VXWzhOY",
            lang: "FR",
          },
          {
            title: "Investir à la BRVM : guide pour débutants",
            video: "JZEQimFU5c0",
            lang: "FR",
          },
        ],
      },
      {
        title: "Investir avec prudence",
        description:
          "Garder une vision réaliste : forces, limites et risques d'un petit marché.",
        lessons: [
          {
            title: "Une petite bourse face aux géants",
            video: "RHVdxmG8UvY",
            channel: "FRANCE 24",
            lang: "FR",
          },
          {
            title: "Les clés d'un investissement réussi",
            video: "N8vgVlf7iQ0",
            lang: "FR",
          },
        ],
      },
    ],
  },
];

/* Identifiants stables : t1-1, t1-2 ... b3-2 */
export function buildCatalog() {
  return TRACKS.map((track) => ({
    ...track,
    modules: track.modules.map((module, moduleIndex) => ({
      ...module,
      number: String(moduleIndex + 1).padStart(2, "0"),
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        ...lesson,
        id: `${track.prefix}${moduleIndex + 1}-${lessonIndex + 1}`,
      })),
    })),
  }));
}

export const DISCLAIMER_SHORT =
  "Contenu informatif et éducatif. Ce ne sont pas des conseils d'investissement.";

export const DISCLAIMER_LONG =
  "Les contenus de cet espace sont proposés à titre informatif et éducatif uniquement. Ils ne constituent ni un conseil en investissement, ni une recommandation d'achat ou de vente, ni une promesse de gains. Le trading et l'investissement en bourse comportent un risque de perte pouvant aller jusqu'à la totalité du capital engagé. Les vidéos sont publiées par des créateurs indépendants, sans lien avec PHI Academy, et leurs opinions n'engagent qu'eux. Méfiez-vous de toute personne qui promet des gains garantis ou qui vous demande de lui confier de l'argent.";
