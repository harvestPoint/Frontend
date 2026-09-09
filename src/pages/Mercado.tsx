import React from 'react';
import { Globe } from 'lucide-react';
import { CrudPage } from '../components/CrudPage';

interface Cotacao {
  id?: number;
  cultura: string;
  destino: string;
  preco: string;
  moeda: string;
  referencia: string;
  demanda: string;
}

const INICIAIS: Cotacao[] = [
  { id: 1, cultura: 'Manga', destino: 'União Europeia', preco: 'EUR 2,8', moeda: 'EUR', referencia: '2026-08-20', demanda: '1500 t' },
  { id: 2, cultura: 'Uva', destino: 'Estados Unidos', preco: 'USD 3,2', moeda: 'USD', referencia: '2026-08-20', demanda: '900 t' },
];

export const Mercado: React.FC = () => (
  <CrudPage<Cotacao>
    activePath="/mercado"
    icon={Globe}
    title="Mercado & Preços"
    subtitle="Cotações e demanda por mercado de destino"
    initialData={INICIAIS}
    columns={[
      { header: 'Cultura', render: (m) => <span className="font-semibold text-gray-900">{m.cultura}</span> },
      { header: 'Mercado destino', accessor: 'destino' },
      { header: 'Preço médio', accessor: 'preco' },
      { header: 'Moeda', accessor: 'moeda' },
      { header: 'Referência', accessor: 'referencia' },
      { header: 'Demanda (t)', accessor: 'demanda' },
    ]}
    filterFn={(m, q) => m.cultura.toLowerCase().includes(q.toLowerCase()) || m.destino.toLowerCase().includes(q.toLowerCase())}
    getNewItem={() => ({ cultura: '', destino: '', preco: '', moeda: 'EUR', referencia: new Date().toISOString().split('T')[0], demanda: '' })}
    renderForm={(data, set) => (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Cultura" value={data.cultura} onChange={(e) => set({ ...data, cultura: e.target.value })} className="p-2 text-xs border rounded-lg" required />
          <input placeholder="Mercado Destino" value={data.destino} onChange={(e) => set({ ...data, destino: e.target.value })} className="p-2 text-xs border rounded-lg" required />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Preço Médio (ex: EUR 2,8)" value={data.preco} onChange={(e) => set({ ...data, preco: e.target.value })} className="p-2 text-xs border rounded-lg" />
          <input placeholder="Demanda (ex: 1500 t)" value={data.demanda} onChange={(e) => set({ ...data, demanda: e.target.value })} className="p-2 text-xs border rounded-lg" />
        </div>
      </div>
    )}
  />
);

export default Mercado;