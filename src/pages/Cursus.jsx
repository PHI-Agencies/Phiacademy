import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Landmark,
  Menu,
  Play,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";

import {
  DISCLAIMER_LONG,
  DISCLAIMER_SHORT,
  buildCatalog,
} from "../data/cursusData";

const STORAGE_PROGRESS = "phi_cursus_progress_v1";
const STORAGE_LAST = "phi_cursus_last_v1";

/* ---------- Stockage local (jamais bloquant) ---------- */

function readProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_PROGRESS);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeProgress(value) {
  try {
    localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(value));
  } catch {
    /* ignoré */
  }
}

function readLast() {
  try {
    return localStorage.getItem(STORAGE_LAST) || "";
  } catch {
    return "";
  }
}

function writeLast(id) {
  try {
    localStorage.setItem(STORAGE_LAST, id);
  } catch {
    /* ignoré */
  }
}

/* ---------- Anneau de progression ---------- */

function Ring({ value, size = 54 }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="ring"
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .6s ease" }}
      />
    </svg>
  );
}

function Cursus() {
  const navigate = useNavigate();

  const catalog = useMemo(() => buildCatalog(), []);

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [trackId, setTrackId] = useState("trading");
  const [moduleIndex, setModuleIndex] = useState(0);

  const [progress, setProgress] = useState(() => readProgress());
  const [player, setPlayer] = useState(null); // { trackId, moduleIndex, lessonIndex }

  const closeButtonRef = useRef(null);
  const learningRef = useRef(null);

  /* ---------- Vérification d'accès (inchangée) ---------- */

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

        // Prénom pour l'affichage (facultatif)
        try {
          const me = await fetch("/api/auth/me", {
            credentials: "include",
          });

          if (me.ok && !cancelled) {
            const meData = await me.json();
            setUser(meData.user || null);
          }
        } catch {
          /* ignoré */
        }
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

  /* ---------- Blocage du scroll (menu / lecteur) ---------- */

  useEffect(() => {
    document.body.style.overflow = menuOpen || player ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, player]);

  /* ---------- Fermeture du lecteur avec Échap ---------- */

  useEffect(() => {
    if (!player) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setPlayer(null);
    };

    window.addEventListener("keydown", onKey);
    closeButtonRef.current?.focus();

    return () => window.removeEventListener("keydown", onKey);
  }, [player]);

  /* ---------- Apparition au défilement ---------- */

  useEffect(() => {
    if (!authorized) return undefined;

    const elements = document.querySelectorAll(".reveal");

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach((element) => element.classList.add("in"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [authorized, trackId, moduleIndex]);

  /* ---------- Données dérivées ---------- */

  const track = catalog.find((item) => item.id === trackId);
  const currentModule = track.modules[moduleIndex];

  const allLessons = useMemo(() => {
    const list = [];

    catalog.forEach((item) => {
      item.modules.forEach((module, mIndex) => {
        module.lessons.forEach((lesson, lIndex) => {
          list.push({
            trackId: item.id,
            moduleIndex: mIndex,
            lessonIndex: lIndex,
            lesson,
          });
        });
      });
    });

    return list;
  }, [catalog]);

  const trackStats = (item) => {
    const lessons = item.modules.flatMap((module) => module.lessons);
    const done = lessons.filter((lesson) => progress[lesson.id]).length;

    return {
      total: lessons.length,
      done,
      ratio: lessons.length ? done / lessons.length : 0,
    };
  };

  const moduleStats = (module) => {
    const done = module.lessons.filter(
      (lesson) => progress[lesson.id]
    ).length;

    return {
      total: module.lessons.length,
      done,
      ratio: module.lessons.length ? done / module.lessons.length : 0,
    };
  };

  /* ---------- Actions ---------- */

  const selectTrack = (id, scroll = true) => {
    setTrackId(id);
    setModuleIndex(0);

    if (scroll) {
      requestAnimationFrame(() => {
        learningRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      });
    }
  };

  const openLesson = useCallback((tId, mIndex, lIndex) => {
    setPlayer({ trackId: tId, moduleIndex: mIndex, lessonIndex: lIndex });
  }, []);

  const toggleDone = (lessonId) => {
    setProgress((previous) => {
      const next = { ...previous };

      if (next[lessonId]) {
        delete next[lessonId];
      } else {
        next[lessonId] = true;
      }

      writeProgress(next);
      return next;
    });
  };

  const playerLesson = player
    ? catalog.find((item) => item.id === player.trackId).modules[
        player.moduleIndex
      ].lessons[player.lessonIndex]
    : null;

  useEffect(() => {
    if (playerLesson) writeLast(playerLesson.id);
  }, [playerLesson]);

  const goRelative = (delta) => {
    // Navigation limitée au parcours en cours
    const sameTrack = allLessons.filter(
      (entry) => entry.trackId === player.trackId
    );

    const index = sameTrack.findIndex(
      (entry) =>
        entry.moduleIndex === player.moduleIndex &&
        entry.lessonIndex === player.lessonIndex
    );

    const target = sameTrack[index + delta];

    if (!target) return;

    setPlayer({
      trackId: target.trackId,
      moduleIndex: target.moduleIndex,
      lessonIndex: target.lessonIndex,
    });

    setModuleIndex(target.moduleIndex);
  };

  const nextToWatch = (item) => {
    const entries = allLessons.filter((entry) => entry.trackId === item.id);

    return (
      entries.find((entry) => !progress[entry.lesson.id]) || entries[0]
    );
  };

  const resumeEntry = useMemo(() => {
    const lastId = readLast();

    return (
      allLessons.find((entry) => entry.lesson.id === lastId) || null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLessons, player]);

  /* ---------- Chargement ---------- */

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

  const tradingTrack = catalog[0];
  const brvmTrack = catalog[1];

  const tradingStats = trackStats(tradingTrack);
  const brvmStats = trackStats(brvmTrack);

  const currentStats = moduleStats(currentModule);
  const currentTrackStats = trackStats(track);

  const playerModule = player
    ? catalog.find((item) => item.id === player.trackId).modules[
        player.moduleIndex
      ]
    : null;

  const sameTrackEntries = player
    ? allLessons.filter((entry) => entry.trackId === player.trackId)
    : [];

  const sameTrackIndex = player
    ? sameTrackEntries.findIndex(
        (entry) =>
          entry.moduleIndex === player.moduleIndex &&
          entry.lessonIndex === player.lessonIndex
      )
    : -1;

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

            <Link to="/mot-de-passe">Mot de passe</Link>
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
        <div
          className="mobile-menu-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="mobile-menu"
            onClick={(event) => event.stopPropagation()}
          >
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

            <Link
              to="/mot-de-passe"
              onClick={() => setMenuOpen(false)}
            >
              Mot de passe
            </Link>
          </nav>
        </div>
      )}

      <main>
        {/* ================= INTRO ================= */}

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
                Comprenez
                <br />
                <span>avant d'investir.</span>
              </h1>

              <p>
                Deux parcours pour apprendre pas à pas : le trading et
                la BRVM, la bourse de l'Afrique de l'Ouest. Des vidéos
                choisies chez des formateurs différents, dans un ordre
                logique, pour savoir de quoi on parle avant de risquer
                un franc.
              </p>

              <div className="intro-actions">
                {resumeEntry ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      selectTrack(resumeEntry.trackId, false);
                      setModuleIndex(resumeEntry.moduleIndex);
                      openLesson(
                        resumeEntry.trackId,
                        resumeEntry.moduleIndex,
                        resumeEntry.lessonIndex
                      );
                    }}
                  >
                    <Play size={16} />
                    Reprendre où j'en étais
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => selectTrack("trading")}
                  >
                    <Play size={16} />
                    Commencer le parcours
                  </button>
                )}

                <div className="access-badge">
                  <ShieldCheck size={16} />
                  Accès membre actif
                </div>

                <div className="lang-badge">Vidéos sélectionnées en français</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= AVERTISSEMENT ================= */}

        <section className="disclaimer-section">
          <div className="disclaimer-card">
            <div className="disclaimer-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <strong>À titre informatif uniquement</strong>

              <p>{DISCLAIMER_LONG}</p>
            </div>
          </div>
        </section>

        {/* ================= CHOIX DU PARCOURS ================= */}

        <section className="tracks-section">
          <div className="tracks-grid">
            {[
              {
                item: tradingTrack,
                stats: tradingStats,
                Icon: TrendingUp,
                tone: "trading",
              },
              {
                item: brvmTrack,
                stats: brvmStats,
                Icon: Landmark,
                tone: "brvm",
              },
            ].map(({ item, stats, Icon, tone }) => (
              <button
                key={item.id}
                type="button"
                className={`track-card ${tone} ${
                  trackId === item.id ? "selected" : ""
                } reveal`}
                onClick={() => selectTrack(item.id)}
                aria-pressed={trackId === item.id}
              >
                <div className="track-top">
                  <span className="track-icon">
                    <Icon size={24} />
                  </span>

                  <span className="track-ring">
                    <Ring value={stats.ratio} />
                    <b>{Math.round(stats.ratio * 100)}%</b>
                  </span>
                </div>

                <h2>{item.label}</h2>

                <p className="track-tagline">{item.tagline}</p>

                <p className="track-description">{item.description}</p>

                <div className="track-meta">
                  <span>{item.modules.length} modules</span>
                  <span>{stats.total} vidéos</span>
                  <span>
                    {stats.done}/{stats.total} vues
                  </span>
                </div>

                <span className="track-cta">
                  {trackId === item.id
                    ? "Parcours en cours"
                    : "Choisir ce parcours"}
                  <ChevronRight size={16} />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ================= PARCOURS ================= */}

        <section className="learning-section" ref={learningRef}>
          <div className="section-heading reveal">
            <div>
              <span className="section-kicker">
                {track.short.toUpperCase()}
              </span>

              <h2>
                {track.id === "trading" ? (
                  <>
                    Apprendre
                    <br />
                    <span>le trading.</span>
                  </>
                ) : (
                  <>
                    Comprendre
                    <br />
                    <span>la BRVM.</span>
                  </>
                )}
              </h2>
            </div>

            <div className="section-side">
              <p>
                Suivez les modules dans l'ordre. Vous pouvez cocher une
                vidéo comme terminée : votre progression est
                enregistrée sur cet appareil.
              </p>

              <div className="overall">
                <div className="overall-bar">
                  <span
                    style={{
                      width: `${Math.round(currentTrackStats.ratio * 100)}%`,
                    }}
                  />
                </div>

                <small>
                  {currentTrackStats.done} / {currentTrackStats.total}{" "}
                  vidéos terminées
                </small>
              </div>
            </div>
          </div>

          <div className="learning-layout">
            <div className="module-list">
              {track.modules.map((module, index) => {
                const isActive = index === moduleIndex;
                const stats = moduleStats(module);
                const complete = stats.done === stats.total;

                return (
                  <button
                    key={module.number}
                    type="button"
                    className={`module-item ${isActive ? "active" : ""} ${
                      complete ? "complete" : ""
                    }`}
                    onClick={() => setModuleIndex(index)}
                  >
                    <span className="module-number">
                      {complete ? <Check size={16} /> : module.number}
                    </span>

                    <span className="module-main">
                      <strong>{module.title}</strong>

                      <small>
                        {stats.done}/{stats.total} vidéos
                      </small>

                      <i className="mini-bar">
                        <b style={{ width: `${stats.ratio * 100}%` }} />
                      </i>
                    </span>

                    <ChevronRight size={18} className="module-arrow" />
                  </button>
                );
              })}
            </div>

            <div className="module-detail" key={`${trackId}-${moduleIndex}`}>
              <div className="detail-header">
                <div>
                  <span className="detail-number">
                    MODULE {currentModule.number} / {track.modules.length}
                  </span>

                  <h3>{currentModule.title}</h3>

                  <p>{currentModule.description}</p>
                </div>

                <div className="detail-ring">
                  <Ring value={currentStats.ratio} size={58} />
                  <b>
                    {currentStats.done}/{currentStats.total}
                  </b>
                </div>
              </div>

              <div className="lesson-list">
                {currentModule.lessons.map((lesson, index) => {
                  const done = Boolean(progress[lesson.id]);

                  return (
                    <div
                      className={`lesson-card ${done ? "done" : ""}`}
                      key={lesson.id}
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <button
                        type="button"
                        className="lesson-thumb"
                        onClick={() =>
                          openLesson(track.id, moduleIndex, index)
                        }
                        aria-label={`Lire : ${lesson.title}`}
                      >
                        <img
                          src={`https://i.ytimg.com/vi/${lesson.video}/mqdefault.jpg`}
                          alt=""
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />

                        <span className="thumb-play">
                          <Play size={16} />
                        </span>
                      </button>

                      <div className="lesson-content">
                        <span className="lesson-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <strong>{lesson.title}</strong>

                        <span className="lesson-meta">
                          {lesson.channel
                            ? `${lesson.channel} · `
                            : ""}
                          <em className={`lang ${lesson.lang}`}>
                            {lesson.lang === "EN"
                              ? "En anglais"
                              : "En français"}
                          </em>
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`done-toggle ${done ? "on" : ""}`}
                        onClick={() => toggleDone(lesson.id)}
                        aria-pressed={done}
                        aria-label={
                          done
                            ? `Marquer « ${lesson.title} » comme non vue`
                            : `Marquer « ${lesson.title} » comme terminée`
                        }
                        title={done ? "Terminée" : "Marquer comme terminée"}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="detail-footer">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const entry = nextToWatch(track);
                    setModuleIndex(entry.moduleIndex);
                    openLesson(
                      entry.trackId,
                      entry.moduleIndex,
                      entry.lessonIndex
                    );
                  }}
                >
                  <Play size={16} />
                  Prochaine vidéo à voir
                </button>

                {moduleIndex < track.modules.length - 1 && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setModuleIndex(moduleIndex + 1)}
                  >
                    Module suivant
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              <div className="resource-note">
                <ExternalLink size={16} />

                <p>
                  Les vidéos sont hébergées sur YouTube par leurs
                  créateurs. PHI Academy les sélectionne et les organise,
                  sans les héberger. {DISCLAIMER_SHORT}
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
              <strong>Prenez le temps de comprendre</strong>

              <p>
                Aucun parcours ne garantit des gains. Commencez par les
                bases, entraînez-vous sans argent réel et ne confiez
                jamais votre argent à quelqu'un qui promet des
                résultats certains.
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

      {/* ================= LECTEUR ================= */}

      {player && playerLesson && (
        <div
          className="player-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={playerLesson.title}
          onClick={() => setPlayer(null)}
        >
          <div
            className="player-box"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="player-head">
              <div>
                <span className="player-kicker">
                  {playerModule.number} · {playerModule.title}
                </span>

                <strong>{playerLesson.title}</strong>
              </div>

              <button
                type="button"
                ref={closeButtonRef}
                className="player-close"
                onClick={() => setPlayer(null)}
                aria-label="Fermer le lecteur"
              >
                <X size={20} />
              </button>
            </div>

            <div className="player-frame">
              <iframe
                key={playerLesson.video}
                src={`https://www.youtube-nocookie.com/embed/${playerLesson.video}?rel=0&modestbranding=1&autoplay=1`}
                title={playerLesson.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {playerLesson.lang === "EN" && (
              <div className="player-hint">
                Cette vidéo est en anglais. Activez les sous-titres
                (bouton « CC » du lecteur) pour les traduire en
                français.
              </div>
            )}

            <div className="player-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => goRelative(-1)}
                disabled={sameTrackIndex <= 0}
              >
                <ChevronLeft size={16} />
                Précédente
              </button>

              <button
                type="button"
                className={`btn-done ${
                  progress[playerLesson.id] ? "on" : ""
                }`}
                onClick={() => toggleDone(playerLesson.id)}
              >
                <Check size={16} />
                {progress[playerLesson.id]
                  ? "Terminée"
                  : "Marquer comme terminée"}
              </button>

              <button
                type="button"
                className="btn-primary small"
                onClick={() => {
                  if (!progress[playerLesson.id]) {
                    toggleDone(playerLesson.id);
                  }
                  goRelative(1);
                }}
                disabled={sameTrackIndex >= sameTrackEntries.length - 1}
              >
                Suivante
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="player-foot">
              <a
                href={`https://www.youtube.com/watch?v=${playerLesson.video}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} />
                Ouvrir sur YouTube
              </a>

              <span>{DISCLAIMER_SHORT}</span>
            </div>
          </div>
        </div>
      )}

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

          --green: #167A48;
          --green-soft: #EAF8F0;

          --ink: #0A1B44;
          --muted: #5F6E8A;
          --muted-2: #8794AD;
          --line: #DFE6F2;
          --bg: #F4F7FC;
        }

        .cursus-page * {
          box-sizing: border-box;
        }

        .cursus-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--bg);
          color: var(--ink);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .cursus-page button {
          font-family: inherit;
        }

        /* ===== EN-TÊTE ===== */

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
          text-decoration: none;
          color: var(--blue-800);
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

        /* ===== BOUTONS ===== */

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 46px;
          padding: 0 20px;
          border: 0;
          border-radius: 13px;
          background: var(--orange);
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(255,122,26,.35);
          transition: background .2s ease, transform .2s ease, opacity .2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--orange-dark);
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: .45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-primary.small {
          min-height: 42px;
          padding: 0 16px;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 42px;
          padding: 0 16px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: #fff;
          color: var(--blue-800);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: border-color .2s ease, background .2s ease;
        }

        .btn-ghost:hover:not(:disabled) {
          border-color: var(--orange);
          background: var(--orange-soft);
        }

        .btn-ghost:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .btn-done {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 42px;
          padding: 0 16px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: #fff;
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all .2s ease;
        }

        .btn-done:hover {
          border-color: var(--green);
          color: var(--green);
        }

        .btn-done.on {
          border-color: rgba(22,122,72,.35);
          background: var(--green-soft);
          color: var(--green);
        }

        /* ===== INTRO ===== */

        .cursus-intro {
          background:
            radial-gradient(700px 300px at 100% 0%, rgba(255,122,26,0.14), transparent 60%),
            radial-gradient(600px 300px at 0% 100%, rgba(16,58,140,0.08), transparent 60%),
            #fff;
          border-bottom: 1px solid var(--line);
        }

        .intro-inner {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 48px 0 52px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--muted);
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 32px;
          transition: color .2s ease;
        }

        .back-link:hover {
          color: var(--orange-text);
        }

        .intro-copy {
          max-width: 760px;
          animation: riseIn .7s ease both;
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
          font-size: clamp(38px, 6vw, 68px);
          line-height: 1;
          letter-spacing: -.055em;
          font-weight: 800;
        }

        .intro-copy h1 span {
          color: var(--orange);
        }

        .intro-copy > p {
          max-width: 640px;
          margin: 22px 0 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.7;
        }

        .intro-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
          margin-top: 26px;
        }

        .access-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border-radius: 999px;
          background: var(--green-soft);
          color: var(--green);
          font-size: 12px;
          font-weight: 700;
          border: 1px solid rgba(22,122,72,0.15);
        }

        .lang-badge {
          display: inline-flex;
          align-items: center;
          padding: 9px 13px;
          border-radius: 999px;
          background: var(--blue-50);
          color: var(--blue-800);
          font-size: 12px;
          font-weight: 700;
          border: 1px solid var(--line);
        }

        /* ===== AVERTISSEMENT ===== */

        .disclaimer-section {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 26px 0 0;
        }

        .disclaimer-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px 20px;
          border-radius: 18px;
          background: #fff;
          border: 1px solid rgba(255,122,26,.3);
          border-left: 5px solid var(--orange);
        }

        .disclaimer-icon {
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--orange-soft);
          color: var(--orange-text);
        }

        .disclaimer-card strong {
          display: block;
          margin-bottom: 4px;
          color: var(--blue-800);
          font-size: 14px;
        }

        .disclaimer-card p {
          margin: 0;
          color: var(--muted);
          font-size: 12.5px;
          line-height: 1.65;
        }

        /* ===== CHOIX DU PARCOURS ===== */

        .tracks-section {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 28px 0 0;
        }

        .tracks-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .track-card {
          position: relative;
          overflow: hidden;
          text-align: left;
          padding: 26px;
          border: 2px solid transparent;
          border-radius: 26px;
          color: #fff;
          cursor: pointer;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
          box-shadow: 0 18px 44px rgba(10,42,102,.2);
        }

        .track-card.trading {
          background:
            radial-gradient(circle at 90% 10%, rgba(255,122,26,.32), transparent 38%),
            linear-gradient(135deg, var(--blue-900), var(--blue-800) 60%, var(--blue-700));
        }

        .track-card.brvm {
          background:
            radial-gradient(circle at 90% 10%, rgba(255,255,255,.14), transparent 38%),
            linear-gradient(135deg, #B94A00, var(--orange-dark) 55%, var(--orange));
        }

        .track-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 26px 56px rgba(10,42,102,.28);
        }

        .track-card.selected {
          border-color: #fff;
          outline: 3px solid var(--orange);
          outline-offset: 3px;
        }

        .track-card.brvm.selected {
          outline-color: var(--blue-800);
        }

        .track-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .track-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,.16);
          color: #fff;
        }

        .track-ring {
          position: relative;
          width: 54px;
          height: 54px;
          color: #fff;
        }

        .track-ring .ring {
          display: block;
        }

        .track-ring b {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
        }

        .track-card h2 {
          margin: 0 0 6px;
          font-size: clamp(24px, 3vw, 30px);
          letter-spacing: -.04em;
          line-height: 1.05;
        }

        .track-tagline {
          margin: 0 0 12px;
          color: rgba(255,255,255,.92);
          font-size: 14px;
          font-weight: 700;
        }

        .track-description {
          margin: 0 0 18px;
          color: rgba(255,255,255,.78);
          font-size: 13px;
          line-height: 1.65;
        }

        .track-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .track-meta span {
          padding: 6px 11px;
          border-radius: 999px;
          background: rgba(255,255,255,.16);
          font-size: 11px;
          font-weight: 700;
        }

        .track-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 800;
        }

        .track-card:hover .track-cta svg {
          transform: translateX(3px);
        }

        .track-cta svg {
          transition: transform .2s ease;
        }

        /* ===== PARCOURS ===== */

        .learning-section {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 64px 0 40px;
          scroll-margin-top: 80px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 30px;
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

        .section-side {
          max-width: 390px;
          width: 100%;
        }

        .section-side p {
          margin: 0 0 14px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .overall-bar {
          height: 8px;
          border-radius: 999px;
          background: var(--blue-100);
          overflow: hidden;
        }

        .overall-bar span {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--orange), #FFA45C);
          transition: width .6s ease;
        }

        .overall small {
          display: block;
          margin-top: 7px;
          color: var(--muted-2);
          font-size: 11px;
          font-weight: 600;
        }

        .learning-layout {
          display: grid;
          grid-template-columns: 340px minmax(0, 1fr);
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
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: #fff;
          color: var(--ink);
          text-align: left;
          cursor: pointer;
          transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
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

        .module-item.complete .module-number {
          background: var(--green-soft);
          color: var(--green);
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
          margin-top: 3px;
          color: var(--muted-2);
          font-size: 11px;
        }

        .mini-bar {
          display: block;
          height: 3px;
          margin-top: 7px;
          border-radius: 999px;
          background: var(--blue-100);
          overflow: hidden;
        }

        .mini-bar b {
          display: block;
          height: 100%;
          background: var(--orange);
          transition: width .5s ease;
        }

        .module-item.complete .mini-bar b {
          background: var(--green);
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
          animation: riseIn .45s ease both;
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 22px;
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
          max-width: 560px;
          margin: 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .detail-ring {
          position: relative;
          width: 58px;
          height: 58px;
          flex: 0 0 auto;
          color: var(--orange);
        }

        .detail-ring b {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--blue-800);
          font-size: 11px;
          font-weight: 800;
        }

        .ring {
          display: block;
        }

        .lesson-list {
          padding-top: 6px;
        }

        .lesson-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 2px;
          border-bottom: 1px solid #EDF1F7;
          animation: riseIn .5s ease both;
        }

        .lesson-card:last-child {
          border-bottom: 0;
        }

        .lesson-thumb {
          position: relative;
          width: 132px;
          aspect-ratio: 16 / 9;
          flex: 0 0 auto;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 12px;
          background: var(--blue-800);
          cursor: pointer;
        }

        .lesson-thumb img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform .4s ease, opacity .3s ease;
        }

        .lesson-thumb:hover img {
          transform: scale(1.06);
        }

        .lesson-card.done .lesson-thumb img {
          opacity: .55;
        }

        .thumb-play {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 38px;
          height: 38px;
          margin: -19px 0 0 -19px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--orange);
          color: #fff;
          box-shadow: 0 8px 18px rgba(0,0,0,.3);
          transition: transform .2s ease;
        }

        .lesson-thumb:hover .thumb-play {
          transform: scale(1.12);
        }

        .lesson-content {
          flex: 1;
          min-width: 0;
        }

        .lesson-index {
          display: block;
          margin-bottom: 3px;
          color: var(--orange-text);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .1em;
        }

        .lesson-content strong {
          display: block;
          color: var(--ink);
          font-size: 14px;
          line-height: 1.35;
        }

        .lesson-meta {
          display: block;
          margin-top: 5px;
          color: var(--muted-2);
          font-size: 11px;
        }

        .lang {
          font-style: normal;
          font-weight: 700;
        }

        .lang.EN {
          color: var(--orange-text);
        }

        .done-toggle {
          width: 38px;
          height: 38px;
          flex: 0 0 auto;
          border: 2px solid var(--line);
          border-radius: 50%;
          background: #fff;
          color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .25s ease;
        }

        .done-toggle:hover {
          border-color: var(--green);
          color: var(--green);
        }

        .done-toggle.on {
          border-color: var(--green);
          background: var(--green);
          color: #fff;
          animation: pop .35s ease;
        }

        .detail-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
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

        /* ===== LECTEUR ===== */

        .player-overlay {
          position: fixed;
          inset: 0;
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(3,12,38,.78);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: fadeIn .25s ease both;
        }

        .player-box {
          width: min(920px, 100%);
          max-height: 100%;
          overflow-y: auto;
          padding: 18px;
          border-radius: 22px;
          background: #fff;
          border-top: 4px solid var(--orange);
          box-shadow: 0 30px 80px rgba(0,0,0,.45);
          animation: riseIn .35s ease both;
        }

        .player-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
        }

        .player-kicker {
          display: block;
          margin-bottom: 4px;
          color: var(--orange-text);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .player-head strong {
          color: var(--blue-800);
          font-size: 18px;
          letter-spacing: -.02em;
          line-height: 1.25;
        }

        .player-close {
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          border: 0;
          border-radius: 12px;
          background: var(--blue-50);
          color: var(--blue-800);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background .2s ease;
        }

        .player-close:hover {
          background: var(--orange-soft);
        }

        .player-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 14px;
          background: #000;
        }

        .player-frame iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .player-hint {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          background: var(--orange-soft);
          color: var(--orange-text);
          font-size: 12px;
          font-weight: 600;
          line-height: 1.5;
        }

        .player-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
        }

        .player-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px 16px;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid var(--line);
          color: var(--muted-2);
          font-size: 11px;
        }

        .player-foot a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--blue-700);
          font-weight: 700;
          text-decoration: none;
        }

        .player-foot a:hover {
          color: var(--orange-text);
        }

        /* ===== ANIMATIONS ===== */

        .reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity .6s ease, transform .6s ease;
        }

        .reveal.in {
          opacity: 1;
          transform: none;
        }

        .track-card.reveal.in:hover {
          transform: translateY(-4px);
        }

        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pop {
          0% { transform: scale(.8); }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        /* ===== TABLETTE ===== */

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

          .section-heading {
            display: block;
          }

          .section-side {
            max-width: none;
            margin-top: 16px;
          }

          .learning-layout {
            grid-template-columns: 1fr;
          }

          .module-list {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 6px;
            scrollbar-width: none;
          }

          .module-list::-webkit-scrollbar {
            display: none;
          }

          .module-item {
            min-width: 250px;
            flex: 0 0 auto;
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

        /* ===== TÉLÉPHONE ===== */

        @media (max-width: 680px) {
          .tracks-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .cursus-page {
            padding-bottom: 80px;
          }

          .header-inner,
          .intro-inner,
          .disclaimer-section,
          .tracks-section,
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

          .intro-inner {
            padding: 28px 0 30px;
          }

          .back-link {
            margin-bottom: 26px;
          }

          .intro-copy h1 {
            font-size: 40px;
          }

          .intro-copy > p {
            font-size: 14px;
          }

          .intro-actions .btn-primary {
            width: 100%;
          }

          .disclaimer-card {
            padding: 15px;
            gap: 11px;
          }

          .disclaimer-card p {
            font-size: 12px;
          }

          .track-card {
            padding: 20px;
            border-radius: 22px;
          }

          .learning-section {
            padding-top: 48px;
          }

          .section-heading h2 {
            font-size: 34px;
          }

          .module-item {
            min-width: 232px;
            padding: 12px;
          }

          .module-detail {
            padding: 16px;
            border-radius: 18px;
          }

          .detail-header h3 {
            font-size: 22px;
          }

          .lesson-card {
            flex-wrap: wrap;
            gap: 10px 12px;
          }

          .lesson-thumb {
            width: 104px;
          }

          .lesson-content strong {
            font-size: 13px;
          }

          .detail-footer .btn-primary,
          .detail-footer .btn-ghost {
            width: 100%;
          }

          .bottom-information {
            display: block;
            padding-top: 10px;
            padding-bottom: 20px;
          }

          .services-link {
            margin-top: 20px;
            width: 100%;
            justify-content: center;
          }

          .player-overlay {
            padding: 8px;
            align-items: flex-end;
          }

          .player-box {
            padding: 14px;
            border-radius: 18px;
          }

          .player-head strong {
            font-size: 15px;
          }

          .player-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .player-actions .btn-done {
            grid-column: 1 / -1;
            order: -1;
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

          .reveal {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Cursus;
