import React from "react";

const WHATSAPP_NUMBER = "22656918108";

const MESSAGE =
  "Bonjour, j'ai besoin d'aide pour me connecter à mon espace PHI Academy.";

export default function SupportButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    MESSAGE
  )}`;

  return (
    <>
      <style>{`
        .support-fab {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .support-fab-label {
          padding: 8px 12px;
          border-radius: 999px;
          background: #ffffff;
          color: #0A2A66;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 6px 18px rgba(10, 42, 102, 0.16);
          border: 1px solid #DFE6F2;
          white-space: nowrap;
        }

        .support-fab-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #FF7A1A;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(255, 122, 26, 0.45);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .support-fab:hover .support-fab-circle {
          background: #E86405;
          transform: translateY(-2px);
        }

        @media (max-width: 380px) {
          .support-fab-label { display: none; }
        }
      `}</style>

      <a
        className="support-fab"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Demander de l'aide au service client sur WhatsApp"
      >
        <span className="support-fab-label">Service client</span>

        <span className="support-fab-circle" aria-hidden="true">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
            <path d="M3 14h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-3z" />
            <path d="M21 14h-3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2v-3z" />
            <path d="M21 17v1a3 3 0 0 1-3 3h-4" />
          </svg>
        </span>
      </a>
    </>
  );
}
