/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PlayCircle,
  Clock,
  MapPin,
  User,
  Phone,
  AlertOctagon,
  CheckCircle2,
  Volume2,
  Sparkles,
  Radio
} from 'lucide-react';
import { EventPlan, DayOfScheduleItem } from '../types';

interface LiveModeTabProps {
  event: EventPlan;
}

export const LiveModeTab: React.FC<LiveModeTabProps> = ({ event }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const schedule = event.dayOfSchedule;
  const currentActivity = schedule[0] || null;
  const nextActivity = schedule[1] || null;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Live Day-Of Stage Mode</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time on-site coordination console for leads, MCs, and floor directors.
            </p>
          </div>
        </div>

        {/* Digital Ticker Clock */}
        <div className="text-right bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">LOCAL VENUE TIME</span>
          <span className="text-2xl font-bold text-amber-300 tracking-tight">{timeString}</span>
        </div>
      </div>

      {/* Primary Stage Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Active Phase */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              CURRENT FOCUS STAGE
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {currentActivity?.time || 'Pending'}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {currentActivity?.activity || 'Setup & Preparation'}
            </h3>
            <p className="text-xs text-slate-300">
              📍 Location: <span className="font-semibold text-white">{currentActivity?.location}</span>
            </p>
            <p className="text-xs text-slate-300">
              👤 On-Site Lead: <span className="font-semibold text-indigo-300">{currentActivity?.teamLead}</span>
            </p>
            {currentActivity?.notes && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 italic mt-3">
                "{currentActivity?.notes}"
              </div>
            )}
          </div>
        </div>

        {/* Next Up Phase */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              UP NEXT (QUEUE)
            </span>
            <span className="text-xs font-mono text-slate-300">
              {nextActivity?.time || 'End of Schedule'}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-200">
              {nextActivity?.activity || 'Conclude & Clean Down'}
            </h3>
            <p className="text-xs text-slate-400">
              📍 Location: {nextActivity?.location}
            </p>
            <p className="text-xs text-slate-400">
              👤 Lead: {nextActivity?.teamLead}
            </p>
            {nextActivity?.notes && (
              <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800 text-xs text-slate-400 italic mt-3">
                "{nextActivity?.notes}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Vendor Speed Dial Hotline */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-white">Emergency On-Site Vendor Contact Cards</h3>
          </div>
          <span className="text-xs text-slate-400">One-tap telephone access</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {event.vendors.map(v => (
            <div
              key={v.id}
              className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-[10px] text-slate-400 block truncate">{v.category}</span>
                <h4 className="text-xs font-bold text-white truncate">{v.name}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">{v.contactName}</p>
              </div>

              <a
                href={`tel:${v.phone}`}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Call {v.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
