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
            video: "rEmTLttPGUA",
            lang: "FR",
          },
          {
            title: "Les risques du trading",
            video: "6FpN8_khgSs",
            channel: "Autorité des marchés financiers (Consomag)",
            lang: "FR",
          },
          {
            title: "Pip, lot, levier : le vocabulaire",
            video: "WjCVkeQ4RBo",
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
            video: "SpVkhVU_tiM",
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
            video: "q9MNaZ8CrJM",
            lang: "FR",
          },
          {
            title: "L'offre et la demande",
            video: "T1Zle7QnGWo",
            lang: "FR",
          },
          {
            title: "Les types d'ordres",
            video: "POrSM1dwuSY",
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
            video: "caBnCzGyh0s",
            lang: "FR",
          },
          {
            title: "Tendances haussière, baissière et range",
            video: "aogo3af9-1w",
            lang: "FR",
          },
          {
            title: "Supports et résistances",
            video: "CnRVH8AxQgw",
            lang: "FR",
          },
          {
            title: "Les unités de temps",
            video: "-mQV1eosdDg",
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
            video: "3br6QspAHJo",
            lang: "FR",
          },
          {
            title: "Les moyennes mobiles",
            video: "FFvTmD4x7OM",
            lang: "FR",
          },
          {
            title: "Le RSI pour débutants",
            video: "MJzjcsiRkZQ",
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
            video: "TCFA7R4_4vE",
            lang: "FR",
          },
          {
            title: "Les zones en trading",
            video: "6V50TkPhPfo",
            lang: "FR",
          },
          {
            title: "Repérer un faux breakout",
            video: "lzsy00rBZCE",
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
            title: "Le SMC expliqué de A à Z",
            video: "ERPZUSc4zjA",
            lang: "FR",
          },
          {
            title: "CHoCH et BOS : la structure",
            video: "slzCMYy5iYI",
            lang: "FR",
          },
          {
            title: "La liquidité",
            video: "wCvD7TXyCyA",
            lang: "FR",
          },
          {
            title: "Les déséquilibres (FVG)",
            video: "U4-T6XaD8jE",
            lang: "FR",
          },
          {
            title: "Les order blocks",
            video: "ftAuQSy8S_g",
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
            video: "C7TRkHSRBv8",
            lang: "FR",
          },
          {
            title: "La psychologie qui ruine un trader",
            video: "-HQqkHg9zkY",
            lang: "FR",
          },
          {
            title: "Psychologie et trading",
            video: "IZwqt_HxhBg",
            lang: "FR",
          },
        ],
      },
      {
        title: "Construire son plan",
        description:
          "Journal de trading et tests sur le passé : s'entraîner avant de risquer de l'argent réel.",
        lessons: [
          {
            title: "Tenir un journal de trading",
            video: "oz5-X2aquW4",
            lang: "FR",
          },
          {
            title: "Comment bien backtester",
            video: "ldg_Xu8klVw",
            lang: "FR",
          },
          {
            title: "Backtester sa stratégie",
            video: "2BDKZCN8PGM",
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
