import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Home.css";

const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="home-container">
      {/* Logout Arrow */}
      <button className="back-arrow" onClick={handleLogout}>
        ← {t("logout")}
      </button>

      <div className="home-box">
        <h1 className="home-title">{t("appTitle")}</h1>
        <p className="home-welcome">
          {t("welcome")}, {user?.fullName || user?.username}!
        </p>
      </div>
    </div>
  );
};

export default Home;
