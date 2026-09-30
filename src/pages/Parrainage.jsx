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
            background: #f7f8fa;
            color: #0b132b;
          }

          .referral-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
            background: #f7f8fa;
          }

          .referral-loading-card {
            width: 100%;
            max-width: 360px;
            padding: 30px;
            text-align: center;
            background: white;
            border: 1px solid #e7e9ee;
            border-radius: 24px;
          }

          .referral-loading-logo {
            font-size: 20px;
            font-weight: 800;
            margin-bottom: 14px;
          }

          .referral-loading-logo span {
            color: #d4af37;
          }

          .referral-loading-text {
            color: #747b87;
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

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          font-family: inherit;
        }

        .referral-page {
          min-height: 100vh;
          background: #f7f8fa;
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
          border-bottom: 1px solid rgba(11, 19, 43, 0.06);
          backdrop-filter: blur(12px);
        }

        .referral-logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .referral-logo span {
          color: #d4af37;
        }

        .referral-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .referral-nav a {
          color: #666d7c;
          font-size: 14px;
          font-weight: 600;
        }

        .referral-nav a.active {
          color: #0b132b;
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
          margin-bottom: 15px;
          color: #a17e19;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .referral-header h1 {
          font-size: clamp(38px, 6vw, 58px);
          line-height: 1.05;
          letter-spacing: -2.5px;
          margin-bottom: 15px;
        }

        .referral-header p {
          max-width: 620px;
          color: #687080;
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
          background: #fff4f4;
          border: 1px solid #f0d5d5;
          color: #9b4444;
          font-size: 12px;
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
          background: #0b132b;
          color: white;
          margin-bottom: 20px;
        }

        .balance-card::after {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          right: -90px;
          top: -130px;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 55, 0.25);
        }

        .balance-label {
          position: relative;
          z-index: 2;
          color: #aeb5c4;
          font-size: 12px;
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
          font-weight: 600;
          color: #d4af37;
          letter-spacing: 0;
        }

        .withdraw-btn {
          position: relative;
          z-index: 2;
          display: inline-block;
          padding: 13px 20px;
          border-radius: 50px;
          background: #d4af37;
          color: #0b132b;
          font-size: 13px;
          font-weight: 800;
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
          border: 1px solid #e7e9ee;
          border-radius: 25px;
        }

        .stat-label {
          color: #858b98;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        /* =========================
           REFERRAL LINK
        ========================= */

        .link-card {
          padding: 28px;
          background: white;
          border: 1px solid #e7e9ee;
          border-radius: 28px;
          margin-bottom: 20px;
        }

        .link-card h2 {
          font-size: 20px;
          margin-bottom: 8px;
        }

        .link-card p {
          color: #737a87;
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
          border: 1px solid #e3e5ea;
          border-radius: 15px;
          background: #f7f8fa;
          color: #59606d;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .copy-btn {
          border: none;
          padding: 0 20px;
          border-radius: 15px;
          background: #0b132b;
          color: white;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        /* =========================
           REFERRALS
        ========================= */

        .referrals-card {
          padding: 28px;
          background: white;
          border: 1px solid #e7e9ee;
          border-radius: 28px;
        }

        .referrals-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .referrals-header h2 {
          font-size: 20px;
        }

        .referrals-header span {
          color: #858b98;
          font-size: 12px;
        }

        .referral-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .referral-empty {
          padding: 25px 15px;
          text-align: center;
          color: #858b98;
          font-size: 13px;
          line-height: 1.6;
        }

        .referral-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 17px;
          border: 1px solid #eceef1;
          border-radius: 18px;
        }

        .referral-user {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .avatar {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #f0f1f4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #6b7280;
        }

        .referral-name {
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .referral-date {
          color: #8a909b;
          font-size: 11px;
        }

        .referral-right {
          text-align: right;
          flex-shrink: 0;
        }

        .commission {
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .status {
          font-size: 10px;
          font-weight: 700;
          color: #71805c;
        }

        .status.pending {
          color: #a17e19;
        }

        /* =========================
           INFO
        ========================= */

        .referral-info {
          margin-top: 20px;
          padding: 18px;
          border-radius: 18px;
          background: #f0f1f4;
          color: #747b87;
          font-size: 12px;
          line-height: 1.65;
        }

        /* =========================
           FOOTER
        ========================= */

        .referral-footer {
          padding: 30px 6%;
          text-align: center;
          background: white;
          border-top: 1px solid #e7e9ee;
          color: #858b98;
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
            height: 45px;
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
                  color: "#858b98",
                  fontSize: "11px",
                }}
              >
                Code de parrainage :{" "}
                <strong style={{ color: "#0b132b" }}>
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