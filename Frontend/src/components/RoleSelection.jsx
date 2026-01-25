import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/RoleSelection.css";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();

  return (
    <div className="role-selection-container">
      <div className="language-toggle">
        <button
          className={language === "en" ? "active" : ""}
          onClick={() => changeLanguage("en")}
        >
          English
        </button>
        <button
          className={language === "ta" ? "active" : ""}
          onClick={() => changeLanguage("ta")}
        >
          தமிழ்
        </button>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        ← {t("back")}
      </button>

      <div className="role-content">
        <h2>{t("selectRole")}</h2>
        <div className="role-buttons">
          <button className="role-btn user-btn" onClick={() => navigate("/login")}>
            {t("user")}
          </button>
          <button className="role-btn admin-btn" onClick={() => navigate("/login")}>
            {t("admin")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
