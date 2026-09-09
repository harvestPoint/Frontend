import React from 'react';
import { Grid2X2 } from 'lucide-react';
import { CrudPage } from '../components/CrudPage';

interface Lote {
  id?: number;
  codigo: string;
  propriedade: string;
  cultura: string;
  variedade: string;
  area: string;
  data: string;
  status: string;
}

const INICIAIS: Lote[] = [
  { id: 1, codigo: 'Lote A1 - Manga', propriedade: 'Fazenda Boa Vista', cultura: 'Manga', variedade: 'Tommy Atkins', area: '120 ha', data: '15/03/2024', status: 'ativo' },
  { id: 2, codigo: 'Lote B2 - Uva', propriedade: 'Fazenda Boa Vista', cultura: 'Uva', variedade: 'Itália', area: '85 ha', data: '10/06/2024', status: 'ativo' },
  { id: 3, codigo: 'Lote C3 - Uva', propriedade: 'Fazenda Boa Vista', cultura: 'Uva', variedade: 'Crimson Seedless', area: '45 ha', data: '22/08/2024', status: 'em manejo' },
];

export const Lotes: React.FC = () => (
  <CrudPage<Lote>
    activePath="/lotes"
    icon={Grid2X2}
    title="Lotes / Talhões"
    subtitle="Cadastro e divisão de lotes produtivos por propriedade"
    initialData={INICIAIS}
    columns={[
      { header: 'Código Lote', render: (l) => <span className="font-semibold text-gray-900">{l.codigo}</span> },
      { header: 'Propriedade', accessor: 'propriedade' },
      { header: 'Cultura', accessor: 'cultura' },
      { header: 'Variedade', accessor: 'variedade' },
      { header: 'Área (ha)', accessor: 'area' },
      { header: 'Data Plantio', accessor: 'data' },
      { header: 'Status', render: (l) => (
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${l.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          {l.status}
        </span>
      )},
    ]}
    filterFn={(l, q) => l.codigo.toLowerCase().includes(q.toLowerCase()) || l.cultura.toLowerCase().includes(q.toLowerCase())}
    getNewItem={() => ({ codigo: '', propriedade: 'Fazenda Boa Vista', cultura: '', variedade: '', area: '', data: '10/09/2026', status: 'ativo' })}
    renderForm={(data, set) => (
      <div className="space-y-3">
        <input placeholder="Código do Lote" value={data.codigo} onChange={(e) => set({ ...data, codigo: e.target.value })} className="w-full p-2 text-xs border rounded-lg" required />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Cultura" value={data.cultura} onChange={(e) => set({ ...data, cultura: e.target.value })} className="p-2 text-xs border rounded-lg" />
          <input placeholder="Variedade" value={data.variedade} onChange={(e) => set({ ...data, variedade: e.target.value })} className="p-2 text-xs border rounded-lg" />
        </div>
      </div>
    )}
  />
);
export default Lotes;