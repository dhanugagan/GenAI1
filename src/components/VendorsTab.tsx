/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Store,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
  FileCheck,
  AlertTriangle,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  Copy,
  Check,
  MessageSquare
} from 'lucide-react';
import { EventPlan, VendorItem, VendorCategory, VendorStatus, CurrencyCode } from '../types';
import { formatCurrency, computeVendorStats } from '../utils/formatters';

interface VendorsTabProps {
  event: EventPlan;
  onUpdateVendors: (vendors: VendorItem[]) => void;
  currency: CurrencyCode;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({
  event,
  onUpdateVendors,
  currency
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddingVendor, setIsAddingVendor] = useState(false);

  // AI Vendor Assistant Modal State
  const [activeVendorForAi, setActiveVendorForAi] = useState<VendorItem | null>(null);
  const [aiActionType, setAiActionType] = useState<'rfp' | 'contract_audit' | 'negotiation'>('rfp');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResultText, setAiResultText] = useState<string | null>(null);
  const [copiedAiResult, setCopiedAiResult] = useState(false);

  // New Vendor Form State
  const [newVName, setNewVName] = useState('');
  const [newVCategory, setNewVCategory] = useState<VendorCategory>('Catering & Bar');
  const [newVContact, setNewVContact] = useState('');
  const [newVEmail, setNewVEmail] = useState('');
  const [newVPhone, setNewVPhone] = useState('');
  const [newVFee, setNewVFee] = useState('');
  const [newVStatus, setNewVStatus] = useState<VendorStatus>('researching');

  const vendorStats = computeVendorStats(event.vendors);

  const categories: VendorCategory[] = [
    'Venue',
    'Catering & Bar',
    'Florals & Decor',
    'Photography & Film',
    'Music & Sound',
    'Lighting & AV',
    'Planning & Coordination',
    'Rentals & Furniture',
    'Permits & Security',
    'Transportation'
  ];

  const handleToggleDeliverable = (vendorId: string, deliverableId: string) => {
    onUpdateVendors(
      event.vendors.map(v => {
        if (v.id === vendorId) {
          const updated = v.deliverables.map(d =>
            d.id === deliverableId ? { ...d, isDone: !d.isDone } : d
          );
          return { ...v, deliverables: updated };
        }
        return v;
      })
    );
  };

  const handleToggleContractSigned = (vendorId: string) => {
    onUpdateVendors(
      event.vendors.map(v =>
        v.id === vendorId ? { ...v, contractSigned: !v.contractSigned } : v
      )
    );
  };

  const handleUpdateVendorStatus = (vendorId: string, status: VendorStatus) => {
    onUpdateVendors(
      event.vendors.map(v =>
        v.id === vendorId ? { ...v, status } : v
      )
    );
  };

  const handleDeleteVendor = (vendorId: string) => {
    onUpdateVendors(event.vendors.filter(v => v.id !== vendorId));
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVName.trim()) return;

    const newVendor: VendorItem = {
      id: `v-${Date.now()}`,
      name: newVName.trim(),
      category: newVCategory,
      contactName: newVContact.trim() || 'General Inquiry',
      email: newVEmail.trim() || 'info@vendor.com',
      phone: newVPhone.trim() || '555-0100',
      estimatedFee: Number(newVFee) || 1000,
      quotedFee: Number(newVFee) || 1000,
      status: newVStatus,
      contractSigned: false,
      deliverables: [
        { id: `vd-${Date.now()}-1`, task: 'Request itemized quote and availability', isDone: false },
        { id: `vd-${Date.now()}-2`, task: 'Verify liability insurance certificate (COI)', isDone: false }
      ]
    };

