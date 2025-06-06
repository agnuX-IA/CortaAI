import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const BusinessCreate: React.FC = () => {
  const navigate = useNavigate();

  const [businessData, setBusinessData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    status: 'Ativa',
    subscriptionPlan: 'Pro',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would create the business in your database
    alert('Empresa cadastrada com sucesso!');
    navigate('/admin/businesses');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Nova Empresa</h1>
          <p className="text-gray-400">Cadastre uma nova empresa na plataforma.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome da Empresa"
                  name="name"
                  value={businessData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: João Barbearia"
                />
                <Input
                  label="Nome do Proprietário"
                  name="owner"
                  value={businessData.owner}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome completo do proprietário"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={businessData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="email@empresa.com"
                />
                <Input
                  label="Telefone"
                  name="phone"
                  value={businessData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(00) 00000-0000"
                />
                <Input
                  label="Endereço"
                  name="address"
                  value={businessData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Rua, número, bairro"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Cidade"
                    name="city"
                    value={businessData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Cidade"
                  />
                  <Input
                    label="Estado"
                    name="state"
                    value={businessData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="UF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={businessData.status}
                    onChange={handleInputChange}
                    className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                    <option value="Suspensa">Suspensa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plano de Assinatura
                  </label>
                  <select
                    name="subscriptionPlan"
                    value={businessData.subscriptionPlan}
                    onChange={handleInputChange}
                    className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Basic">Básico - R$ 49,90/mês</option>
                    <option value="Pro">Pro - R$ 99,90/mês</option>
                    <option value="Enterprise">Enterprise - R$ 199,90/mês</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => navigate('/admin/businesses')}
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar Empresa</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BusinessCreate;