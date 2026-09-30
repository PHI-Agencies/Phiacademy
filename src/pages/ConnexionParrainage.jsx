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
        .parrainage-login-page {
          min-height: 100vh;
          background: #f7f8fa;
          color: #0b132b;
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

        .parrainage-login-logo {
          width: 58px;
          height: 58px;
          margin: 0 auto 14px;
          border-radius: 16px;
          overflow: hidden;
          background: #0b132b;
          border: 1px solid rgba(212,175,55,.45);
        }

        .parrainage-login-logo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .parrainage-login-top h1 {
          margin: 0;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        .parrainage-login-top p {
          margin: 8px 0 0;
          color: #697386;
          font-size: 14px;
          line-height: 1.5;
        }

        .parrainage-login-card {
          background: #ffffff;
          border: 1px solid #e8eaf0;
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 16px 45px rgba(11,19,43,.07);
        }

        .parrainage-login-info {
          padding: 14px;
          margin-bottom: 18px;
          border-radius: 13px;
          background: #faf8ef;
          border: 1px solid rgba(212,175,55,.25);
          color: #5d5129;
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
          color: #30384d;
        }

        .parrainage-login-field input {
          width: 100%;
          height: 48px;
          box-sizing: border-box;
          padding: 0 14px;
          border: 1px solid #dfe3ea;
          border-radius: 12px;
          outline: none;
          background: #fff;
          color: #0b132b;
          font-size: 14px;
          transition: .2s ease;
        }

        .parrainage-login-field input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,.12);
        }

        .parrainage-login-message {
          margin-bottom: 15px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #fff3f3;
          border: 1px solid #ffd7d7;
          color: #a32828;
          font-size: 13px;
          line-height: 1.45;
        }

        .parrainage-login-submit {
          height: 50px;
          border: 0;
          border-radius: 13px;
          background: #0b132b;
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .2s ease, opacity .2s ease;
        }

        .parrainage-login-submit:hover {
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
          color: #697386;
          line-height: 1.5;
        }

        .parrainage-login-register a {
          color: #0b132b;
          font-weight: 800;
          text-decoration: none;
        }

        .parrainage-login-back {
          display: block;
          margin-top: 18px;
          text-align: center;
          color: #697386;
          text-decoration: none;
          font-size: 13px;
        }

        .parrainage-login-back:hover {
          color: #0b132b;
        }

        @media (max-width: 380px) {
          .parrainage-login-page {
            padding: 18px 12px;
          }

          .parrainage-login-card {
            padding: 17px;
            border-radius: 20px;
          }

          .parrainage-login-top h1 {
            font-size: 23px;
          }
        }
      `}</style>

      <main className="parrainage-login-container">

        <div className="parrainage-login-top">
          <div className="parrainage-login-logo">
            <img
              src="/images/logo/phi-logo.png"
              alt="PHI Academy"
            />
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