import React, { useState } from 'react';
import {
  FileText,
  Terminal,
  Layers,
  Calendar,
  Activity,
  Sparkles,
} from 'lucide-react';
import { FileWorkspace } from './FileWorkspace';
import { BotTerminal } from './BotTerminal';
import { TaskManager } from './TaskManager';
import { ScheduledAutomations } from './ScheduledAutomations';
import { MetricsHistory } from './MetricsHistory';
import { useBot } from '../context/BotContext';

type TabId = 'files' | 'terminal' | 'tasks' | 'scheduled' | 'metrics';

export const WorkspaceTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('files');
  const { files, logs, tasks } = useBot();

  const tabs = [
    {
      id: 'files' as TabId,
      label: 'Documentos & Editor',
      icon: FileText,
      badge: files.length,
    },
    {
      id: 'terminal' as TabId,
      label: 'Terminal do Bot',
      icon: Terminal,
      badge: logs.length,
    },
    {
      id: 'tasks' as TabId,
      label: 'Tarefas Ativas',
      icon: Layers,
      badge: tasks.length > 0 ? tasks.length : undefined,
    },
    {
      id: 'scheduled' as TabId,
      label: 'Agendamentos',
      icon: Calendar,
    },
    {
      id: 'metrics' as TabId,
      label: 'Métricas & Auditoria',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-slate-800/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'files' && <FileWorkspace />}
        {activeTab === 'terminal' && <BotTerminal />}
        {activeTab === 'tasks' && <TaskManager />}
        {activeTab === 'scheduled' && <ScheduledAutomations />}
        {activeTab === 'metrics' && <MetricsHistory />}
      </div>
    </div>
  );
};
