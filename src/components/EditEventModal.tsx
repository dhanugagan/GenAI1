/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Edit3, X, Save, Calendar, Users, DollarSign, MapPin } from 'lucide-react';
import { EventPlan, EventType, CurrencyCode } from '../types';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
  onSave: (updated: EventPlan) => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave
}) => {
  const [title, setTitle] = useState(event.title);
  const [eventType, setEventType] = useState<EventType>(event.eventType);
  const [targetDate, setTargetDate] = useState(event.targetDate);
  const [startTime, setStartTime] = useState(event.startTime || '15:00');
  const [city, setCity] = useState(event.city);
  const [venueName, setVenueName] = useState(event.venueName);
  const [guestCount, setGuestCount] = useState(event.guestCount);
  const [totalBudget, setTotalBudget] = useState(event.totalBudget);
  const [aestheticStyle, setAestheticStyle] = useState(event.aestheticStyle);
  const [culturalOrDietaryNotes, setCulturalOrDietaryNotes] = useState(event.culturalOrDietaryNotes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...event,
      title: title.trim(),
      eventType,
      targetDate,
      startTime,
      city: city.trim(),
      venueName: venueName.trim(),
      guestCount: Number(guestCount) || 50,
      totalBudget: Number(totalBudget) || 10000,
      aestheticStyle: aestheticStyle.trim(),
      culturalOrDietaryNotes: culturalOrDietaryNotes.trim(),
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-event-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <h3 id="edit-event-modal-title" className="text-base font-bold text-white">
              Edit Event Metadata
            </h3>
          </div>
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value as EventType)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
                <option value="community">Community Fair</option>
                <option value="corporate">Corporate</option>
                <option value="anniversary">Anniversary</option>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Guest Target Count</label>
              <input
                type="number"
                min="5"
                required
                value={guestCount}
                onChange={e => setGuestCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Budget Cap ($ USD)</label>
              <input
                type="number"
                min="100"
                required
                value={totalBudget}
                onChange={e => setTotalBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Venue Name</label>
              <input
                type="text"
                required
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">City, State</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Aesthetic Style</label>
            <input
              type="text"
              value={aestheticStyle}
              onChange={e => setAestheticStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Cultural & Dietary Notes</label>
            <textarea
              rows={2}
              value={culturalOrDietaryNotes}
              onChange={e => setCulturalOrDietaryNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
