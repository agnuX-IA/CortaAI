import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Calendar, Clock, DollarSign, Scissors, User } from 'lucide-react';

const History: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([
    { 
      id: '1', 
      service: 'Corte + Barba', 
      date: '10/06/2025', 
      time: '14:00', 
      professional: 'João Silva', 
      price: 'R$ 55,00', 
      status: 'scheduled' 
    },
    { 
      id: '2', 
      service: 'Corte de Cabelo', 
      date: '15/05/2025', 
      time: '10:30', 
      professional: 'Carlos Santos', 
      price: 'R$ 35,00', 
      status: 'completed' 
    },
    { 
      id: '3', 
      service: 'Barba', 
      date: '01/05/2025', 
      time: '16:00', 
      professional: 'João Silva', 
      price: 'R$ 25,00', 
      status: 'completed' 
    },
    { 
      id: '4', 
      service: 'Hidratação', 
      date: '20/04/2025', 
      time: '11:00', 
      professional: 'Maria Oliveira', 
      price: 'R$ 45,00', 
      status: 'canceled' 
    },
  ]);

  const handleReschedule = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      navigate(`/client/${businessId}/booking`, {
        state: {
          reschedule: true,
          appointment: {
            ...appointment,
            originalId: appointmentId
          }
        }
      });
    }
  };

  const handleCancel = (appointmentId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'canceled' }
          : appointment
      ));
    }
  };

  const handleBookAgain = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      navigate(`/client/${businessId}/booking`, {
        state: {
          rebooking: true,
          appointment: {
            service: appointment.service,
            professional: appointment.professional,
            price: appointment.price
          }
        }
      });
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Histórico de Agendamentos</h1>
          <p className="text-gray-400">Visualize e gerencie seus agendamentos anteriores e futuros.</p>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment) => {
            let statusColor = '';
            let statusText = '';
            
            switch (appointment.status) {
              case 'scheduled':
                statusColor = 'bg-blue-500 bg-opacity-10 text-blue-500 border-blue-500';
                statusText = 'Agendado';
                break;
              case 'completed':
                statusColor = 'bg-green-500 bg-opacity-10 text-green-500 border-green-500';
                statusText = 'Concluído';
                break;
              case 'canceled':
                statusColor = 'bg-red-500 bg-opacity-10 text-red-500 border-red-500';
                statusText = 'Cancelado';
                break;
            }

            return (
              <Card key={appointment.id} className={`border-l-4 ${
                appointment.status === 'scheduled' 
                  ? 'border-l-blue-500' 
                  : appointment.status === 'completed' 
                  ? 'border-l-green-500' 
                  : 'border-l-red-500'
              }`}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="mb-4 sm:mb-0">
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
                          <User className="mr-2 h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{appointment.professional}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{appointment.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-xs mb-4 ${statusColor}`}>
                        {statusText}
                      </span>
                      {appointment.status === 'scheduled' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReschedule(appointment.id)}
                          >
                            Reagendar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-400"
                            onClick={() => handleCancel(appointment.id)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                      {(appointment.status === 'completed' || appointment.status === 'canceled') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBookAgain(appointment.id)}
                        >
                          Agendar Novamente
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {appointments.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">Você ainda não possui agendamentos.</p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate(`/client/${businessId}/booking`)}
                >
                  Fazer Novo Agendamento
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default History;