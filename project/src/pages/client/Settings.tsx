import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Settings: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();

  // Personal information state
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Cliente Exemplo',
    email: 'cliente@email.com',
    phone: '(11) 98765-4321',
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
    remindersBefore: true,
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the user's information
    alert('Informações pessoais atualizadas com sucesso!');
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
    alert('Preferências de notificação atualizadas com sucesso!');
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Configurações da Conta</h1>
          <p className="text-gray-400">Gerencie suas informações pessoais e preferências.</p>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
              <Input
                label="Nome"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
              />
              <Input
                label="Telefone"
                name="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
              />
              <Button type="submit">Salvar Alterações</Button>
            </form>
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
            <CardTitle>Preferências de Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNotificationSubmit} className="space-y-4">
              <div className="space-y-3">
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
                    Receber notificações por email
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
                    Receber notificações por WhatsApp/SMS
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="remindersBefore"
                    name="remindersBefore"
                    type="checkbox"
                    checked={notificationSettings.remindersBefore}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="remindersBefore" className="text-sm text-gray-300">
                    Receber lembretes antes dos agendamentos
                  </label>
                </div>
              </div>
              <Button type="submit">Salvar Preferências</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Settings;