/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Calendar,
  DollarSign,
  MessageSquare,
  FileText,
  Mic,
  PlusCircle,
  ChevronDown,
  Check
} from 'lucide-react';
import { EventPlan, CurrencyCode } from '../types';
import { CURRENCY_SYMBOLS } from '../utils/formatters';

interface NavbarProps {
  events: EventPlan[];
  activeEvent: EventPlan;
  onSelectEvent: (event: EventPlan) => void;
  onOpenNewEventModal: () => void;
  onOpenConcierge: () => void;
  onOpenSpeechModal: () => void;
  onOpenExportModal: () => void;
  currency: CurrencyCode;
  onChangeCurrency: (curr: CurrencyCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onOpenNewEventModal,
  onOpenConcierge,
  onOpenSpeechModal,
  onOpenExportModal,
  currency,
  onChangeCurrency
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[1.5px] flex items-center justify-center shadow-lg shadow-rose-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-base sm:text-lg bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 bg-clip-text text-transparent">
                Occasio AI
              </span>
              <span className="hidden md:inline-flex items-center text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Event & Celebration Architect</p>
          </div>
        </div>

        {/* Event Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-xs sm:text-sm font-medium text-slate-200 transition-colors max-w-[200px] sm:max-w-[280px]"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            aria-label="Switch celebration event"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{activeEvent.title}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
          </button>

          {dropdownOpen && (
            <div 
              role="listbox" 
              className="absolute left-0 mt-2 w-72 sm:w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs"
            >
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Active Event
              </div>
              {events.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => {
                    onSelectEvent(ev);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left flex items-start gap-2.5 hover:bg-slate-800/80 transition-colors ${
                    ev.id === activeEvent.id ? 'bg-indigo-500/10 text-indigo-300' : 'text-slate-200'
                  }`}
                  role="option"
                  aria-selected={ev.id === activeEvent.id}
                >
                  <div className="mt-0.5">
                    {ev.id === activeEvent.id ? (
                      <Check className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{ev.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {ev.city} • {ev.guestCount} guests • ${ev.totalBudget.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
              <div className="border-t border-slate-800 mt-1 pt-1 px-2">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenNewEventModal();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors font-medium"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create / Generate New Event</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
              className="appearance-none bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold rounded-lg pl-2 pr-6 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              aria-label="Select currency"
            >
              {currencies.map(c => (
                <option key={c} value={c}>
                  {c} ({CURRENCY_SYMBOLS[c]})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2.5 pointer-events-none" />
          </div>

          {/* AI Co-Planner Concierge Button */}
          <button
            onClick={onOpenConcierge}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            aria-label="Open AI Co-Planner Concierge"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Concierge</span>
          </button>

          {/* AI Speech Writer Button */}
          <button
            onClick={onOpenSpeechModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all active:scale-95"
            title="Generate AI Speeches, Vows & Toasts"
            aria-label="AI Speech & Toast Writer"
          >
            <Mic className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden lg:inline">Speech Writer</span>
          </button>

          {/* Print / Export Dossier Button */}
          <button
            onClick={onOpenExportModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            title="Print Ready Dossier & Data Mobility"
            aria-label="Print or Export Dossier"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline ml-1.5">Dossier / Export</span>
          </button>

          {/* New Event Wizard Button */}
          <button
            onClick={onOpenNewEventModal}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-all active:scale-95"
            aria-label="Create New Celebration Plan"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Plan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
