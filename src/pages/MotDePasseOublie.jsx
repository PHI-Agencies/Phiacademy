import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Headphones, ShieldCheck } from "lucide-react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";

const SUPPORT_WHATSAPP = "22656918108";
const SUPPORT_MESSAGE =
  "Bonjour, j'ai oublié mon mot de passe PHI Academy et je n'arrive pas à me connecter.";

const supportHref = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
  SUPPORT_MESSAGE
)}`;

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT}"]`);

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    /* réponse vide */
  }

  return { ok: response.ok, status: response.status, data };
}

function MotDePasseOublie() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const scope = params.get("scope") === "parrainage" ? "parrainage" : "cursus";
  const backTo =
    scope === "parrainage" ? "/connexion-parrainage" : "/connexion-cursus";

  const buttonRef = useRef(null);

  const [googleReady, setGoogleReady] = useState(false);
  const [googleFailed, setGoogleFailed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [credential, setCredential] = useState("");
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [noAccount, setNoAccount] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  /* ---------- Bouton Google ---------- */

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || account) return undefined;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogle,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          locale: "fr",
          width: 300,
        });

        setGoogleReady(true);
      })
      .catch(() => {
        if (!cancelled) setGoogleFailed(true);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  async function handleGoogle(response) {
    setMessage("");
    setNoAccount(false);
    setChecking(true);

    try {
      const { ok, status, data } = await postJson("/api/auth/google-check", {
        credential: response.credential,
      });

      if (!ok) {
        if (status === 404) setNoAccount(true);
        setMessage(data.message || "Confirmation impossible. Réessayez.");
        return;
      }

      setCredential(response.credential);
      setAccount({ firstName: data.firstName, email: data.email });
    } catch {
      setMessage("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setChecking(false);
    }
  }

  /* ---------- Nouveau mot de passe ---------- */

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirm) {
      setMessage("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    setSaving(true);

    try {
      const { ok, data } = await postJson("/api/auth/google-reset", {
        credential,
        newPassword: password,
        scope,
      });

      if (!ok) {
        setMessage(data.message || "Impossible de modifier le mot de passe.");

        // Confirmation expirée : on repart de zéro
        if (/expir|invalide/i.test(data.message || "")) {
          setAccount(null);
          setCredential("");
        }
        return;
      }

      navigate(data.redirect || "/cursus");
    } catch {
      setMessage("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mdp-page">
      <main className="mdp-container">
        <div className="mdp-top">
          <div className="mdp-wordmark">
            PHI <span>ACADEMY</span>
          </div>
          <h1>Mot de passe oublié</h1>
          <p>
            {account
              ? "Dernière étape : choisissez un nouveau mot de passe."
              : "Choisissez comment retrouver l’accès à votre compte."}
          </p>
        </div>

        <section className="mdp-card">
          {message && <div className="mdp-message">{message}</div>}

          {account ? (
            <form className="mdp-form" onSubmit={handleSubmit}>
              <div className="mdp-ok">
                <ShieldCheck size={20} />
                <div>
                  <strong>Bonjour {account.firstName}</strong>
                  <span>Votre adresse {account.email} est confirmée par Google.</span>
                </div>
              </div>

              <div className="mdp-field">
                <label htmlFor="new-password">Nouveau mot de passe</label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  required
                />
              </div>

              <div className="mdp-field">
                <label htmlFor="confirm-password">Confirmer le mot de passe</label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  required
                />
              </div>

              <button className="mdp-submit" type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer et accéder à mon compte"}
              </button>
            </form>
          ) : (
            <div className="mdp-options">
              <div className="mdp-option">
                <h2>Avec mon adresse Gmail</h2>
                <p>
                  Confirmez votre adresse Gmail avec Google pour retrouver
                  l’accès immédiatement.
                </p>

                {GOOGLE_CLIENT_ID && !googleFailed ? (
                  <div className="mdp-google">
                    <div ref={buttonRef} />
                    {!googleReady && (
                      <span className="mdp-wait">Chargement de Google...</span>
                    )}
                    {checking && (
                      <span className="mdp-wait">Vérification en cours...</span>
                    )}
                  </div>
                ) : (
                  <p className="mdp-soft">
                    La confirmation par Google n’est pas disponible pour
                    le moment. Utilisez le service client.
                  </p>
                )}

                <small>Seules les adresses Gmail sont acceptées.</small>
              </div>

              <div className="mdp-sep">
                <span>ou</span>
              </div>

              <div className={`mdp-option ${noAccount ? "highlight" : ""}`}>
                <h2>Contacter le service client</h2>
                <p>
                  Notre équipe vous aide à retrouver votre compte sur
                  WhatsApp.
                </p>
                <a
                  className="mdp-support"
                  href={supportHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Headphones size={18} /> Écrire au service client
                </a>
              </div>
            </div>
          )}
        </section>

        <Link to={backTo} className="mdp-back">
          ← Retour à la connexion
        </Link>
      </main>

      <style>{`
        .mdp-page{
          --blue-900:#061A4A; --blue-800:#0A2A66; --blue-700:#103A8C;
          --blue-100:#E6EEFC; --blue-50:#F1F5FD;
          --orange:#FF7A1A; --orange-dark:#E86405; --orange-soft:#FFF0E3;
          --ink:#0A1B44; --muted:#5F6E8A; --line:#DFE6F2;
          min-height:100vh; display:flex; justify-content:center;
          padding:28px 16px 48px; color:var(--ink);
          background:linear-gradient(180deg,#EAF0FC 0%,#F4F7FC 45%);
          font-family:Inter,"Segoe UI",system-ui,-apple-system,sans-serif;
        }
        .mdp-page *{box-sizing:border-box; font-family:inherit}
        .mdp-container{width:100%; max-width:440px}
        .mdp-top{text-align:center; margin:14px 0 20px}
        .mdp-wordmark{font-size:22px; font-weight:800; color:var(--blue-800); letter-spacing:-.3px}
        .mdp-wordmark span{color:var(--orange)}
        .mdp-top h1{margin:14px 0 6px; font-size:26px; font-weight:800; color:var(--blue-800); letter-spacing:-.4px}
        .mdp-top p{margin:0; font-size:14px; color:var(--muted); line-height:1.5}

        .mdp-card{
          background:#fff; border:1px solid var(--line); border-top:4px solid var(--orange);
          border-radius:24px; padding:22px; box-shadow:0 20px 50px rgba(10,42,102,.12);
        }
        .mdp-message{
          padding:12px 14px; margin-bottom:14px; border-radius:12px;
          background:#FFF3F0; border:1px solid #F6CFC6; color:#A33A2A;
          font-size:13px; line-height:1.45;
        }

        .mdp-options{display:grid; gap:4px}
        .mdp-option{padding:16px; border-radius:16px; background:var(--blue-50); border:1px solid var(--line)}
        .mdp-option.highlight{background:var(--orange-soft); border-color:#FFD9B8}
        .mdp-option h2{margin:0 0 4px; font-size:16px; font-weight:800; color:var(--blue-800)}
        .mdp-option p{margin:0 0 12px; font-size:13.5px; line-height:1.5; color:var(--muted)}
        .mdp-option small{display:block; margin-top:10px; font-size:12px; color:var(--muted)}
        .mdp-soft{font-size:13px !important; color:#8A4410 !important}
        .mdp-google{display:grid; justify-items:center; gap:6px; min-height:44px}
        .mdp-wait{font-size:12px; color:var(--muted)}
        .mdp-sep{display:flex; align-items:center; justify-content:center; height:30px; color:var(--muted); font-size:12px; font-weight:700; text-transform:uppercase}

        .mdp-support{
          display:flex; align-items:center; justify-content:center; gap:8px;
          height:48px; border-radius:12px; text-decoration:none;
          background:var(--orange); color:#fff; font-weight:800; font-size:14px;
          transition:background .15s;
        }
        .mdp-support:hover{background:var(--orange-dark)}

        .mdp-form{display:grid; gap:14px}
        .mdp-ok{
          display:flex; gap:10px; align-items:flex-start; padding:12px 14px;
          border-radius:13px; background:var(--blue-100); color:var(--blue-800);
        }
        .mdp-ok svg{flex:none; margin-top:2px}
        .mdp-ok div{display:grid; gap:2px; font-size:13px; line-height:1.45; word-break:break-word}
        .mdp-field{display:grid; gap:6px}
        .mdp-field label{font-size:13px; font-weight:700; color:var(--blue-800)}
        .mdp-field input{
          height:50px; padding:0 14px; border-radius:12px; border:1px solid var(--line);
          background:var(--blue-50); font-size:14px; color:var(--ink); outline:none;
        }
        .mdp-field input:focus{border-color:var(--blue-700); background:#fff}
        .mdp-submit{
          height:52px; border:0; border-radius:13px; background:var(--orange); color:#fff;
          font-size:15px; font-weight:800; cursor:pointer;
        }
        .mdp-submit:hover:not(:disabled){background:var(--orange-dark)}
        .mdp-submit:disabled{opacity:.6; cursor:wait}

        .mdp-back{display:block; text-align:center; margin-top:18px; font-size:14px; font-weight:700; color:var(--blue-700); text-decoration:none}
      `}</style>
    </div>
  );
}

export default MotDePasseOublie;
