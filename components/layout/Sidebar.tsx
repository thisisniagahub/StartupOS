
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { MODULES, APP_NAME } from '../../constants';
import { ModuleConfig } from '../../types';
import { useTutorial } from '../../context/TutorialContext';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { startTutorial, isActive } = useTutorial();

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon size={18} /> : <Icons.Box size={18} />;
  };

  const renderGroup = (category: string, label: string) => {
    const groupModules = MODULES.filter(m => m.category === category);
    if (groupModules.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="px-4 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {label}
        </h4>
        <div className="space-y-1">
          {groupModules.map((module: ModuleConfig) => (
            <NavLink
              key={module.id}
              to={module.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${isActive 
                  ? 'bg-primary-600/10 text-primary-500 border-r-2 border-primary-600' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }
              `}
            >
              {getIcon(module.icon)}
              <span className="truncate">{module.name}</span>
              {module.phase === 'PHASE_2' && (
                <span className="ml-auto text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">
                  P2
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-64 bg-black border-r border-neutral-800 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Icons.Zap className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">{APP_NAME}</span>
      </div>

      <nav className="flex-1 px-2 py-4">
        {/* Tutorial Button - Highlighted */}
        <button
            onClick={startTutorial}
            disabled={isActive}
            className={`w-full flex items-center gap-3 px-4 py-2 mb-6 text-sm font-bold rounded-lg transition-all border border-dashed
                ${isActive 
                    ? 'bg-primary-900/20 text-primary-500 border-primary-600/50 cursor-default' 
                    : 'bg-gradient-to-r from-neutral-900 to-black text-white border-neutral-700 hover:border-primary-500 hover:text-primary-400'
                }`}
        >
            <Icons.Map size={18} className={isActive ? "animate-pulse" : ""} />
            {isActive ? 'Tour Active...' : 'Start Guided Tour'}
        </button>

        <NavLink
          to="/"
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-2 mb-6 text-sm font-medium rounded-lg transition-all
            ${isActive 
              ? 'bg-white/5 text-white' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }
          `}
        >
          <Icons.LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        {renderGroup('STRATEGY', 'Strategy & Vision')}
        {renderGroup('EXECUTION', 'Product & Execution')}
        {renderGroup('GROWTH', 'Growth & Sales')}
        {renderGroup('OPERATIONS', 'Operations & Finance')}
        {renderGroup('DATA', 'Data & Intelligence')}

        {/* Phase 4+ Admin Section */}
        <div className="mb-6 pt-6 border-t border-neutral-800/50">
           <h4 className="px-4 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
             System Admin
           </h4>
           <div className="space-y-1">
             <NavLink to="/agents" className={({isActive}) => `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive ? 'text-primary-500 bg-primary-900/10' : 'text-neutral-400 hover:text-white'}`}>
                <Icons.Bot size={18} /> Agents
             </NavLink>
             <NavLink to="/marketplace" className={({isActive}) => `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive ? 'text-primary-500 bg-primary-900/10' : 'text-neutral-400 hover:text-white'}`}>
                <Icons.Network size={18} /> Connectors
             </NavLink>
             <NavLink to="/audit" className={({isActive}) => `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive ? 'text-primary-500 bg-primary-900/10' : 'text-neutral-400 hover:text-white'}`}>
                <Icons.ShieldAlert size={18} /> Audit Logs
             </NavLink>
             <NavLink to="/docs" className={({isActive}) => `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive ? 'text-primary-500 bg-primary-900/10' : 'text-neutral-400 hover:text-white'}`}>
                <Icons.Book size={18} /> Documentation
             </NavLink>
           </div>
        </div>
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <div 
          onClick={() => navigate('/billing')}
          className="flex items-center gap-3 p-2 rounded-lg bg-neutral-900/50 border border-neutral-800 cursor-pointer hover:bg-neutral-800 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">John Doe</p>
            <p className="text-xs text-neutral-500 truncate">Founder Plan</p>
          </div>
          <Icons.CreditCard size={16} className="text-neutral-500 group-hover:text-white" />
        </div>
      </div>
    </aside>
  );
};
