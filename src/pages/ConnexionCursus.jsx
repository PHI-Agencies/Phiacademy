import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import SupportButton from "../components/SupportButton";

const REFERRAL_STORAGE_KEY = "phi_referral_code";

// Un code de parrainage ne contient que des lettres et des chiffres
function cleanReferralCode(value) {
  const code = String(value || "")
    .trim()
    .toUpperCase();

  return /^[A-Z0-9]{4,20}$/.test(code) ? code : "";
}

function readSavedReferralCode() {
  try {
    return cleanReferralCode(
      localStorage.getItem(REFERRAL_STORAGE_KEY)
    );
  } catch {
    return "";
  }
}

function ConnexionCursus() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Code reçu par lien d'invitation (/r/CODE) ou déjà mémorisé
  const invitationCode =
    cleanReferralCode(searchParams.get("ref")) ||
    readSavedReferralCode();

  // L'onglet "Créer un compte" s'ouvre seulement via un lien d'invitation
  const [mode, setMode] = useState(
    searchParams.get("ref") || searchParams.get("mode") === "register"
      ? "register"
      : "login"
  );

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
    referralCode: invitationCode,
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

    const parsedPhone = parsePhoneNumberFromString(registerData.phone);

  if (!parsedPhone || !parsedPhone.isValid()) {
    setMessage(
      "Veuillez sélectionner un pays et saisir un numéro de téléphone international valide."
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

      // Le code a servi : on ne le garde plus
      try {
        localStorage.removeItem(REFERRAL_STORAGE_KEY);
      } catch {
        /* ignoré */
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
        /* =========================
           PALETTE : BLEU • BLANC • ORANGE
        ========================= */

        .connexion-page {
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

        .connexion-page {
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

        .connexion-container {
          width: 100%;
          max-width: 430px;
        }

        .connexion-top {
          text-align: center;
          margin-bottom: 24px;
        }

        .connexion-wordmark {
          margin: 0 auto 14px;
          color: var(--blue-800);
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .connexion-wordmark span {
          color: var(--orange);
        }

        .connexion-logo {
          width: 62px;
          height: 62px;
          margin: 0 auto 14px;
          border-radius: 18px;
          overflow: hidden;
          background: var(--blue-800);
          border: 2px solid var(--orange);
          box-shadow: 0 12px 28px rgba(10,42,102,.22);
        }

        .connexion-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .connexion-top h1 {
          margin: 0;
          color: var(--blue-800);
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        .connexion-top p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.5;
        }

        .connexion-card {
          background: #ffffff;
          border: 1px solid var(--line);
          border-top: 4px solid var(--orange);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 20px 50px rgba(10,42,102,.12);
        }

        .connexion-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          padding: 5px;
          background: var(--blue-100);
          border-radius: 14px;
          margin-bottom: 22px;
        }

        .connexion-switch button {
          border: 0;
          border-radius: 10px;
          padding: 12px 8px;
          background: transparent;
          color: var(--muted);
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .connexion-switch button.active {
          background: var(--blue-800);
          color: #ffffff;
          box-shadow: 0 6px 14px rgba(10,42,102,.25);
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
          color: var(--blue-800);
        }

        .connexion-field input {
          width: 100%;
          box-sizing: border-box;
          height: 50px;
          padding: 0 14px;
          border: 1px solid var(--line);
          border-radius: 12px;
          outline: none;
          background: var(--blue-50);
          color: var(--ink);
          font-size: 14px;
          transition: .2s ease;
        }

        .connexion-field input::placeholder {
          color: #9AA7BF;
        }

        .connexion-field input:focus {
          border-color: var(--orange);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(255,122,26,.15);
        }

        /* Champ téléphone (react-phone-input-2) */

        .connexion-page .react-tel-input .form-control {
          background: var(--blue-50) !important;
          border-color: var(--line) !important;
          color: var(--ink) !important;
          transition: .2s ease;
        }

        .connexion-page .react-tel-input .form-control:focus {
          border-color: var(--orange) !important;
          background: #fff !important;
          box-shadow: 0 0 0 4px rgba(255,122,26,.15) !important;
        }

        .connexion-page .react-tel-input .flag-dropdown {
          background: var(--blue-50) !important;
          border-color: var(--line) !important;
        }

        .connexion-page .react-tel-input .selected-flag:hover,
        .connexion-page .react-tel-input .selected-flag:focus,
        .connexion-page .react-tel-input .flag-dropdown.open .selected-flag {
          background: var(--orange-soft) !important;
        }

        .connexion-page .react-tel-input .country-list .country:hover,
        .connexion-page .react-tel-input .country-list .country.highlight {
          background: var(--orange-soft) !important;
        }

        .connexion-info {
          padding: 13px 14px;
          border-radius: 12px;
          background: var(--orange-soft);
          border-left: 4px solid var(--orange);
          color: var(--blue-800);
          font-size: 13px;
          line-height: 1.5;
        }

        .connexion-info strong {
          color: var(--orange-text);
        }

        .connexion-message {
          padding: 12px 14px;
          border-radius: 12px;
          background: #FFF3F0;
          border: 1px solid #F6CFC6;
          color: #A33A2A;
          font-size: 13px;
          line-height: 1.45;
        }

        .connexion-submit {
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

        .connexion-submit:hover {
          background: var(--orange-dark);
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
          color: var(--muted);
        }

        .connexion-price strong {
          color: var(--blue-800);
        }

        .connexion-back {
          display: block;
          text-align: center;
          margin-top: 18px;
          color: var(--muted);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .connexion-back:hover {
          color: var(--orange-text);
        }

        @media (max-width: 380px) {
          .connexion-page {
            padding: 18px 12px;
          }

          .connexion-card {
            padding: 18px;
            border-radius: 20px;
          }

          .connexion-top h1 {
            font-size: 23px;
          }
        }
      `}</style>

      <main className="connexion-container">

        <div className="connexion-top">
          <div className="connexion-wordmark">
            PHI <span>ACADEMY</span>
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

  <PhoneInput
    country=""
    enableSearch
    disableSearchIcon={false}
    countryCodeEditable={false}
    value={registerData.phone}
    onChange={(value) => {
      setRegisterData((previous) => ({
        ...previous,
        phone: value ? `+${value}` : "",
      }));
    }}
    inputProps={{
      id: "phone",
      name: "phone",
      required: true,
      autoComplete: "tel",
    }}
    placeholder="XXXXXXXXX"
    searchPlaceholder="Rechercher un pays..."
    preferredCountries={[]}
    containerStyle={{
      width: "100%",
    }}
    inputStyle={{
      width: "100%",
      height: "50px",
      borderRadius: "12px",
      border: "1px solid #DFE6F2",
      fontSize: "14px",
      color: "#0A1B44",
      background: "#F1F5FD",
    }}
    buttonStyle={{
      border: "1px solid #DFE6F2",
      borderRadius: "12px 0 0 12px",
      background: "#F1F5FD",
    }}
    dropdownStyle={{
      color: "#0A1B44",
      borderRadius: "12px",
    }}
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

      <SupportButton />
    </div>
  );
}

export default ConnexionCursus;
