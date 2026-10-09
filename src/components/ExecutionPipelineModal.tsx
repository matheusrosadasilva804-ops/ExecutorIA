import React from 'react';
import { useBot } from '../context/BotContext';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  Play,
  Volume2,
  FileText,
  ExternalLink,
  X,
  Layers,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { speakBotMessage } from '../utils/sound';

export const ExecutionPipelineModal: React.FC = () => {
  const {
    pipelinePhase,
    tasks,
    currentRunningTaskId,
    currentResult,
    executeStepManually,
    dismissPipeline,
    setActiveFileId,
    autoExecutionMode,
    errorMessage,
    voiceEnabled,
  } = useBot();

  if (pipelinePhase === 'idle') return null;

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${
              pipelinePhase === 'error'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : pipelinePhase === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              {pipelinePhase === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : pipelinePhase === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : pipelinePhase === 'ai_planning' ? (
                <Sparkles className="w-5 h-5 animate-pulse text-indigo-400" />
              ) : (
                <Bot className="w-5 h-5 animate-bounce text-cyan-400" />
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {pipelinePhase === 'ai_planning' && 'IA Orquestrando Operação...'}
                {pipelinePhase === 'executing_tasks' && 'Bot Executando Tarefas Automatizadas'}
                {pipelinePhase === 'completed' && 'Operação Concluída com Sucesso!'}
                {pipelinePhase === 'error' && 'Falha no Pipeline'}
              </h3>
              <p className="text-xs text-slate-400">
                {pipelinePhase === 'ai_planning' && 'Compreendendo pedido e gerando conteúdo estruturado...'}
                {pipelinePhase === 'executing_tasks' && `${completedCount} de ${tasks.length} tarefas finalizadas pelo bot.`}
                {pipelinePhase === 'completed' && 'Arquivo gravado no workspace e tarefas executadas.'}
                {pipelinePhase === 'error' && errorMessage}
              </p>
            </div>
          </div>

          <button
            onClick={dismissPipeline}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Phase 1: Planning animation */}
          {pipelinePhase === 'ai_planning' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-0.5 animate-spin">
                  <div className="w-full h-full bg-slate-950 rounded-2xl" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Raciocínio com Modelo Gemini 3.8 Flash
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Redigindo o conteúdo completo, estruturando formatação em Markdown e mapeando tarefas operacionais para o bot executor...
                </p>
              </div>
            </div>
          )}

          {/* Phase 2: Tasks List */}
          {(pipelinePhase === 'executing_tasks' || pipelinePhase === 'completed') && (
            <div className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-300">Progresso do Sistema</span>
                  <span className="font-semibold text-indigo-400">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Tasks Cards */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Etapas de Execução do Bot:
                  </span>
                  {!autoExecutionMode && pipelinePhase === 'executing_tasks' && (
                    <span className="text-amber-400 font-medium">Modo Interativo (Autorize cada etapa)</span>
                  )}
                </div>

                {tasks.map((task, idx) => {
                  const isCurrent = currentRunningTaskId === task.id;
                  const isDone = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                          : isDone
                          ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                          : 'bg-slate-950/30 border-slate-800/40 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : isCurrent ? (
                              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                {idx + 1}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                              <span>{task.title}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                                {task.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {task.description}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Mode manual trigger */}
                        {!autoExecutionMode && !isDone && !isCurrent && pipelinePhase === 'executing_tasks' && (
                          <button
                            onClick={() => executeStepManually(task.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-sm active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Executar</span>
                          </button>
                        )}
                      </div>

                      {/* Logs snippet if active */}
                      {isCurrent && task.logs.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-indigo-900/40 font-mono text-[11px] text-indigo-300 space-y-0.5 bg-slate-950/60 p-2 rounded">
                          {task.logs.slice(-2).map((l, lIdx) => (
                            <div key={lIdx} className="truncate">
                              {l}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Success Result Box */}
              {pipelinePhase === 'completed' && currentResult && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/30 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Resultado Final da Operação
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        {currentResult.summary}
                      </p>
                    </div>

                    {currentResult.speechSummary && (
                      <button
                        onClick={() => speakBotMessage(currentResult.speechSummary, true)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                        title="Ouvir resumo em áudio"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[11px]">Ouvir</span>
                      </button>
                    )}
                  </div>

                  {currentResult.file && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span className="font-mono text-slate-200 truncate">
                          {currentResult.file.name}
                        </span>
                        <span className="text-slate-500 text-[10px]">
                          ({Math.round(currentResult.file.size / 1024 * 10) / 10} KB)
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveFileId(currentResult.file.id);
                          dismissPipeline();
                        }}
                        className="flex items-center space-x-1 px-3 py-1 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition-all"
                      >
                        <span>Abrir Documento</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {pipelinePhase === 'error' && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs space-y-2">
              <p className="font-semibold">Ocorreu um erro ao processar a tarefa:</p>
              <p className="font-mono bg-slate-950 p-2 rounded border border-rose-900/50">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {pipelinePhase === 'completed'
              ? 'Todos os arquivos foram sincronizados no sistema'
              : 'O bot está operando no sistema de arquivos virtual'}
          </div>

          <button
            onClick={dismissPipeline}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {pipelinePhase === 'completed' ? 'Fechar e Ver Workspace' : 'Minimizar Janela'}
          </button>
        </div>
      </div>
    </div>
  );
};
