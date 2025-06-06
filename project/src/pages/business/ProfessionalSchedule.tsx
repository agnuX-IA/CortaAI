import React from 'react';
import { useParams } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Calendar, Clock } from 'lucide-react';

const ProfessionalSchedule: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock professional data
  const professional = {
    id,
    name: 'João Silva',
    speciality: 'Barbeiro',
    appointments: [
      { id: '1', client: 'Rafael Silva', service: 'Corte + Barba', time: '10:00', date: '2025-06-10' },
      { id: '2', client: 'Amanda Oliveira', service: 'Corte', time: '11:30', date: '2025-06-10' },
      { id: '3', client: 'Carlos Mendes', service: 'Barba', time: '14:00', date: '2025-06-10' },
    ],
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Agenda do Profissional</h1>
          <p className="text-gray-400">Visualize os agendamentos do profissional.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                  <span className="text-lg font-medium">{professional.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{professional.name}</h2>
                  <p className="text-sm text-gray-400">{professional.speciality}</p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {professional.appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-gray-700 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-indigo-400">{appointment.time}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">{appointment.date}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-white">{appointment.client}</p>
                      <p className="text-sm text-gray-400">{appointment.service}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
};

export default ProfessionalSchedule;