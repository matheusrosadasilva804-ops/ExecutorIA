import React, { useState, useRef, useEffect } from 'react';
import { useBot } from '../context/BotContext';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Minimize2,
  Maximize2,
  X,
  Sparkles,
  ExternalLink,
  Volume2,
  Trash2,
  Zap,
  ArrowRight,
  FileText,
  FileCode,
  Mail,
  BarChart2,
  ChevronDown,
} from 'lucide-react';
import { speakBotMessage, playSound } from '../utils/sound';

const QUICK_CHIPS = [
  { label: '📝 Escrever Artigo', prompt: 'Escreva um artigo técnico completo sobre inteligência artificial e computação quântica' },
  { label: '💻 Criar Script', prompt: 'Crie um script em JavaScript para processar e validar dados de clientes' },
  { label: '✉️ E-mail Comercial', prompt: 'Redija uma proposta comercial profissional com tabela de serviços e escopo' },
  { label: '📊 Relatório KPIs', prompt: 'Gere um relatório executivo de desempenho semanal com métricas e indicadores' },
];

export const FloatingBotWindow: React.FC = () => {
  const {
    isFloatingBotOpen,
    setIsFloatingBotOpen,
    chatMessages,
    clearChat,
    executePrompt,
    isProcessing,
    activeTabId,
    setActiveTabId,
    audioEnabled,
    voiceEnabled,
  } = useBot();

  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isProcessing]);

  // Speech recognition setup
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
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não é suportado pelo navegador.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;
    const text = input;
    setInput('');
    executePrompt(text);
  };

  // If floating bot is hidden entirely
  if (!isFloatingBotOpen) {
    return (
      <button
        onClick={() => {
          setIsFloatingBotOpen(true);
          setIsMinimized(false);
          playSound.click(audioEnabled);
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-semibold text-xs shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all group border border-indigo-400/40"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
        </div>
        <span>Abrir Bot Flutuante</span>
      </button>
    );
  }

  // If minimized to floating bubble
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsMinimized(false);
            playSound.click(audioEnabled);
          }}
          className="flex items-center space-x-2 px-3.5 py-2.5 rounded-full bg-slate-900 border border-indigo-500/50 text-slate-100 shadow-2xl hover:border-indigo-400 hover:bg-slate-800 transition-all text-xs group"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            {isProcessing && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            )}
          </div>
          <div className="text-left pr-1">
            <div className="text-[11px] font-bold text-white flex items-center gap-1">
              AutoBot IA
              {isProcessing && <span className="text-[9px] text-amber-300 animate-pulse font-normal">(Executando em abas...)</span>}
            </div>
            <div className="text-[9px] text-slate-400">Clique para expandir</div>
          </div>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        </button>
      </div>
    );
  }

  // Expanded Floating Window
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-w-[440px] h-[580px] bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 rounded-3xl shadow-2xl shadow-indigo-950/70 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800/80 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-bold text-white tracking-tight">AutoBot IA</h3>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Flutuante
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Executa comandos em outras abas</p>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Limpar mensagens"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Minimizar janela"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFloatingBotOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar janela flutuante"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-banner: Instruction */}
      <div className="px-3.5 py-2 bg-indigo-950/30 border-b border-indigo-900/40 flex items-center space-x-2 text-[11px] text-indigo-300">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
        <span className="truncate">
          Peça para a IA: ela abre uma aba e o robô escreve/executa tudo lá!
        </span>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-950/40">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-xs'
                    : 'bg-slate-900 border border-slate-800/90 text-slate-200 rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center space-x-1.5 mb-1.5 text-[10px] font-semibold text-indigo-400">
                    <Bot className="w-3 h-3" />
                    <span>AutoBot</span>
                    {msg.status === 'thinking' && (
                      <span className="text-[10px] text-amber-400 animate-pulse font-normal">
                        • pensando e abrindo aba...
                      </span>
                    )}
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* If bot completed and targeted a tab, show direct link button */}
                {msg.targetTabId && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1.5">
                    <button
                      onClick={() => {
                        setActiveTabId(msg.targetTabId!);
                        playSound.click(audioEnabled);
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-[11px] font-semibold transition-all group"
                    >
                      <span>👉 Ver na Aba: {msg.targetTabTitle}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {msg.botSpeech && (
                      <button
                        onClick={() => speakBotMessage(msg.botSpeech!, voiceEnabled)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                        title="Ouvir áudio"
                      >
                        <Volume2 className="w-3 h-3 text-indigo-400" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <span className="text-[9px] text-slate-500 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="flex items-center space-x-2 text-xs text-indigo-400 bg-slate-900/80 p-2.5 rounded-xl border border-indigo-500/30 w-fit">
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-[11px] font-medium">
              Bot criando aba e executando ações no sistema...
            </span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/60 overflow-x-auto flex items-center space-x-1.5 scrollbar-none">
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(chip.prompt);
            }}
            disabled={isProcessing}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-medium text-slate-300 hover:text-white transition-all whitespace-nowrap"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
        <button
          type="button"
          onClick={toggleVoice}
          disabled={isProcessing}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Ditar por voz (Microfone)"
        >
          {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
          placeholder="Peça à IA e o bot executará na aba..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/80"
        />

        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className={`p-2.5 rounded-xl font-semibold transition-all ${
            !input.trim() || isProcessing
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/30 active:scale-95'
          }`}
          title="Enviar para o Bot"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
