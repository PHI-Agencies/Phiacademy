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
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: Inter, Arial, sans-serif;
          background: #f7f8fa;
          color: #0b132b;
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
              circle at top right,
              rgba(212, 175, 55, 0.08),
              transparent 35%
            ),
            #f7f8fa;
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
          color: #0b132b;
        }

        .admin-logo span {
          color: #d4af37;
        }

        .admin-label {
          margin-top: 8px;
          color: #8a909b;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .admin-login-card {
          width: 100%;
          padding: 34px;
          background: #ffffff;
          border: 1px solid #e7e9ee;
          border-radius: 28px;
          box-shadow:
            0 20px 60px rgba(11, 19, 43, 0.06);
        }

        .admin-login-card h1 {
          margin-bottom: 9px;
          font-size: 27px;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .admin-login-card > p {
          margin-bottom: 28px;
          color: #737a87;
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
          color: #454c59;
          font-size: 12px;
          font-weight: 800;
        }

        .admin-field input {
          width: 100%;
          height: 50px;
          padding: 0 15px;
          border: 1px solid #dfe2e8;
          border-radius: 14px;
          outline: none;
          background: #ffffff;
          color: #0b132b;
          font-size: 14px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .admin-field input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
        }

        .admin-field input::placeholder {
          color: #a3a8b2;
        }

        .admin-error {
          padding: 13px 14px;
          border: 1px solid #efd4d4;
          border-radius: 14px;
          background: #fff5f5;
          color: #9a4545;
          font-size: 12px;
          line-height: 1.5;
        }

        .admin-submit {
          width: 100%;
          height: 51px;
          margin-top: 3px;
          border: none;
          border-radius: 15px;
          background: #0b132b;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .admin-submit:hover:not(:disabled) {
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
          color: #9298a3;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .admin-footer {
          margin-top: 22px;
          text-align: center;
          color: #9aa0aa;
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