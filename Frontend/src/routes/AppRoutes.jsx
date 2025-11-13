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
import DashboardLayout from '../components/layout/DashboardLayout';
import StudentProfileEdit from '../pages/student/ProfileSetup';
import AlumniProfileEdit from '../pages/alumni/ProfileSetup';
import TeacherProfileEdit from '../pages/teacher/ProfileSetup';

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

  const withDashboardLayout = (component) => (
    <DashboardLayout>{component}</DashboardLayout>
  );

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      

      {/* Dashboard redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Testing edit form */}
      <Route path="/student/profile-setup" element={<StudentProfileEdit />} />
      <Route path="/alumini/profile-setup" element={<AlumniProfileEdit />} />
      <Route path="/student/profile-setup" element={<TeacherProfileEdit />} />

      {/* Role-based Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={['student']}>
            <Routes>
              <Route path="dashboard" element={withDashboardLayout(<RoleDashboard />)} />
              <Route path="profile" element={withDashboardLayout(<StudentProfile />)} />
              <Route path="feed" element={withDashboardLayout(<StudentFeed />)} />
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
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/teacher/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <Routes>
              <Route path="dashboard" element={withDashboardLayout(<RoleDashboard />)} />
              <Route path="manage" element={withDashboardLayout(<ManageUser />)} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to appropriate dashboard or login */}
      <Route path="*" element={<DashboardRedirect />} />
    </Routes>
  );
};

export default AppRoutes;

