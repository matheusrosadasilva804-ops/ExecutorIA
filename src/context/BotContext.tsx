import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  BotTask,
  VirtualFile,
  ExecutionRecord,
  ScheduledAutomation,
  BotLogEntry,
  WorkspaceTab,
  ChatMessage,
  TabType,
} from '../types';
import { playSound, speakBotMessage } from '../utils/sound';

interface BotContextType {
  // Tabs System
  tabs: WorkspaceTab[];
  activeTabId: string;
  activeTab: WorkspaceTab | null;
  setActiveTabId: (id: string) => void;
  createNewTab: (type?: TabType, title?: string, content?: string) => string;
  closeTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;

  // Floating Bot Window
  isFloatingBotOpen: boolean;
  setIsFloatingBotOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  clearChat: () => void;

  // Workspace Files
  files: VirtualFile[];
  activeFile: VirtualFile | null;
  setActiveFileId: (id: string | null) => void;
  createFile: (name: string, content: string, type?: VirtualFile['type']) => VirtualFile;
  updateFileContent: (id: string, content: string) => void;
  deleteFile: (id: string) => void;

  // Execution & Tasks
  tasks: BotTask[];
  history: ExecutionRecord[];
  logs: BotLogEntry[];
  scheduledJobs: ScheduledAutomation[];
  isProcessing: boolean;
  pipelinePhase: 'idle' | 'ai_planning' | 'executing_tasks' | 'completed' | 'error';
  currentRunningTaskId: string | null;
  audioEnabled: boolean;
  voiceEnabled: boolean;
  autoExecutionMode: boolean;
  currentResult: any | null;
  activePrompt: string;
  errorMessage: string | null;

