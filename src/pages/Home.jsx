import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Home as HomeIcon,
  ShoppingBag,
  UsersRound,
  Play,
  X,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);

  const modules = [
    {
      number: "01",
      title: "Comprendre le trading",
      description:
        "Découvrez les bases du trading et le fonctionnement des marchés.",
      lessons: 6,
    },
    {
      number: "02",
      title: "Lire un graphique",
      description:
        "Apprenez à comprendre les chandeliers, les mouvements et la structure d'un graphique.",
      lessons: 7,
    },
    {
      number: "03",
      title: "Analyse technique",
      description:
        "Découvrez les principaux outils utilisés pour analyser les marchés.",
      lessons: 8,
    },
    {
      number: "04",
      title: "Price Action",
      description:
        "Comprenez le comportement du prix et les structures importantes.",
      lessons: 6,
    },
    {
      number: "05",
      title: "Gestion du risque",
      description:
        "Apprenez à protéger votre capital et à gérer votre exposition.",
      lessons: 5,
    },
    {
      number: "06",
      title: "Psychologie du trader",
      description:
        "Travaillez votre discipline et votre rapport aux décisions de trading.",
      lessons: 5,
    },
  ];

  return (
    <div className="phi-app">
      <Navbar />

      {/* =========================
          MOBILE APP HEADER
      ========================= */}

      <header className="mobile-header">
        <div className="brand-area">
          <div className="mobile-logo">
            <img
              src="/images/logo/phi-logo.png"
              alt="PHI Academy"
            />
          </div>

          <div className="brand-name">
            <strong>PHI</strong>
            <span>ACADEMY</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="header-icon"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Rechercher"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>
      </header>

      {/* =========================
          SEARCH
      ========================= */}

      {searchOpen && (
        <div className="search-panel">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Rechercher une leçon..."
              autoFocus
            />
          </div>
        </div>
      )}

      <main className="app-main">
        {/* =========================
            WELCOME
        ========================= */}

        <section className="welcome">
          <span className="welcome-label">
            PHI ACADEMY
          </span>

          <h1>
            Prêt à apprendre
            <br />
            le <span>trading</span> ?
          </h1>

          <p>
            Un parcours structuré pour apprendre les bases
            du trading, étape par étape.
          </p>
        </section>

        {/* =========================
            MAIN LEARNING CARD
        ========================= */}

        <section className="learning-card">
          <div className="learning-content">
            <div className="learning-icon">
              <BookOpen size={23} />
            </div>

            <span className="card-label">
              VOTRE PARCOURS
            </span>

            <h2>
              Apprendre le trading
            </h2>

            <p>
              Découvrez les différents thèmes et choisissez
              la partie que vous souhaitez étudier.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/connexion-cursus")}
            >
              <span>Voir le parcours</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Illustration */}

          <div className="learning-visual">
            <div className="chart-grid" />

            <svg
              viewBox="0 0 220 140"
              className="chart-svg"
              aria-hidden="true"
            >
              <line
                x1="15"
                y1="115"
                x2="205"
                y2="115"
                className="chart-axis"
              />

              <line
                x1="15"
                y1="30"
                x2="15"
                y2="115"
                className="chart-axis"
              />

              <polyline
                points="
                  18,102
                  39,94
                  56,98
                  72,76
                  91,84
                  108,60
                  126,67
                  143,43
                  160,49
                  181,25
                  202,31
                "
                className="chart-line"
              />

              <circle
                cx="181"
                cy="25"
                r="4"
                className="chart-point"
              />
            </svg>

            <div className="chart-tag">
              TRADING
            </div>
          </div>
        </section>

        {/* =========================
            CURSUS
        ========================= */}

        <section className="section">
          <div className="section-header">
            <div>
              <span>APPRENTISSAGE</span>
              <h2>Votre parcours</h2>
            </div>

            <button
              onClick={() => navigate("/connexion-cursus")}
              className="section-link"
            >
              Tout voir
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="module-list">
            {modules.map((module) => (
              <button
                key={module.number}
                className="module"
                onClick={() => navigate("/connexion-cursus")}
              >
                <div className="module-number">
                  {module.number}
                </div>

                <div className="module-info">
                  <h3>
                    {module.title}
                  </h3>

                  <p>
                    {module.description}
                  </p>

                  <span className="lesson-count">
                    {module.lessons} ressources
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="module-arrow"
                />
              </button>
            ))}
          </div>
        </section>

        {/* =========================
            YOUTUBE EXPLANATION
        ========================= */}

        <section className="resource-info-card">
          <div className="youtube-icon">
            <Play
              size={18}
              fill="currentColor"
            />
          </div>

          <div>
            <span>
              RESSOURCES
            </span>

            <h2>
              Apprenez directement auprès
              de ressources sélectionnées.
            </h2>

            <p>
              Chaque partie du parcours vous propose
              des vidéos et ressources externes sélectionnées
              pour vous aider à apprendre.
            </p>
          </div>
        </section>

        {/* =========================
            SERVICES
        ========================= */}

        <section className="space-card">
          <div className="space-icon">
            <ShoppingBag size={21} />
          </div>

          <div className="space-content">
            <span>
              ESPACE SERVICES
            </span>

            <h2>
              Guides, formations
              et accompagnement.
            </h2>

            <p>
              Découvrez les services proposés
              par PHI Academy.
            </p>

            <button
              onClick={() => navigate("/services")}
            >
              Découvrir
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* =========================
            PARRAINAGE
        ========================= */}

        <section className="space-card referral">
          <div className="space-icon">
            <UsersRound size={21} />
          </div>

          <div className="space-content">
            <span>
              ESPACE PARRAINAGE
            </span>

            <h2>
              Développez votre
              réseau avec PHI Academy.
            </h2>

            <p>
              Retrouvez votre lien de parrainage,
              vos filleuls et vos commissions.
            </p>

            <button
              onClick={() => navigate("/connexion-parrainage")}
            >
              Mon parrainage
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <div className="bottom-space" />
      </main>

      {/* =========================
          MOBILE BOTTOM NAV
      ========================= */}

      <nav className="bottom-nav">
        <button
          className="active"
          onClick={() => navigate("/")}
        >
          <HomeIcon size={20} />

          <span>
            Accueil
          </span>
        </button>

        <button
          onClick={() => navigate("/connexion-cursus")}
        >
          <BookOpen size={20} />

          <span>
            Apprendre
          </span>
        </button>

        <button
          onClick={() => navigate("/services")}
        >
          <ShoppingBag size={20} />

          <span>
            Services
          </span>
        </button>

        <button
          onClick={() => navigate("/connexion-parrainage")}
        >
          <UsersRound size={20} />

          <span>
            Parrainage
          </span>
        </button>
      </nav>

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f7f8fa;
          color: #0b132b;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          -webkit-font-smoothing: antialiased;
        }

        button {
          font: inherit;
        }

        /* =========================
           APP
        ========================= */

        .phi-app {
          min-height: 100vh;
          background: #f7f8fa;
        }

        .app-main {
          width: 100%;
          max-width: 620px;

          margin: 0 auto;

          padding:
            18px
            16px
            105px;
        }

        /* =========================
           MOBILE HEADER
        ========================= */

        .mobile-header {
          position: sticky;
          top: 0;
          z-index: 50;

          height: 67px;

          padding: 0 16px;

          background:
            rgba(255,255,255,0.93);

          border-bottom:
            1px solid #e8ebf0;

          backdrop-filter: blur(18px);

          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-area {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        /* =========================
           VRAI LOGO
        ========================= */

        .mobile-logo {
          width: 39px;
          height: 39px;

          flex: 0 0 auto;

          border-radius: 12px;

          overflow: hidden;

          background: #0b132b;

          display: flex;
          align-items: center;
          justify-content: center;

          box-shadow:
            0 5px 15px
            rgba(11,19,43,0.16);
        }

        .mobile-logo img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
        }

        .brand-name {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand-name strong {
          color: #0b132b;

          font-size: 13px;

          letter-spacing: 0.08em;
        }

        .brand-name span {
          margin-top: 3px;

          color: #8b929e;

          font-size: 7px;
          font-weight: 800;

          letter-spacing: 0.18em;
        }

        .header-actions {
          display: flex;
          align-items: center;
        }

        .header-icon {
          width: 38px;
          height: 38px;

          border: 0;
          border-radius: 12px;

          background: #f3f4f6;

          color: #0b132b;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;
        }

        /* =========================
           SEARCH
        ========================= */

        .search-panel {
          padding:
            10px
            16px
            2px;

          background: #fff;
        }

        .search-box {
          height: 44px;

          padding: 0 13px;

          border:
            1px solid #e1e5eb;

          border-radius: 13px;

          background: #f7f8fa;

          color: #8a919d;

          display: flex;
          align-items: center;
          gap: 9px;
        }

        .search-box input {
          width: 100%;

          border: 0;
          outline: 0;

          background: transparent;

          color: #0b132b;

          font-size: 12px;
        }

        /* =========================
           WELCOME
        ========================= */

        .welcome {
          padding:
            17px
            2px
            21px;
        }

        .welcome-label {
          display: block;

          margin-bottom: 8px;

          color: #b18a1c;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 0.18em;
        }

        .welcome h1 {
          margin: 0;

          color: #0b132b;

          font-size: 29px;
          line-height: 1.08;

          letter-spacing: -0.045em;

          font-weight: 400;
        }

        .welcome h1 span {
          color: #b18a1c;
          font-weight: 750;
        }

        .welcome p {
          max-width: 350px;

          margin:
            11px 0 0;

          color: #737c8c;

          font-size: 11px;
          line-height: 1.55;
        }

        /* =========================
           LEARNING CARD
        ========================= */

        .learning-card {
          position: relative;

          min-height: 230px;

          overflow: hidden;

          padding: 21px;

          border-radius: 24px;

          background:
            linear-gradient(
              135deg,
              #0b132b 0%,
              #111d3b 100%
            );

          box-shadow:
            0 18px 45px
            rgba(11,19,43,0.15);

          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .learning-content {
          position: relative;
          z-index: 2;

          width: 61%;
        }

        .learning-icon {
          width: 40px;
          height: 40px;

          margin-bottom: 17px;

          border-radius: 12px;

          background:
            rgba(212,175,55,0.13);

          color: #d4af37;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-label {
          display: block;

          margin-bottom: 7px;

          color: #d4af37;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 0.16em;
        }

        .learning-content h2 {
          margin: 0;

          color: #fff;

          font-size: 19px;
          line-height: 1.15;

          letter-spacing: -0.03em;
        }

        .learning-content p {
          margin:
            9px 0 16px;

          color: #aab2c1;

          font-size: 9px;
          line-height: 1.5;
        }

        .primary-button {
          min-height: 38px;

          padding: 0 12px;

          border: 0;
          border-radius: 10px;

          background: #d4af37;
          color: #0b132b;

          display: inline-flex;
          align-items: center;
          gap: 7px;

          font-size: 9px;
          font-weight: 800;

          cursor: pointer;
        }

        /* =========================
           CHART
        ========================= */

        .learning-visual {
          position: absolute;

          right: -5px;
          bottom: 0;

          width: 45%;
          height: 100%;

          opacity: 0.95;
        }

        .chart-grid {
          position: absolute;
          inset: 0;

          background-image:
            linear-gradient(
              rgba(255,255,255,0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.035) 1px,
              transparent 1px
            );

          background-size:
            27px 27px;

          mask-image:
            linear-gradient(
              90deg,
              transparent,
              black
            );
        }

        .chart-svg {
          position: absolute;

          right: -12px;
          bottom: 15px;

          width: 240px;
          height: 155px;
        }

        .chart-axis {
          stroke: rgba(255,255,255,0.08);
          stroke-width: 1;
        }

        .chart-line {
          fill: none;

          stroke: #d4af37;

          stroke-width: 2.4;

          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .chart-point {
          fill: #d4af37;

          filter:
            drop-shadow(
              0 0 7px
              rgba(212,175,55,0.8)
            );
        }

        .chart-tag {
          position: absolute;

          right: 17px;
          top: 19px;

          padding:
            5px 7px;

          border:
            1px solid
            rgba(212,175,55,0.2);

          border-radius: 6px;

          background:
            rgba(212,175,55,0.08);

          color: #d4af37;

          font-size: 6px;
          font-weight: 900;

          letter-spacing: 0.12em;
        }

        /* =========================
           SECTION
        ========================= */

        .section {
          margin-top: 32px;
        }

        .section-header {
          margin-bottom: 13px;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
        }

        .section-header span {
          display: block;

          margin-bottom: 4px;

          color: #a18a45;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 0.17em;
        }

        .section-header h2 {
          margin: 0;

          color: #0b132b;

          font-size: 19px;

          letter-spacing: -0.035em;
        }

        .section-link {
          border: 0;
          background: transparent;

          color: #a27d16;

          display: flex;
          align-items: center;
          gap: 2px;

          font-size: 9px;
          font-weight: 750;

          cursor: pointer;
        }

        /* =========================
           MODULES
        ========================= */

        .module-list {
          display: grid;
          gap: 8px;
        }

        .module {
          width: 100%;

          min-height: 87px;

          padding: 12px;

          border:
            1px solid #e5e8ed;

          border-radius: 17px;

          background: #fff;

          display: flex;
          align-items: center;
          gap: 11px;

          text-align: left;

          cursor: pointer;

          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            border-color 160ms ease;
        }

        .module:hover {
          transform: translateY(-1px);

          border-color:
            rgba(212,175,55,0.45);

          box-shadow:
            0 9px 25px
            rgba(11,19,43,0.06);
        }

        .module-number {
          width: 38px;
          height: 38px;

          flex: 0 0 auto;

          border-radius: 12px;

          background: #f0f2f6;

          color: #0b132b;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 9px;
          font-weight: 900;
        }

        .module:nth-child(2) .module-number,
        .module:nth-child(4) .module-number {
          background:
            rgba(212,175,55,0.12);

          color:
            #9b7718;
        }

        .module-info {
          min-width: 0;
          flex: 1;
        }

        .module-info h3 {
          margin: 0;

          color: #0b132b;

          font-size: 11px;
          line-height: 1.3;

          font-weight: 750;
        }

        .module-info p {
          margin:
            4px 0;

          color: #7d8593;

          font-size: 9px;
          line-height: 1.4;
        }

        .lesson-count {
          display: block;

          color: #a18a45;

          font-size: 8px;
          font-weight: 700;
        }

        .module-arrow {
          flex: 0 0 auto;

          color: #a3aab5;
        }

        /* =========================
           RESOURCE INFO
        ========================= */

        .resource-info-card {
          margin-top: 32px;

          padding: 17px;

          border:
            1px solid #e4e7eb;

          border-radius: 19px;

          background: #fff;

          display: flex;
          gap: 12px;
        }

        .youtube-icon {
          width: 38px;
          height: 38px;

          flex: 0 0 auto;

          border-radius: 11px;

          background: #f1f3f6;

          color: #0b132b;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .resource-info-card span {
          display: block;

          margin-bottom: 5px;

          color: #a18a45;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 0.15em;
        }

        .resource-info-card h2 {
          margin: 0;

          color: #0b132b;

          font-size: 12px;
          line-height: 1.35;
        }

        .resource-info-card p {
          margin:
            7px 0 0;

          color: #7c8593;

          font-size: 9px;
          line-height: 1.5;
        }

        /* =========================
           SPACES
        ========================= */

        .space-card {
          margin-top: 12px;

          padding: 18px;

          border:
            1px solid #e2e6eb;

          border-radius: 20px;

          background: #fff;

          display: flex;
          gap: 12px;
        }

        .space-icon {
          width: 40px;
          height: 40px;

          flex: 0 0 auto;

          border-radius: 12px;

          background: #0b132b;

          color: #d4af37;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .space-content {
          min-width: 0;
        }

        .space-content span {
          display: block;

          margin-bottom: 5px;

          color: #a18a45;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 0.15em;
        }

        .space-content h2 {
          margin: 0;

          color: #0b132b;

          font-size: 13px;
          line-height: 1.35;
        }

        .space-content p {
          margin:
            7px 0 10px;

          color: #7c8593;

          font-size: 9px;
          line-height: 1.5;
        }

        .space-content button {
          padding: 0;

          border: 0;
          background: transparent;

          color: #a27d16;

          display: inline-flex;
          align-items: center;
          gap: 6px;

          font-size: 9px;
          font-weight: 800;

          cursor: pointer;
        }

        .referral {
          background:
            linear-gradient(
              135deg,
              #ffffff,
              #faf9f4
            );
        }

        .bottom-space {
          height: 12px;
        }

        /* =========================
           BOTTOM NAV
        ========================= */

        .bottom-nav {
          position: fixed;

          z-index: 100;

          right: 0;
          bottom: 0;
          left: 0;

          height: 68px;

          padding:
            7px
            max(10px, env(safe-area-inset-left))
            max(7px, env(safe-area-inset-bottom))
            max(10px, env(safe-area-inset-right));

          border-top:
            1px solid #e4e7ec;

          background:
            rgba(255,255,255,0.95);

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          display: grid;

          grid-template-columns:
            repeat(4, 1fr);
        }

        .bottom-nav button {
          position: relative;

          border: 0;
          background: transparent;

          color: #9aa1ac;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 4px;

          cursor: pointer;
        }

        .bottom-nav button span {
          font-size: 7px;
          font-weight: 700;
        }

        .bottom-nav button.active {
          color: #0b132b;
        }

        .bottom-nav button.active svg {
          color: #a98118;
        }

        .bottom-nav button.active::before {
          content: "";

          position: absolute;

          top: -7px;

          width: 19px;
          height: 2px;

          border-radius: 999px;

          background: #d4af37;
        }

        /* =========================
           TABLET / DESKTOP
        ========================= */

        @media (min-width: 768px) {

          .mobile-header {
            display: none;
          }

          .app-main {
            max-width: 760px;

            padding-top: 50px;
          }

          .bottom-nav {
            width: 620px;

            right: 50%;
            left: auto;

            transform:
              translateX(50%);

            bottom: 15px;

            border:
              1px solid #e1e4e9;

            border-radius: 19px;

            box-shadow:
              0 15px 45px
              rgba(11,19,43,0.1);
          }
        }

        /* =========================
           SMALL PHONES
        ========================= */

        @media (max-width: 360px) {

          .app-main {
            padding-left: 13px;
            padding-right: 13px;
          }

          .welcome h1 {
            font-size: 26px;
          }

          .learning-card {
            min-height: 250px;
            padding: 18px;
          }

          .learning-content {
            width: 66%;
          }

          .learning-visual {
            width: 48%;
          }

          .learning-content h2 {
            font-size: 17px;
          }

          .module-info p {
            font-size: 8px;
          }
        }

        /* =========================
           REDUCED MOTION
        ========================= */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            transition: none !important;
            animation: none !important;
          }
        }

      `}</style>
    </div>
  );
}

export default Home;