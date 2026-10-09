import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import {
  Calendar,
  Clock,
  Play,
  Plus,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Zap,
} from 'lucide-react';
import { ScheduledAutomation } from '../types';

export const ScheduledAutomations: React.FC = () => {
  const { scheduledJobs, toggleScheduledJob, executePrompt, isProcessing } = useBot();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [cron, setCron] = useState('');
  const [description, setDescription] = useState('');
  const [targetPrompt, setTargetPrompt] = useState('');

  const handleRunNow = (job: ScheduledAutomation) => {
    if (isProcessing) return;
    executePrompt(job.targetTaskPrompt);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md min-h-[500px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Automações Agendadas & Tarefas Recorrentes
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure o bot para executar rotinas em horários definidos ou dispare-as manualmente.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduledJobs.map((job) => (
          <div
            key={job.id}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              job.active
                ? 'bg-slate-950/70 border-slate-700/80 text-slate-200 shadow-md'
                : 'bg-slate-950/30 border-slate-800/40 text-slate-400 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-100">{job.name}</span>
                <button
                  onClick={() => toggleScheduledJob(job.id)}
                  className="text-xs text-slate-400 hover:text-white"
                  title={job.active ? 'Desativar automação' : 'Ativar automação'}
                >
                  {job.active ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      Ativo
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Pausado</span>
                  )}
                </button>
              </div>

              <div className="inline-block px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px] mb-2 border border-slate-700">
                {job.cronExpr}
              </div>

              <p className="text-xs text-slate-400 mb-3">{job.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Próxima: <strong className="text-slate-400 font-normal">{job.nextRun}</strong>
              </span>

              <button
                onClick={() => handleRunNow(job)}
                disabled={isProcessing}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-medium transition-all"
                title="Disparar esta automação agora"
              >
                <Zap className="w-3 h-3" />
                <span>Disparar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
