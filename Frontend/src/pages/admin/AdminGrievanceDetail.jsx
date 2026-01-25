import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import axios from "axios";
import API_URL, { getAuthHeaders } from "../../config/api";
import "../../styles/admin/AdminGrievanceDetail.css";

const AdminGrievanceDetail = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    adminNotes: "",
  });

  useEffect(() => {
    fetchGrievanceDetail();
  }, [id]);

  const fetchGrievanceDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/grievances/${id}`, {
        headers: getAuthHeaders(),
      });
      setGrievance(response.data);
      setStatusUpdate({
        status: response.data.status,
        adminNotes: response.data.adminNotes || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Fetch grievance detail error:", err);
      setError(
        err.response?.data?.message ||
          (language === "ta" ?
            "புகார் விவரங்களைப் பெற முடியவில்லை"
          : "Failed to fetch grievance details"),
      );
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!statusUpdate.status) {
      alert(
        language === "ta" ?
          "நிலையைத் தேர்ந்தெடுக்கவும்"
        : "Please select a status",
      );
      return;
    }

    setUpdating(true);

    try {
      await axios.put(`${API_URL}/grievances/${id}/status`, statusUpdate, {
        headers: getAuthHeaders(),
      });

      alert(
        language === "ta" ?
          "நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது!"
        : "Status updated successfully!",
      );

      fetchGrievanceDetail();
    } catch (err) {
      console.error("Update status error:", err);
      alert(
        err.response?.data?.message ||
          (language === "ta" ?
            "நிலை புதுப்பிப்பு தோல்வியுற்றது"
          : "Failed to update status"),
      );
    } finally {
      setUpdating(false);
    }
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

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate("/admin/dashboard")}>
          {language === "ta" ? "திரும்பு" : "Go Back"}
        </button>
      </div>
    );
  }

  return (
    <div className="admin-grievance-detail">
      <div className="detail-header">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="back-btn"
        >
          ← {language === "ta" ? "திரும்பு" : "Back to Dashboard"}
        </button>
        <h1>{language === "ta" ? "புகார் விவரங்கள்" : "Grievance Details"}</h1>
      </div>

      <div className="detail-grid">
        {/* Left Column - Grievance Info */}
        <div className="detail-card">
          <div className="card-header">
            <h2>{grievance.title}</h2>
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(grievance.status) }}
            >
              {grievance.status}
            </span>
          </div>

          <div className="meta-row">
            <span className="category-badge">{grievance.category}</span>
            <span
              className="urgency-badge"
              style={{ backgroundColor: getUrgencyColor(grievance.urgency) }}
            >
              {grievance.urgency} Priority
            </span>
          </div>

          <div className="info-section">
            <h3>{language === "ta" ? "விளக்கம்" : "Description"}</h3>
            <p>{grievance.description}</p>
          </div>

          <div className="info-section">
            <h3>{language === "ta" ? "இருப்பிடம்" : "Location"}</h3>
            <p>📍 {grievance.location.address}</p>
            {grievance.location.coordinates && (
              <a
                href={`https://www.google.com/maps?q=${grievance.location.coordinates[1]},${grievance.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                {language === "ta" ? "வரைபடத்தில் காண்க" : "View on Map"} →
              </a>
            )}
          </div>

          <div className="info-section">
            <h3>{language === "ta" ? "பயனர் தகவல்" : "User Information"}</h3>
            <div className="user-info">
              <p>
                <strong>{language === "ta" ? "பெயர்" : "Name"}:</strong>{" "}
                {grievance.user.fullName}
              </p>
              <p>
                <strong>
                  {language === "ta" ? "பயனர்பெயர்" : "Username"}:
                </strong>{" "}
                {grievance.user.username}
              </p>
              <p>
                <strong>{language === "ta" ? "தொலைபேசி" : "Phone"}:</strong>{" "}
                {grievance.user.phone}
              </p>
              <p>
                <strong>{language === "ta" ? "கிராமம்" : "Village"}:</strong>{" "}
                {grievance.user.village}
              </p>
            </div>
          </div>

          <div className="info-section">
            <h3>{language === "ta" ? "காலவரிசை" : "Timeline"}</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <strong>
                    {language === "ta" ?
                      "புகார் பதிவு செய்யப்பட்டது"
                    : "Grievance Submitted"}
                  </strong>
                  <p>{new Date(grievance.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {grievance.acceptedAt && (
                <div className="timeline-item">
                  <div className="timeline-dot accepted"></div>
                  <div className="timeline-content">
                    <strong>
                      {language === "ta" ? "ஏற்றுக்கொள்ளப்பட்டது" : "Accepted"}
                    </strong>
                    <p>{new Date(grievance.acceptedAt).toLocaleString()}</p>
                    {grievance.acceptedBy && (
                      <small>
                        {language === "ta" ? "ஏற்றவர்" : "By"}:{" "}
                        {grievance.acceptedBy.fullName}
                      </small>
                    )}
                  </div>
                </div>
              )}

              {grievance.resolvedAt && (
                <div className="timeline-item">
                  <div className="timeline-dot resolved"></div>
                  <div className="timeline-content">
                    <strong>
                      {language === "ta" ? "தீர்க்கப்பட்டது" : "Resolved"}
                    </strong>
                    <p>{new Date(grievance.resolvedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {grievance.rating && (
            <div className="info-section rating-section">
              <h3>{language === "ta" ? "பயனர் மதிப்பீடு" : "User Rating"}</h3>
              <div className="rating-display">
                <div className="stars">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < grievance.rating ? "star filled" : "star"
                      }
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="rating-number">{grievance.rating}/5</span>
              </div>
              {grievance.feedback && (
                <div className="feedback-box">
                  <strong>{language === "ta" ? "கருத்து" : "Feedback"}:</strong>
                  <p>{grievance.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Status Update Form */}
        <div className="update-card">
          <h2>
            {language === "ta" ? "நிலையை புதுப்பிக்கவும்" : "Update Status"}
          </h2>

          <form onSubmit={handleUpdateStatus}>
            <div className="form-group">
              <label>
                {language === "ta" ? "நிலை" : "Status"}{" "}
                <span className="required">*</span>
              </label>
              <select
                value={statusUpdate.status}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, status: e.target.value })
                }
                required
              >
                <option value="">
                  {language === "ta" ?
                    "நிலையைத் தேர்ந்தெடுக்கவும்"
                  : "Select Status"}
                </option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                {language === "ta" ? "நிர்வாக குறிப்புகள்" : "Admin Notes"}
              </label>
              <textarea
                value={statusUpdate.adminNotes}
                onChange={(e) =>
                  setStatusUpdate({
                    ...statusUpdate,
                    adminNotes: e.target.value,
                  })
                }
                placeholder={
                  language === "ta" ?
                    "புதுப்பிப்பு அல்லது குறிப்புகளை சேர்க்கவும்..."
                  : "Add updates or notes..."
                }
                rows="6"
              />
            </div>

            <button type="submit" className="update-btn" disabled={updating}>
              {updating ?
                language === "ta" ?
                  "புதுப்பிக்கிறது..."
                : "Updating..."
              : language === "ta" ?
                "நிலையை புதுப்பிக்கவும்"
              : "Update Status"}
            </button>
          </form>

          {grievance.adminNotes && (
            <div className="current-notes">
              <h3>
                {language === "ta" ? "தற்போதைய குறிப்புகள்" : "Current Notes"}
              </h3>
              <p>{grievance.adminNotes}</p>
            </div>
          )}

          <div className="status-guide">
            <h3>{language === "ta" ? "நிலை வழிகாட்டி" : "Status Guide"}</h3>
            <ul>
              <li>
                <strong>Pending:</strong>{" "}
                {language === "ta" ?
                  "புதிய புகார், நடவடிக்கை எடுக்கப்படவில்லை"
                : "New grievance, no action taken"}
              </li>
              <li>
                <strong>Accepted:</strong>{" "}
                {language === "ta" ?
                  "புகார் ஏற்றுக்கொள்ளப்பட்டது, வேலை தொடங்கும்"
                : "Grievance accepted, work will start"}
              </li>
              <li>
                <strong>In Progress:</strong>{" "}
                {language === "ta" ?
                  "வேலை நடைபெறுகிறது"
                : "Work is in progress"}
              </li>
              <li>
                <strong>Resolved:</strong>{" "}
                {language === "ta" ?
                  "சிக்கல் தீர்க்கப்பட்டது"
                : "Issue resolved"}
              </li>
              <li>
                <strong>Rejected:</strong>{" "}
                {language === "ta" ?
                  "புகார் நிராகரிக்கப்பட்டது"
                : "Grievance rejected"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGrievanceDetail;
