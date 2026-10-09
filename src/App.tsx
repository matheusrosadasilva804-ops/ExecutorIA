/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BotProvider } from './context/BotContext';
import { WorkspaceTabBar } from './components/WorkspaceTabBar';
import { TabContentViewer } from './components/TabContentViewer';
import { FloatingBotWindow } from './components/FloatingBotWindow';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <BotProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
        {/* Top App Header */}
        <header className="border-b border-slate-800 bg-slate-950/80 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-sm font-bold text-white tracking-tight">AutoBot IA</h1>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Sistema de Abas & Robô Flutuante
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 hidden md:flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Peça na janela flutuante ➔ O robô executa nas abas</span>
            </span>
          </div>
        </header>

        {/* Workspace Multi-Tab Bar */}
        <WorkspaceTabBar />

        {/* Active Tab Main Screen */}
        <main className="flex-1 bg-slate-950 overflow-hidden flex flex-col">
          <TabContentViewer />
        </main>

        {/* Requested Floating Bot Window Assistant */}
        <FloatingBotWindow />
      </div>
    </BotProvider>
  );
}
