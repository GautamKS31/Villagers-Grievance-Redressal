import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import API_URL from "../config/api";
import "../styles/Register.css";

const Register = () => {
  const { t, language, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    village: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    // Validation
    if (
      !formData.fullName ||
      !formData.username ||
      !formData.phone ||
      !formData.village ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(
        language === "ta" ?
          "அனைத்து புலங்களையும் நிரப்பவும்"
        : "Please fill all fields",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(
        language === "ta" ?
          "கடவுச்சொற்கள் பொருந்தவில்லை"
        : "Passwords do not match",
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        language === "ta" ?
          "கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்"
        : "Password must be at least 6 characters",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        fullName: formData.fullName,
        username: formData.username,
        phone: formData.phone,
        village: formData.village,
        password: formData.password,
        role: "user",
      });

      setSuccess(
        response.data.message ||
          (language === "ta" ?
            "பதிவு வெற்றிகரமாக முடிந்தது!"
          : "Registration successful!"),
      );

      // Clear form
      setFormData({
        fullName: "",
        username: "",
        phone: "",
        village: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (language === "ta" ?
            "பதிவு தோல்வியுற்றது. மீண்டும் முயற்சிக்கவும்."
          : "Registration failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
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

      <div className="register-card">
        <h2>{t("userRegister")}</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("fullName")}</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>{t("phone")}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("village")}</label>
            <input
              type="text"
              name="village"
              value={formData.village}
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

          <div className="form-group">
            <label>{t("confirmPassword")}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ?
              language === "ta" ?
                "பதிவு செய்யப்படுகிறது..."
              : "Registering..."
            : t("register")}
          </button>
        </form>

        <div className="login-link">
          {t("haveAccount")}{" "}
          <span onClick={() => navigate("/login")}>{t("login")}</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
