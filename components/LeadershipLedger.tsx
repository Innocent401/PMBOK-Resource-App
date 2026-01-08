
import React from 'react';
import { LeadershipLog } from '../types';

interface Props {
  logs: LeadershipLog[];
}

const LeadershipLedger: React.FC<Props> = ({ logs }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-50 bg-gradient-to-r from-emerald-50/50 to-transparent flex items-center justify-between">
        <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          Leadership Ledger
        </h3>
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full ring-1 ring-emerald-100">Process 6.4</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30">
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Type</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Severity</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Context / Observation</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Management Strategy</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Mitigation Plan</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center text-slate-300 font-medium italic text-lg">No leadership entries recorded.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-all group align-top">
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight whitespace-nowrap ${
                      log.type === 'Issue' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm whitespace-nowrap ${
                      log.severity === 'High' ? 'bg-rose-600 text-white' :
                      log.severity === 'Medium' ? 'bg-amber-400 text-white' :
                      'bg-indigo-500 text-white'
                    }`}>
                      {log.severity || 'Low'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-700 min-w-[200px] max-w-sm leading-relaxed">{log.description}</td>
                  <td className="px-8 py-6 text-sm">
                    <div className="text-slate-500 font-medium italic bg-slate-50 rounded-xl p-3 border border-slate-100 whitespace-normal min-w-[150px]">
                      {log.strategy}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <div className="text-slate-600 text-xs leading-relaxed font-medium bg-slate-50 rounded-xl p-4 border border-slate-100 whitespace-pre-wrap min-w-[250px] max-w-md">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-200 pb-1">Action Steps</div>
                      {log.mitigationPlan}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-black text-slate-300 font-mono tracking-tighter uppercase whitespace-nowrap">{log.timestamp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadershipLedger;
