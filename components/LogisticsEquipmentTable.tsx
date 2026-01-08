
import React from 'react';
import { ProjectResource } from '../types';

interface Props {
  resources: ProjectResource[];
}

const LogisticsEquipmentTable: React.FC<Props> = ({ resources }) => {
  const physicalResources = resources.filter(r => r.type === 'Physical');

  const getDeliveryIcon = (status?: string) => {
    if (status === 'Delivered') {
      return (
        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-50 bg-gradient-to-r from-amber-50/50 to-transparent flex items-center justify-between">
        <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          Logistics & Material
        </h3>
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-full ring-1 ring-amber-100">Process 6.3</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30">
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Resource Item</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Vendor / Source</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Acquisition Date</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Logistics Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {physicalResources.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-slate-300 font-medium italic text-lg">No materials acquired.</td>
              </tr>
            ) : (
              physicalResources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="text-base font-bold text-slate-800 tracking-tight">{res.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">{res.source}</td>
                  <td className="px-8 py-6 text-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 transition-colors">
                      <svg className="w-3.5 h-3.5 text-amber-500 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-bold tabular-nums text-xs">{res.assignedDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border transition-all ${
                        res.deliveryStatus === 'Delivered' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-rose-500 text-white border-rose-400'
                      }`}>
                        {getDeliveryIcon(res.deliveryStatus)}
                        {res.deliveryStatus || 'Not Delivered'}
                      </span>
                    </div>
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

export default LogisticsEquipmentTable;
