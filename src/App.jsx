import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './routes/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import DonationRequests from './pages/DonationRequests';
import DonationRequestDetails from './pages/DonationRequestDetails';
import Funding from './pages/Funding';
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import MyDonationRequests from './pages/dashboard/MyDonationRequests';
import CreateDonationRequest from './pages/dashboard/CreateDonationRequest';
import EditDonationRequest from './pages/dashboard/EditDonationRequest';
import AllUsers from './pages/dashboard/AllUsers';
import AllBloodDonationRequests from './pages/dashboard/AllBloodDonationRequests';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './context/AuthContext';

const queryClient = new QueryClient();

const DashboardRoutes = () => {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="my-donation-requests" element={<MyDonationRequests />} />
        <Route path="create-donation-request" element={<CreateDonationRequest />} />
        <Route path="edit-donation-request/:id" element={<EditDonationRequest />} />
        <Route
          path="all-users"
          element={
            <PrivateRoute roles={['admin']}>
              <AllUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="all-blood-donation-request"
          element={
            <PrivateRoute roles={['admin', 'volunteer']}>
              <AllBloodDonationRequests />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:!bg-gray-800 dark:!text-gray-100 dark:!border-gray-700',
              }}
            />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/donation-requests" element={<DonationRequests />} />
              <Route
                path="/donation-request/:id"
                element={
                  <PrivateRoute>
                    <DonationRequestDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/funding"
                element={
                  <PrivateRoute>
                    <Funding />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <DashboardRoutes />
                </PrivateRoute>
              }
            />
          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
