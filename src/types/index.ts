export type TaskType = 
  | 'create_file' 
  | 'execute_script' 
  | 'format_document' 
  | 'data_analysis' 
  | 'notification' 
  | 'schedule_task';

export interface BotTask {
  id: string;
  title: string;
  type: TaskType;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  estimatedDurationMs: number;
  progress: number;
  logs: string[];
  parameters?: {
    filePath?: string;
    action?: string;
    codeSnippet?: string;
    outputExpected?: string;
  };
}

export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  content: string;
  type: 'markdown' | 'javascript' | 'python' | 'json' | 'text';
  size: number;
  createdAt: string;
  updatedAt: string;
}

export type TabType = 'document' | 'script' | 'report' | 'email' | 'terminal' | 'overview';

export interface WorkspaceTab {
  id: string;
  title: string;
  type: TabType;
  content: string;
  isBotExecuting: boolean;
  botActionDescription?: string;
  createdAt: string;
  associatedFileId?: string;
  metadata?: {
    subject?: string;
    recipient?: string;
    scriptLogs?: string[];
    tableHeaders?: string[];
    tableRows?: string[][];
    status?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  targetTabId?: string;
  targetTabTitle?: string;
  targetTabType?: TabType;
  tasksCount?: number;
  status?: 'thinking' | 'executing' | 'done' | 'error';
  botSpeech?: string;
}

export interface ExecutionRecord {
  id: string;
  prompt: string;
  title: string;
  summary: string;
  timestamp: string;
  durationMs: number;
  status: 'success' | 'running' | 'failed';
  tasksCount: number;
  generatedFileId?: string;
  speechText?: string;
  tabId?: string;
}

export interface ScheduledAutomation {
  id: string;
  name: string;
  cronExpr: string;
  description: string;
  active: boolean;
  lastRun?: string;
  nextRun: string;
  targetTaskPrompt: string;
}

export interface BotLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'bot' | 'sys' | 'success' | 'warn' | 'error';
  message: string;
}
