import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import {
  FileText,
  FileCode,
  Copy,
  Check,
  Download,
  Play,
  Eye,
  Edit3,
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  Terminal,
  Send,
  Mail,
  BarChart2,
  LayoutDashboard,
  Clock,
  Layers,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const TabContentViewer: React.FC = () => {
  const {
    activeTab,
    updateTabContent,
    runCodeInTerminal,
    executePrompt,
    tabs,
    setActiveTabId,
    files,
    history,
    audioEnabled,
  } = useBot();

  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [copied, setCopied] = useState(false);
  const [scriptLogs, setScriptLogs] = useState<string[]>([]);
  const [isRunningScript, setIsRunningScript] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  if (!activeTab) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 text-xs">
        Nenhuma aba ativa selecionada.
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab.content);
    setCopied(true);
    playSound.click(audioEnabled);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (ext: string = 'md') => {
    const filename = `${activeTab.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${ext}`;
    const blob = new Blob([activeTab.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    playSound.click(audioEnabled);
  };

  const handleRunScript = async () => {
    setIsRunningScript(true);
    const res = await runCodeInTerminal(activeTab.content);
    setScriptLogs(res.logs);
    setIsRunningScript(false);
  };

  const handleSendEmailSimulation = () => {
    setEmailSent(true);
    playSound.taskComplete(audioEnabled);
    setTimeout(() => setEmailSent(false), 3000);
  };

  // Word count and stats
  const wordCount = activeTab.content ? activeTab.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTimeMin = Math.ceil(wordCount / 200);

  // Render Overview Hub
  if (activeTab.type === 'overview') {
    const totalTasks = history.reduce((acc, h) => acc + h.tasksCount, 0);

    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
        {/* Hero Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/60 via-purple-950/30 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Janela Flutuante & Execução em Abas</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Tudo que você pede na Janela Flutuante é executado em novas abas
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Use a janela do bot flutuante no canto inferior direito para pedir textos, artigos, códigos, planilhas ou e-mails. O bot criará a aba automaticamente e executará as ações na sua frente.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-xl font-bold text-white">{tabs.length}</div>
                <div className="text-[11px] text-slate-400">Abas Ativas</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-xl font-bold text-emerald-400">{totalTasks}</div>
                <div className="text-[11px] text-slate-400">Tarefas do Bot</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Ações Rápidas do Bot (Dispare agora em uma nova aba):
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: FileText,
                color: 'text-indigo-400',
                title: 'Escrever Artigo Completo',
                desc: 'Cria redação técnica, formata e salva em arquivo .md',
                prompt: 'Crie um artigo completo sobre a revolução da computação quântica e inteligência artificial',
              },
              {
                icon: FileCode,
                color: 'text-amber-400',
                title: 'Gerar & Rodar Script',
                desc: 'Escreve código JavaScript e executa no terminal do sistema',
                prompt: 'Escreva um script para extrair, sanitizar e validar registros de usuários com métricas',
              },
              {
                icon: Mail,
                color: 'text-purple-400',
                title: 'Proposta Comercial',
                desc: 'Monta proposta formal com tabela de preços e prazos',
                prompt: 'Elabore um e-mail de proposta comercial para consultoria tecnológica com escopo e prazos',
              },
              {
                icon: BarChart2,
                color: 'text-cyan-400',
                title: 'Relatório Executivo',
                desc: 'Gera sumário com indicadores de desempenho e KPIs',
                prompt: 'Crie um relatório gerencial de vendas com indicadores, comparativo mensal e recomendações',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => executePrompt(item.prompt)}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="p-2 rounded-xl bg-slate-950 w-fit mb-3">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-indigo-400">
                    <span>Disparar Bot</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Existing Open Tabs Quick Links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Abas Abertas no Workspace:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tabs
              .filter((t) => t.id !== 'tab-overview')
              .map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTabId(t.id)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                      {t.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {t.type}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Document Tab
  if (activeTab.type === 'document') {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
        {/* Document Toolbar */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3 truncate">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white truncate">{activeTab.title}</h2>
              <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                <span>{wordCount} palavras</span>
                <span>•</span>
                <span>~{readTimeMin} min de leitura</span>
                <span>•</span>
                <span className="text-emerald-400">Validado pelo Bot</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1.5">
            {/* View / Edit Mode Switch */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'preview'
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visualizar</span>
              </button>
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'edit'
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copiar texto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Download */}
            <button
              onClick={() => handleDownload('md')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs"
              title="Baixar arquivo Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .md</span>
            </button>
          </div>
        </div>

        {/* Bot active execution banner */}
        {activeTab.isBotExecuting && (
          <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-500/30 flex items-center space-x-2 text-xs text-indigo-300 animate-pulse">
            <Bot className="w-4 h-4 text-indigo-400 animate-bounce" />
            <span>{activeTab.botActionDescription || 'Bot escrevendo e executando na aba...'}</span>
          </div>
        )}

        {/* Document Content View */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-950/40">
          <div className="max-w-4xl mx-auto">
            {viewMode === 'preview' ? (
              <div className="prose prose-invert prose-slate max-w-none text-slate-200 space-y-4 font-sans text-sm leading-relaxed">
                {renderMarkdown(activeTab.content)}
              </div>
            ) : (
              <textarea
                value={activeTab.content}
                onChange={(e) => updateTabContent(activeTab.id, e.target.value)}
                className="w-full h-[550px] bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 resize-none leading-relaxed"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Script Tab
  if (activeTab.type === 'script') {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
        {/* Script Toolbar */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">{activeTab.title}</h2>
              <div className="text-[10px] text-slate-400 font-mono">
                Runtime: Node.js / JavaScript Sandbox
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunScript}
              disabled={isRunningScript}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                isRunningScript
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isRunningScript ? (
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-slate-950" />
              )}
              <span>Executar Script</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => handleDownload('js')}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Code Editor and Output Split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          <div className="lg:col-span-8 p-4 bg-slate-950">
            <textarea
              value={activeTab.content}
              onChange={(e) => updateTabContent(activeTab.id, e.target.value)}
              className="w-full h-full bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-amber-200/90 focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed"
            />
          </div>

          <div className="lg:col-span-4 bg-slate-900/60 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col overflow-hidden">
            <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Console de Saída</span>
              </div>
              <span className="text-[10px] text-slate-500">Live Stream</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-slate-300 space-y-1 bg-slate-950/70">
              {scriptLogs.length === 0 ? (
                <div className="text-slate-600 text-xs py-8 text-center">
                  Clique em "Executar Script" para rodar o código e ver as saídas aqui.
                </div>
              ) : (
                scriptLogs.map((line, idx) => (
                  <div key={idx} className="text-emerald-400">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Email Tab
  if (activeTab.type === 'email') {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <h2 className="text-sm font-bold text-white">Central de Envio do Bot: {activeTab.title}</h2>
            </div>

            <button
              onClick={handleSendEmailSimulation}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                emailSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {emailSent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>{emailSent ? 'Disparado com Sucesso!' : 'Disparar E-mail com o Bot'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 w-16">Para:</span>
              <span className="text-slate-200 font-mono">cliente@empresa.com.br</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 w-16">Assunto:</span>
              <span className="text-slate-200 font-medium">{activeTab.title}</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-400 mb-2">Corpo do E-mail (Markdown):</div>
            <textarea
              value={activeTab.content}
              onChange={(e) => updateTabContent(activeTab.id, e.target.value)}
              className="w-full h-80 bg-slate-950 border border-slate-800 rounded-xl p-4 font-sans text-xs text-slate-200 focus:outline-none focus:border-purple-500/60 leading-relaxed resize-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Fallback / Generic Viewer
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="prose prose-invert max-w-none">
        {renderMarkdown(activeTab.content)}
      </div>
    </div>
  );
};

// Markdown renderer helper
function renderMarkdown(raw: string) {
  if (!raw) return <p className="text-slate-500 text-xs italic">Aba em branco.</p>;

  const lines = raw.split('\n');
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        elements.push(
          <div key={`code-${index}`} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs p-3 text-emerald-400 overflow-x-auto">
            <pre><code>{codeBuffer.join('\n')}</code></pre>
          </div>
        );
        codeBuffer = [];
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeBuffer.push(line);
      return;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={index} className="text-2xl font-extrabold text-white pb-2 border-b border-slate-800 mt-4 mb-2">{line.replace('# ', '')}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-lg font-bold text-slate-100 mt-4 mb-2">{line.replace('## ', '')}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-sm font-semibold text-indigo-300 mt-3 mb-1">{line.replace('### ', '')}</h3>);
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={index} className="border-l-2 border-indigo-500 pl-3 py-1 italic text-slate-300 bg-indigo-950/20 rounded-r text-xs">{line.replace('> ', '')}</blockquote>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<li key={index} className="text-xs text-slate-300 ml-4 list-disc py-0.5">{line.replace(/^[-*] /, '')}</li>);
    } else if (line.trim() === '---') {
      elements.push(<hr key={index} className="border-slate-800 my-4" />);
    } else if (line.trim() !== '') {
      elements.push(<p key={index} className="text-xs text-slate-300 leading-relaxed">{line}</p>);
    }
  });

  return elements;
}
