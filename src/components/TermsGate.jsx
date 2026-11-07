import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const POINTS = [
  {
    title: "Contenu éducatif",
    text: "Aucun conseil en investissement, aucun gain garanti. Le trading comporte un risque de perte pouvant aller jusqu’à la totalité du capital.",
  },
  {
    title: "Compte personnel",
    text: "Votre accès est à vous seul : ne le partagez pas et ne revendez pas le contenu.",
  },
  {
    title: "Paiement",
    text: "Accès payé une seule fois (15 000 FCFA), non remboursable une fois activé, sauf problème technique ou double paiement.",
  },
  {
    title: "Parrainage",
    text: "3 000 FCFA par filleul, puis 5 000 FCFA dès le 11e. Retrait dès 10 000 FCFA, avec 7 % de frais. Faux comptes interdits.",
  },
  {
    title: "Vos données",
    text: "Nom, email, téléphone et mot de passe chiffré, utilisés uniquement pour faire fonctionner votre compte. Jamais vendus. Les paiements sont traités par PayDunya.",
  },
  {
    title: "Cookies",
    text: "Uniquement des cookies nécessaires pour vous garder connecté. Aucune publicité, aucun suivi.",
  },
];

/*
 * Écran d'acceptation affiché UNE SEULE FOIS, à la première connexion.
 * L'acceptation est enregistrée sur le compte (date + version).
 */
export default function TermsGate() {
  const location = useLocation();
  const [needed, setNeeded] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setNeeded(false);
      return undefined;
    }

    let cancelled = false;

    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.user) {
          setNeeded(d.user.termsAccepted === false);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!needed) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [needed]);

  async function accept() {
    if (!checked || saving) return;
    setSaving(true);
    setError("");

    try {
      const r = await fetch("/api/auth/accept-terms", {
        method: "POST",
        credentials: "include",
      });
      if (!r.ok) throw new Error();
      setNeeded(false);
    } catch {
      setError("Impossible d’enregistrer. Réessayez dans un instant.");
    } finally {
      setSaving(false);
    }
  }

  if (!needed) return null;

  return (
    <div className="tg-overlay" role="dialog" aria-modal="true" aria-labelledby="tg-title">
      <div className="tg-card">
        <span className="tg-icon">
          <ShieldCheck size={22} />
        </span>
        <h2 id="tg-title">Avant de continuer</h2>
        <p className="tg-lead">
          Quelques règles simples pour utiliser PHI Academy en toute confiance.
        </p>

        <ul className="tg-list">
          {POINTS.map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong>
              <span>{p.text}</span>
            </li>
          ))}
        </ul>

        <label className="tg-check">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>
            J’ai lu et j’accepte les conditions d’utilisation, la politique de
            confidentialité et l’usage des cookies nécessaires.
          </span>
        </label>

        {error && <p className="tg-error">{error}</p>}

        <button
          type="button"
          className="tg-btn"
          disabled={!checked || saving}
          onClick={accept}
        >
          {saving ? "Enregistrement..." : "Continuer"}
        </button>
      </div>

      <style>{`
        .tg-overlay{
          position:fixed; inset:0; z-index:3000; display:flex;
          align-items:center; justify-content:center; padding:14px;
          background:rgba(6,26,74,.78); backdrop-filter:blur(4px);
          font-family:Inter,"Segoe UI",system-ui,sans-serif;
        }
        .tg-overlay *{box-sizing:border-box; font-family:inherit}
        .tg-card{
          width:100%; max-width:520px; max-height:calc(100vh - 28px);
          overflow-y:auto; background:#fff; border-radius:22px;
          padding:26px 24px; box-shadow:0 30px 80px rgba(0,0,0,.35);
          border-top:5px solid #FF7A1A; color:#0A1B44;
        }
        .tg-icon{
          display:inline-flex; width:44px; height:44px; border-radius:13px;
          align-items:center; justify-content:center;
          background:#E6EEFC; color:#103A8C; margin-bottom:10px;
        }
        .tg-card h2{margin:0 0 6px; font-size:22px; font-weight:800; color:#0A2A66}
        .tg-lead{margin:0 0 16px; font-size:14px; color:#5F6E8A; line-height:1.5}
        .tg-list{list-style:none; margin:0 0 16px; padding:0; display:grid; gap:10px}
        .tg-list li{
          display:grid; gap:2px; padding:10px 12px; border-radius:12px;
          background:#F1F5FD; border:1px solid #DFE6F2;
        }
        .tg-list strong{font-size:13px; color:#103A8C}
        .tg-list span{font-size:13.5px; line-height:1.5; color:#26365C}
        .tg-check{
          display:flex; gap:10px; align-items:flex-start; padding:12px;
          border-radius:12px; background:#FFF0E3; border:1px solid #FFD9B8;
          font-size:13.5px; line-height:1.5; color:#5A2B05; cursor:pointer;
        }
        .tg-check input{width:20px; height:20px; flex:none; margin-top:1px; accent-color:#FF7A1A; cursor:pointer}
        .tg-error{margin:10px 0 0; font-size:13px; color:#A33A2A}
        .tg-btn{
          width:100%; height:50px; margin-top:14px; border:0; border-radius:13px;
          background:#FF7A1A; color:#fff; font-size:15px; font-weight:800; cursor:pointer;
          transition:background .15s, opacity .15s;
        }
        .tg-btn:hover:not(:disabled){background:#E86405}
        .tg-btn:disabled{opacity:.45; cursor:not-allowed}
        @media (max-width:520px){ .tg-card{padding:22px 18px} }
      `}</style>
    </div>
  );
}
