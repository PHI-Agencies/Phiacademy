import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MotDePasse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (form.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage({
        type: "error",
        text: "Les deux nouveaux mots de passe ne sont pas identiques.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      if (response.status === 401) {
        const data = await response.json().catch(() => ({}));

        // Session expirée : reconnexion. Sinon : mauvais mot de passe actuel.
        if (data?.message !== "Mot de passe actuel incorrect.") {
          navigate("/connexion-cursus?redirect=/mot-de-passe", {
            replace: true,
          });
          return;
        }

        throw new Error(data.message);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Impossible de modifier le mot de passe.");
      }

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({
        type: "success",
        text: "Mot de passe modifié. Les autres appareils connectés ont été déconnectés.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .mdp-page {
          min-height: 100vh;
          background: #F1F5FD;
          color: #0A1B44;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }
        .mdp-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border: 1px solid #E6EEFC;
          border-top: 4px solid #FF7A1A;
          border-radius: 20px;
          padding: 28px 24px;
          box-shadow: 0 12px 32px rgba(10, 42, 102, 0.08);
        }
        .mdp-logo {
          font-size: 22px;
          font-weight: 800;
          color: #0A2A66;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 18px;
        }
        .mdp-logo span { color: #FF7A1A; }
        .mdp-card h1 { margin: 0 0 6px; font-size: 24px; color: #0A2A66; }
        .mdp-card p { margin: 0 0 20px; font-size: 14px; color: #5F6E8A; line-height: 1.6; }
        .mdp-field { margin-bottom: 14px; }
        .mdp-field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
        .mdp-field input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          font-size: 16px;
          border: 1px solid #D5DEF0;
          border-radius: 12px;
          outline: none;
          color: #0A1B44;
          background: #fff;
        }
        .mdp-field input:focus { border-color: #103A8C; box-shadow: 0 0 0 3px #E6EEFC; }
        .mdp-btn {
          width: 100%;
          margin-top: 6px;
          padding: 13px 16px;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          background: #FF7A1A;
          border: 0;
          border-radius: 12px;
          cursor: pointer;
        }
        .mdp-btn:hover { background: #E86405; }
        .mdp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .mdp-notice { padding: 12px 14px; border-radius: 12px; font-size: 14px; margin-bottom: 16px; line-height: 1.5; }
        .mdp-notice.error { background: #FFF1EE; color: #B3372A; }
        .mdp-notice.success { background: #EAF8F0; color: #167A48; }
        .mdp-back { display: block; text-align: center; margin-top: 18px; font-size: 14px; color: #103A8C; text-decoration: none; font-weight: 600; }
      `}</style>

      <div className="mdp-page">
        <div className="mdp-card">
          <Link to="/" className="mdp-logo">
            PHI <span>ACADEMY</span>
          </Link>

          <h1>Changer mon mot de passe</h1>
          <p>Saisissez votre mot de passe actuel, puis choisissez-en un nouveau (8 caractères minimum).</p>

          {message.text && (
            <div className={`mdp-notice ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mdp-field">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mdp-field">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={form.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mdp-field">
              <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="mdp-btn" disabled={loading}>
              {loading ? "Modification..." : "Modifier mon mot de passe"}
            </button>
          </form>

          <Link to="/cursus" className="mdp-back">
            ← Retour au cursus
          </Link>
        </div>
      </div>
    </>
  );
}
