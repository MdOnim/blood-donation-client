import { useAuth } from '../../context/AuthContext';
import DonorHome from './DonorHome';
import AdminHome from './AdminHome';

const DashboardHome = () => {
  const { user } = useAuth();

  if (user?.role === 'admin' || user?.role === 'volunteer') {
    return <AdminHome />;
  }

  return <DonorHome />;
};

export default DashboardHome;
