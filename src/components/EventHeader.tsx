/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Sparkles,
  Edit3,
  LayoutDashboard,
  Wallet,
  CalendarDays,
  Store,
  UserCheck,
  Palette,
  ShieldAlert,
  PlayCircle
} from 'lucide-react';
import { EventPlan, CurrencyCode } from '../types';
import {
  formatCurrency,
  calculateDaysRemaining,
  getCountdownLabel,
  computeBudgetSummary,
  computeMilestoneStats,
  computeGuestStats
} from '../utils/formatters';

export type ActiveTab = 
  | 'dashboard'
  | 'budget'
  | 'timeline'
  | 'vendors'
  | 'guests'
  | 'ideas'
  | 'contingency'
  | 'live_mode';

interface EventHeaderProps {
  event: EventPlan;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenEditModal: () => void;
  currency: CurrencyCode;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  activeTab,
  onSelectTab,
  onOpenEditModal,
  currency
}) => {
  const daysLeft = calculateDaysRemaining(event.targetDate);
  const countdown = getCountdownLabel(daysLeft);
  const budgetSummary = computeBudgetSummary(event.budgetItems, event.totalBudget);
  const milestoneStats = computeMilestoneStats(event.milestones);
  const guestStats = computeGuestStats(event.guests);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'budget', label: 'Budget & Cost Optimizer', icon: <Wallet className="w-4 h-4" />, badge: `${budgetSummary.percentUsed}%` },
    { id: 'timeline', label: 'Milestones & Day-Of', icon: <CalendarDays className="w-4 h-4" />, badge: `${milestoneStats.completed}/${milestoneStats.total}` },
    { id: 'vendors', label: 'Vendors & AI RFP', icon: <Store className="w-4 h-4" />, badge: event.vendors.length },
    { id: 'guests', label: 'Guests & Table Cluster', icon: <UserCheck className="w-4 h-4" />, badge: `${guestStats.confirmedHeadcount}` },
    { id: 'ideas', label: 'Creative Direction', icon: <Palette className="w-4 h-4" /> },
    { id: 'contingency', label: 'Contingency & Weather', icon: <ShieldAlert className="w-4 h-4" />, badge: event.contingencyPlans.length },
    { id: 'live_mode', label: 'Live Day-Of Mode', icon: <PlayCircle className="w-4 h-4 text-emerald-400" /> }
  ];

  const eventTypeTheme = {
    wedding: 'from-rose-500/10 via-amber-500/5 to-slate-900',
    birthday: 'from-fuchsia-500/10 via-cyan-500/5 to-slate-900',
    community: 'from-emerald-500/10 via-amber-500/5 to-slate-900',
    corporate: 'from-blue-500/10 via-indigo-500/5 to-slate-900',
    anniversary: 'from-amber-500/10 via-purple-500/5 to-slate-900'
  }[event.eventType] || 'from-indigo-500/10 to-slate-900';

  return (
    <div className={`border-b border-slate-800 bg-gradient-to-b ${eventTypeTheme} pt-8 pb-2 text-slate-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {event.eventType.toUpperCase()}
              </span>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                countdown.urgency === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                  : countdown.urgency === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                <Clock className="w-3 h-3" />
                {countdown.text}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {event.title}
              </h1>
              <button
                onClick={onOpenEditModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Edit event details"
                aria-label="Edit event details"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {new Date(event.targetDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} at {event.startTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {event.venueName}, {event.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                {event.guestCount} target attendees
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-3xl italic">
              Aesthetic Vibe: "{event.aestheticStyle}"
            </p>
          </div>

          {/* KPI Snapshot Cards */}
          <div className="grid grid-cols-3 gap-3 min-w-[300px] sm:min-w-[400px]">
            {/* Budget Meter */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Budget Committed</span>
              <div className="mt-1">
                <span className="text-base sm:text-lg font-bold text-white">
                  {formatCurrency(budgetSummary.actualTotal, currency)}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  of {formatCurrency(event.totalBudget, currency)}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    budgetSummary.isOverBudget ? 'bg-rose-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(budgetSummary.percentUsed, 100)}%` }}
                />
              </div>
            </div>

            {/* Milestones Meter */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Milestones</span>
              <div className="mt-1">
                <span className="text-base sm:text-lg font-bold text-white">
                  {milestoneStats.progressPercent}%
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {milestoneStats.completed} of {milestoneStats.total} done
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${milestoneStats.progressPercent}%` }}
                />
              </div>
            </div>

            {/* RSVPs Meter */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">RSVP Headcount</span>
              <div className="mt-1">
                <span className="text-base sm:text-lg font-bold text-white">
                  {guestStats.confirmedHeadcount}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  of {event.guestCount} target
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${Math.min(Math.round((guestStats.confirmedHeadcount / event.guestCount) * 100), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Strip */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none" aria-label="Event Sections">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
