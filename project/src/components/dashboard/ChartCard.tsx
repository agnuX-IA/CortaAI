import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface ChartCardProps {
  title: string;
  description?: string;
  filter?: React.ReactNode;
  height?: number;
  data?: Array<{name: string, value: number} | {date: string, value: number}>;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  filter,
  height = 300,
  data = [],
}) => {
  // Verificar se temos dados para exibir
  const hasData = data && data.length > 0;
  
  // Determinar o tipo de gráfico com base nos dados
  const isBarChart = hasData && 'name' in data[0];
  const isLineChart = hasData && 'date' in data[0];
  
  // Encontrar o valor máximo para escala
  const maxValue = hasData ? Math.max(...data.map(item => item.value)) : 0;
  
  // Função para renderizar um gráfico de barras simples
  const renderBarChart = () => {
    if (!hasData) return null;
    
    return (
      <div className="w-full h-full flex items-end justify-between gap-2 pt-6">
        {data.map((item: any, index) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center w-full">
              <div 
                className="w-full bg-indigo-500 rounded-t-sm"
                style={{ height: `${barHeight}%` }}
              ></div>
              <div className="mt-2 text-xs text-gray-400 truncate w-full text-center" title={item.name}>
                {item.name}
              </div>
              <div className="text-xs font-medium text-white">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Função para renderizar um gráfico de linha simples
  const renderLineChart = () => {
    if (!hasData) return null;
    
    return (
      <div className="w-full h-full flex flex-col justify-between pt-6">
        <div className="flex-1 relative">
          {/* Linhas de grade horizontais */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
            <div 
              key={i}
              className="absolute w-full border-t border-gray-700"
              style={{ bottom: `${ratio * 100}%` }}
            ></div>
          ))}
          
          {/* Pontos e linhas do gráfico */}
          <svg className="w-full h-full absolute top-0 left-0">
            <polyline
              points={data.map((item: any, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((item.value / maxValue) * 100);
                return `${x}% ${y}%`;
              }).join(' ')}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
            />
            {data.map((item: any, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.value / maxValue) * 100);
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="#6366f1"
                />
              );
            })}
          </svg>
        </div>
        
        {/* Eixo X com datas */}
        <div className="flex justify-between mt-4">
          {data.map((item: any, index) => (
            <div key={index} className="text-xs text-gray-400">
              {item.date}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
        </div>
        {filter}
      </CardHeader>
      <CardContent>
        <div 
          className="w-full"
          style={{ height: `${height}px` }}
        >
          {!hasData && (
            <div className="w-full h-full bg-gray-700 rounded-lg opacity-70 flex items-center justify-center">
              <p className="text-gray-400">Sem dados disponíveis para exibição</p>
            </div>
          )}
          
          {hasData && isBarChart && renderBarChart()}
          {hasData && isLineChart && renderLineChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;

