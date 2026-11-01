/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Palette,
  Utensils,
  ChevronRight,
  Layers
} from 'lucide-react';
import { EventPlan, EventType } from '../types';

interface GeneratePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: EventPlan) => void;
}

export const GeneratePlanModal: React.FC<GeneratePlanModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated
}) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [guestCount, setGuestCount] = useState(120);
  const [totalBudget, setTotalBudget] = useState(25000);
  const [city, setCity] = useState('Seattle, WA');
  const [venueName, setVenueName] = useState('Lakefront Pavilion');
  const [aestheticStyle, setAestheticStyle] = useState('Modern Scandinavian Minimalism, Warm Candlelight, Birch Wood');
  const [culturalNotes, setCulturalNotes] = useState('Nordic farm-to-table, wild berries, 15 vegan guests, zero-waste composting');
  const [targetDate, setTargetDate] = useState('2027-08-14');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const presets = [
    {
      label: 'Botanical Glasshouse Wedding',
      type: 'wedding' as EventType,
      budget: 34000,
      guests: 110,
      city: 'San Francisco, CA',
      venue: 'Conservatory of Flowers',
      style: 'Ethereal Botanical, Living Moss, Brass Accents & Candlelight'
    },
    {
      label: 'Cyberpunk Neon 30th Birthday',
      type: 'birthday' as EventType,
      budget: 4800,
      guests: 50,
      city: 'Austin, TX',
      venue: 'Rooftop Lounge & Terrace',
      style: 'Cyberpunk Neon, Retro Synthwave, Iridescent Mylar & Velvet'
    },
    {
      label: 'Autumn Community Harvest Fair',
      type: 'community' as EventType,
      budget: 8500,
      guests: 350,
      city: 'Portland, OR',
      venue: 'Memorial Park & Meadow',
      style: 'Rustic Eco-Market, Burlap Pennants, Sunflower Hay Bales & Live Bluegrass'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setEventType(p.type);
    setTitle(p.label);
    setTotalBudget(p.budget);
    setGuestCount(p.guests);
    setCity(p.city);
    setVenueName(p.venue);
    setAestheticStyle(p.style);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate-event-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          guestCount,
          totalBudget,
          city,
          aestheticStyle,
          culturalNotes,
          targetDate
        })
      });

      const data = await res.json();
      if (data.success && data.plan) {
        const fullPlan: EventPlan = {
          ...data.plan,
          id: data.plan.id || `plan-${Date.now()}`,
          title: title.trim() || data.plan.title || `${aestheticStyle.slice(0, 20)} ${eventType}`,
          eventType,
          targetDate,
          startTime: data.plan.startTime || '15:00',
          city,
          venueName,
          guestCount,
          totalBudget,
          currency: 'USD',
          aestheticStyle,
          culturalOrDietaryNotes: culturalNotes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          budgetItems: data.plan.budgetItems || [],
          milestones: data.plan.milestones || [],
          dayOfSchedule: data.plan.dayOfSchedule || [],
          vendors: data.plan.vendors || [],
          guests: data.plan.guests || [],
          tableAssignments: data.plan.tableAssignments || [],
          personalizedIdeas: data.plan.personalizedIdeas || {
            themeName: 'Celebration Theme',
            vibeDescription: aestheticStyle,
            colorPalette: [],
            decorConcepts: [],
            menuItems: [],
            beverages: [],
            musicPlaylist: { vibeSummary: 'Curated music', recommendedGenres: [], sampleTracks: [] }
          },
          contingencyPlans: data.plan.contingencyPlans || []
        };

        onPlanCreated(fullPlan);
        onClose();
      }
    } catch (err) {
      console.error('Error generating event plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gen-plan-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div>
              <h3 id="gen-plan-modal-title" className="text-base font-bold text-white">
                GenAI Event Blueprint Architect
              </h3>
              <p className="text-xs text-slate-400">
                Synthesize a full 360° master plan in seconds powered by Gemini 3.8 Flash
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Archetype Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Quick-Start Archetype Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {presets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-left transition-all group hover:border-indigo-500/50"
                >
                  <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {preset.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    ${preset.budget.toLocaleString()} • {preset.guests} guests
                  </p>
                </button>
              ))}
            </div>
          </div>

          <form id="generate-plan-form" onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Event Type</label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value as EventType)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="wedding">Wedding Celebration</option>
                  <option value="birthday">Milestone Birthday Bash</option>
                  <option value="community">Community Block Fair / Festival</option>
                  <option value="corporate">Corporate Gala & Summit</option>
                  <option value="anniversary">Anniversary Celebration</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Guest Count</label>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  required
                  value={guestCount}
                  onChange={e => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Total Budget Cap ($ USD)</label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  required
                  value={totalBudget}
                  onChange={e => setTotalBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Destination City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chicago, IL"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Venue Preference</label>
                <input
                  type="text"
                  placeholder="e.g. Historic Loft / Waterfront Pavilion"
                  value={venueName}
                  onChange={e => setVenueName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Aesthetic Style & Vibe</label>
              <input
                type="text"
                placeholder="e.g. Modern Romantic, Velvet & Midnight Blue, Candlelight, Live Jazz"
                value={aestheticStyle}
                onChange={e => setAestheticStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Dietary, Cultural & Program Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Farm-to-table seasonal dinner, signature gin bar, 12 vegan guests, multicultural ceremony elements"
                value={culturalNotes}
                onChange={e => setCulturalNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            form="generate-plan-form"
            type="submit"
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Blueprint (Gemini 3.8)...' : 'Synthesize Master Plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
