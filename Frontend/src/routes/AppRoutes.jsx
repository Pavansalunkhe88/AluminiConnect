import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import RoleDashboard from '../components/Dashboard/RoleDashboard';
import StudentProfile from '../pages/student/Profile';
import AlumniProfile from '../pages/alumni/Profile';
import AlumniFeed from '../pages/alumni/Feed';
import StudentFeed from '../pages/student/Feed';
import TeacherFeed from '../pages/teacher/Feed';
import TeacherProfile from '../pages/teacher/Profile';
import ManageUser from '../pages/teacher/ManageUser';
import Directory from '../pages/Directory';
import JobPortal from '../pages/JobPortal';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentProfileEdit from '../pages/student/ProfileSetup';
import AlumniProfileEdit from '../pages/alumni/ProfileSetup';
import TeacherProfileEdit from '../pages/teacher/ProfileSetup';
import HelpCenter from '../pages/public/HelpCenter';
import ContactUs from '../pages/public/ContactUs';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import TermsOfService from '../pages/public/TermsOfService';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('[ProtectedRoute] auth state:', { user, loading, isAuthenticated });

  if (loading) {
    console.log('[ProtectedRoute] still loading, showing loader');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role.toLowerCase())) {
    const redirectPath = `/${user.role.toLowerCase()}/dashboard`;
    console.log(`[ProtectedRoute] user lacks required role, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} />;
  }

  console.log('[ProtectedRoute] rendering protected content');
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  // Function to redirect to role-specific dashboard
  const DashboardRedirect = () => {
    const role = user?.role?.toLowerCase();
    const path = role ? `/${role}/dashboard` : '/login';
    return <Navigate to={path} replace />;
  };

  // Helper to redirect authenticated users away from public pages
  const RedirectIfAuthenticated = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (isAuthenticated) {
      const role = user?.role?.toLowerCase();
      const path = role === 'admin' ? '/admin/dashboard' : `/${role}/dashboard`;
      return <Navigate to={path} replace />;
    }
    return children;
  };

  const withDashboardLayout = (component) => (
    <DashboardLayout>{component}</DashboardLayout>
  );

  return (
    <Routes>
      {/* Public Routes — redirect to dashboard if already logged in */}
      <Route path="/" element={<RedirectIfAuthenticated><LandingPage /></RedirectIfAuthenticated>} />
      <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
      <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />

      {/* Public Utility Pages */}
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* Dashboard redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Profile Setup Routes */}
      <Route path="/student/profile-setup" element={<StudentProfileEdit />} />
      <Route path="/alumni/profile-setup" element={<AlumniProfileEdit />} />
      <Route path="/teacher/profile-setup" element={<TeacherProfileEdit />} />

      {/* Role-based Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={['student']}>
            <Routes>
              <Route path="dashboard" element={withDashboardLayout(<RoleDashboard />)} />
              <Route path="profile" element={withDashboardLayout(<StudentProfile />)} />
              <Route path="feed" element={withDashboardLayout(<StudentFeed />)} />
              <Route path="directory" element={withDashboardLayout(<Directory />)} />
              <Route path="jobs" element={withDashboardLayout(<JobPortal />)} />
              <Route path="messages" element={withDashboardLayout(<StudentFeed />)} />
              <Route path="settings" element={withDashboardLayout(<div />)} />
            </Routes>
          </ProtectedRoute>
        }
      />

      <Route
        path="/alumni/*"
        element={
          <ProtectedRoute roles={['alumni']}>
            <Routes>
              <Route path="dashboard" element={withDashboardLayout(<RoleDashboard />)} />
              <Route path="profile" element={withDashboardLayout(<AlumniProfile />)} />
              <Route path="feed" element={withDashboardLayout(<AlumniFeed />)} />
              <Route path="directory" element={withDashboardLayout(<Directory />)} />
              <Route path="jobs" element={withDashboardLayout(<JobPortal />)} />
              <Route path="messages" element={withDashboardLayout(<AlumniFeed />)} />
              <Route path="settings" element={withDashboardLayout(<div />)} />
            </Routes>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute roles={['teacher']}>
            <Routes>
              <Route path="dashboard" element={withDashboardLayout(<RoleDashboard />)} />
              <Route path="feed" element={withDashboardLayout(<TeacherFeed />)} />
              <Route path="profile" element={withDashboardLayout(<TeacherProfile />)} />
              <Route path="manage" element={withDashboardLayout(<ManageUser />)} />
              <Route path="directory" element={withDashboardLayout(<Directory />)} />
              <Route path="jobs" element={withDashboardLayout(<JobPortal />)} />
              <Route path="messages" element={withDashboardLayout(<TeacherFeed />)} />
              <Route path="settings" element={withDashboardLayout(<div />)} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to appropriate dashboard or login */}
      <Route path="*" element={<DashboardRedirect />} />
    </Routes>
  );
};

export default AppRoutes;

