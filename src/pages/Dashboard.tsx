import React, { useState } from 'react';
import { 
  LayoutGrid, 
  AlertTriangle, 
  Thermometer, 
  FlaskConical, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  Radio 
} from 'lucide-react';
import { Layout } from '../components/Layout';

export const Dashboard: React.FC = () => {
  const [propriedade, setPropriedade] = useState('Todas');
  const [lote, setLote] = useState('Todos');
  const [cultura, setCultura] = useState('Todas');
  const [sensor, setSensor] = useState('Todos');

  return (
    <Layout activePath="/dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eef6ee] text-brand-green flex items-center justify-center">
            <LayoutGrid size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">
              Dashboard Climático
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Monitoramento agroclimático em tempo real
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Propriedade</label>
              <select 
                value={propriedade}
                onChange={(e) => setPropriedade(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-700 outline-none focus:border-brand-green"
              >
                <option>Todas</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Lote</label>
              <select 
                value={lote}
                onChange={(e) => setLote(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-700 outline-none focus:border-brand-green"
              >
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Cultura</label>
              <select 
                value={cultura}
                onChange={(e) => setCultura(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-700 outline-none focus:border-brand-green"
              >
                <option>Todas</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sensor</label>
              <select 
                value={sensor}
                onChange={(e) => setSensor(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-700 outline-none focus:border-brand-green"
              >
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">De</label>
              <input 
                type="date" 
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-600 outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Até</label>
              <input 
                type="date" 
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-600 outline-none focus:border-brand-green"
              />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button type="button" className="text-xs font-semibold text-brand-green hover:underline">
              Limpar filtros
            </button>
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
            <AlertTriangle size={15} className="text-amber-600" />
            Alertas Climáticos (2)
          </div>
          <div className="space-y-1.5 pl-6 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                Temperatura
              </span>
              Temperatura 31.9°C acima do recomendado (30°C) para Lote A1 - Manga (Manga).
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                Temperatura
              </span>
              Temperatura 29.9°C acima do recomendado (28°C) para Lote B2 - Uva (Uva).
            </div>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center">
              <Thermometer size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Temperatura</span>
              <span className="text-lg font-bold text-gray-900">31.9 <span className="text-xs font-normal">°C</span></span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FlaskConical size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Umidade atu</span>
              <span className="text-lg font-bold text-gray-900">73.4 <span className="text-xs font-normal">%</span></span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Temp. médi</span>
              <span className="text-lg font-bold text-gray-900">31.2 <span className="text-xs font-normal">°C</span></span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingDown size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Umid. média</span>
              <span className="text-lg font-bold text-gray-900">66.1 <span className="text-xs font-normal">%</span></span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center">
              <Cpu size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Sensores at</span>
              <span className="text-lg font-bold text-gray-900">2</span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
              <Radio size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Total de leitu</span>
              <span className="text-lg font-bold text-gray-900">12</span>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Evolução de Temperatura</h2>
              <p className="text-[11px] text-gray-500">Destaque em roxo ameixa</p>
            </div>
            <div className="h-44 w-full flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400">
              Gráfico de Temperatura
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Evolução de Umidade</h2>
              <p className="text-[11px] text-gray-500">Destaque em verde oliva</p>
            </div>
            <div className="h-44 w-full flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400">
              Gráfico de Umidade
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};