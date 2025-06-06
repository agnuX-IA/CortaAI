import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const BusinessLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Step 2: Check if user exists
      if (!authData.user?.id) {
        throw new Error('Erro ao obter ID do usuário');
      }

      // Step 3: Check if user has a business record
      const { data: business, error: businessError } = await supabase
        .from('empresas')
        .select('id')
        .eq('admin_id', authData.user.id)
        .single();

      if (businessError || !business) {
        // If no business record found, sign out and show error
        await supabase.auth.signOut();
        throw new Error('Conta não autorizada. Apenas empresas cadastradas podem acessar.');
      }

      // Step 4: If all checks pass, navigate to dashboard
      navigate('/business/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Scissors className="h-12 w-12 text-indigo-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Entrar como Empresa</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Acesse o painel da sua barbearia ou salão
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-sm py-8 px-4 shadow-xl ring-1 ring-gray-700/50 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg relative\" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
              >
                Entrar
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Ainda não tem uma conta?{' '}
                  <Link to="/business/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                    Criar conta
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

export default BusinessLogin;