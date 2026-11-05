import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Landmark,
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

/* ---------- Progression locale (jamais bloquante) ---------- */

function readProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_PROGRESS) || "{}");
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

const TRACK_ICONS = {
  trading: TrendingUp,
  brvm: Landmark,
};

function Cursus() {
  const navigate = useNavigate();
  const catalog = useMemo(() => buildCatalog(), []);

  const [authorized, setAuthorized] = useState(false);
  const [firstName, setFirstName] = useState("");

  const [trackId, setTrackId] = useState("trading");
  const [openModule, setOpenModule] = useState(0);
  const [progress, setProgress] = useState(readProgress);
  const [player, setPlayer] = useState(null); // { moduleIndex, lessonIndex }

  /* ---------- Accès : une fois connecté, tout le cursus est ouvert ---------- */

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const response = await fetch("/api/cursus/access", {
          credentials: "include",
        });

        if (cancelled) return;

        if (response.status === 401) {
          navigate("/connexion-cursus?redirect=/cursus", { replace: true });
          return;
        }

        if (response.status === 403) {
          navigate("/connexion-cursus?payment=required", { replace: true });
          return;
        }

        if (!response.ok) throw new Error("access");

        // La page s'affiche tout de suite ; le prénom arrive ensuite.
        setAuthorized(true);

        fetch("/api/auth/me", { credentials: "include" })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (!cancelled && d?.user?.firstName) {
              setFirstName(d.user.firstName);
            }
          })
          .catch(() => {});
      } catch {
        if (!cancelled) navigate("/connexion-cursus", { replace: true });
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /* ---------- Scroll bloqué + Échap ---------- */

  useEffect(() => {
    document.body.style.overflow = player ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [player]);

  useEffect(() => {
    if (!player) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setPlayer(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [player]);

  /* ---------- Données ---------- */

  const track = catalog.find((item) => item.id === trackId) || catalog[0];

  const countFor = (item) => {
    let total = 0;
    let done = 0;
    item.modules.forEach((m) =>
      m.lessons.forEach((l) => {
        total += 1;
        if (progress[l.id]) done += 1;
      })
    );
    return { total, done };
  };

  const toggleDone = useCallback((id) => {
    setProgress((previous) => {
      const next = { ...previous };
      if (next[id]) delete next[id];
      else next[id] = true;
      writeProgress(next);
      return next;
    });
  }, []);

  const selectTrack = (id) => {
    setTrackId(id);
    setOpenModule(0);
    setPlayer(null);
  };

  const flatLessons = useMemo(
    () =>
      track.modules.flatMap((m, moduleIndex) =>
        m.lessons.map((lesson, lessonIndex) => ({
          moduleIndex,
          lessonIndex,
          lesson,
        }))
      ),
    [track]
  );

  const playerPos = player
    ? flatLessons.findIndex(
        (e) =>
          e.moduleIndex === player.moduleIndex &&
          e.lessonIndex === player.lessonIndex
      )
    : -1;

  const current = playerPos >= 0 ? flatLessons[playerPos] : null;

  const go = (step) => {
    const target = flatLessons[playerPos + step];
    if (target) {
      setPlayer({
        moduleIndex: target.moduleIndex,
        lessonIndex: target.lessonIndex,
      });
      setOpenModule(target.moduleIndex);
    }
  };

  if (!authorized) {
    return (
      <div className="cursus-loading">
        <div className="loading-wordmark">
          PHI <span>ACADEMY</span>
        </div>
        <div className="loading-spinner" />
        <style>{`
          .cursus-loading{min-height:100vh;min-height:100dvh;background:#F4F7FC;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;font-family:Inter,-apple-system,"Segoe UI",sans-serif}
          .loading-wordmark{font-size:24px;font-weight:800;color:#0A2A66}
          .loading-wordmark span{color:#FF7A1A}
          .loading-spinner{width:26px;height:26px;border:3px solid rgba(10,42,102,.12);border-top-color:#FF7A1A;border-radius:50%;animation:cs .8s linear infinite}
          @keyframes cs{to{transform:rotate(360deg)}}
        `}</style>
      </div>
    );
  }

  const trackCount = countFor(track);

  return (
    <div className="cursus-page">
      <Navbar />

      <main className="c-main">
        <section className="c-hero">
          <div className="c-eyebrow">
            <BookOpen size={14} /> ESPACE APPRENTISSAGE
          </div>
          <h1>
            {firstName ? `Bienvenue, ${firstName}.` : "Bienvenue."}
            <span> Comprenez avant d'investir.</span>
          </h1>
          <p>
            Deux parcours pour apprendre pas à pas, en vidéo. Tout est ouvert :
            avancez à votre rythme.
          </p>
          <div className="c-pills">
            <span>
              <ShieldCheck size={14} /> Accès membre actif
            </span>
            <span>Vidéos sélectionnées en français</span>
          </div>
        </section>

        <section className="c-notice">
          <ShieldCheck size={18} />
          <div>
            <strong>{DISCLAIMER_SHORT}</strong>
            <details>
              <summary>Lire l'avertissement complet</summary>
              <p>{DISCLAIMER_LONG}</p>
            </details>
          </div>
        </section>

        {/* ---------- Choix du parcours : 2 cases toujours côte à côte ---------- */}
        <section className="c-tracks" aria-label="Parcours">
          {catalog.map((item) => {
            const Icon = TRACK_ICONS[item.id] || BookOpen;
            const { total, done } = countFor(item);
            const active = item.id === trackId;

            return (
              <button
                key={item.id}
                type="button"
                className={`c-track ${item.id} ${active ? "active" : ""}`}
                aria-pressed={active}
                onClick={() => selectTrack(item.id)}
              >
                <span className="c-track-icon">
                  <Icon size={22} />
                </span>
                <span className="c-track-title">{item.short}</span>
                <span className="c-track-sub">{item.label}</span>
                <span className="c-track-count">
                  {done}/{total} vidéos
                </span>
                <span className="c-track-state">
                  {active ? "Parcours ouvert ▾" : "Choisir ce parcours"}
                </span>
              </button>
            );
          })}
        </section>

        <div className="c-panel" data-track={track.id}>
        <section className="c-track-intro">
          <h2>{track.label}</h2>
          <p>{track.description}</p>
          <small>
            {track.modules.length} modules · {trackCount.total} vidéos ·{" "}
            {trackCount.done} terminée{trackCount.done > 1 ? "s" : ""}
          </small>
        </section>

        {/* ---------- Modules ---------- */}
        <section className="c-modules">
          {track.modules.map((module, moduleIndex) => {
            const isOpen = openModule === moduleIndex;
            const done = module.lessons.filter((l) => progress[l.id]).length;
            const complete = done === module.lessons.length;

            return (
              <article
                key={module.number}
                className={`c-module ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  className="c-module-head"
                  aria-expanded={isOpen}
                  onClick={() => setOpenModule(isOpen ? -1 : moduleIndex)}
                >
                  <span className={`c-num ${complete ? "ok" : ""}`}>
                    {complete ? <Check size={16} /> : module.number}
                  </span>
                  <span className="c-module-text">
                    <strong>{module.title}</strong>
                    <small>
                      {done}/{module.lessons.length} vidéos
                    </small>
                  </span>
                  <ChevronRight size={18} className="c-chev" />
                </button>

                {isOpen && (
                  <div className="c-module-body">
                    <p>{module.description}</p>

                    <ul className="c-lessons">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            className="c-lesson"
                            onClick={() =>
                              setPlayer({ moduleIndex, lessonIndex })
                            }
                          >
                            <span className="c-thumb">
                              <img
                                src={`https://i.ytimg.com/vi/${lesson.video}/mqdefault.jpg`}
                                alt=""
                                loading="lazy"
                                width="160"
                                height="90"
                              />
                              <span className="c-play">
                                <Play size={14} />
                              </span>
                            </span>
                            <span className="c-lesson-text">
                              <strong>{lesson.title}</strong>
                              {lesson.channel && <small>{lesson.channel}</small>}
                            </span>
                          </button>
                          <button
                            type="button"
                            className={`c-check ${
                              progress[lesson.id] ? "on" : ""
                            }`}
                            aria-label={
                              progress[lesson.id]
                                ? "Marquer comme non vue"
                                : "Marquer comme vue"
                            }
                            onClick={() => toggleDone(lesson.id)}
                          >
                            <Check size={15} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </section>
        </div>
      </main>

      {/* ---------- Lecteur ---------- */}
      {current && (
        <div className="c-player-bg" onClick={() => setPlayer(null)}>
          <div
            className="c-player"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="c-player-top">
              <div>
                <small>
                  {track.short} · Module{" "}
                  {track.modules[current.moduleIndex].number}
                </small>
                <strong>{current.lesson.title}</strong>
              </div>
              <button
                type="button"
                className="c-close"
                aria-label="Fermer"
                onClick={() => setPlayer(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="c-video">
              <iframe
                key={current.lesson.id}
                src={`https://www.youtube-nocookie.com/embed/${current.lesson.video}?rel=0&modestbranding=1`}
                title={current.lesson.title}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>

            <div className="c-player-bar">
              <button
                type="button"
                disabled={playerPos <= 0}
                onClick={() => go(-1)}
              >
                <ChevronLeft size={16} /> Précédent
              </button>

              <button
                type="button"
                className={`mid ${progress[current.lesson.id] ? "on" : ""}`}
                onClick={() => toggleDone(current.lesson.id)}
              >
                <Check size={16} />
                {progress[current.lesson.id] ? "Vue" : "Marquer comme vue"}
              </button>

              <button
                type="button"
                disabled={playerPos >= flatLessons.length - 1}
                onClick={() => go(1)}
              >
                Suivant <ChevronRight size={16} />
              </button>
            </div>

            <a
              className="c-yt"
              href={`https://www.youtube.com/watch?v=${current.lesson.video}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} /> Ouvrir sur YouTube
            </a>
          </div>
        </div>
      )}

      <style>{`
        .cursus-page{
          --b9:#061A4A;--b8:#0A2A66;--b7:#103A8C;--b1:#E6EEFC;
          --or:#FF7A1A;--ord:#E86405;--ors:#FFF0E3;
          --ink:#0A1B44;--muted:#5F6E8A;--line:#DFE6F2;--bg:#F4F7FC;--green:#167A48;
          min-height:100vh;min-height:100dvh;background:var(--bg);color:var(--ink);
          font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          -webkit-font-smoothing:antialiased;
        }
        .cursus-page *{box-sizing:border-box}
        .c-main a{text-decoration:none;color:inherit}
        .cursus-page button{font-family:inherit;cursor:pointer}

        .c-header{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.96);border-bottom:1px solid var(--line)}
        .c-header-in{max-width:1100px;margin:0 auto;padding:0 16px;height:60px;display:flex;align-items:center;justify-content:space-between;gap:16px}
        .c-brand{font-size:19px;font-weight:800;letter-spacing:-.4px;color:var(--b8)}
        .c-brand span{color:var(--or)}
        .c-nav{display:none;gap:4px}
        .c-nav a{padding:8px 12px;border-radius:8px;font-size:14px;font-weight:600;color:var(--muted)}
        .c-nav a.on,.c-nav a:hover{color:var(--b8);background:var(--b1)}
        .c-burger{border:0;background:var(--b1);color:var(--b8);width:42px;height:42px;border-radius:10px;display:grid;place-items:center}
        .c-overlay{position:fixed;inset:0;z-index:50;background:rgba(6,26,74,.5)}
        .c-mobile{position:absolute;top:0;right:0;bottom:0;width:min(300px,86vw);background:#fff;padding:70px 20px 20px;display:flex;flex-direction:column;gap:4px}
        .c-mobile a{padding:14px 12px;border-radius:10px;font-weight:600;font-size:16px}
        .c-mobile a.on{background:var(--ors);color:var(--ord)}
        .c-mobile .c-close{position:absolute;top:12px;right:12px}
        .c-close{border:0;background:var(--b1);color:var(--b8);width:38px;height:38px;border-radius:10px;display:grid;place-items:center;flex:none}

        .c-main{max-width:1100px;margin:0 auto;padding:92px 16px 60px}

        .c-hero{background:linear-gradient(135deg,var(--b9),var(--b7));color:#fff;border-radius:20px;padding:24px 20px}
        .c-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;letter-spacing:1.2px;color:#FFB27A;margin-bottom:10px}
        .c-hero h1{margin:0;font-size:clamp(24px,6vw,38px);line-height:1.15;letter-spacing:-.8px;font-weight:800}
        .c-hero h1 span{color:var(--or);display:block}
        .c-hero p{margin:12px 0 16px;color:#C9D6F2;font-size:15px;line-height:1.55;max-width:560px}
        .c-pills{display:flex;flex-wrap:wrap;gap:8px}
        .c-pills span{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.12);color:#fff}

        .c-notice{display:flex;gap:12px;margin-top:14px;background:#fff;border:1px solid var(--line);border-left:4px solid var(--or);border-radius:14px;padding:14px 16px;color:var(--ord)}
        .c-notice svg{flex:none;margin-top:1px}
        .c-notice strong{display:block;color:var(--ink);font-size:14px;line-height:1.4}
        .c-notice summary{cursor:pointer;color:var(--b7);font-size:13px;font-weight:700;margin-top:6px}
        .c-notice p{margin:8px 0 0;color:var(--muted);font-size:13px;line-height:1.6}

        .c-tracks{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}
        .c-track{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;border:3px solid transparent;border-radius:18px;padding:14px;color:#fff;transition:transform .15s,box-shadow .15s,opacity .15s;opacity:.72}
        .c-track.trading{background:linear-gradient(135deg,#061A4A,#103A8C)}
        .c-track.brvm{background:linear-gradient(135deg,#E86405,#FF8F3D)}
        .c-track.active{opacity:1;border-color:#fff;box-shadow:0 0 0 3px var(--or),0 10px 24px rgba(6,26,74,.28);transform:translateY(-2px)}
        .c-track.brvm.active{box-shadow:0 0 0 3px var(--b8),0 10px 24px rgba(232,100,5,.35)}
        .c-track-icon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:rgba(255,255,255,.2);color:#fff;margin-bottom:4px}
        .c-track-title{font-size:20px;font-weight:800;color:#fff}
        .c-track-sub{font-size:12px;color:rgba(255,255,255,.88);line-height:1.35}
        .c-track-count{margin-top:4px;font-size:12px;font-weight:700;color:#fff;background:rgba(255,255,255,.2);padding:3px 9px;border-radius:999px}
        .c-track-state{margin-top:6px;font-size:12px;font-weight:800;color:#fff;text-decoration:underline;text-underline-offset:3px}

        .c-panel{--acc:#0A2A66;--acc2:#103A8C;--acc-soft:#E6EEFC;margin-top:18px}
        .c-panel[data-track="brvm"]{--acc:#E86405;--acc2:#FF8F3D;--acc-soft:#FFF0E3}
        .c-track-intro{margin:0 0 12px;padding:18px 18px 16px;border-radius:18px;color:#fff;background:linear-gradient(135deg,var(--acc),var(--acc2))}
        .c-track-intro h2{margin:0 0 6px;font-size:22px;letter-spacing:-.4px;color:#fff}
        .c-track-intro p{margin:0 0 8px;color:rgba(255,255,255,.92);font-size:14px;line-height:1.55}
        .c-track-intro small{color:#fff;font-weight:700;font-size:12px;background:rgba(255,255,255,.2);padding:3px 9px;border-radius:999px}

        .c-modules{display:flex;flex-direction:column;gap:10px}
        .c-module{background:#fff;border:1px solid var(--line);border-left:5px solid var(--acc);border-radius:16px;overflow:hidden}
        .c-module.open{border-color:var(--acc);background:var(--acc-soft)}
        .c-module-head{width:100%;display:flex;align-items:center;gap:12px;background:none;border:0;padding:14px;text-align:left;color:var(--ink)}
        .c-num{flex:none;width:36px;height:36px;border-radius:11px;display:grid;place-items:center;background:var(--acc);color:#fff;font-weight:800;font-size:13px}
        .c-num.ok{background:var(--green);color:#fff}
        .c-module-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
        .c-module-text strong{font-size:15px;line-height:1.3}
        .c-module-text small{color:var(--muted);font-size:12px;font-weight:600}
        .c-chev{color:var(--muted);transition:transform .15s;flex:none}
        .c-module.open .c-chev{transform:rotate(90deg)}
        .c-module-body{padding:0 14px 14px}
        .c-module-body>p{margin:0 0 10px;color:var(--muted);font-size:13.5px;line-height:1.55}

        .c-lessons{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .c-lessons li{display:flex;align-items:center;gap:8px}
        .c-lesson{flex:1;min-width:0;display:flex;align-items:center;gap:12px;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:8px;text-align:left;color:var(--ink)}
        .c-lesson{background:#fff}
        .c-lesson:hover{border-color:var(--acc)}
        .c-thumb{position:relative;flex:none;width:108px;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:var(--b8)}
        .c-thumb img{width:100%;height:100%;object-fit:cover;display:block}
        .c-play{position:absolute;right:6px;bottom:6px;width:24px;height:24px;border-radius:50%;background:var(--acc);color:#fff;display:grid;place-items:center}
        .c-lesson-text{min-width:0;display:flex;flex-direction:column;gap:3px}
        .c-lesson-text strong{font-size:14px;line-height:1.3}
        .c-lesson-text small{color:var(--muted);font-size:12px}
        .c-check{flex:none;width:36px;height:36px;border-radius:50%;border:2px solid var(--line);background:#fff;color:transparent;display:grid;place-items:center}
        .c-check.on{background:var(--green);border-color:var(--green);color:#fff}

        .c-player-bg{position:fixed;inset:0;z-index:60;background:rgba(6,26,74,.82);display:flex;align-items:center;justify-content:center;padding:12px}
        .c-player{width:100%;max-width:860px;max-height:100%;overflow:auto;background:#fff;border-radius:18px;padding:14px}
        .c-player-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px}
        .c-player-top small{display:block;color:var(--ord);font-weight:700;font-size:12px;margin-bottom:2px}
        .c-player-top strong{font-size:16px;line-height:1.3}
        .c-video{position:relative;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden}
        .c-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
        .c-player-bar{display:flex;gap:8px;margin-top:12px}
        .c-player-bar button{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;border-radius:12px;border:1px solid var(--line);background:#fff;color:var(--b8);font-weight:700;font-size:13px}
        .c-player-bar button:disabled{opacity:.4;cursor:default}
        .c-player-bar button.mid{flex:1.5;background:var(--ors);border-color:#FFD2AE;color:var(--ord)}
        .c-player-bar button.mid.on{background:var(--green);border-color:var(--green);color:#fff}
        .c-yt{display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:13px;font-weight:700;color:var(--b7)}

        @media (min-width:760px){
          .c-nav{display:flex}
          .c-burger{display:none}
          .c-main{padding:106px 24px 80px}
          .c-hero{padding:38px 40px}
          .c-track{padding:20px}
          .c-track-title{font-size:24px}
          .c-thumb{width:160px}
          .c-player{padding:20px}
        }
        @media (max-width:380px){
          .c-thumb{width:92px}
          .c-track{padding:12px}
        }
        @media (prefers-reduced-motion:reduce){*{transition:none!important}}
      `}</style>
    </div>
  );
}

export default Cursus;
