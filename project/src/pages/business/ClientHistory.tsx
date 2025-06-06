import React from 'react';
import { useParams } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Calendar, Clock, DollarSign, Scissors } from 'lucide-react';

const ClientHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock client data
  const client = {
    id,
    name: 'Rafael Silva',
    phone: '(11) 98765-4321',
    email: 'rafael@email.com',
    totalVisits: 8,
    totalSpent: 'R$ 480,00',
  };

  // Mock appointments history
  const appointments = [
    { id: '1', service: 'Corte + Barba', date: '10/06/2025', time: '14:00', professional: 'João Silva', price: 'R$ 55,00', status: 'completed' },
    { id: '2', service: 'Corte de Cabelo', date: '15/05/2025', time: '10:30', professional: 'Carlos Santos', price: 'R$ 35,00', status: 'completed' },
    { id: '3', service: 'Barba', date: '01/05/2025', time: '16:00', professional: 'João Silva', price: 'R$ 25,00', status: 'completed' },
    { id: '4', service: 'Hidratação', date: '20/04/2025', time: '11:00', professional: 'Maria Oliveira', price: 'R$ 45,00', status: 'canceled' },
  ];

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Histórico do Cliente</h1>
          <p className="text-gray-400">Visualize o histórico completo do cliente.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Nome</p>
                <p className="text-white">{client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Contato</p>
                <p className="text-white">{client.phone}</p>
                <p className="text-sm text-gray-400">{client.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-white">{client.totalVisits} visitas</p>
                <p className="text-sm text-indigo-400">{client.totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <Scissors className="mr-2 h-5 w-5 text-indigo-400" />
                      <h3 className="font-medium text-white">{appointment.service}</h3>
                    </div>
                    <div className="flex flex-col space-y-1 ml-7">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{appointment.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{appointment.time}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{appointment.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      appointment.status === 'completed'
                        ? 'bg-green-500 bg-opacity-10 text-green-500'
                        : 'bg-red-500 bg-opacity-10 text-red-500'
                    }`}>
                      {appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default ClientHistory;