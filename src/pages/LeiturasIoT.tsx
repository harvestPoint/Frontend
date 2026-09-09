import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Download, 
  FlaskConical, 
  Play, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Plus,
  RefreshCw
} from 'lucide-react';
import { Layout } from '../components/Layout';

export interface Leitura {
  id: string | number;
  sensor: string;
  data_hora: string;
  temperatura: number;
  umidade: number;
  pressao: number;
  luminosidade: number;
  precipitacao: number;
  solo_pct: number;
}

const DADOS_INICIAIS: Leitura[] = [
  { id: 1, sensor: 'IOT-001', data_hora: '26/08/2026, 09:02:43', temperatura: 31.9, umidade: 73.4, pressao: 1013, luminosidade: 52168, precipitacao: 1.8, solo_pct: 43.8 },
  { id: 2, sensor: 'IOT-002', data_hora: '26/08/2026, 09:02:43', temperatura: 29.9, umidade: 72.4, pressao: 1015, luminosidade: 37928, precipitacao: 0.2, solo_pct: 48.3 },
  { id: 3, sensor: 'IOT-001', data_hora: '26/08/2026, 08:02:43', temperatura: 32.7, umidade: 60.0, pressao: 1015, luminosidade: 26088, precipitacao: 2.0, solo_pct: 36.9 },
  { id: 4, sensor: 'IOT-002', data_hora: '26/08/2026, 08:02:43', temperatura: 31.5, umidade: 60.3, pressao: 1014, luminosidade: 45476, precipitacao: 0.9, solo_pct: 45.3 },
  { id: 5, sensor: 'IOT-001', data_hora: '26/08/2026, 07:02:43', temperatura: 33.0, umidade: 57.7, pressao: 1009, luminosidade: 29252, precipitacao: 1.9, solo_pct: 49.1 },
  { id: 6, sensor: 'IOT-002', data_hora: '26/08/2026, 07:02:43', temperatura: 29.9, umidade: 66.8, pressao: 1014, luminosidade: 25586, precipitacao: 3.6, solo_pct: 59.9 },
  { id: 7, sensor: 'IOT-002', data_hora: '26/08/2026, 06:02:43', temperatura: 31.4, umidade: 72.9, pressao: 1009, luminosidade: 30308, precipitacao: 2.1, solo_pct: 58.9 },
  { id: 8, sensor: 'IOT-001', data_hora: '26/08/2026, 06:02:43', temperatura: 31.8, umidade: 67.1, pressao: 1007, luminosidade: 30219, precipitacao: 2.8, solo_pct: 53.3 },
  { id: 9, sensor: 'IOT-001', data_hora: '26/08/2026, 05:02:43', temperatura: 28.9, umidade: 58.2, pressao: 1012, luminosidade: 51774, precipitacao: 1.6, solo_pct: 42.5 },
  { id: 10, sensor: 'IOT-002', data_hora: '26/08/2026, 05:02:43', temperatura: 28.5, umidade: 61.9, pressao: 1008, luminosidade: 21049, precipitacao: 0.3, solo_pct: 64.9 },
];

