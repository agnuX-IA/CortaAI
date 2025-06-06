import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const BusinessRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.businessName || !formData.ownerName || !formData.city) {
        setError('Por favor, preencha todos os campos');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      // Wait for authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Erro ao verificar usuário autenticado');
      }

      // Create business record
      const { error: businessError } = await supabase
        .from('empresas')
        .insert([
          {
            admin_id: user.id,
            name: formData.businessName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city
          }
        ]);

      if (businessError) {
        throw new Error('Erro ao criar empresa. Por favor, tente novamente.');
      }

      // Navigate to business dashboard
      navigate('/business/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Scissors className="h-12 w-12 text-indigo-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Cadastro de Empresa</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Comece a gerenciar seu salão ou barbearia
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative mb-6\" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex justify-between mb-6">
            <div className={`w-1/2 h-1 rounded-l-full ${step >= 1 ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>
            <div className={`w-1/2 h-1 rounded-r-full ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <Input
                  label="Nome da Barbearia/Salão"
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  placeholder="Ex: João Barbearia"
                />

                <Input
                  label="Nome do Proprietário"
                  name="ownerName"
                  type="text"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  placeholder="Seu nome completo"
                />

                <Input
                  label="Cidade"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Sua cidade"
                />

                <div className="pt-4">
                  <Button 
                    type="button" 
                    fullWidth 
                    onClick={handleNextStep}
                  >
                    Próximo
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                />

                <Input
                  label="Telefone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(99) 99999-9999"
                />

                <Input
                  label="Senha"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />

                <Input
                  label="Confirmar Senha"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePrevStep}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    fullWidth 
                    isLoading={isLoading}
                  >
                    Finalizar Cadastro
                  </Button>
                </div>
              </>
            )}

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                Já tem uma conta?{' '}
                <Link to="/business/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                  Entrar
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegister;