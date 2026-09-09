import React from 'react';
import { Cpu } from 'lucide-react';
import { CrudPage } from '../components/CrudPage';

interface Sensor {
  id?: number;
  codigo: string;
  tipo: string;
  propriedade: string;
  lote: string;
  instalacao: string;
  status: string;
}

const INICIAIS: Sensor[] = [
  { id: 1, codigo: 'IOT-002', tipo: 'completo', propriedade: 'Fazenda Boa Vista', lote: 'Lote B2 - Uva', instalacao: '2026-01-20', status: 'ativo' },
  { id: 2, codigo: 'IOT-001', tipo: 'completo', propriedade: 'Fazenda Boa Vista', lote: 'Lote A1 - Manga', instalacao: '2026-01-10', status: 'ativo' },
];

export const Sensores: React.FC = () => (
  <CrudPage<Sensor>
    activePath="/sensores"
    icon={Cpu}
    title="Sensores IoT"
    subtitle="Dispositivos de telemetria instalados em campo"
    initialData={INICIAIS}
    columns={[
      { header: 'Código', render: (s) => <span className="font-semibold text-gray-900">{s.codigo}</span> },
      { header: 'Tipo', accessor: 'tipo' },
      { header: 'Propriedade', accessor: 'propriedade' },
      { header: 'Lote', accessor: 'lote' },
      { header: 'Instalação', accessor: 'instalacao' },
      { header: 'Status', render: (s) => <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px] font-medium">{s.status}</span> },
    ]}
    filterFn={(s, q) => s.codigo.toLowerCase().includes(q.toLowerCase()) || s.lote.toLowerCase().includes(q.toLowerCase())}
    getNewItem={() => ({ codigo: '', tipo: 'completo', propriedade: 'Fazenda Boa Vista', lote: '', instalacao: new Date().toISOString().split('T')[0], status: 'ativo' })}
    renderForm={(data, set) => (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Código (ex: IOT-003)" value={data.codigo} onChange={(e) => set({ ...data, codigo: e.target.value })} className="p-2 text-xs border rounded-lg" required />
          <input placeholder="Tipo (ex: completo)" value={data.tipo} onChange={(e) => set({ ...data, tipo: e.target.value })} className="p-2 text-xs border rounded-lg" />
        </div>
        <input placeholder="Propriedade" value={data.propriedade} onChange={(e) => set({ ...data, propriedade: e.target.value })} className="w-full p-2 text-xs border rounded-lg" />
        <input placeholder="Lote instalado" value={data.lote} onChange={(e) => set({ ...data, lote: e.target.value })} className="w-full p-2 text-xs border rounded-lg" />
      </div>
    )}
  />
);

export default Sensores;