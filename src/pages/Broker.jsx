import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Check,
  ExternalLink,
  Headphones,
  KeyRound,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import {
  ACCOMPANIMENT_PRICE,
  BROKERS,
  FILTERS,
  SUPPORT_WHATSAPP,
} from "../data/brokersData";

const PRICE_LABEL = `${ACCOMPANIMENT_PRICE.toLocaleString("fr-FR")} FCFA`;

const STEPS = [
  {
    title: "Choisir le bon broker",
    text: "Selon votre pays et votre objectif (trading ou crypto).",
  },
  {
    title: "Créer le compte",
    text: "Inscription pas à pas, depuis le site officiel du broker.",
  },
  {
    title: "Vérifier son identité",
    text: "Les documents demandés et comment les envoyer correctement.",
  },
  {
    title: "Installer la plateforme",
    text: "MetaTrader ou application mobile, prête à l'emploi.",
  },
  {
    title: "Premier dépôt en sécurité",
    text: "Comprendre comment déposer et retirer. Vous gardez la main sur votre argent.",
  },
];

const SAFETY = [
  "Ouvrez toujours votre compte depuis le site officiel du broker.",
  "Votre argent reste sur votre compte chez le broker, jamais chez PHI Academy.",
  "Ne communiquez jamais votre mot de passe, à personne, même à nous.",
  "Méfiez-vous de ceux qui promettent des gains garantis ou « gèrent » votre compte.",
];

function whatsappLink(message) {
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
    message
  )}`;
}

/*
 * Logo réel du broker : 1) /public/brokers/<id>.png si vous l'ajoutez,
 * 2) à défaut l'icône officielle du site, 3) sinon les initiales.
 */
function BrokerLogo({ broker }) {
  const sources = [
    broker.logo,
    `https://www.google.com/s2/favicons?domain=${broker.domain}&sz=128`,
  ].filter(Boolean);

  const [index, setIndex] = useState(0);

  if (index >= sources.length) {
    return <span className="b-logo b-logo-text">{broker.initials}</span>;
  }

  return (
    <span className="b-logo">
      <img
        src={sources[index]}
        alt={`Logo ${broker.name}`}
        loading="lazy"
        onError={() => setIndex((value) => value + 1)}
      />
    </span>
  );
}

