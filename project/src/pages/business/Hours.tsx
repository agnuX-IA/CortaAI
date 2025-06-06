import React, { useState } from 'react';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Hours: React.FC = () => {
  // Initial state for business hours
  const [businessHours, setBusinessHours] = useState({
    monday: { isOpen: true, start: '09:00', end: '19:00' },
    tuesday: { isOpen: true, start: '09:00', end: '19:00' },
    wednesday: { isOpen: true, start: '09:00', end: '19:00' },
    thursday: { isOpen: true, start: '09:00', end: '19:00' },
    friday: { isOpen: true, start: '09:00', end: '19:00' },
    saturday: { isOpen: true, start: '09:00', end: '17:00' },
    sunday: { isOpen: false, start: '09:00', end: '14:00' },
  });

  // Handle toggle for day open/closed
  const handleToggleDay = (day: string) => {
    setBusinessHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day as keyof typeof prevHours],
        isOpen: !prevHours[day as keyof typeof prevHours].isOpen,
      },
    }));
  };

  // Handle time change
  const handleTimeChange = (day: string, field: 'start' | 'end', value: string) => {
    setBusinessHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day as keyof typeof prevHours],
        [field]: value,
      },
    }));
  };

  // Handle save
  const handleSave = () => {
    // Here you would save the business hours to your database
    alert('Horários de funcionamento atualizados com sucesso!');
  };

  // Format day name for display
  const formatDayName = (day: string) => {
    const dayNames: Record<string, string> = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo',
    };
    return dayNames[day] || day;
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Horários de Funcionamento</h1>
          <p className="text-gray-400">Configure os dias e horários em que seu estabelecimento está aberto.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Horários Semanais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(businessHours).map((day) => {
                const dayData = businessHours[day as keyof typeof businessHours];
                return (
                  <div 
                    key={day} 
                    className={`p-4 rounded-lg ${dayData.isOpen ? 'bg-gray-700' : 'bg-gray-800 opacity-75'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <input
                            id={`toggle-${day}`}
                            type="checkbox"
                            checked={dayData.isOpen}
                            onChange={() => handleToggleDay(day)}
                            className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label 
                            htmlFor={`toggle-${day}`} 
                            className={`ml-2 text-lg font-medium ${dayData.isOpen ? 'text-white' : 'text-gray-400'}`}
                          >
                            {formatDayName(day)}
                          </label>
                        </div>
                        <span className={`text-sm ${dayData.isOpen ? 'text-green-500' : 'text-red-500'}`}>
                          {dayData.isOpen ? 'Aberto' : 'Fechado'}
                        </span>
                      </div>
                      {dayData.isOpen && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={dayData.start}
                            onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-gray-400">até</span>
                          <Input
                            type="time"
                            value={dayData.end}
                            onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <Button onClick={handleSave}>Salvar Horários</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feriados e Dias Especiais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Defina dias especiais ou feriados em que seu estabelecimento terá horários diferentes ou estará fechado.
            </p>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Data
                  </label>
                  <Input
                    type="date"
                    className="w-full sm:w-48"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Status
                  </label>
                  <select className="block w-full sm:w-40 bg-gray-600 border border-gray-500 rounded-md text-white px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="closed">Fechado</option>
                    <option value="special">Horário Especial</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Horário (se especial)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      className="w-24"
                      defaultValue="09:00"
                    />
                    <span className="text-gray-400">até</span>
                    <Input
                      type="time"
                      className="w-24"
                      defaultValue="15:00"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button size="sm">
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-400 italic">
                Nenhum dia especial ou feriado configurado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
};

export default Hours;