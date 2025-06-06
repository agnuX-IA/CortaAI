import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Calendar, Clock, DollarSign, Scissors, User } from 'lucide-react';

const Booking: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState(1);

  // Mock data for services
  const services = [
    { id: '1', name: 'Corte de Cabelo', duration: 30, price: 'R$ 35,00', description: 'Corte tradicional masculino' },
    { id: '2', name: 'Barba', duration: 20, price: 'R$ 25,00', description: 'Barba completa com toalha quente' },
    { id: '3', name: 'Corte + Barba', duration: 50, price: 'R$ 55,00', description: 'Combo corte e barba com desconto' },
    { id: '4', name: 'Coloração', duration: 60, price: 'R$ 80,00', description: 'Coloração completa' },
    { id: '5', name: 'Hidratação', duration: 40, price: 'R$ 45,00', description: 'Hidratação profunda para cabelos' },
  ];

  // Mock data for available times
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  // Mock data for professionals
  const professionals = [
    { id: '1', name: 'João Silva', speciality: 'Barbeiro' },
    { id: '2', name: 'Maria Oliveira', speciality: 'Cabeleireira' },
    { id: '3', name: 'Carlos Santos', speciality: 'Barbeiro' },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekDays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const weekDay = weekDays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${weekDay}, ${day} de ${month} de ${year}`;
  };

  const handleContinue = () => {
    if (bookingStep < 4) {
      setBookingStep(bookingStep + 1);
    } else {
      // Here you would submit the booking
      alert('Agendamento realizado com sucesso!');
      // Reset form
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedProfessional(null);
      setBookingStep(1);
    }
  };

  const handleBack = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Novo Agendamento</h1>
          <p className="text-gray-400">Agende seu horário em poucos passos.</p>
        </div>

        {/* Progress Indicator */}
        <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(bookingStep / 4) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span className={bookingStep >= 1 ? 'text-indigo-400' : ''}>Serviço</span>
          <span className={bookingStep >= 2 ? 'text-indigo-400' : ''}>Data</span>
          <span className={bookingStep >= 3 ? 'text-indigo-400' : ''}>Horário</span>
          <span className={bookingStep >= 4 ? 'text-indigo-400' : ''}>Confirmação</span>
        </div>

        {/* Step 1: Select Service */}
        {bookingStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scissors className="mr-2 h-5 w-5 text-indigo-400" />
                Escolha um Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedService === service.id 
                        ? 'bg-indigo-900 border border-indigo-500' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-white">{service.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{service.price}</p>
                        <p className="text-xs text-gray-400 mt-1">{service.duration} minutos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleContinue}
                  disabled={!selectedService}
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Date */}
        {bookingStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-indigo-400" />
                Escolha uma Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <input
                  type="date"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {selectedDate && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <p className="text-center text-white">
                    {formatDate(selectedDate)}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={handleBack}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleContinue}
                  disabled={!selectedDate}
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Time */}
        {bookingStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-indigo-400" />
                Escolha um Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableTimes.map((time) => (
                  <div
                    key={time}
                    className={`p-2 text-center rounded-md cursor-pointer transition-colors ${
                      selectedTime === time 
                        ? 'bg-indigo-900 border border-indigo-500' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-white mb-3">Profissional (Opcional)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {professionals.map((pro) => (
                    <div
                      key={pro.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedProfessional === pro.id 
                          ? 'bg-indigo-900 border border-indigo-500' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedProfessional(pro.id)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center mb-2">
                          <span className="text-lg font-medium">{pro.name.charAt(0)}</span>
                        </div>
                        <p className="font-medium text-white text-center">{pro.name}</p>
                        <p className="text-xs text-gray-400 text-center">{pro.speciality}</p>
                      </div>
                    </div>
                  ))}
                  <div
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedProfessional === null && bookingStep === 3
                        ? 'bg-indigo-900 border border-indigo-500' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedProfessional(null)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center mb-2">
                        <span className="text-lg font-medium">?</span>
                      </div>
                      <p className="font-medium text-white text-center">Qualquer um</p>
                      <p className="text-xs text-gray-400 text-center">Sem preferência</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={handleBack}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleContinue}
                  disabled={!selectedTime}
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {bookingStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-indigo-400" />
                Confirmar Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Scissors className="mr-2 h-5 w-5 text-indigo-400" />
                    <h3 className="font-medium text-white">Serviço</h3>
                  </div>
                  <p className="ml-7 text-gray-300">
                    {services.find(s => s.id === selectedService)?.name} - {services.find(s => s.id === selectedService)?.price}
                  </p>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="mr-2 h-5 w-5 text-indigo-400" />
                    <h3 className="font-medium text-white">Data e Hora</h3>
                  </div>
                  <p className="ml-7 text-gray-300">
                    {selectedDate && formatDate(selectedDate)} às {selectedTime}
                  </p>
                </div>

                {selectedProfessional && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <User className="mr-2 h-5 w-5 text-indigo-400" />
                      <h3 className="font-medium text-white">Profissional</h3>
                    </div>
                    <p className="ml-7 text-gray-300">
                      {professionals.find(p => p.id === selectedProfessional)?.name} - {professionals.find(p => p.id === selectedProfessional)?.speciality}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="mr-2 h-5 w-5 text-indigo-400" />
                    <h3 className="font-medium text-white">Valor</h3>
                  </div>
                  <p className="ml-7 text-gray-300">
                    {services.find(s => s.id === selectedService)?.price}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={handleBack}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleContinue}
                >
                  Confirmar Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
};

export default Booking;