function Broker() {
  const [filter, setFilter] = useState("all");

  const brokers = useMemo(
    () =>
      BROKERS.filter(
        (broker) => filter === "all" || broker.region === filter
      ),
    [filter]
  );

  return (
    <div className="broker-page">
      <Navbar />

      <main className="b-main">
        {/* ===== INTRO ===== */}

        <section className="b-hero">
          <span className="b-eyebrow">
            <BadgeCheck size={14} /> BROKERS RECOMMANDÉS
          </span>

          <h1>
            Ouvrez votre compte <span>chez un broker fiable.</span>
          </h1>

          <p>
            Un broker est l'intermédiaire qui vous donne accès aux marchés :
            c'est chez lui que vous ouvrez votre compte pour trader. Nous
            vous présentons une sélection selon votre pays et votre
            objectif.
          </p>

          <div className="b-hero-actions">
            <a href="#brokers" className="b-btn primary">
              Voir les brokers
              <ArrowRight size={17} />
            </a>

            <a href="#accompagnement" className="b-btn ghost">
              Être accompagné
            </a>
          </div>
        </section>

        {/* ===== LISTE ===== */}

        <section id="brokers" className="b-section">
          <div className="b-section-head">
            <span>NOTRE SÉLECTION</span>
            <h2>Choisissez votre broker</h2>
          </div>

          <div className="b-filters" role="tablist" aria-label="Filtrer">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                className={filter === item.id ? "on" : ""}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="b-grid">
            {brokers.map((broker) => {
              const link = broker.partnerUrl || broker.officialUrl;

              return (
                <article
                  key={broker.id}
                  className={`b-card ${broker.region}`}
                >
                  <div className="b-card-top">
                    <BrokerLogo broker={broker} />

                    <div>
                      <h3>{broker.name}</h3>
                      <small>{broker.type}</small>
                    </div>
                  </div>

                  <span className="b-tag">{broker.regionLabel}</span>

                  <p>{broker.summary}</p>

                  <ul>
                    {broker.points.map((point) => (
                      <li key={point}>
                        <Check size={15} />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <a
                    className="b-btn primary full"
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    Ouvrir un compte
                    <ExternalLink size={16} />
                  </a>
                </article>
              );
            })}
          </div>

          <p className="b-footnote">
            Certains liens sont des liens partenaires : PHI Academy peut
            recevoir une commission, sans frais supplémentaires pour vous.
            Vérifiez toujours que le service est disponible et autorisé
            dans votre pays avant de vous inscrire.
          </p>
        </section>

        {/* ===== ACCOMPAGNEMENT ===== */}

        <section id="accompagnement" className="b-help">
          <div className="b-help-head">
            <span className="b-help-icon">
              <Headphones size={22} />
            </span>

            <div>
              <span className="b-help-label">ACCOMPAGNEMENT</span>
              <h2>On vous guide, de A à Z.</h2>
            </div>
          </div>

          <p className="b-help-text">
            Pas à l'aise avec l'inscription, la vérification ou le premier
            dépôt ? Nous vous accompagnons à chaque étape, en direct, par
            appel vidéo WhatsApp avec partage d'écran.
          </p>

          <ol className="b-steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="b-step-num">{index + 1}</span>

                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="b-price">
            <div>
              <small>Accompagnement complet</small>
              <strong>{PRICE_LABEL}</strong>
              <span>
                Paiement unique. Ce montant rémunère notre aide : il ne
                correspond pas au dépôt chez le broker.
              </span>
            </div>

            <a
              className="b-btn light"
              target="_blank"
              rel="noopener noreferrer"
              href={whatsappLink(
                "Bonjour PHI Academy, je souhaite être accompagné pour ouvrir mon compte chez un broker."
              )}
            >
              <MessageCircle size={18} />
              Demander mon accompagnement
            </a>
          </div>
        </section>

        {/* ===== SÉCURITÉ ===== */}

        <section className="b-safe">
          <div className="b-safe-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2>Pour trader en sécurité</h2>

            <ul>
              {SAFETY.map((item) => (
                <li key={item}>
                  <KeyRound size={14} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="b-risk">
          <AlertTriangle size={18} />

          <p>
            Le trading de Forex et de CFD comporte un risque élevé de perte
            en capital, pouvant aller jusqu'à la totalité de votre mise.
            Les crypto-monnaies sont très volatiles. Ces informations sont
            éducatives et ne constituent pas un conseil en investissement.
            Ne déposez que de l'argent que vous pouvez vous permettre de
            perdre.
          </p>
        </section>
      </main>

      <style>{`
        .broker-page {
          --green-900: #061A4A;
          --green-800: #0A2A66;
          --green-700: #103A8C;
          --green-100: #E6EEFC;
          --green-50:  #F1F5FD;
          --blue-900: #061A4A;
          --blue-800: #0A2A66;
          --blue-700: #103A8C;
          --blue-100: #E6EEFC;
          --blue-50:  #F1F5FD;
          --orange: #FF7A1A;
          --orange-dark: #E86405;
          --orange-text: #D9590A;
          --orange-soft: #FFF0E3;
          --green: #103A8C;
          --ink: #0A1B44;
          --muted: #5F6E8A;
          --line: #DFE6F2;
          --bg: #F4F7FC;

          min-height: 100vh;
          min-height: 100dvh;
          background: var(--bg);
          color: var(--ink);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .broker-page *,
        .broker-page *::before,
        .broker-page *::after {
          box-sizing: border-box;
        }

        .b-main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 92px 16px 60px;
        }

        .b-main a {
          text-decoration: none;
        }

        /* ----- boutons ----- */

        .b-btn {
          min-height: 48px;
          padding: 0 20px;
          border-radius: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          border: 0;
          transition: transform .16s ease, background .16s ease;
        }

        .b-btn:hover { transform: translateY(-1px); }

        .b-btn.primary {
          background: var(--orange);
          color: #fff;
          box-shadow: 0 10px 22px rgba(255,122,26,.32);
        }

        .b-btn.primary:hover { background: var(--orange-dark); }

        .b-btn.ghost {
          background: rgba(255,255,255,.14);
          color: #fff;
          border: 1px solid rgba(255,255,255,.35);
        }

        .b-btn.light {
          background: #fff;
          color: var(--blue-800);
        }

        .b-btn.full { width: 100%; }

        /* ----- intro ----- */

        .b-hero {
          padding: 26px 22px;
          border-radius: 24px;
          color: #fff;
          background:
            radial-gradient(circle at 100% 0%, rgba(255,122,26,.3), transparent 50%),
            linear-gradient(135deg, var(--green-900), var(--green-800) 55%, var(--green-700));
          box-shadow: 0 16px 38px rgba(10,42,102,.28);
        }

        .b-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          color: #FFB680;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .b-hero h1 {
          margin: 0;
          font-size: clamp(28px, 7vw, 42px);
          line-height: 1.1;
          letter-spacing: -.04em;
          font-weight: 800;
        }

        .b-hero h1 span {
          display: block;
          color: #FF7A1A;
        }

        .b-hero p {
          max-width: 600px;
          margin: 14px 0 20px;
          color: #C9D6F2;
          font-size: 15px;
          line-height: 1.65;
        }

        .b-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        /* ----- liste ----- */

        .b-section { margin-top: 34px; scroll-margin-top: 92px; }

        .b-section-head span,
        .b-help-label {
          display: block;
          margin-bottom: 4px;
          color: var(--green-700);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .15em;
        }

        .b-section-head h2 {
          margin: 0 0 14px;
          color: var(--green-900);
          font-size: 26px;
          letter-spacing: -.035em;
        }

        .b-filters {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          margin-bottom: 14px;
        }

        .b-filters button {
          flex: none;
          min-height: 40px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--muted);
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .b-filters button.on {
          background: var(--green-800);
          border-color: var(--green-800);
          color: #fff;
        }

        .b-grid {
          display: grid;
          gap: 14px;
        }

        .b-card {
          padding: 20px;
          border-radius: 22px;
          background: #fff;
          border: 1px solid var(--line);
          border-top: 5px solid var(--green-700);
          box-shadow: 0 10px 28px rgba(10,42,102,.07);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }


        .b-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .b-logo {
          width: 56px;
          height: 56px;
          flex: none;
          border-radius: 15px;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #fff;
          border: 1px solid var(--line);
          box-shadow: 0 4px 12px rgba(10,42,102,.08);
        }

        .b-logo img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          display: block;
        }

        .b-logo-text {
          background: var(--green-800);
          border-color: var(--green-800);
          color: #fff;
          font-size: 16px;
          font-weight: 800;
        }

        .b-card h3 {
          margin: 0;
          color: var(--green-900);
          font-size: 21px;
          letter-spacing: -.02em;
        }

        .b-card small {
          color: var(--muted);
          font-size: 12px;
          font-weight: 600;
        }

        .b-tag {
          align-self: flex-start;
          padding: 5px 11px;
          border-radius: 999px;
          background: var(--green-100);
          color: var(--green-800);
          font-size: 12px;
          font-weight: 700;
        }

        .b-card p {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .b-card ul {
          list-style: none;
          margin: 0 0 4px;
          padding: 0;
          display: grid;
          gap: 7px;
        }

        .b-card li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 600;
        }

        .b-card li svg {
          flex: none;
          margin-top: 1px;
          color: var(--green);
        }

        .b-card .b-btn { margin-top: auto; }

        .b-footnote {
          margin: 14px 2px 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.6;
        }

        /* ----- accompagnement ----- */

        .b-help {
          margin-top: 34px;
          padding: 22px;
          border-radius: 24px;
          color: #fff;
          scroll-margin-top: 92px;
          background:
            radial-gradient(circle at 100% 0%, rgba(255,122,26,.3), transparent 50%),
            linear-gradient(135deg, var(--blue-900), var(--blue-800) 55%, var(--blue-700));
          box-shadow: 0 16px 38px rgba(10,42,102,.28);
        }

        .b-help-head {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .b-help-icon {
          width: 48px;
          height: 48px;
          flex: none;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,.2);
        }

        .b-help-label { color: #FFB680; }

        .b-help h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -.03em;
        }

        .b-help-text {
          margin: 14px 0 16px;
          color: rgba(255,255,255,.92);
          font-size: 14px;
          line-height: 1.65;
        }

        .b-steps {
          list-style: none;
          margin: 0 0 18px;
          padding: 0;
          display: grid;
          gap: 10px;
        }

        .b-steps li {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 14px;
          background: rgba(255,255,255,.14);
        }

        .b-step-num {
          width: 30px;
          height: 30px;
          flex: none;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #fff;
          color: var(--blue-800);
          font-size: 14px;
          font-weight: 800;
        }

        .b-steps strong { font-size: 14px; }

        .b-steps p {
          margin: 2px 0 0;
          color: rgba(255,255,255,.88);
          font-size: 13px;
          line-height: 1.5;
        }

        .b-price {
          padding: 16px;
          border-radius: 18px;
          background: var(--green-900);
          display: grid;
          gap: 14px;
        }

        .b-price small {
          display: block;
          color: #FFB680;
          font-size: 12px;
          font-weight: 700;
        }

        .b-price strong {
          display: block;
          margin: 2px 0 6px;
          font-size: 32px;
          letter-spacing: -.03em;
        }

        .b-price span {
          display: block;
          color: #C9D6F2;
          font-size: 12px;
          line-height: 1.55;
        }

        /* ----- sécurité ----- */

        .b-safe {
          margin-top: 18px;
          padding: 20px;
          display: flex;
          gap: 14px;
          border-radius: 20px;
          background: #fff;
          border: 1px solid var(--line);
          border-left: 5px solid var(--green-700);
        }

        .b-safe-icon {
          width: 44px;
          height: 44px;
          flex: none;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: var(--green-800);
          color: #fff;
        }

        .b-safe h2 {
          margin: 0 0 10px;
          color: var(--green-900);
          font-size: 18px;
        }

        .b-safe ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 8px;
        }

        .b-safe li {
          display: flex;
          gap: 8px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.55;
        }

        .b-safe li svg {
          flex: none;
          margin-top: 3px;
          color: var(--green-700);
        }

        .b-risk {
          margin-top: 14px;
          padding: 14px 16px;
          display: flex;
          gap: 10px;
          border-radius: 16px;
          background: var(--orange-soft);
          color: var(--orange-text);
        }

        .b-risk svg { flex: none; margin-top: 2px; }

        .b-risk p {
          margin: 0;
          color: #8A4410;
          font-size: 12px;
          line-height: 1.65;
        }

        /* ----- grands écrans ----- */

        @media (min-width: 760px) {
          .b-main { padding: 116px 24px 80px; }
          .b-hero { padding: 40px; }
          .b-grid { grid-template-columns: 1fr 1fr; }
          .b-help { padding: 32px; }
          .b-steps { grid-template-columns: 1fr 1fr; }
          .b-price {
            grid-template-columns: 1fr auto;
            align-items: center;
          }
        }

        @media (max-width: 520px) {
          .b-main { padding-top: 84px; }
          .b-btn { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .broker-page *, .broker-page *::before, .broker-page *::after {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Broker;
