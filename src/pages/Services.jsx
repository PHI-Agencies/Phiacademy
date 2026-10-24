import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  Check,
  Clock,
  FileText,
  Infinity as InfinityIcon,
  MessageCircle,
  Repeat,
  ShoppingCart,
  Sprout,
  Star,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";

/* =========================================================
   RÉGLAGES (liens, numéros, images)
========================================================= */

const WHATSAPP_NUMBER = "22656918108";
const WHATSAPP_ACCOUNT_NUMBER = "22603031400";

// Lien Chariow du pack de 3 livres
const PACK_LINK = "https://rylhfhli.mychariow.shop/prd_r6etq0c6";

// Dossier (dans /public) où se trouvent temoignage1.jpg ... temoignage6.jpg
const PROOF_FOLDER = "./utilitaire/";
const PROOF_IMAGES = [1, 2, 3, 4, 5, 6].map(
  (number) => `${PROOF_FOLDER}temoignage${number}.jpg`
);

const whatsappLink = (number, message) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

/* =========================================================
   DONNÉES
========================================================= */

const books = [
  {
    id: 1,
    title: "22 Patterns",
    description: "Les patterns à connaître pour vos analyses graphiques.",
    image:
      "https://res.cloudinary.com/dzy6t8hky/image/upload/v1791970842/22-patterns_luimsh.jpg",
    link: "https://rylhfhli.mychariow.shop/prd_nhl8di9w",
  },
  {
    id: 2,
    title: "Le Code du Trader",
    description: "Comprendre les principes et la discipline du trader.",
    image:
      "https://res.cloudinary.com/dzy6t8hky/image/upload/v1791970843/code-du-trader_hqvx22.jpg",
    link: "https://rylhfhli.mychariow.shop/prd_7dytyh",
  },
  {
    id: 3,
    title: "Trading Precision",
    description:
      "Une ressource dédiée à la précision et à la qualité des analyses.",
    image:
      "https://res.cloudinary.com/dzy6t8hky/image/upload/v1791970842/trading-precision_qz5rxe.jpg",
    link: "https://rylhfhli.mychariow.shop/prd_5sn74art",
  },
  {
    id: 4,
    title: "Les Indicateurs",
    description: "Comprendre les principaux indicateurs et leur utilisation.",
    image:
      "https://res.cloudinary.com/dzy6t8hky/image/upload/v1791970843/grand-livre-indicateurs_cyliad.jpg",
    link: "https://rylhfhli.mychariow.shop/prd_6v509q87",
  },
  {
    id: 5,
    title: "Guide en Anglais",
    description: "Pour les traders qui souhaitent travailler en anglais.",
    image:
      "https://res.cloudinary.com/dzy6t8hky/image/upload/v1791970846/simple-trading-book_jpm0sv.png",
    link: "https://rylhfhli.mychariow.shop/prd_u5uxcfu5",
  },
];

// Les 3 livres affichés sur la carte du pack
const packCovers = [books[0], books[1], books[3]];

const offers = [
  {
    id: "debutant",
    tone: "beginner",
    Icon: Sprout,
    level: "Niveau débutant",
    title: "Formation Débutant",
    tagline: "Des bases solides et votre tout premier trade.",
    price: "15 000",
    chips: [
      { Icon: Calendar, text: "2 séances" },
      { Icon: Clock, text: "1h30 à 2h30 / séance" },
    ],
    points: [
      "Comprendre les bases du trading et le fonctionnement des marchés",
      "Lire les graphiques et les chandeliers japonais",
      "Gestion du risque et erreurs à éviter",
      "Aide à la création et à la configuration de votre compte réel",
      "Accompagnement jusqu'à votre premier trade sur le marché",
    ],
    href: whatsappLink(
      WHATSAPP_NUMBER,
      "Bonjour PHI Academy, je suis intéressé par la formation débutant."
    ),
    ctaClass: "cta-blue",
    ctaLabel: "Je veux cette formation",
    CtaIcon: MessageCircle,
  },
  {
    id: "methode",
    tone: "featured",
    Icon: TrendingUp,
    level: "Niveau avancé",
    title: "Formation Méthode PHI",
    tagline: "Une vraie méthode, des concepts avancés, un suivi en direct.",
    // PRIX MÉTHODE PHI : modifiez ici
    price: "75 000",
    chips: [
      { Icon: Calendar, text: "1 mois" },
      { Icon: Repeat, text: "2 séances / semaine" },
      { Icon: Clock, text: "2h / séance" },
    ],
    points: [
      "Structure du marché",
      "Smart Money Concept (SMC) & Price Action",
      "Indicateurs : comprendre et bien les utiliser",
      "Entrées, sorties et gestion des positions",
      "Gestion du risque",
      "Psychologie du trading",
      "Analyses du marché en direct",
    ],
    href: whatsappLink(
      WHATSAPP_NUMBER,
      "Je suis intéressé par la formation à la méthode Phi."
    ),
    ctaClass: "cta-orange",
    ctaLabel: "Découvrir la Méthode PHI",
    CtaIcon: MessageCircle,
    badge: true,
  },
  {
    id: "pack",
    tone: "pack",
    Icon: BookOpen,
    level: "À votre rythme",
    title: "Pack de 3 livres",
    tagline: "Se former seul, du niveau débutant au niveau avancé.",
    price: "25 000",
    chips: [
      { Icon: FileText, text: "3 livres PDF" },
      { Icon: InfinityIcon, text: "À vie, à votre rythme" },
    ],
    points: [
      "Un parcours en 3 livres : des bases jusqu'au niveau avancé",
      "Apprenez quand vous voulez, où vous voulez",
      "Idéal pour progresser de façon autonome",
    ],
    href: PACK_LINK,
    ctaClass: "cta-outline",
    ctaLabel: "Obtenir le pack",
    CtaIcon: ShoppingCart,
    covers: true,
  },
];

