import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronRight,
  ExternalLink,
  Info,
  Menu,
  Play,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";

function Cursus() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("trading"); // 'trading' | 'brvm'
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Curriculum Trading progressif (Mix de coachs adaptés aux débutants)
  const tradingModules = [
    {
      number: "01",
      title: "Les Bases Absolues du Trading",
      description:
        "Comprendre ce qu'est réellement le trading, le rôle des marchés financiers et comment un débutant doit aborder cet univers.",
      lessons: [
        {
          title: "Introduction rapide au Trading moderne (Débutant)",
          duration: "9 min",
          creator: "Jesse Rogers",
          url: "https://www.youtube.com/watch?v=Q7Ryv1M7CvI",
          embedId: "Q7Ryv1M7CvI",
        },
        {
          title: "Les Concepts ICT/SMC expliqués de A à Z (Fondations)",
          duration: "26 min",
          creator: "Kasper",
          url: "https://www.youtube.com/watch?v=9Gt1v3NoVDQ",
          embedId: "9Gt1v3NoVDQ",
        },
      ],
    },
    {
      number: "02",
      title: "Lecture des Graphiques & Chandeliers",
      description:
        "Apprendre à lire l'action du prix, décoder les chandeliers japonais et identifier les zones clés.",
      lessons: [
        {
          title: "Comprendre les Chandeliers Japonais et Zones de Prix",
          duration: "13 min",
          creator: "Kasper",
          url: "https://www.youtube.com/watch?v=P8ZmyVnS41M",
          embedId: "P8ZmyVnS41M",
        },
        {
          title: "La Stratégie SMC : Structure de marché et Order Blocks",
          duration: "31 min",
          creator: "Kasper Trading SMC",
          url: "https://www.youtube.com/watch?v=FI8wVYJSng8",
          embedId: "FI8wVYJSng8",
        },
      ],
    },
    {
      number: "03",
      title: "Gestion du Risque (Money Management)",
      description:
        "Protéger son capital de départ, calculer ses positions et maîtriser le ratio risque/rendement.",
      lessons: [
        {
          title: "Le Guide Complet du Money Management en Trading",
          duration: "25 min",
          creator: "Kasper",
          url: "https://www.youtube.com/watch?v=ejSmop8j9hs",
          embedId: "ejSmop8j9hs",
        },
        {
          title: "Pourquoi un Risk/Reward équilibré peut vous rendre rentable",
          duration: "9 min",
          creator: "Kasper Trading SMC",
          url: "https://www.youtube.com/watch?v=cEYPvlxYqIM",
          embedId: "cEYPvlxYqIM",
        },
      ],
    },
    {
      number: "04",
      title: "Psychologie & Discipline du Trader",
      description:
        "Apprivoiser ses émotions, éviter les pièges psychologiques et bâtir une routine de trader rigoureuse.",
      lessons: [
        {
          title: "4 Principes indispensables pour améliorer sa psychologie",
          duration: "16 min",
          creator: "Kasper",
          url: "https://www.youtube.com/watch?v=u79z2wuGkoI",
          embedId: "u79z2wuGkoI",
        },
        {
          title: "La mentalité sans émotions à adopter face aux graphiques",
          duration: "7 min",
          creator: "Alexandre Senek",
          url: "https://www.youtube.com/watch?v=jPeKzzAJaUM",
          embedId: "jPeKzzAJaUM",
        },
      ],
    },
  ];

  // Curriculum BRVM (Bourse Régionale des Valeurs Mobilières)
  const brvmModules = [
    {
      number: "01",
      title: "Découvrir la BRVM",
      description:
        "Comprendre le fonctionnement de la bourse régionale de l'UEMOA et l'intérêt d'y placer son argent.",
      lessons: [
        {
          title: "Comment investir à la BRVM : Guide complet débutant",
          duration: "28 min",
          creator: "Sikarium",
          url: "https://www.youtube.com/watch?v=JZEQimFU5c0",
          embedId: "JZEQimFU5c0",
        },
        {
          title: "Pourquoi et comment investir concrètement à la BRVM",
          duration: "2 min",
          creator: "Business Expertiz",
          url: "https://www.youtube.com/watch?v=2yV25LlrJxY",
          embedId: "2yV25LlrJxY",
        },
      ],
    },
    {
      number: "02",
      title: "Choisir sa SGI & Passer à l'Action",
      description:
        "Tout savoir sur les Sociétés de Gestion et d'Intermédiation (SGI) et l'achat de ses premières actions.",
      lessons: [
        {
          title: "Comment choisir la meilleure SGI pour investir en Afrique",
          duration: "23 min",
          creator: "Sikarium",
          url: "https://www.youtube.com/watch?v=RgtslHMkHMQ",
          embedId: "RgtslHMkHMQ",
        },
        {
          title: "Comment acheter ses premières actions sur le marché",
          duration: "8 min",
          creator: "LeyCom",
          url: "https://www.youtube.com/watch?v=S2SJx7tR2oM",
          embedId: "S2SJx7tR2oM",
        },
      ],
    },
    {
      number: "03",
      title: "Stratégies de Dividendes & Obligations",
      description:
        "Créer des revenus réguliers grâce aux actions à dividendes et découvrir le marché obligataire.",
      lessons: [
        {
          title: "Investir avec un petit budget (ex: 10 000F/mois) à la BRVM",
          duration: "4 min",
          creator: "L'École de la Bourse",
          url: "https://www.youtube.com/watch?v=ze7t4PiyS8k",
          embedId: "ze7t4PiyS8k",
        },
        {
          title: "Le marché obligataire de la BRVM : Comment ça marche ?",
          duration: "7 min",
          creator: "Duareg",
          url: "https://www.youtube.com/watch?v=k1mBJWLjCTY",
          embedId: "k1mBJWLjCTY",
        },
      ],
    },
  ];

  const currentModules = activeTab === "trading" ? tradingModules : brvmModules;
  const currentModule = currentModules[activeModuleIndex] || currentModules[0];

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

          throw new Error(data.message || "Impossible de vérifier l'accès.");
        }

        setAuthorized(true);
        setUser(data.user || null);
      } catch (error) {
        if (cancelled) return;
        console.error("Erreur de vérification :", error);
        navigate("/connexion-cursus", { replace: true });
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
    document.body.style.overflow = menuOpen || selectedVideo ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, selectedVideo]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveModuleIndex(0);
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
          .loading-wordmark { font-size: 24px; font-weight: 800; color: #0A2A66; }
          .loading-wordmark span { color: #FF7A1A; }
          .loading-spinner {
            width: 26px; height: 26px;
            border: 3px solid rgba(10, 42, 102, 0.12);
            border-top-color: #FF7A1A;
            border-radius: 50%;
            animation: cursusSpin .8s linear infinite;
          }
          .cursus-loading p { margin: 0; font-size: 13px; color: #5F6E8A; }
          @keyframes cursusSpin { to { transform: rotate(360deg); } }
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
            <span className="account-name">{user?.firstName || "Membre"}</span>
            <span className="active-dot" />
          </div>

          <button
            type="button"
            className={`mobile-menu-button ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
            <Link to="/cursus" className="selected" onClick={() => setMenuOpen(false)}>
              Cursus
            </Link>
            <Link to="/services" onClick={() => setMenuOpen(false)}>
              Services
            </Link>
            <Link to="/connexion-parrainage?redirect=/parrainage" onClick={() => setMenuOpen(false)}>
              Parrainage
            </Link>
          </nav>
        </div>
      )}

      <main>
        {/* INTRO */}
        <section className="cursus-intro">
          <div className="intro-inner">
            <Link to="/" className="back-link">
              <ArrowLeft size={16} />
              Retour
            </Link>

            <div className="intro-copy">
              <div className="eyebrow">
                <BookOpen size={15} />
                ESPACE APPRENTISSAGE PÉDAGOGIQUE
              </div>

              <h1>
                Débuter.
                <br />
                <span>Comprendre.</span>
                <br />
                Maîtriser les bases pas à pas.
              </h1>

              <p>
                Un cursus progressif combinant les meilleurs formateurs pour
                permettre à chaque débutant de se retrouver facilement.
              </p>
            </div>

            <div className="access-badge">
              <ShieldCheck size={16} />
              Accès Membre Actif
            </div>
          </div>
        </section>

        {/* MENTION SPÉCIALE & AVERTISSEMENT */}
        <section className="disclaimer-banner">
          <div className="disclaimer-inner">
            <Info size={20} className="disclaimer-icon" />
            <p>
              <strong>Avertissement important :</strong> Ce cursus est proposé à
              titre <strong>strictement informatif et éducatif</strong>. Il ne
              s'agit en aucun cas de conseils en investissement. Ces ressources
              sont conçues pour vous armer de connaissances solides et éviter
              toute tentative d'escroquerie par de prétendus gourous.
            </p>
          </div>
        </section>

        {/* SELECTEUR DE DOMAINE */}
        <section className="domain-selector-section">
          <div className="selector-container">
            <button
              type="button"
              className={`domain-tab ${activeTab === "trading" ? "active" : ""}`}
              onClick={() => handleTabChange("trading")}
            >
              <TrendingUp size={20} />
              <div>
                <strong>Étudier le Trading</strong>
                <span>De zéro aux concepts avancés (SMC, Risque, Psycho)</span>
              </div>
            </button>

            <button
              type="button"
              className={`domain-tab ${activeTab === "brvm" ? "active" : ""}`}
              onClick={() => handleTabChange("brvm")}
            >
              <Building2 size={20} />
              <div>
                <strong>Étudier la BRVM</strong>
                <span>Bourse régionale, SGI, actions et dividendes</span>
              </div>
            </button>
          </div>
        </section>

        {/* SECTION DES MODULES */}
        <section className="learning-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                {activeTab === "trading" ? "CURSUS TRADING ÉTAPE PAR ÉTAPE" : "CURSUS BRVM GUIDÉ"}
              </span>

              <h2>
                {activeTab === "trading" ? (
                  <>
                    Apprentissage du <span>Trading.</span>
                  </>
                ) : (
                  <>
                    Investir sur la <span>BRVM.</span>
                  </>
                )}
              </h2>
            </div>

            <p>
              Suivez les modules dans l'ordre logique établi pour progresser sereinement,
              avec des vidéos courtes et ciblées (moins de 30 minutes).
            </p>
          </div>

          <div className="learning-layout">
            {/* LISTE DES MODULES */}
            <div className="module-list">
              {currentModules.map((module, index) => {
                const isActive = index === activeModuleIndex;

                return (
                  <button
                    key={module.number}
                    type="button"
                    className={`module-item ${isActive ? "active" : ""}`}
                    onClick={() => setActiveModuleIndex(index)}
                  >
                    <span className="module-number">{module.number}</span>

                    <span className="module-main">
                      <strong>{module.title}</strong>
                      <small>{module.lessons.length} étapes logiques</small>
                    </span>

                    <ChevronRight size={18} className="module-arrow" />
                  </button>
                );
              })}
            </div>

            {/* DÉTAIL DU MODULE ACTIF */}
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
                {currentModule.lessons.map((lesson, index) => (
                  <div className="lesson-card" key={lesson.title}>
                    <div className="lesson-index">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="lesson-content">
                      <strong>{lesson.title}</strong>
                      <span>
                        ⏱ {lesson.duration} • 👤 Intervenant : {lesson.creator}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="lesson-action"
                      onClick={() => setSelectedVideo(lesson)}
                      aria-label={`Visionner ${lesson.title}`}
                    >
                      <Play size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="resource-note">
                <ExternalLink size={16} />
                <p>
                  Vues et organisées par PHI Academy pour structurer l'apprentissage
                  des débutants sans désordre.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER BAS DE PAGE */}
        <section className="bottom-information">
          <div className="information-card">
            <div className="information-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <strong>Sécurité & Autonomie</strong>
              <p>
                Prenez le temps d'assimiler chaque module. Aucune pression, vous
                progressez à votre propre rythme.
              </p>
            </div>
          </div>

          <Link to="/services" className="services-link">
            Découvrir nos services
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </main>

      {/* MODALE DE LECTURE VIDÉO */}
      {selectedVideo && (
        <div
          className="video-modal-overlay"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="video-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h4>{selectedVideo.title}</h4>
              <button
                type="button"
                className="close-modal"
                onClick={() => setSelectedVideo(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="modal-footer">
              <a
                href={selectedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="external-yt-link"
              >
                Ouvrir sur YouTube <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* STYLES CSS */}
      <style>{`
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
          --line: #DFE6F2;
          --bg: #F4F7FC;
        }

        * { box-sizing: border-box; }

        .cursus-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--bg);
          color: var(--ink);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .cursus-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(18px);
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

        .brand { display: inline-flex; align-items: center; text-decoration: none; }
        .brand-text strong { font-size: 17px; font-weight: 800; color: var(--blue-800); }
        .brand-text span { font-size: 15px; font-weight: 600; color: var(--orange-text); }

        .desktop-nav { display: flex; align-items: center; gap: 8px; }
        .desktop-nav a { padding: 9px 13px; color: var(--muted); font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 10px; transition: 0.2s ease; }
        .desktop-nav a.active { color: var(--blue-800); font-weight: 800; }

        .desktop-account { display: flex; align-items: center; gap: 8px; }
        .account-name { color: var(--blue-800); font-size: 12px; font-weight: 700; }
        .active-dot { width: 7px; height: 7px; border-radius: 50%; background: #1FAE63; }

        .mobile-menu-button {
          display: none; width: 42px; height: 42px; border: 0; border-radius: 12px;
          background: var(--blue-50); color: var(--blue-800); align-items: center; justify-content: center; cursor: pointer;
        }

        .cursus-intro {
          background: radial-gradient(700px 300px at 100% 0%, rgba(255,122,26,0.12), transparent 60%), #fff;
          border-bottom: 1px solid var(--line);
        }

        .intro-inner {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 48px 0 50px;
          position: relative;
        }

        .back-link {
          display: inline-flex; align-items: center; gap: 7px; color: var(--muted);
          text-decoration: none; font-size: 13px; font-weight: 700; margin-bottom: 24px;
        }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px;
          border-radius: 999px; background: var(--orange-soft); color: var(--orange-text);
          font-size: 11px; font-weight: 800; letter-spacing: .13em; margin-bottom: 16px;
        }

        .intro-copy h1 { margin: 0; color: var(--blue-800); font-size: clamp(34px, 5vw, 58px); line-height: 1.1; font-weight: 800; }
        .intro-copy h1 span { color: var(--orange); }
        .intro-copy p { max-width: 610px; margin: 18px 0 0; color: var(--muted); font-size: 15px; line-height: 1.6; }

        .access-badge {
          position: absolute; right: 0; bottom: 50px; display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 13px; border-radius: 999px; background: #EAF8F0; color: #167A48; font-size: 12px; font-weight: 700;
          border: 1px solid rgba(22,122,72,0.15);
        }

        .disclaimer-banner { width: min(1180px, calc(100% - 32px)); margin: 24px auto 0; }
        .disclaimer-inner {
          display: flex; align-items: flex-start; gap: 14px; padding: 16px 20px;
          border-radius: 16px; background: #FFF8EE; border: 1px solid #FFE0B2; color: #8C4A00;
        }
        .disclaimer-icon { flex-shrink: 0; color: var(--orange); margin-top: 2px; }
        .disclaimer-inner p { margin: 0; font-size: 13px; line-height: 1.5; }

        .domain-selector-section { width: min(1180px, calc(100% - 32px)); margin: 28px auto 0; }
        .selector-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        .domain-tab {
          display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 20px;
          background: #fff; border: 2px solid var(--line); color: var(--muted); text-align: left; cursor: pointer; transition: all 0.2s ease;
        }
        .domain-tab:hover { border-color: rgba(255, 122, 26, 0.4); }
        .domain-tab.active { border-color: var(--orange); background: #fff; color: var(--blue-800); box-shadow: 0 10px 25px rgba(255,122,26,0.12); }
        .domain-tab strong { display: block; font-size: 16px; color: var(--blue-800); }
        .domain-tab span { display: block; font-size: 12px; color: var(--muted); margin-top: 2px; }

        .learning-section { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 40px 0; }
        .section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; margin-bottom: 28px; }
        .section-kicker { display: block; color: var(--orange-text); font-size: 11px; letter-spacing: .15em; font-weight: 800; margin-bottom: 8px; }
        .section-heading h2 { margin: 0; color: var(--blue-800); font-size: clamp(26px, 3.5vw, 40px); line-height: 1.1; }
        .section-heading h2 span { color: var(--orange); }
        .section-heading > p { max-width: 390px; margin: 0; color: var(--muted); font-size: 14px; }

        .learning-layout { display: grid; grid-template-columns: 330px minmax(0, 1fr); gap: 18px; align-items: start; }
        .module-list { display: flex; flex-direction: column; gap: 8px; }

        .module-item {
          width: 100%; display: grid; grid-template-columns: 40px minmax(0, 1fr) 20px; align-items: center; gap: 10px;
          padding: 15px 14px; border: 1px solid var(--line); border-radius: 15px; background: #fff; color: var(--ink); text-align: left; cursor: pointer; transition: all .2s ease;
        }
        .module-item:hover { border-color: rgba(255,122,26,.5); }
        .module-item.active { border-color: var(--orange); box-shadow: 0 10px 25px rgba(10,42,102,.06); }
        .module-number { font-size: 13px; font-weight: 800; color: var(--orange-text); }
        .module-main strong { display: block; font-size: 14px; color: var(--blue-800); }
        .module-main small { display: block; font-size: 12px; color: var(--muted); margin-top: 2px; }
        .module-arrow { color: var(--muted); }

        .module-detail { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 28px; }
        .detail-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--line); margin-bottom: 20px; }
        .detail-number { font-size: 11px; font-weight: 800; color: var(--orange); letter-spacing: 0.1em; }
        .detail-header h3 { margin: 6px 0 8px; font-size: 22px; color: var(--blue-800); }
        .detail-header p { margin: 0; font-size: 14px; color: var(--muted); }
        .detail-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--blue-50); color: var(--blue-800); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .lesson-list { display: flex; flex-direction: column; gap: 12px; }
        .lesson-card { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 14px; background: var(--bg); border: 1px solid var(--line); }
        .lesson-index { font-size: 12px; font-weight: 800; color: var(--orange-text); }
        .lesson-content { flex: 1; }
        .lesson-content strong { display: block; font-size: 14px; color: var(--blue-800); }
        .lesson-content span { display: block; font-size: 12px; color: var(--muted); margin-top: 3px; }

        .lesson-action {
          width: 38px; height: 38px; border-radius: 50%; background: var(--orange); color: #fff; border: 0;
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s ease;
        }
        .lesson-action:hover { transform: scale(1.08); background: var(--orange-dark); }

        .resource-note { display: flex; align-items: center; gap: 10px; margin-top: 24px; padding-top: 16px; border-top: 1px dashed var(--line); color: var(--muted); }
        .resource-note p { margin: 0; font-size: 12px; }

        .video-modal-overlay {
          position: fixed; inset: 0; background: rgba(6, 26, 74, 0.82); backdrop-filter: blur(6px);
          z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .video-modal-container { width: min(840px, 100%); background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--line); }
        .modal-header h4 { margin: 0; font-size: 15px; color: var(--blue-800); }
        .close-modal { background: transparent; border: 0; color: var(--muted); cursor: pointer; }
        .modal-video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; background: #000; }
        .modal-video-wrapper iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        .modal-footer { padding: 12px 20px; background: var(--bg); display: flex; justify-content: flex-end; }
        .external-yt-link { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--orange-text); text-decoration: none; }

        .bottom-information { width: min(1180px, calc(100% - 32px)); margin: 0 auto 60px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .information-card { display: flex; align-items: center; gap: 16px; }
        .information-icon { width: 42px; height: 42px; border-radius: 12px; background: #EAF8F0; color: #167A48; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .information-card strong { display: block; font-size: 14px; color: var(--blue-800); }
        .information-card p { margin: 2px 0 0; font-size: 13px; color: var(--muted); }
        .services-link { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 12px; background: var(--blue-800); color: #fff; text-decoration: none; font-size: 13px; font-weight: 700; white-space: nowrap; }

        @media (max-width: 900px) {
          .selector-container { grid-template-columns: 1fr; }
          .learning-layout { grid-template-columns: 1fr; }
          .section-heading { flex-direction: column; align-items: flex-start; gap: 12px; }
          .bottom-information { flex-direction: column; align-items: flex-start; }
          .access-badge { position: relative; bottom: auto; right: auto; margin-top: 20px; }
          .desktop-nav, .desktop-account { display: none; }
          .mobile-menu-button { display: flex; }
        }
      `}</style>
    </div>
  );
}

export default Cursus;
