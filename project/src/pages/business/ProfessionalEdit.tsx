import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ProfessionalEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock professional data
  const [professionalData, setProfessionalData] = useState({
    name: 'João Silva',
    speciality: 'Barbeiro',
    phone: '(11) 98765-4321',
    email: 'joao@email.com',
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfessionalData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the professional data in your database
    alert('Profissional atualizado com sucesso!');
    navigate('/business/professionals');
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Editar Profissional</h1>
          <p className="text-gray-400">Atualize as informações do profissional.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  name="name"
                  value={professionalData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Especialidade"
                  name="speciality"
                  value={professionalData.speciality}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Telefone"
                  name="phone"
                  value={professionalData.phone}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={professionalData.email}
                  onChange={handleInputChange}
                />
                <div className="flex items-center space-x-2">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={professionalData.isActive}
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
                  onClick={() => navigate('/business/professionals')}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
};

export default ProfessionalEdit;