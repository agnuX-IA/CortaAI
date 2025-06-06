import React from 'react';
import BusinessLayout from '../../components/layout/BusinessLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Check, X } from 'lucide-react';

const Subscription: React.FC = () => {
  // Mock subscription data
  const subscription = {
    status: 'active', // active, inactive, trial
    plan: 'Pro',
    price: 'R$ 99,90',
    billingCycle: 'mensal',
    nextPayment: '15/07/2025',
    paymentMethod: 'Cartão de crédito terminando em 4242',
  };

  // Mock plans data
  const plans = [
    {
      name: 'Básico',
      price: 'R$ 49,90',
      description: 'Ideal para barbearias pequenas.',
      features: [
        'Até 3 profissionais',
        'Até 100 agendamentos por mês',
        'Relatórios básicos',
        'Suporte por email',
      ],
      notIncluded: [
        'Relatórios avançados',
        'Integração com WhatsApp',
        'Página personalizada',
        'Suporte prioritário',
      ],
      current: false,
    },
    {
      name: 'Pro',
      price: 'R$ 99,90',
      description: 'Perfeito para barbearias em crescimento.',
      features: [
        'Até 10 profissionais',
        'Agendamentos ilimitados',
        'Relatórios avançados',
        'Integração com WhatsApp',
        'Página personalizada',
        'Suporte por email e chat',
      ],
      notIncluded: [
        'Suporte prioritário',
        'Múltiplas unidades',
      ],
      current: true,
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: 'R$ 199,90',
      description: 'Para redes de barbearias e salões.',
      features: [
        'Profissionais ilimitados',
        'Agendamentos ilimitados',
        'Relatórios avançados',
        'Integração com WhatsApp',
        'Página personalizada',
        'Múltiplas unidades',
        'Suporte prioritário 24/7',
        'Gestão financeira avançada',
      ],
      notIncluded: [],
      current: false,
    },
  ];

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Assinatura</h1>
          <p className="text-gray-400">Gerencie seu plano de assinatura e método de pagamento.</p>
        </div>

        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Sua Assinatura Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-400">Status</p>
                <div className="mt-1 flex items-center">
                  <span className={`inline-block h-3 w-3 rounded-full mr-2 ${
                    subscription.status === 'active' 
                      ? 'bg-green-500' 
                      : subscription.status === 'trial' 
                      ? 'bg-blue-500'
                      : 'bg-red-500'
                  }`}></span>
                  <p className="text-white">
                    {subscription.status === 'active' 
                      ? 'Ativa' 
                      : subscription.status === 'trial' 
                      ? 'Período de Teste'
                      : 'Inativa'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Plano</p>
                <p className="mt-1 text-white">{subscription.plan}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Preço</p>
                <p className="mt-1 text-white">{subscription.price} / {subscription.billingCycle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Próximo Pagamento</p>
                <p className="mt-1 text-white">{subscription.nextPayment}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-400">Método de Pagamento</p>
                <p className="mt-1 text-white">{subscription.paymentMethod}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Alterar Método de Pagamento</Button>
            <Button variant="danger">Cancelar Assinatura</Button>
          </CardFooter>
        </Card>

        {/* Plans */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Planos Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`${
                plan.recommended ? 'border-2 border-indigo-500' : ''
              }`}>
                {plan.recommended && (
                  <div className="bg-indigo-500 text-white text-xs font-medium px-4 py-1 text-center">
                    Recomendado
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm">/mês</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-white mb-2">Inclui:</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {plan.notIncluded.length > 0 && (
                    <div>
                      <p className="font-medium text-white mb-2">Não inclui:</p>
                      <ul className="space-y-2">
                        {plan.notIncluded.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                            <span className="text-sm text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {plan.current ? (
                    <Button fullWidth disabled>
                      Plano Atual
                    </Button>
                  ) : (
                    <Button fullWidth>
                      Mudar para este Plano
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default Subscription;