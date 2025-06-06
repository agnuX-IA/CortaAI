import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DataTable from '../../components/table/DataTable';
import { Search, Plus, Clock, DollarSign, Calendar, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { appointmentService, clientService, serviceService, professionalService, Appointment, Client, Service, Professional } from '../../lib/supabaseService';
import { supabase } from '../../lib/supabase';

interface AppointmentWithDetails extends Appointment {
  clientName?: string;
  serviceName?: string;
  servicePrice?: number;
  serviceDuration?: number;
  professionalName?: string;
}

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  // Estados para o formulário de novo agendamento
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    client_id: '',
    service_id: '',
    professional_id: '',
    date: '',
    time: '',
  });

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

  // Buscar agendamentos quando o businessId estiver disponível e a data for alterada
  useEffect(() => {
    if (!businessId) return;
    
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        // Formatar a data para o formato YYYY-MM-DD
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        // Buscar agendamentos pela data selecionada
        const { data, error } = await appointmentService.getAppointmentsByDate(businessId, formattedDate);
        
        if (error) throw error;
        
        // Processar os dados para incluir informações detalhadas
        const appointmentsWithDetails: AppointmentWithDetails[] = data?.map(appointment => {
          return {
            ...appointment,
            clientName: appointment.client?.name,
            serviceName: appointment.service?.name,
            servicePrice: appointment.service?.price,
            serviceDuration: appointment.service?.duration,
            professionalName: appointment.professional?.name
          };
        }) || [];
        
        setAppointments(appointmentsWithDetails);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar agendamentos:', err);
        setError('Não foi possível carregar os agendamentos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [businessId, selectedDate]);

  // Buscar clientes, serviços e profissionais para o formulário de novo agendamento
  useEffect(() => {
    if (!businessId || !showAddAppointment) return;
    
    const fetchFormData = async () => {
      try {
        // Buscar clientes
        const { data: clientsData, error: clientsError } = await clientService.getClientsByBusinessId(businessId);
        if (clientsError) throw clientsError;
        setClients(clientsData || []);
        
        // Buscar serviços
        const { data: servicesData, error: servicesError } = await serviceService.getServicesByBusinessId(businessId);
        if (servicesError) throw servicesError;
        setServices(servicesData || []);
        
        // Buscar profissionais
        const { data: professionalsData, error: professionalsError } = await professionalService.getProfessionalsByBusinessId(businessId);
        if (professionalsError) throw professionalsError;
        setProfessionals(professionalsData || []);
        
      } catch (err) {
        console.error('Erro ao buscar dados para o formulário:', err);
        setError('Não foi possível carregar os dados para o formulário');
      }
    };
    
    fetchFormData();
  }, [businessId, showAddAppointment]);

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      const { data, error } = await appointmentService.updateAppointmentStatus(appointmentId, 'completed');
      
      if (error) throw error;
      
      // Atualizar o estado local
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'completed' }
          : appointment
      ));
      
      // Mostrar mensagem de sucesso
      alert('Agendamento concluído com sucesso!');
    } catch (err) {
      console.error('Erro ao concluir agendamento:', err);
      alert('Erro ao concluir agendamento. Por favor, tente novamente.');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        const { data, error } = await appointmentService.updateAppointmentStatus(appointmentId, 'canceled');
        
        if (error) throw error;
        
        // Atualizar o estado local
        setAppointments(appointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: 'canceled' }
            : appointment
        ));
        
        // Mostrar mensagem de sucesso
        alert('Agendamento cancelado com sucesso!');
      } catch (err) {
        console.error('Erro ao cancelar agendamento:', err);
        alert('Erro ao cancelar agendamento. Por favor, tente novamente.');
      }
    }
  };

  const columns = [
    { 
      header: 'Horário', 
      accessor: 'time',
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <Clock size={14} className="mr-1 text-gray-400" />
          <span>{value}</span>
          <span className="text-xs text-gray-400 ml-1">({row.serviceDuration || row.service?.duration || 0} min)</span>
        </div>
      ),
    },
    { 
      header: 'Cliente', 
      accessor: 'clientName',
      cell: (value: string, row: any) => (
        <span>{value || row.client?.name || 'Cliente não encontrado'}</span>
      ),
    },
    { 
      header: 'Serviço', 
      accessor: 'serviceName',
      cell: (value: string, row: any) => (
        <span>{value || row.service?.name || 'Serviço não encontrado'}</span>
      ),
    },
    { 
      header: 'Profissional', 
      accessor: 'professionalName',
      cell: (value: string, row: any) => (
        <span>{value || row.professional?.name || 'Profissional não encontrado'}</span>
      ),
    },
    { 
      header: 'Valor', 
      accessor: 'value',
      cell: (value: number, row: any) => (
        <div className="flex items-center">
          <DollarSign size={14} className="mr-1 text-gray-400" />
          <span>R$ {value.toFixed(2).replace('.', ',')}</span>
        </div>
      ),
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value: string) => {
        let statusClass = '';
        let statusText = '';
        
        switch (value) {
          case 'scheduled':
            statusClass = 'bg-blue-500 bg-opacity-10 text-blue-500';
            statusText = 'Agendado';
            break;
          case 'completed':
            statusClass = 'bg-green-500 bg-opacity-10 text-green-500';
            statusText = 'Concluído';
            break;
          case 'canceled':
            statusClass = 'bg-red-500 bg-opacity-10 text-red-500';
            statusText = 'Cancelado';
            break;
          default:
            statusClass = 'bg-gray-500 bg-opacity-10 text-gray-500';
            statusText = 'Desconhecido';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
    {
      header: 'Ações',
      accessor: 'id',
      cell: (value: string, row: any) => (
        <div className="flex space-x-2">
          {row.status === 'scheduled' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleCompleteAppointment(value)}
              >
                Concluir
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-red-500 hover:text-red-400"
                onClick={() => handleCancelAppointment(value)}
              >
                Cancelar
              </Button>
            </>
          )}
          {row.status === 'completed' && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => navigate(`/business/appointments/detalhes/${value}`)}
            >
              Detalhes
            </Button>
          )}
          {row.status === 'canceled' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/business/appointments/reagendar/${value}`)}
            >
              Reagendar
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Change date
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Filter appointments based on search term and status
  const filteredAppointments = appointments.filter(
    (appointment) => {
      const matchesSearch = 
        (appointment.clientName || appointment.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appointment.serviceName || appointment.service?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appointment.professionalName || appointment.professional?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === 'all' || 
        appointment.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId) {
      setError('ID do negócio não encontrado');
      return;
    }
    
    try {
      // Validar campos obrigatórios
      if (!newAppointment.client_id || !newAppointment.service_id || !newAppointment.professional_id || !newAppointment.date || !newAppointment.time) {
        throw new Error('Todos os campos são obrigatórios');
      }
      
      // Buscar o serviço para obter o preço
      const { data: serviceData, error: serviceError } = await serviceService.getServiceById(newAppointment.service_id);
      
      if (serviceError || !serviceData) {
        throw new Error('Erro ao buscar informações do serviço');
      }
      
      // Criar o agendamento
      const { data, error } = await appointmentService.createAppointment({
        business_id: businessId,
        client_id: newAppointment.client_id,
        service_id: newAppointment.service_id,
        professional_id: newAppointment.professional_id,
        date: newAppointment.date,
        time: newAppointment.time,
        status: 'scheduled',
        value: serviceData.price,
      });
      
      if (error) throw error;
      
      // Atualizar a lista de agendamentos se a data do novo agendamento for a mesma da data selecionada
      if (newAppointment.date === selectedDate.toISOString().split('T')[0] && data && data.length > 0) {
        // Buscar detalhes do cliente, serviço e profissional
        const client = clients.find(c => c.id === newAppointment.client_id);
        const service = services.find(s => s.id === newAppointment.service_id);
        const professional = professionals.find(p => p.id === newAppointment.professional_id);
        
        // Adicionar o novo agendamento à lista
        setAppointments([...appointments, {
          ...data[0],
          clientName: client?.name,
          serviceName: service?.name,
          servicePrice: service?.price,
          serviceDuration: service?.duration,
          professionalName: professional?.name
        }]);
      }
      
      // Limpar o formulário
      setNewAppointment({
        client_id: '',
        service_id: '',
        professional_id: '',
        date: '',
        time: '',
      });
      
      setShowAddAppointment(false);
      
      // Mostrar mensagem de sucesso
      alert('Agendamento criado com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar agendamento:', err);
      alert('Erro ao adicionar agendamento. Por favor, verifique os dados e tente novamente.');
    }
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Agendamentos</h1>
          <p className="text-gray-400">Gerencie os agendamentos do seu estabelecimento.</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">Calendário</CardTitle>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => changeDate(-1)}>
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm font-medium">
                {formatDate(selectedDate)}
              </span>
              <Button variant="outline" size="sm" onClick={() => changeDate(1)}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {/* This is a placeholder for a full calendar component */}
              <div className="md:col-span-7 flex items-center justify-center h-60 bg-gray-700 rounded-lg opacity-70">
                <p className="text-gray-400">Calendário de Agendamentos (Em um app real, um componente de calendário seria implementado aqui)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar agendamento..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filterStatus === 'all' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Todos
              </Button>
              <Button 
                variant={filterStatus === 'scheduled' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('scheduled')}
              >
                Agendados
              </Button>
              <Button 
                variant={filterStatus === 'completed' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                Concluídos
              </Button>
              <Button 
                variant={filterStatus === 'canceled' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('canceled')}
              >
                Cancelados
              </Button>
            </div>
          </div>
          <Button onClick={() => setShowAddAppointment(true)}>
            <Plus size={16} className="mr-1" />
            Novo Agendamento
          </Button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {showAddAppointment && (
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Agendamento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAppointment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cliente
                    </label>
                    <select
                      name="client_id"
                      value={newAppointment.client_id}
                      onChange={handleInputChange}
                      required
                      className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecione um cliente</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Serviço
                    </label>
                    <select
                      name="service_id"
                      value={newAppointment.service_id}
                      onChange={handleInputChange}
                      required
                      className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecione um serviço</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - R$ {service.price.toFixed(2).replace('.', ',')} ({service.duration} min)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Profissional
                    </label>
                    <select
                      name="professional_id"
                      value={newAppointment.professional_id}
                      onChange={handleInputChange}
                      required
                      className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecione um profissional</option>
                      {professionals.map(professional => (
                        <option key={professional.id} value={professional.id}>
                          {professional.name} - {professional.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Data
                      </label>
                      <Input
                        type="date"
                        name="date"
                        value={newAppointment.date}
                        onChange={handleInputChange}
                        required
                        className="text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Horário
                      </label>
                      <Input
                        type="time"
                        name="time"
                        value={newAppointment.time}
                        onChange={handleInputChange}
                        required
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setShowAddAppointment(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Agendamento</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-400">Carregando agendamentos...</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredAppointments}
              noDataMessage="Nenhum agendamento encontrado"
            />
          )}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default Appointments;