    onUpdateVendors([...event.vendors, newVendor]);
    setNewVName('');
    setNewVContact('');
    setNewVEmail('');
    setNewVPhone('');
    setNewVFee('');
    setIsAddingVendor(false);
  };

  const runAiVendorAssistant = async (vendor: VendorItem, action: 'rfp' | 'contract_audit' | 'negotiation') => {
    setActiveVendorForAi(vendor);
    setAiActionType(action);
    setIsAiLoading(true);
    setAiResultText(null);

    try {
      const res = await fetch('/api/ai/vendor-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: action,
          vendorName: vendor.name,
          vendorCategory: vendor.category,
          eventDetails: {
            title: event.title,
            eventType: event.eventType,
            targetDate: event.targetDate,
            guestCount: event.guestCount,
            city: event.city,
            aestheticStyle: event.aestheticStyle
          }
        })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setAiResultText(data.result);
      }
    } catch (err) {
      console.error('Error invoking vendor assistant:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredVendors = selectedCategory === 'All'
    ? event.vendors
    : event.vendors.filter(v => v.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-400" />
            Supplier Directory & AI Communication Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Vet suppliers, track deliverables checklists, verify contracts, and generate AI-crafted RFPs or negotiations.
          </p>
        </div>

        <button
          onClick={() => setIsAddingVendor(!isAddingVendor)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Total Partners</span>
          <p className="text-xl font-bold text-white mt-1">{vendorStats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Booked & Locked</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">{vendorStats.bookedAndLocked}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Under Review / Quotes</span>
          <p className="text-xl font-bold text-amber-400 mt-1">{vendorStats.quoted + vendorStats.contacted}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Deliverables Done</span>
          <p className="text-xl font-bold text-indigo-400 mt-1">{vendorStats.deliverablesPercent}%</p>
        </div>
      </div>

      {/* Add Vendor Form */}
      {isAddingVendor && (
        <form onSubmit={handleAddVendor} className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-4">
          <h3 className="text-sm font-semibold text-white">Add New Supplier to Directory</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Company / Studio Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Heirloom Film & Digital"
                value={newVName}
                onChange={e => setNewVName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Category</label>
              <select
                value={newVCategory}
                onChange={e => setNewVCategory(e.target.value as VendorCategory)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Contact Name</label>
              <input
                type="text"
                placeholder="e.g. Jessica Taylor"
                value={newVContact}
                onChange={e => setNewVContact(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Email</label>
              <input
                type="email"
                placeholder="booking@vendor.com"
                value={newVEmail}
                onChange={e => setNewVEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Phone</label>
              <input
                type="tel"
                placeholder="(555) 019-2834"
                value={newVPhone}
                onChange={e => setNewVPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Estimated / Quoted Fee ({currency})</label>
              <input
                type="number"
                placeholder="3000"
                value={newVFee}
                onChange={e => setNewVFee(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingVendor(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
            >
              Save Supplier
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'All'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          All Categories ({event.vendors.length})
        </button>
        {categories.map(cat => {
          const count = event.vendors.filter(v => v.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map(vendor => (
          <div
            key={vendor.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {vendor.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{vendor.name}</h3>
                <p className="text-xs text-slate-400">Contact: {vendor.contactName}</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={vendor.status}
                  onChange={e => handleUpdateVendorStatus(vendor.id, e.target.value as VendorStatus)}
                  className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                    vendor.status === 'booked_and_locked'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : vendor.status === 'quoted'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <option value="researching">Researching</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="booked_and_locked">Booked & Locked</option>
                  <option value="declined">Declined</option>
                </select>

                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove vendor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Contact Details & Financial Quote */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <a href={`mailto:${vendor.email}`} className="flex items-center gap-1.5 hover:text-indigo-300 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{vendor.email}</span>
                </a>
                <a href={`tel:${vendor.phone}`} className="flex items-center gap-1.5 hover:text-indigo-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{vendor.phone}</span>
                </a>
              </div>

              <div className="text-right space-y-1">
                <div>
                  <span className="text-[10px] text-slate-500 block">Quoted Rate</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(vendor.quotedFee || vendor.estimatedFee, currency)}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleContractSigned(vendor.id)}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                    vendor.contractSigned
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCheck className="w-3 h-3" />
                  <span>{vendor.contractSigned ? 'Contract Signed' : 'Sign Contract'}</span>
                </button>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Deliverables & Requirements</span>
                <span>
                  {vendor.deliverables.filter(d => d.isDone).length} of {vendor.deliverables.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {vendor.deliverables.map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleToggleDeliverable(vendor.id, d.id)}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 text-xs"
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                      d.isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 bg-slate-900'
                    }`}>
                      {d.isDone && <Check className="w-3 h-3" />}
                    </div>
                    <span className={`flex-1 truncate ${d.isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {d.task}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5">
              <button
                onClick={() => runAiVendorAssistant(vendor, 'rfp')}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium transition-colors"
                title="Draft customized Inquiry RFP"
              >
                <Sparkles className="w-3 h-3" />
                <span>Draft RFP</span>
              </button>

              <button
                onClick={() => runAiVendorAssistant(vendor, 'contract_audit')}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[11px] font-medium transition-colors"
                title="Audit contract clauses & red flags"
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Audit Contract</span>
              </button>

              <button
                onClick={() => runAiVendorAssistant(vendor, 'negotiation')}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[11px] font-medium transition-colors"
                title="Tactful price negotiation message"
              >
                <DollarSign className="w-3 h-3" />
                <span>Negotiate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Vendor Result Modal */}
      {activeVendorForAi && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {aiActionType === 'rfp' ? 'Inquiry RFP Proposal' : aiActionType === 'contract_audit' ? 'Contract Red-Flag Audit' : 'Tactful Price Negotiation'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Target: {activeVendorForAi.name} ({activeVendorForAi.category})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveVendorForAi(null);
                  setAiResultText(null);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isAiLoading ? (
                <div className="py-12 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-300">Generating professional correspondence with Gemini 3.8 Flash...</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {aiResultText}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveVendorForAi(null);
                  setAiResultText(null);
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Done
              </button>

              {aiResultText && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiResultText);
                    setCopiedAiResult(true);
                    setTimeout(() => setCopiedAiResult(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                >
                  {copiedAiResult ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Correspondence</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