const testimonials = [
  {
    initials: "IK",
    name: "Ibrahim K.",
    label: "Formation",
    text:
      "« Ce que j'adore chez vous, ce sont vos formations. Et surtout que vos formations sont individuelles ! Elles permettent de poser autant de questions que nous voulons. »",
  },
  {
    initials: "MT",
    name: "Moussa T.",
    label: "Livre numérique",
    text:
      "« Vos guides de trading sont vraiment très complets et m'aident énormément au quotidien pour mes analyses. »",
  },
  {
    initials: "SO",
    name: "Sékou O.",
    label: "Configuration de compte",
    text:
      "« J'ai trouvé superbe la configuration des comptes ! Surtout que vous passez par un appel vidéo WhatsApp et l'on partage nos écrans. »",
  },
  {
    initials: "AB",
    name: "Aïcha B.",
    label: "Accompagnement",
    text:
      "« Un suivi d'une grande rareté, réponses rapides sur WhatsApp et accompagnement au top ! »",
  },
  {
    initials: "!",
    name: "Client Anonyme",
    label: "Avis négatif",
    text: "« C'est de l'arnaque »",
    negative: true,
  },
];

// On répète les listes pour que le défilement infini ne montre jamais de vide
const repeat = (list) => [...list, ...list, ...list, ...list];

/* =========================================================
   PAGE
========================================================= */

