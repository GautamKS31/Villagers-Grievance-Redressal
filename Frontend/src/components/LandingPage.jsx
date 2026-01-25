import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const { changeLanguage } = useLanguage();

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
    navigate("/role-selection");
  };

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h2 className="title-english">Choose Your Language</h2>
        <h2 className="title-tamil">உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</h2>

        <div className="language-buttons">
          <button
            className="language-btn english-btn"
            onClick={() => handleLanguageSelect("en")}
          >
            English
          </button>
          <button
            className="language-btn tamil-btn"
            onClick={() => handleLanguageSelect("ta")}
          >
            தமிழ்
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
