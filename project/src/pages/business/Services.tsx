import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DataTable from '../../components/table/DataTable';
import { Search, Plus, Clock, DollarSign, Loader } from 'lucide-react';
import { serviceService, Service } from '../../lib/supabaseService';
import { supabase } from '../../lib/supabase';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    duration: '',
    price: '',
    description: '',
  });
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [serviceAppointments, setServiceAppointments] = useState<{[key: string]: number}>({});

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

  // Buscar serviços quando o businessId estiver disponível
  useEffect(() => {
    if (!businessId) return;
    
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await serviceService.getServicesByBusinessId(businessId);
        
        if (error) throw error;
        
        setServices(data || []);
        
        // Buscar contagem de agendamentos para cada serviço
        if (data && data.length > 0) {
          const appointmentCounts: {[key: string]: number} = {};
          
          // Para cada serviço, buscar a contagem de agendamentos
          for (const service of data) {
            const { count, error: countError } = await supabase
              .from('appointments')
              .select('id', { count: 'exact', head: true })
              .eq('service_id', service.id);
            
            if (!countError) {
              appointmentCounts[service.id] = count || 0;
            }
          }
          
          setServiceAppointments(appointmentCounts);
        }
        
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar serviços:', err);
        setError('Não foi possível carregar os serviços');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [businessId]);

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('Tem certeza que deseja remover este serviço? Esta ação não pode ser desfeita.')) {
      try {
        const { error } = await serviceService.deleteService(serviceId);
        
        if (error) throw error;
        
        // Remover o serviço da lista
        setServices(services.filter(service => service.id !== serviceId));
        
        // Mostrar mensagem de sucesso
        alert('Serviço removido com sucesso!');
      } catch (err) {
        console.error('Erro ao remover serviço:', err);
        alert('Erro ao remover serviço. Por favor, tente novamente.');
      }
    }
  };

  const columns = [
    { 
      header: 'Serviço', 
      accessor: 'name',
      cell: (value: string, row: any) => (
        <div>
          <p className="font-medium text-white">{value}</p>
          {row.description && (
            <p className="text-xs text-gray-400">{row.description}</p>
          )}
        </div>
      ),
    },
    { 
      header: 'Duração', 
      accessor: 'duration',
      cell: (value: number) => (
        <div className="flex items-center">
          <Clock size={14} className="mr-1 text-gray-400" />
          <span>{value} min</span>
        </div>
      ),
    },
    { 
      header: 'Preço', 
      accessor: 'price',
      cell: (value: number) => (
        <div className="flex items-center">
          <DollarSign size={14} className="mr-1 text-gray-400" />
          <span>R$ {value.toFixed(2).replace('.', ',')}</span>
        </div>
      ),
    },
    { 
      header: 'Agendamentos', 
      accessor: 'id',
      cell: (value: string) => (
        <span>{serviceAppointments[value] || 0}</span>
      ),
    },
    {
      header: 'Ações',
      accessor: 'id',
      cell: (value: string) => (
        <div className="flex space-x-2">
          <Link to={`/business/services/editar/${value}`}>
            <Button size="sm" variant="outline">
              Editar
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-500 hover:text-red-400"
            onClick={() => handleDelete(value)}
          >
            Remover
          </Button>
        </div>
      ),
    },
  ];

  // Filter services based on search term
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId) {
      setError('ID do negócio não encontrado');
      return;
    }
    
    try {
      // Converter valores para os tipos corretos
      const price = parseFloat(newService.price.replace(',', '.'));
      const duration = parseInt(newService.duration);
      
      if (isNaN(price) || isNaN(duration)) {
        throw new Error('Preço e duração devem ser números válidos');
      }
      
      const { data, error } = await serviceService.createService({
        business_id: businessId,
        name: newService.name,
        description: newService.description || null,
        price: price,
        duration: duration,
      });
      
      if (error) throw error;
      
      // Adicionar o novo serviço à lista
      if (data && data.length > 0) {
        setServices([...services, data[0]]);
        
        // Inicializar contagem de agendamentos para o novo serviço
        setServiceAppointments({
          ...serviceAppointments,
          [data[0].id]: 0
        });
      }
      
      // Limpar o formulário
      setNewService({
        name: '',
        duration: '',
        price: '',
        description: '',
      });
      
      setShowAddService(false);
      
      // Mostrar mensagem de sucesso
      alert('Serviço adicionado com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar serviço:', err);
      alert('Erro ao adicionar serviço. Por favor, verifique os dados e tente novamente.');
    }
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Serviços</h1>
          <p className="text-gray-400">Gerencie os serviços oferecidos em seu estabelecimento.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Buscar serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <Button onClick={() => setShowAddService(true)}>
            <Plus size={16} className="mr-1" />
            Adicionar Serviço
          </Button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {showAddService && (
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome do Serviço"
                    name="name"
                    value={newService.name}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Duração (min)"
                      name="duration"
                      type="number"
                      value={newService.duration}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Preço (R$)"
                      name="price"
                      value={newService.price}
                      onChange={handleInputChange}
                      required
                      placeholder="0,00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      name="description"
                      value={newService.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setShowAddService(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Serviço</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-400">Carregando serviços...</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredServices}
              noDataMessage="Nenhum serviço encontrado"
            />
          )}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default Services;