export const LeiturasIoT: React.FC = () => {
  const [leituras, setLeituras] = useState<Leitura[]>(DADOS_INICIAIS);
  const [busca, setBusca] = useState('');
  const [intervalo, setIntervalo] = useState<number>(10);
  const [autoSimulando, setAutoSimulando] = useState(false);
  const [expandirManual, setExpandirManual] = useState(false);

  // Form de registro manual
  const [formManual, setFormManual] = useState({
    sensor: 'IOT-001',
    temperatura: '',
    umidade: '',
    pressao: '1013',
    luminosidade: '35000',
    precipitacao: '0.0',
    solo_pct: '45.0',
  });

  const timerRef = useRef<any>(null);

  // Função para gerar leitura simulada
  const gerarLeiturasAleatorias = () => {
    const agora = new Date().toLocaleString('pt-BR');
    const sensores = ['IOT-001', 'IOT-002'];
    
    const novasLeituras: Leitura[] = sensores.map((sensorCode, idx) => ({
      id: Date.now() + idx,
      sensor: sensorCode,
      data_hora: agora,
      temperatura: Number((27 + Math.random() * 6).toFixed(1)),
      umidade: Number((55 + Math.random() * 25).toFixed(1)),
      pressao: Math.floor(1005 + Math.random() * 12),
      luminosidade: Math.floor(20000 + Math.random() * 35000),
      precipitacao: Number((Math.random() * 3.5).toFixed(1)),
      solo_pct: Number((35 + Math.random() * 30).toFixed(1)),
    }));

    setLeituras((prev) => [...novasLeituras, ...prev]);
  };

  // Toggle do simulador contínuo
  const handleToggleAuto = () => {
    if (autoSimulando) {
      clearInterval(timerRef.current);
      setAutoSimulando(false);
    } else {
      gerarLeiturasAleatorias();
      const delay = Math.max(2, intervalo) * 1000;
      timerRef.current = setInterval(() => {
        gerarLeiturasAleatorias();
      }, delay);
      setAutoSimulando(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Adicionar Leitura Manual
  const handleSalvarManual = (e: React.FormEvent) => {
    e.preventDefault();
    const nova: Leitura = {
      id: Date.now(),
      sensor: formManual.sensor,
      data_hora: new Date().toLocaleString('pt-BR'),
      temperatura: Number(formManual.temperatura) || 28.0,
      umidade: Number(formManual.umidade) || 60.0,
      pressao: Number(formManual.pressao) || 1013,
      luminosidade: Number(formManual.luminosidade) || 30000,
      precipitacao: Number(formManual.precipitacao) || 0.0,
      solo_pct: Number(formManual.solo_pct) || 50.0,
    };

    setLeituras((prev) => [nova, ...prev]);
    setExpandirManual(false);
  };

  // Exportar para arquivo CSV nativo do navegador
  const exportarCSV = () => {
    const cabecalho = ['Sensor', 'Data/Hora', 'Temp (ºC)', 'Umid (%)', 'Pressão', 'Lum.', 'Precip.', 'Solo %'];
    const linhas = leiturasFiltradas.map((l) => [
      l.sensor,
      `"${l.data_hora}"`,
      l.temperatura,
      l.umidade,
      l.pressao,
      l.luminosidade,
      l.precipitacao,
      l.solo_pct,
    ]);

    const conteudoCSV = [cabecalho.join(','), ...linhas.map((e) => e.join(','))].join('\n');
    const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leituras_harvestpoint_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const leiturasFiltradas = leituras.filter((l) =>
    l.sensor.toLowerCase().includes(busca.toLowerCase()) ||
    l.data_hora.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Layout activePath="/leituras">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef6ee] text-[#4d8338] flex items-center justify-center">
              <Wifi size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                Leituras IoT
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Simulador de telemetria e histórico de leituras
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={exportarCSV}
            className="flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download size={15} />
            Exportar CSV
          </button>
        </div>

        {/* Card do Simulador de Telemetria */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6b46c1] uppercase tracking-wider">
            <FlaskConical size={16} />
            Simulador de Telemetria
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={gerarLeiturasAleatorias}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className="text-gray-500" />
              Gerar leituras agora
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Intervalo (s)</span>
              <input
                type="number"
                min={2}
                value={intervalo}
                onChange={(e) => setIntervalo(Number(e.target.value))}
                className="w-16 px-2 py-1.5 text-xs text-center border border-gray-200 rounded-lg outline-none focus:border-[#4d8338]"
              />
            </div>

            <button
              type="button"
              onClick={handleToggleAuto}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer ${
                autoSimulando 
                  ? 'bg-brand-red hover:bg-red-700' 
                  : 'bg-[#4d8338] hover:bg-[#3f6d2e]'
              }`}
            >
              {autoSimulando ? (
                <>
                  <Square size={13} fill="currentColor" />
                  Parar auto
                </>
              ) : (
                <>
                  <Play size={13} fill="currentColor" />
                  Iniciar auto
                </>
              )}
            </button>
          </div>
        </div>

        {/* Accordion: Registro manual de leitura */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandirManual(!expandirManual)}
            className="w-full flex items-center justify-between p-4 px-6 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <span>Registro manual de leitura</span>
            <span className="flex items-center gap-1 text-gray-400">
              {expandirManual ? 'Recolher' : 'Expandir'}
              {expandirManual ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          {expandirManual && (
            <form onSubmit={handleSalvarManual} className="p-6 pt-2 border-t border-gray-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sensor</label>
                  <select
                    value={formManual.sensor}
                    onChange={(e) => setFormManual({ ...formManual, sensor: e.target.value })}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none focus:border-[#4d8338] bg-white"
                  >
                    <option value="IOT-001">IOT-001 (Lote A1 - Manga)</option>
                    <option value="IOT-002">IOT-002 (Lote B2 - Uva)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="Ex: 30.5"
                    value={formManual.temperatura}
                    onChange={(e) => setFormManual({ ...formManual, temperatura: e.target.value })}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none focus:border-[#4d8338]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Umidade (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="Ex: 65.0"
                    value={formManual.umidade}
                    onChange={(e) => setFormManual({ ...formManual, umidade: e.target.value })}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none focus:border-[#4d8338]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Pressão (hPa)</label>
                  <input
                    type="number"
                    value={formManual.pressao}
                    onChange={(e) => setFormManual({ ...formManual, pressao: e.target.value })}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none focus:border-[#4d8338]"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#4d8338] hover:bg-[#3f6d2e] text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  <Plus size={15} />
                  Gravar Leitura
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Input de Busca */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por sensor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#4d8338] focus:ring-1 focus:ring-[#4d8338] shadow-xs placeholder:text-gray-400"
          />
        </div>

        {/* Tabela de Leituras */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Sensor</th>
                  <th className="py-3.5 px-6">Data/Hora</th>
                  <th className="py-3.5 px-6">Temp (°C)</th>
                  <th className="py-3.5 px-6">Umid (%)</th>
                  <th className="py-3.5 px-6">Pressão</th>
                  <th className="py-3.5 px-6">Lum.</th>
                  <th className="py-3.5 px-6">Precip.</th>
                  <th className="py-3.5 px-6">Solo %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {leiturasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      Nenhuma leitura encontrada.
                    </td>
                  </tr>
                ) : (
                  leiturasFiltradas.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-gray-900">
                        {item.sensor}
                      </td>
                      <td className="py-3.5 px-6 text-gray-600 font-mono text-[11px]">
                        {item.data_hora}
                      </td>
                      <td className="py-3.5 px-6 text-gray-800 font-medium">
                        {item.temperatura}
                      </td>
                      <td className="py-3.5 px-6 text-gray-800 font-medium">
                        {item.umidade}
                      </td>
                      <td className="py-3.5 px-6 text-gray-600">
                        {item.pressao}
                      </td>
                      <td className="py-3.5 px-6 text-gray-600">
                        {item.luminosidade}
                      </td>
                      <td className="py-3.5 px-6 text-gray-600">
                        {item.precipitacao}
                      </td>
                      <td className="py-3.5 px-6 text-gray-600">
                        {item.solo_pct}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
};