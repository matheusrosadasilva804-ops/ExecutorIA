import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import {
  Terminal,
  Play,
  Trash2,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Bot,
  Cpu,
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const BotTerminal: React.FC = () => {
  const { logs, clearLogs, runCodeInTerminal, audioEnabled } = useBot();
  const [filter, setFilter] = useState<string>('all');
  const [scratchpadCode, setScratchpadCode] = useState<string>(
    `// Teste de automação ao vivo no Bot Console
const sistema = {
  versao: "4.2-bot",
  data: new Date().toLocaleTimeString(),
  status: "PRONTO"
};

console.log("Executando validação de rotina...");
console.log("Status do Sistema:", JSON.stringify(sistema, null, 2));
`
  );
  const [isRunningCode, setIsRunningCode] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const handleRunScratchpad = async () => {
    if (!scratchpadCode.trim() || isRunningCode) return;
    setIsRunningCode(true);
    playSound.taskStart(audioEnabled);
    await runCodeInTerminal(scratchpadCode);
    setIsRunningCode(false);
  };

  const handleExportLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autobot-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    playSound.click(audioEnabled);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px]">
      {/* Left: Terminal Console Logs */}
      <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl font-mono">
        {/* Terminal Header */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200">
              Terminal Operacional do Bot ({logs.length} eventos)
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleExportLogs}
              className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1"
              title="Exportar logs para arquivo"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearLogs}
              className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors text-xs flex items-center gap-1"
              title="Limpar console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center space-x-2 text-[11px] overflow-x-auto">
          <Filter className="w-3 h-3 text-slate-500 flex-shrink-0" />
          {[
            { id: 'all', label: 'Todos' },
            { id: 'bot', label: 'Bot' },
            { id: 'sys', label: 'Sistema' },
            { id: 'success', label: 'Sucesso' },
            { id: 'error', label: 'Erros' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                filter === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Console Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-xs text-slate-300 leading-relaxed font-mono">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-600 py-8 text-center text-xs">
              Nenhum log registrado para este filtro.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isError = log.level === 'error';
              const isSuccess = log.level === 'success';
              const isBot = log.level === 'bot';
              const isSys = log.level === 'sys';

              return (
                <div
                  key={log.id}
                  className="flex items-start space-x-2.5 py-0.5 hover:bg-slate-900/40 px-1 rounded transition-colors"
                >
                  <span className="text-[10px] text-slate-600 select-none flex-shrink-0 pt-0.5">
                    {log.timestamp}
                  </span>

                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded flex-shrink-0 select-none ${
                      isError
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : isSuccess
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isBot
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {log.level}
                  </span>

                  <span
                    className={`break-all ${
                      isError
                        ? 'text-rose-300'
                        : isSuccess
                        ? 'text-emerald-300'
                        : isBot
                        ? 'text-indigo-200'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right: Live Script Runner / Scratchpad */}
      <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg backdrop-blur-md">
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">
              Executor de Scripts em Tempo Real
            </span>
          </div>

          <button
            onClick={handleRunScratchpad}
            disabled={isRunningCode}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isRunningCode
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-md active:scale-95'
            }`}
          >
            {isRunningCode ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-slate-950" />
            )}
            <span>Rodar Código</span>
          </button>
        </div>

        <div className="p-2 bg-slate-950/60 border-b border-slate-800 text-[11px] text-slate-400">
          Escreva ou cole trechos JavaScript para o Bot executar e registrar no terminal:
        </div>

        <div className="flex-1 p-2">
          <textarea
            value={scratchpadCode}
            onChange={(e) => setScratchpadCode(e.target.value)}
            className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-amber-200/90 focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
