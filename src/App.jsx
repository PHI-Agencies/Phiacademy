import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ConnexionCursus from "./pages/ConnexionCursus";
import ConnexionParrainage from "./pages/ConnexionParrainage";
import Cursus from "./pages/Cursus";
import Services from "./pages/Services";
import Parrainage from "./pages/Parrainage";
import AdminLogin from "./pages/AdminLogin";

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
          path="/parrainage"
          element={<Parrainage />}
        />

        {/* =========================
            BACK-OFFICE
        ========================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;