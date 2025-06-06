import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Scissors, 
  Calendar, 
  Clock, 
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface BusinessLayoutProps {
  children: ReactNode;
}

interface BusinessData {
  id: string;
  name: string;
  email: string;
}

const BusinessLayout: React.FC<BusinessLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/business/login');
          return;
        }

        const { data: businesses, error } = await supabase
          .from('empresas')
          .select('id, name, email')
          .eq('admin_id', user.id);

        if (error) {
          console.error('Error fetching business data:', error);
          navigate('/business/login');
          return;
        }

        if (!businesses || businesses.length === 0) {
          console.error('No business found for user');
          navigate('/business/login');
          return;
        }

        // Use the first business if multiple exist
        setBusinessData(businesses[0]);
      } catch (error) {
        console.error('Error:', error);
        navigate('/business/login');
      }
    };

    fetchBusinessData();
  }, [navigate]);

  const navigation = [
    { name: 'Dashboard', href: '/business/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/business/clients', icon: Users },
    { name: 'Profissionais', href: '/business/professionals', icon: User },
    { name: 'Serviços', href: '/business/services', icon: Scissors },
    { name: 'Agendamentos', href: '/business/appointments', icon: Calendar },
    { name: 'Horários', href: '/business/hours', icon: Clock },
    { name: 'Assinatura', href: '/business/subscription', icon: CreditCard },
    { name: 'Configurações', href: '/business/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/business/login');
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
          <h1 className="text-2xl font-bold text-indigo-400">CortaAí</h1>
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
                    <span className="text-sm font-medium">{businessData?.name}</span>
                    <span className="text-xs text-gray-400">{businessData?.email}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="text-lg font-medium">{businessData?.name?.charAt(0)}</span>
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

export default BusinessLayout;