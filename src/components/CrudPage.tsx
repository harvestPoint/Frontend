import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Layout } from './Layout';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface CrudPageProps<T> {
  activePath: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  columns: Column<T>[];
  initialData: T[];
  filterFn: (item: T, search: string) => boolean;
  renderForm: (formData: T, setFormData: React.Dispatch<React.SetStateAction<T>>) => React.ReactNode;
  getNewItem: () => T;
}

export function CrudPage<T extends { id?: number | string }>({
  activePath,
  icon: Icon,
  title,
  subtitle,
  columns,
  initialData,
  filterFn,
  renderForm,
  getNewItem,
}: CrudPageProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<T>(getNewItem());

  const handleOpenNew = () => {
    setEditingItem(null);
    setFormData(getNewItem());
    setIsModalOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id?: number | string) => {
    if (!id) return;
    if (confirm('Deseja realmente excluir este registro?')) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && editingItem.id) {
      setData((prev) => prev.map((item) => (item.id === editingItem.id ? { ...formData, id: item.id } : item)));
    } else {
      setData((prev) => [{ ...formData, id: Date.now() }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const filteredData = data.filter((item) => filterFn(item, search));

  return (
    <Layout activePath={activePath}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef6ee] text-[#4d8338] flex items-center justify-center">
              <Icon size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 bg-[#4d8338] hover:bg-[#3f6d2e] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={16} /> Novo
          </button>
        </div>

        {/* Busca */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#4d8338] shadow-sm"
          />
        </div>

        {/* Tabela */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase">
                {columns.map((col, i) => (
                  <th key={i} className="py-3.5 px-6">{col.header}</th>
                ))}
                <th className="py-3.5 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-8 text-gray-400">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50/60 transition-colors">
                    {columns.map((col, i) => (
                      <td key={i} className="py-4 px-6">
                        {col.render ? col.render(item) : String(item[col.accessor as keyof T] || '')}
                      </td>
                    ))}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button type="button" onClick={() => handleEdit(item)} className="text-gray-400 hover:text-gray-700">
                          <Pencil size={15} />
                        </button>
                        <button type="button" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">{editingItem ? 'Editar' : 'Novo'} Cadastro</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSave} className="mt-4 space-y-3">
                {renderForm(formData, setFormData)}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 bg-[#4d8338] text-white rounded-lg text-xs font-semibold shadow-sm">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}