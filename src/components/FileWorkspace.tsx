import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import {
  FileText,
  FileCode,
  Folder,
  Download,
  Copy,
  Check,
  Play,
  Trash2,
  Plus,
  Eye,
  Edit3,
  Search,
  Clock,
  Sparkles,
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const FileWorkspace: React.FC = () => {
  const {
    files,
    activeFile,
    setActiveFileId,
    createFile,
    updateFileContent,
    deleteFile,
    runCodeInTerminal,
    audioEnabled,
  } = useBot();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [copied, setCopied] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    playSound.click(audioEnabled);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
    playSound.click(audioEnabled);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const cleanName = newFileName.trim();
    const type = cleanName.endsWith('.js')
      ? 'javascript'
      : cleanName.endsWith('.json')
      ? 'json'
      : 'markdown';
    createFile(cleanName, `# ${cleanName}\n\nArquivo criado manualmente no sistema.\n`, type);
    setNewFileName('');
    setIsCreatingNew(false);
  };

  // Simple statistics
  const wordCount = activeFile?.content ? activeFile.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTimeMin = Math.ceil(wordCount / 200);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px]">
      {/* Left Sidebar: Virtual File Tree */}
      <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg backdrop-blur-md">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200">
              Workspace Filesystem ({files.length})
            </span>
          </div>

          <button
            onClick={() => setIsCreatingNew(true)}
            className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 hover:text-white transition-all text-xs flex items-center gap-1 border border-indigo-500/20"
            title="Criar novo arquivo"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-2.5 border-b border-slate-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar arquivos no workspace..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>

        {/* New File Input Modal / Inline Form */}
        {isCreatingNew && (
          <form onSubmit={handleCreateNew} className="p-3 bg-slate-950 border-b border-indigo-500/30 space-y-2">
            <div className="text-[11px] font-semibold text-indigo-400">Novo Arquivo no Workspace</div>
            <input
              type="text"
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Ex: documento.md, rotina.js"
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-400"
            />
            <div className="flex items-center justify-end space-x-1.5">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-2 py-1 text-[11px] rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500"
              >
                Criar
              </button>
            </div>
          </form>
        )}

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y-0">
          {filteredFiles.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              Nenhum arquivo encontrado.
            </div>
          ) : (
            filteredFiles.map((file) => {
              const isActive = activeFile?.id === file.id;
              const isMd = file.name.endsWith('.md');
              const isJs = file.name.endsWith('.js');

              return (
                <div
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-indigo-950/40 border-indigo-500/40 text-white shadow-sm'
                      : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    {isMd ? (
                      <FileText className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    ) : isJs ? (
                      <FileCode className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-amber-500/60'}`} />
                    ) : (
                      <Folder className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {Math.round(file.size / 1024 * 10) / 10} KB • {new Date(file.updatedAt).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remover "${file.name}" do workspace?`)) {
                        deleteFile(file.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                    title="Excluir arquivo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Content Pane: File Viewer & Editor */}
      <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg backdrop-blur-md">
        {activeFile ? (
          <>
            {/* Toolbar */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-100 font-mono truncate">
                  {activeFile.path}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {wordCount} palavras • ~{readTimeMin} min
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1.5">
                {/* Switch Preview / Edit */}
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

                {/* If script, button to execute */}
                {activeFile.name.endsWith('.js') && (
                  <button
                    onClick={() => runCodeInTerminal(activeFile.content)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium transition-all"
                    title="Executar script no console do bot"
                  >
                    <Play className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Executar</span>
                  </button>
                )}

                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Copiar conteúdo"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Baixar arquivo"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40">
              {viewMode === 'preview' ? (
                <div className="prose prose-invert prose-slate max-w-none text-slate-200 space-y-3 font-sans text-sm leading-relaxed">
                  {renderMarkdownPreview(activeFile.content)}
                </div>
              ) : (
                <textarea
                  value={activeFile.content}
                  onChange={(e) => updateFileContent(activeFile.id, e.target.value)}
                  className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 resize-none leading-relaxed"
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <Folder className="w-12 h-12 stroke-[1.5] text-slate-700 mb-2" />
            <p className="text-sm font-medium text-slate-400">Nenhum arquivo selecionado</p>
            <p className="text-xs text-slate-600 mt-1">Selecione um arquivo à esquerda ou peça para a IA criar um novo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Clean custom Markdown renderer for rich reading without heavyweight parser bugs
function renderMarkdownPreview(raw: string) {
  const lines = raw.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let tableBuffer: string[] = [];

  const flushTable = (key: string) => {
    if (tableBuffer.length === 0) return null;
    const rows = [...tableBuffer];
    tableBuffer = [];
    return (
      <div key={key} className="overflow-x-auto my-3 rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-xs text-slate-300">
          <tbody className="divide-y divide-slate-850">
            {rows.map((row, rIdx) => {
              const cells = row.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
              const isHeader = rIdx === 0;
              if (row.includes('---')) return null;
              return (
                <tr key={rIdx} className={isHeader ? 'bg-slate-900/90 font-semibold text-slate-100' : 'hover:bg-slate-900/40'}>
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 whitespace-pre-wrap">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  lines.forEach((line, index) => {
    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${index}`} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-inner">
            <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Código Gerado</span>
            </div>
            <pre className="p-3 text-emerald-400 overflow-x-auto">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      tableBuffer.push(line);
      return;
    } else if (tableBuffer.length > 0) {
      const renderedTable = flushTable(`table-${index}`);
      if (renderedTable) elements.push(renderedTable);
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-xl sm:text-2xl font-extrabold text-white tracking-tight pb-2 border-b border-slate-800/80">
          {line.replace('# ', '')}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-slate-100 mt-4 mb-2">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-sm font-semibold text-indigo-300 mt-3 mb-1">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-2 border-indigo-500 pl-3 py-1 italic text-slate-300 bg-indigo-950/20 rounded-r text-xs">
          {line.replace('> ', '')}
        </blockquote>
      );
    } else if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
      const checked = line.startsWith('- [x] ');
      elements.push(
        <div key={index} className="flex items-center space-x-2 text-xs py-0.5">
          <input type="checkbox" checked={checked} readOnly className="rounded text-indigo-600 bg-slate-900 border-slate-700" />
          <span className={checked ? 'line-through text-slate-500' : 'text-slate-300'}>
            {line.replace(/- \[[ x]\] /, '')}
          </span>
        </div>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={index} className="text-xs text-slate-300 ml-4 list-disc py-0.5">
          {line.replace(/^[-*] /, '')}
        </li>
      );
    } else if (line.trim() === '---') {
      elements.push(<hr key={index} className="border-slate-800 my-3" />);
    } else if (line.trim() !== '') {
      elements.push(
        <p key={index} className="text-xs text-slate-300 leading-relaxed">
          {line}
        </p>
      );
    }
  });

  if (tableBuffer.length > 0) {
    const renderedTable = flushTable('table-end');
    if (renderedTable) elements.push(renderedTable);
  }

  return elements;
}
