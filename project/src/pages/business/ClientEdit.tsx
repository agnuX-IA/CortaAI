import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ClientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock client data
  const [clientData, setClientData] = useState({
    name: 'Rafael Silva',
    phone: '(11) 98765-4321',
    email: 'rafael@email.com',
    notes: 'Cliente prefere cortes mais curtos.',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the client data in your database
    alert('Cliente atualizado com sucesso!');
    navigate('/business/clients');
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Editar Cliente</h1>
          <p className="text-gray-400">Atualize as informações do cliente.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  name="name"
                  value={clientData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Telefone"
                  name="phone"
                  value={clientData.phone}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={clientData.email}
                  onChange={handleInputChange}
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Observações
                  </label>
                  <textarea
                    name="notes"
                    value={clientData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => navigate('/business/clients')}
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

export default ClientEdit;