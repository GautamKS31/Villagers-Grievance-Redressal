import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/RoleSelection.css";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();

  return (
    <div className="role-selection-container">
      {/* Language Toggle */}
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

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/")}>
        ← {t("back")}
      </button>

      <div className="role-selection-card">
        <h1>{t("selectRole")}</h1>
        

        <div className="role-buttons">
          <button
            className="role-btn user-btn"
            onClick={() => navigate("/login")}
          >
            <div className="icon"></div>
            <h3>{t("villager")}</h3>
            
          </button>

          <button
            className="role-btn admin-btn"
            onClick={() => navigate("/admin-login")}
          >
            <div className="icon"></div>
            <h3>{t("admin")}</h3>
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
