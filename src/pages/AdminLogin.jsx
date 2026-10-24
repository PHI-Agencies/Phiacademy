import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Impossible de vous connecter au back-office."
        );
      }

      if (!data?.admin) {
        throw new Error(
          "Cette session ne dispose pas des droits administrateur."
        );
      }

      navigate("/admin", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message ||
          "Une erreur est survenue lors de la connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* =========================
           PALETTE : BLEU • BLANC • ORANGE
        ========================= */

        .admin-login-page {
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
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: Inter, Arial, sans-serif;
          background: #F4F7FC;
          color: #0A1B44;
        }

        button,
        input {
          font-family: inherit;
        }

        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(
              600px 320px at 100% 0%,
              rgba(255, 122, 26, 0.16),
              transparent 60%
            ),
            radial-gradient(
              600px 320px at 0% 100%,
              rgba(16, 58, 140, 0.12),
              transparent 60%
            ),
            #F4F7FC;
        }

        .admin-login-wrapper {
          width: 100%;
          max-width: 430px;
        }

        .admin-brand {
          text-align: center;
          margin-bottom: 28px;
        }

        .admin-logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.7px;
          color: var(--blue-800);
        }

        .admin-logo span {
          color: var(--orange);
        }

        .admin-label {
          display: inline-block;
          margin-top: 10px;
          padding: 5px 11px;
          border-radius: 999px;
          background: var(--orange-soft);
          color: var(--orange-text);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .admin-login-card {
          width: 100%;
          padding: 34px;
          background: #ffffff;
          border: 1px solid var(--line);
          border-top: 4px solid var(--orange);
          border-radius: 28px;
          box-shadow:
            0 24px 60px rgba(10, 42, 102, 0.14);
        }

        .admin-login-card h1 {
          margin-bottom: 9px;
          color: var(--blue-800);
          font-size: 27px;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .admin-login-card > p {
          margin-bottom: 28px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-field label {
          color: var(--blue-800);
          font-size: 12px;
          font-weight: 800;
        }

        .admin-field input {
          width: 100%;
          height: 50px;
          padding: 0 15px;
          border: 1px solid var(--line);
          border-radius: 14px;
          outline: none;
          background: var(--blue-50);
          color: var(--ink);
          font-size: 14px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .admin-field input:focus {
          border-color: var(--orange);
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(255, 122, 26, 0.15);
        }

        .admin-field input::placeholder {
          color: #9AA7BF;
        }

        .admin-error {
          padding: 13px 14px;
          border: 1px solid #F6CFC6;
          border-radius: 14px;
          background: #FFF3F0;
          color: #A33A2A;
          font-size: 12px;
          line-height: 1.5;
        }

        .admin-submit {
          width: 100%;
          height: 52px;
          margin-top: 3px;
          border: none;
          border-radius: 15px;
          background: var(--orange);
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(255, 122, 26, 0.38);
          transition:
            transform 0.2s ease,
            opacity 0.2s ease,
            background 0.2s ease;
        }

        .admin-submit:hover:not(:disabled) {
          background: var(--orange-dark);
          transform: translateY(-1px);
        }

        .admin-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .admin-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 20px;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .admin-footer {
          margin-top: 22px;
          text-align: center;
          color: var(--muted);
          font-size: 11px;
        }

        @media (max-width: 500px) {
          .admin-login-page {
            padding: 18px;
          }

          .admin-login-card {
            padding: 26px 21px;
            border-radius: 24px;
          }

          .admin-login-card h1 {
            font-size: 24px;
          }
        }
      `}</style>

      <main className="admin-login-page">
        <div className="admin-login-wrapper">
          <div className="admin-brand">
            <div className="admin-logo">
              PHI <span>ACADEMY</span>
            </div>

            <div className="admin-label">
              Administration
            </div>
          </div>

          <section className="admin-login-card">
            <h1>
              Connexion administrateur
            </h1>

            <p>
              Accédez à l'espace privé de gestion de PHI Academy.
            </p>

            <form
              className="admin-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-field">
                <label htmlFor="admin-email">
                  Email administrateur
                </label>

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@phiacademy.com"
                  autoComplete="username"
                  disabled={loading}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="admin-password">
                  Mot de passe
                </label>

                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="admin-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="admin-submit"
                disabled={loading}
              >
                {loading
                  ? "Connexion..."
                  : "Accéder au back-office"}
              </button>
            </form>

            <div className="admin-security">
              Accès réservé aux administrateurs autorisés.
            </div>
          </section>

          <div className="admin-footer">
            © {new Date().getFullYear()} PHI Academy
          </div>
        </div>
      </main>
    </>
  );
}