  // Actions
  setAudioEnabled: (val: boolean) => void;
  setVoiceEnabled: (val: boolean) => void;
  setAutoExecutionMode: (val: boolean) => void;
  executePrompt: (promptText: string) => Promise<void>;
  executeStepManually: (taskId: string) => Promise<void>;
  runCodeInTerminal: (code: string) => Promise<{ logs: string[]; durationMs: number }>;
  addLog: (level: BotLogEntry['level'], message: string) => void;
  clearLogs: () => void;
  toggleScheduledJob: (id: string) => void;
  dismissPipeline: () => void;
  resetAllDefaults: () => void;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

const INITIAL_FILES: VirtualFile[] = [
  {
    id: 'file-demo-1',
    name: 'artigo-revolucao-agentes-ia.md',
    path: '/workspace/documentos/artigo-revolucao-agentes-ia.md',
    type: 'markdown',
    size: 2450,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    content: `# A Nova Era dos Agentes Autônomos de IA e Execução de Sistemas

*Publicado pelo AutoBot System*  
*Status: Validado e Indexado no Workspace*

---

## 1. Visão Geral
A evolução da inteligência artificial ultrapassou a barreira de simples respostas em texto. Hoje, o verdadeiro poder reside na **capacidade de agir**: transformar instruções em linguagem natural em **tarefas automatizadas executadas no sistema** em tempo real.

## 2. A Arquitetura em Duas Camadas
Nosso sistema opera em duas frentes complementares:
- **Camada Cognitiva (IA):** Responsável pela interpretação da intenção, raciocínio lógico, síntese de conhecimento e planejamento.
- **Camada Executora (Bot):** Opera diretamente abrindo abas, gravando arquivos, executando scripts e monitorando logs.

### Matriz de Eficiência
| Operação | Processo Tradicional | Com AutoBot + IA | Redução |
| :--- | :--- | :--- | :--- |
| Redigir Relatório Técnico | 90 minutos | 3 segundos | **99.2%** |
| Criação de Scripts de Teste | 45 minutos | 2 segundos | **98.8%** |
| Disparo de Rotinas no Sistema | Manual | 100% Autônomo | **Instantâneo** |
`,
  },
  {
    id: 'file-demo-2',
    name: 'validador-sistema.js',
    path: '/workspace/scripts/validador-sistema.js',
    type: 'javascript',
    size: 1120,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    content: `// Script de simulação de telemetria do sistema
console.log("=== INICIANDO AUDITORIA DO SISTEMA AUTOBOT ===");
const metricas = {
  cpuUsage: "14.2%",
  memoryAllocated: "64MB",
  activeWorkers: 4,
  tasksQueue: 0,
  healthCheck: "OPTIMAL"
};

console.log("[INFO] Verificando integridade das abas e tarefas...");
console.log("[INFO] Status do Cluster: 100% Operacional");
console.log("[METRICAS]", JSON.stringify(metricas, null, 2));
console.log("=== ROTINA FINALIZADA COM SUCESSO ===");
`,
  },
];

const INITIAL_TABS: WorkspaceTab[] = [
  {
    id: 'tab-overview',
    title: 'Painel Geral',
    type: 'overview',
    content: '',
    isBotExecuting: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tab-doc-1',
    title: 'Artigo: Agentes Autônomos IA',
    type: 'document',
    content: INITIAL_FILES[0].content,
    isBotExecuting: false,
    createdAt: new Date().toISOString(),
    associatedFileId: 'file-demo-1',
  },
  {
    id: 'tab-script-1',
    title: 'Script: Validador do Sistema',
    type: 'script',
    content: INITIAL_FILES[1].content,
    isBotExecuting: false,
    createdAt: new Date().toISOString(),
    associatedFileId: 'file-demo-2',
  },
  {
    id: 'tab-terminal',
    title: 'Terminal do Sistema',
    type: 'terminal',
    content: '',
    isBotExecuting: false,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_SCHEDULED: ScheduledAutomation[] = [
  {
    id: 'job-1',
    name: 'Resumo Diário de Produtividade',
    cronExpr: '0 09:00 (Diário)',
    description: 'Coleta métricas e compila relatório executivo no workspace.',
    active: true,
    lastRun: 'Hoje às 09:00',
    nextRun: 'Amanhã às 09:00',
    targetTaskPrompt: 'Gerar resumo executivo diário das atividades do sistema',
  },
  {
    id: 'job-2',
    name: 'Auditoria de Arquivos & Checksum',
    cronExpr: '0 00:00 (Meia-noite)',
    description: 'Verifica integridade em todos os arquivos gerados pelo bot.',
    active: true,
    lastRun: 'Ontem às 00:00',
    nextRun: 'Hoje às 00:00',
    targetTaskPrompt: 'Verificar integridade do diretório /workspace e calcular checksums',
  },
];

export const BotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Tabs State
  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => {
    const saved = localStorage.getItem('autobot_tabs_v2');
    return saved ? JSON.parse(saved) : INITIAL_TABS;
  });
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[1]?.id || tabs[0]?.id || 'tab-overview');

