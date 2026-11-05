import {
  ArrowRight,
  BookOpen,
  Home as HomeIcon,
  Landmark,
  Play,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { TRACKS } from "../data/cursusData";

const TRACK_STYLE = {
  trading: { Icon: TrendingUp, cta: "Apprendre le trading" },
  brvm: { Icon: Landmark, cta: "Comprendre la BRVM" },
};

function Home() {
  const navigate = useNavigate();

  // Le cursus est ouvert directement : la page /cursus redirige vers la
  // connexion seulement si le client n'est pas encore connecté.
  const goCursus = () => navigate("/cursus");

  const tracks = TRACKS.map((track) => ({
    ...track,
    lessonCount: track.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    ),
  }));

  return (
    <div className="phi-app">
      <Navbar />

      <main className="app-main">
        {/* ===== ACCUEIL ===== */}

        <section className="welcome">
          <span className="welcome-label">PHI ACADEMY</span>

          <h1>
            Apprenez le <span>trading</span>
            <br />
            et la <b>BRVM</b>.
          </h1>

          <p>
            Deux parcours en vidéo, étape par étape, pour comprendre
            avant d'investir.
          </p>
        </section>

        {/* ===== LES DEUX PARCOURS ===== */}

        <section className="tracks">
          {tracks.map((track) => {
            const { Icon, cta } = TRACK_STYLE[track.id];

            return (
              <article
                key={track.id}
                className={`track-card ${track.id}`}
              >
                <div className="track-head">
                  <span className="track-icon">
                    <Icon size={24} />
                  </span>

                  <span className="track-count">
                    {track.modules.length} modules · {track.lessonCount}{" "}
                    vidéos
                  </span>
                </div>

                <h2>{track.label}</h2>

                <p>{track.tagline}</p>

                <ul className="track-topics">
                  {track.modules.slice(0, 4).map((module) => (
                    <li key={module.title}>{module.title}</li>
                  ))}

                  {track.modules.length > 4 && (
                    <li className="more">
                      +{track.modules.length - 4} autres
                    </li>
                  )}
                </ul>

                <button
                  type="button"
                  className="track-button"
                  onClick={goCursus}
                >
                  {cta}
                  <ArrowRight size={17} />
                </button>
              </article>
            );
          })}
        </section>

        {/* ===== COMMENT ÇA MARCHE ===== */}

        <section className="info-card">
          <div className="info-icon">
            <Play size={18} fill="currentColor" />
          </div>

          <div>
            <span>RESSOURCES</span>

            <h2>Des vidéos sélectionnées, dans un ordre logique.</h2>

            <p>
              Chaque module réunit des vidéos de formateurs différents,
              en français. Vous cochez ce que vous avez vu et vous
              reprenez quand vous voulez.
            </p>
          </div>
        </section>

        <section className="info-card warning">
          <div className="info-icon">
            <ShieldCheck size={19} />
          </div>

          <div>
            <span>À SAVOIR</span>

            <h2>Contenu informatif, pas de conseil financier.</h2>

            <p>
              Le trading comporte un risque de perte. Méfiez-vous de
              toute personne qui promet des gains garantis ou qui vous
              demande de lui confier de l'argent.
            </p>
          </div>
        </section>

        {/* ===== SERVICES ===== */}

        <section className="space-card">
          <div className="space-icon">
            <ShoppingBag size={21} />
          </div>

          <div className="space-content">
            <span>ESPACE SERVICES</span>

            <h2>Guides, formations et accompagnement.</h2>

            <p>Découvrez les services proposés par PHI Academy.</p>

            <button type="button" onClick={() => navigate("/services")}>
              Découvrir
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ===== PARRAINAGE ===== */}

        <section className="space-card referral">
          <div className="space-icon">
            <UsersRound size={21} />
          </div>

          <div className="space-content">
            <span>ESPACE PARRAINAGE</span>

            <h2>Développez votre réseau avec PHI Academy.</h2>

            <p>
              Retrouvez votre lien de parrainage, vos filleuls et vos
              commissions.
            </p>

            <button
              type="button"
              onClick={() => navigate("/connexion-parrainage")}
            >
              Mon parrainage
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* ===== MENU DU BAS (téléphone) ===== */}

      <nav className="bottom-nav">
        <button
          type="button"
          className="active"
          onClick={() => navigate("/")}
        >
          <HomeIcon size={20} />
          <span>Accueil</span>
        </button>

        <button type="button" onClick={goCursus}>
          <BookOpen size={20} />
          <span>Apprendre</span>
        </button>

        <button type="button" onClick={() => navigate("/services")}>
          <ShoppingBag size={20} />
          <span>Services</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/connexion-parrainage")}
        >
          <UsersRound size={20} />
          <span>Parrainage</span>
        </button>
      </nav>

      <style>{`
        .phi-app {
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
          --muted-2: #8794AD;
          --line: #DFE6F2;
          --bg: #F4F7FC;

          min-height: 100vh;
          min-height: 100dvh;
          background: var(--bg);
          color: var(--ink);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .phi-app *,
        .phi-app *::before,
        .phi-app *::after {
          box-sizing: border-box;
        }

        .phi-app button {
          font-family: inherit;
        }

        /* La barre du haut est fixe (68 px sur téléphone, 76 px ailleurs) */
        .app-main {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          padding: 92px 16px 110px;
        }

        /* ===== ACCUEIL ===== */

        .welcome {
          padding: 4px 2px 22px;
        }

        .welcome-label {
          display: inline-block;
          margin-bottom: 12px;
          padding: 6px 12px;
          border-radius: 999px;
          background: var(--orange-soft);
          color: var(--orange-text);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .15em;
        }

        .welcome h1 {
          margin: 0;
          color: var(--blue-800);
          font-size: clamp(32px, 8vw, 46px);
          line-height: 1.08;
          letter-spacing: -.045em;
          font-weight: 500;
        }

        .welcome h1 span {
          color: var(--blue-800);
          font-weight: 800;
        }

        .welcome h1 b {
          color: var(--orange);
          font-weight: 800;
        }

        .welcome p {
          max-width: 440px;
          margin: 14px 0 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
        }

        /* ===== LES DEUX PARCOURS ===== */

        .tracks {
          display: grid;
          gap: 14px;
        }

        .track-card {
          position: relative;
          overflow: hidden;
          padding: 22px;
          border-radius: 24px;
          color: #fff;
          box-shadow: 0 16px 38px rgba(10, 42, 102, .22);
        }

        .track-card.trading {
          background:
            radial-gradient(circle at 100% 0%, rgba(255,122,26,.3), transparent 50%),
            linear-gradient(135deg, var(--blue-900), var(--blue-800) 55%, var(--blue-700));
        }

        .track-card.brvm {
          background:
            radial-gradient(circle at 100% 0%, rgba(255,255,255,.18), transparent 50%),
            linear-gradient(135deg, #C85200, var(--orange-dark) 50%, #FF8F3D);
          box-shadow: 0 16px 38px rgba(232, 100, 5, .3);
        }

        .track-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 16px;
        }

        .track-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,.18);
          color: #fff;
        }

        .track-count {
          padding: 6px 11px;
          border-radius: 999px;
          background: rgba(255,255,255,.18);
          font-size: 12px;
          font-weight: 700;
        }

        .track-card h2 {
          margin: 0 0 6px;
          font-size: 26px;
          line-height: 1.1;
          letter-spacing: -.035em;
        }

        .track-card > p {
          margin: 0 0 16px;
          color: rgba(255,255,255,.88);
          font-size: 14px;
          line-height: 1.5;
        }

        .track-topics {
          list-style: none;
          margin: 0 0 20px;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .track-topics li {
          padding: 6px 11px;
          border-radius: 999px;
          background: rgba(255,255,255,.14);
          font-size: 12px;
          font-weight: 600;
        }

        .track-topics li.more {
          background: transparent;
          border: 1px dashed rgba(255,255,255,.45);
        }

        .track-button {
          width: 100%;
          min-height: 48px;
          border: 0;
          border-radius: 13px;
          background: #fff;
          color: var(--blue-800);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .16s ease;
        }

        .track-card.brvm .track-button {
          color: var(--orange-text);
        }

        .track-button:hover {
          transform: translateY(-1px);
        }

        /* ===== BLOCS D'INFORMATION ===== */

        .info-card {
          margin-top: 14px;
          padding: 18px;
          display: flex;
          gap: 14px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: #fff;
        }

        .info-card:first-of-type {
          margin-top: 26px;
        }

        .info-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: var(--blue-800);
          color: #fff;
        }

        .info-card.warning {
          border-left: 4px solid var(--orange);
        }

        .info-card.warning .info-icon {
          background: var(--orange-soft);
          color: var(--orange-text);
        }

        .info-card span {
          display: block;
          margin-bottom: 5px;
          color: var(--orange-text);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .info-card h2 {
          margin: 0;
          color: var(--blue-800);
          font-size: 16px;
          line-height: 1.35;
        }

        .info-card p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        /* ===== SERVICES & PARRAINAGE ===== */

        .space-card {
          margin-top: 14px;
          padding: 19px;
          display: flex;
          gap: 14px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: #fff;
        }

        .space-icon {
          width: 44px;
          height: 44px;
          flex: 0 0 auto;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: var(--blue-800);
          color: var(--orange);
        }

        .space-content {
          min-width: 0;
        }

        .space-content span {
          display: block;
          margin-bottom: 5px;
          color: var(--orange-text);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .space-content h2 {
          margin: 0;
          color: var(--blue-800);
          font-size: 17px;
          line-height: 1.35;
        }

        .space-content p {
          margin: 7px 0 14px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .space-content button {
          min-height: 42px;
          padding: 0 16px;
          border: 0;
          border-radius: 11px;
          background: var(--blue-800);
          color: #fff;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: background .16s ease;
        }

        .space-content button:hover {
          background: var(--orange);
        }

        .referral {
          border-color: rgba(255,122,26,.4);
          background: linear-gradient(135deg, #fff, var(--orange-soft));
        }

        .referral .space-icon {
          background: var(--orange);
          color: #fff;
        }

        .referral .space-content button {
          background: var(--orange);
        }

        .referral .space-content button:hover {
          background: var(--orange-dark);
        }

        /* ===== MENU DU BAS ===== */

        .bottom-nav {
          position: fixed;
          z-index: 100;
          right: 0;
          bottom: 0;
          left: 0;
          height: 70px;
          padding: 7px 10px max(7px, env(safe-area-inset-bottom));
          border-top: 1px solid var(--line);
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
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
          font-size: 11px;
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

        /* ===== TABLETTE / ORDINATEUR ===== */

        @media (min-width: 768px) {
          .app-main {
            padding-top: 116px;
          }

          .tracks {
            grid-template-columns: 1fr 1fr;
          }

          .bottom-nav {
            display: none;
          }

          .app-main {
            padding-bottom: 70px;
          }
        }

        @media (max-width: 520px) {
          .app-main {
            padding-top: 84px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .phi-app *,
          .phi-app *::before,
          .phi-app *::after {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