function Services() {
  const [sheet, setSheet] = useState(null);

  // Apparition au scroll
  useEffect(() => {
    const elements = document.querySelectorAll(".services-page .reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  // Bloque le défilement quand la fenêtre de détails est ouverte
  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  return (
    <>
      <Navbar />

      <div className="services-page">
        <style>{`
          /* =========================
             PALETTE : BLEU • BLANC • ORANGE
          ========================= */

          .services-page {
            --blue-900: #061A4A;
            --blue-800: #0A2A66;
            --blue-700: #103A8C;
            --blue-100: #E6EEFC;
            --blue-50:  #F1F5FD;

            --orange: #FF7A1A;
            --orange-dark: #E86405;
            --orange-text: #D9590A;
            --orange-soft: #FFF0E3;

            --ink: #0A1B44;
            --muted: #5F6E8A;
            --line: #DFE6F2;
            --bg: #F4F7FC;
          }

          .services-page,
          .services-page * {
            box-sizing: border-box;
          }

          .services-page * {
            margin: 0;
            padding: 0;
          }

          .services-page {
            min-height: 100vh;
            padding-top: 76px;
            background: var(--bg);
            color: var(--ink);
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
          }

          .services-page a {
            text-decoration: none;
            color: inherit;
          }

          .services-page img {
            max-width: 100%;
            display: block;
          }

          .services-page button {
            font: inherit;
          }

          .services-page section {
            scroll-margin-top: 90px;
          }

          .services-page .container {
            width: 100%;
            max-width: 1180px;
            margin: 0 auto;
            padding: 0 20px;
          }

          /* ========== HERO ========== */

          .services-page .hero {
            position: relative;
            padding: 36px 0 130px;
            text-align: center;
            color: #fff;
            overflow: hidden;
            background:
              radial-gradient(700px 320px at 85% -10%, rgba(255,122,26,.28), transparent 60%),
              radial-gradient(600px 320px at 5% 0%, rgba(16,58,140,.55), transparent 60%),
              linear-gradient(180deg, var(--blue-900) 0%, var(--blue-800) 100%);
          }

          .services-page .hero::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
            background-size: 44px 44px;
            -webkit-mask-image: linear-gradient(180deg, #000, transparent 85%);
            mask-image: linear-gradient(180deg, #000, transparent 85%);
            pointer-events: none;
          }

          .services-page .hero .container {
            position: relative;
            z-index: 2;
          }

          .services-page .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 15px;
            border-radius: 999px;
            background: rgba(255,255,255,.08);
            border: 1px solid rgba(255,255,255,.16);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .14em;
            text-transform: uppercase;
            color: #FFD3AE;
          }

          .services-page .eyebrow svg {
            color: var(--orange);
          }

          .services-page .hero h1 {
            margin: 20px auto 14px;
            max-width: 760px;
            font-size: clamp(32px, 6vw, 56px);
            line-height: 1.06;
            letter-spacing: -.04em;
            font-weight: 800;
          }

          .services-page .hero h1 span {
            background: linear-gradient(90deg, var(--orange), #FFB066);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .services-page .hero p.lead {
            max-width: 600px;
            margin: 0 auto;
            font-size: 15px;
            color: rgba(255,255,255,.78);
            line-height: 1.7;
          }

          /* ========== OFFRES ========== */

          .services-page .offers-wrap {
            margin-top: -90px;
            position: relative;
            z-index: 5;
            padding-bottom: 30px;
          }

          .services-page .offers {
            display: grid;
            grid-template-columns: 1fr 1.1fr 1fr;
            gap: 20px;
            align-items: stretch;
          }

          .services-page .offer {
            position: relative;
            display: flex;
            flex-direction: column;
            padding: 28px 24px 24px;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 24px;
            box-shadow: 0 22px 50px rgba(10,42,102,.14);
            transition: transform .3s, box-shadow .3s;
          }

          .services-page .offer:hover {
            transform: translateY(-6px);
            box-shadow: 0 30px 60px rgba(10,42,102,.2);
          }

          .services-page .offer.featured {
            padding-top: 38px;
            padding-bottom: 28px;
            color: #fff;
            background: linear-gradient(165deg, var(--blue-900) 0%, var(--blue-700) 100%);
            border: 2px solid var(--orange);
            transform: translateY(-22px);
            box-shadow: 0 34px 70px rgba(10,42,102,.38), 0 0 0 6px rgba(255,122,26,.12);
          }

          .services-page .offer.featured:hover {
            transform: translateY(-28px);
          }

          .services-page .offer-badge {
            position: absolute;
            top: -14px;
            left: 50%;
            transform: translateX(-50%);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 16px;
            border-radius: 999px;
            background: var(--orange);
            color: #fff;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .1em;
            text-transform: uppercase;
            white-space: nowrap;
            box-shadow: 0 8px 20px rgba(255,122,26,.4);
          }

          .services-page .offer-level {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            align-self: flex-start;
            padding: 6px 11px;
            border-radius: 999px;
            background: var(--blue-100);
            color: var(--blue-800);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .12em;
            text-transform: uppercase;
          }

          .services-page .offer.featured .offer-level {
            background: rgba(255,255,255,.12);
            color: #FFD3AE;
          }

          .services-page .offer.pack .offer-level {
            background: var(--orange-soft);
            color: var(--orange-text);
          }

          .services-page .offer h2 {
            margin-top: 14px;
            font-size: 24px;
            line-height: 1.15;
            letter-spacing: -.03em;
            font-weight: 800;
          }

          .services-page .offer .tagline {
            margin-top: 6px;
            font-size: 13px;
            color: var(--muted);
          }

          .services-page .offer.featured .tagline {
            color: rgba(255,255,255,.75);
          }

          .services-page .price {
            margin-top: 18px;
            display: flex;
            align-items: baseline;
            gap: 7px;
          }

          .services-page .price strong {
            font-size: 42px;
            font-weight: 800;
            letter-spacing: -.05em;
            line-height: 1;
          }

          .services-page .price span {
            font-size: 13px;
            font-weight: 700;
            color: var(--muted);
          }

          .services-page .offer.featured .price strong {
            color: #FFB066;
          }

          .services-page .offer.featured .price span {
            color: rgba(255,255,255,.7);
          }

          .services-page .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            margin-top: 16px;
          }

          .services-page .chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 10px;
            border-radius: 9px;
            background: var(--blue-50);
            color: #3B4B6B;
            font-size: 11px;
            font-weight: 700;
          }

          .services-page .chip svg {
            color: var(--orange);
          }

          .services-page .offer.featured .chip {
            background: rgba(255,255,255,.1);
            color: #fff;
          }

          .services-page .offer ul {
            list-style: none;
            margin: 20px 0 22px;
            display: grid;
            gap: 11px;
            flex: 1;
          }

          .services-page .offer li {
            display: flex;
            gap: 10px;
            font-size: 13px;
            line-height: 1.5;
            color: #3B4B6B;
          }

          .services-page .offer.featured li {
            color: rgba(255,255,255,.92);
          }

          .services-page .offer li svg {
            flex: 0 0 auto;
            margin-top: 3px;
            color: var(--orange);
          }

          /* Couvertures du pack */

          .services-page .pack-covers {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            gap: 8px;
            width: 100%;
            margin: 18px 0 0;
          }

          .services-page .pack-covers .cover {
            position: relative;
            flex: 0 1 30%;
            max-width: 96px;
            aspect-ratio: 3 / 4;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-radius: 8px;
            border: 2px solid #fff;
            background: linear-gradient(145deg, var(--blue-900), var(--blue-700));
            color: var(--orange);
            box-shadow: 0 8px 18px rgba(10,42,102,.25);
          }

          .services-page .pack-covers .cover:nth-child(2) {
            transform: translateY(-6px);
          }

          .services-page .pack-covers .cover img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* Boutons */

          .services-page .cta {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            min-height: 52px;
            padding: 13px 18px;
            border-radius: 14px;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: .05em;
            text-transform: uppercase;
            transition: .25s;
          }

          .services-page .cta:hover {
            transform: translateY(-2px);
          }

          .services-page .cta-orange {
            background: var(--orange);
            color: #fff;
            box-shadow: 0 12px 26px rgba(255,122,26,.4);
          }

          .services-page .cta-orange:hover {
            background: var(--orange-dark);
          }

          .services-page .cta-blue {
            background: var(--blue-800);
            color: #fff;
            box-shadow: 0 12px 26px rgba(10,42,102,.28);
          }

          .services-page .cta-blue:hover {
            background: var(--blue-700);
          }

          .services-page .cta-outline {
            background: #fff;
            color: var(--blue-800);
            border: 2px solid var(--blue-800);
          }

          .services-page .cta-outline:hover {
            background: var(--blue-800);
            color: #fff;
          }

          .services-page .more {
            display: none;
          }

          .services-page .lbl-short {
            display: none;
          }

          /* ========== SECTIONS ========== */

          .services-page .section {
            padding: 70px 0;
          }

          .services-page .section.white {
            background: #fff;
          }

          .services-page .section-head {
            text-align: center;
            max-width: 640px;
            margin: 0 auto 38px;
          }

          .services-page .kicker {
            display: inline-block;
            margin-bottom: 10px;
            color: var(--orange-text);
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .16em;
            text-transform: uppercase;
          }

          .services-page .section-head h2 {
            color: var(--blue-800);
            font-size: clamp(26px, 4vw, 38px);
            font-weight: 800;
            letter-spacing: -.04em;
            line-height: 1.12;
          }

          .services-page .section-head p {
            margin-top: 12px;
            font-size: 14px;
            color: var(--muted);
            line-height: 1.7;
          }

          /* ========== TÉMOIGNAGES ========== */

          .services-page .marquee {
            position: relative;
            width: 100%;
            padding: 6px 0 14px;
            overflow: hidden;
            -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
            mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          }

          .services-page .track {
            display: flex;
            gap: 16px;
            width: max-content;
            will-change: transform;
          }

          .services-page .track.t1 {
            animation: svScrollLeft 70s linear infinite;
          }

          .services-page .track.t2 {
            animation: svScrollRight 80s linear infinite;
          }

          .services-page .marquee:hover .track,
          .services-page .marquee:active .track {
            animation-play-state: paused;
          }

          @keyframes svScrollLeft {
            to { transform: translateX(-50%); }
          }

          @keyframes svScrollRight {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }

          .services-page .proofs {
            margin-top: 14px;
          }

          .services-page .testi {
            width: 320px;
            flex-shrink: 0;
            padding: 22px;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 20px;
            box-shadow: 0 10px 28px rgba(10,42,102,.07);
          }

          .services-page .testi-top {
            display: flex;
            align-items: center;
            gap: 11px;
          }

          .services-page .avatar {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--blue-800), var(--blue-700));
            color: #FFB066;
            font-size: 12px;
            font-weight: 800;
          }

          .services-page .testi-name {
            font-size: 13px;
            font-weight: 800;
            color: var(--blue-800);
          }

          .services-page .testi-label {
            margin-top: 2px;
            font-size: 9px;
            color: #8793AD;
            text-transform: uppercase;
            letter-spacing: .07em;
          }

          .services-page .stars {
            margin-top: 14px;
            color: var(--orange);
            font-size: 12px;
            letter-spacing: 2px;
          }

          .services-page .testi p {
            margin-top: 10px;
            font-size: 13px;
            line-height: 1.7;
            color: #4A5873;
          }

          .services-page .testi.neg {
            background: linear-gradient(145deg, #fff, #F3F5F8);
          }

          .services-page .testi.neg .avatar {
            background: #E6E9EE;
            color: #5B6472;
            font-size: 17px;
          }

          .services-page .testi.neg .stars {
            color: #7B8494;
          }

          .services-page .neg-note {
            margin-top: 14px;
            padding-top: 10px;
            border-top: 1px solid #ECEEF1;
            font-size: 9px;
            color: #9AA2AF;
            text-transform: uppercase;
            letter-spacing: .06em;
          }

          .services-page .proof-img {
            height: 360px;
            width: auto;
            max-width: none;
            flex-shrink: 0;
            object-fit: contain;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 16px;
            box-shadow: 0 8px 22px rgba(10,42,102,.07);
          }

          /* ========== LIVRES ========== */

          .services-page .books {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
            gap: 18px;
          }

          .services-page .book {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 20px;
            transition: .3s;
          }

          .services-page .book:hover {
            transform: translateY(-5px);
            border-color: var(--orange);
            box-shadow: 0 20px 40px rgba(10,42,102,.14);
          }

          .services-page .book img {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            background: var(--blue-100);
          }

          .services-page .book-body {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 16px;
          }

          .services-page .book-num {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: var(--orange-text);
          }

          .services-page .book h3 {
            margin: 5px 0 7px;
            color: var(--blue-800);
            font-size: 15px;
            font-weight: 800;
            line-height: 1.3;
          }

          .services-page .book p {
            flex: 1;
            font-size: 12px;
            line-height: 1.6;
            color: var(--muted);
          }

          .services-page .book .cta {
            margin-top: 14px;
            min-height: 42px;
            font-size: 10px;
            border-radius: 11px;
          }

          /* ========== COMPTE ========== */

          .services-page .account {
            position: relative;
            overflow: hidden;
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 34px;
            align-items: center;
            padding: 46px 36px;
            border-radius: 30px;
            color: #fff;
            background:
              radial-gradient(circle at 100% 0%, rgba(255,122,26,.32), transparent 50%),
              linear-gradient(135deg, var(--blue-900) 0%, var(--blue-800) 60%, var(--blue-700) 100%);
            box-shadow: 0 30px 60px rgba(10,42,102,.3);
          }

          .services-page .account::before {
            content: "";
            position: absolute;
            width: 320px;
            height: 320px;
            right: -110px;
            top: -120px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,.2);
          }

          .services-page .account > * {
            position: relative;
            z-index: 2;
          }

          .services-page .account .kicker {
            color: #FFB680;
          }

          .services-page .account h2 {
            font-size: clamp(26px, 4vw, 36px);
            font-weight: 800;
            letter-spacing: -.04em;
            line-height: 1.12;
          }

          .services-page .account p {
            max-width: 460px;
            margin-top: 12px;
            font-size: 14px;
            line-height: 1.7;
            color: rgba(255,255,255,.85);
          }

          .services-page .account-price {
            margin-top: 18px;
            font-size: 46px;
            font-weight: 800;
            letter-spacing: -.05em;
            color: #FFB066;
          }

          .services-page .account-price span {
            margin-left: 6px;
            font-size: 14px;
            font-weight: 700;
            opacity: .85;
            color: #fff;
          }

          .services-page .account-card {
            padding: 24px;
            border-radius: 22px;
            background: rgba(255,255,255,.08);
            border: 1px solid rgba(255,255,255,.18);
          }

          .services-page .account-card ul {
            list-style: none;
            display: grid;
            gap: 13px;
            margin-bottom: 22px;
          }

          .services-page .account-card li {
            display: flex;
            gap: 11px;
            font-size: 13px;
            font-weight: 600;
          }

          .services-page .account-card li svg {
            flex: 0 0 auto;
            margin-top: 3px;
            color: var(--orange);
          }

          /* ========== FOOTER ========== */

          .services-page footer {
            padding: 40px 0 100px;
            text-align: center;
            color: #fff;
            background: var(--blue-900);
          }

          .services-page .f-brand {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: -.5px;
          }

          .services-page .f-brand span {
            color: var(--orange);
          }

          .services-page .f-sub {
            margin-top: 6px;
            font-size: 11px;
            letter-spacing: .08em;
            color: rgba(255,255,255,.6);
          }

          .services-page .f-risk {
            max-width: 680px;
            margin: 22px auto 0;
            padding: 14px 18px;
            border-radius: 12px;
            background: rgba(255,255,255,.07);
            font-size: 11px;
            line-height: 1.7;
            color: rgba(255,255,255,.65);
          }

          .services-page .f-copy {
            margin-top: 18px;
            font-size: 11px;
            color: rgba(255,255,255,.5);
          }

          .services-page .wa-float {
            position: fixed;
            right: 18px;
            bottom: 18px;
            z-index: 200;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #25D366;
            color: #fff;
            box-shadow: 0 12px 30px rgba(0,0,0,.25);
            transition: .25s;
          }

          .services-page .wa-float:hover {
            transform: scale(1.1);
          }

          .services-page .reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity .7s ease, transform .7s ease;
          }

          .services-page .reveal.visible {
            opacity: 1;
            transform: none;
          }

          /* ========== FENÊTRE DE DÉTAILS ========== */

          .services-page .sheet {
            position: fixed;
            inset: 0;
            z-index: 1100;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            background: rgba(6,26,74,.65);
            backdrop-filter: blur(3px);
          }

          .services-page .sheet-card {
            width: 100%;
            max-width: 520px;
            max-height: 88vh;
            overflow: auto;
            padding: 26px 22px 24px;
            background: #fff;
            border-radius: 24px 24px 0 0;
            animation: svUp .3s ease;
          }

          @keyframes svUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: none; opacity: 1; }
          }

          .services-page .sheet-card h3 {
            color: var(--blue-800);
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -.03em;
          }

          .services-page .sheet-card .sp {
            margin-top: 6px;
            color: var(--orange-text);
            font-size: 30px;
            font-weight: 800;
            letter-spacing: -.04em;
          }

          .services-page .sheet-card .sp small {
            color: var(--muted);
            font-size: 12px;
            font-weight: 700;
          }

          .services-page .sheet-card .chips {
            margin-top: 12px;
          }

          .services-page .sheet-card ul {
            list-style: none;
            margin: 18px 0 20px;
            display: grid;
            gap: 11px;
          }

          .services-page .sheet-card li {
            display: flex;
            gap: 10px;
            font-size: 13px;
            line-height: 1.5;
            color: #3B4B6B;
          }

          .services-page .sheet-card li svg {
            flex: 0 0 auto;
            margin-top: 3px;
            color: var(--orange);
          }

          .services-page .sheet-close {
            float: right;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 1px solid var(--line);
            background: #fff;
            color: var(--blue-800);
            cursor: pointer;
          }

          /* ========== TABLETTE & MOBILE ========== */

          @media (max-width: 960px) {
            .services-page .hero {
              padding: 26px 0 90px;
            }

            .services-page .hero h1 {
              font-size: clamp(24px, 7vw, 34px);
              margin: 14px auto 8px;
            }

            .services-page .hero p.lead {
              font-size: 12px;
              line-height: 1.55;
            }

            .services-page .eyebrow {
              font-size: 8px;
              padding: 6px 11px;
            }

            .services-page .offers-wrap {
              margin-top: -62px;
            }

            .services-page .container {
              padding: 0 10px;
            }

            .services-page .offers {
              grid-template-columns: 1fr 1.12fr 1fr;
              gap: 8px;
            }

            .services-page .offer {
              padding: 16px 8px 10px;
              align-items: center;
              text-align: center;
              border-radius: 16px;
            }

            .services-page .offer.featured {
              padding: 22px 8px 12px;
              transform: translateY(-10px);
              box-shadow: 0 20px 40px rgba(10,42,102,.32), 0 0 0 3px rgba(255,122,26,.15);
            }

            .services-page .offer:hover {
              transform: none;
            }

            .services-page .offer.featured:hover {
              transform: translateY(-10px);
            }

            .services-page .offer-badge {
              top: -11px;
              padding: 5px 9px;
              font-size: 8px;
              letter-spacing: .05em;
            }

            .services-page .offer-badge svg,
            .services-page .offer-level svg {
              display: none;
            }

            .services-page .offer-level {
              align-self: center;
              padding: 4px 7px;
              font-size: 7px;
              letter-spacing: .06em;
            }

            .services-page .offer h2 {
              margin-top: 10px;
              font-size: 12.5px;
              line-height: 1.2;
            }

            .services-page .offer .tagline {
              display: none;
            }

            .services-page .price {
              margin-top: 10px;
              flex-direction: column;
              align-items: center;
              gap: 0;
            }

            .services-page .price strong {
              font-size: 21px;
            }

            .services-page .price span {
              font-size: 9px;
            }

            .services-page .offer .chips {
              justify-content: center;
              gap: 4px;
              margin-top: 10px;
            }

            .services-page .offer .chip {
              padding: 4px 6px;
              border-radius: 6px;
              font-size: 8px;
            }

            .services-page .offer .chip svg {
              display: none;
            }

            .services-page .offer ul {
              display: none;
            }

            .services-page .pack-covers {
              gap: 3px;
              margin-top: 10px;
            }

            .services-page .pack-covers .cover {
              flex: 0 1 31%;
              border-width: 1px;
              border-radius: 5px;
            }

            .services-page .pack-covers .cover:nth-child(2) {
              transform: translateY(-4px);
            }

            .services-page .more {
              display: block;
              flex: 1;
              align-self: center;
              margin: 12px 0 8px;
              padding-top: 2px;
              border: 0;
              background: none;
              color: var(--blue-700);
              font-size: 10px;
              font-weight: 800;
              text-decoration: underline;
              cursor: pointer;
            }

            .services-page .offer.featured .more {
              color: #FFB066;
            }

            .services-page .offer .cta {
              width: 100%;
              min-height: 40px;
              padding: 8px 4px;
              border-radius: 10px;
              font-size: 10px;
              letter-spacing: .02em;
            }

            .services-page .offer .cta svg {
              display: none;
            }

            .services-page .offer .lbl-full {
              display: none;
            }

            .services-page .offer .lbl-short {
              display: inline;
            }
          }

          @media (max-width: 860px) {
            .services-page .account {
              grid-template-columns: 1fr;
              padding: 34px 22px;
            }
          }

          @media (max-width: 640px) {
            .services-page .books {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 10px;
            }

            .services-page .book {
              border-radius: 14px;
            }

            .services-page .book-body {
              padding: 10px;
            }

            .services-page .book-num {
              font-size: 8px;
            }

            .services-page .book h3 {
              margin: 3px 0 5px;
              font-size: 12px;
            }

            .services-page .book p {
              font-size: 10px;
              line-height: 1.5;
            }

            .services-page .book .cta {
              min-height: 36px;
              margin-top: 10px;
              padding: 8px 4px;
              font-size: 8.5px;
            }

            .services-page .book:last-child:nth-child(odd) {
              grid-column: 1 / -1;
              justify-self: center;
              width: calc(50% - 5px);
            }
          }

          @media (max-width: 600px) {
            .services-page .proof-img {
              height: 300px;
            }

            .services-page .testi {
              width: 280px;
            }
          }

          @media (max-width: 520px) {
            .services-page {
              padding-top: 68px;
            }
          }

          @media (max-width: 380px) {
            .services-page .container {
              padding: 0 6px;
            }

            .services-page .offers {
              gap: 5px;
            }

            .services-page .offer h2 {
              font-size: 11px;
            }

            .services-page .price strong {
              font-size: 18px;
            }

            .services-page .offer .chip {
              font-size: 7px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .services-page .track {
              animation: none !important;
            }

            .services-page .reveal {
              opacity: 1;
              transform: none;
              transition: none;
            }
          }
        `}</style>

        <main>
          {/* ================= HERO + 3 OFFRES ================= */}

          <section className="hero" id="offres">
            <div className="container">
              <div className="eyebrow">
                <Zap size={13} />
                Du niveau débutant au niveau avancé
              </div>

              <h1>
                Choisissez votre parcours.
                <br />
                <span>Devenez trader.</span>
              </h1>

              <p className="lead">
                Trois façons d'apprendre le trading : accompagné pas à pas,
                avec une méthode complète, ou à votre propre rythme.
              </p>
            </div>
          </section>

          <div className="offers-wrap">
            <div className="container">
              <div className="offers">
                {offers.map((offer) => {
                  const LevelIcon = offer.Icon;
                  const CtaIcon = offer.CtaIcon;

                  return (
                    <article
                      key={offer.id}
                      className={`offer ${offer.tone} reveal`}
                    >
                      {offer.badge && (
                        <div className="offer-badge">
                          <Star size={12} />
                          <span className="lbl-full">Le plus complet</span>
                          <span className="lbl-short">Populaire</span>
                        </div>
                      )}

                      <span className="offer-level">
                        <LevelIcon size={13} />
                        {offer.level}
                      </span>

                      <h2>{offer.title}</h2>

                      <p className="tagline">{offer.tagline}</p>

                      {offer.covers && (
                        <div className="pack-covers">
                          {packCovers.map((book) => (
                            <span className="cover" key={book.id}>
                              <BookOpen size={20} />

                              <img
                                src={book.image}
                                alt={book.title}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="price">
                        <strong>{offer.price}</strong>
                        <span>FCFA</span>
                      </div>

                      <div className="chips">
                        {offer.chips.map((chip) => {
                          const ChipIcon = chip.Icon;

                          return (
                            <span className="chip" key={chip.text}>
                              <ChipIcon size={13} />
                              {chip.text}
                            </span>
                          );
                        })}
                      </div>

                      <ul>
                        {offer.points.map((point) => (
                          <li key={point}>
                            <Check size={14} />
                            {point}
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        className="more"
                        onClick={() => setSheet(offer)}
                      >
                        Voir le détail
                      </button>

                      <a
                        className={`cta ${offer.ctaClass}`}
                        href={offer.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CtaIcon size={16} />
                        <span className="lbl-full">{offer.ctaLabel}</span>
                        <span className="lbl-short">Choisir</span>
                      </a>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= TÉMOIGNAGES ================= */}

          <section className="section" id="temoignages">
            <div className="container">
              <div className="section-head reveal">
                <span className="kicker">Retours clients</span>

                <h2>Ils parlent de leur expérience</h2>

                <p>
                  Des retours positifs, mais aussi des avis qui nous
                  permettent de rester transparents.
                </p>
              </div>
            </div>

            <div className="marquee reveal">
              <div className="track t1">
                {repeat(testimonials).map((item, index) => (
                  <article
                    key={`${item.name}-${index}`}
                    className={`testi ${item.negative ? "neg" : ""}`}
                  >
                    <div className="testi-top">
                      <div className="avatar">{item.initials}</div>

                      <div>
                        <div className="testi-name">{item.name}</div>
                        <div className="testi-label">{item.label}</div>
                      </div>
                    </div>

                    <div className="stars">
                      {item.negative ? "★" : "★★★★★"}
                    </div>

                    <p>{item.text}</p>

                    {item.negative && (
                      <div className="neg-note">
                        Avis affiché en toute transparence.
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>

            <div className="marquee proofs reveal">
              <div className="track t2">
                {repeat(PROOF_IMAGES).map((src, index) => (
                  <img
                    key={`${src}-${index}`}
                    className="proof-img"
                    src={src}
                    alt="Témoignage client"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ================= LIVRES ================= */}

          <section className="section white" id="livres">
            <div className="container">
              <div className="section-head reveal">
                <span className="kicker">Livres numériques PDF</span>

                <h2>Ou choisissez vos livres un par un</h2>

                <p>
                  Des ressources numériques pour approfondir vos
                  connaissances et progresser à votre rythme.
                </p>
              </div>

              <div className="books">
                {books.map((book, index) => (
                  <article className="book reveal" key={book.id}>
                    <img src={book.image} alt={book.title} loading="lazy" />

                    <div className="book-body">
                      <div className="book-num">
                        Livre {String(index + 1).padStart(2, "0")}
                      </div>

                      <h3>{book.title}</h3>

                      <p>{book.description}</p>

                      <a
                        className="cta cta-orange"
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Consulter &amp; commander
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ================= COMPTE ================= */}

          <section className="section" id="compte">
            <div className="container">
              <div className="account reveal">
                <div>
                  <span className="kicker">Besoin d'aide ?</span>

                  <h2>
                    Création &amp; configuration de votre compte de trading
                  </h2>

                  <p>
                    Vous ne savez pas comment créer ou paramétrer votre
                    compte ? PHI Academy vous guide étape par étape, à
                    distance.
                  </p>

                  <div className="account-price">
                    5 000<span>FCFA</span>
                  </div>
                </div>

                <div className="account-card">
                  <ul>
                    <li>
                      <Check size={15} />
                      Création du compte
                    </li>

                    <li>
                      <Check size={15} />
                      Paramétrage accompagné
                    </li>

                    <li>
                      <Check size={15} />
                      Appel vidéo WhatsApp
                    </li>

                    <li>
                      <Check size={15} />
                      Partage d'écran pour vous guider
                    </li>
                  </ul>

                  <a
                    className="cta cta-orange"
                    href={whatsappLink(
                      WHATSAPP_ACCOUNT_NUMBER,
                      "Bonjour PHI Academy, je souhaite faire la configuration de mon compte à 5 000 FCFA."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={16} />
                    Configurer mon compte
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <div className="container">
            <div className="f-brand">
              PHI <span>ACADEMY</span>
            </div>

            <div className="f-sub">Trading • Formation • Mentoring</div>

            <div className="f-risk">
              Le trading comporte des risques financiers importants. Les
              contenus, formations et accompagnements proposés ont un
              objectif éducatif et ne constituent pas une garantie de
              résultats financiers.
            </div>

            <div className="f-copy">
              © {new Date().getFullYear()} PHI Academy. Tous droits réservés.
            </div>
          </div>
        </footer>

        <a
          className="wa-float"
          href={whatsappLink(
            WHATSAPP_NUMBER,
            "Bonjour PHI Academy, je souhaite avoir des informations."
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter PHI Academy sur WhatsApp"
        >
          <MessageCircle size={27} />
        </a>

        {/* ================= DÉTAILS (MOBILE) ================= */}

        {sheet && (
          <div
            className="sheet"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSheet(null);
              }
            }}
          >
            <div className="sheet-card" role="dialog" aria-modal="true">
              <button
                type="button"
                className="sheet-close"
                aria-label="Fermer"
                onClick={() => setSheet(null)}
              >
                <X size={16} />
              </button>

              <h3>{sheet.title}</h3>

              <div className="sp">
                {sheet.price} <small>FCFA</small>
              </div>

              <div className="chips">
                {sheet.chips.map((chip) => {
                  const ChipIcon = chip.Icon;

                  return (
                    <span className="chip" key={chip.text}>
                      <ChipIcon size={13} />
                      {chip.text}
                    </span>
                  );
                })}
              </div>

              <ul>
                {sheet.points.map((point) => (
                  <li key={point}>
                    <Check size={14} />
                    {point}
                  </li>
                ))}
              </ul>

              <a
                className={`cta ${sheet.ctaClass}`}
                href={sheet.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sheet.ctaLabel}
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Services;
