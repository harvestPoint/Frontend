import React from 'react';
import { 
  LayoutGrid, 
  User, 
  Building2, 
  Sprout, 
  Boxes, 
  Cpu, 
  Zap, 
  ShoppingBag, 
  ArrowLeftRight,
  LogOut,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activePath?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  sectionTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activePath = '/dashboard' }) => {
  const menuSections: NavSection[] = [
    {
      sectionTitle: 'PRINCIPAL',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
      ],
    },
    {
      sectionTitle: 'CADASTROS',
      items: [
        { label: 'Produtores', href: '/produtores', icon: User },
        { label: 'Propriedades', href: '/propriedades', icon: Building2 },
        { label: 'Culturas', href: '/culturas', icon: Sprout },
        { label: 'Lotes', href: '/lotes', icon: Boxes },
        { label: 'Sensores', href: '/sensores', icon: Cpu },
      ],
    },
    {
      sectionTitle: 'TELEMETRIA',
      items: [
        { label: 'Leituras IoT', href: '/leiturasIoT', icon: Zap },
      ],
    },
    {
      sectionTitle: 'MERCADO E LOGÍSTICA',
      items: [
        { label: 'Mercado', href: '/mercado', icon: ShoppingBag },
        
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('@HarvestPoint:token');
    localStorage.removeItem('@HarvestPoint:user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 select-none">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo Superior */}
        <div className="p-5 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-brand-green">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-base font-bold text-gray-900 block leading-tight">
              Harvest<span className="text-brand-green">Point</span>
            </span>
            
          </div>
        </div>

        {/* Itens do Menu */}
        <nav className="p-4 space-y-6">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 block mb-1">
                {section.sectionTitle}
              </span>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePath === item.href;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#eef6ee] text-brand-green font-bold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon size={16} className={isActive ? 'text-brand-green' : 'text-gray-400'} />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Perfil do Usuário e Logout */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-brand-green text-white font-bold text-xs flex items-center justify-center shrink-0">
            AF
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-gray-800 truncate">Abraão Freitas</p>
            <p className="text-[10px] text-gray-400 truncate">abraaofreitas154...</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          title="Sair"
          className="text-gray-400 hover:text-brand-red p-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};