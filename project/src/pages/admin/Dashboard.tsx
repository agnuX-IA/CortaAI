import React, { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, Link as LinkIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/table/DataTable';
import { supabase } from '../../lib/supabase';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('month');
  const [registrationLink, setRegistrationLink] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setRegistrationLink(`${window.location.origin}/business/login?ref=${user.id}`);
      }
    };
    fetchUserId();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationLink);
    alert('Link copiado para a área de transferência!');
  };

  const handleAccessLink = () => {
    if (userId) {
      navigate(`/business/login?ref=${userId}`);
    }
  };

  const recentBusinesses = [
    { id: '1', name: 'João Barbearia', owner: 'João Silva', status: 'Ativa', createdAt: '10/06/2025' },
    { id: '2', name: 'Salão Beleza Pura', owner: 'Maria Oliveira', status: 'Ativa', createdAt: '05/06/2025' },
    { id: '3', name: 'Barber Shop Elite', owner: 'Carlos Santos', status: 'Pendente', createdAt: '01/06/2025' },
  ];

  const columns = [
    { 
      header: 'Empresa', 
      accessor: 'name',
    },
    { 
      header: 'Proprietário', 
      accessor: 'owner',
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'Ativa' 
            ? 'bg-green-500 bg-opacity-10 text-green-500' 
            : 'bg-yellow-500 bg-opacity-10 text-yellow-500'
        }`}>
          {value}
        </span>
      ),
    },
    { 
      header: 'Data de Cadastro', 
      accessor: 'createdAt',
    },
    {
      header: 'Ações',
      accessor: 'id',
      cell: (value: string) => (
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => navigate(`/admin/businesses/${value}`)}
        >
          Ver detalhes
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Bem-vindo de volta! Veja um resumo do seu sistema.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Empresas Cadastradas"
            value="15"
            icon={<Users />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total de Agendamentos"
            value="247"
            icon={<Calendar />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Taxa de Crescimento"
            value="32%"
            icon={<TrendingUp />}
            description="Crescimento médio mensal"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard 
            title="Crescimento Mensal" 
            description="Novos cadastros de empresas por mês"
            filter={
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={timeFilter === 'week' ? 'primary' : 'outline'}
                  onClick={() => setTimeFilter('week')}
                >
                  Semana
                </Button>
                <Button 
                  size="sm" 
                  variant={timeFilter === 'month' ? 'primary' : 'outline'}
                  onClick={() => setTimeFilter('month')}
                >
                  Mês
                </Button>
                <Button 
                  size="sm" 
                  variant={timeFilter === 'year' ? 'primary' : 'outline'}
                  onClick={() => setTimeFilter('year')}
                >
                  Ano
                </Button>
              </div>
            }
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Link para Cadastro de Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Copie e envie esse link para uma empresa se cadastrar no seu sistema.
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center p-3 bg-gray-700 rounded-md">
                  <input
                    type="text"
                    value={registrationLink}
                    readOnly
                    className="bg-transparent border-none text-sm text-gray-300 flex-1 focus:outline-none"
                  />
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                      <LinkIcon size={16} className="mr-1" />
                      Copiar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleAccessLink}>
                      Acessar Link
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Cadastros Recentes</h2>
          <DataTable
            columns={columns}
            data={recentBusinesses}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;