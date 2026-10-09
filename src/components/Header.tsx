import React from 'react';
import { useBot } from '../context/BotContext';
import { Bot, Sparkles, Volume2, VolumeX, Megaphone, RotateCcw, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    files,
    history,
    audioEnabled,
    voiceEnabled,
    setAudioEnabled,
    setVoiceEnabled,
    resetAllDefaults,
  } = useBot();

  const totalTasks = history.reduce((acc, h) => acc + h.tasksCount, 0);

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-[1.5px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                AutoBot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">IA</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Agente Autônomo
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              IA Planejadora + Bot Executor de Tarefas Automatizadas
            </p>
          </div>
        </div>

        {/* System Stats Bar */}
        <div className="hidden md:flex items-center space-x-6 text-xs text-slate-400 border-x border-slate-800/80 px-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Motor: <strong className="text-slate-200">Gemini 3.8 Flash</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">Tarefas:</span>
            <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
              {totalTasks} executadas
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">Workspace:</span>
            <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
              {files.length} arquivos
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Efeitos sonoros ativados' : 'Efeitos sonoros desativados'}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center justify-center ${
              audioEnabled
                ? 'bg-slate-800/80 border-slate-700 text-indigo-400 hover:bg-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Voice Speech Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={voiceEnabled ? 'Narração de voz do bot ativada' : 'Narração de voz desativada'}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center justify-center ${
              voiceEnabled
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Megaphone className="w-4 h-4" />
          </button>

          {/* Reset Environment */}
          <button
            onClick={() => {
              if (confirm('Deseja restaurar os arquivos e configurações iniciais do workspace?')) {
                resetAllDefaults();
              }
            }}
            title="Restaurar ambiente padrão"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
