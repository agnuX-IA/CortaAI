import { supabase } from './supabase';

// Tipos
export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  created_at: string;
}

export interface Client {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string;
  total_spent: number;
  visits: number;
  last_visit: string | null;
  created_at: string;
}

export interface Professional {
  id: string;
  business_id: string;
  name: string;
  specialty: string;
  contact: string;
  created_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  created_at: string;
}

export interface Appointment {
  id: string;
  business_id: string;
  client_id: string;
  service_id: string;
  professional_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'canceled';
  value: number;
  created_at: string;
  // Campos relacionados
  client?: Client;
  service?: Service;
  professional?: Professional;
}

// Serviços de autenticação
export const authService = {
  // Registrar um novo administrador
  registerAdmin: async (email: string, password: string, name: string, phone?: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone
        }
      }
    });
  },

  // Login de administrador
  loginAdmin: async (email: string, password: string) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Verificar se o usuário é um administrador
    if (!authData.user?.id) {
      throw new Error('Erro ao obter ID do usuário');
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admins_auth')
      .select('id')
      .eq('user_id', authData.user.id)
      .single();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
      throw new Error('Essa conta não é de administrador');
    }

    return authData;
  },

  // Login de empresa
  loginBusiness: async (email: string, password: string) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Verificar se o usuário existe
    if (!authData.user?.id) {
      throw new Error('Erro ao obter ID do usuário');
    }

    // Verificar se o usuário tem um registro de empresa
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('admin_id', authData.user.id)
      .single();

    if (businessError || !business) {
      await supabase.auth.signOut();
      throw new Error('Conta não autorizada. Apenas empresas cadastradas podem acessar.');
    }

    return { authData, businessId: business.id };
  },

  // Logout
  logout: async () => {
    return await supabase.auth.signOut();
  },

  // Obter usuário atual
  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },

  // Obter sessão atual
  getCurrentSession: async () => {
    return await supabase.auth.getSession();
  }
};

