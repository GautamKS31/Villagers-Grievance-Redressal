import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import axios from "axios";
import API_URL, { getAuthHeaders } from "../../config/api";
import "../../styles/admin/AdminDashboard.css";

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: "",
    urgency: "",
    category: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      navigate("/user/dashboard");
      return;
    }

    setUser(userData);
    fetchStats();
    fetchGrievances();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/grievances/admin/stats`, {
        headers: getAuthHeaders(),
      });
      setStats(response.data);
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  const fetchGrievances = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.urgency) params.append("urgency", filter.urgency);
      if (filter.category) params.append("category", filter.category);

      const response = await axios.get(
        `${API_URL}/grievances/admin/all?${params.toString()}`,
        { headers: getAuthHeaders() },
      );

      setGrievances(response.data.grievances);
      setLoading(false);
    } catch (error) {
      console.error("Fetch grievances error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGrievances();
    }
  }, [filter]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <h1>{language === "ta" ? "நிர்வாக பலகை" : "Admin Dashboard"}</h1>
          <div className="header-actions">
            <span className="admin-name">
              {language === "ta" ? "நிர்வாகி" : "Admin"}: {user?.fullName}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              {t("logout")}
            </button>
          </div>
        </div>
      </header>

      {/* Statistics */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card total">
            <h3>{stats.total}</h3>
            <p>{language === "ta" ? "மொத்த புகார்கள்" : "Total Grievances"}</p>
          </div>
          <div className="stat-card pending">
            <h3>{stats.status.pending}</h3>
            <p>{language === "ta" ? "நிலுவையில்" : "Pending"}</p>
          </div>
          <div className="stat-card accepted">
            <h3>{stats.status.accepted}</h3>
            <p>{language === "ta" ? "ஏற்றுக்கொள்ளப்பட்டது" : "Accepted"}</p>
          </div>
          <div className="stat-card progress">
            <h3>{stats.status.inProgress}</h3>
            <p>{language === "ta" ? "செயலில்" : "In Progress"}</p>
          </div>
          <div className="stat-card resolved">
            <h3>{stats.status.resolved}</h3>
            <p>{language === "ta" ? "தீர்க்கப்பட்டது" : "Resolved"}</p>
          </div>
          <div className="stat-card rating">
            <h3>{stats.ratings.averageRating.toFixed(1)} ⭐</h3>
            <p>{language === "ta" ? "சராசரி மதிப்பீடு" : "Avg Rating"}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-container">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="filter-select"
        >
          <option value="">
            {language === "ta" ? "அனைத்து நிலைகள்" : "All Status"}
          </option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={filter.urgency}
          onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
          className="filter-select"
        >
          <option value="">
            {language === "ta" ? "அனைத்து அவசரம்" : "All Urgency"}
          </option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="filter-select"
        >
          <option value="">
            {language === "ta" ? "அனைத்து வகைகள்" : "All Categories"}
          </option>
          <option value="Street Light">Street Light</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Drainage">Drainage</option>
          <option value="Road Repair">Road Repair</option>
          <option value="Garbage Collection">Garbage Collection</option>
          <option value="Other">Other</option>
        </select>

        <button
          onClick={() => setFilter({ status: "", urgency: "", category: "" })}
          className="clear-filter-btn"
        >
          {language === "ta" ? "வடிகட்டியை அழி" : "Clear Filters"}
        </button>
      </div>

      {/* Grievances Table */}
      <div className="grievances-table-container">
        <h2>{language === "ta" ? "புகார்கள்" : "Grievances"}</h2>

        {grievances.length === 0 ?
          <div className="no-data">
            <p>
              {language === "ta" ? "புகார்கள் இல்லை" : "No grievances found"}
            </p>
          </div>
        : <div className="table-responsive">
            <table className="grievances-table">
              <thead>
                <tr>
                  <th>{language === "ta" ? "தலைப்பு" : "Title"}</th>
                  <th>{language === "ta" ? "பயனர்" : "User"}</th>
                  <th>{language === "ta" ? "கிராமம்" : "Village"}</th>
                  <th>{language === "ta" ? "வகை" : "Category"}</th>
                  <th>{language === "ta" ? "அவசரம்" : "Urgency"}</th>
                  <th>{language === "ta" ? "நிலை" : "Status"}</th>
                  <th>{language === "ta" ? "தேதி" : "Date"}</th>
                  <th>{language === "ta" ? "செயல்கள்" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map((grievance) => (
                  <tr key={grievance._id}>
                    <td className="title-cell">{grievance.title}</td>
                    <td>{grievance.user.fullName}</td>
                    <td>{grievance.user.village}</td>
                    <td>
                      <span className="category-badge">
                        {grievance.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className="urgency-badge"
                        style={{
                          backgroundColor: getUrgencyColor(grievance.urgency),
                        }}
                      >
                        {grievance.urgency}
                      </span>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(grievance.status),
                        }}
                      >
                        {grievance.status}
                      </span>
                    </td>
                    <td>
                      {new Date(grievance.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/admin/grievance/${grievance._id}`)
                        }
                        className="view-btn"
                      >
                        {language === "ta" ? "காண்க" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
};

export default AdminDashboard;
