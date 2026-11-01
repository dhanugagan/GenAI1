/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Upload,
  X,
  CheckCircle2,
  Calendar,
  DollarSign,
  Users,
  MapPin
} from 'lucide-react';
import { EventPlan, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
  onImportEvent: (imported: EventPlan) => void;
  currency: CurrencyCode;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  event,
  onImportEvent,
  currency
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(event, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (eventReader) => {
      try {
        const parsed = JSON.parse(eventReader.target?.result as string);
        if (parsed.id && parsed.title && parsed.budgetItems) {
          onImportEvent(parsed as EventPlan);
          onClose();
        } else {
          alert('Invalid event plan JSON file format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="export-modal-title" className="text-base font-bold text-white">
                Print-Ready Dossier & Data Mobility
              </h3>
              <p className="text-xs text-slate-400">
                Generate coordinator binders, download backup JSON, or import shared event plans.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-xs text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Mobility Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Action 1: Print Dossier */}
          <button
            onClick={handlePrint}
            className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-left transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 w-fit">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-indigo-300">
                Print Dossier / PDF
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Formatted physical binder layout for venue staff & day-of leads.
              </p>
            </div>
          </button>

          {/* Action 2: Export JSON */}
          <button
            onClick={handleExportJson}
            className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-left transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 w-fit">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                Backup JSON Export
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Download full plan state, line items, and contacts to disk.
              </p>
            </div>
          </button>

          {/* Action 3: Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-left transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 w-fit">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                Import JSON Plan
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Restore or transfer an event blueprint from another planner.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </button>
        </div>

        {/* Dossier Preview Summary */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Dossier Snapshot: {event.title}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Date</span>
              <span>{event.targetDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Location</span>
              <span>{event.city}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Budget Cap</span>
              <span>{formatCurrency(event.totalBudget, currency)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Guest Count</span>
              <span>{event.guestCount} guests</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            Includes: {event.budgetItems.length} budget line items, {event.milestones.length} milestone deadlines, {event.dayOfSchedule.length} run-of-show timestamps, {event.vendors.length} supplier contacts, and {event.contingencyPlans.length} contingency protocols.
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
