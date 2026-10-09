import React from 'react';
import { useBot } from '../context/BotContext';
import {
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Layers,
  FileText,
  Terminal,
  AlertCircle,
} from 'lucide-react';
import { BotTask } from '../types';

export const TaskManager: React.FC = () => {
  const { tasks, executeStepManually, isProcessing } = useBot();

  const completed = tasks.filter((t) => t.status === 'completed');
  const running = tasks.filter((t) => t.status === 'running');
  const pending = tasks.filter((t) => t.status === 'pending');

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md min-h-[500px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Gerenciador de Tarefas Automatizadas do Bot
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Acompanhe o estado de cada rotina do sistema planejada pela IA e executada pelo robô.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            {completed.length} Concluídas
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
            {running.length} Em Execução
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 font-medium">
            {pending.length} Na Fila
          </span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-300">Nenhuma tarefa no lote atual</h4>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Envie uma solicitação na Central de Comando acima (ex: criar texto, formatar documento ou gerar script) para o bot popular as tarefas.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {tasks.map((task, idx) => {
            const isDone = task.status === 'completed';
            const isRunning = task.status === 'running';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all ${
                  isRunning
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                    : isDone
                    ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                    : 'bg-slate-950/30 border-slate-800/50 text-slate-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="pt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isRunning ? (
                        <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Clock className="w-5 h-5 text-slate-500" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-100">{task.title}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                          {task.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <span className="text-[11px] text-slate-500 font-mono">
                      ~{task.estimatedDurationMs}ms
                    </span>

                    {!isDone && !isRunning && (
                      <button
                        onClick={() => executeStepManually(task.id)}
                        disabled={isProcessing}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-all"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Executar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Task logs */}
                {task.logs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1 bg-slate-950/50 p-2.5 rounded-lg">
                    {task.logs.map((log, lIdx) => (
                      <div key={lIdx} className="truncate text-slate-300">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
