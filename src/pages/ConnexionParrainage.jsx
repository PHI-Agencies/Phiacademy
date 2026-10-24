import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ConnexionParrainage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Identifiants incorrects."
        );
      }

      /*
       * La connexion est commune avec l'espace Cursus.
       * Ici, après authentification, on redirige simplement
       * vers l'espace Parrainage.
       */
      navigate("/parrainage");
    } catch (error) {
      setMessage(
        error.message ||
          "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parrainage-login-page">
      <style>{`
        /* =========================
           PALETTE : BLEU • BLANC • ORANGE
        ========================= */

        .parrainage-login-page {
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

        .parrainage-login-page {
          min-height: 100vh;
          background:
            radial-gradient(600px 300px at 100% 0%, rgba(255,122,26,.14), transparent 60%),
            radial-gradient(600px 300px at 0% 100%, rgba(16,58,140,.10), transparent 60%),
            #F4F7FC;
          color: var(--ink);
          padding: 24px 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: inherit;
        }

        .parrainage-login-container {
          width: 100%;
          max-width: 430px;
        }

        .parrainage-login-top {
          text-align: center;
          margin-bottom: 24px;
        }

        .parrainage-login-wordmark {
          margin: 0 auto 14px;
          color: var(--blue-800);
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .parrainage-login-wordmark span {
          color: var(--orange);
        }

        .parrainage-login-logo {
          width: 62px;
          height: 62px;
          margin: 0 auto 14px;
          border-radius: 18px;
          overflow: hidden;
          background: var(--blue-800);
          border: 2px solid var(--orange);
          box-shadow: 0 12px 28px rgba(10,42,102,.22);
        }

        .parrainage-login-logo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .parrainage-login-top h1 {
          margin: 0;
          color: var(--blue-800);
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        .parrainage-login-top p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.5;
        }

        .parrainage-login-card {
          background: #ffffff;
          border: 1px solid var(--line);
          border-top: 4px solid var(--orange);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 20px 50px rgba(10,42,102,.12);
        }

        .parrainage-login-info {
          padding: 14px;
          margin-bottom: 18px;
          border-radius: 13px;
          background: var(--blue-50);
          border-left: 4px solid var(--blue-700);
          color: var(--blue-800);
          font-size: 13px;
          line-height: 1.5;
        }

        .parrainage-login-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .parrainage-login-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .parrainage-login-field label {
          font-size: 13px;
          font-weight: 700;
          color: var(--blue-800);
        }

        .parrainage-login-field input {
          width: 100%;
          height: 50px;
          box-sizing: border-box;
          padding: 0 14px;
          border: 1px solid var(--line);
          border-radius: 12px;
          outline: none;
          background: var(--blue-50);
          color: var(--ink);
          font-size: 14px;
          transition: .2s ease;
        }

        .parrainage-login-field input::placeholder {
          color: #9AA7BF;
        }

        .parrainage-login-field input:focus {
          border-color: var(--orange);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(255,122,26,.15);
        }

        .parrainage-login-message {
          margin-bottom: 15px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #FFF3F0;
          border: 1px solid #F6CFC6;
          color: #A33A2A;
          font-size: 13px;
          line-height: 1.45;
        }

        .parrainage-login-submit {
          height: 52px;
          border: 0;
          border-radius: 13px;
          background: var(--orange);
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(255,122,26,.38);
          transition: transform .2s ease, opacity .2s ease, background .2s ease;
        }

        .parrainage-login-submit:hover {
          background: var(--orange-dark);
          transform: translateY(-1px);
        }

        .parrainage-login-submit:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }

        .parrainage-login-register {
          margin-top: 18px;
          text-align: center;
          font-size: 13px;
          color: var(--muted);
          line-height: 1.5;
        }

        .parrainage-login-register a {
          color: var(--orange-text);
          font-weight: 800;
          text-decoration: none;
        }

        .parrainage-login-register a:hover {
          text-decoration: underline;
        }

        .parrainage-login-back {
          display: block;
          margin-top: 18px;
          text-align: center;
          color: var(--muted);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .parrainage-login-back:hover {
          color: var(--orange-text);
        }

        @media (max-width: 380px) {
          .parrainage-login-page {
            padding: 18px 12px;
          }

          .parrainage-login-card {
            padding: 18px;
            border-radius: 20px;
          }

          .parrainage-login-top h1 {
            font-size: 23px;
          }
        }
      `}</style>

      <main className="parrainage-login-container">

        <div className="parrainage-login-top">
          <div className="parrainage-login-wordmark">
            PHI <span>ACADEMY</span>
          </div>

          <h1>Espace Parrainage</h1>

          <p>
            Connectez-vous pour accéder à votre
            solde, vos filleuls et vos commissions.
          </p>
        </div>

        <section className="parrainage-login-card">

          <div className="parrainage-login-info">
            Votre espace Parrainage est réservé
            aux membres disposant d'un compte PHI
            Academy actif.
          </div>

          {message && (
            <div className="parrainage-login-message">
              {message}
            </div>
          )}

          <form
            className="parrainage-login-form"
            onSubmit={handleSubmit}
          >
            <div className="parrainage-login-field">
              <label htmlFor="parrainage-email">
                Adresse e-mail
              </label>

              <input
                id="parrainage-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="parrainage-login-field">
              <label htmlFor="parrainage-password">
                Mot de passe
              </label>

              <input
                id="parrainage-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Votre mot de passe"
                required
              />
            </div>

            <button
              type="submit"
              className="parrainage-login-submit"
              disabled={loading}
            >
              {loading
                ? "Connexion..."
                : "Accéder au parrainage"}
            </button>
          </form>

          <div className="parrainage-login-register">
            Vous n'avez pas encore de compte ?
            <br />

            <Link to="/connexion-cursus">
              Créer un compte PHI Academy
            </Link>
          </div>
        </section>

        <Link
          to="/"
          className="parrainage-login-back"
        >
          ← Retour à l'accueil
        </Link>

      </main>
    </div>
  );
}

export default ConnexionParrainage;
