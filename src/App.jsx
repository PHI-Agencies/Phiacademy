import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ConnexionCursus from "./pages/ConnexionCursus";
import ConnexionParrainage from "./pages/ConnexionParrainage";
import Cursus from "./pages/Cursus";
import Services from "./pages/Services";
import Broker from "./pages/Broker";
import Parrainage from "./pages/Parrainage";
import Invitation from "./pages/Invitation";
import Retrait from "./pages/Retrait";
import MotDePasse from "./pages/MotDePasse";
import AdminLogin from "./pages/AdminLogin";
import AdminRetraits from "./pages/AdminRetraits";
import TermsGate from "./components/TermsGate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            ESPACE PUBLIC
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/connexion-cursus"
          element={<ConnexionCursus />}
        />

        <Route
          path="/connexion-parrainage"
          element={<ConnexionParrainage />}
        />

        <Route
          path="/cursus"
          element={<Cursus />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/broker"
          element={<Broker />}
        />

        <Route
          path="/parrainage"
          element={<Parrainage />}
        />

        <Route
          path="/r/:code"
          element={<Invitation />}
        />

        <Route
          path="/retrait"
          element={<Retrait />}
        />

        <Route
          path="/mot-de-passe"
          element={<MotDePasse />}
        />

        {/* =========================
            BACK-OFFICE
        ========================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={<AdminRetraits />}
        />
      </Routes>

      <TermsGate />
    </BrowserRouter>
  );
}

export default App;
