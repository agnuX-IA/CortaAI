import React, { useState, useEffect } from 'react';
import { Users, Calendar, CreditCard, TrendingUp, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { statsService, appointmentService, clientService, Appointment, Client } from '../../lib/supabaseService';
import { supabase } from '../../lib/supabase';

interface AppointmentWithDetails extends Appointment {
  clientName?: string;
  serviceName?: string;
  servicePrice?: number;
  professionalName?: string;
}

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para estatísticas
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    returnRate: 0
  });
  
  // Estados para gráficos
  const [revenueChartData, setRevenueChartData] = useState<{date: string, value: number}[]>([]);
  const [popularServicesData, setPopularServicesData] = useState<{id: string, name: string, count: number}[]>([]);
  
  // Estados para listas
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentWithDetails[]>([]);
  const [newClients, setNewClients] = useState<Client[]>([]);

  // Buscar o ID do negócio do usuário logado
  useEffect(() => {
    const fetchBusinessId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        const { data, error } = await supabase
          .from('businesses')
          .select('id')
          .eq('admin_id', user.id)
          .single();
        
        if (error) throw error;
        if (!data) throw new Error('Negócio não encontrado');
        
        setBusinessId(data.id);
      } catch (err) {
        console.error('Erro ao buscar ID do negócio:', err);
        setError('Não foi possível carregar os dados do negócio');
      }
    };
    
    fetchBusinessId();
  }, []);

  // Buscar estatísticas quando o businessId estiver disponível
  useEffect(() => {
    if (!businessId) return;
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar estatísticas básicas
        const dashboardStats = await statsService.getDashboardStats(businessId);
        setStats(dashboardStats);
        
        // Buscar dados para o gráfico de faturamento
        const revenueData = await statsService.getRevenueChartData(businessId, timeFilter);
        setRevenueChartData(revenueData);
        
        // Buscar dados para o gráfico de serviços populares
        const servicesData = await statsService.getPopularServicesData(businessId);
        setPopularServicesData(servicesData);
        
        // Buscar próximos agendamentos
        const today = new Date().toISOString().split('T')[0];
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            *,
            client:client_id(id, name, email, phone),
            service:service_id(id, name, price, duration),
            professional:professional_id(id, name, specialty)
          `)
          .eq('business_id', businessId)
          .eq('status', 'scheduled')
          .gte('date', today)
          .order('date', { ascending: true })
          .order('time', { ascending: true })
          .limit(3);
        
        if (appointmentsError) throw appointmentsError;
        
        // Processar os dados para incluir informações detalhadas
        const appointmentsWithDetails: AppointmentWithDetails[] = appointmentsData?.map(appointment => {
          return {
            ...appointment,
            clientName: appointment.client?.name,
            serviceName: appointment.service?.name,
            servicePrice: appointment.service?.price,
            professionalName: appointment.professional?.name
          };
        }) || [];
        
        setUpcomingAppointments(appointmentsWithDetails);
        
        // Buscar novos clientes (últimos 7 dias)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const formattedDate = sevenDaysAgo.toISOString();
        
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', businessId)
          .gte('created_at', formattedDate)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (clientsError) throw clientsError;
        
        setNewClients(clientsData || []);
        
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [businessId, timeFilter]);

  // Função para calcular há quantos dias um cliente foi criado
  const getDaysAgo = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Função para formatar a data e hora do agendamento
  const formatAppointmentDateTime = (date: string, time: string) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    
    // Verificar se é hoje
    if (appointmentDate.toDateString() === today.toDateString()) {
      return `Hoje, ${time}`;
    }
    
    // Verificar se é amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (appointmentDate.toDateString() === tomorrow.toDateString()) {
      return `Amanhã, ${time}`;
    }
    
    // Caso contrário, mostrar a data formatada
    return `${appointmentDate.toLocaleDateString('pt-BR')}, ${time}`;
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Bem-vindo de volta! Veja um resumo da sua barbearia.</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
            <span className="ml-2 text-gray-400">Carregando dados do dashboard...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total de Clientes"
                value={stats.totalClients.toString()}
                icon={<Users />}
              />
              <StatsCard
                title="Agendamentos"
                value={stats.totalAppointments.toString()}
                icon={<Calendar />}
                description="Nos últimos 30 dias"
              />
              <StatsCard
                title="Faturamento"
                value={`R$ ${stats.totalRevenue.toFixed(2).replace('.', ',')}`}
                icon={<CreditCard />}
              />
              <StatsCard
                title="Taxa de Retorno"
                value={`${stats.returnRate}%`}
                icon={<TrendingUp />}
                description="Clientes que voltam"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard 
                title="Faturamento" 
                description="Análise de faturamento por período"
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
                data={revenueChartData}
              />
              
              <ChartCard 
                title="Serviços Mais Populares" 
                description="Quantidade de agendamentos por serviço"
                data={popularServicesData.map(service => ({
                  name: service.name,
                  value: service.count
                }))}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-white">{appointment.clientName || appointment.client?.name}</p>
                            <p className="text-sm text-gray-400">
                              {appointment.serviceName || appointment.service?.name} • 
                              R$ {appointment.value.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-indigo-400 font-medium">
                              {formatAppointmentDateTime(appointment.date, appointment.time)}
                            </p>
                            <p className="text-sm text-gray-400">
                              com {appointment.professionalName || appointment.professional?.name}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        Nenhum agendamento próximo
                      </div>
                    )}
                    <Link to="/business/appointments">
                      <Button variant="outline" fullWidth>Ver Agendamentos</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Novos Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {newClients.length > 0 ? (
                      newClients.map((client) => (
                        <div key={client.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium">{client.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{client.name}</p>
                              <p className="text-sm text-gray-400">{client.email}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">
                            há {getDaysAgo(client.created_at)} dia{getDaysAgo(client.created_at) !== 1 ? 's' : ''}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        Nenhum cliente novo nos últimos 7 dias
                      </div>
                    )}
                    <Link to="/business/clients">
                      <Button variant="outline" fullWidth>Ver Clientes</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </BusinessLayout>
  );
};

export default Dashboard;

