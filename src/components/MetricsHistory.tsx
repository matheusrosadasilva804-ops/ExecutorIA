import React from 'react';
import { useBot } from '../context/BotContext';
import {
  Activity,
  Clock,
  CheckCircle2,
  FileText,
  RotateCcw,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

export const MetricsHistory: React.FC = () => {
  const { history, files, executePrompt, isProcessing, setActiveFileId } = useBot();

  const totalTasks = history.reduce((acc, h) => acc + h.tasksCount, 0);
  const avgTimeMs = history.length > 0 ? Math.round(history.reduce((acc, h) => acc + h.durationMs, 0) / history.length) : 0;
  // Estimated manual time saved: assuming each text + automation takes ~25 minutes manually
  const minutesSaved = Math.round(history.length * 25);
  const hoursSaved = (minutesSaved / 60).toFixed(1);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md min-h-[500px] space-y-6">
      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Operações Executadas</div>
            <div className="text-xl font-bold text-white">{history.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Tarefas do Bot</div>
            <div className="text-xl font-bold text-white">{totalTasks} concluídas</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Tempo Médio Resposta</div>
            <div className="text-xl font-bold text-white">{avgTimeMs} ms</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Economia Estimada</div>
            <div className="text-xl font-bold text-white">~{hoursSaved} horas</div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div>
        <div className="pb-3 border-b border-slate-800 mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Histórico e Auditoria de Execuções
          </h3>
          <span className="text-xs text-slate-400">Total: {history.length} registros</span>
        </div>

        <div className="space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              Nenhuma operação no histórico ainda.
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-100">{record.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Sucesso ({record.tasksCount} tarefas)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-xl">
                    "{record.prompt}"
                  </p>
                  <div className="text-[11px] text-slate-500 flex items-center space-x-3">
                    <span>{record.timestamp}</span>
                    <span>•</span>
                    <span>Duração: {record.durationMs}ms</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                  {record.generatedFileId && (
                    <button
                      onClick={() => setActiveFileId(record.generatedFileId!)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 flex items-center gap-1 transition-all"
                    >
                      <FileText className="w-3 h-3 text-indigo-400" />
                      <span>Ver Arquivo</span>
                    </button>
                  )}

                  <button
                    onClick={() => executePrompt(record.prompt)}
                    disabled={isProcessing}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs border border-indigo-500/40 flex items-center gap-1 transition-all"
                    title="Reexecutar comando com a IA e o Bot"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Repetir</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
