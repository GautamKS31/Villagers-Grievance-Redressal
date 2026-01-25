import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import axios from "axios";
import API_URL, { getAuthHeaders } from "../../config/api";
import "../../styles/user/GrievanceDetail.css";

const GrievanceDetail = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGrievanceDetail();
  }, [id]);

  const fetchGrievanceDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/grievances/${id}`, {
        headers: getAuthHeaders(),
      });
      setGrievance(response.data);
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

  const handleRateClick = () => {
    setShowRatingModal(true);
    setRating(0);
    setHoverRating(0);
    setFeedback("");
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      alert(
        language === "ta" ?
          "தயவுசெய்து மதிப்பீட்டை தேர்ந்தெடுக்கவும்"
        : "Please select a rating",
      );
      return;
    }

    setSubmitting(true);

    try {
      await axios.put(
        `${API_URL}/grievances/${id}/rate`,
        {
          rating: rating,
          feedback: feedback,
        },
        { headers: getAuthHeaders() },
      );

      alert(
        language === "ta" ?
          "மதிப்பீடு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!"
        : "Rating submitted successfully!",
      );

      setShowRatingModal(false);
      fetchGrievanceDetail();
    } catch (err) {
      console.error("Submit rating error:", err);
      alert(
        err.response?.data?.message ||
          (language === "ta" ?
            "மதிப்பீடு சமர்ப்பிப்பு தோல்வியுற்றது"
          : "Failed to submit rating"),
      );
    } finally {
      setSubmitting(false);
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

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || rating;

    for (let i = 1; i <= 5; i++) {
      const isFilled = displayRating >= i;

      stars.push(
        <button
          key={i}
          type="button"
          className={`star-btn ${isFilled ? "filled" : ""}`}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          onClick={() => handleStarClick(i)}
        >
          ★
        </button>,
      );
    }

    return stars;
  };

  const renderDisplayStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="star filled">
            ★
          </span>,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="star half-filled">
            ⭐
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="star">
            ★
          </span>,
        );
      }
    }
    return stars;
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
        <button onClick={() => navigate("/user/dashboard")}>
          {language === "ta" ? "திரும்பு" : "Go Back"}
        </button>
      </div>
    );
  }

  return (
    <div className="grievance-detail-container">
      <div className="detail-header">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="back-btn"
        >
          ← {language === "ta" ? "திரும்பு" : "Back to Dashboard"}
        </button>
        <h1>{language === "ta" ? "புகார் விவரங்கள்" : "Grievance Details"}</h1>
      </div>

      <div className="detail-card">
        <div className="status-section">
          <span
            className="status-badge-large"
            style={{ backgroundColor: getStatusColor(grievance.status) }}
          >
            {grievance.status}
          </span>

          {grievance.status === "Resolved" && !grievance.rating && (
            <button onClick={handleRateClick} className="rate-btn">
              {language === "ta" ? "மதிப்பீடு வழங்கவும்" : "Rate Service"}
            </button>
          )}
        </div>

        <div className="detail-section">
          <h2>{grievance.title}</h2>
          <div className="meta-info">
            <span className="category-badge">{grievance.category}</span>
            <span
              className="urgency-badge"
              style={{ backgroundColor: getUrgencyColor(grievance.urgency) }}
            >
              {grievance.urgency} Priority
            </span>
          </div>
        </div>

        <div className="detail-section">
          <h3>{language === "ta" ? "விளக்கம்" : "Description"}</h3>
          <p>{grievance.description}</p>
        </div>

        <div className="detail-section">
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

        <div className="detail-section">
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

        {grievance.adminNotes && (
          <div className="detail-section admin-notes">
            <h3>{language === "ta" ? "நிர்வாக குறிப்புகள்" : "Admin Notes"}</h3>
            <p>{grievance.adminNotes}</p>
          </div>
        )}

        {grievance.rating && (
          <div className="detail-section rating-display">
            <h3>{language === "ta" ? "உங்கள் மதிப்பீடு" : "Your Rating"}</h3>
            <div className="stars">{renderDisplayStars(grievance.rating)}</div>
            <span className="rating-number">{grievance.rating}/5</span>
            {grievance.feedback && (
              <div className="feedback-text">
                <strong>{language === "ta" ? "கருத்து" : "Feedback"}:</strong>
                <p>{grievance.feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRatingModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>
              {language === "ta" ? "சேவையை மதிப்பிடுங்கள்" : "Rate the Service"}
            </h2>

            <div className="rating-stars-container">
              <div className="rating-stars">{renderStars()}</div>
              <div className="rating-value">
                {(hoverRating || rating) > 0 && (
                  <span className="rating-text">
                    {hoverRating || rating} / 5
                  </span>
                )}
              </div>
            </div>

            <textarea
              placeholder={
                language === "ta" ?
                  "உங்கள் கருத்தை இங்கே பகிரவும் (விரும்பினால்)..."
                : "Share your feedback (optional)..."
              }
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
            />

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="cancel-btn"
              >
                {language === "ta" ? "ரத்து செய்" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleSubmitRating}
                className="submit-rating-btn"
                disabled={submitting || rating === 0}
              >
                {submitting ?
                  language === "ta" ?
                    "சமர்ப்பிக்கிறது..."
                  : "Submitting..."
                : language === "ta" ?
                  "சமர்ப்பிக்கவும்"
                : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceDetail;
