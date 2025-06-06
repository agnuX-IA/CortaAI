import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface AdminLayoutProps {
  children: ReactNode;
}

interface AdminData {
  id: string;
  name: string;
  email: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/');
          return;
        }

        const { data: admin, error } = await supabase
          .from('admins_auth')
          .select('id, name, email')
          .eq('user_id', user.id)
          .single();

        if (error || !admin) {
          console.error('Error fetching admin data:', error);
          navigate('/');
          return;
        }

        setAdminData(admin);
      } catch (error) {
        console.error('Error:', error);
        navigate('/');
      }
    };

    fetchAdminData();
  }, [navigate]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Empresas Cadastradas', href: '/admin/businesses', icon: Users },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-gray-800 p-5 shadow-lg transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-indigo-400">Admin Panel</h1>
          <button 
            className="block"
            onClick={closeSidebar}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-md transition-colors
                  ${isActive 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                `}
                onClick={closeSidebar}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-0 w-full px-5">
          <button
            className="flex w-full items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 shadow-md">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">{adminData?.name}</span>
                    <span className="text-xs text-gray-400">{adminData?.email}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="text-lg font-medium">{adminData?.name?.charAt(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;