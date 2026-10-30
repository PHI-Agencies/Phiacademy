import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const PAYMENT_DELAY_HOURS = 72;

const STATUS_LABELS = {
  pending: "En attente",
  paid: "Payé",
  refused: "Refusé",
};

const FILTERS = [
  { key: "pending", label: "En attente" },
  { key: "paid", label: "Payés" },
  { key: "refused", label: "Refusés" },
  { key: "all", label: "Tous" },
];

export default function AdminRetraits() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("pending");
  const [query, setQuery] = useState("");

  const [modal, setModal] = useState(null); // { type: "pay" | "refuse", item }
  const [reference, setReference] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [modalError, setModalError] = useState("");
  const [copied, setCopied] = useState("");

  /* ---------- Chargement ---------- */

  const loadItems = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/admin/withdrawals", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/admin-login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Impossible de charger les demandes."
        );
      }

      setItems(Array.isArray(data) ? data : data.withdrawals || []);
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  /* ---------- Formats ---------- */

  const formatAmount = (value) =>
    `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;

  const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeadlineDate = (createdAt) => {
    const date = new Date(createdAt);

    date.setHours(date.getHours() + PAYMENT_DELAY_HOURS);

    return date;
  };

  const getRemaining = (createdAt) => {
    const diff = getDeadlineDate(createdAt).getTime() - Date.now();

    if (Number.isNaN(diff)) return { text: "—", late: false };

    const hours = Math.floor(Math.abs(diff) / 3600000);
    const days = Math.floor(hours / 24);

    const label =
      days >= 1 ? `${days} j ${hours % 24} h` : `${hours} h`;

    return diff < 0
      ? { text: `En retard de ${label}`, late: true }
      : { text: `Reste ${label}`, late: false };
  };

  const getMemberName = (item) =>
    item.memberName ||
    [item.user?.firstName, item.user?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Membre";

  const getMemberEmail = (item) =>
    item.memberEmail || item.user?.email || "";

  const getNet = (item) =>
    item.netAmount ?? Number(item.amount || 0) - Number(item.fee || 0);

  /* ---------- Filtrage ---------- */

  const counts = useMemo(
    () => ({
      pending: items.filter((item) => item.status === "pending").length,
      paid: items.filter((item) => item.status === "paid").length,
      refused: items.filter((item) => item.status === "refused").length,
      all: items.length,
    }),
    [items]
  );

  const visibleItems = useMemo(() => {
    const search = query.trim().toLowerCase();

    const list = items.filter((item) => {
      if (filter !== "all" && item.status !== filter) return false;

      if (!search) return true;

      return [
        getMemberName(item),
        getMemberEmail(item),
        item.phone,
        item.operator,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });

    // Les plus anciennes en premier pour tenir le délai de 72 h
    return list.sort((a, b) =>
      filter === "pending"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [items, filter, query]);

  /* ---------- Actions ---------- */

  const copyValue = async (value, key) => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  };

  const openModal = (type, item) => {
    setModal({ type, item });
    setReference("");
    setReason("");
    setModalError("");
  };

  const closeModal = () => {
    if (busy) return;
    setModal(null);
  };

  const submitModal = async () => {
    if (!modal) return;

    if (modal.type === "refuse" && !reason.trim()) {
      setModalError("Veuillez indiquer le motif du refus.");
      return;
    }

    setBusy(true);
    setModalError("");

    try {
      const id = modal.item._id || modal.item.id;

      const body =
        modal.type === "pay"
          ? { status: "paid", reference: reference.trim() }
          : { status: "refused", reason: reason.trim() };

      const response = await fetch(`/api/admin/withdrawals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/admin-login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Impossible de mettre à jour la demande."
        );
      }

      setModal(null);
      await loadItems();
    } catch (err) {
      setModalError(err.message || "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  };

  /* =========================================================
     RENDU
  ========================================================= */

  return (
    <>
      <style>{`
        .admin-ret {
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

        .admin-ret,
        .admin-ret * {
          box-sizing: border-box;
        }

        .admin-ret * {
          margin: 0;
          padding: 0;
        }

        .admin-ret {
          min-height: 100vh;
          background: var(--bg);
          color: var(--ink);
          font-family: Inter, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .admin-ret button,
        .admin-ret input,
        .admin-ret textarea {
          font-family: inherit;
        }

        .ar-top {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 5%;
          background: linear-gradient(180deg, var(--blue-900), var(--blue-800));
          color: #fff;
        }

        .ar-logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .ar-logo span {
          color: var(--orange);
        }

        .ar-tag {
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(255,255,255,.12);
          color: #FFD3AE;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .ar-wrap {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 5% 80px;
        }

        .ar-wrap h1 {
          color: var(--blue-800);
          font-size: clamp(26px, 5vw, 36px);
          letter-spacing: -1.2px;
          margin-bottom: 6px;
        }

        .ar-sub {
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 22px;
        }

        .ar-tools {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 18px;
        }

        .ar-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ar-filter {
          padding: 10px 14px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: #fff;
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .ar-filter strong {
          margin-left: 6px;
          padding: 2px 7px;
          border-radius: 999px;
          background: var(--blue-100);
          color: var(--blue-800);
          font-size: 11px;
        }

        .ar-filter.active {
          border-color: var(--orange);
          background: var(--orange);
          color: #fff;
        }

        .ar-filter.active strong {
          background: rgba(255,255,255,.25);
          color: #fff;
        }

        .ar-search {
          width: 100%;
          height: 46px;
          padding: 0 14px;
          border: 1px solid var(--line);
          border-radius: 12px;
          outline: none;
          background: #fff;
          font-size: 14px;
          color: var(--ink);
        }

        .ar-search:focus {
          border-color: var(--orange);
          box-shadow: 0 0 0 4px rgba(255,122,26,.15);
        }

        .ar-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ar-card {
          padding: 20px;
          background: #fff;
          border: 1px solid var(--line);
          border-left: 4px solid var(--blue-700);
          border-radius: 18px;
        }

        .ar-card.pending {
          border-left-color: var(--orange);
        }

        .ar-card.paid {
          border-left-color: var(--green);
        }

        .ar-card.refused {
          border-left-color: var(--red);
        }

        .ar-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .ar-name {
          color: var(--blue-800);
          font-size: 16px;
          font-weight: 800;
        }

        .ar-email {
          margin-top: 2px;
          color: var(--muted-2);
          font-size: 12px;
          word-break: break-all;
        }

        .ar-badge {
          flex-shrink: 0;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .ar-badge.pending {
          background: var(--orange-soft);
          color: var(--orange-text);
        }

        .ar-badge.paid {
          background: var(--green-soft);
          color: var(--green);
        }

        .ar-badge.refused {
          background: var(--red-soft);
          color: var(--red);
        }

        .ar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .ar-box {
          padding: 12px 14px;
          border-radius: 12px;
          background: var(--blue-50);
        }

        .ar-box small {
          display: block;
          margin-bottom: 4px;
          color: var(--muted);
          font-size: 11px;
          font-weight: 700;
        }

        .ar-box strong {
          color: var(--ink);
          font-size: 14px;
          font-weight: 800;
          word-break: break-word;
        }

        .ar-box.net {
          background: var(--orange-soft);
        }

        .ar-box.net strong {
          color: var(--orange-text);
          font-size: 18px;
        }

        .ar-copy {
          margin-top: 8px;
          padding: 5px 9px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
          color: var(--blue-800);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .ar-copy:hover {
          border-color: var(--orange);
          color: var(--orange-text);
        }

        .ar-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid #EDF1F7;
        }

        .ar-info {
          color: var(--muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .ar-info .late {
          color: var(--red);
          font-weight: 800;
        }

        .ar-info .ok {
          color: var(--green);
          font-weight: 800;
        }

        .ar-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ar-btn {
          height: 42px;
          padding: 0 16px;
          border: 0;
          border-radius: 11px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
        }

        .ar-btn.pay {
          background: var(--green);
          color: #fff;
        }

        .ar-btn.pay:hover:not(:disabled) {
          background: #0F6137;
        }

        .ar-btn.refuse {
          background: #fff;
          border: 1px solid #F0C7BF;
          color: var(--red);
        }

        .ar-btn.refuse:hover:not(:disabled) {
          background: var(--red-soft);
        }

        .ar-btn.primary {
          background: var(--orange);
          color: #fff;
        }

        .ar-btn.primary:hover:not(:disabled) {
          background: var(--orange-dark);
        }

        .ar-btn.ghost {
          background: #fff;
          border: 1px solid var(--line);
          color: var(--blue-800);
        }

        .ar-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .ar-empty,
        .ar-state {
          padding: 40px 16px;
          text-align: center;
          color: var(--muted);
          font-size: 14px;
        }

        .ar-error {
          padding: 13px 15px;
          margin-bottom: 14px;
          border: 1px solid #F6CFC6;
          border-radius: 14px;
          background: var(--red-soft);
          color: var(--red);
          font-size: 13px;
        }

        /* ---------- Fenêtre ---------- */

        .ar-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(6,26,74,.6);
          backdrop-filter: blur(3px);
        }

        .ar-modal {
          width: 100%;
          max-width: 440px;
          padding: 26px;
          background: #fff;
          border-top: 4px solid var(--orange);
          border-radius: 22px;
        }

        .ar-modal h2 {
          color: var(--blue-800);
          font-size: 20px;
          margin-bottom: 8px;
        }

        .ar-modal p {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .ar-modal .ar-recap {
          padding: 12px 14px;
          margin-bottom: 14px;
          border-radius: 12px;
          background: var(--orange-soft);
          color: var(--blue-800);
          font-size: 13px;
          line-height: 1.6;
        }

        .ar-modal label {
          display: block;
          margin-bottom: 6px;
          color: var(--blue-800);
          font-size: 13px;
          font-weight: 700;
        }

        .ar-modal input,
        .ar-modal textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--line);
          border-radius: 12px;
          outline: none;
          background: var(--blue-50);
          font-size: 14px;
          color: var(--ink);
        }

        .ar-modal textarea {
          min-height: 90px;
          resize: vertical;
        }

        .ar-modal input:focus,
        .ar-modal textarea:focus {
          border-color: var(--orange);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(255,122,26,.15);
        }

        .ar-modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }

        .ar-modal-actions .ar-btn {
          flex: 1;
        }
      `}</style>

      <div className="admin-ret">
        <header className="ar-top">
          <div className="ar-logo">
            PHI <span>ACADEMY</span>
          </div>

          <span className="ar-tag">Administration</span>
        </header>

        <main className="ar-wrap">
          <h1>Demandes de retrait</h1>

          <p className="ar-sub">
            Envoyez le virement, puis marquez la demande comme payée. Le
            délai promis aux membres est de {PAYMENT_DELAY_HOURS} heures.
          </p>

          {error && <div className="ar-error">{error}</div>}

          <div className="ar-tools">
            <div className="ar-filters">
              {FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`ar-filter ${
                    filter === item.key ? "active" : ""
                  }`}
                  onClick={() => setFilter(item.key)}
                >
                  {item.label}
                  <strong>{counts[item.key]}</strong>
                </button>
              ))}
            </div>

            <input
              className="ar-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un nom, un e-mail ou un numéro..."
            />
          </div>

          {loading ? (
            <div className="ar-state">Chargement des demandes...</div>
          ) : visibleItems.length === 0 ? (
            <div className="ar-empty">Aucune demande à afficher.</div>
          ) : (
            <div className="ar-list">
              {visibleItems.map((item) => {
                const id = item._id || item.id;
                const remaining = getRemaining(item.createdAt);

                return (
                  <article
                    className={`ar-card ${item.status}`}
                    key={id}
                  >
                    <div className="ar-head">
                      <div>
                        <div className="ar-name">{getMemberName(item)}</div>
                        <div className="ar-email">{getMemberEmail(item)}</div>
                      </div>

                      <span className={`ar-badge ${item.status}`}>
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </div>

                    <div className="ar-grid">
                      <div className="ar-box net">
                        <small>Montant à envoyer</small>
                        <strong>{formatAmount(getNet(item))}</strong>

                        <div>
                          <button
                            type="button"
                            className="ar-copy"
                            onClick={() =>
                              copyValue(getNet(item), `net-${id}`)
                            }
                          >
                            {copied === `net-${id}` ? "Copié ✓" : "Copier"}
                          </button>
                        </div>
                      </div>

                      <div className="ar-box">
                        <small>
                          Numéro de dépôt
                        </small>
                        <strong>{item.phone}</strong>

                        <div>
                          <button
                            type="button"
                            className="ar-copy"
                            onClick={() =>
                              copyValue(item.phone, `phone-${id}`)
                            }
                          >
                            {copied === `phone-${id}` ? "Copié ✓" : "Copier"}
                          </button>
                        </div>
                      </div>

                      <div className="ar-box">
                        <small>Montant demandé</small>
                        <strong>{formatAmount(item.amount)}</strong>
                        <div className="ar-email">
                          Frais : {formatAmount(item.fee)}
                        </div>
                      </div>
                    </div>

                    <div className="ar-foot">
                      <div className="ar-info">
                        Demandé le {formatDateTime(item.createdAt)}
                        <br />

                        {item.status === "pending" && (
                          <span className={remaining.late ? "late" : "ok"}>
                            {remaining.text}
                          </span>
                        )}

                        {item.status === "paid" && (
                          <>
                            Payé le {formatDateTime(item.paidAt)}
                            {item.reference
                              ? ` · Réf. ${item.reference}`
                              : ""}
                          </>
                        )}

                        {item.status === "refused" && (
                          <>
                            Motif : {item.refusalReason || "Non précisé"}
                          </>
                        )}
                      </div>

                      {item.status === "pending" && (
                        <div className="ar-actions">
                          <button
                            type="button"
                            className="ar-btn refuse"
                            onClick={() => openModal("refuse", item)}
                          >
                            Refuser
                          </button>

                          <button
                            type="button"
                            className="ar-btn pay"
                            onClick={() => openModal("pay", item)}
                          >
                            Marquer comme payé
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        {modal && (
          <div
            className="ar-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <div className="ar-modal" role="dialog" aria-modal="true">
              {modal.type === "pay" ? (
                <>
                  <h2>Confirmer le paiement</h2>

                  <p>
                    Ne confirmez que si le virement a réellement été
                    effectué. Le membre verra le statut « Payé ».
                  </p>
                </>
              ) : (
                <>
                  <h2>Refuser la demande</h2>

                  <p>
                    Le montant sera remis dans le solde du membre. Il verra
                    le motif que vous indiquez.
                  </p>
                </>
              )}

              <div className="ar-recap">
                <strong>{getMemberName(modal.item)}</strong>
                <br />
                {formatAmount(getNet(modal.item))} · {modal.item.phone}
              </div>

              {modalError && (
                <div className="ar-error">{modalError}</div>
              )}

              {modal.type === "pay" ? (
                <div>
                  <label htmlFor="ar-reference">
                    Référence du virement (facultatif)
                  </label>

                  <input
                    id="ar-reference"
                    type="text"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Ex. numéro de transaction"
                    disabled={busy}
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="ar-reason">Motif du refus</label>

                  <textarea
                    id="ar-reason"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Ex. numéro invalide"
                    disabled={busy}
                  />
                </div>
              )}

              <div className="ar-modal-actions">
                <button
                  type="button"
                  className="ar-btn ghost"
                  onClick={closeModal}
                  disabled={busy}
                >
                  Annuler
                </button>

                <button
                  type="button"
                  className={`ar-btn ${
                    modal.type === "pay" ? "pay" : "primary"
                  }`}
                  onClick={submitModal}
                  disabled={busy}
                >
                  {busy
                    ? "Enregistrement..."
                    : modal.type === "pay"
                    ? "Oui, c'est payé"
                    : "Refuser la demande"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
