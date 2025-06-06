import React, { useState } from 'react';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Copy } from 'lucide-react';

const Settings: React.FC = () => {
  // Business information state
  const [businessInfo, setBusinessInfo] = useState({
    name: 'João Barbearia',
    email: 'joao@barbearia.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Tesouras, 123 - São Paulo, SP',
    instagram: '@joaobarbearia',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    remindersBefore: '24', // hours
    allowCancellations: '12', // hours
  });

  // Unique link for clients
  const uniqueLink = 'cortaai.com/barbearia/joaosalon';

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBusinessInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the business information
    alert('Informações da barbearia atualizadas com sucesso!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the user's password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    alert('Senha alterada com sucesso!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the notification settings
    alert('Configurações de notificação atualizadas com sucesso!');
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(`https://${uniqueLink}`);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-gray-400">Gerencie as configurações da sua barbearia.</p>
        </div>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Barbearia</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBusinessInfoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome da Barbearia"
                  name="name"
                  value={businessInfo.name}
                  onChange={handleBusinessInfoChange}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={businessInfo.email}
                  onChange={handleBusinessInfoChange}
                />
                <Input
                  label="Telefone"
                  name="phone"
                  value={businessInfo.phone}
                  onChange={handleBusinessInfoChange}
                />
                <Input
                  label="Instagram"
                  name="instagram"
                  value={businessInfo.instagram}
                  onChange={handleBusinessInfoChange}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Endereço"
                    name="address"
                    value={businessInfo.address}
                    onChange={handleBusinessInfoChange}
                  />
                </div>
              </div>
              <Button type="submit">Salvar Alterações</Button>
            </form>
          </CardContent>
        </Card>

        {/* Client Link */}
        <Card>
          <CardHeader>
            <CardTitle>Link para Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Compartilhe este link com seus clientes para que eles possam acessar sua página de agendamentos.
            </p>
            <div className="flex items-center p-3 bg-gray-700 rounded-md">
              <input
                type="text"
                value={`https://${uniqueLink}`}
                readOnly
                className="bg-transparent border-none text-sm text-gray-300 flex-1 focus:outline-none"
              />
              <Button variant="ghost" size="sm" onClick={copyLinkToClipboard}>
                <Copy size={16} className="mr-1" />
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Senha Atual"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
              <Input
                label="Nova Senha"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
              <Input
                label="Confirmar Nova Senha"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
              <Button type="submit">Alterar Senha</Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNotificationSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="emailNotifications" className="text-sm text-gray-300">
                    Notificações por email
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="smsNotifications"
                    name="smsNotifications"
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="smsNotifications" className="text-sm text-gray-300">
                    Notificações por WhatsApp/SMS
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Enviar lembretes antes (horas)
                  </label>
                  <select
                    name="remindersBefore"
                    value={notificationSettings.remindersBefore}
                    onChange={handleNotificationChange}
                    className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="1">1 hora</option>
                    <option value="2">2 horas</option>
                    <option value="6">6 horas</option>
                    <option value="12">12 horas</option>
                    <option value="24">24 horas</option>
                    <option value="48">48 horas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Permitir cancelamentos até (horas antes)
                  </label>
                  <select
                    name="allowCancellations"
                    value={notificationSettings.allowCancellations}
                    onChange={handleNotificationChange}
                    className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="1">1 hora</option>
                    <option value="2">2 horas</option>
                    <option value="6">6 horas</option>
                    <option value="12">12 horas</option>
                    <option value="24">24 horas</option>
                  </select>
                </div>
              </div>
              <Button type="submit">Salvar Configurações</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
};

export default Settings;