import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DataTable from '../../components/table/DataTable';
import { Search, Plus, Phone, Mail, Loader } from 'lucide-react';
import { clientService, Client } from '../../lib/supabaseService';
import { supabase } from '../../lib/supabase';

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

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

  // Buscar clientes quando o businessId estiver disponível
  useEffect(() => {
    if (!businessId) return;
    
    const fetchClients = async () => {
      try {
        setLoading(true);
        const { data, error } = await clientService.getClientsByBusinessId(businessId);
        
        if (error) throw error;
        
        setClients(data || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        setError('Não foi possível carregar os clientes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [businessId]);

  const columns = [
    { 
      header: 'Cliente', 
      accessor: 'name',
    },
    { 
      header: 'Contato', 
      accessor: 'phone',
      cell: (value: string, row: any) => (
        <div>
          <div className="flex items-center">
            <Phone size={14} className="mr-1 text-gray-400" />
            <span>{value}</span>
          </div>
          {row.email && (
            <div className="flex items-center mt-1">
              <Mail size={14} className="mr-1 text-gray-400" />
              <span className="text-gray-400 text-xs">{row.email}</span>
            </div>
          )}
        </div>
      ),
    },
    { 
      header: 'Última Visita', 
      accessor: 'last_visit',
      cell: (value: string | null) => {
        if (!value) return <span className="text-gray-500">Nunca</span>;
        
        // Formatar a data
        const date = new Date(value);
        return date.toLocaleDateString('pt-BR');
      }
    },
    { 
      header: 'Visitas', 
      accessor: 'visits',
    },
    { 
      header: 'Total Gasto', 
      accessor: 'total_spent',
      cell: (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
      }
    },
    {
      header: 'Ações',
      accessor: 'id',
      cell: (value: string) => (
        <div className="flex space-x-2">
          <Link to={`/business/clients/historico/${value}`}>
            <Button size="sm" variant="outline">
              Histórico
            </Button>
          </Link>
          <Link to={`/business/clients/editar/${value}`}>
            <Button size="sm" variant="ghost">
              Editar
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId) {
      setError('ID do negócio não encontrado');
      return;
    }
    
    try {
      const { data, error } = await clientService.createClient({
        business_id: businessId,
        name: newClient.name,
        phone: newClient.phone,
        email: newClient.email,
      });
      
      if (error) throw error;
      
      // Adicionar o novo cliente à lista
      if (data && data.length > 0) {
        setClients([...clients, data[0]]);
      }
      
      // Limpar o formulário
      setNewClient({
        name: '',
        phone: '',
        email: '',
        notes: '',
      });
      
      setShowAddClient(false);
      
      // Mostrar mensagem de sucesso
      alert(`Cliente ${newClient.name} adicionado com sucesso!`);
    } catch (err) {
      console.error('Erro ao adicionar cliente:', err);
      alert('Erro ao adicionar cliente. Por favor, tente novamente.');
    }
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Clientes</h1>
          <p className="text-gray-400">Gerencie seus clientes e visualize seu histórico.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <Button onClick={() => setShowAddClient(true)}>
            <Plus size={16} className="mr-1" />
            Adicionar Cliente
          </Button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {showAddClient && (
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddClient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome"
                    name="name"
                    value={newClient.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Telefone"
                    name="phone"
                    value={newClient.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={newClient.email}
                    onChange={handleInputChange}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Observações
                    </label>
                    <textarea
                      name="notes"
                      value={newClient.notes}
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
                    onClick={() => setShowAddClient(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Cliente</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-400">Carregando clientes...</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredClients}
              noDataMessage="Nenhum cliente encontrado"
            />
          )}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default Clients;

