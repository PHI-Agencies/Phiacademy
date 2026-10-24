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
      resources: [
        { url: "https://youtu.be/iWqYXlVwAR8?si=srV3l_fU7A62YMEw" }, // Pour "Qu'est-ce que le trading ?"
        { url: "https://youtu.be/IoLaFOfkOEo?si=bB0MJfqnUs5rjJhK" }, // Pour "Comment fonctionne un marché ?"
        { url: "https://youtu.be/chrIBc2W9Sc?si=AJMGvsKcga5EaHyA" }, // Pour "Les différents marchés"
      ],
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
      resources: [
        { url: "https://youtu.be/Lfz9DVjpYxw?si=XoRCFsLDNFoYCO4U" }, // Pour "Les chandeliers japonais"
        { url: "https://youtu.be/BF7DFCoJOOU?si=xp3gYXRy-PZ-BtaO" }, // Pour "Supports et résistances"
        { url: "https://youtu.be/wfEFT-VHmmE?si=krWw6e3rZ50H6oJJ" }, // Pour "Les unités de temps"
      ]
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
      resources: [
        { url: "https://youtu.be/g0LpGYJzsxo?si=i3G3l9ylbpOmP8rR" }, // Pour "Structure du marché"
        { url: "https://youtu.be/NBhrad-MM-U?si=IMuIU_5fp8sPG5Dk" }, // Pour "Liquidité et zones d'intérêt"
        { url: "https://youtu.be/vNK17ziTvYg?si=S4pyKidZpZkrJEhi" }, // Pour "Order Blocks et déséquilibres"
      ],
    },
    {
      number: "04",
      title: "Price Action",
      description:
        "Comprendre les réactions du prix et les principales configurations observables sur les graphiques.",
      lessons: [
        "Structure du marché",
        "Zones de réaction",
        "Confirmations importantes",
      ],
      resources: [
        { url: "https://youtu.be/29Q58Gpf3Hs?si=OCEx_dP0VH-L9oZL" }, // Pour "Structure du marché"
        { url: "https://youtu.be/jPo7VRTd9zg?si=OLwPo8RrF1SMbPVb" }, // Pour "Zones de réaction"
        { url: "https://youtu.be/82chDLfWHWM?si=Z-ortngcG7wYyH9p" }, // Pour "Configurations de prix"
      ],
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
      resources: [
        { url: "https://youtu.be/4tkqx2LKd7g?si=yjzLBtsia_pzdbYQ" }, // Pour "Risque par position"
        { url: "https://youtu.be/VWXqhaVez08?si=E792auhHqmYq_-Kj" }, // Pour "Stop Loss"
        { url: "https://youtu.be/yTcPWkjt1-8?si=HjBkN1CtJVBeQvr2" }, // Pour "Ratio risque / rendement"
      ],
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
      resources: [
        { url: "https://youtu.be/iWqYXlVwAR8?si=srV3l_fU7A62YMEw" },
        { url: "https://youtu.be/IoLaFOfkOEo?si=bB0MJfqnUs5rjJhK" },
        { url: "https://youtu.be/chrIBc2W9Sc?si=AJMGvsKcga5EaHyA" },
      ],
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
        <div className="loading-wordmark">
          PHI <span>ACADEMY</span>
        </div>

        <div className="loading-spinner" />

        <p>Vérification de votre accès...</p>

        <style>{`
          .cursus-loading {
            min-height: 100vh;
            min-height: 100dvh;
            background: #F4F7FC;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18px;
            color: #0A2A66;
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          .loading-logo {
            width: 58px;
            height: 58px;
            border-radius: 16px;
            overflow: hidden;
            background: #0A2A66;
            border: 2px solid #FF7A1A;
            box-shadow: 0 12px 35px rgba(10, 42, 102, 0.22);
          }

          .loading-logo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .loading-wordmark {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #0A2A66;
          }

          .loading-wordmark span {
            color: #FF7A1A;
          }

          .loading-spinner {
            width: 26px;
            height: 26px;
            border: 3px solid rgba(10, 42, 102, 0.12);
            border-top-color: #FF7A1A;
            border-radius: 50%;
            animation: cursusSpin .8s linear infinite;
          }

          .cursus-loading p {
            margin: 0;
            font-size: 13px;
            color: #5F6E8A;
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
            <span className="brand-text">
              <strong>PHI</strong>
              <span>ACADEMY</span>
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
        /* =========================
           PALETTE : BLEU • BLANC • ORANGE
        ========================= */

        .cursus-page {
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
        }

        * {
          box-sizing: border-box;
        }

        .cursus-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--bg);
          color: var(--ink);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding-bottom: 0;
        }

        .cursus-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid var(--line);
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
          color: var(--blue-800);
        }

        .brand-logo {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          overflow: hidden;
          background: var(--blue-800);
          border: 2px solid var(--orange);
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
          color: var(--blue-800);
        }

        .brand-text span {
          font-size: 15px;
          font-weight: 600;
          color: var(--orange-text);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .desktop-nav a {
          position: relative;
          padding: 9px 13px;
          color: var(--muted);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 10px;
          transition: 0.2s ease;
        }

        .desktop-nav a:hover {
          color: var(--blue-800);
          background: var(--blue-50);
        }

        .desktop-nav a.active {
          color: var(--blue-800);
          font-weight: 800;
        }

        .desktop-nav a.active::after {
          content: "";
          position: absolute;
          left: 13px;
          right: 13px;
          bottom: 3px;
          height: 3px;
          border-radius: 999px;
          background: var(--orange);
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
          color: var(--blue-800);
          font-size: 12px;
          font-weight: 700;
        }

        .active-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1FAE63;
          box-shadow: 0 0 0 4px rgba(31,174,99,0.14);
        }

        .mobile-menu-button {
          display: none;
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 12px;
          background: var(--blue-50);
          color: var(--blue-800);
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-menu-overlay {
          display: none;
        }

        /* ===== INTRO ===== */

        .cursus-intro {
          background:
            radial-gradient(700px 300px at 100% 0%, rgba(255,122,26,0.12), transparent 60%),
            #fff;
          border-bottom: 1px solid var(--line);
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
          color: var(--muted);
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 36px;
          transition: color .2s ease;
        }

        .back-link:hover {
          color: var(--orange-text);
        }

        .intro-copy {
          max-width: 720px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          background: var(--orange-soft);
          color: var(--orange-text);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .13em;
          margin-bottom: 16px;
        }

        .intro-copy h1 {
          margin: 0;
          color: var(--blue-800);
          font-size: clamp(38px, 6vw, 70px);
          line-height: 1;
          letter-spacing: -.055em;
          font-weight: 800;
        }

        .intro-copy h1 span {
          color: var(--orange);
        }

        .intro-copy p {
          max-width: 610px;
          margin: 24px 0 0;
          color: var(--muted);
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
          padding: 9px 13px;
          border-radius: 999px;
          background: #EAF8F0;
          color: #167A48;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid rgba(22,122,72,0.15);
        }

        /* ===== CARTE VISUELLE ===== */

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
            radial-gradient(circle at 85% 15%, rgba(255,122,26,.28), transparent 32%),
            linear-gradient(135deg, var(--blue-900), var(--blue-800) 60%, var(--blue-700));
          color: white;
          box-shadow: 0 24px 60px rgba(10,42,102,.25);
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
          color: #FFB680;
          font-size: 10px;
          letter-spacing: .16em;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .market-top strong {
          font-size: 18px;
          letter-spacing: -.02em;
        }

        .market-status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,.8);
          font-size: 11px;
          font-weight: 600;
        }

        .market-status span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4fe09a;
          box-shadow: 0 0 0 4px rgba(79,224,154,.15);
        }

        .chart-area {
          position: absolute;
          left: 26px;
          right: 26px;
          bottom: 28px;
          height: 175px;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,.12);
          border-bottom: 1px solid rgba(255,255,255,.12);
        }

        .chart-grid {
          position: absolute;
          inset: 0;
          opacity: .6;
          background-image: linear-gradient(
            to right,
            rgba(255,255,255,.07) 1px,
            transparent 1px
          );
          background-size: 12.5% 100%;
        }

        .grid-two {
          background-image: linear-gradient(
            to bottom,
            rgba(255,255,255,.07) 1px,
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
          color: var(--orange);
          filter: drop-shadow(0 4px 12px rgba(255,122,26,.45));
        }

        .chart-label {
          position: absolute;
          padding: 5px 8px;
          border-radius: 6px;
          background: rgba(255,255,255,.12);
          color: rgba(255,255,255,.85);
          font-size: 9px;
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

        /* ===== MODULES ===== */

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
          color: var(--orange-text);
          font-size: 11px;
          letter-spacing: .15em;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .section-heading h2 {
          margin: 0;
          color: var(--blue-800);
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .section-heading h2 span {
          color: var(--orange);
        }

        .section-heading > p {
          max-width: 390px;
          margin: 0;
          color: var(--muted);
          font-size: 14px;
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
          gap: 8px;
        }

        .module-item {
          width: 100%;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 20px;
          align-items: center;
          gap: 10px;
          padding: 15px 14px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: #fff;
          color: var(--ink);
          text-align: left;
          cursor: pointer;
          transition:
            transform .2s ease,
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .module-item:hover {
          transform: translateY(-1px);
          border-color: rgba(255,122,26,.5);
        }

        .module-item.active {
          border-color: var(--orange);
          box-shadow: 0 12px 30px rgba(10,42,102,.12);
          background: #FFF8F2;
        }

        .module-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--blue-100);
          color: var(--blue-800);
          font-size: 11px;
          font-weight: 800;
        }

        .module-item.active .module-number {
          background: var(--blue-800);
          color: var(--orange);
        }

        .module-main {
          min-width: 0;
        }

        .module-main strong {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 800;
          color: var(--blue-800);
        }

        .module-main small {
          display: block;
          margin-top: 4px;
          color: var(--muted-2);
          font-size: 11px;
        }

        .module-arrow {
          color: var(--muted-2);
          transition: transform .2s ease;
        }

        .module-item.active .module-arrow {
          color: var(--orange);
          transform: translateX(2px);
        }

        .module-detail {
          min-width: 0;
          padding: 25px;
          border-radius: 22px;
          background: #fff;
          border: 1px solid var(--line);
          border-top: 4px solid var(--orange);
          box-shadow: 0 15px 40px rgba(10,42,102,.07);
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 23px;
          border-bottom: 1px solid var(--line);
        }

        .detail-number {
          color: var(--orange-text);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .13em;
        }

        .detail-header h3 {
          margin: 7px 0 8px;
          color: var(--blue-800);
          font-size: 26px;
          letter-spacing: -.035em;
        }

        .detail-header p {
          max-width: 580px;
          margin: 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .detail-icon {
          width: 46px;
          height: 46px;
          flex: 0 0 auto;
          border-radius: 14px;
          background: var(--blue-800);
          color: var(--orange);
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
          min-height: 70px;
          padding: 10px 2px;
          border-bottom: 1px solid #EDF1F7;
        }

        .lesson-card:last-child {
          border-bottom: 0;
        }

        .lesson-index {
          width: 30px;
          flex: 0 0 auto;
          color: var(--orange-text);
          font-size: 11px;
          font-weight: 800;
        }

        .lesson-content {
          flex: 1;
          min-width: 0;
        }

        .lesson-content strong {
          display: block;
          color: var(--ink);
          font-size: 13px;
          line-height: 1.4;
        }

        .lesson-content span {
          display: block;
          margin-top: 3px;
          color: var(--muted-2);
          font-size: 10px;
        }

        .lesson-action,
        .lesson-lock {
          width: 36px;
          height: 36px;
          flex: 0 0 auto;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lesson-action {
          border: 0;
          background: var(--orange);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(255,122,26,.35);
          transition: transform .2s ease, background .2s ease;
        }

        .lesson-action:hover {
          transform: scale(1.08);
          background: var(--orange-dark);
        }

        .lesson-lock {
          background: var(--blue-50);
          color: var(--muted-2);
        }

        .resource-note {
          margin-top: 17px;
          padding: 13px 14px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          border-radius: 11px;
          background: var(--blue-50);
          color: var(--muted);
        }

        .resource-note svg {
          flex: 0 0 auto;
          margin-top: 1px;
          color: var(--orange-text);
        }

        .resource-note p {
          margin: 0;
          font-size: 11px;
          line-height: 1.6;
        }

        /* ===== BAS DE PAGE ===== */

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
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--orange-soft);
          border: 1px solid rgba(255,122,26,.25);
          color: var(--orange-text);
        }

        .information-card strong {
          display: block;
          margin-bottom: 4px;
          color: var(--blue-800);
          font-size: 14px;
        }

        .information-card p {
          margin: 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .services-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex: 0 0 auto;
          padding: 12px 16px;
          border-radius: 12px;
          background: var(--orange);
          color: #fff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 10px 22px rgba(255,122,26,.35);
          transition: background .2s ease, transform .2s ease;
        }

        .services-link:hover {
          background: var(--orange-dark);
          transform: translateY(-1px);
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
            background: rgba(6,26,74,.28);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
          }

          .mobile-menu {
            padding: 12px 16px 20px;
            background: #fff;
            border-bottom: 1px solid var(--line);
            box-shadow: 0 20px 40px rgba(10,42,102,.15);
          }

          .mobile-menu a {
            display: flex;
            align-items: center;
            min-height: 50px;
            padding: 0 12px;
            color: var(--muted);
            text-decoration: none;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
          }

          .mobile-menu a.selected {
            color: var(--orange-text);
            background: var(--orange-soft);
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
            border: 1px solid var(--line);
            border-radius: 18px;
            background: rgba(255,255,255,.96);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            box-shadow: 0 14px 35px rgba(10,42,102,.2);
          }

          .mobile-bottom-nav a {
            min-height: 47px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            border-radius: 12px;
            color: var(--muted-2);
            text-decoration: none;
            font-size: 10px;
            font-weight: 700;
          }

          .mobile-bottom-nav a.current {
            color: #fff;
            background: var(--blue-800);
          }

          .mobile-bottom-nav a.current svg {
            color: var(--orange);
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
            line-height: 1;
          }

          .intro-copy p {
            margin-top: 17px;
            font-size: 14px;
            line-height: 1.65;
          }

          .access-badge {
            margin-top: 22px;
            font-size: 11px;
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
            font-size: 15px;
          }

          .market-status {
            font-size: 10px;
          }

          .chart-area {
            left: 18px;
            right: 18px;
            bottom: 18px;
            height: 125px;
          }

          .chart-label {
            font-size: 8px;
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
            font-size: 13px;
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
            min-width: 245px;
            grid-template-columns: 36px minmax(0,1fr) 18px;
            padding: 12px;
            border-radius: 14px;
          }

          .module-number {
            width: 33px;
            height: 33px;
            border-radius: 9px;
          }

          .module-main strong {
            font-size: 12px;
          }

          .module-main small {
            font-size: 10px;
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
            font-size: 22px;
          }

          .detail-header p {
            font-size: 12px;
          }

          .detail-icon {
            width: 40px;
            height: 40px;
            border-radius: 11px;
          }

          .lesson-card {
            min-height: 64px;
            gap: 10px;
          }

          .lesson-content strong {
            font-size: 12px;
          }

          .lesson-content span {
            font-size: 9px;
          }

          .lesson-action,
          .lesson-lock {
            width: 34px;
            height: 34px;
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
            width: 36px;
            height: 36px;
            border-radius: 9px;
          }

          .information-card strong {
            font-size: 13px;
          }

          .information-card p {
            font-size: 11px;
          }

          .services-link {
            margin-top: 20px;
            width: 100%;
            justify-content: center;
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
            min-width: 225px;
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
