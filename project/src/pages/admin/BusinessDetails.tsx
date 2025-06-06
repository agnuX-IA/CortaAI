import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Building, User, Calendar, CreditCard, MapPin, Phone, Mail, Users, Scissors } from 'lucide-react';
import DataTable from '../../components/table/DataTable';

const BusinessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock business data
  const business = {
    id,
    name: 'João Barbearia',
    owner: 'João Silva',
    email: 'joao@barbearia.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Tesouras, 123 - São Paulo, SP',
    status: 'Ativa',
    createdAt: '10/06/2025',
    subscriptionPlan: 'Pro',
    subscriptionStatus: 'Ativa',
    nextPayment: '10/07/2025',
    totalClients: 128,
    totalProfessionals: 5,
    totalAppointments: 1547,
    monthlyRevenue: 'R$ 12.450,00',
  };

  // Mock data for recent appointments
  const recentAppointments = [
    { id: '1', client: 'Rafael Silva', service: 'Corte + Barba', professional: 'João', date: '15/06/2025', time: '14:00', status: 'scheduled' },
    { id: '2', client: 'Amanda Oliveira', service: 'Coloração', professional: 'Maria', date: '14/06/2025', time: '10:30', status: 'completed' },
    { id: '3', client: 'Carlos Mendes', service: 'Barba', professional: 'Pedro', date: '13/06/2025', time: '16:00', status: 'completed' },
  ];

  const appointmentColumns = [
    { 
      header: 'Cliente', 
      accessor: 'client',
    },
    { 
      header: 'Serviço', 
      accessor: 'service',
    },
    { 
      header: 'Profissional', 
      accessor: 'professional',
    },
    { 
      header: 'Data', 
      accessor: 'date',
    },
    { 
      header: 'Horário', 
      accessor: 'time',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'scheduled' 
            ? 'bg-blue-500 bg-opacity-10 text-blue-500' 
            : 'bg-green-500 bg-opacity-10 text-green-500'
        }`}>
          {value === 'scheduled' ? 'Agendado' : 'Concluído'}
        </span>
      ),
    },
  ];

  const handleStatusChange = (newStatus: string) => {
    // Here you would update the business status in your database
    alert(`Status alterado para: ${newStatus}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{business.name}</h1>
            <p className="text-gray-400">Detalhes e informações da empresa</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={business.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Ativa">Ativa</option>
              <option value="Suspensa">Suspensa</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/businesses')}
            >
              Voltar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 text-indigo-400 mr-2" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Proprietário</p>
                    <p className="text-white">{business.owner}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{business.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Telefone</p>
                    <p className="text-white">{business.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Endereço</p>
                    <p className="text-white">{business.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Data de Cadastro</p>
                    <p className="text-white">{business.createdAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 text-indigo-400 mr-2" />
                Informações da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Plano</p>
                <p className="text-white">{business.subscriptionPlan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status da Assinatura</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  business.subscriptionStatus === 'Ativa'
                    ? 'bg-green-500 bg-opacity-10 text-green-500'
                    : 'bg-red-500 bg-opacity-10 text-red-500'
                }`}>
                  {business.subscriptionStatus}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Próximo Pagamento</p>
                <p className="text-white">{business.nextPayment}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-indigo-400" />
                <span className="text-2xl font-bold text-white">{business.totalClients}</span>
              </div>
              <p className="text-sm text-gray-400">Total de Clientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <User className="h-5 w-5 text-indigo-400" />
                <span className="text-2xl font-bold text-white">{business.totalProfessionals}</span>
              </div>
              <p className="text-sm text-gray-400">Profissionais</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Scissors className="h-5 w-5 text-indigo-400" />
                <span className="text-2xl font-bold text-white">{business.totalAppointments}</span>
              </div>
              <p className="text-sm text-gray-400">Agendamentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="h-5 w-5 text-indigo-400" />
                <span className="text-xl font-bold text-white">{business.monthlyRevenue}</span>
              </div>
              <p className="text-sm text-gray-400">Faturamento Mensal</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agendamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={appointmentColumns}
              data={recentAppointments}
              noDataMessage="Nenhum agendamento encontrado"
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BusinessDetails;