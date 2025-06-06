import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ServiceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock service data
  const [serviceData, setServiceData] = useState({
    name: 'Corte de Cabelo',
    duration: '30',
    price: '35,00',
    description: 'Corte tradicional masculino',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the service data in your database
    alert('Serviço atualizado com sucesso!');
    navigate('/business/services');
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Editar Serviço</h1>
          <p className="text-gray-400">Atualize as informações do serviço.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome do Serviço"
                  name="name"
                  value={serviceData.name}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Duração (min)"
                    name="duration"
                    type="number"
                    value={serviceData.duration}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Preço (R$)"
                    name="price"
                    value={serviceData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={serviceData.description}
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
                  onClick={() => navigate('/business/services')}
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

export default ServiceEdit;