import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Ferme le menu lorsqu'on change de page
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Empêche le scroll lorsque le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navItems = [
    {
      label: "Accueil",
      path: "/",
    },
    {
      label: "Cursus",
      path: "/connexion-cursus",
    },
    {
      label: "Services",
      path: "/services",
    },
    {
      label: "Parrainage",
      path: "/connexion-parrainage",
    },
  ];

  return (
    <>
      <style>{`
        :root {
          --phi-navy: #0B132B;
          --phi-navy-soft: #111C38;
          --phi-gold: #D4AF37;
          --phi-white: #FFFFFF;
          --phi-text: #E8ECF5;
          --phi-muted: #9AA5BC;
          --phi-border: rgba(255,255,255,0.09);
        }

        /* =========================
           NAVBAR
        ========================= */

        .phi-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;

          height: 76px;

          display: flex;
          align-items: center;

          background:
            linear-gradient(
              180deg,
              rgba(11,19,43,0.94),
              rgba(11,19,43,0.82)
            );

          border-bottom: 1px solid var(--phi-border);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          transition:
            background 0.3s ease,
            box-shadow 0.3s ease;
        }

        .phi-navbar-inner {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* =========================
           BRAND / LOGO
        ========================= */

        .phi-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;

          color: var(--phi-white);
          text-decoration: none;

          position: relative;
          z-index: 1002;
        }

        .phi-brand-mark {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          background: var(--phi-navy);

          border: 1px solid rgba(212,175,55,0.45);

          box-shadow:
            0 8px 30px rgba(0,0,0,0.18);

          position: relative;
        }

        .phi-brand-mark img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
        }

        .phi-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .phi-brand-name {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .phi-brand-subtitle {
          margin-top: 5px;

          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.22em;

          color: var(--phi-gold);
          text-transform: uppercase;
        }

        /* =========================
           DESKTOP MENU
        ========================= */

        .phi-desktop-nav {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .phi-nav-link {
          position: relative;

          display: inline-flex;
          align-items: center;

          height: 42px;
          padding: 0 17px;

          border-radius: 12px;

          color: var(--phi-muted);
          text-decoration: none;

          font-size: 13px;
          font-weight: 650;

          transition:
            color 0.25s ease,
            background 0.25s ease,
            transform 0.25s ease;
        }

        .phi-nav-link:hover {
          color: var(--phi-white);

          background: rgba(255,255,255,0.055);

          transform: translateY(-1px);
        }

        .phi-nav-link.active {
          color: var(--phi-white);

          background:
            linear-gradient(
              135deg,
              rgba(212,175,55,0.14),
              rgba(212,175,55,0.045)
            );
        }

        .phi-nav-link.active::after {
          content: "";

          position: absolute;

          left: 17px;
          right: 17px;
          bottom: 5px;

          height: 2px;

          border-radius: 999px;

          background: var(--phi-gold);

          box-shadow:
            0 0 10px rgba(212,175,55,0.55);
        }

        /* =========================
           ACTION
        ========================= */

        .phi-nav-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          height: 42px;
          padding: 0 18px;

          margin-left: 10px;

          border-radius: 13px;

          color: var(--phi-navy);
          background: var(--phi-gold);

          text-decoration: none;

          font-size: 12px;
          font-weight: 800;

          box-shadow:
            0 8px 25px rgba(212,175,55,0.16);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }

        .phi-nav-action:hover {
          transform: translateY(-2px);

          background: #e0bd42;

          box-shadow:
            0 12px 32px rgba(212,175,55,0.24);
        }

        /* =========================
           MOBILE BUTTON
        ========================= */

        .phi-menu-button {
          display: none;

          width: 44px;
          height: 44px;

          border: 1px solid var(--phi-border);
          border-radius: 13px;

          background: rgba(255,255,255,0.04);

          cursor: pointer;

          position: relative;
          z-index: 1002;
        }

        .phi-menu-lines {
          width: 20px;
          height: 16px;

          position: absolute;

          top: 50%;
          left: 50%;

          transform: translate(-50%, -50%);
        }

        .phi-menu-line {
          position: absolute;

          left: 0;

          width: 20px;
          height: 2px;

          border-radius: 999px;

          background: var(--phi-white);

          transition:
            transform 0.28s ease,
            top 0.28s ease,
            opacity 0.2s ease;
        }

        .phi-menu-line:nth-child(1) {
          top: 1px;
        }

        .phi-menu-line:nth-child(2) {
          top: 7px;
        }

        .phi-menu-line:nth-child(3) {
          top: 13px;
        }

        .phi-menu-button.open .phi-menu-line:nth-child(1) {
          top: 7px;
          transform: rotate(45deg);
        }

        .phi-menu-button.open .phi-menu-line:nth-child(2) {
          opacity: 0;
        }

        .phi-menu-button.open .phi-menu-line:nth-child(3) {
          top: 7px;
          transform: rotate(-45deg);
        }

        /* =========================
           MOBILE OVERLAY
        ========================= */

        .phi-mobile-overlay {
          position: fixed;

          inset: 0;

          z-index: 999;

          background: rgba(2,7,20,0.58);

          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);

          opacity: 0;
          pointer-events: none;

          transition: opacity 0.3s ease;
        }

        .phi-mobile-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* =========================
           MOBILE PANEL
        ========================= */

        .phi-mobile-panel {
          position: fixed;

          top: 0;
          right: 0;

          width: min(390px, 88vw);
          height: 100dvh;

          z-index: 1001;

          padding:
            100px
            28px
            35px;

          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(212,175,55,0.08),
              transparent 32%
            ),
            var(--phi-navy);

          border-left: 1px solid var(--phi-border);

          transform: translateX(105%);

          transition:
            transform 0.38s cubic-bezier(.22,.61,.36,1);

          box-shadow:
            -20px 0 60px rgba(0,0,0,0.3);
        }

        .phi-mobile-panel.open {
          transform: translateX(0);
        }

        .phi-mobile-heading {
          margin-bottom: 25px;
        }

        .phi-mobile-heading-small {
          font-size: 10px;
          font-weight: 700;

          letter-spacing: 0.18em;

          text-transform: uppercase;

          color: var(--phi-gold);
        }

        .phi-mobile-heading-title {
          margin-top: 7px;

          font-size: 26px;
          font-weight: 800;

          color: var(--phi-white);

          letter-spacing: -0.03em;
        }

        .phi-mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .phi-mobile-link {
          min-height: 58px;

          padding: 0 17px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-radius: 15px;

          border: 1px solid transparent;

          color: var(--phi-muted);

          text-decoration: none;

          font-size: 15px;
          font-weight: 650;

          transition:
            color 0.25s ease,
            background 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .phi-mobile-link:hover {
          color: var(--phi-white);
          transform: translateX(3px);
        }

        .phi-mobile-link.active {
          color: var(--phi-white);

          background:
            linear-gradient(
              135deg,
              rgba(212,175,55,0.14),
              rgba(212,175,55,0.04)
            );

          border-color:
            rgba(212,175,55,0.18);
        }

        .phi-mobile-arrow {
          color: var(--phi-gold);

          font-size: 17px;

          transition: transform 0.25s ease;
        }

        .phi-mobile-link:hover .phi-mobile-arrow,
        .phi-mobile-link.active .phi-mobile-arrow {
          transform: translateX(3px);
        }

        .phi-mobile-footer {
          position: absolute;

          left: 28px;
          right: 28px;
          bottom: 30px;

          padding-top: 18px;

          border-top: 1px solid var(--phi-border);
        }

        .phi-mobile-footer-text {
          color: var(--phi-muted);

          font-size: 11px;
          line-height: 1.6;
        }

        .phi-mobile-footer-highlight {
          color: var(--phi-gold);
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 900px) {
          .phi-desktop-nav {
            display: none;
          }

          .phi-menu-button {
            display: block;
          }

          .phi-navbar-inner {
            width: min(100% - 28px, 1180px);
          }
        }

        @media (max-width: 520px) {
          .phi-navbar {
            height: 68px;
          }

          .phi-brand-mark {
            width: 35px;
            height: 35px;
          }

          .phi-brand-name {
            font-size: 13px;
          }

          .phi-brand-subtitle {
            font-size: 7px;
          }

          .phi-mobile-panel {
            width: 100%;
            padding-left: 22px;
            padding-right: 22px;
          }

          .phi-mobile-footer {
            left: 22px;
            right: 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .phi-navbar *,
          .phi-mobile-overlay,
          .phi-mobile-panel {
            transition: none !important;
          }
        }
      `}</style>

      <header className="phi-navbar">
        <div className="phi-navbar-inner">

          <Link
            to="/"
            className="phi-brand"
            aria-label="PHI Academy - Accueil"
          >
            <span className="phi-brand-mark">
              <img
                src="/images/logo/phi-logo.png"
                alt="PHI Academy"
              />
            </span>

            <span className="phi-brand-text">
              <span className="phi-brand-name">
                PHI ACADEMY
              </span>

              <span className="phi-brand-subtitle">
                Trading • Formation • Mentoring
              </span>
            </span>
          </Link>

          <nav
            className="phi-desktop-nav"
            aria-label="Navigation principale"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `phi-nav-link ${isActive ? "active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/services"
              className="phi-nav-action"
            >
              Découvrir
            </Link>
          </nav>

          <button
            type="button"
            className={`phi-menu-button ${
              menuOpen ? "open" : ""
            }`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={
              menuOpen
                ? "Fermer le menu"
                : "Ouvrir le menu"
            }
            aria-expanded={menuOpen}
          >
            <span className="phi-menu-lines">
              <span className="phi-menu-line" />
              <span className="phi-menu-line" />
              <span className="phi-menu-line" />
            </span>
          </button>

        </div>
      </header>

      <div
        className={`phi-mobile-overlay ${
          menuOpen ? "open" : ""
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`phi-mobile-panel ${
          menuOpen ? "open" : ""
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="phi-mobile-heading">
          <div className="phi-mobile-heading-small">
            PHI Academy
          </div>

          <div className="phi-mobile-heading-title">
            Explorer
          </div>
        </div>

        <nav
          className="phi-mobile-nav"
          aria-label="Navigation mobile"
        >
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `phi-mobile-link ${
                  isActive ? "active" : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <span>
                {String(index + 1).padStart(2, "0")}
                {"  "}
                {item.label}
              </span>

              <span className="phi-mobile-arrow">
                →
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="phi-mobile-footer">
          <div className="phi-mobile-footer-text">
            Apprendre, développer ses compétences et
            découvrir les services de{" "}
            <span className="phi-mobile-footer-highlight">
              PHI Academy
            </span>.
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;