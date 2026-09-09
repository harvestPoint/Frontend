import React from 'react';
import { Map } from 'lucide-react';
import { CrudPage } from '../components/CrudPage';

interface Propriedade {
  id?: number;
  nome: string;
  produtor: string;
  municipio: string;
  estado: string;
  area: string;
  status: string;
}

const INICIAIS: Propriedade[] = [
  { id: 1, nome: 'Fazenda Boa Vista', produtor: 'Vale Verde Agroexport Ltda', municipio: 'Petrolina', estado: 'PE', area: '250 ha', status: 'ativo' },
];

export const Propriedades: React.FC = () => (
  <CrudPage<Propriedade>
    activePath="/propriedades"
    icon={Map}
    title="Propriedades Rurais"
    subtitle="Cadastro de propriedades e áreas produtivas"
    initialData={INICIAIS}
    columns={[
      { header: 'Propriedade', accessor: 'nome', render: (p) => <span className="font-semibold text-gray-900">{p.nome}</span> },
      { header: 'Produtor', accessor: 'produtor' },
      { header: 'Município', accessor: 'municipio' },
      { header: 'Estado', accessor: 'estado' },
      { header: 'Área (ha)', accessor: 'area' },
      { header: 'Status', render: (p) => <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px] font-medium">{p.status}</span> },
    ]}
    filterFn={(p, q) => p.nome.toLowerCase().includes(q.toLowerCase()) || p.produtor.toLowerCase().includes(q.toLowerCase())}
    getNewItem={() => ({ nome: '', produtor: '', municipio: '', estado: 'PE', area: '', status: 'ativo' })}
    renderForm={(data, set) => (
      <div className="space-y-3">
        <input placeholder="Nome da Propriedade" value={data.nome} onChange={(e) => set({ ...data, nome: e.target.value })} className="w-full p-2 text-xs border rounded-lg" required />
        <input placeholder="Produtor" value={data.produtor} onChange={(e) => set({ ...data, produtor: e.target.value })} className="w-full p-2 text-xs border rounded-lg" required />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Município" value={data.municipio} onChange={(e) => set({ ...data, municipio: e.target.value })} className="p-2 text-xs border rounded-lg" />
          <input placeholder="Área (ex: 250 ha)" value={data.area} onChange={(e) => set({ ...data, area: e.target.value })} className="p-2 text-xs border rounded-lg" />
        </div>
      </div>
    )}
  />
);
export default Propriedades;