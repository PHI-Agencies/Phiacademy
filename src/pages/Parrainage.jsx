import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Parrainage() {
  const navigate = useNavigate();

  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadReferralData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/referral", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/connexion-parrainage?redirect=/parrainage", {
            replace: true,
          });
          return;
        }

        if (response.status === 403) {
          navigate("/connexion-parrainage?redirect=/parrainage", {
            replace: true,
          });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Impossible de récupérer les informations de parrainage."
          );
        }

        if (!cancelled) {
          setReferralData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Une erreur est survenue lors du chargement du parrainage."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReferralData();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const referrals = referralData?.referrals || [];
  const transactions = referralData?.transactions || [];

  const balance = Number(referralData?.balance || 0);

  const generatedCommissions = useMemo(() => {
    if (typeof referralData?.generatedCommissions === "number") {
      return referralData.generatedCommissions;
    }

    return transactions.reduce((total, transaction) => {
      return total + Number(transaction.amount || 0);
    }, 0);
  }, [referralData, transactions]);

  const withdrawals = Number(referralData?.withdrawals || 0);

  const referralCode = referralData?.referralCode || "";

  const referralLink = referralCode
    ? `${window.location.origin}/r/${referralCode}`
    : "";

  const formatAmount = (amount) => {
    return `${Number(amount || 0).toLocaleString("fr-FR")} FCFA`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date indisponible";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getReferralName = (referral, index) => {
    return (
      referral?.name ||
      referral?.fullName ||
      referral?.firstName ||
      `Utilisateur ${String(index + 1).padStart(2, "0")}`
    );
  };

  const getInitials = (name, index) => {
    if (!name) {
      return String(index + 1).padStart(2, "0");
    }

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const getReferralDate = (referral) => {
    return formatDate(
      referral?.date ||
        referral?.createdAt ||
        referral?.registeredAt ||
        referral?.activatedAt
    );
  };

  const getReferralStatus = (referral) => {
    if (referral?.status === "active" || referral?.status === "Actif") {
      return "Actif";
    }

    if (
      referral?.status === "pending" ||
      referral?.status === "En attente"
    ) {
      return "En attente";
    }

    return referral?.status || "En attente";
  };

  const getReferralCommission = (referral) => {
    return Number(
      referral?.commission ||
        referral?.commissionAmount ||
        referral?.amount ||
        0
    );
  };

  const copyReferralLink = async () => {
    if (!referralLink) {
      return;
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = referralLink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      const button = document.querySelector(".copy-btn");

      if (button) {
        const originalText = button.textContent;
        button.textContent = "Copié";

        setTimeout(() => {
          button.textContent = originalText;
        }, 1800);
      }
    } catch {
      setError("Impossible de copier le lien de parrainage.");
    }
  };

  if (loading) {
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
            background: #F4F7FC;
            color: #0A2A66;
          }

          .referral-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
            background: #F4F7FC;
          }

          .referral-loading-card {
            width: 100%;
            max-width: 360px;
            padding: 30px;
            text-align: center;
            background: white;
            border: 1px solid #DFE6F2;
            border-top: 4px solid #FF7A1A;
            border-radius: 24px;
            box-shadow: 0 15px 40px rgba(10, 42, 102, 0.08);
          }

          .referral-loading-logo {
            font-size: 20px;
            font-weight: 800;
            margin-bottom: 14px;
            color: #0A2A66;
          }

          .referral-loading-logo span {
            color: #FF7A1A;
          }

          .referral-loading-text {
            color: #5F6E8A;
            font-size: 13px;
            line-height: 1.6;
          }
        `}</style>

        <div className="referral-loading">
          <div className="referral-loading-card">
            <div className="referral-loading-logo">
              PHI <span>ACADEMY</span>
            </div>

            <div className="referral-loading-text">
              Chargement de votre espace parrainage...
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        /* =========================
           PALETTE : BLEU • BLANC • ORANGE
        ========================= */

        .referral-page {
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
          --muted-2: #8794AD;
          --line: #DFE6F2;
          --bg: #F4F7FC;
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

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          font-family: inherit;
        }

        .referral-page {
          min-height: 100vh;
          background: var(--bg);
        }

        /* =========================
           NAVBAR
        ========================= */

        .referral-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 6%;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(12px);
        }

        .referral-logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--blue-800);
        }

        .referral-logo span {
          color: var(--orange);
        }

        .referral-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .referral-nav a {
          position: relative;
          color: var(--muted);
          font-size: 14px;
          font-weight: 600;
          transition: color .2s ease;
        }

        .referral-nav a:hover {
          color: var(--blue-800);
        }

        .referral-nav a.active {
          color: var(--blue-800);
          font-weight: 800;
        }

        .referral-nav a.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -7px;
          height: 3px;
          border-radius: 999px;
          background: var(--orange);
        }

        /* =========================
           HEADER
        ========================= */

        .referral-header {
          max-width: 1100px;
          margin: auto;
          padding: 70px 6% 35px;
        }

        .referral-label {
          display: inline-block;
          margin-bottom: 16px;
          padding: 7px 12px;
          border-radius: 999px;
          background: var(--orange-soft);
          color: var(--orange-text);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .referral-header h1 {
          color: var(--blue-800);
          font-size: clamp(38px, 6vw, 58px);
          line-height: 1.05;
          letter-spacing: -2.5px;
          margin-bottom: 15px;
        }

        .referral-header p {
          max-width: 620px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.7;
        }

        /* =========================
           ERROR
        ========================= */

        .referral-error {
          max-width: 1100px;
          margin: 0 auto 20px;
          padding: 0 6%;
        }

        .referral-error-box {
          padding: 15px 17px;
          border-radius: 16px;
          background: #FFF4F2;
          border: 1px solid #F3CFC8;
          color: #A33A2A;
          font-size: 13px;
          line-height: 1.5;
        }

        /* =========================
           MAIN
        ========================= */

        .referral-content {
          max-width: 1100px;
          margin: auto;
          padding: 0 6% 90px;
        }

        /* =========================
           BALANCE
        ========================= */

        .balance-card {
          position: relative;
          overflow: hidden;
          padding: 35px;
          border-radius: 30px;
          background:
            radial-gradient(circle at 100% 0%, rgba(255, 122, 26, 0.3), transparent 50%),
            linear-gradient(135deg, var(--blue-900), var(--blue-800) 60%, var(--blue-700));
          color: white;
          margin-bottom: 20px;
          box-shadow: 0 22px 50px rgba(10, 42, 102, 0.25);
        }

        .balance-card::after {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          right: -90px;
          top: -130px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .balance-label {
          position: relative;
          z-index: 2;
          color: #C3D0EC;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .balance-amount {
          position: relative;
          z-index: 2;
          font-size: clamp(38px, 6vw, 52px);
          font-weight: 800;
          letter-spacing: -2px;
          margin-bottom: 25px;
        }

        .balance-amount span {
          font-size: 17px;
          font-weight: 700;
          color: #FFB680;
          letter-spacing: 0;
        }

        .withdraw-btn {
          position: relative;
          z-index: 2;
          display: inline-block;
          padding: 14px 22px;
          border-radius: 50px;
          background: var(--orange);
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 10px 22px rgba(255, 122, 26, 0.4);
          transition: background .2s ease, transform .2s ease;
        }

        .withdraw-btn:hover {
          background: var(--orange-dark);
          transform: translateY(-1px);
        }

        /* =========================
           STATS
        ========================= */

        .referral-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          padding: 25px;
          background: white;
          border: 1px solid var(--line);
          border-bottom: 4px solid var(--blue-700);
          border-radius: 25px;
        }

        .stat-card:nth-child(2) {
          border-bottom-color: var(--orange);
        }

        .stat-label {
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .stat-value {
          color: var(--blue-800);
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .stat-card:nth-child(2) .stat-value {
          color: var(--orange-text);
        }

        /* =========================
           REFERRAL LINK
        ========================= */

        .link-card {
          padding: 28px;
          background: white;
          border: 1px solid var(--line);
          border-radius: 28px;
          margin-bottom: 20px;
        }

        .link-card h2 {
          color: var(--blue-800);
          font-size: 20px;
          margin-bottom: 8px;
        }

        .link-card p {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .referral-link-box {
          display: flex;
          gap: 10px;
        }

        .referral-link {
          flex: 1;
          min-width: 0;
          padding: 14px 16px;
          border: 1px dashed var(--orange);
          border-radius: 15px;
          background: var(--orange-soft);
          color: var(--blue-800);
          font-size: 13px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .copy-btn {
          border: none;
          padding: 0 22px;
          border-radius: 15px;
          background: var(--orange);
          color: white;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(255, 122, 26, 0.3);
          transition: background .2s ease;
        }

        .copy-btn:hover {
          background: var(--orange-dark);
        }

        /* =========================
           REFERRALS
        ========================= */

        .referrals-card {
          padding: 28px;
          background: white;
          border: 1px solid var(--line);
          border-radius: 28px;
        }

        .referrals-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .referrals-header h2 {
          color: var(--blue-800);
          font-size: 20px;
        }

        .referrals-header span {
          padding: 5px 10px;
          border-radius: 999px;
          background: var(--blue-100);
          color: var(--blue-800);
          font-size: 12px;
          font-weight: 700;
        }

        .referral-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .referral-empty {
          padding: 25px 15px;
          text-align: center;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .referral-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 17px;
          border: 1px solid var(--line);
          border-radius: 18px;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .referral-row:hover {
          border-color: rgba(255, 122, 26, 0.5);
          box-shadow: 0 10px 24px rgba(10, 42, 102, 0.07);
        }

        .referral-user {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .avatar {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--blue-800);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #FFB680;
        }

        .referral-name {
          color: var(--ink);
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .referral-date {
          color: var(--muted-2);
          font-size: 12px;
        }

        .referral-right {
          text-align: right;
          flex-shrink: 0;
        }

        .commission {
          color: var(--blue-800);
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .status {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 999px;
          background: #EAF8F0;
          font-size: 11px;
          font-weight: 700;
          color: #167A48;
        }

        .status.pending {
          background: var(--orange-soft);
          color: var(--orange-text);
        }

        /* =========================
           INFO
        ========================= */

        .referral-info {
          margin-top: 20px;
          padding: 18px;
          border-radius: 18px;
          background: var(--blue-50);
          border-left: 4px solid var(--blue-700);
          color: var(--muted);
          font-size: 12px;
          line-height: 1.65;
        }

        /* =========================
           FOOTER
        ========================= */

        .referral-footer {
          padding: 30px 6%;
          text-align: center;
          background: var(--blue-900);
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 750px) {
          .referral-nav {
            display: none;
          }

          .referral-stats {
            grid-template-columns: 1fr;
          }

          .referral-row {
            align-items: flex-start;
          }
        }

        @media (max-width: 500px) {
          .referral-navbar {
            padding: 17px 5%;
          }

          .referral-header {
            padding: 50px 5% 30px;
          }

          .referral-content {
            padding-left: 5%;
            padding-right: 5%;
          }

          .referral-error {
            padding-left: 5%;
            padding-right: 5%;
          }

          .balance-card {
            padding: 28px;
            border-radius: 25px;
          }

          .balance-amount {
            font-size: 40px;
          }

          .link-card,
          .referrals-card {
            padding: 23px;
            border-radius: 24px;
          }

          .referral-link-box {
            flex-direction: column;
          }

          .copy-btn {
            height: 46px;
          }

          .referral-row {
            padding: 14px;
          }

          .referral-right {
            min-width: 75px;
          }
        }
      `}</style>

      <div className="referral-page">
        {/* NAVIGATION */}

        <nav className="referral-navbar">
          <a href="/" className="referral-logo">
            PHI <span>ACADEMY</span>
          </a>

          <div className="referral-nav">
            <a href="/">Accueil</a>

            <a href="/connexion-cursus?redirect=/cursus">
              Cursus
            </a>

            <a href="/services">Services</a>

            <a
              href="/parrainage"
              className="active"
            >
              Parrainage
            </a>
          </div>
        </nav>

        {/* HEADER */}

        <header className="referral-header">
          <span className="referral-label">
            Espace parrainage
          </span>

          <h1>
            Votre réseau.
            <br />
            Votre solde.
          </h1>

          <p>
            Retrouvez ici votre lien de parrainage, vos filleuls
            et les commissions générées par les activités éligibles.
          </p>
        </header>

        {error && (
          <div className="referral-error">
            <div className="referral-error-box">
              {error}
            </div>
          </div>
        )}

        {/* CONTENT */}

        <main className="referral-content">
          {/* BALANCE */}

          <section className="balance-card">
            <div className="balance-label">
              Solde disponible
            </div>

            <div className="balance-amount">
              {Number(balance).toLocaleString("fr-FR")}{" "}
              <span>FCFA</span>
            </div>

            <a href="#retrait" className="withdraw-btn">
              Demander un retrait
            </a>
          </section>

          {/* STATS */}

          <section className="referral-stats">
            <div className="stat-card">
              <div className="stat-label">
                Filleuls
              </div>

              <div className="stat-value">
                {referrals.length}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                Commissions générées
              </div>

              <div className="stat-value">
                {formatAmount(generatedCommissions)}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                Retraits effectués
              </div>

              <div className="stat-value">
                {formatAmount(withdrawals)}
              </div>
            </div>
          </section>

          {/* LINK */}

          <section className="link-card">
            <h2>
              Votre lien de parrainage
            </h2>

            <p>
              Partagez ce lien pour inviter de nouveaux utilisateurs
              sur PHI Academy.
            </p>

            <div className="referral-link-box">
              <div className="referral-link">
                {referralLink || "Lien de parrainage indisponible"}
              </div>

              <button
                type="button"
                className="copy-btn"
                onClick={copyReferralLink}
                disabled={!referralLink}
                style={{
                  opacity: referralLink ? 1 : 0.5,
                  cursor: referralLink ? "pointer" : "not-allowed",
                }}
              >
                Copier
              </button>
            </div>

            {referralCode && (
              <div
                style={{
                  marginTop: "12px",
                  color: "#5F6E8A",
                  fontSize: "12px",
                }}
              >
                Code de parrainage :{" "}
                <strong style={{ color: "#0A2A66" }}>
                  {referralCode}
                </strong>
              </div>
            )}
          </section>

          {/* REFERRALS */}

          <section className="referrals-card">
            <div className="referrals-header">
              <h2>
                Vos filleuls
              </h2>

              <span>
                {referrals.length}{" "}
                {referrals.length > 1
                  ? "filleuls"
                  : "filleul"}
              </span>
            </div>

            <div className="referral-list">
              {referrals.length === 0 ? (
                <div className="referral-empty">
                  Vous n'avez encore aucun filleul enregistré.
                </div>
              ) : (
                referrals.map((referral, index) => {
                  const name = getReferralName(
                    referral,
                    index
                  );

                  const status =
                    getReferralStatus(referral);

                  const commission =
                    getReferralCommission(referral);

                  return (
                    <div
                      className="referral-row"
                      key={
                        referral?._id ||
                        referral?.id ||
                        index
                      }
                    >
                      <div className="referral-user">
                        <div className="avatar">
                          {getInitials(name, index)}
                        </div>

                        <div>
                          <div className="referral-name">
                            {name}
                          </div>

                          <div className="referral-date">
                            {getReferralDate(referral)}
                          </div>
                        </div>
                      </div>

                      <div className="referral-right">
                        <div className="commission">
                          {formatAmount(commission)}
                        </div>

                        <div
                          className={`status ${
                            status === "En attente"
                              ? "pending"
                              : ""
                          }`}
                        >
                          {status}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="referral-info">
              Les commissions et les soldes réels sont calculés
              et validés côté serveur. L'interface ne peut pas
              modifier directement les montants financiers.
            </div>
          </section>
        </main>

        {/* FOOTER */}

        <footer className="referral-footer">
          © {new Date().getFullYear()} PHI Academy. Tous droits réservés.
        </footer>
      </div>
    </>
  );
}
