import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import axios from "axios";
import API_URL, { getAuthHeaders } from "../../config/api";
import "../../styles/user/CreateGrievance.css";

const CreateGrievance = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "Medium",
    location: {
      coordinates: [],
      address: "",
    },
  });

  const categories = [
    "Street Light",
    "Water Supply",
    "Drainage",
    "Road Repair",
    "Garbage Collection",
    "Other",
  ];

  const urgencyLevels = ["Low", "Medium", "High", "Critical"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError(
        language === "ta" ?
          "உங்கள் உலாவி இருப்பிடத்தை ஆதரிக்கவில்லை"
        : "Your browser doesn't support geolocation",
      );
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use reverse geocoding to get address (using OpenStreetMap Nominatim)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();

          setFormData({
            ...formData,
            location: {
              coordinates: [longitude, latitude],
              address: data.display_name || `${latitude}, ${longitude}`,
            },
          });

          setLocationLoading(false);
        } catch (err) {
          console.error("Geocoding error:", err);
          setFormData({
            ...formData,
            location: {
              coordinates: [longitude, latitude],
              address: `${latitude}, ${longitude}`,
            },
          });
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError(
          language === "ta" ?
            "இருப்பிடத்தைப் பெற முடியவில்லை"
          : "Unable to get location",
        );
        setLocationLoading(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.location.coordinates.length
    ) {
      setError(
        language === "ta" ?
          "அனைத்து புலங்களையும் நிரப்பவும்"
        : "Please fill all fields and add location",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/grievances`, formData, {
        headers: getAuthHeaders(),
      });

      setSuccess(
        language === "ta" ?
          "புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!"
        : "Grievance submitted successfully!",
      );

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Submit grievance error:", err);
      setError(
        err.response?.data?.message ||
          (language === "ta" ?
            "புகார் சமர்ப்பிப்பு தோல்வியுற்றது"
          : "Failed to submit grievance"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-grievance-container">
      <div className="create-grievance-header">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="back-btn"
        >
          ← {language === "ta" ? "திரும்பு" : "Back"}
        </button>
        <h1>
          {language === "ta" ?
            "புதிய புகார் பதிவு செய்க"
          : "Create New Grievance"}
        </h1>
      </div>

      <div className="create-grievance-card">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              {language === "ta" ? "தலைப்பு" : "Title"}{" "}
              <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={
                language === "ta" ?
                  "புகாரின் தலைப்பை உள்ளிடவும்"
                : "Enter grievance title"
              }
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                {language === "ta" ? "வகை" : "Category"}{" "}
                <span className="required">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  {language === "ta" ?
                    "வகையைத் தேர்ந்தெடுக்கவும்"
                  : "Select Category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                {language === "ta" ? "அவசரம்" : "Urgency"}{" "}
                <span className="required">*</span>
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                required
              >
                {urgencyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              {language === "ta" ? "விளக்கம்" : "Description"}{" "}
              <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={
                language === "ta" ?
                  "புகாரை விரிவாக விவரிக்கவும்"
                : "Describe your grievance in detail"
              }
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label>
              {language === "ta" ? "இருப்பிடம்" : "Location"}{" "}
              <span className="required">*</span>
            </label>
            <div className="location-input">
              <input
                type="text"
                value={formData.location.address}
                placeholder={
                  language === "ta" ?
                    "இருப்பிடத்தைப் பெற பொத்தானை அழுத்தவும்"
                  : "Click button to get current location"
                }
                readOnly
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="location-btn"
                disabled={locationLoading}
              >
                {locationLoading ?
                  language === "ta" ?
                    "பெறுகிறது..."
                  : "Getting..."
                : language === "ta" ?
                  "📍 இருப்பிடம் பெறு"
                : "📍 Get Location"}
              </button>
            </div>
            {formData.location.coordinates.length > 0 && (
              <small className="location-info">
                ✓{" "}
                {language === "ta" ?
                  "இருப்பிடம் சேர்க்கப்பட்டது"
                : "Location added"}
              </small>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ?
              language === "ta" ?
                "சமர்ப்பிக்கிறது..."
              : "Submitting..."
            : language === "ta" ?
              "புகார் சமர்ப்பிக்கவும்"
            : "Submit Grievance"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGrievance;
