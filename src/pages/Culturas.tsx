import React from 'react';
import { Sprout } from 'lucide-react';
import { CrudPage } from '../components/CrudPage';

interface Cultura {
  id?: number;
  nome: string;
  variedade: string;
  temp: string;
  umid: string;
  ciclo: string;
}

const INICIAIS: Cultura[] = [
  { id: 1, nome: 'Uva', variedade: 'Itália', temp: '28°C', umid: '70%', ciclo: '150 dias' },
  { id: 2, nome: 'Manga', variedade: 'Tommy Atkins', temp: '30°C', umid: '60%', ciclo: '120 dias' },
];

export const Culturas: React.FC = () => (
  <CrudPage<Cultura>
    activePath="/culturas"
    icon={Sprout}
    title="Culturas"
    subtitle="Cadastro de culturas e parâmetros ideais"
    initialData={INICIAIS}
    columns={[
      { header: 'Cultura', accessor: 'nome', render: (c) => <span className="font-semibold text-gray-900">{c.nome}</span> },
      { header: 'Variedade', accessor: 'variedade' },
      { header: 'Temp. ideal', accessor: 'temp' },
      { header: 'Umidade ideal', accessor: 'umid' },
      { header: 'Ciclo (dias)', accessor: 'ciclo' },
    ]}
    filterFn={(item, q) => item.nome.toLowerCase().includes(q.toLowerCase()) || item.variedade.toLowerCase().includes(q.toLowerCase())}
    getNewItem={() => ({ nome: '', variedade: '', temp: '28°C', umid: '70%', ciclo: '120 dias' })}
    renderForm={(data, set) => (
      <div className="space-y-3">
        <input placeholder="Nome" value={data.nome} onChange={(e) => set({ ...data, nome: e.target.value })} className="w-full p-2 text-xs border rounded-lg" required />
        <input placeholder="Variedade" value={data.variedade} onChange={(e) => set({ ...data, variedade: e.target.value })} className="w-full p-2 text-xs border rounded-lg" required />
        <div className="grid grid-cols-3 gap-2">
          <input placeholder="Temp" value={data.temp} onChange={(e) => set({ ...data, temp: e.target.value })} className="p-2 text-xs border rounded-lg" />
          <input placeholder="Umidade" value={data.umid} onChange={(e) => set({ ...data, umid: e.target.value })} className="p-2 text-xs border rounded-lg" />
          <input placeholder="Ciclo" value={data.ciclo} onChange={(e) => set({ ...data, ciclo: e.target.value })} className="p-2 text-xs border rounded-lg" />
        </div>
      </div>
    )}
  />
);
export default Culturas;