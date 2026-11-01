/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Clock,
  UserX,
  Plus,
  Trash2,
  Sparkles,
  Utensils,
  Share2,
  Check,
  Layers,
  Filter
} from 'lucide-react';
import { EventPlan, GuestItem, RSVPStatus, DietaryRequirement, TableAssignment } from '../types';
import { computeGuestStats, clusterGuestsIntoTables } from '../utils/formatters';

interface GuestsTabProps {
  event: EventPlan;
  onUpdateGuests: (guests: GuestItem[]) => void;
  onUpdateTables: (tables: TableAssignment[]) => void;
}

export const GuestsTab: React.FC<GuestsTabProps> = ({
  event,
  onUpdateGuests,
  onUpdateTables
}) => {
  const [filterRsvp, setFilterRsvp] = useState<string>('all');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlusOnes, setNewPlusOnes] = useState('0');
  const [newDietary, setNewDietary] = useState<DietaryRequirement>('none');
  const [newGroup, setNewGroup] = useState('General Guests');
  const [newRsvp, setNewRsvp] = useState<RSVPStatus>('confirmed');

  const [activeSubView, setActiveSubView] = useState<'roster' | 'seating'>('roster');
  const [clusteredTables, setClusteredTables] = useState<any[] | null>(null);

  const guestStats = computeGuestStats(event.guests);

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newGuest: GuestItem = {
      id: `g-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim() || undefined,
      rsvpStatus: newRsvp,
      plusOnes: Math.max(0, Number(newPlusOnes) || 0),
      dietary: newDietary,
      tableGroup: newGroup.trim() || 'General Seating'
    };

    onUpdateGuests([...event.guests, newGuest]);
    setNewName('');
    setNewEmail('');
    setNewPlusOnes('0');
    setIsAddingGuest(false);
  };

  const handleDeleteGuest = (id: string) => {
    onUpdateGuests(event.guests.filter(g => g.id !== id));
  };

  const handleUpdateStatus = (id: string, status: RSVPStatus) => {
    onUpdateGuests(
      event.guests.map(g => g.id === id ? { ...g, rsvpStatus: status } : g)
    );
  };

  const handleRunTableClustering = () => {
    const generated = clusterGuestsIntoTables(event.guests, 8);
    setClusteredTables(generated);
    setActiveSubView('seating');
  };

  const filteredGuests = event.guests.filter(g => {
    if (filterRsvp === 'all') return true;
    return g.rsvpStatus === filterRsvp;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Guest Experience, RSVPs & AI Table Clustering
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track confirmed headcounts, aggregate dietary restrictions for catering, and cluster attendees into balanced seating tables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTableClustering}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Table Clustering</span>
          </button>

          <button
            onClick={() => setIsAddingGuest(!isAddingGuest)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Total Party Invited</span>
          <p className="text-xl font-bold text-white mt-1">{guestStats.totalInvited}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Confirmed Headcount</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">{guestStats.confirmedHeadcount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Awaiting Reply</span>
          <p className="text-xl font-bold text-amber-400 mt-1">{guestStats.pendingHeadcount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Confirmation Rate</span>
          <p className="text-xl font-bold text-cyan-400 mt-1">{guestStats.confirmationRate}%</p>
        </div>
      </div>

      {/* Dietary Manifest for Catering */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Catering Dietary & Allergen Manifest</h3>
          </div>
          <span className="text-xs text-slate-400">Export ready for executive chef</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
          {Object.entries(guestStats.dietaryCounts).map(([diet, count]) => {
            const formattedName = diet.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            return (
              <div key={diet} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block truncate">{formattedName}</span>
                <span className={`text-base font-bold ${count > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-view toggle (Guest Roster vs Seating Chart) */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubView('roster')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubView === 'roster'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Guest Roster ({event.guests.length})
        </button>
        <button
          onClick={() => {
            if (!clusteredTables) {
              handleRunTableClustering();
            }
            setActiveSubView('seating');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubView === 'seating'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Seating & Table Chart
        </button>
      </div>

      {/* Add Guest Form */}
      {isAddingGuest && (
        <form onSubmit={handleAddGuest} className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-4">
          <h3 className="text-sm font-semibold text-white">Add Guest to Roster</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Guest Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Maya Patel"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="guest@example.com"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Plus-Ones</label>
              <input
                type="number"
                min="0"
                max="5"
                value={newPlusOnes}
                onChange={e => setNewPlusOnes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">RSVP Status</label>
              <select
                value={newRsvp}
                onChange={e => setNewRsvp(e.target.value as RSVPStatus)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending Reply</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Dietary Requirement</label>
              <select
                value={newDietary}
                onChange={e => setNewDietary(e.target.value as DietaryRequirement)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="none">Standard / None</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten_free">Gluten-Free</option>
                <option value="nut_allergy">Nut Allergy</option>
                <option value="dairy_free">Dairy-Free</option>
                <option value="halal">Halal</option>
                <option value="kosher">Kosher</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Group Affinity / Table Tag</label>
              <input
                type="text"
                placeholder="e.g. Immediate Family, College Friends"
                value={newGroup}
                onChange={e => setNewGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingGuest(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
            >
              Save Guest
            </button>
          </div>
        </form>
      )}

      {/* View 1: Roster List */}
      {activeSubView === 'roster' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterRsvp}
                onChange={e => setFilterRsvp(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value="all">All RSVP States ({event.guests.length})</option>
                <option value="confirmed">Confirmed Only</option>
                <option value="pending">Pending Reply</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            <div className="text-xs text-slate-400">
              Showing {filteredGuests.length} guests
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Guest Name</th>
                  <th className="py-3 px-3 font-semibold">Affinity Group</th>
                  <th className="py-3 px-3 font-semibold">Headcount</th>
                  <th className="py-3 px-3 font-semibold">Dietary</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredGuests.map(guest => (
                  <tr key={guest.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-medium text-white">
                      {guest.name}
                      {guest.email && (
                        <span className="block text-[11px] text-slate-500 font-normal">{guest.email}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {guest.tableGroup || 'General'}
                    </td>
                    <td className="py-3 px-3 font-medium">
                      1 + {guest.plusOnes} = <span className="text-indigo-300 font-bold">{1 + guest.plusOnes}</span>
                    </td>
                    <td className="py-3 px-3">
                      {guest.dietary && guest.dietary !== 'none' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {guest.dietary.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-slate-500">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={guest.rsvpStatus}
                        onChange={e => handleUpdateStatus(guest.id, e.target.value as RSVPStatus)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${
                          guest.rsvpStatus === 'confirmed'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : guest.rsvpStatus === 'pending'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove guest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Seating Chart with AI Clustering */}
      {activeSubView === 'seating' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="text-sm font-bold text-white">AI Clustered Seating Plan</h4>
                <p className="text-xs text-indigo-200">
                  Organized by affinity groups (Family, Friends, Colleagues) with optimal table sizes of 8.
                </p>
              </div>
            </div>
            <button
              onClick={handleRunTableClustering}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Re-cluster
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(clusteredTables || clusterGuestsIntoTables(event.guests, 8)).map(table => (
              <div
                key={table.tableNumber}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                      T{table.tableNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[160px]">{table.tableName}</h4>
                      <span className="text-[10px] text-slate-400">{table.guests.length} / {table.capacity} seats assigned</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 min-h-[100px]">
                  {table.guests.map((g: GuestItem) => (
                    <div
                      key={g.id}
                      className="p-2 rounded-lg bg-slate-800/40 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-200 truncate">{g.name}</span>
                      {g.dietary && g.dietary !== 'none' && (
                        <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          {g.dietary.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
