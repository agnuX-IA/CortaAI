import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Calendar, Clock, User } from 'lucide-react';

const AppointmentReschedule: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock appointment data
  const appointment = {
    id,
    client: 'Amanda Oliveira',
    service: 'Coloração',
    professional: 'Maria',
    date: '2025-05-15',
    time: '10:30',
  };

  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState(appointment.time);
  const [newProfessional, setNewProfessional] = useState(appointment.professional);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the appointment in your database
    alert('Agendamento remarcado com sucesso!');
    navigate('/business/appointments');
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Reagendar Atendimento</h1>
          <p className="text-gray-400">Altere a data e horário do agendamento.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Atuais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Cliente</p>
                <p className="text-white">{appointment.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Serviço</p>
                <p className="text-white">{appointment.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Profissional</p>
                <p className="text-white">{appointment.professional}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nova Data e Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Nova Data
                  </label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    Novo Horário
                  </label>
                  <Input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <User className="h-4 w-4 mr-2" />
                    Profissional
                  </label>
                  <select
                    value={newProfessional}
                    onChange={(e) => setNewProfessional(e.target.value)}
                    className="block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Maria">Maria</option>
                    <option value="João">João</option>
                    <option value="Carlos">Carlos</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/business/appointments')}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Confirmar Reagendamento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
};

export default AppointmentReschedule;