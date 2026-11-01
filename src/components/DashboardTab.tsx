/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Wallet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  Store,
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Calendar
} from 'lucide-react';
import { EventPlan, CurrencyCode } from '../types';
import {
  formatCurrency,
  computeBudgetSummary,
  computeMilestoneStats,
  computeGuestStats,
  computeVendorStats
} from '../utils/formatters';
import { ActiveTab } from './EventHeader';

interface DashboardTabProps {
  event: EventPlan;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenConcierge: () => void;
  currency: CurrencyCode;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  event,
  onNavigateTab,
  onOpenConcierge,
  currency
}) => {
  const budgetSummary = computeBudgetSummary(event.budgetItems, event.totalBudget);
  const milestoneStats = computeMilestoneStats(event.milestones);
  const guestStats = computeGuestStats(event.guests);
  const vendorStats = computeVendorStats(event.vendors);

  // High priority pending milestones
  const urgentMilestones = event.milestones
    .filter(m => !m.completed && m.priority === 'high')
    .slice(0, 3);

  // Next up in run-of-show
  const upcomingSchedule = event.dayOfSchedule.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Banner Alert if Overbudget or Critical Milestones Pending */}
      {budgetSummary.isOverBudget && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Budget Cap Exceeded</p>
              <p className="text-xs text-rose-300/80">
                Current committed costs exceed target cap by {formatCurrency(Math.abs(budgetSummary.remainingBudget), currency)}. Use the AI Cost Optimizer to identify immediate trade-offs.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('budget')}
            className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-medium px-3 py-1.5 rounded-lg shrink-0 transition-colors"
          >
            Optimize Budget
          </button>
        </div>
      )}

      {/* Grid of Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Budget Cap */}
        <div 
          onClick={() => onNavigateTab('budget')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Budget</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(event.totalBudget, currency)}
            </span>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>Spent: {formatCurrency(budgetSummary.actualTotal, currency)}</span>
              <span className={budgetSummary.isOverBudget ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                {budgetSummary.isOverBudget ? 'Over Cap' : `${formatCurrency(budgetSummary.remainingBudget, currency)} left`}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Milestones */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Milestone Progress</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white tracking-tight">
              {milestoneStats.completed} / {milestoneStats.total}
            </span>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>{milestoneStats.progressPercent}% completed</span>
              <span className="text-amber-400 font-medium">{milestoneStats.highPriorityPending} high priority</span>
            </div>
          </div>
        </div>

        {/* Card 3: Guests & RSVPs */}
        <div 
          onClick={() => onNavigateTab('guests')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">RSVP Attendance</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white tracking-tight">
              {guestStats.confirmedHeadcount} <span className="text-sm font-normal text-slate-400">/ {event.guestCount}</span>
            </span>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>{guestStats.pendingHeadcount} pending reply</span>
              <span className="text-cyan-400">{guestStats.confirmationRate}% confirmed</span>
            </div>
          </div>
        </div>

        {/* Card 4: Vendors & Contracts */}
        <div 
          onClick={() => onNavigateTab('vendors')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Suppliers Locked</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white tracking-tight">
              {vendorStats.bookedAndLocked} <span className="text-sm font-normal text-slate-400">/ {vendorStats.total}</span>
            </span>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>Deliverables: {vendorStats.deliverablesPercent}%</span>
              <span className="text-slate-400">{vendorStats.quoted} in quotes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Urgent Milestones & Run-of-Show */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Actionable Milestones */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-white">Priority Roadmap Tasks</h2>
                <p className="text-xs text-slate-400 mt-0.5">High-priority milestones requiring immediate attention</p>
              </div>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View Full Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {urgentMilestones.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">All High Priority Milestones Complete!</p>
                  <p className="text-xs text-slate-400 mt-1">Great job! Your celebration roadmap is on track.</p>
                </div>
              ) : (
                urgentMilestones.map(m => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{m.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Category: {m.category} • Assigned to: {m.assignedTo || 'Lead'} • Due: {m.dueDate}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      High Priority
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Run-of-Show Preview */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-white">Day-of Run-of-Show (Minute-by-Minute)</h2>
                <p className="text-xs text-slate-400 mt-0.5">Chronological itinerary for vendors and on-site coordinators</p>
              </div>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingSchedule.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-xs font-bold shrink-0">
                    {item.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">{item.activity}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      📍 {item.location} • Lead: <span className="text-indigo-300 font-medium">{item.teamLead}</span>
                    </p>
                    {item.notes && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Co-Planner & Creative Quick Peek */}
        <div className="space-y-6">
          {/* AI Co-Planner Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900/90 border border-indigo-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Occasio AI Concierge</h3>
                <p className="text-[11px] text-indigo-200/80">Active Context: {event.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Have questions about weather backup plans, vendor tipping etiquette, seating charts, or playlist timing? Ask your dedicated AI co-planner.
            </p>

            <button
              onClick={onOpenConcierge}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
            >
              <span>Chat with AI Co-Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Palette Sneak Peek */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Event Color Palette
              </h3>
              <button
                onClick={() => onNavigateTab('ideas')}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Inspiration Tab
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {event.personalizedIdeas.colorPalette.map((color, i) => (
                <div key={i} className="flex-1 text-center group">
                  <div
                    className="h-10 rounded-lg shadow-inner border border-slate-700/60 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.hex})`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1 truncate font-mono">
                    {color.hex}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Theme: <span className="text-slate-200 font-medium">{event.personalizedIdeas.themeName}</span>
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Instant Action Shortcuts
            </h4>
            <button
              onClick={() => onNavigateTab('budget')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                Run AI Cost Optimizer
              </span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
            <button
              onClick={() => onNavigateTab('vendors')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-cyan-400" />
                Draft Vendor Inquiry RFP
              </span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
            <button
              onClick={() => onNavigateTab('contingency')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Weather & Contingency Matrix
              </span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
