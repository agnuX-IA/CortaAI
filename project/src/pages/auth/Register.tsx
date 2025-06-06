import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            phone: phone // Store phone in user metadata
          }
        }
      });

      if (authError) throw authError;

      // Step 2: Wait for user ID
      if (!authData.user?.id) {
        throw new Error('Erro ao criar usuário');
      }

      // Step 3: Update the admin record with phone number
      // The trigger will create the basic admin record, but we need to update it with phone
      if (phone) {
        const { error: updateError } = await supabase
          .from('admins_auth')
          .update({ phone: phone })
          .eq('user_id', authData.user.id);

        if (updateError) {
          console.warn('Warning: Could not update phone number:', updateError);
          // Don't throw error here as the main registration was successful
        }
      }

      // Step 4: Redirect to the dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Erro ao criar conta. Verifique o e-mail ou tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Scissors className="h-12 w-12 text-indigo-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Criar Conta de Administrador</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Gerencie múltiplas empresas em sua plataforma
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative\" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <Input
              label="Nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Seu nome completo"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />

            <Input
              label="Telefone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 98765-4321"
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Input
              label="Confirmar Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <div className="space-y-4">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
              >
                Criar Conta
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Já tem uma conta?{' '}
                  <Link to="/" className="font-medium text-indigo-400 hover:text-indigo-300">
                    Entrar
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;