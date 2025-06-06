import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  
  // Personal information state
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'CortaAí',
    logo: '',
    primaryColor: '#6366f1',
    enableNotifications: true,
    enableEmails: true,
  });

  // Load admin data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Get current authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          throw new Error('Usuário não autenticado');
        }

        // Fetch admin data from admins_auth table
        const { data: adminData, error: adminError } = await supabase
          .from('admins_auth')
          .select('name, email, phone')
          .eq('user_id', user.id)
          .single();

        if (adminError) {
          throw new Error('Erro ao buscar dados do administrador: ' + adminError.message);
        }

        if (adminData) {
          setPersonalInfo({
            name: adminData.name || '',
            email: adminData.email || '',
            phone: adminData.phone || '',
          });
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSystemSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      // Update admin data in admins_auth table
      const { error: updateError } = await supabase
        .from('admins_auth')
        .update({
          name: personalInfo.name,
          email: personalInfo.email,
          phone: personalInfo.phone,
        })
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error('Erro ao atualizar dados: ' + updateError.message);
      }

      alert('Informações pessoais atualizadas com sucesso!');
    } catch (err) {
      console.error('Error updating admin data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados');
    } finally {
      setIsSaving(false);
    }
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

  const handleSystemSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the system settings
    alert('Configurações do sistema atualizadas com sucesso!');
  };

  // Show loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Configurações</h1>
            <p className="text-gray-400">Gerencie suas preferências e configurações do sistema.</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-r-transparent" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-gray-400">Gerencie suas preferências e configurações do sistema.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  required
                />
                <Input
                  label="Telefone"
                  name="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  placeholder="(11) 98765-4321"
                />
                <Button 
                  type="submit" 
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
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
        </div>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSystemSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome do Site"
                  name="siteName"
                  value={systemSettings.siteName}
                  onChange={handleSystemSettingsChange}
                />
                <Input
                  label="Logo (URL)"
                  name="logo"
                  value={systemSettings.logo}
                  onChange={handleSystemSettingsChange}
                  placeholder="URL da imagem do logo"
                />
                <Input
                  label="Cor Primária"
                  name="primaryColor"
                  type="color"
                  value={systemSettings.primaryColor}
                  onChange={handleSystemSettingsChange}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Notificações</h3>
                <div className="flex items-center space-x-2">
                  <input
                    id="enableNotifications"
                    name="enableNotifications"
                    type="checkbox"
                    checked={systemSettings.enableNotifications}
                    onChange={handleSystemSettingsChange}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="enableNotifications" className="text-sm text-gray-300">
                    Habilitar notificações no sistema
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="enableEmails"
                    name="enableEmails"
                    type="checkbox"
                    checked={systemSettings.enableEmails}
                    onChange={handleSystemSettingsChange}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="enableEmails" className="text-sm text-gray-300">
                    Habilitar envio de emails
                  </label>
                </div>
              </div>

              <Button type="submit">Salvar Configurações</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;