import React, { useState, useEffect, useRef } from 'react';
import { useBot } from '../context/BotContext';
import {
  Send,
  Sparkles,
  Zap,
  ShieldCheck,
  Mic,
  MicOff,
  FileText,
  FileCode,
  Mail,
  BarChart2,
  CheckSquare,
  CornerDownLeft,
} from 'lucide-react';

const QUICK_PROMPTS = [
  {
    icon: FileText,
    label: 'Artigo sobre IA',
    prompt: 'Escreva um artigo técnico completo sobre a evolução dos agentes autônomos de IA e salve no workspace como artigo-agentes.md com introdução, arquitetura e conclusões.',
  },
  {
    icon: Mail,
    label: 'Proposta Comercial',
    prompt: 'Crie um e-mail formal de proposta comercial para automação de processos, inclua tabela de escopo e salve no sistema.',
  },
  {
    icon: FileCode,
    label: 'Script de Validação',
    prompt: 'Gere um script JavaScript de validação de dados de clientes, crie a rotina de teste e execute a checagem no terminal.',
  },
  {
    icon: BarChart2,
    label: 'Relatório de KPIs',
    prompt: 'Elabore um relatório executivo de desempenho operacional com indicadores-chave, métricas percentuais e salve o documento.',
  },
  {
    icon: CheckSquare,
    label: 'Plano de Ação',
    prompt: 'Crie uma checklist estruturada com plano de contingência para implantação de novos sistemas e notifique a conclusão.',
  },
];

export const PromptCommander: React.FC = () => {
  const {
    executePrompt,
    isProcessing,
    autoExecutionMode,
    setAutoExecutionMode,
    pipelinePhase,
  } = useBot();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'pt-BR';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não é suportado pelo seu navegador.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;
    executePrompt(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Central de Comando IA + Execução do Bot
            </h2>
            <p className="text-xs text-slate-400">
              Peça qualquer conteúdo e o bot planejará, criará e executará no sistema.
            </p>
          </div>
        </div>

        {/* Execution Mode Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setAutoExecutionMode(true)}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              autoExecutionMode
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Piloto Automático</span>
          </button>
          <button
            type="button"
            onClick={() => setAutoExecutionMode(false)}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              !autoExecutionMode
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Modo Interativo</span>
          </button>
        </div>
      </div>

      {/* Command Input Area */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative rounded-xl border border-slate-700/80 bg-slate-950/70 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            rows={3}
            placeholder="Ex: Crie um artigo completo sobre energia limpa, salve como artigo-energia.md e execute as tarefas de validação e indexação..."
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none font-normal"
          />

          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/60 bg-slate-950/40 text-xs">
            {/* Voice Dictation Button */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isProcessing}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Ditar por voz (Microfone)"
              >
                {isListening ? (
                  <>
                    <Mic className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-[11px] font-medium text-rose-300">Ouvindo...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Voz</span>
                  </>
                )}
              </button>

              <span className="hidden sm:inline text-slate-500 text-[11px]">
                Pressione <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Ctrl</kbd> + <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Enter</kbd> para enviar
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
                !input.trim() || isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-indigo-500/25 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>
                    {pipelinePhase === 'ai_planning' ? 'IA Planejando...' : 'Bot Executando...'}
                  </span>
                </>
              ) : (
                <>
                  <span>Gerar & Executar Tarefas</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Prompt Templates */}
      <div className="mt-4 pt-3 border-t border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Exemplos Prontos de Execução:
          </span>
          <span className="text-[10px] text-slate-500">Clique para carregar e disparar</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInput(item.prompt);
                }}
                disabled={isProcessing}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-all text-left group"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
