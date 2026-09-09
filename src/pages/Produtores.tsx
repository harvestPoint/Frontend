import React from 'react';
import { Users } from 'lucide-react';
import { CrudPage } from '../components/CrudPage';

interface Produtor {
  id?: number;
  razao_social: string;
  cpf_cnpj: string;
  telefone: string;
  email: string;
  responsavel: string;
  cidade_uf: string;
}

const INICIAIS: Produtor[] = [
  { id: 1, razao_social: 'Vale Verde Agroexport Ltda', cpf_cnpj: '2312-3535?kfsm', telefone: '(87) 99876-5432', email: 'contato@valeverde.com', responsavel: 'Carlos Mendes', cidade_uf: 'Petrolina/PE' },
];

export const Produtores: React.FC = () => (
  <CrudPage<Produtor>
    activePath="/produtores"
    icon={Users}
    title="Produtores / Empresas"
    subtitle="Cadastro de produtores e empresas vinculadas"
    initialData={INICIAIS}
    columns={[
      { header: 'Razão Social / Nome', render: (p) => <span className="font-semibold text-gray-900">{p.razao_social}</span> },
      { header: 'CPF / CNPJ', accessor: 'cpf_cnpj' },
      { header: 'Telefone', accessor: 'telefone' },
      { header: 'E-mail', accessor: 'email' },
      { header: 'Responsável', accessor: 'responsavel' },
      { header: 'Cidade/UF', accessor: 'cidade_uf' },
    ]}
    filterFn={(p, q) => p.razao_social.toLowerCase().includes(q.toLowerCase()) || p.cpf_cnpj.toLowerCase().includes(q.toLowerCase())}
    getNewItem={() => ({ razao_social: '', cpf_cnpj: '', telefone: '', email: '', responsavel: '', cidade_uf: '' })}
    renderForm={(data, set) => (
      <div className="space-y-3">
        <input placeholder="Razão Social / Nome" value={data.razao_social} onChange={(e) => set({ ...data, razao_social: e.target.value })} className="w-full p-2 text-xs border rounded-lg" required />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="CPF / CNPJ" value={data.cpf_cnpj} onChange={(e) => set({ ...data, cpf_cnpj: e.target.value })} className="p-2 text-xs border rounded-lg" required />
          <input placeholder="Telefone" value={data.telefone} onChange={(e) => set({ ...data, telefone: e.target.value })} className="p-2 text-xs border rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="E-mail" value={data.email} onChange={(e) => set({ ...data, email: e.target.value })} className="p-2 text-xs border rounded-lg" />
          <input placeholder="Responsável" value={data.responsavel} onChange={(e) => set({ ...data, responsavel: e.target.value })} className="p-2 text-xs border rounded-lg" />
        </div>
        <input placeholder="Cidade/UF (ex: Petrolina/PE)" value={data.cidade_uf} onChange={(e) => set({ ...data, cidade_uf: e.target.value })} className="w-full p-2 text-xs border rounded-lg" />
      </div>
    )}
  />
);

export default Produtores;