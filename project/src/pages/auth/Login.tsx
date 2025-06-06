import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const Login: React.FC = () => {
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

      // Step 2: Wait for user ID
      if (!authData.user?.id) {
        throw new Error('Erro ao obter ID do usuário');
      }

      // Step 3: Check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins_auth')
        .select('id')
        .eq('user_id', authData.user.id)
        .single();

      if (adminError || !adminData) {
        throw new Error('Essa conta não é de administrador');
      }

      // Step 4: Redirect to admin dashboard
      navigate('/admin/dashboard');
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">CortaAí</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Sistema de gestão para barbearias e salões
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
                Entrar como Administrador
              </Button>
              
              <Link to="/register">
                <Button 
                  type="button" 
                  variant="outline" 
                  fullWidth
                  className="border-indigo-500/20 hover:bg-indigo-500/10"
                >
                  Criar Conta como Administrador
                </Button>
              </Link>
            </div>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 text-gray-400">ou</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Link to="/business/login">
                <Button 
                  type="button" 
                  variant="ghost" 
                  fullWidth
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                >
                  Entrar como Empresa
                </Button>
              </Link>
              
              <Link to="/client/login">
                <Button 
                  type="button" 
                  variant="ghost" 
                  fullWidth
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                >
                  Entrar como Cliente
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;