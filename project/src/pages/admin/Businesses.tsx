import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import DataTable from '../../components/table/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Business {
  id: string;
  name: string;
  email: string;
  city: string;
  clients?: number;
  status: string;
  subscriptionStatus: string;
  created_at: string;
}

const Businesses: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      // Fetch businesses for this admin
      const { data: businessesData, error: businessError } = await supabase
        .from('empresas')
        .select(`
          id,
          name,
          email,
          city,
          created_at
        `)
        .eq('admin_id', user.id)
        .order('created_at', { ascending: false });

      if (businessError) {
        throw new Error('Erro ao buscar empresas: ' + businessError.message);
      }

      // Transform data to match the expected format
      const transformedBusinesses: Business[] = (businessesData || []).map(business => ({
        id: business.id,
        name: business.name,
        email: business.email, // Using email as proprietário since we don't have owner name
        city: business.city,
        clients: 0, // Default to 0, could be calculated from clientes table if needed
        status: 'Ativa', // Default status, could be added to database schema
        subscriptionStatus: 'Paga', // Default subscription status
        created_at: business.created_at
      }));

      setBusinesses(transformedBusinesses);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar empresas');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      header: 'Empresa', 
      accessor: 'name',
    },
    { 
      header: 'Proprietário', 
      accessor: 'email', // Using email as proprietário
    },
    {
      header: 'Cidade',
      accessor: 'city',
    },
    {
      header: 'Clientes',
      accessor: 'clients',
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'Ativa' 
            ? 'bg-green-500 bg-opacity-10 text-green-500' 
            : 'bg-red-500 bg-opacity-10 text-red-500'
        }`}>
          {value}
        </span>
      ),
    },
    { 
      header: 'Assinatura', 
      accessor: 'subscriptionStatus',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'Paga' 
            ? 'bg-green-500 bg-opacity-10 text-green-500'
            : value === 'Trial'
            ? 'bg-blue-500 bg-opacity-10 text-blue-500'
            : 'bg-red-500 bg-opacity-10 text-red-500'
        }`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Ações',
      accessor: 'id',
      cell: (value: string) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(`/admin/businesses/${value}`)}
          >
            Ver
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => navigate(`/admin/businesses/editar/${value}`)}
          >
            Editar
          </Button>
        </div>
      ),
    },
  ];

  // Filter businesses based on search term
  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Empresas Cadastradas</h1>
            <p className="text-gray-400">Gerencie todas as empresas registradas na plataforma.</p>
          </div>
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
          <Button onClick={fetchBusinesses}>Tentar Novamente</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Empresas Cadastradas</h1>
          <p className="text-gray-400">Gerencie todas as empresas registradas na plataforma.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar empresa..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/businesses/nova')}>
              <Plus size={16} className="mr-2" />
              Adicionar Empresa
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredBusinesses}
            isLoading={isLoading}
            noDataMessage="Nenhuma empresa encontrada"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Businesses;