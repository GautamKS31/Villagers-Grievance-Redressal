import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import API_URL from "../config/api";
import "../styles/Login.css";

const Login = () => {
  const { t, language, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError(
        language === "ta" ?
          "அனைத்து புலங்களையும் நிரப்பவும்"
        : "Please fill all fields",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login/user`, {
        username: formData.username,
        password: formData.password,
      });

      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Navigate to home
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (language === "ta" ?
            "உள்நுழைவு தோல்வியுற்றது. மீண்டும் முயற்சிக்கவும்."
          : "Login failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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
      <button
        className="back-button"
        onClick={() => navigate("/role-selection")}
      >
        ← {t("back")}
      </button>

      <div className="login-card">
        <h2>{t("userLogin")}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("username")}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("password")}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ?
              language === "ta" ?
                "உள்நுழைகிறது..."
              : "Logging in..."
            : t("login")}
          </button>
        </form>

        <div className="register-link">
          {t("noAccount")}{" "}
          <span onClick={() => navigate("/register")}>{t("register")}</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
