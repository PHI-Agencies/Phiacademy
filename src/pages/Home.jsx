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
              src="https://res.cloudinary.com/dzy6t8hky/image/upload/v1791974143/Gemini_Generated_Image_ig831yig831yig83_so0wli.jpg"
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

        /* =========================
           PALETTE : BLEU • BLANC • ORANGE
        ========================= */

        .phi-app {
          --blue-900: #061A4A;
          --blue-800: #0A2A6B;
          --blue-700: #103A8C;
          --blue-100: #E6EEFC;
          --blue-50:  #F1F5FD;

          --orange: #FF7A1A;
          --orange-text: #D9590A;
          --orange-soft: #FFF0E3;

          --ink: #0A1B44;
          --muted: #5F6E8A;
          --muted-2: #8794AD;
          --line: #DFE6F2;
          --bg: #F4F7FC;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #F4F7FC;
          color: #0A1B44;

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
          background: var(--bg);
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
            rgba(255,255,255,0.94);

          border-bottom:
            1px solid var(--line);

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

        .mobile-logo {
          width: 39px;
          height: 39px;

          flex: 0 0 auto;

          border-radius: 12px;

          overflow: hidden;

          background: var(--blue-800);

          display: flex;
          align-items: center;
          justify-content: center;

          border: 2px solid var(--orange);

          box-shadow:
            0 5px 15px
            rgba(10,42,107,0.2);
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
          color: var(--blue-800);

          font-size: 14px;

          letter-spacing: 0.08em;
        }

        .brand-name span {
          margin-top: 3px;

          color: var(--orange-text);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.18em;
        }

        .header-actions {
          display: flex;
          align-items: center;
        }

        .header-icon {
          width: 40px;
          height: 40px;

          border: 0;
          border-radius: 12px;

          background: var(--blue-50);

          color: var(--blue-800);

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          transition: background 160ms ease, color 160ms ease;
        }

        .header-icon:hover {
          background: var(--orange-soft);
          color: var(--orange-text);
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
          height: 46px;

          padding: 0 14px;

          border:
            1px solid var(--line);

          border-radius: 13px;

          background: var(--blue-50);

          color: var(--muted-2);

          display: flex;
          align-items: center;
          gap: 9px;
        }

        .search-box:focus-within {
          border-color: var(--orange);
          background: #fff;
        }

        .search-box input {
          width: 100%;

          border: 0;
          outline: 0;

          background: transparent;

          color: var(--ink);

          font-size: 13px;
        }

        /* =========================
           WELCOME
        ========================= */

        .welcome {
          padding:
            17px
            2px
            22px;
        }

        .welcome-label {
          display: inline-block;

          margin-bottom: 10px;

          padding: 5px 10px;

          border-radius: 999px;

          background: var(--orange-soft);

          color: var(--orange-text);

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 0.16em;
        }

        .welcome h1 {
          margin: 0;

          color: var(--blue-800);

          font-size: 31px;
          line-height: 1.1;

          letter-spacing: -0.045em;

          font-weight: 500;
        }

        .welcome h1 span {
          color: var(--orange);
          font-weight: 800;
        }

        .welcome p {
          max-width: 360px;

          margin:
            12px 0 0;

          color: var(--muted);

          font-size: 13px;
          line-height: 1.6;
        }

        /* =========================
           LEARNING CARD
        ========================= */

        .learning-card {
          position: relative;

          min-height: 245px;

          overflow: hidden;

          padding: 22px;

          border-radius: 24px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(255,122,26,0.28),
              transparent 55%
            ),
            linear-gradient(
              135deg,
              var(--blue-900) 0%,
              var(--blue-800) 55%,
              var(--blue-700) 100%
            );

          box-shadow:
            0 18px 45px
            rgba(10,42,107,0.28);

          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .learning-content {
          position: relative;
          z-index: 2;

          width: 62%;
        }

        .learning-icon {
          width: 42px;
          height: 42px;

          margin-bottom: 16px;

          border-radius: 12px;

          background:
            rgba(255,122,26,0.18);

          color: var(--orange);

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-label {
          display: block;

          margin-bottom: 7px;

          color: #FFB680;

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 0.16em;
        }

        .learning-content h2 {
          margin: 0;

          color: #fff;

          font-size: 21px;
          line-height: 1.15;

          letter-spacing: -0.03em;
        }

        .learning-content p {
          margin:
            9px 0 17px;

          color: #C3D0EC;

          font-size: 11px;
          line-height: 1.55;
        }

        .primary-button {
          min-height: 42px;

          padding: 0 15px;

          border: 0;
          border-radius: 11px;

          background: var(--orange);
          color: #fff;

          display: inline-flex;
          align-items: center;
          gap: 8px;

          font-size: 11px;
          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 10px 22px
            rgba(255,122,26,0.4);

          transition: transform 160ms ease, background 160ms ease;
        }

        .primary-button:hover {
          background: #E86405;
          transform: translateY(-1px);
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
              rgba(255,255,255,0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.06) 1px,
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
          stroke: rgba(255,255,255,0.14);
          stroke-width: 1;
        }

        .chart-line {
          fill: none;

          stroke: var(--orange);

          stroke-width: 2.6;

          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .chart-point {
          fill: #fff;
          stroke: var(--orange);
          stroke-width: 2;

          filter:
            drop-shadow(
              0 0 8px
              rgba(255,122,26,0.9)
            );
        }

        .chart-tag {
          position: absolute;

          right: 17px;
          top: 19px;

          padding:
            5px 8px;

          border:
            1px solid
            rgba(255,255,255,0.25);

          border-radius: 6px;

          background:
            rgba(255,255,255,0.1);

          color: #fff;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 0.12em;
        }

        /* =========================
           SECTION
        ========================= */

        .section {
          margin-top: 34px;
        }

        .section-header {
          margin-bottom: 14px;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
        }

        .section-header span {
          display: block;

          margin-bottom: 4px;

          color: var(--orange-text);

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 0.17em;
        }

        .section-header h2 {
          margin: 0;

          color: var(--blue-800);

          font-size: 21px;

          letter-spacing: -0.035em;
        }

        .section-link {
          border: 0;
          background: var(--orange-soft);

          padding: 7px 10px;
          border-radius: 999px;

          color: var(--orange-text);

          display: flex;
          align-items: center;
          gap: 2px;

          font-size: 11px;
          font-weight: 800;

          cursor: pointer;
        }

        /* =========================
           MODULES
        ========================= */

        .module-list {
          display: grid;
          gap: 9px;
        }

        .module {
          width: 100%;

          min-height: 92px;

          padding: 13px;

          border:
            1px solid var(--line);

          border-left:
            4px solid var(--blue-700);

          border-radius: 17px;

          background: #fff;

          display: flex;
          align-items: center;
          gap: 12px;

          text-align: left;

          cursor: pointer;

          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            border-color 160ms ease;
        }

        .module:nth-child(even) {
          border-left-color: var(--orange);
        }

        .module:hover {
          transform: translateY(-2px);

          border-color:
            var(--orange);

          box-shadow:
            0 10px 26px
            rgba(10,42,107,0.1);
        }

        .module-number {
          width: 40px;
          height: 40px;

          flex: 0 0 auto;

          border-radius: 12px;

          background: var(--blue-100);

          color: var(--blue-800);

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 11px;
          font-weight: 900;
        }

        .module:nth-child(even) .module-number {
          background:
            var(--orange-soft);

          color:
            var(--orange-text);
        }

        .module-info {
          min-width: 0;
          flex: 1;
        }

        .module-info h3 {
          margin: 0;

          color: var(--ink);

          font-size: 13px;
          line-height: 1.3;

          font-weight: 800;
        }

        .module-info p {
          margin:
            4px 0;

          color: var(--muted);

          font-size: 11px;
          line-height: 1.45;
        }

        .lesson-count {
          display: block;

          color: var(--orange-text);

          font-size: 10px;
          font-weight: 800;
        }

        .module-arrow {
          flex: 0 0 auto;

          color: var(--muted-2);
        }

        /* =========================
           RESOURCE INFO
        ========================= */

        .resource-info-card {
          margin-top: 34px;

          padding: 18px;

          border:
            1px solid var(--line);

          border-radius: 19px;

          background: #fff;

          display: flex;
          gap: 13px;
        }

        .youtube-icon {
          width: 40px;
          height: 40px;

          flex: 0 0 auto;

          border-radius: 11px;

          background: var(--orange);

          color: #fff;

          display: flex;
          align-items: center;
          justify-content: center;

          box-shadow:
            0 8px 18px
            rgba(255,122,26,0.35);
        }

        .resource-info-card span {
          display: block;

          margin-bottom: 5px;

          color: var(--orange-text);

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 0.15em;
        }

        .resource-info-card h2 {
          margin: 0;

          color: var(--blue-800);

          font-size: 14px;
          line-height: 1.35;
        }

        .resource-info-card p {
          margin:
            7px 0 0;

          color: var(--muted);

          font-size: 11px;
          line-height: 1.55;
        }

        /* =========================
           SPACES
        ========================= */

        .space-card {
          margin-top: 12px;

          padding: 19px;

          border:
            1px solid var(--line);

          border-radius: 20px;

          background: #fff;

          display: flex;
          gap: 13px;
        }

        .space-icon {
          width: 42px;
          height: 42px;

          flex: 0 0 auto;

          border-radius: 12px;

          background: var(--blue-800);

          color: var(--orange);

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

          color: var(--orange-text);

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 0.15em;
        }

        .space-content h2 {
          margin: 0;

          color: var(--blue-800);

          font-size: 15px;
          line-height: 1.35;
        }

        .space-content p {
          margin:
            7px 0 12px;

          color: var(--muted);

          font-size: 11px;
          line-height: 1.55;
        }

        .space-content button {
          padding: 9px 13px;

          border: 0;
          border-radius: 10px;

          background: var(--blue-800);

          color: #fff;

          display: inline-flex;
          align-items: center;
          gap: 7px;

          font-size: 11px;
          font-weight: 800;

          cursor: pointer;

          transition: background 160ms ease;
        }

        .space-content button:hover {
          background: var(--orange);
        }

        .referral {
          border-color: rgba(255,122,26,0.4);

          background:
            linear-gradient(
              135deg,
              #ffffff,
              var(--orange-soft)
            );
        }

        .referral .space-icon {
          background: var(--orange);
          color: #fff;
        }

        .referral .space-content button {
          background: var(--orange);
        }

        .referral .space-content button:hover {
          background: #E86405;
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

          height: 70px;

          padding:
            7px
            max(10px, env(safe-area-inset-left))
            max(7px, env(safe-area-inset-bottom))
            max(10px, env(safe-area-inset-right));

          border-top:
            1px solid var(--line);

          background:
            rgba(255,255,255,0.96);

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

          color: var(--muted-2);

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 4px;

          cursor: pointer;
        }

        .bottom-nav button span {
          font-size: 9px;
          font-weight: 700;
        }

        .bottom-nav button.active {
          color: var(--blue-800);
        }

        .bottom-nav button.active svg {
          color: var(--orange);
        }

        .bottom-nav button.active::before {
          content: "";

          position: absolute;

          top: -7px;

          width: 24px;
          height: 3px;

          border-radius: 999px;

          background: var(--orange);
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

          .module-list {
            grid-template-columns: 1fr 1fr;
          }

          .bottom-nav {
            width: 620px;

            right: 50%;
            left: auto;

            transform:
              translateX(50%);

            bottom: 15px;

            border:
              1px solid var(--line);

            border-radius: 19px;

            box-shadow:
              0 15px 45px
              rgba(10,42,107,0.14);
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
            font-size: 27px;
          }

          .learning-card {
            min-height: 265px;
            padding: 18px;
          }

          .learning-content {
            width: 68%;
          }

          .learning-visual {
            width: 46%;
          }

          .learning-content h2 {
            font-size: 18px;
          }

          .module-info p {
            font-size: 10px;
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
