
import React, { useState, useRef, useEffect, useMemo } from 'react';
import TeamResourcesTable from './components/TeamResourcesTable';
import LogisticsEquipmentTable from './components/LogisticsEquipmentTable';
import LeadershipLedger from './components/LeadershipLedger';
import { processAssistantQuery } from './services/geminiService';
import { AssistantState, ChatMessage, ProjectResource, LeadershipLog, PerformanceKPIs } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AssistantState>({
    resources: [],
    logs: [],
    kpis: {
      onTimeCompletionRate: 0,
      issueResolutionTime: 0,
      activeIssuesCount: 0,
      resourceUtilization: 0
    }
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'System Initialized. I am your PMBOK execution specialist. How can I help you optimize your resources and team performance today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAssistantOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAssistantOpen(false);
      }
    };
    if (isAssistantOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAssistantOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput('');
    setIsLoading(true);

    const newUserMsg: ChatMessage = {
      role: 'user',
      content: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);

    try {
      const response = await processAssistantQuery(userQuery, state);
      
      const newResources: ProjectResource[] = response.newResources.map((r: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: r.name,
        type: r.type,
        source: r.source,
        role: r.role,
        assignmentStatus: r.assignmentStatus,
        deliveryStatus: r.deliveryStatus,
        assignedDate: new Date().toLocaleDateString()
      }));

      const newLogs: LeadershipLog[] = response.newLogs.map((l: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: l.type,
        description: l.description,
        strategy: l.strategy,
        severity: l.severity,
        mitigationPlan: l.mitigationPlan,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      const updatedKPIs: PerformanceKPIs = {
        ...response.updatedKPIs,
        activeIssuesCount: [...state.logs, ...newLogs].filter(l => l.type === 'Issue').length
      };

      setState(prev => ({
        resources: [...prev.resources, ...newResources],
        logs: [...prev.logs, ...newLogs],
        kpis: updatedKPIs
      }));

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Verification failed. Please ensure resource source and type are specified according to PMBOK 8th Edition standards.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = useMemo(() => {
    if (!searchTerm.trim()) return state.resources;
    const lowerSearch = searchTerm.toLowerCase();
    return state.resources.filter(r => 
      r.name.toLowerCase().includes(lowerSearch) ||
      (r.role?.toLowerCase() || '').includes(lowerSearch) ||
      r.type.toLowerCase().includes(lowerSearch) ||
      (r.assignmentStatus?.toLowerCase() || '').includes(lowerSearch) ||
      (r.deliveryStatus?.toLowerCase() || '').includes(lowerSearch) ||
      r.source.toLowerCase().includes(lowerSearch)
    );
  }, [state.resources, searchTerm]);

  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return state.logs;
    const lowerSearch = searchTerm.toLowerCase();
    return state.logs.filter(l => 
      l.description.toLowerCase().includes(lowerSearch) ||
      l.type.toLowerCase().includes(lowerSearch) ||
      l.strategy.toLowerCase().includes(lowerSearch) ||
      (l.severity?.toLowerCase() || '').includes(lowerSearch) ||
      (l.mitigationPlan?.toLowerCase() || '').includes(lowerSearch)
    );
  }, [state.logs, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-900">
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none -z-10" />

      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-3 sticky top-0 z-50 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">PMBOK Exec <span className="text-indigo-600">Pro</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-1">Enterprise Performance Console</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsAssistantOpen(!isAssistantOpen)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 ${
                isAssistantOpen 
                ? 'bg-indigo-600 text-white shadow-indigo-200' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`relative flex h-2.5 w-2.5 ${isLoading ? 'animate-spin' : ''}`}>
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isAssistantOpen ? 'bg-indigo-200' : 'bg-indigo-500'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAssistantOpen ? 'bg-white' : 'bg-indigo-600'}`}></span>
              </div>
              {isAssistantOpen ? 'Close Agent' : 'AI Assistant'}
            </button>

            {isAssistantOpen && (
              <div className="absolute right-0 mt-3 w-[420px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-300 origin-top-right ring-1 ring-slate-900/5">
                <div className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-lg">Execution Assistant</h3>
                    <button onClick={() => setIsAssistantOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-indigo-100 text-xs font-medium">Supporting Processes 6.3 & 6.4</p>
                </div>

                <div className="h-[480px] overflow-y-auto p-5 space-y-5 bg-slate-50/50 flex flex-col">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
                        msg.role === 'user' 
                        ? 'bg-slate-800 text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                      }`}>
                        {msg.content}
                        <div className={`text-[9px] mt-2 font-bold uppercase tracking-wider opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold ml-1">
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse delay-150"></div>
                      </div>
                      Processing Input...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 space-y-3">
                  <div className="relative group">
                    <input
                      autoFocus
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask or add project data..."
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-sm outline-none transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-20 transition-all shadow-md active:scale-90"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setInput("Acquire: Mark Lin, QA Lead, Internal, Assigned")} className="text-[10px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg font-bold border border-indigo-100 uppercase transition-all">+ Human</button>
                    <button type="button" onClick={() => setInput("Acquire: Cloud Server 2, External, Delivered")} className="text-[10px] bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg font-bold border border-amber-100 uppercase transition-all">+ Physical</button>
                    <button type="button" onClick={() => setInput("Log Action: Resolved team scheduling conflict using compromise strategy.")} className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg font-bold border border-emerald-100 uppercase transition-all">+ Leadership</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Execution <span className="text-indigo-600">Console</span></h2>
              <p className="text-slate-500 font-medium text-lg italic max-w-xl">Unified monitoring for resource acquisition and team leadership dynamics.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 min-w-[180px] hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Team</div>
                  <div className="text-3xl font-black text-slate-900 leading-none mt-1">{state.resources.filter(r => r.type === 'Human').length}</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 min-w-[180px] hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inventory</div>
                  <div className="text-3xl font-black text-slate-900 leading-none mt-1">{state.resources.filter(r => r.type === 'Physical').length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Dashboard Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Completion Rate
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{state.kpis.onTimeCompletionRate}%</span>
                  <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">On-Time</span>
                </div>
                <div className="mt-4 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${state.kpis.onTimeCompletionRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Resolution Avg
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{state.kpis.issueResolutionTime}h</span>
                  <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">MTTR</span>
                </div>
                <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mean Time to Resolution</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  Risk Exposure
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{state.kpis.activeIssuesCount}</span>
                  <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Active Issues</span>
                </div>
                <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unresolved Team Barriers</p>
              </div>
            </div>
          </div>

          <div className="mb-12 relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors">
              <svg className="h-6 w-6 text-slate-300 group-focus-within:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter dashboard by name, role, severity level, or technique..."
              className="block w-full pl-16 pr-6 py-5 border-none rounded-[2rem] bg-white shadow-lg shadow-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all text-xl font-medium placeholder-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 gap-12">
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TeamResourcesTable resources={filteredResources} />
            </section>
            
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <LogisticsEquipmentTable resources={filteredResources} />
            </section>
            
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <LeadershipLedger logs={filteredLogs} />
            </section>
          </div>

          <footer className="mt-24 text-center text-slate-400 text-xs border-t border-slate-200/60 pt-10 pb-16">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6 opacity-60">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 <span className="font-bold uppercase tracking-tighter">Process 6.3: Acquire Resources</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <span className="font-bold uppercase tracking-tighter">Process 6.4: Lead Team</span>
               </div>
            </div>
            <p className="font-bold tracking-widest uppercase text-[10px] mb-2">Project Execution Assistant Pro</p>
            <p className="opacity-40 italic">Built with Gemini AI &bull; Integrated Dashboard v8.2.1</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
