import React from "react";
import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  GraduationCap,
  Headphones,
  Home as HomeIcon,
  MessageCircle,
  Settings,
  ShoppingBag,
  UsersRound,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Services() {
  const navigate = useNavigate();

  const whatsappNumber = "22656918108";

  const books = [
    {
      id: 1,
      title: "Trading Précision",
      level: "Débutant → Intermédiaire",
      description:
        "Le guide principal pour construire des bases solides et progresser dans votre compréhension du trading.",
      image: "/images/books/trading-precision.jpg",
      link: "https://rylhfhli.mychariow.shop/prd_5sn74art",
      featured: true,
    },
    {
      id: 2,
      title: "Le Code du Trader",
      level: "Intermédiaire → Avancé",
      description:
        "Un guide destiné aux traders qui souhaitent approfondir leur méthode et leur compréhension des marchés.",
      image: "/images/books/code-du-trader.jpg",
      link: "https://rylhfhli.mychariow.shop/prd_7dytyh",
      featured: true,
    },
    {
      id: 3,
      title: "22 Patterns que tout trader doit maîtriser",
      level: "Patterns",
      description:
        "Une ressource consacrée aux principales configurations graphiques à connaître.",
      image: "/images/books/22-patterns.jpg",
      link: "https://rylhfhli.mychariow.shop/prd_nhl8di9w",
    },
    {
      id: 4,
      title: "Dictionnaire essentiel du trading",
      level: "Référence",
      description:
        "Retrouvez les principaux termes et notions utilisés dans l'univers du trading.",
      image: "/images/books/dictionnaire-trading.jpg",
      link: "https://rylhfhli.mychariow.shop/prd_hhzxbpd0",
    },
    {
      id: 5,
      title: "Comment utiliser les moyennes mobiles",
      level: "Analyse technique",
      description:
        "Une ressource dédiée à la compréhension et à l'utilisation des moyennes mobiles.",
      image: "/images/books/moyennes-mobiles.jpg",
      link: "https://rylhfhli.mychariow.shop/prd_ne5d75y5",
    },
    {
      id: 6,
      title: "Le Grand Livre des Indicateurs",
      level: "Analyse technique",
      description:
        "Explorez les principaux indicateurs techniques et leur utilisation dans l'analyse des marchés.",
      image: "/images/books/grand-livre-indicateurs.jpg",
      link: "https://rylhfhli.mychariow.shop/prd_6v509q87",
    },
    {
      id: 7,
      title: "Simple Trading Book",
      level: "English Guide",
      description:
        "A trading resource designed for English-speaking readers who want to learn and develop their market knowledge.",
      image: "/images/books/simple-trading-book.jpg",
      link: "https://rylhfhli.mychariow.shop/prd_u5uxcfu5",
    },
  ];

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const services = [
    {
      icon: GraduationCap,
      label: "FORMATION",
      title: "Formation individuelle",
      description:
        "Un accompagnement personnalisé pour apprendre le trading selon votre niveau et vos objectifs.",
      message:
        "Bonjour PHI Academy, je souhaite avoir des informations concernant la formation individuelle en trading.",
    },
    {
      icon: Headphones,
      label: "MENTORAT",
      title: "Mentorat personnalisé",
      description:
        "Un accompagnement plus approfondi pour travailler votre approche, votre méthode et votre compréhension des marchés.",
      message:
        "Bonjour PHI Academy, je souhaite avoir des informations concernant le mentorat personnalisé.",
    },
    {
      icon: Settings,
      label: "ASSISTANCE",
      title: "Configuration de comptes",
      description:
        "Une assistance pour vous accompagner dans la configuration de vos comptes et outils de trading.",
      message:
        "Bonjour PHI Academy, je souhaite avoir des informations concernant la configuration de comptes.",
    },
  ];

  return (
    <div className="services-page">
      <Navbar />

      {/* ================================
          HEADER MOBILE
      ================================= */}

      <header className="mobile-header">
        <button
          className="mobile-brand"
          onClick={() => navigate("/")}
          aria-label="Retour à l'accueil"
        >
          <span className="brand-symbol">
            <span></span>
            <span></span>
            <span></span>
          </span>

          <span className="brand-name">
            PHI
            <strong>ACADEMY</strong>
          </span>
        </button>

        <span className="header-section-name">SERVICES</span>
      </header>

      <main>
        {/* ================================
            INTRO
        ================================= */}

        <section className="services-intro">
          <div className="intro-label">
            <ShoppingBag size={14} />
            <span>ESPACE SERVICES</span>
          </div>

          <h1>
            Des ressources pour
            <span> aller plus loin.</span>
          </h1>

          <p>
            Découvrez les guides, formations et accompagnements proposés par
            PHI Academy pour développer vos connaissances du trading.
          </p>
        </section>

        {/* ================================
            GUIDES
        ================================= */}

        <section className="guides-section">
          <div className="section-header">
            <div>
              <span className="section-label">RESSOURCES</span>
              <h2>Guides & livres</h2>
            </div>

            <BookOpenCheck size={21} />
          </div>

          <div className="books-scroll">
            {books.map((book, index) => (
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`book-card ${
                  book.featured ? "book-card-featured" : ""
                }`}
                key={book.id}
              >
                <div className="book-image-wrapper">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="book-image"
                  />

                  <div className="book-open">
                    <ExternalLink size={14} />
                  </div>
                </div>

                <div className="book-content">
                  <span className="book-level">{book.level}</span>

                  <h3>{book.title}</h3>

                  <p>{book.description}</p>

                  <div className="book-link">
                    <span>Découvrir</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="scroll-indicator">
            <div className="scroll-line">
              <span></span>
            </div>

            <span>Glissez pour découvrir les guides</span>

            <ChevronRight size={13} />
          </div>

          <div className="books-note">
            <BookOpen size={16} />

            <p>
              Les guides sont disponibles à l'achat via notre plateforme
              partenaire. Après votre achat, le contenu est délivré par la
              plateforme concernée.
            </p>
          </div>
        </section>

        {/* ================================
            SERVICES
        ================================= */}

        <section className="services-section">
          <div className="section-header">
            <div>
              <span className="section-label">ACCOMPAGNEMENT</span>
              <h2>Nos services</h2>
            </div>

            <GraduationCap size={21} />
          </div>

          <div className="services-list">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <button
                  className="service-card"
                  key={service.title}
                  onClick={() => openWhatsApp(service.message)}
                >
                  <div className="service-icon">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <div className="service-body">
                    <span>{service.label}</span>

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>

                    <div className="service-action">
                      <span>En savoir plus</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================================
            CONTACT
        ================================= */}

        <section className="contact-section">
          <div className="contact-icon">
            <MessageCircle size={21} />
          </div>

          <div className="contact-content">
            <span>UNE QUESTION ?</span>

            <h2>
              Parlons de votre
              <br />
              projet.
            </h2>

            <p>
              Présentez-nous votre besoin directement sur WhatsApp et notre
              équipe vous orientera.
            </p>
          </div>

          <button
            className="contact-button"
            onClick={() =>
              openWhatsApp(
                "Bonjour PHI Academy, j'aimerais avoir des informations sur vos services."
              )
            }
          >
            <span>Nous contacter</span>
            <ArrowRight size={16} />
          </button>
        </section>
      </main>

      {/* ================================
          MOBILE BOTTOM NAV
      ================================= */}

      <nav className="mobile-bottom-nav">
        <NavLink to="/" className="bottom-link">
          <HomeIcon size={20} />
          <span>Accueil</span>
        </NavLink>

        <NavLink to="/cursus" className="bottom-link">
          <BookOpen size={20} />
          <span>Apprendre</span>
        </NavLink>

        <NavLink to="/services" className="bottom-link">
          <ShoppingBag size={20} />
          <span>Services</span>
        </NavLink>

        <NavLink to="/parrainage" className="bottom-link">
          <UsersRound size={20} />
          <span>Parrainage</span>
        </NavLink>
      </nav>

      {/* ================================
          CSS
      ================================= */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .services-page {
          min-height: 100vh;
          background: #ffffff;
          color: #0b132b;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          padding-bottom: 70px;
        }

        button {
          font: inherit;
        }

        /* =================================
           INTRO
        ================================= */

        main {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 72px 0 70px;
        }

        .services-intro {
          max-width: 760px;
          margin-bottom: 62px;
        }

        .intro-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #a88918;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          margin-bottom: 18px;
        }

        .services-intro h1 {
          margin: 0;
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1.01;
          letter-spacing: -0.055em;
          font-weight: 760;
        }

        .services-intro h1 span {
          color: #a88918;
        }

        .services-intro p {
          max-width: 650px;
          margin: 22px 0 0;
          color: #707784;
          font-size: 15px;
          line-height: 1.7;
        }

        /* =================================
           SECTION HEADER
        ================================= */

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 23px;
        }

        .section-header > svg {
          color: #a88918;
        }

        .section-label {
          display: block;
          margin-bottom: 5px;
          color: #8d939e;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .section-header h2 {
          margin: 0;
          font-size: 26px;
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        /* =================================
           BOOK CAROUSEL
        ================================= */

        .guides-section {
          margin-bottom: 70px;
        }

        .books-scroll {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          padding: 3px 4px 15px;
          margin: 0 -4px;
          scroll-snap-type: x mandatory;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .books-scroll::-webkit-scrollbar {
          display: none;
        }

        .book-card {
          flex: 0 0 330px;
          display: grid;
          grid-template-columns: 118px 1fr;
          gap: 18px;
          min-height: 200px;
          padding: 12px;
          border: 1px solid #e9ebef;
          border-radius: 21px;
          background: #ffffff;
          color: inherit;
          text-decoration: none;
          scroll-snap-align: start;
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .book-card:hover {
          transform: translateY(-3px);
          border-color: #d4af37;
          box-shadow: 0 17px 40px rgba(11, 19, 43, 0.08);
        }

        .book-image-wrapper {
          position: relative;
          width: 118px;
          height: 176px;
          overflow: hidden;
          border-radius: 14px;
          background: #f1f2f4;
        }

        .book-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-open {
          position: absolute;
          right: 8px;
          bottom: 8px;
          display: grid;
          place-items: center;
          width: 29px;
          height: 29px;
          border-radius: 9px;
          background: rgba(11, 19, 43, 0.92);
          color: #d4af37;
        }

        .book-content {
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .book-level {
          display: block;
          margin-bottom: 7px;
          color: #a88918;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .book-content h3 {
          margin: 0 0 9px;
          font-size: 17px;
          line-height: 1.18;
          letter-spacing: -0.025em;
        }

        .book-content p {
          margin: 0;
          color: #747b87;
          font-size: 10px;
          line-height: 1.55;
        }

        .book-link {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 16px;
          color: #0b132b;
          font-size: 10px;
          font-weight: 750;
        }

        .scroll-indicator {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 5px;
          color: #999fa9;
          font-size: 9px;
        }

        .scroll-line {
          position: relative;
          width: 32px;
          height: 2px;
          overflow: hidden;
          border-radius: 10px;
          background: #e8e9eb;
        }

        .scroll-line span {
          position: absolute;
          left: 0;
          top: 0;
          width: 12px;
          height: 100%;
          border-radius: inherit;
          background: #d4af37;
          animation: scrollHint 2s ease-in-out infinite;
        }

        @keyframes scrollHint {
          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(19px);
          }
        }

        .books-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 17px;
          padding: 14px 16px;
          border-radius: 14px;
          background: #f7f7f5;
        }

        .books-note svg {
          flex-shrink: 0;
          color: #a88918;
          margin-top: 1px;
        }

        .books-note p {
          margin: 0;
          color: #777e89;
          font-size: 10px;
          line-height: 1.55;
        }

        /* =================================
           SERVICES
        ================================= */

        .services-section {
          margin-bottom: 65px;
        }

        .services-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .service-card {
          display: block;
          width: 100%;
          padding: 24px;
          border: 1px solid #e9ebef;
          border-radius: 20px;
          background: #ffffff;
          text-align: left;
          color: #0b132b;
          cursor: pointer;
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .service-card:hover {
          transform: translateY(-3px);
          border-color: #d4af37;
          box-shadow: 0 15px 38px rgba(11, 19, 43, 0.07);
        }

        .service-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          margin-bottom: 24px;
          border-radius: 13px;
          background: #0b132b;
          color: #d4af37;
        }

        .service-body > span {
          color: #a88918;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .service-body h3 {
          margin: 7px 0 8px;
          font-size: 18px;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }

        .service-body p {
          margin: 0;
          color: #747b87;
          font-size: 11px;
          line-height: 1.6;
        }

        .service-action {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 20px;
          color: #0b132b;
          font-size: 10px;
          font-weight: 750;
        }

        /* =================================
           CONTACT
        ================================= */

        .contact-section {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 23px;
          padding: 30px;
          border-radius: 23px;
          background: #f6f6f4;
        }

        .contact-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #0b132b;
          color: #d4af37;
        }

        .contact-content > span {
          color: #a88918;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .contact-content h2 {
          margin: 6px 0;
          font-size: 24px;
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        .contact-content p {
          max-width: 510px;
          margin: 0;
          color: #747b87;
          font-size: 11px;
          line-height: 1.55;
        }

        .contact-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 17px;
          border: 0;
          border-radius: 12px;
          background: #0b132b;
          color: #ffffff;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
          white-space: nowrap;
        }

        /* =================================
           MOBILE HEADER
        ================================= */

        .mobile-header {
          display: none;
        }

        /* =================================
           BOTTOM NAV
        ================================= */

        .mobile-bottom-nav {
          display: none;
        }

        /* =================================
           TABLET
        ================================= */

        @media (max-width: 900px) {
          main {
            width: min(100% - 30px, 700px);
            padding-top: 48px;
          }

          .services-list {
            grid-template-columns: 1fr;
          }

          .book-card {
            flex-basis: 310px;
          }
        }

        /* =================================
           MOBILE
        ================================= */

        @media (max-width: 767px) {
          .services-page {
            padding-bottom: 76px;
          }

          .mobile-header {
            position: sticky;
            top: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 63px;
            padding: 0 16px;
            border-bottom: 1px solid #eef0f2;
            background: rgba(255, 255, 255, 0.94);
            backdrop-filter: blur(14px);
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 0;
            border: 0;
            background: transparent;
            color: #0b132b;
            cursor: pointer;
          }

          .brand-symbol {
            display: flex;
            align-items: flex-end;
            gap: 2px;
            width: 22px;
            height: 21px;
          }

          .brand-symbol span {
            display: block;
            width: 5px;
            border-radius: 2px;
            background: #0b132b;
          }

          .brand-symbol span:nth-child(1) {
            height: 10px;
          }

          .brand-symbol span:nth-child(2) {
            height: 17px;
          }

          .brand-symbol span:nth-child(3) {
            height: 13px;
            background: #d4af37;
          }

          .brand-name {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 13px;
            font-weight: 850;
            line-height: 0.85;
            letter-spacing: -0.04em;
          }

          .brand-name strong {
            margin-top: 3px;
            font-size: 6px;
            font-weight: 800;
            letter-spacing: 0.18em;
          }

          .header-section-name {
            color: #898f9b;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 0.14em;
          }

          main {
            width: 100%;
            padding: 28px 15px 35px;
          }

          .services-intro {
            margin-bottom: 39px;
          }

          .intro-label {
            gap: 6px;
            margin-bottom: 13px;
            font-size: 8px;
          }

          .services-intro h1 {
            max-width: 350px;
            font-size: 34px;
            line-height: 1.04;
            letter-spacing: -0.055em;
          }

          .services-intro p {
            margin-top: 15px;
            font-size: 11px;
            line-height: 1.65;
          }

          .section-header {
            margin-bottom: 16px;
          }

          .section-header h2 {
            font-size: 21px;
          }

          .section-label {
            font-size: 7px;
          }

          .guides-section {
            margin-bottom: 45px;
          }

          /* BOOKS MOBILE CAROUSEL */

          .books-scroll {
            gap: 11px;
            margin: 0 -15px;
            padding: 2px 15px 12px;
            scroll-padding-left: 15px;
          }

          .book-card {
            flex: 0 0 285px;
            grid-template-columns: 96px 1fr;
            gap: 13px;
            min-height: 157px;
            padding: 9px;
            border-radius: 17px;
          }

          .book-image-wrapper {
            width: 96px;
            height: 139px;
            border-radius: 11px;
          }

          .book-open {
            right: 6px;
            bottom: 6px;
            width: 25px;
            height: 25px;
            border-radius: 8px;
          }

          .book-open svg {
            width: 12px;
            height: 12px;
          }

          .book-level {
            margin-bottom: 5px;
            font-size: 6.5px;
            letter-spacing: 0.1em;
          }

          .book-content h3 {
            margin-bottom: 7px;
            font-size: 14px;
            line-height: 1.2;
          }

          .book-content p {
            font-size: 9px;
            line-height: 1.5;
          }

          .book-link {
            margin-top: 11px;
            font-size: 9px;
          }

          .scroll-indicator {
            margin-top: 2px;
            font-size: 8px;
          }

          .books-note {
            gap: 8px;
            margin-top: 12px;
            padding: 11px 12px;
            border-radius: 11px;
          }

          .books-note p {
            font-size: 8.5px;
          }

          /* SERVICES MOBILE */

          .services-section {
            margin-bottom: 44px;
          }

          .services-list {
            display: flex;
            flex-direction: column;
            gap: 9px;
          }

          .service-card {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 13px;
            padding: 14px;
            border-radius: 16px;
          }

          .service-icon {
            width: 39px;
            height: 39px;
            margin: 0;
            border-radius: 11px;
          }

          .service-icon svg {
            width: 18px;
            height: 18px;
          }

          .service-body > span {
            font-size: 6.5px;
          }

          .service-body h3 {
            margin: 4px 0 5px;
            font-size: 14px;
          }

          .service-body p {
            font-size: 9px;
            line-height: 1.5;
          }

          .service-action {
            margin-top: 8px;
            font-size: 8px;
          }

          /* CONTACT MOBILE */

          .contact-section {
            grid-template-columns: auto 1fr;
            gap: 13px;
            padding: 18px;
            border-radius: 18px;
          }

          .contact-icon {
            width: 39px;
            height: 39px;
            border-radius: 11px;
          }

          .contact-content > span {
            font-size: 7px;
          }

          .contact-content h2 {
            margin: 5px 0;
            font-size: 20px;
          }

          .contact-content p {
            margin-top: 8px;
            font-size: 9px;
            line-height: 1.5;
          }

          .contact-button {
            grid-column: 1 / -1;
            justify-content: center;
            width: 100%;
            padding: 12px;
            font-size: 9px;
          }

          /* BOTTOM NAV */

          .mobile-bottom-nav {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 100;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            height: 68px;
            padding: 7px 8px max(7px, env(safe-area-inset-bottom));
            border-top: 1px solid #eceef1;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(15px);
          }

          .bottom-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            border-radius: 11px;
            color: #969ca7;
            text-decoration: none;
            font-size: 8px;
            font-weight: 650;
            transition: 0.2s ease;
          }

          .bottom-link.active {
            color: #0b132b;
          }

          .bottom-link.active svg {
            color: #b08e1e;
          }

          .bottom-link svg {
            stroke-width: 1.8;
          }
        }

        /* =================================
           SMALL ANDROID — 360PX
        ================================= */

        @media (max-width: 360px) {
          main {
            padding-left: 13px;
            padding-right: 13px;
          }

          .services-intro h1 {
            font-size: 31px;
          }

          .books-scroll {
            margin-left: -13px;
            margin-right: -13px;
            padding-left: 13px;
            padding-right: 13px;
            scroll-padding-left: 13px;
          }

          .book-card {
            flex-basis: 275px;
            grid-template-columns: 91px 1fr;
          }

          .book-image-wrapper {
            width: 91px;
            height: 135px;
          }

          .book-content h3 {
            font-size: 13px;
          }

          .book-content p {
            font-size: 8.5px;
          }

          .service-body h3 {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export default Services;