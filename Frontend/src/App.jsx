import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import LandingPage from "./components/LandingPage";
import RoleSelection from "./components/RoleSelection";
import Register from "./components/Register";
import AdminRegister from "./components/AdminRegister";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import UserDashboard from "./pages/user/UserDashboard";
import CreateGrievance from "./pages/user/CreateGrievance";
import GrievanceDetail from "./pages/user/GrievanceDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGrievanceDetail from "./pages/admin/AdminGrievanceDetail";
import "./App.css";

// Protected Route Component for Users
const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "user") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* User Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              <UserProtectedRoute>
                <UserDashboard />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/user/create-grievance"
            element={
              <UserProtectedRoute>
                <CreateGrievance />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/user/grievance/:id"
            element={
              <UserProtectedRoute>
                <GrievanceDetail />
              </UserProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/grievance/:id"
            element={
              <AdminProtectedRoute>
                <AdminGrievanceDetail />
              </AdminProtectedRoute>
            }
          />

          {/* Catch all route - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