// Serviços de negócios
export const businessService = {
  // Obter todos os negócios (para administradores)
  getAllBusinesses: async () => {
    return await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
  },

  // Obter um negócio específico
  getBusinessById: async (id: string) => {
    return await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Criar um novo negócio
  createBusiness: async (business: Omit<Business, 'id' | 'created_at'>) => {
    return await supabase
      .from('businesses')
      .insert([business])
      .select();
  },

  // Atualizar um negócio
  updateBusiness: async (id: string, business: Partial<Business>) => {
    return await supabase
      .from('businesses')
      .update(business)
      .eq('id', id)
      .select();
  },

  // Excluir um negócio
  deleteBusiness: async (id: string) => {
    return await supabase
      .from('businesses')
      .delete()
      .eq('id', id);
  }
};

// Serviços de clientes
export const clientService = {
  // Obter todos os clientes de um negócio
  getClientsByBusinessId: async (businessId: string) => {
    return await supabase
      .from('clients')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
  },

  // Obter um cliente específico
  getClientById: async (id: string) => {
    return await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Criar um novo cliente
  createClient: async (client: Omit<Client, 'id' | 'created_at' | 'total_spent' | 'visits' | 'last_visit'>) => {
    return await supabase
      .from('clients')
      .insert([client])
      .select();
  },

  // Atualizar um cliente
  updateClient: async (id: string, client: Partial<Client>) => {
    return await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select();
  },

  // Excluir um cliente
  deleteClient: async (id: string) => {
    return await supabase
      .from('clients')
      .delete()
      .eq('id', id);
  }
};

// Serviços de profissionais
export const professionalService = {
  // Obter todos os profissionais de um negócio
  getProfessionalsByBusinessId: async (businessId: string) => {
    return await supabase
      .from('professionals')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
  },

  // Obter um profissional específico
  getProfessionalById: async (id: string) => {
    return await supabase
      .from('professionals')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Criar um novo profissional
  createProfessional: async (professional: Omit<Professional, 'id' | 'created_at'>) => {
    return await supabase
      .from('professionals')
      .insert([professional])
      .select();
  },

  // Atualizar um profissional
  updateProfessional: async (id: string, professional: Partial<Professional>) => {
    return await supabase
      .from('professionals')
      .update(professional)
      .eq('id', id)
      .select();
  },

  // Excluir um profissional
  deleteProfessional: async (id: string) => {
    return await supabase
      .from('professionals')
      .delete()
      .eq('id', id);
  }
};

// Serviços de serviços
export const serviceService = {
  // Obter todos os serviços de um negócio
  getServicesByBusinessId: async (businessId: string) => {
    return await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
  },

  // Obter um serviço específico
  getServiceById: async (id: string) => {
    return await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Criar um novo serviço
  createService: async (service: Omit<Service, 'id' | 'created_at'>) => {
    return await supabase
      .from('services')
      .insert([service])
      .select();
  },

  // Atualizar um serviço
  updateService: async (id: string, service: Partial<Service>) => {
    return await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select();
  },

  // Excluir um serviço
  deleteService: async (id: string) => {
    return await supabase
      .from('services')
      .delete()
      .eq('id', id);
  }
};

// Serviços de agendamentos
export const appointmentService = {
  // Obter todos os agendamentos de um negócio
  getAppointmentsByBusinessId: async (businessId: string) => {
    return await supabase
      .from('appointments')
      .select(`
        *,
        client:client_id(id, name, email, phone),
        service:service_id(id, name, price, duration),
        professional:professional_id(id, name, specialty)
      `)
      .eq('business_id', businessId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
  },

  // Obter agendamentos por data
  getAppointmentsByDate: async (businessId: string, date: string) => {
    return await supabase
      .from('appointments')
      .select(`
        *,
        client:client_id(id, name, email, phone),
        service:service_id(id, name, price, duration),
        professional:professional_id(id, name, specialty)
      `)
      .eq('business_id', businessId)
      .eq('date', date)
      .order('time', { ascending: true });
  },

  // Obter um agendamento específico
  getAppointmentById: async (id: string) => {
    return await supabase
      .from('appointments')
      .select(`
        *,
        client:client_id(id, name, email, phone),
        service:service_id(id, name, price, duration),
        professional:professional_id(id, name, specialty)
      `)
      .eq('id', id)
      .single();
  },

  // Criar um novo agendamento
  createAppointment: async (appointment: Omit<Appointment, 'id' | 'created_at'>) => {
    return await supabase
      .from('appointments')
      .insert([appointment])
      .select();
  },

  // Atualizar um agendamento
  updateAppointment: async (id: string, appointment: Partial<Appointment>) => {
    return await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', id)
      .select();
  },

  // Excluir um agendamento
  deleteAppointment: async (id: string) => {
    return await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
  },

  // Atualizar o status de um agendamento
  updateAppointmentStatus: async (id: string, status: 'scheduled' | 'completed' | 'canceled') => {
    return await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select();
  }
};

// Serviço de estatísticas para o dashboard
export const statsService = {
  // Obter estatísticas básicas para o dashboard
  getDashboardStats: async (businessId: string) => {
    // Total de clientes
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('id', { count: 'exact' })
      .eq('business_id', businessId);
    
    // Total de agendamentos nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select('id', { count: 'exact' })
      .eq('business_id', businessId)
      .gte('date', formattedDate);
    
    // Faturamento total
    const { data: revenueData, error: revenueError } = await supabase
      .from('appointments')
      .select('value')
      .eq('business_id', businessId)
      .eq('status', 'completed')
      .gte('date', formattedDate);
    
    // Taxa de retorno (clientes com mais de uma visita)
    const { data: returningClientsData, error: returningClientsError } = await supabase
      .from('clients')
      .select('id', { count: 'exact' })
      .eq('business_id', businessId)
      .gt('visits', 1);
    
    if (clientsError || appointmentsError || revenueError || returningClientsError) {
      throw new Error('Erro ao obter estatísticas do dashboard');
    }
    
    const totalClients = clientsData?.length || 0;
    const totalAppointments = appointmentsData?.length || 0;
    
    let totalRevenue = 0;
    if (revenueData) {
      totalRevenue = revenueData.reduce((sum, item) => sum + (item.value || 0), 0);
    }
    
    const returningClients = returningClientsData?.length || 0;
    const returnRate = totalClients > 0 ? (returningClients / totalClients) * 100 : 0;
    
    return {
      totalClients,
      totalAppointments,
      totalRevenue,
      returnRate: Math.round(returnRate)
    };
  },
  
  // Obter dados para o gráfico de faturamento
  getRevenueChartData: async (businessId: string, period: 'week' | 'month' | 'year') => {
    let startDate = new Date();
    let groupBy: string;
    let format: string;
    
    // Definir período e formato
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
      groupBy = 'date';
      format = 'DD/MM';
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
      groupBy = 'date';
      format = 'DD/MM';
    } else { // year
      startDate.setFullYear(startDate.getFullYear() - 1);
      groupBy = "to_char(date::date, 'MM/YYYY')";
      format = 'MM/YYYY';
    }
    
    const formattedDate = startDate.toISOString().split('T')[0];
    
    // Esta é uma consulta simplificada. Em um ambiente real, você usaria funções SQL mais avançadas
    // para agrupar corretamente por dia, mês ou ano.
    const { data, error } = await supabase
      .from('appointments')
      .select('date, value')
      .eq('business_id', businessId)
      .eq('status', 'completed')
      .gte('date', formattedDate)
      .order('date', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Processar os dados para o formato do gráfico
    // Isso é uma simplificação. Em um ambiente real, você faria o agrupamento no banco de dados.
    const chartData: { [key: string]: number } = {};
    
    data?.forEach(appointment => {
      const date = new Date(appointment.date);
      let key: string;
      
      if (period === 'week' || period === 'month') {
        key = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else { // year
        key = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      }
      
      if (!chartData[key]) {
        chartData[key] = 0;
      }
      
      chartData[key] += appointment.value || 0;
    });
    
    // Converter para o formato de array para o gráfico
    return Object.entries(chartData).map(([date, value]) => ({
      date,
      value
    }));
  },
  
  // Obter dados para o gráfico de serviços mais populares
  getPopularServicesData: async (businessId: string) => {
    // Esta é uma consulta simplificada. Em um ambiente real, você usaria funções SQL mais avançadas
    // para contar e agrupar os serviços.
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        service_id,
        service:service_id(name)
      `)
      .eq('business_id', businessId);
    
    if (error) {
      throw error;
    }
    
    // Contar ocorrências de cada serviço
    const serviceCounts: { [key: string]: { id: string, name: string, count: number } } = {};
    
    data?.forEach(appointment => {
      const serviceId = appointment.service_id;
      const serviceName = appointment.service?.name || 'Desconhecido';
      
      if (!serviceCounts[serviceId]) {
        serviceCounts[serviceId] = {
          id: serviceId,
          name: serviceName,
          count: 0
        };
      }
      
      serviceCounts[serviceId].count += 1;
    });
    
    // Converter para array e ordenar por contagem (decrescente)
    return Object.values(serviceCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Pegar os 5 mais populares
  }
};

