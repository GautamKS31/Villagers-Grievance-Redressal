import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import axios from "axios";
import API_URL, { getAuthHeaders } from "../../config/api";
import "../../styles/user/UserDashboard.css";

const UserDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "user") {
      navigate("/admin/dashboard");
      return;
    }

    setUser(userData);
    fetchGrievances();
  }, [navigate]);

  const fetchGrievances = async () => {
    try {
      const response = await axios.get(`${API_URL}/grievances/my-grievances`, {
        headers: getAuthHeaders(),
      });

      setGrievances(response.data.grievances);

      // Calculate stats
      const total = response.data.grievances.length;
      const pending = response.data.grievances.filter(
        (g) =>
          g.status === "Pending" ||
          g.status === "Accepted" ||
          g.status === "In Progress",
      ).length;
      const resolved = response.data.grievances.filter(
        (g) => g.status === "Resolved",
      ).length;

      setStats({ total, pending, resolved });
      setLoading(false);
    } catch (error) {
      console.error("Fetch grievances error:", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#ff9800";
      case "Accepted":
        return "#2196f3";
      case "In Progress":
        return "#9c27b0";
      case "Resolved":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical":
        return "#d32f2f";
      case "High":
        return "#f57c00";
      case "Medium":
        return "#fbc02d";
      case "Low":
        return "#388e3c";
      default:
        return "#757575";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{language === "ta" ? "ஏற்றுகிறது..." : "Loading..."}</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={handleBack} className="back-btn-header">
              ← {language === "ta" ? "முகப்பு" : "Home"}
            </button>
            <h1>{t("appTitle")}</h1>
          </div>
          <div className="header-actions">
            <span className="user-name">
              {language === "ta" ? "வணக்கம்" : "Hello"}, {user?.fullName}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              {t("logout")}
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>{language === "ta" ? "மொத்த புகார்கள்" : "Total Grievances"}</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>{language === "ta" ? "நிலுவையில்" : "Pending"}</p>
        </div>
        <div className="stat-card">
          <h3>{stats.resolved}</h3>
          <p>{language === "ta" ? "தீர்க்கப்பட்டது" : "Resolved"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="actions-container">
        <button
          onClick={() => navigate("/user/create-grievance")}
          className="create-btn"
        >
          +{" "}
          {language === "ta" ?
            "புதிய புகார் பதிவு செய்க"
          : "Create New Grievance"}
        </button>
      </div>

      {/* Grievances List */}
      <div className="grievances-container">
        <h2>{language === "ta" ? "எனது புகார்கள்" : "My Grievances"}</h2>

        {grievances.length === 0 ?
          <div className="no-grievances">
            <p>
              {language === "ta" ? "புகார்கள் இல்லை" : "No grievances found"}
            </p>
          </div>
        : <div className="grievances-grid">
            {grievances.map((grievance) => (
              <div
                key={grievance._id}
                className="grievance-card"
                onClick={() => navigate(`/user/grievance/${grievance._id}`)}
              >
                <div className="grievance-header">
                  <h3>{grievance.title}</h3>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(grievance.status),
                    }}
                  >
                    {grievance.status}
                  </span>
                </div>

                <div className="grievance-meta">
                  <span className="category">{grievance.category}</span>
                  <span
                    className="urgency"
                    style={{ color: getUrgencyColor(grievance.urgency) }}
                  >
                    {grievance.urgency}
                  </span>
                </div>

                <p className="grievance-description">
                  {grievance.description.substring(0, 100)}...
                </p>

                <div className="grievance-footer">
                  <span className="location">
                    📍 {grievance.location.address}
                  </span>
                  <span className="date">
                    {new Date(grievance.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default UserDashboard;