  // Floating Bot State
  const [isFloatingBotOpen, setIsFloatingBotOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'bot',
      text: 'Olá! Sou o AutoBot IA. Me peça qualquer coisa aqui na janela flutuante (ex: "escreva um artigo sobre tecnologia", "crie um roteiro", "gere um script", "monte um e-mail com proposta"). Eu abro uma nova aba e executo tudo para você em tempo real!',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'done',
    },
  ]);

  // Files State
  const [files, setFiles] = useState<VirtualFile[]>(() => {
    const saved = localStorage.getItem('autobot_files_v2');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });
  const [activeFileId, setActiveFileId] = useState<string | null>(files[0]?.id || null);

  // Execution & Logs
  const [tasks, setTasks] = useState<BotTask[]>([]);
  const [history, setHistory] = useState<ExecutionRecord[]>(() => {
    const saved = localStorage.getItem('autobot_history_v2');
    return saved ? JSON.parse(saved) : [
      {
        id: 'hist-1',
        prompt: 'Escrever artigo sobre a revolução dos agentes autônomos de IA',
        title: 'Artigo: Agentes Autônomos IA',
        summary: 'Artigo técnico criado e executado na aba correspondente.',
        timestamp: new Date().toLocaleDateString('pt-BR'),
        durationMs: 1200,
        status: 'success',
        tasksCount: 3,
        tabId: 'tab-doc-1',
      },
    ];
  });

  const [logs, setLogs] = useState<BotLogEntry[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      level: 'sys',
      message: 'Sistema de Multi-Abas e Janela Flutuante ativado. Motor: Gemini 3.8 Flash.',
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      level: 'bot',
      message: 'Bot aguardando comando na janela flutuante para executar tarefas em novas abas.',
    },
  ]);

  const [scheduledJobs, setScheduledJobs] = useState<ScheduledAutomation[]>(INITIAL_SCHEDULED);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelinePhase, setPipelinePhase] = useState<'idle' | 'ai_planning' | 'executing_tasks' | 'completed' | 'error'>('idle');
  const [currentRunningTaskId, setCurrentRunningTaskId] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoExecutionMode, setAutoExecutionMode] = useState(true);
  const [currentResult, setCurrentResult] = useState<any | null>(null);
  const [activePrompt, setActivePrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('autobot_tabs_v2', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('autobot_files_v2', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('autobot_history_v2', JSON.stringify(history));
  }, [history]);

  const addLog = useCallback((level: BotLogEntry['level'], message: string) => {
    const entry: BotLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      level,
      message,
    };
    setLogs((prev) => [entry, ...prev.slice(0, 199)]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: 'Histórico de chat limpo. Me diga o que deseja criar ou executar!',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'done',
      },
    ]);
  }, []);

  // Tabs Management
  const createNewTab = useCallback((type: TabType = 'document', title?: string, content: string = ''): string => {
    const id = `tab-${Date.now()}`;
    const defaultTitle =
      type === 'document'
        ? 'Novo Documento'
        : type === 'script'
        ? 'Novo Script.js'
        : type === 'report'
        ? 'Novo Relatório'
        : type === 'email'
        ? 'Novo E-mail'
        : 'Terminal';

    const newTab: WorkspaceTab = {
      id,
      title: title || defaultTitle,
      type,
      content,
      isBotExecuting: false,
      createdAt: new Date().toISOString(),
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
    playSound.click(audioEnabled);
    return id;
  }, [audioEnabled]);

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (remaining.length === 0) {
        return [
          {
            id: 'tab-overview',
            title: 'Painel Geral',
            type: 'overview',
            content: '',
            isBotExecuting: false,
            createdAt: new Date().toISOString(),
          },
        ];
      }
      return remaining;
    });

    setActiveTabId((current) => {
      if (current === id) {
        const remaining = tabs.filter((t) => t.id !== id);
        return remaining[remaining.length - 1]?.id || 'tab-overview';
      }
      return current;
    });
  }, [tabs]);

  const updateTabContent = useCallback((id: string, content: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content } : t))
    );
  }, []);

  // Files Management
  const createFile = useCallback((name: string, content: string, type: VirtualFile['type'] = 'markdown'): VirtualFile => {
    const newFile: VirtualFile = {
      id: `file-${Date.now()}`,
      name,
      path: `/workspace/${name.endsWith('.md') ? 'documentos' : name.endsWith('.js') ? 'scripts' : 'arquivos'}/${name}`,
      type,
      size: content.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content,
    };
    setFiles((prev) => [newFile, ...prev]);
    setActiveFileId(newFile.id);
    return newFile;
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, content, size: content.length, updatedAt: new Date().toISOString() }
          : f
      )
    );
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setActiveFileId((curr) => (curr === id ? null : curr));
  }, []);

  const toggleScheduledJob = useCallback((id: string) => {
    setScheduledJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, active: !job.active } : job
      )
    );
  }, []);

  const dismissPipeline = useCallback(() => {
    setPipelinePhase('idle');
    setCurrentRunningTaskId(null);
  }, []);

  const resetAllDefaults = useCallback(() => {
    setFiles(INITIAL_FILES);
    setTabs(INITIAL_TABS);
    setActiveTabId('tab-doc-1');
    setActiveFileId(INITIAL_FILES[0].id);
    setTasks([]);
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: 'Ambiente restaurado para as abas e arquivos padrão.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'done',
      },
    ]);
    setLogs([
      {
        id: 'log-init',
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        level: 'sys',
        message: 'Ambiente restaurado com sucesso.',
      },
    ]);
    localStorage.removeItem('autobot_tabs_v2');
    localStorage.removeItem('autobot_files_v2');
    localStorage.removeItem('autobot_history_v2');
  }, []);

  // Run code safely in terminal
  const runCodeInTerminal = useCallback(async (code: string) => {
    try {
      addLog('bot', 'Executando script no runtime seguro...');
      const res = await fetch('/api/bot/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        data.logs.forEach((l: string) => addLog('sys', l));
        playSound.taskComplete(audioEnabled);
        return { logs: data.logs, durationMs: data.durationMs };
      } else {
        addLog('error', `Falha na execução: ${data.error}`);
        return { logs: [data.error], durationMs: 0 };
      }
    } catch (err: any) {
      addLog('error', `Erro de conexão: ${err.message}`);
      return { logs: [err.message], durationMs: 0 };
    }
  }, [addLog, audioEnabled]);

  // Execute sequence of tasks inside the target tab
  const executeTaskSequence = async (taskList: BotTask[], tabId: string, botSpeech?: string) => {
    for (let i = 0; i < taskList.length; i++) {
      const currentTask = taskList[i];
      setCurrentRunningTaskId(currentTask.id);

      // Update tab state to show bot actively executing
      setTabs((prev) =>
        prev.map((t) =>
          t.id === tabId
            ? { ...t, isBotExecuting: true, botActionDescription: currentTask.title }
            : t
        )
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === currentTask.id ? { ...t, status: 'running', progress: 30 } : t
        )
      );
      playSound.taskStart(audioEnabled);
      addLog('bot', `[ABA ${tabId}] ${currentTask.title}`);

      const duration = Math.max(300, currentTask.estimatedDurationMs || 500);
      await new Promise((r) => setTimeout(r, duration / 2));

      currentTask.logs.forEach((logLine) => {
        addLog('sys', logLine);
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === currentTask.id ? { ...t, progress: 85 } : t
        )
      );

      await new Promise((r) => setTimeout(r, duration / 2));

      setTasks((prev) =>
        prev.map((t) =>
          t.id === currentTask.id ? { ...t, status: 'completed', progress: 100 } : t
        )
      );
      playSound.taskComplete(audioEnabled);
    }

    // Mark tab execution as completed
    setTabs((prev) =>
      prev.map((t) =>
        t.id === tabId
          ? { ...t, isBotExecuting: false, botActionDescription: undefined }
          : t
      )
    );

    setCurrentRunningTaskId(null);
    setPipelinePhase('completed');
    playSound.successFanfare(audioEnabled);

    if (botSpeech) {
      speakBotMessage(botSpeech, voiceEnabled);
    }
  };

  // Main prompt executor (Called from floating bot window or command bar)
  const executePrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const botMsgId = `msg-bot-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // 1. Add user message to chat immediately
    setChatMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: promptText,
        timestamp: nowTime,
      },
      {
        id: botMsgId,
        sender: 'bot',
        text: 'Analisando comando com a IA, criando nova aba e preparando execução...',
        timestamp: nowTime,
        status: 'thinking',
      },
    ]);

    setActivePrompt(promptText);
    setIsProcessing(true);
    setErrorMessage(null);
    setPipelinePhase('ai_planning');
    playSound.click(audioEnabled);

    addLog('info', `Comando recebido na Janela Flutuante: "${promptText}"`);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/bot/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, executionMode: autoExecutionMode ? 'auto' : 'interactive' }),
      });

      if (!response.ok) {
        throw new Error(`Falha no servidor (${response.status})`);
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Resposta inválida do serviço de IA.');
      }

      const {
        title,
        summary,
        generatedContent,
        fileName,
        fileType,
        targetTabType,
        tasks: plannedTasks,
        botSpeechSummary,
      } = result.data;

      // Determine appropriate TabType
      const resolvedTabType: TabType = (targetTabType as TabType) || (
        fileType === 'javascript' ? 'script' : 'document'
      );

      // Create a dedicated new tab for this execution
      const newTabId = `tab-${Date.now()}`;
      const newTab: WorkspaceTab = {
        id: newTabId,
        title: title || fileName || 'Nova Tarefa Executada',
        type: resolvedTabType,
        content: generatedContent,
        isBotExecuting: true,
        botActionDescription: 'Bot inicializando escrita e rotinas...',
        createdAt: new Date().toISOString(),
      };

      // Also persist into virtual filesystem
      const newFile = createFile(fileName || 'documento-bot.md', generatedContent, (fileType as any) || 'markdown');
      newTab.associatedFileId = newFile.id;

      // Add new tab and automatically switch focus to it!
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTabId);

      addLog('success', `Nova aba criada: "${newTab.title}"`);

      // Convert planned tasks to BotTask state
      const initialTasks: BotTask[] = plannedTasks.map((t: any) => ({
        ...t,
        status: 'pending',
        progress: 0,
      }));
      setTasks(initialTasks);

      setCurrentResult({
        title,
        summary,
        file: newFile,
        tabId: newTabId,
        tasks: initialTasks,
        speechSummary: botSpeechSummary,
      });

      // Update bot chat message with link to the tab
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                text: `Pronto! Criei e executei a tarefa na aba "${newTab.title}". O texto foi escrito, formatado e gravado no sistema com ${initialTasks.length} ações concluídas.`,
                status: 'executing',
                targetTabId: newTabId,
                targetTabTitle: newTab.title,
                targetTabType: resolvedTabType,
                tasksCount: initialTasks.length,
                botSpeech: botSpeechSummary,
              }
            : msg
        )
      );

      const totalTime = Date.now() - startTime;
      const historyItem: ExecutionRecord = {
        id: `hist-${Date.now()}`,
        prompt: promptText,
        title,
        summary,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        durationMs: totalTime,
        status: 'success',
        tasksCount: initialTasks.length,
        generatedFileId: newFile.id,
        tabId: newTabId,
        speechText: botSpeechSummary,
      };
      setHistory((prev) => [historyItem, ...prev]);

      if (autoExecutionMode) {
        setPipelinePhase('executing_tasks');
        await executeTaskSequence(initialTasks, newTabId, botSpeechSummary);

        // Mark chat message as fully done
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? { ...msg, status: 'done' }
              : msg
          )
        );
      } else {
        setPipelinePhase('executing_tasks');
        addLog('warn', 'Modo Interativo: Aguardando autorização para as tarefas.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Erro inesperado.');
      setPipelinePhase('error');
      addLog('error', `Falha na orquestração: ${err.message}`);

      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                text: `Desculpe, ocorreu um erro ao executar: ${err.message}`,
                status: 'error',
              }
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const executeStepManually = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === 'completed') return;

    setCurrentRunningTaskId(taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'running', progress: 40 } : t))
    );
    playSound.taskStart(audioEnabled);
    addLog('bot', `[AUTORIZADO] ${task.title}`);

    await new Promise((r) => setTimeout(r, task.estimatedDurationMs || 500));
    task.logs.forEach((log) => addLog('sys', log));

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed', progress: 100 } : t))
    );
    playSound.taskComplete(audioEnabled);
    setCurrentRunningTaskId(null);

    const remaining = tasks.filter((t) => t.id !== taskId && t.status !== 'completed');
    if (remaining.length === 0) {
      setPipelinePhase('completed');
      playSound.successFanfare(audioEnabled);
      if (currentResult?.speechSummary) {
        speakBotMessage(currentResult.speechSummary, voiceEnabled);
      }
    }
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || null;
  const activeFile = files.find((f) => f.id === activeFileId) || null;

  return (
    <BotContext.Provider
      value={{
        tabs,
        activeTabId,
        activeTab,
        setActiveTabId,
        createNewTab,
        closeTab,
        updateTabContent,
        isFloatingBotOpen,
        setIsFloatingBotOpen,
        chatMessages,
        clearChat,
        files,
        activeFile,
        setActiveFileId,
        createFile,
        updateFileContent,
        deleteFile,
        tasks,
        history,
        logs,
        scheduledJobs,
        isProcessing,
        pipelinePhase,
        currentRunningTaskId,
        audioEnabled,
        voiceEnabled,
        autoExecutionMode,
        currentResult,
        activePrompt,
        errorMessage,
        setAudioEnabled,
        setVoiceEnabled,
        setAutoExecutionMode,
        executePrompt,
        executeStepManually,
        runCodeInTerminal,
        addLog,
        clearLogs,
        toggleScheduledJob,
        dismissPipeline,
        resetAllDefaults,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};

export function useBot() {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error('useBot must be used within a BotProvider');
  }
  return context;
}
