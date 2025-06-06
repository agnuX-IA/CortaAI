import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DataTable from '../../components/table/DataTable';
import { Search, Plus, Phone, Mail, Scissors, Loader } from 'lucide-react';
import { professionalService, Professional } from '../../lib/supabaseService';
import { supabase } from '../../lib/supabase';

interface ProfessionalWithAppointments extends Professional {
  appointments?: number;
  isActive?: boolean;
}

const Professionals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProfessional, setShowAddProfessional] = useState(false);
  const [newProfessional, setNewProfessional] = useState({
    name: '',
    specialty: '',
    contact: '',
    email: '',
    isActive: true,
  });
  const [professionals, setProfessionals] = useState<ProfessionalWithAppointments[]>([]);
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

  // Buscar profissionais quando o businessId estiver disponível
  useEffect(() => {
    if (!businessId) return;
    
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const { data, error } = await professionalService.getProfessionalsByBusinessId(businessId);
        
        if (error) throw error;
        
        // Adicionar contagem de agendamentos para cada profissional
        const professionalsWithAppointments: ProfessionalWithAppointments[] = [];
        
        if (data && data.length > 0) {
          for (const professional of data) {
            // Buscar contagem de agendamentos
            const { count, error: countError } = await supabase
              .from('appointments')
              .select('id', { count: 'exact', head: true })
              .eq('professional_id', professional.id);
            
            // Adicionar profissional com contagem de agendamentos
            professionalsWithAppointments.push({
              ...professional,
              appointments: count || 0,
              isActive: true // Por padrão, todos os profissionais são ativos
            });
          }
        }
        
        setProfessionals(professionalsWithAppointments);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar profissionais:', err);
        setError('Não foi possível carregar os profissionais');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessionals();
  }, [businessId]);

  const columns = [
    { 
      header: 'Profissional', 
      accessor: 'name',
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
            <span className="text-sm font-medium">{value.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-white">{value}</p>
            <p className="text-xs text-gray-400">{row.specialty}</p>
          </div>
        </div>
      ),
    },
    { 
      header: 'Contato', 
      accessor: 'contact',
      cell: (value: string, row: any) => (
        <div>
          <div className="flex items-center">
            <Phone size={14} className="mr-1 text-gray-400" />
            <span>{value}</span>
          </div>
        </div>
      ),
    },
    { 
      header: 'Agendamentos', 
      accessor: 'appointments',
      cell: (value: number = 0) => (
        <div className="flex items-center">
          <Scissors size={14} className="mr-1 text-gray-400" />
          <span>{value}</span>
        </div>
      ),
    },
    { 
      header: 'Status', 
      accessor: 'isActive',
      cell: (value: boolean = true) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value 
            ? 'bg-green-500 bg-opacity-10 text-green-500' 
            : 'bg-red-500 bg-opacity-10 text-red-500'
        }`}>
          {value ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      header: 'Ações',
      accessor: 'id',
      cell: (value: string) => (
        <div className="flex space-x-2">
          <Link to={`/business/professionals/agenda/${value}`}>
            <Button size="sm" variant="outline">
              Ver Agenda
            </Button>
          </Link>
          <Link to={`/business/professionals/editar/${value}`}>
            <Button size="sm" variant="ghost">
              Editar
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  // Filter professionals based on search term
  const filteredProfessionals = professionals.filter(
    (professional) =>
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.contact.includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewProfessional((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId) {
      setError('ID do negócio não encontrado');
      return;
    }
    
    try {
      const { data, error } = await professionalService.createProfessional({
        business_id: businessId,
        name: newProfessional.name,
        specialty: newProfessional.specialty,
        contact: newProfessional.contact,
      });
      
      if (error) throw error;
      
      // Adicionar o novo profissional à lista
      if (data && data.length > 0) {
        setProfessionals([...professionals, {
          ...data[0],
          appointments: 0,
          isActive: true
        }]);
      }
      
      // Limpar o formulário
      setNewProfessional({
        name: '',
        specialty: '',
        contact: '',
        email: '',
        isActive: true,
      });
      
      setShowAddProfessional(false);
      
      // Mostrar mensagem de sucesso
      alert(`Profissional ${newProfessional.name} adicionado com sucesso!`);
    } catch (err) {
      console.error('Erro ao adicionar profissional:', err);
      alert('Erro ao adicionar profissional. Por favor, tente novamente.');
    }
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Profissionais</h1>
          <p className="text-gray-400">Gerencie sua equipe de profissionais.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Buscar profissional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <Button onClick={() => setShowAddProfessional(true)}>
            <Plus size={16} className="mr-1" />
            Adicionar Profissional
          </Button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {showAddProfessional && (
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProfessional} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome"
                    name="name"
                    value={newProfessional.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Especialidade"
                    name="specialty"
                    value={newProfessional.specialty}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Barbeiro, Cabeleireiro, etc."
                  />
                  <Input
                    label="Telefone"
                    name="contact"
                    value={newProfessional.contact}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={newProfessional.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-300">
                      Profissional ativo
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setShowAddProfessional(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Profissional</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-400">Carregando profissionais...</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredProfessionals}
              noDataMessage="Nenhum profissional encontrado"
            />
          )}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default Professionals;

