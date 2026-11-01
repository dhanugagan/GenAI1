/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  CloudRain,
  Zap,
  Truck,
  DollarSign,
  HeartPulse,
  Leaf,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw
} from 'lucide-react';
import { EventPlan, ContingencyPlan } from '../types';

interface ContingencyTabProps {
  event: EventPlan;
}

export const ContingencyTab: React.FC<ContingencyTabProps> = ({ event }) => {
  const [simulatedScenario, setSimulatedScenario] = useState<string | null>(null);

  // Carbon footprint calculator (approx 12 kg CO2 per guest for regional events)
  const estimatedCarbonKg = Math.round(event.guestCount * 14.5);
  const treesToOffset = Math.ceil(estimatedCarbonKg / 22);

  const scenarios = [
    {
      id: 'rain',
      title: 'Sudden 90% Precipitation Downpour',
      icon: <CloudRain className="w-4 h-4 text-cyan-400" />,
      playbook: [
        'Engage marquee canopy supplier 48 hours prior for weather-tight sidewalls.',
        'Stage 50 clear umbrellas at guest arrival valet station.',
        'Move outdoor acoustic ceremony to glasshouse covered rotunda.',
        'Deploy heavy rubber cable ramps over saturated lawn walkways.'
      ]
    },
    {
      id: 'power',
      title: 'Main Sound Rig / Generator Breaker Trip',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      playbook: [
        'Switch DJ microphone to portable battery-powered PA speaker on stage right.',
        'Dedicated tech coordinator checks external breaker panel (Zone 3).',
        'Direct venue hospitality to illuminate backup hurricane candles and battery fairy lights.'
      ]
    },
    {
      id: 'vendor',
      title: 'Primary Caterer Vehicle Breakdown Delay',
      icon: <Truck className="w-4 h-4 text-rose-400" />,
      playbook: [
        'Engage on-call local gourmet charcuterie and artisan bakery backup within 5 miles.',
        'Extend cocktail hour passed hors d’oeuvres and open bar service by 40 minutes.',
        'Coordinate venue kitchen staff to prepare emergency warm flatbread station.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Contingency Risk Matrix & Emergency Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mitigate climate, supplier, power, and crowd risks with actionable failover protocols and calculate eco-impact.
          </p>
        </div>
      </div>

      {/* Risk Matrix Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white">Event Risk Register & Mitigation Playbooks</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {event.contingencyPlans.map(cp => (
            <div
              key={cp.id}
              className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-300">{cp.riskCategory}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                    cp.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : cp.severity === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {cp.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">Trigger Condition:</span> {cp.triggerCondition}
                </p>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  🛡️ <span className="font-medium text-white">Action Plan:</span> {cp.actionPlan}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Lead in Charge: <span className="text-indigo-300 font-medium">{cp.responsibleLead}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Simulation Engine */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Live Emergency Drill & Crisis Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Test how your team and vendors react under unexpected live anomalies</p>
          </div>
          {simulatedScenario && (
            <button
              onClick={() => setSimulatedScenario(null)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulator</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarios.map(sc => (
            <div
              key={sc.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                simulatedScenario === sc.id
                  ? 'bg-indigo-500/15 border-indigo-500/40 shadow-lg'
                  : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-800'
              }`}
              onClick={() => setSimulatedScenario(sc.id)}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                  {sc.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{sc.title}</h4>
                  <span className="text-[10px] text-indigo-300 flex items-center gap-1 mt-0.5">
                    <Play className="w-2.5 h-2.5" /> Run Scenario Drill
                  </span>
                </div>
              </div>

              {simulatedScenario === sc.id && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-emerald-400">Activated Protocol:</span>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {sc.playbook.map((step, idx) => (
                      <li key={idx} className="leading-snug">{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sustainable Celebration & Carbon Footprint Estimator */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Eco-Impact & Sustainable Celebration Estimator</h3>
              <p className="text-xs text-emerald-200">Environmental footprint calculations for {event.guestCount} guests</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Estimated Carbon Footprint</span>
            <p className="text-2xl font-bold text-white mt-1">{estimatedCarbonKg.toLocaleString()} kg</p>
            <span className="text-[11px] text-slate-500">CO2 equivalent</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Tree Seedlings to Offset</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{treesToOffset} trees</p>
            <span className="text-[11px] text-slate-500">planted via verified conservation</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Zero-Waste Potential</span>
            <p className="text-2xl font-bold text-cyan-400 mt-1">85% Diverted</p>
            <span className="text-[11px] text-slate-500">compost & recycled materials</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
          <p className="font-semibold text-white">🌱 4 Actionable Eco-Friendly Initiatives:</p>
          <p>1. **Source within 50 miles:** Mandate caterer farm-to-table sourcing within regional growers.</p>
          <p>2. **Potted Plant Florals:** Rent living maidenhair ferns and potted orchids that can be replanted instead of cut flowers.</p>
          <p>3. **Zero-Waste Composting:** Place clearly marked compost bins adjacent to catering dish return stations.</p>
          <p>4. **Leftover Food Recovery:** Partner with local food banks for pre-arranged collection of unserved sealed food.</p>
        </div>
      </div>
    </div>
  );
};
