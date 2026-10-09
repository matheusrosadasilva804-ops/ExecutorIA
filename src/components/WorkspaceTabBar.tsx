import React from 'react';
import { useBot } from '../context/BotContext';
import {
  FileText,
  FileCode,
  BarChart2,
  Mail,
  Terminal,
  LayoutDashboard,
  Plus,
  X,
  Bot,
  Volume2,
  VolumeX,
  Megaphone,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { TabType } from '../types';
import { playSound } from '../utils/sound';

export const WorkspaceTabBar: React.FC = () => {
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    createNewTab,
    closeTab,
    isFloatingBotOpen,
    setIsFloatingBotOpen,
    audioEnabled,
    setAudioEnabled,
    voiceEnabled,
    setVoiceEnabled,
    resetAllDefaults,
  } = useBot();

  const getTabIcon = (type: TabType) => {
    switch (type) {
      case 'script':
        return <FileCode className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
      case 'report':
        return <BarChart2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />;
      case 'terminal':
        return <Terminal className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
      case 'overview':
        return <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />;
      case 'document':
      default:
        return <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 flex items-center justify-between px-2 sm:px-4 select-none">
      {/* Scrollable Tabs List */}
      <div className="flex items-center space-x-1 overflow-x-auto py-1.5 scrollbar-none max-w-[70vw] sm:max-w-[75vw]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                playSound.click(audioEnabled);
              }}
              className={`group flex items-center space-x-2 px-3 py-1.5 rounded-xl cursor-pointer text-xs transition-all border whitespace-nowrap ${
                isActive
                  ? 'bg-slate-950 text-white border-slate-700 shadow-sm font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
              }`}
            >
              {getTabIcon(tab.type)}
              <span className="truncate max-w-[130px] sm:max-w-[180px]">{tab.title}</span>

              {/* Live Bot Execution Badge */}
              {tab.isBotExecuting && (
                <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-mono border border-indigo-500/40 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  <span>Bot Executando</span>
                </span>
              )}

              {/* Close Tab button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-all ml-1"
                  title="Fechar aba"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Tab Button */}
        <button
          onClick={() => createNewTab('document')}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700/60 flex items-center justify-center ml-1"
          title="Abrir nova aba de documento"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1.5 py-1.5">
        {/* Toggle Floating Bot Button */}
        <button
          onClick={() => {
            setIsFloatingBotOpen(!isFloatingBotOpen);
            playSound.click(audioEnabled);
          }}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isFloatingBotOpen
              ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
          }`}
          title="Exibir ou ocultar janela flutuante do robô"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bot Flutuante</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`p-1.5 rounded-xl border text-xs transition-colors ${
            audioEnabled
              ? 'bg-slate-800 border-slate-700 text-indigo-400'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title={audioEnabled ? 'Sons ativados' : 'Sons desativados'}
        >
          {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Voice Speech Toggle */}
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-1.5 rounded-xl border text-xs transition-colors ${
            voiceEnabled
              ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title={voiceEnabled ? 'Voz do robô ativada' : 'Voz desativada'}
        >
          <Megaphone className="w-3.5 h-3.5" />
        </button>

        {/* Reset Default */}
        <button
          onClick={() => {
            if (confirm('Deseja restaurar as abas e arquivos padrão?')) {
              resetAllDefaults();
            }
          }}
          className="p-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Restaurar abas padrão"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
