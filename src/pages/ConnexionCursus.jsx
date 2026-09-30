import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function ConnexionCursus() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    referralCode: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectAfterLogin =
    searchParams.get("redirect") || "/cursus";

  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegisterChange = (event) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = async (event) => {
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
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Identifiants incorrects."
        );
      }

      if (data.user?.status === "active") {
        navigate(redirectAfterLogin);
        return;
      }

      setMessage(
        "Votre compte existe mais votre accès n'est pas encore activé."
      );

      navigate("/connexion-cursus?payment=required");
    } catch (error) {
      setMessage(
        error.message || "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    if (!registerData.referralCode.trim()) {
      setMessage(
        "Le code de parrainage est obligatoire."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de créer le compte."
        );
      }

      /*
       * Le compte est créé côté serveur avec le statut
       * "pending".
       *
       * On demande ensuite au serveur de créer
       * la facture PayDunya de 10 000 FCFA.
       */
      const paymentResponse = await fetch(
        "/api/payment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({}),
        }
      );

      const paymentData =
        await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message ||
            "Le compte a été créé, mais le paiement n'a pas pu être initialisé."
        );
      }

      if (!paymentData.paymentUrl) {
        throw new Error(
          "Le lien de paiement n'a pas été reçu."
        );
      }

      window.location.href =
        paymentData.paymentUrl;
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
    <div className="connexion-page">
      <style>{`
        .connexion-page {
          min-height: 100vh;
          background: #f7f8fa;
          color: #0b132b;
          padding: 24px 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: inherit;
        }

        .connexion-container {
          width: 100%;
          max-width: 430px;
        }

        .connexion-top {
          text-align: center;
          margin-bottom: 24px;
        }

        .connexion-logo {
          width: 58px;
          height: 58px;
          margin: 0 auto 14px;
          border-radius: 16px;
          overflow: hidden;
          background: #0b132b;
          border: 1px solid rgba(212,175,55,.45);
        }

        .connexion-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .connexion-top h1 {
          margin: 0;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        .connexion-top p {
          margin: 8px 0 0;
          color: #697386;
          font-size: 14px;
          line-height: 1.5;
        }

        .connexion-card {
          background: #ffffff;
          border: 1px solid #e8eaf0;
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 16px 45px rgba(11,19,43,.07);
        }

        .connexion-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          padding: 5px;
          background: #f2f3f6;
          border-radius: 14px;
          margin-bottom: 22px;
        }

        .connexion-switch button {
          border: 0;
          border-radius: 10px;
          padding: 11px 8px;
          background: transparent;
          color: #697386;
          font-weight: 700;
          cursor: pointer;
        }

        .connexion-switch button.active {
          background: #0b132b;
          color: #ffffff;
        }

        .connexion-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .connexion-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .connexion-field label {
          font-size: 13px;
          font-weight: 700;
          color: #30384d;
        }

        .connexion-field input {
          width: 100%;
          box-sizing: border-box;
          height: 48px;
          padding: 0 14px;
          border: 1px solid #dfe3ea;
          border-radius: 12px;
          outline: none;
          background: #fff;
          color: #0b132b;
          font-size: 14px;
          transition: .2s ease;
        }

        .connexion-field input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,.12);
        }

        .connexion-info {
          padding: 13px 14px;
          border-radius: 12px;
          background: #faf8ef;
          border: 1px solid rgba(212,175,55,.25);
          color: #5d5129;
          font-size: 13px;
          line-height: 1.5;
        }

        .connexion-message {
          padding: 12px 14px;
          border-radius: 12px;
          background: #fff3f3;
          border: 1px solid #ffd7d7;
          color: #a32828;
          font-size: 13px;
          line-height: 1.45;
        }

        .connexion-submit {
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

        .connexion-submit:hover {
          transform: translateY(-1px);
        }

        .connexion-submit:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }

        .connexion-price {
          text-align: center;
          margin-top: 4px;
          font-size: 13px;
          color: #697386;
        }

        .connexion-price strong {
          color: #0b132b;
        }

        .connexion-back {
          display: block;
          text-align: center;
          margin-top: 18px;
          color: #697386;
          text-decoration: none;
          font-size: 13px;
        }

        .connexion-back:hover {
          color: #0b132b;
        }

        @media (max-width: 380px) {
          .connexion-page {
            padding: 18px 12px;
          }

          .connexion-card {
            padding: 17px;
            border-radius: 20px;
          }

          .connexion-top h1 {
            font-size: 23px;
          }
        }
      `}</style>

      <main className="connexion-container">

        <div className="connexion-top">
          <div className="connexion-logo">
            <img
              src="/images/logo/phi-logo.png"
              alt="PHI Academy"
            />
          </div>

          <h1>Espace Cursus</h1>

          <p>
            Connectez-vous ou créez votre compte
            pour accéder à votre espace
            d’apprentissage.
          </p>
        </div>

        <section className="connexion-card">

          <div className="connexion-switch">
            <button
              type="button"
              className={
                mode === "login"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Connexion
            </button>

            <button
              type="button"
              className={
                mode === "register"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
            >
              Créer un compte
            </button>
          </div>

          {message && (
            <div className="connexion-message">
              {message}
            </div>
          )}

          {mode === "login" ? (
            <form
              className="connexion-form"
              onSubmit={handleLogin}
            >
              <div className="connexion-field">
                <label htmlFor="login-email">
                  Adresse e-mail
                </label>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="connexion-field">
                <label htmlFor="login-password">
                  Mot de passe
                </label>

                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Votre mot de passe"
                  required
                />
              </div>

              <button
                className="connexion-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Connexion..."
                  : "Se connecter"}
              </button>
            </form>
          ) : (
            <form
              className="connexion-form"
              onSubmit={handleRegister}
            >
              <div className="connexion-info">
                L’accès à PHI Academy coûte{" "}
                <strong>10 000 FCFA</strong>.
                <br />
                Un code de parrainage valide est
                obligatoire pour créer votre compte.
              </div>

              <div className="connexion-field">
                <label htmlFor="firstName">
                  Prénom
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={registerData.firstName}
                  onChange={handleRegisterChange}
                  placeholder="Votre prénom"
                  required
                />
              </div>

              <div className="connexion-field">
                <label htmlFor="lastName">
                  Nom
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={registerData.lastName}
                  onChange={handleRegisterChange}
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div className="connexion-field">
                <label htmlFor="phone">
                  Téléphone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  placeholder="Votre numéro"
                  required
                />
              </div>

              <div className="connexion-field">
                <label htmlFor="register-email">
                  Adresse e-mail
                </label>

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="connexion-field">
                <label htmlFor="register-password">
                  Mot de passe
                </label>

                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Choisissez un mot de passe"
                  minLength={8}
                  required
                />
              </div>

              <div className="connexion-field">
                <label htmlFor="referralCode">
                  Code de parrainage
                </label>

                <input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  value={registerData.referralCode}
                  onChange={handleRegisterChange}
                  placeholder="Ex. PHI12345"
                  required
                />
              </div>

              <div className="connexion-price">
                Montant de l’accès :{" "}
                <strong>10 000 FCFA</strong>
              </div>

              <button
                className="connexion-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Préparation du paiement..."
                  : "Créer mon compte et payer"}
              </button>
            </form>
          )}
        </section>

        <Link
          to="/"
          className="connexion-back"
        >
          ← Retour à l’accueil
        </Link>

      </main>
    </div>
  );
}

export default ConnexionCursus;