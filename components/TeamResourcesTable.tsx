
import React from 'react';
import { ProjectResource } from '../types';

interface Props {
  resources: ProjectResource[];
}

const TeamResourcesTable: React.FC<Props> = ({ resources }) => {
  const humanResources = resources.filter(r => r.type === 'Human');

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Assigned':
        return (
          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Onboarding':
        return (
          <svg className="w-3 h-3 mr-1.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-50 bg-gradient-to-r from-blue-50/50 to-transparent flex items-center justify-between">
        <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          Team Allocation
        </h3>
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full ring-1 ring-blue-100">Process 6.3</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30">
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Member</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Expertise / Role</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Origin</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Assigned Date</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {humanResources.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center text-slate-300 font-medium italic text-lg">No active team assignments.</td>
              </tr>
            ) : (
              humanResources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 uppercase group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {res.name.charAt(0)}
                      </div>
                      <span className="text-base font-bold text-slate-800 tracking-tight">{res.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">{res.role || 'Unspecified'}</td>
                  <td className="px-8 py-6 text-sm">
                    <span className={`font-bold ${res.source === 'Internal' ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {res.source}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 group-hover:bg-white group-hover:border-blue-200 transition-colors">
                      <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-600 font-bold tabular-nums text-xs">{res.assignedDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border transition-all ${
                      res.assignmentStatus === 'Assigned' ? 'bg-emerald-500 text-white border-emerald-400' :
                      res.assignmentStatus === 'Onboarding' ? 'bg-amber-400 text-white border-amber-300' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {getStatusIcon(res.assignmentStatus)}
                      {res.assignmentStatus || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamResourcesTable;
