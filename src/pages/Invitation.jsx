import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

const REFERRAL_STORAGE_KEY = "phi_referral_code";

/*
 * Page ouverte par un lien d'invitation : /r/CODE
 * - mémorise le code sur l'appareil du visiteur ;
 * - l'envoie vers l'inscription, code déjà rempli.
 */
export default function Invitation() {
  const { code } = useParams();

  const cleanCode = String(code || "")
    .trim()
    .toUpperCase();

  const valid = /^[A-Z0-9]{4,20}$/.test(cleanCode);

  useEffect(() => {
    if (!valid) return;

    try {
      localStorage.setItem(REFERRAL_STORAGE_KEY, cleanCode);
    } catch {
      /* navigation privée : le code reste dans l'adresse */
    }
  }, [valid, cleanCode]);

  if (!valid) {
    return <Navigate to="/connexion-cursus?mode=register" replace />;
  }

  return (
    <Navigate
      to={`/connexion-cursus?mode=register&ref=${encodeURIComponent(
        cleanCode
      )}`}
      replace
    />
  );
}
