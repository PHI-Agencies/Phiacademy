import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  ExternalLink,
  LockKeyhole,
  Menu,
  Play,
  ShieldCheck,
  X,
} from "lucide-react";

function Cursus() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    {
      number: "01",
      title: "Comprendre le trading",
      description:
        "Découvrir les bases du trading et comprendre le fonctionnement des marchés.",
      lessons: [
        "Qu'est-ce que le trading ?",
        "Comment fonctionne un marché ?",
        "Les différents marchés",
      ],
      resources: [ { url: "https://youtu.be/iWqYXlVwAR8?si=srV3l_fU7A62YMEw" },  ],
    },
    {
      number: "02",
      title: "Lire un graphique",
      description:
        "Apprendre à observer et interpréter les principaux éléments d'un graphique.",
      lessons: [
        "Les chandeliers japonais",
        "Supports et résistances",
        "Les unités de temps",
      ],
      resources: [],
    },
    {
      number: "03",
      title: "Analyse technique SMC",
      description:
        "Explorer les notions essentielles liées à la structure du marché et à la liquidité.",
      lessons: [
        "Structure du marché",
        "Liquidité et zones d'intérêt",
        "Order Blocks et déséquilibres",
      ],
      resources: [],
    },
    {
      number: "04",
      title: "Price Action",
      description:
        "Comprendre les réactions du prix et les principales configurations observables sur les graphiques.",
      lessons: [
        "Structure du marché",
        "Zones de réaction",
        "Configurations de prix",
      ],
      resources: [],
    },
    {
      number: "05",
      title: "Gestion du risque",
      description:
        "Comprendre comment protéger son capital et construire une approche disciplinée.",
      lessons: [
        "Risque par position",
        "Stop Loss",
        "Ratio risque / rendement",
      ],
      resources: [],
    },
    {
      number: "06",
      title: "Psychologie du trader",
      description:
        "Découvrir les principes essentiels de discipline et de maîtrise émotionnelle.",
      lessons: [
        "Les émotions",
        "La discipline",
        "Construire une routine",
      ],
      resources: [],
    },
  ];

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      try {
        const response = await fetch("/api/cursus/access", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/connexion-cursus?redirect=/cursus", {
              replace: true,
            });
            return;
          }

          if (response.status === 403) {
            navigate("/connexion-cursus?payment=required", {
              replace: true,
            });
            return;
          }

          throw new Error(
            data.message || "Impossible de vérifier l'accès."
          );
        }

        setAuthorized(true);
        setUser(data.user || null);
      } catch (error) {
        if (cancelled) return;

        console.error("Erreur de vérification :", error);

        navigate("/connexion-cursus", {
          replace: true,
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const currentModule = modules[activeModule];

  const openResource = (url) => {
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="cursus-loading">
        <div className="loading-logo">
          <img src="/images/logo/phi-logo.png" alt="PHI Academy" />
        </div>

        <div className="loading-spinner" />

        <p>Vérification de votre accès...</p>

        <style>{`
          .cursus-loading {
            min-height: 100vh;
            min-height: 100dvh;
            background: #f7f8fa;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18px;
            color: #0b132b;
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          .loading-logo {
            width: 58px;
            height: 58px;
            border-radius: 16px;
            overflow: hidden;
            background: #0b132b;
            box-shadow: 0 12px 35px rgba(11, 19, 43, 0.16);
          }

          .loading-logo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .loading-spinner {
            width: 24px;
            height: 24px;
            border: 2px solid rgba(11, 19, 43, 0.12);
            border-top-color: #d4af37;
            border-radius: 50%;
            animation: cursusSpin .8s linear infinite;
          }

          .cursus-loading p {
            margin: 0;
            font-size: 13px;
            color: #6b7280;
          }

          @keyframes cursusSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="cursus-page">
      <header className="cursus-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-logo">
              <img src="/images/logo/phi-logo.png" alt="PHI Academy" />
            </span>

            <span className="brand-text">
              <strong>PHI</strong>
              <span>Academy</span>
            </span>
          </Link>

          <nav className="desktop-nav">
            <Link to="/">Accueil</Link>

            <Link to="/cursus" className="active">
              Cursus
            </Link>

            <Link to="/services">Services</Link>

            <Link to="/connexion-parrainage?redirect=/parrainage">
              Parrainage
            </Link>
          </nav>

          <div className="desktop-account">
            <span className="account-name">
              {user?.firstName || "Membre"}
            </span>

            <span className="active-dot" />
          </div>

          <button
            type="button"
            className={`mobile-menu-button ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-menu">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Accueil
            </Link>

            <Link
              to="/cursus"
              className="selected"
              onClick={() => setMenuOpen(false)}
            >
              Cursus
            </Link>

            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </Link>

            <Link
              to="/connexion-parrainage?redirect=/parrainage"
              onClick={() => setMenuOpen(false)}
            >
              Parrainage
            </Link>
          </nav>
        </div>
      )}

      <main>
        <section className="cursus-intro">
          <div className="intro-inner">
            <Link to="/" className="back-link">
              <ArrowLeft size={16} />
              Retour
            </Link>

            <div className="intro-copy">
              <div className="eyebrow">
                <BookOpen size={15} />
                ESPACE APPRENTISSAGE
              </div>

              <h1>
                Apprenez.
                <br />
                <span>Comprenez.</span>
                <br />
                Construisez votre méthode.
              </h1>

              <p>
                Un parcours organisé autour de ressources sélectionnées
                auprès de créateurs et formateurs spécialisés dans le trading.
              </p>
            </div>

            <div className="access-badge">
              <ShieldCheck size={16} />
              Accès membre actif
            </div>
          </div>
        </section>

        <section className="market-visual-section">
          <div className="market-card">
            <div className="market-top">
              <div>
                <span className="market-label">PHI ACADEMY</span>
                <strong>Learning Space</strong>
              </div>

              <div className="market-status">
                <span />
                Formation
              </div>
            </div>

            <div className="chart-area">
              <div className="chart-grid grid-one" />
              <div className="chart-grid grid-two" />
              <div className="chart-grid grid-three" />

              <svg
                className="chart-line"
                viewBox="0 0 800 220"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 184 C55 171, 72 184, 108 156 S164 144, 197 153 S240 120, 278 130 S326 96, 360 111 S405 103, 438 82 S487 96, 515 68 S562 82, 596 48 S645 61, 681 34 S726 48, 800 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <div className="chart-label chart-label-one">
                STRUCTURE
              </div>

              <div className="chart-label chart-label-two">
                PRICE ACTION
              </div>

              <div className="chart-label chart-label-three">
                RISK
              </div>
            </div>
          </div>
        </section>

        <section className="learning-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">VOTRE CURSUS</span>

              <h2>
                Les fondamentaux
                <br />
                <span>du trading.</span>
              </h2>
            </div>

            <p>
              Explorez librement les différents modules et ouvrez les
              ressources qui vous intéressent.
            </p>
          </div>

          <div className="learning-layout">
            <div className="module-list">
              {modules.map((module, index) => {
                const isActive = index === activeModule;

                return (
                  <button
                    key={module.number}
                    type="button"
                    className={`module-item ${isActive ? "active" : ""}`}
                    onClick={() => setActiveModule(index)}
                  >
                    <span className="module-number">
                      {module.number}
                    </span>

                    <span className="module-main">
                      <strong>{module.title}</strong>

                      <small>
                        {module.lessons.length} ressources
                      </small>
                    </span>

                    <ChevronRight
                      size={18}
                      className="module-arrow"
                    />
                  </button>
                );
              })}
            </div>

            <div className="module-detail">
              <div className="detail-header">
                <div>
                  <span className="detail-number">
                    MODULE {currentModule.number}
                  </span>

                  <h3>{currentModule.title}</h3>

                  <p>{currentModule.description}</p>
                </div>

                <div className="detail-icon">
                  <BookOpen size={22} />
                </div>
              </div>

              <div className="lesson-list">
                {currentModule.lessons.map((lesson, index) => {
                  const resource = currentModule.resources[index];

                  return (
                    <div className="lesson-card" key={lesson}>
                      <div className="lesson-index">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="lesson-content">
                        <strong>{lesson}</strong>

                        <span>
                          {resource
                            ? "Ressource vidéo sélectionnée"
                            : "Ressource à venir"}
                        </span>
                      </div>

                      {resource ? (
                        <button
                          type="button"
                          className="lesson-action"
                          onClick={() =>
                            openResource(resource.url)
                          }
                          aria-label={`Ouvrir ${lesson}`}
                        >
                          <Play size={16} />
                        </button>
                      ) : (
                        <span className="lesson-lock">
                          <LockKeyhole size={15} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="resource-note">
                <ExternalLink size={16} />

                <p>
                  Les vidéos proposées sont hébergées sur leurs plateformes
                  d'origine. PHI Academy organise et sélectionne les
                  ressources, sans héberger les vidéos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bottom-information">
          <div className="information-card">
            <div className="information-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <strong>Un espace d'apprentissage simple</strong>

              <p>
                Aucun suivi de progression. Aucun niveau imposé. Vous
                choisissez librement les modules et les ressources que vous
                souhaitez consulter.
              </p>
            </div>
          </div>

          <Link to="/services" className="services-link">
            Découvrir les services
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </main>

      <nav className="mobile-bottom-nav">
        <Link to="/">
          <span>Accueil</span>
        </Link>

        <Link to="/cursus" className="current">
          <BookOpen size={19} />
          <span>Cursus</span>
        </Link>

        <Link to="/services">
          <span>Services</span>
        </Link>

        <Link to="/connexion-parrainage?redirect=/parrainage">
          <span>Parrainage</span>
        </Link>
      </nav>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .cursus-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: #f7f8fa;
          color: #0b132b;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding-bottom: 0;
        }

        .cursus-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(11,19,43,0.07);
        }

        .header-inner {
          width: min(1180px, calc(100% - 32px));
          min-height: 72px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #0b132b;
        }

        .brand-logo {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          overflow: hidden;
          background: #0b132b;
          flex: 0 0 auto;
        }

        .brand-logo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .brand-text {
          display: flex;
          align-items: baseline;
          gap: 4px;
          letter-spacing: -0.03em;
        }

        .brand-text strong {
          font-size: 17px;
          font-weight: 800;
        }

        .brand-text span {
          font-size: 15px;
          font-weight: 500;
          color: #7a808c;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .desktop-nav a {
          position: relative;
          padding: 9px 13px;
          color: #69707d;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 10px;
          transition: 0.2s ease;
        }

        .desktop-nav a:hover {
          color: #0b132b;
          background: #f2f3f5;
        }

        .desktop-nav a.active {
          color: #0b132b;
        }

        .desktop-nav a.active::after {
          content: "";
          position: absolute;
          left: 13px;
          right: 13px;
          bottom: 3px;
          height: 2px;
          border-radius: 999px;
          background: #d4af37;
        }

        .desktop-account {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 100px;
          justify-content: flex-end;
        }

        .account-name {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #4d5563;
          font-size: 12px;
          font-weight: 600;
        }

        .active-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #31a46c;
          box-shadow: 0 0 0 4px rgba(49,164,108,0.1);
        }

        .mobile-menu-button {
          display: none;
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 12px;
          background: #f1f2f4;
          color: #0b132b;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-menu-overlay {
          display: none;
        }

        .cursus-intro {
          background: #fff;
          border-bottom: 1px solid rgba(11,19,43,0.06);
        }

        .intro-inner {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 56px 0 58px;
          position: relative;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #777e89;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 36px;
          transition: color .2s ease;
        }

        .back-link:hover {
          color: #0b132b;
        }

        .intro-copy {
          max-width: 720px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #a17e16;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .13em;
          margin-bottom: 15px;
        }

        .intro-copy h1 {
          margin: 0;
          font-size: clamp(38px, 6vw, 70px);
          line-height: .99;
          letter-spacing: -.055em;
          font-weight: 800;
        }

        .intro-copy h1 span {
          color: #d4af37;
        }

        .intro-copy p {
          max-width: 610px;
          margin: 24px 0 0;
          color: #68707d;
          font-size: 15px;
          line-height: 1.7;
        }

        .access-badge {
          position: absolute;
          right: 0;
          bottom: 58px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 12px;
          border-radius: 999px;
          background: #f2f8f5;
          color: #267a53;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid rgba(38,122,83,0.09);
        }

        .market-visual-section {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 28px 0 0;
        }

        .market-card {
          position: relative;
          overflow: hidden;
          min-height: 300px;
          border-radius: 28px;
          padding: 26px;
          background:
            radial-gradient(circle at 85% 15%, rgba(212,175,55,.13), transparent 27%),
            linear-gradient(135deg, #0b132b, #111c39);
          color: white;
          box-shadow: 0 24px 60px rgba(11,19,43,.13);
        }

        .market-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .market-label {
          display: block;
          color: rgba(255,255,255,.45);
          font-size: 9px;
          letter-spacing: .16em;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .market-top strong {
          font-size: 17px;
          letter-spacing: -.02em;
        }

        .market-status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,.65);
          font-size: 10px;
          font-weight: 600;
        }

        .market-status span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4fc38a;
          box-shadow: 0 0 0 4px rgba(79,195,138,.1);
        }

        .chart-area {
          position: absolute;
          left: 26px;
          right: 26px;
          bottom: 28px;
          height: 175px;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,.07);
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .chart-grid {
          position: absolute;
          inset: 0;
          opacity: .45;
          background-image: linear-gradient(
            to right,
            rgba(255,255,255,.045) 1px,
            transparent 1px
          );
          background-size: 12.5% 100%;
        }

        .grid-two {
          background-image: linear-gradient(
            to bottom,
            rgba(255,255,255,.045) 1px,
            transparent 1px
          );
          background-size: 100% 25%;
        }

        .grid-three {
          opacity: .2;
        }

        .chart-line {
          position: absolute;
          inset: 15px 0;
          width: 100%;
          height: calc(100% - 30px);
          color: #d4af37;
          filter: drop-shadow(0 4px 10px rgba(212,175,55,.18));
        }

        .chart-label {
          position: absolute;
          padding: 5px 8px;
          border-radius: 6px;
          background: rgba(255,255,255,.06);
          color: rgba(255,255,255,.55);
          font-size: 8px;
          letter-spacing: .08em;
          font-weight: 700;
        }

        .chart-label-one {
          left: 13%;
          bottom: 22%;
        }

        .chart-label-two {
          left: 49%;
          bottom: 49%;
        }

        .chart-label-three {
          right: 8%;
          top: 17%;
        }

        .learning-section {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 80px 0 40px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 34px;
        }

        .section-kicker {
          display: block;
          color: #a17e16;
          font-size: 10px;
          letter-spacing: .15em;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .section-heading h2 span {
          color: #d4af37;
        }

        .section-heading > p {
          max-width: 390px;
          margin: 0;
          color: #707783;
          font-size: 13px;
          line-height: 1.7;
        }

        .learning-layout {
          display: grid;
          grid-template-columns: 330px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .module-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .module-item {
          width: 100%;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 20px;
          align-items: center;
          gap: 10px;
          padding: 15px 14px;
          border: 1px solid rgba(11,19,43,.07);
          border-radius: 15px;
          background: #fff;
          color: #0b132b;
          text-align: left;
          cursor: pointer;
          transition:
            transform .2s ease,
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .module-item:hover {
          transform: translateY(-1px);
          border-color: rgba(212,175,55,.32);
        }

        .module-item.active {
          border-color: rgba(212,175,55,.48);
          box-shadow: 0 12px 30px rgba(11,19,43,.07);
          background: #fffdf6;
        }

        .module-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 10px;
          background: #f2f3f5;
          color: #777e89;
          font-size: 10px;
          font-weight: 800;
        }

        .module-item.active .module-number {
          background: #0b132b;
          color: #d4af37;
        }

        .module-main {
          min-width: 0;
        }

        .module-main strong {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 750;
        }

        .module-main small {
          display: block;
          margin-top: 4px;
          color: #9298a2;
          font-size: 10px;
        }

        .module-arrow {
          color: #a4a9b1;
          transition: transform .2s ease;
        }

        .module-item.active .module-arrow {
          color: #d4af37;
          transform: translateX(2px);
        }

        .module-detail {
          min-width: 0;
          padding: 25px;
          border-radius: 22px;
          background: #fff;
          border: 1px solid rgba(11,19,43,.07);
          box-shadow: 0 15px 40px rgba(11,19,43,.045);
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 23px;
          border-bottom: 1px solid #edf0f2;
        }

        .detail-number {
          color: #a17e16;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .13em;
        }

        .detail-header h3 {
          margin: 7px 0 8px;
          font-size: 25px;
          letter-spacing: -.035em;
        }

        .detail-header p {
          max-width: 580px;
          margin: 0;
          color: #777e89;
          font-size: 12px;
          line-height: 1.65;
        }

        .detail-icon {
          width: 45px;
          height: 45px;
          flex: 0 0 auto;
          border-radius: 14px;
          background: #0b132b;
          color: #d4af37;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lesson-list {
          padding-top: 10px;
        }

        .lesson-card {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 68px;
          padding: 10px 2px;
          border-bottom: 1px solid #f0f1f3;
        }

        .lesson-card:last-child {
          border-bottom: 0;
        }

        .lesson-index {
          width: 30px;
          flex: 0 0 auto;
          color: #a0a5ad;
          font-size: 9px;
          font-weight: 800;
        }

        .lesson-content {
          flex: 1;
          min-width: 0;
        }

        .lesson-content strong {
          display: block;
          color: #202838;
          font-size: 12px;
          line-height: 1.4;
        }

        .lesson-content span {
          display: block;
          margin-top: 3px;
          color: #9a9fa8;
          font-size: 9px;
        }

        .lesson-action,
        .lesson-lock {
          width: 34px;
          height: 34px;
          flex: 0 0 auto;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lesson-action {
          border: 0;
          background: #0b132b;
          color: #fff;
          cursor: pointer;
          transition: transform .2s ease, background .2s ease;
        }

        .lesson-action:hover {
          transform: scale(1.05);
          background: #172443;
        }

        .lesson-lock {
          background: #f3f4f5;
          color: #a4a9b1;
        }

        .resource-note {
          margin-top: 17px;
          padding: 12px 13px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          border-radius: 11px;
          background: #f7f8fa;
          color: #8a9099;
        }

        .resource-note svg {
          flex: 0 0 auto;
          margin-top: 1px;
          color: #a17e16;
        }

        .resource-note p {
          margin: 0;
          font-size: 9px;
          line-height: 1.6;
        }

        .bottom-information {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 20px 0 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .information-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          max-width: 690px;
        }

        .information-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 auto;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px solid rgba(11,19,43,.07);
          color: #a17e16;
        }

        .information-card strong {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
        }

        .information-card p {
          margin: 0;
          color: #858b95;
          font-size: 11px;
          line-height: 1.6;
        }

        .services-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex: 0 0 auto;
          color: #0b132b;
          text-decoration: none;
          font-size: 11px;
          font-weight: 750;
        }

        .services-link:hover {
          color: #a17e16;
        }

        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 900px) {
          .desktop-nav,
          .desktop-account {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-menu-overlay {
            position: fixed;
            display: block;
            z-index: 90;
            inset: 72px 0 0;
            background: rgba(11,19,43,.18);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
          }

          .mobile-menu {
            padding: 12px 16px 20px;
            background: #fff;
            border-bottom: 1px solid rgba(11,19,43,.08);
            box-shadow: 0 20px 40px rgba(11,19,43,.12);
          }

          .mobile-menu a {
            display: flex;
            align-items: center;
            min-height: 50px;
            padding: 0 12px;
            color: #4f5663;
            text-decoration: none;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 650;
          }

          .mobile-menu a.selected {
            color: #0b132b;
            background: #f7f4e9;
          }

          .learning-layout {
            grid-template-columns: 1fr;
          }

          .module-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0,1fr));
          }

          .module-detail {
            margin-top: 2px;
          }

          .access-badge {
            position: static;
            margin-top: 30px;
          }

          .bottom-information {
            padding-bottom: 100px;
          }

          .mobile-bottom-nav {
            position: fixed;
            z-index: 110;
            left: 12px;
            right: 12px;
            bottom: 12px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
            padding: 7px;
            border: 1px solid rgba(11,19,43,.08);
            border-radius: 18px;
            background: rgba(255,255,255,.94);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            box-shadow: 0 14px 35px rgba(11,19,43,.15);
          }

          .mobile-bottom-nav a {
            min-height: 47px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            border-radius: 12px;
            color: #858b95;
            text-decoration: none;
            font-size: 8px;
            font-weight: 700;
          }

          .mobile-bottom-nav a.current {
            color: #0b132b;
            background: #f6f2e5;
          }
        }

        @media (max-width: 600px) {
          .cursus-page {
            padding-bottom: 80px;
          }

          .header-inner,
          .intro-inner,
          .market-visual-section,
          .learning-section,
          .bottom-information {
            width: min(100% - 28px, 1180px);
          }

          .header-inner {
            min-height: 62px;
          }

          .mobile-menu-overlay {
            inset: 62px 0 0;
          }

          .brand-logo {
            width: 35px;
            height: 35px;
            border-radius: 11px;
          }

          .brand-text strong {
            font-size: 16px;
          }

          .brand-text span {
            font-size: 14px;
          }

          .intro-inner {
            padding: 28px 0 30px;
          }

          .back-link {
            margin-bottom: 28px;
          }

          .intro-copy h1 {
            font-size: 40px;
            line-height: .99;
          }

          .intro-copy p {
            margin-top: 17px;
            font-size: 13px;
            line-height: 1.65;
          }

          .access-badge {
            margin-top: 22px;
            font-size: 10px;
          }

          .market-visual-section {
            padding-top: 15px;
          }

          .market-card {
            min-height: 220px;
            border-radius: 21px;
            padding: 18px;
          }

          .market-top strong {
            font-size: 14px;
          }

          .market-status {
            font-size: 9px;
          }

          .chart-area {
            left: 18px;
            right: 18px;
            bottom: 18px;
            height: 125px;
          }

          .chart-label {
            font-size: 7px;
            padding: 4px 6px;
          }

          .learning-section {
            padding-top: 55px;
          }

          .section-heading {
            display: block;
            margin-bottom: 23px;
          }

          .section-heading h2 {
            font-size: 34px;
          }

          .section-heading > p {
            margin-top: 14px;
            font-size: 12px;
          }

          .module-list {
            display: flex;
            overflow-x: auto;
            flex-direction: row;
            gap: 8px;
            padding-bottom: 4px;
            margin-right: -14px;
            padding-right: 14px;
            scrollbar-width: none;
          }

          .module-list::-webkit-scrollbar {
            display: none;
          }

          .module-item {
            min-width: 235px;
            grid-template-columns: 36px minmax(0,1fr) 18px;
            padding: 12px;
            border-radius: 14px;
          }

          .module-number {
            width: 32px;
            height: 32px;
            border-radius: 9px;
          }

          .module-main strong {
            font-size: 11px;
          }

          .module-main small {
            font-size: 9px;
          }

          .module-detail {
            padding: 18px;
            border-radius: 18px;
          }

          .detail-header {
            gap: 12px;
            padding-bottom: 17px;
          }

          .detail-header h3 {
            font-size: 21px;
          }

          .detail-header p {
            font-size: 11px;
          }

          .detail-icon {
            width: 38px;
            height: 38px;
            border-radius: 11px;
          }

          .lesson-card {
            min-height: 62px;
            gap: 10px;
          }

          .lesson-content strong {
            font-size: 11px;
          }

          .lesson-content span {
            font-size: 8px;
          }

          .lesson-action,
          .lesson-lock {
            width: 31px;
            height: 31px;
          }

          .resource-note {
            margin-top: 13px;
          }

          .bottom-information {
            display: block;
            padding-top: 10px;
            padding-bottom: 20px;
          }

          .information-card {
            gap: 9px;
          }

          .information-icon {
            width: 34px;
            height: 34px;
            border-radius: 9px;
          }

          .information-card strong {
            font-size: 11px;
          }

          .information-card p {
            font-size: 10px;
          }

          .services-link {
            margin-top: 20px;
          }
        }

        @media (max-width: 380px) {
          .intro-copy h1 {
            font-size: 36px;
          }

          .section-heading h2 {
            font-size: 31px;
          }

          .module-item {
            min-width: 220px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Cursus;
