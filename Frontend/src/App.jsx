import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import LandingPage from "./components/LandingPage";
import RoleSelection from "./components/RoleSelection";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
