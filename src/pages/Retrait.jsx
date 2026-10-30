import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/* =========================================================
   RÈGLES (valeurs par défaut)
   Le serveur reste la référence : s'il renvoie minAmount et
   feePercent dans GET /api/withdrawals, ces valeurs-là sont
   utilisées à la place de celles-ci.
========================================================= */

const DEFAULT_MIN_AMOUNT = 10000;
const DEFAULT_FEE_PERCENT = 7;
const PAYMENT_DELAY_HOURS = 72;

const STATUS_LABELS = {
  pending: "En attente",
  paid: "Payé",
  refused: "Refusé",
};

export default function Retrait() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [step, setStep] = useState("form"); // form | confirm | done

  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  /* ---------- Chargement ---------- */

  const loadData = useCallback(async () => {
    try {
      setLoadError("");

      const response = await fetch("/api/withdrawals", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/connexion-parrainage?redirect=/retrait", {
          replace: true,
        });
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Impossible de charger vos retraits."
        );
      }

      setData(result);
    } catch (error) {
      setLoadError(
        error.message || "Une erreur est survenue lors du chargement."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------- Calculs ---------- */

  const balance = Number(data?.balance || 0);
  const minAmount = Number(data?.minAmount || DEFAULT_MIN_AMOUNT);
  const feePercent = Number(
    data?.feePercent ?? DEFAULT_FEE_PERCENT
  );
  const withdrawals = data?.withdrawals || [];

  const hasPending = withdrawals.some(
    (item) => item.status === "pending"
  );

  const amountNumber = Number(String(amount).replace(/\s/g, ""));
  const amountIsValid =
    Number.isInteger(amountNumber) && amountNumber > 0;

  const fee = useMemo(
    () =>
      amountIsValid
        ? Math.round((amountNumber * feePercent) / 100)
        : 0,
    [amountIsValid, amountNumber, feePercent]
  );

  const netAmount = amountIsValid ? amountNumber - fee : 0;

  /* ---------- Formats ---------- */

  const formatAmount = (value) =>
    `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;

  const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeadline = (createdAt) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) return "—";

    date.setHours(date.getHours() + PAYMENT_DELAY_HOURS);

    return formatDateTime(date);
  };

  /* ---------- Validation ---------- */

  const validateForm = () => {
    if (!amountIsValid) {
      return "Veuillez saisir un montant valide.";
    }

    if (amountNumber < minAmount) {
      return `Le montant minimum de retrait est de ${formatAmount(
        minAmount
      )}.`;
    }

    if (amountNumber > balance) {
      return "Le montant demandé dépasse votre solde disponible.";
    }

    const parsedPhone = parsePhoneNumberFromString(phone || "");

    if (!parsedPhone || !parsedPhone.isValid()) {
      return "Veuillez saisir un numéro de téléphone valide.";
    }

    return "";
  };

  /* ---------- Validation du formulaire ---------- */

  const handleContinue = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setMessage({ type: "", text: "" });
    setStep("confirm");
  };

  /* ---------- Confirmation ---------- */

  const handleConfirm = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: amountNumber,
          phone,
        }),
      });

      if (response.status === 401) {
        navigate("/connexion-parrainage?redirect=/retrait", {
          replace: true,
        });
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Impossible d'enregistrer la demande."
        );
      }

      setStep("done");
      setAmount("");
      setMessage({ type: "", text: "" });

      await loadData();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Une erreur est survenue.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const backToForm = () => {
    setStep("form");
    setMessage({ type: "", text: "" });
  };

  const startNewRequest = () => {
    setStep("form");
    setMessage({ type: "", text: "" });
  };

  /* =========================================================
     RENDU
  ========================================================= */

  return (
    <>
      <style>{`
        .retrait-page {
          --blue-900: #061A4A;
          --blue-800: #0A2A66;
          --blue-700: #103A8C;
          --blue-100: #E6EEFC;
          --blue-50:  #F1F5FD;

          --orange: #FF7A1A;
          --orange-dark: #E86405;
          --orange-text: #D9590A;
          --orange-soft: #FFF0E3;

          --green: #167A48;
          --green-soft: #EAF8F0;

          --red: #B3372A;
          --red-soft: #FFF1EE;

          --ink: #0A1B44;
          --muted: #5F6E8A;
          --muted-2: #8794AD;
          --line: #DFE6F2;
          --bg: #F4F7FC;
        }

        .retrait-page,
        .retrait-page * {
          box-sizing: border-box;
        }

        .retrait-page * {
          margin: 0;
          padding: 0;
        }

        .retrait-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--ink);
          font-family: Inter, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .retrait-page a {
          text-decoration: none;
          color: inherit;
        }

        .retrait-page button,
        .retrait-page input,
        .retrait-page select {
          font-family: inherit;
        }

        /* ---------- Barre du haut ---------- */

        .retrait-top {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 6%;
          background: rgba(255,255,255,0.96);
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(12px);
        }

        .retrait-logo {
          color: var(--blue-800);
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .retrait-logo span {
          color: var(--orange);
        }

        .retrait-back {
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
        }

        .retrait-back:hover {
          color: var(--orange-text);
        }

        /* ---------- Contenu ---------- */

        .retrait-wrap {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          padding: 40px 6% 90px;
        }

        .retrait-label {
          display: inline-block;
          margin-bottom: 14px;
          padding: 7px 12px;
          border-radius: 999px;
          background: var(--orange-soft);
          color: var(--orange-text);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .retrait-wrap h1 {
          color: var(--blue-800);
          font-size: clamp(32px, 6vw, 46px);
          line-height: 1.08;
          letter-spacing: -2px;
          margin-bottom: 12px;
        }

        .retrait-intro {
          max-width: 560px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 28px;
        }

        .retrait-balance {
          position: relative;
          overflow: hidden;
          padding: 30px;
          margin-bottom: 18px;
          border-radius: 26px;
          color: #fff;
          background:
            radial-gradient(circle at 100% 0%, rgba(255,122,26,0.3), transparent 50%),
            linear-gradient(135deg, var(--blue-900), var(--blue-800) 60%, var(--blue-700));
          box-shadow: 0 22px 50px rgba(10,42,102,0.25);
        }

        .retrait-balance small {
          display: block;
          color: #C3D0EC;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .retrait-balance strong {
          font-size: clamp(34px, 7vw, 48px);
          font-weight: 800;
          letter-spacing: -2px;
        }

        .retrait-balance strong span {
          margin-left: 6px;
          color: #FFB680;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0;
        }

        .retrait-rules {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }

        .rule {
          padding: 16px;
          background: #fff;
          border: 1px solid var(--line);
          border-bottom: 3px solid var(--blue-700);
          border-radius: 18px;
        }

        .rule:nth-child(2) {
          border-bottom-color: var(--orange);
        }

        .rule small {
          display: block;
          color: var(--muted);
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .rule strong {
          color: var(--blue-800);
          font-size: 16px;
          font-weight: 800;
        }

        .card {
          padding: 26px;
          margin-bottom: 18px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 24px;
        }

        .card h2 {
          color: var(--blue-800);
          font-size: 20px;
          margin-bottom: 6px;
        }

        .card > p {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        /* ---------- Formulaire ---------- */

        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          color: var(--blue-800);
          font-size: 13px;
          font-weight: 700;
        }

        .field input,
        .field select {
          width: 100%;
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

        .field input:focus,
        .field select:focus {
          border-color: var(--orange);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(255,122,26,.15);
        }

        .field input:disabled {
          opacity: .6;
        }

        .hint {
          color: var(--muted-2);
          font-size: 12px;
        }

        .retrait-page .react-tel-input .form-control {
          background: var(--blue-50) !important;
          border-color: var(--line) !important;
          color: var(--ink) !important;
        }

        .retrait-page .react-tel-input .form-control:focus {
          border-color: var(--orange) !important;
          background: #fff !important;
          box-shadow: 0 0 0 4px rgba(255,122,26,.15) !important;
        }

        .retrait-page .react-tel-input .flag-dropdown {
          background: var(--blue-50) !important;
          border-color: var(--line) !important;
        }

        /* ---------- Récapitulatif ---------- */

        .summary {
          padding: 16px;
          border-radius: 16px;
          background: var(--blue-50);
          border-left: 4px solid var(--blue-700);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 6px 0;
          color: var(--muted);
          font-size: 13px;
        }

        .summary-row strong {
          color: var(--ink);
          font-weight: 700;
        }

        .summary-row.total {
          margin-top: 6px;
          padding-top: 12px;
          border-top: 1px dashed var(--line);
          color: var(--blue-800);
          font-size: 14px;
          font-weight: 800;
        }

        .summary-row.total strong {
          color: var(--orange-text);
          font-size: 18px;
          font-weight: 800;
        }

        /* ---------- Boutons ---------- */

        .btn {
          height: 52px;
          padding: 0 22px;
          border: 0;
          border-radius: 14px;
          background: var(--orange);
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(255,122,26,.38);
          transition: transform .2s ease, background .2s ease, opacity .2s ease;
        }

        .btn:hover:not(:disabled) {
          background: var(--orange-dark);
          transform: translateY(-1px);
        }

        .btn:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .btn-ghost {
          height: 46px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: #fff;
          color: var(--blue-800);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: none;
        }

        .btn-ghost:hover:not(:disabled) {
          border-color: var(--orange);
          background: #fff;
          color: var(--orange-text);
        }

        .btn-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* ---------- Messages ---------- */

        .notice {
          padding: 13px 15px;
          margin-bottom: 16px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.55;
        }

        .notice.error {
          background: var(--red-soft);
          border: 1px solid #F6CFC6;
          color: var(--red);
        }

        .notice.success {
          background: var(--green-soft);
          border: 1px solid rgba(22,122,72,.2);
          color: var(--green);
        }

        .notice.info {
          background: var(--orange-soft);
          border-left: 4px solid var(--orange);
          color: var(--blue-800);
        }

        .code-input {
          letter-spacing: 12px;
          text-align: center;
          font-size: 24px !important;
          font-weight: 800;
        }

        /* ---------- Historique ---------- */

        .history {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-empty {
          padding: 22px 10px;
          text-align: center;
          color: var(--muted);
          font-size: 13px;
        }

        .history-item {
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 18px;
        }

        .history-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .history-amount {
          color: var(--blue-800);
          font-size: 17px;
          font-weight: 800;
        }

        .history-date {
          margin-top: 3px;
          color: var(--muted-2);
          font-size: 12px;
        }

        .badge {
          flex-shrink: 0;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .badge.pending {
          background: var(--orange-soft);
          color: var(--orange-text);
        }

        .badge.paid {
          background: var(--green-soft);
          color: var(--green);
        }

        .badge.refused {
          background: var(--red-soft);
          color: var(--red);
        }

        .history-meta {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #EDF1F7;
          display: grid;
          gap: 5px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.5;
        }

        .history-meta strong {
          color: var(--ink);
          font-weight: 700;
        }

        .state-box {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          text-align: center;
          color: var(--muted);
          font-size: 14px;
        }

        @media (max-width: 560px) {
          .retrait-rules {
            grid-template-columns: 1fr;
          }

          .card {
            padding: 20px;
            border-radius: 20px;
          }

          .retrait-balance {
            padding: 24px;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="retrait-page">
        <header className="retrait-top">
          <Link to="/" className="retrait-logo">
            PHI <span>ACADEMY</span>
          </Link>

          <Link to="/parrainage" className="retrait-back">
            ← Retour au parrainage
          </Link>
        </header>

        {loading ? (
          <div className="state-box">Chargement de votre espace retrait...</div>
        ) : loadError && !data ? (
          <div className="state-box">
            <div>
              <div className="notice error">{loadError}</div>

              <button
                type="button"
                className="btn"
                onClick={() => {
                  setLoading(true);
                  loadData();
                }}
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : (
          <main className="retrait-wrap">
            <span className="retrait-label">Retrait</span>

            <h1>Retirer mes gains.</h1>

            <p className="retrait-intro">
              Demandez le paiement de vos commissions. Chaque demande est
              payée manuellement par l'équipe PHI Academy.
            </p>

            <section className="retrait-balance">
              <small>Solde disponible</small>

              <strong>
                {balance.toLocaleString("fr-FR")}
                <span>FCFA</span>
              </strong>
            </section>

            <section className="retrait-rules">
              <div className="rule">
                <small>Montant minimum</small>
                <strong>{formatAmount(minAmount)}</strong>
              </div>

              <div className="rule">
                <small>Frais de retrait</small>
                <strong>{feePercent} %</strong>
              </div>

              <div className="rule">
                <small>Délai de paiement</small>
                <strong>{PAYMENT_DELAY_HOURS} h maximum</strong>
              </div>
            </section>

            {/* ---------- DEMANDE ---------- */}

            {step === "done" ? (
              <section className="card">
                <h2>Demande enregistrée</h2>

                <p>
                  Votre demande est en attente. Vous serez payé au plus tard
                  sous {PAYMENT_DELAY_HOURS} heures. Le statut passera à
                  « Payé » dès que le virement aura été effectué.
                </p>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={startNewRequest}
                >
                  Terminer
                </button>
              </section>
            ) : hasPending ? (
              <section className="card">
                <h2>Une demande est déjà en cours</h2>

                <div className="notice info" style={{ marginBottom: 0 }}>
                  Vous avez une demande « En attente ». Vous pourrez en faire
                  une nouvelle une fois qu'elle aura été payée ou refusée.
                </div>
              </section>
            ) : step === "confirm" ? (
              <section className="card">
                <h2>Vérifiez votre demande</h2>

                <p>
                  Vérifiez les informations ci-dessous avant de confirmer.
                  Le paiement sera envoyé au numéro {phone}.
                </p>

                {message.text && (
                  <div className={`notice ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="summary" style={{ marginBottom: 16 }}>
                  <div className="summary-row">
                    <span>Montant demandé</span>
                    <strong>{formatAmount(amountNumber)}</strong>
                  </div>

                  <div className="summary-row">
                    <span>Frais ({feePercent} %)</span>
                    <strong>− {formatAmount(fee)}</strong>
                  </div>

                  <div className="summary-row total">
                    <span>Vous recevrez</span>
                    <strong>{formatAmount(netAmount)}</strong>
                  </div>
                </div>

                <form className="form" onSubmit={handleConfirm}>
                  <div className="btn-row">
                    <button
                      type="submit"
                      className="btn"
                      disabled={submitting}
                    >
                      {submitting
                        ? "Enregistrement..."
                        : "Confirmer le retrait"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={backToForm}
                    >
                      Modifier ma demande
                    </button>
                  </div>
                </form>
              </section>
            ) : (
              <section className="card">
                <h2>Nouvelle demande</h2>

                <p>
                  Indiquez le montant et le numéro sur lequel vous souhaitez
                  être payé.
                </p>

                {message.text && (
                  <div className={`notice ${message.type}`}>
                    {message.text}
                  </div>
                )}

                {balance < minAmount && (
                  <div className="notice info">
                    Votre solde est inférieur au minimum de retrait (
                    {formatAmount(minAmount)}).
                  </div>
                )}

                <form className="form" onSubmit={handleContinue}>
                  <div className="field">
                    <label htmlFor="withdraw-amount">Montant à retirer (FCFA)</label>

                    <input
                      id="withdraw-amount"
                      type="text"
                      inputMode="numeric"
                      value={amount}
                      onChange={(event) =>
                        setAmount(event.target.value.replace(/[^\d]/g, ""))
                      }
                      placeholder={`Minimum ${minAmount.toLocaleString("fr-FR")}`}
                      disabled={balance < minAmount}
                      required
                    />

                    <span className="hint">
                      Maximum : {formatAmount(balance)}
                    </span>
                  </div>

                  <div className="field">
                    <label htmlFor="withdraw-phone">Numéro de dépôt</label>

                    <PhoneInput
                      country="bf"
                      enableSearch
                      countryCodeEditable={false}
                      value={phone}
                      onChange={(value) => setPhone(value ? `+${value}` : "")}
                      inputProps={{
                        id: "withdraw-phone",
                        name: "phone",
                        required: true,
                        autoComplete: "tel",
                      }}
                      searchPlaceholder="Rechercher un pays..."
                      disabled={balance < minAmount}
                      containerStyle={{ width: "100%" }}
                      inputStyle={{
                        width: "100%",
                        height: "50px",
                        borderRadius: "12px",
                        fontSize: "14px",
                      }}
                      buttonStyle={{
                        borderRadius: "12px 0 0 12px",
                      }}
                    />

                    <span className="hint">
                      Vérifiez bien ce numéro : le paiement y sera envoyé.
                    </span>
                  </div>

                  {amountIsValid && (
                    <div className="summary">
                      <div className="summary-row">
                        <span>Montant demandé</span>
                        <strong>{formatAmount(amountNumber)}</strong>
                      </div>

                      <div className="summary-row">
                        <span>Frais ({feePercent} %)</span>
                        <strong>− {formatAmount(fee)}</strong>
                      </div>

                      <div className="summary-row total">
                        <span>Vous recevrez</span>
                        <strong>{formatAmount(netAmount)}</strong>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn"
                    disabled={balance < minAmount}
                  >
                    Continuer
                  </button>
                </form>
              </section>
            )}

            {/* ---------- HISTORIQUE ---------- */}

            <section className="card">
              <h2>Mes demandes</h2>

              <p>
                Suivez l'état de vos retraits. « Payé » signifie que le
                virement a bien été effectué.
              </p>

              <div className="history">
                {withdrawals.length === 0 ? (
                  <div className="history-empty">
                    Vous n'avez encore fait aucune demande de retrait.
                  </div>
                ) : (
                  withdrawals.map((item) => (
                    <div
                      className="history-item"
                      key={item._id || item.id}
                    >
                      <div className="history-head">
                        <div>
                          <div className="history-amount">
                            {formatAmount(item.amount)}
                          </div>

                          <div className="history-date">
                            Demandé le {formatDateTime(item.createdAt)}
                          </div>
                        </div>

                        <span className={`badge ${item.status}`}>
                          {STATUS_LABELS[item.status] || item.status}
                        </span>
                      </div>

                      <div className="history-meta">
                        <div>
                          Frais : <strong>{formatAmount(item.fee)}</strong> ·
                          Net à recevoir :{" "}
                          <strong>
                            {formatAmount(
                              item.netAmount ?? item.amount - item.fee
                            )}
                          </strong>
                        </div>

                        <div>
                          Dépôt au <strong>{item.phone}</strong>
                        </div>

                        {item.status === "pending" && (
                          <div>
                            Paiement prévu au plus tard le{" "}
                            <strong>{getDeadline(item.createdAt)}</strong>
                          </div>
                        )}

                        {item.status === "paid" && (
                          <div>
                            Payé le{" "}
                            <strong>{formatDateTime(item.paidAt)}</strong>
                          </div>
                        )}

                        {item.status === "refused" && (
                          <div>
                            Motif :{" "}
                            <strong>
                              {item.refusalReason || "Non précisé"}
                            </strong>
                            . Le montant a été remis dans votre solde.
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        )}
      </div>
    </>
  );
}
