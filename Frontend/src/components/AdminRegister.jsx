import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import API_URL from "../config/api";
import "../styles/Register.css";

const AdminRegister = () => {
  const { language, changeLanguage } = useLanguage();
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
          "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்"
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
        role: "admin", // Set role as admin
      });

      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Navigate to admin dashboard
      navigate("/admin/dashboard");
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
        ← {language === "ta" ? "திரும்பு" : "Back"}
      </button>

      <div className="register-card">
        <h2>{language === "ta" ? "நிர்வாக பதிவு" : "Admin Registration"}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{language === "ta" ? "முழு பெயர்" : "Full Name"}</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={
                language === "ta" ?
                  "உங்கள் முழு பெயரை உள்ளிடவும்"
                : "Enter your full name"
              }
              required
            />
          </div>

          <div className="form-group">
            <label>{language === "ta" ? "பயனர்பெயர்" : "Username"}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={
                language === "ta" ? "பயனர்பெயரை உள்ளிடவும்" : "Enter username"
              }
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                {language === "ta" ? "தொலைபேசி எண்" : "Phone Number"}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={
                  language === "ta" ?
                    "தொலைபேசி எண்ணை உள்ளிடவும்"
                  : "Enter phone number"
                }
                required
              />
            </div>

            <div className="form-group">
              <label>{language === "ta" ? "கிராமம்" : "Village"}</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder={
                  language === "ta" ?
                    "உங்கள் கிராமத்தை உள்ளிடவும்"
                  : "Enter your village"
                }
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{language === "ta" ? "கடவுச்சொல்" : "Password"}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  language === "ta" ?
                    "கடவுச்சொல்லை உள்ளிடவும்"
                  : "Enter password"
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                {language === "ta" ?
                  "கடவுச்சொல்லை உறுதிப்படுத்தவும்"
                : "Confirm Password"}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={
                  language === "ta" ?
                    "கடவுச்சொல்லை மீண்டும் உள்ளிடவும்"
                  : "Re-enter password"
                }
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ?
              language === "ta" ?
                "பதிவு செய்கிறது..."
              : "Registering..."
            : language === "ta" ?
              "நிர்வாகியாக பதிவு செய்க"
            : "Register as Admin"}
          </button>
        </form>

        <div className="login-link">
          {language === "ta" ?
            "ஏற்கனவே கணக்கு உள்ளதா?"
          : "Already have an account?"}{" "}
          <span onClick={() => navigate("/admin-login")}>
            {language === "ta" ? "உள்நுழையவும்" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
