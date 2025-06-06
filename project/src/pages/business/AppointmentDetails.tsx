import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Calendar, Clock, DollarSign, User, MapPin, Phone, Mail, Scissors } from 'lucide-react';

const AppointmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock appointment data
  const appointment = {
    id,
    client: {
      name: 'Amanda Oliveira',
      phone: '(11) 91234-5678',
      email: 'amanda@email.com',
    },
    service: 'Coloração',
    professional: 'Maria',
    date: '15/05/2025',
    time: '10:30',
    duration: 60,
    price: 'R$ 80,00',
    status: 'completed',
    notes: 'Cliente prefere tons mais escuros. Alergia a determinados produtos.',
    address: 'Rua das Flores, 123 - São Paulo, SP',
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Detalhes do Agendamento</h1>
          <p className="text-gray-400">Visualize todas as informações do agendamento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Data</p>
                  <p className="text-white">{appointment.date}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Horário</p>
                  <p className="text-white">{appointment.time} ({appointment.duration} minutos)</p>
                </div>
              </div>

              <div className="flex items-center">
                <Scissors className="h-5 w-5 text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Serviço</p>
                  <p className="text-white">{appointment.service}</p>
                </div>
              </div>

              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Valor</p>
                  <p className="text-white">{appointment.price}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-5 w-5 text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Profissional</p>
                  <p className="text-white">{appointment.professional}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Nome</p>
                  <p className="text-white">{appointment.client.name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Telefone</p>
                  <p className="text-white">{appointment.client.phone}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Mail className="h-5 w-5 text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{appointment.client.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Endereço</p>
                  <p className="text-white">{appointment.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{appointment.notes}</p>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/business/appointments')}
          >
            Voltar
          </Button>
          <Button 
            onClick={() => navigate(`/business/appointments/reagendar/${id}`)}
          >
            Reagendar
          </Button>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default AppointmentDetails;