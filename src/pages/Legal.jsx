import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Cookie,
  FileText,
  Lock,
  MessageCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";

const SUPPORT_WHATSAPP = "22656918108";
const SUPPORT_LABEL = "+226 56 91 81 08";
const UPDATED = "novembre 2026";

const whatsappHref = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
  "Bonjour, j'ai une question sur les conditions / la confidentialité de PHI Academy."
)}`;

/* =========================================================
   CONTENU
   ========================================================= */

const TERMS = {
  id: "conditions",
  path: "/conditions",
  title: "Conditions d’utilisation",
  intro:
    "Ces règles sont simples : ce que vous obtenez, ce que nous attendons de vous, et comment fonctionnent les paiements et le parrainage.",
  summary: [
    "Un paiement unique de 15 000 FCFA pour l’accès au cursus.",
    "Contenu éducatif : aucun conseil en investissement, aucun gain garanti.",
    "Parrainage : 3 000 FCFA par filleul, puis 5 000 FCFA dès le 11e.",
    "Votre argent de trading reste chez votre broker, jamais chez nous.",
  ],
  sections: [
    {
      title: "1. Qui nous sommes",
      body: [
        "PHI Academy est une plateforme de formation en ligne consacrée au trading et à la BRVM (Bourse Régionale des Valeurs Mobilières). Utiliser le site signifie que vous acceptez les présentes conditions.",
      ],
    },
    {
      title: "2. Votre compte",
      body: [
        "Pour accéder au cursus, vous créez un compte personnel avec votre nom, une adresse Gmail, votre numéro de téléphone et un mot de passe. Les informations doivent être exactes. Une adresse Gmail est obligatoire : elle permet de retrouver votre compte en cas d’oubli de mot de passe.",
        "Le compte est strictement personnel : vous ne devez ni le prêter, ni le partager, ni le revendre. Vous êtes responsable de ce qui est fait avec vos identifiants.",
        "Si le paiement n’est pas effectué dans les 30 minutes qui suivent l’inscription, le compte en attente est supprimé automatiquement. Vous pouvez simplement vous réinscrire avec les mêmes informations.",
      ],
    },
    {
      title: "3. Prix et paiement",
      body: [
        "L’accès au cursus complet (Trading et BRVM) est payé une seule fois : 15 000 FCFA. Il n’y a pas d’abonnement mensuel.",
        "Le paiement se fait via notre prestataire PayDunya (Mobile Money et cartes selon disponibilité). L’accès est ouvert dès que le paiement est confirmé. Nous ne voyons ni ne conservons vos codes Mobile Money ni les numéros de vos cartes.",
      ],
    },
    {
      title: "4. Remboursement",
      body: [
        "Le cursus est un contenu numérique accessible immédiatement après le paiement. Pour cette raison, l’accès payé n’est pas remboursable une fois activé.",
        "Si un problème technique vous empêche d’accéder au contenu, ou si vous avez payé deux fois par erreur, contactez-nous : nous corrigerons la situation ou rembourserons le paiement en trop.",
      ],
    },
    {
      title: "5. Contenu éducatif et risques",
      body: [
        "Les contenus sont proposés à titre informatif et éducatif uniquement. Ils ne constituent ni un conseil en investissement, ni une recommandation d’achat ou de vente, ni une promesse de gains.",
        "Le trading et l’investissement en bourse comportent un risque de perte pouvant aller jusqu’à la totalité du capital engagé. Ne placez jamais de l’argent dont vous avez besoin pour vivre.",
        "Une partie des vidéos est publiée par des créateurs indépendants, sans lien avec PHI Academy. Leurs opinions n’engagent qu’eux.",
      ],
    },
    {
      title: "6. Brokers et accompagnement",
      body: [
        "La page Broker présente des plateformes que nous jugeons sérieuses. Certains liens sont des liens partenaires : si vous ouvrez un compte grâce à eux, PHI Academy peut recevoir une rémunération de la part du broker, sans frais supplémentaires pour vous.",
        "Votre argent reste sur votre compte chez le broker. PHI Academy ne reçoit, ne gère et ne conserve jamais les fonds de trading de ses membres. Méfiez-vous de toute personne qui vous promet des gains garantis ou qui propose de « gérer » votre compte.",
        "L’accompagnement à l’ouverture de compte (5 000 FCFA) est une aide pour créer et sécuriser votre compte. Il ne garantit aucun résultat de trading.",
      ],
    },
    {
      title: "7. Parrainage et retraits",
      body: [
        "Chaque membre dispose d’un code de parrainage. Lorsqu’une personne s’inscrit avec votre code et que son paiement est confirmé, une commission est ajoutée à votre solde : 3 000 FCFA pour chacun de vos 10 premiers filleuls, puis 5 000 FCFA à partir du 11e.",
        "Le retrait est possible à partir de 10 000 FCFA. Des frais de 7 % sont retenus sur chaque retrait. Les retraits sont traités manuellement : prévoyez un délai de traitement.",
        "Sont interdits : parrainer sa propre personne, créer de faux comptes ou des comptes multiples, ou tromper des personnes pour les faire s’inscrire. En cas d’abus, nous pouvons annuler les commissions concernées et suspendre le compte.",
        "Le parrainage est une récompense de recommandation, pas un emploi ni un revenu garanti.",
      ],
    },
    {
      title: "8. Ce qui est interdit",
      body: [
        "Il est interdit de copier, enregistrer, diffuser ou revendre le contenu du cursus, de partager son accès, ou de tenter de contourner la sécurité du site.",
      ],
    },
    {
      title: "9. Responsabilité",
      body: [
        "Nous faisons de notre mieux pour que le site soit disponible et le contenu exact, mais nous ne pouvons pas garantir l’absence d’interruption. PHI Academy n’est pas responsable des pertes liées à vos décisions de trading ou d’investissement.",
      ],
    },
    {
      title: "10. Modifications et droit applicable",
      body: [
        "Nous pouvons mettre à jour ces conditions. La date de dernière mise à jour figure en haut de la page ; continuer à utiliser le site après une mise à jour vaut acceptation.",
        "Les présentes conditions sont régies par le droit du Burkina Faso.",
      ],
    },
  ],
};

const PRIVACY = {
  id: "confidentialite",
  path: "/confidentialite",
  title: "Politique de confidentialité",
  intro:
    "Nous collectons le minimum nécessaire pour faire fonctionner votre compte, et nous ne vendons jamais vos données.",
  summary: [
    "Nous ne vendons ni ne louons vos données à personne.",
    "Votre mot de passe est chiffré : nous ne pouvons pas le lire.",
    "« Continuer avec Google » ne nous donne que votre Gmail et votre nom.",
    "Vos paiements sont traités par PayDunya, pas stockés chez nous.",
    "Uniquement des cookies nécessaires : aucune publicité, aucun traceur.",
  ],
  sections: [
    {
      title: "1. Les données que nous collectons",
      list: [
        "Votre identité : nom et prénom.",
        "Vos coordonnées : adresse Gmail et numéro de téléphone.",
        "Votre mot de passe, conservé uniquement sous forme chiffrée (haché).",
        "Votre lien de parrainage : le code utilisé à l’inscription et la liste de vos filleuls (prénom et nom).",
        "Vos paiements : statut et montant. Les données de carte ou de Mobile Money sont saisies chez PayDunya, pas chez nous.",
        "Vos demandes de retrait : montant, opérateur et numéro de réception.",
      ],
    },
    {
      id: "google",
      title: "2. Connexion avec Google",
      body: [
        "Si vous choisissez « Continuer avec Google » pour retrouver l’accès à votre compte, Google nous confirme votre adresse Gmail et votre nom. Nous les utilisons uniquement pour vérifier que vous êtes bien le propriétaire du compte.",
        "Nous n’avons accès ni à vos emails, ni à vos contacts, ni à aucune autre donnée de votre compte Google. Nous ne partageons ces informations avec personne.",
      ],
    },
    {
      title: "3. Pourquoi nous les utilisons",
      body: [
        "Pour créer votre compte, vous donner accès au cursus, confirmer vos paiements, calculer et verser vos commissions de parrainage, traiter vos retraits et vous aider si vous nous contactez. Nous n’utilisons pas vos données pour de la publicité.",
      ],
    },
    {
      title: "4. Avec qui nous les partageons",
      body: [
        "Uniquement avec les services nécessaires au fonctionnement du site :",
      ],
      list: [
        "PayDunya, pour encaisser les paiements.",
        "Notre hébergeur et notre base de données (Render et MongoDB), qui stockent les informations du site.",
        "Google, pour confirmer votre adresse Gmail lorsque vous choisissez « Continuer avec Google ».",
        "YouTube, qui diffuse les vidéos du cursus (voir la partie Cookies).",
      ],
      after:
        "Nous ne vendons ni ne louons vos données. Nous pouvons les communiquer à une autorité si la loi nous y oblige.",
    },
    {
      title: "5. Combien de temps nous les gardons",
      body: [
        "Les comptes qui n’ont pas payé sont supprimés automatiquement au bout de 30 minutes. Les comptes actifs sont conservés tant que vous utilisez le service. Certaines informations de paiement et de retrait peuvent être gardées plus longtemps lorsque c’est nécessaire pour la comptabilité et la prévention de la fraude.",
      ],
    },
    {
      title: "6. Comment nous les protégeons",
      body: [
        "Le site fonctionne en connexion sécurisée (HTTPS). Les mots de passe sont chiffrés. Les cookies de connexion sont protégés et inaccessibles aux scripts du navigateur. Les actions sensibles (parrainage, retrait) demandent une confirmation de mot de passe supplémentaire.",
        "Aucun système n’est parfait : si vous constatez quoi que ce soit d’anormal sur votre compte, prévenez-nous rapidement.",
      ],
    },
    {
      id: "cookies",
      title: "7. Cookies et stockage local",
      body: [
        "Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement du site. Nous n’utilisons aucun cookie publicitaire ni outil de suivi de votre navigation.",
      ],
      table: {
        head: ["Nom", "À quoi il sert", "Durée"],
        rows: [
          [
            "phi_session",
            "Vous garder connecté et ouvrir le cursus sans repasser par la connexion.",
            "30 jours",
          ],
          [
            "phi_secure",
            "Protéger les pages Parrainage et Retrait après confirmation de votre mot de passe.",
            "30 minutes d’inactivité",
          ],
          [
            "Stockage local de l’appareil",
            "Retenir votre progression dans le cursus et le code de parrainage d’une invitation, uniquement sur votre appareil.",
            "Jusqu’à effacement",
          ],
        ],
      },
      after:
        "Les vidéos du cursus sont lues via le mode « confidentialité renforcée » de YouTube, qui limite le dépôt d’éléments de suivi. Lorsque vous lancez une vidéo, YouTube peut tout de même en déposer. Vous pouvez à tout moment supprimer les cookies dans les réglages de votre navigateur ; vous devrez alors vous reconnecter.",
    },
    {
      title: "8. Vos droits",
      body: [
        "Vous pouvez nous demander d’accéder à vos données, de les corriger, ou de supprimer votre compte, conformément à la législation en vigueur au Burkina Faso sur la protection des données personnelles. Écrivez-nous sur WhatsApp et nous répondons dans les meilleurs délais.",
      ],
    },
    {
      title: "9. Mises à jour",
      body: [
        "Nous pouvons modifier cette politique. La date de dernière mise à jour figure en haut de la page.",
      ],
    },
  ],
};

const PAGES = [TERMS, PRIVACY];

/* =========================================================
   PAGE
   ========================================================= */

function LegalPage({ doc }) {
  const { hash } = useLocation();
  const Icon = doc.id === "conditions" ? FileText : Lock;

  useEffect(() => {
    document.title = `${doc.title} · PHI Academy`;

    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [doc.id, hash, doc.title]);

  return (
    <div className="lg-page">
      <Navbar />

      <header className="lg-hero">
        <div className="lg-wrap">
          <span className="lg-hero-icon">
            <Icon size={24} />
          </span>
          <h1>{doc.title}</h1>
          <p>{doc.intro}</p>
          <small>Dernière mise à jour : {UPDATED}</small>
        </div>
      </header>

      <main className="lg-wrap lg-main">
        <nav className="lg-tabs" aria-label="Documents légaux">
          {PAGES.map((p) => (
            <Link
              key={p.id}
              to={p.path}
              className={p.id === doc.id ? "active" : ""}
            >
              {p.title}
            </Link>
          ))}
          <Link
            to="/confidentialite#cookies"
            className="lg-tab-cookie"
          >
            <Cookie size={15} /> Cookies
          </Link>
        </nav>

        <section className="lg-summary">
          <h2>L’essentiel en quelques lignes</h2>
          <ul>
            {doc.summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        {doc.sections.map((section) => (
          <section
            key={section.title}
            id={section.id}
            className="lg-section"
          >
            <h2>{section.title}</h2>

            {section.body?.map((text) => (
              <p key={text}>{text}</p>
            ))}

            {section.list && (
              <ul className="lg-list">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {section.table && (
              <div className="lg-table-wrap">
                <table className="lg-table">
                  <thead>
                    <tr>
                      {section.table.head.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row[0]}>
                        <td data-label={section.table.head[0]}>
                          <code>{row[0]}</code>
                        </td>
                        <td data-label={section.table.head[1]}>
                          {row[1]}
                        </td>
                        <td data-label={section.table.head[2]}>
                          {row[2]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.after && <p>{section.after}</p>}
          </section>
        ))}

        <section className="lg-contact">
          <div>
            <h2>Une question ?</h2>
            <p>
              Écrivez-nous sur WhatsApp ({SUPPORT_LABEL}), nous vous
              répondons avec plaisir.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} /> Nous contacter
          </a>
        </section>

        <Link to="/" className="lg-back">
          ← Retour à l’accueil
        </Link>
      </main>

      <style>{`
        .lg-page{
          --blue-900:#061A4A; --blue-800:#0A2A66; --blue-700:#103A8C;
          --blue-100:#E6EEFC; --blue-50:#F1F5FD;
          --orange:#FF7A1A; --orange-dark:#E86405; --orange-soft:#FFF0E3;
          --ink:#0A1B44; --muted:#5F6E8A; --line:#DFE6F2; --bg:#F4F7FC;
          min-height:100vh; background:var(--bg); color:var(--ink);
          font-family:Inter,"Segoe UI",system-ui,-apple-system,sans-serif;
          padding-top:76px; box-sizing:border-box;
        }
        .lg-page *{box-sizing:border-box; font-family:inherit}
        .lg-wrap{width:100%; max-width:860px; margin:0 auto; padding:0 18px}

        .lg-hero{
          background:linear-gradient(135deg,var(--blue-900),var(--blue-700));
          color:#fff; padding:38px 0 46px;
        }
        .lg-hero-icon{
          display:inline-flex; align-items:center; justify-content:center;
          width:48px; height:48px; border-radius:14px;
          background:rgba(255,255,255,.12); color:#FFB679; margin-bottom:14px;
        }
        .lg-hero h1{margin:0 0 10px; font-size:clamp(26px,5vw,36px); line-height:1.15; font-weight:800; letter-spacing:-.02em}
        .lg-hero p{margin:0 0 12px; max-width:620px; font-size:16px; line-height:1.6; color:#D5E1FA}
        .lg-hero small{color:#FFB679; font-weight:600; font-size:13px}

        .lg-main{padding-top:0; padding-bottom:70px; margin-top:-22px}

        .lg-tabs{
          display:flex; gap:8px; flex-wrap:wrap; padding:8px;
          background:#fff; border:1px solid var(--line); border-radius:16px;
          box-shadow:0 8px 24px rgba(6,26,74,.08); margin-bottom:18px;
        }
        .lg-tabs a{
          flex:1 1 auto; text-align:center; text-decoration:none;
          padding:11px 14px; border-radius:11px; font-size:14px; font-weight:700;
          color:var(--muted); display:inline-flex; align-items:center;
          justify-content:center; gap:6px; transition:background .15s,color .15s;
        }
        .lg-tabs a:hover{background:var(--blue-50); color:var(--blue-800)}
        .lg-tabs a.active{background:var(--blue-800); color:#fff}
        .lg-tabs a.lg-tab-cookie{color:var(--orange-dark)}
        .lg-tabs a.lg-tab-cookie:hover{background:var(--orange-soft)}

        .lg-summary{
          background:var(--orange-soft); border:1px solid #FFD9B8;
          border-left:5px solid var(--orange); border-radius:16px;
          padding:18px 20px; margin-bottom:18px;
        }
        .lg-summary h2{margin:0 0 10px; font-size:16px; color:var(--orange-dark)}
        .lg-summary ul{margin:0; padding-left:20px; display:grid; gap:6px}
        .lg-summary li{font-size:15px; line-height:1.55; color:#5A2B05}

        .lg-section{
          background:#fff; border:1px solid var(--line); border-radius:16px;
          padding:20px 22px; margin-bottom:12px; scroll-margin-top:92px;
        }
        .lg-section h2{margin:0 0 10px; font-size:18px; color:var(--blue-800); font-weight:800}
        .lg-section p{margin:0 0 10px; font-size:15px; line-height:1.7; color:#26365C}
        .lg-section p:last-child{margin-bottom:0}
        .lg-list{margin:0 0 10px; padding-left:20px; display:grid; gap:6px}
        .lg-list li{font-size:15px; line-height:1.6; color:#26365C}

        .lg-table-wrap{overflow-x:auto; margin:6px 0 12px; border:1px solid var(--line); border-radius:12px}
        .lg-table{width:100%; border-collapse:collapse; font-size:14px}
        .lg-table th{
          text-align:left; background:var(--blue-50); color:var(--blue-800);
          padding:10px 12px; font-size:13px;
        }
        .lg-table td{padding:11px 12px; border-top:1px solid var(--line); vertical-align:top; line-height:1.5; color:#26365C}
        .lg-table code{
          background:var(--blue-100); color:var(--blue-800); padding:2px 7px;
          border-radius:6px; font-size:13px; font-weight:700; word-break:break-word;
        }

        .lg-contact{
          display:flex; align-items:center; justify-content:space-between;
          gap:16px; flex-wrap:wrap; margin-top:18px; padding:20px 22px;
          border-radius:16px; color:#fff;
          background:linear-gradient(135deg,var(--blue-900),var(--blue-700));
        }
        .lg-contact h2{margin:0 0 4px; font-size:18px}
        .lg-contact p{margin:0; font-size:14px; color:#D5E1FA; line-height:1.5}
        .lg-contact a{
          display:inline-flex; align-items:center; gap:8px; text-decoration:none;
          background:var(--orange); color:#fff; font-weight:800; font-size:14px;
          padding:12px 18px; border-radius:12px; transition:background .15s;
        }
        .lg-contact a:hover{background:var(--orange-dark)}

        .lg-back{
          display:inline-block; margin-top:22px; color:var(--blue-700);
          font-weight:700; font-size:14px; text-decoration:none;
        }

        @media (max-width:520px){
          .lg-page{padding-top:68px}
          .lg-section{padding:17px 16px}
          .lg-tabs a{flex:1 1 100%}
          .lg-table thead{display:none}
          .lg-table tr{display:block; border-top:1px solid var(--line); padding:8px 0}
          .lg-table tr:first-child{border-top:0}
          .lg-table td{display:block; border:0; padding:4px 12px}
          .lg-table td::before{
            content:attr(data-label); display:block; font-size:11px; font-weight:800;
            text-transform:uppercase; letter-spacing:.04em; color:var(--muted);
          }
        }
      `}</style>
    </div>
  );
}

export function Conditions() {
  return <LegalPage doc={TERMS} />;
}

export function Confidentialite() {
  return <LegalPage doc={PRIVACY} />;
}
