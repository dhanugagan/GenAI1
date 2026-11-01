/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wallet,
  TrendingDown,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  PieChart,
  ArrowUpRight,
  Filter,
  Check,
  DollarSign
} from 'lucide-react';
import { EventPlan, BudgetItem, PaymentStatus, CostOptimizationAdvice, CurrencyCode } from '../types';
import { formatCurrency, computeBudgetSummary } from '../utils/formatters';

interface BudgetTabProps {
  event: EventPlan;
  onUpdateBudgetItems: (items: BudgetItem[]) => void;
  currency: CurrencyCode;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  event,
  onUpdateBudgetItems,
  currency
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Venue & Rentals');
  const [newItemEstCost, setNewItemEstCost] = useState('');
  const [newItemActualCost, setNewItemActualCost] = useState('');
  const [newItemStatus, setNewItemStatus] = useState<PaymentStatus>('planned');

  // AI Optimizer State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizerAdvice, setOptimizerAdvice] = useState<CostOptimizationAdvice | null>(null);

  const budgetSummary = computeBudgetSummary(event.budgetItems, event.totalBudget);

  const categories = [
    'Venue & Rentals',
    'Catering & Bar',
    'Florals & Decor',
    'Photography & Film',
    'Music & Entertainment',
    'Attire & Beauty',
    'Invitations & Stationery',
    'Permits & Insurance',
    'Contingency Reserve'
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const est = Number(newItemEstCost) || 0;
    const act = Number(newItemActualCost) || est;
    const paid = newItemStatus === 'paid_in_full' ? act : newItemStatus === 'deposit_paid' ? Math.round(act * 0.5) : 0;

    const newItem: BudgetItem = {
      id: `bi-${Date.now()}`,
      category: newItemCategory,
      name: newItemName.trim(),
      estimatedCost: est,
      actualCost: act,
      paidAmount: paid,
      status: newItemStatus
    };

    onUpdateBudgetItems([...event.budgetItems, newItem]);
    setNewItemName('');
    setNewItemEstCost('');
    setNewItemActualCost('');
    setIsAddingItem(false);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateBudgetItems(event.budgetItems.filter(item => item.id !== id));
  };

  const handleUpdateItemStatus = (id: string, newStatus: PaymentStatus) => {
    onUpdateBudgetItems(
      event.budgetItems.map(item => {
        if (item.id === id) {
          const paid = newStatus === 'paid_in_full' ? item.actualCost : newStatus === 'deposit_paid' ? Math.round(item.actualCost * 0.5) : 0;
          return { ...item, status: newStatus, paidAmount: paid };
        }
        return item;
      })
    );
  };

  const runAiOptimizer = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/ai/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetItems: event.budgetItems,
          totalBudget: event.totalBudget,
          eventType: event.eventType,
          guestCount: event.guestCount
        })
      });
      const data = await res.json();
      if (data.success && data.advice) {
        setOptimizerAdvice(data.advice);
      }
    } catch (err) {
      console.error('Error running budget optimizer:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? event.budgetItems
    : event.budgetItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" />
            Financial Budget Planner & Cost Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track line-item estimates, quotes, paid deposits, and run the AI Cost Optimizer to uncover high-impact savings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runAiOptimizer}
            disabled={isOptimizing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-200 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Analyzing Spending...' : 'AI Budget Optimizer'}</span>
          </button>

          <button
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* AI Optimizer Results Section (if active) */}
      {optimizerAdvice && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Financial Optimization Strategy</h3>
                <p className="text-xs text-indigo-200">
                  Estimated Recovery: <span className="font-semibold text-emerald-400">{formatCurrency(optimizerAdvice.estimatedSavingsPotential, currency)}</span> across {optimizerAdvice.identifiedRiskCount} category recommendations
                </p>
              </div>
            </div>
            <button
              onClick={() => setOptimizerAdvice(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            {optimizerAdvice.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {optimizerAdvice.recommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-300">{rec.category}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Save ~{formatCurrency(rec.estimatedSavings, currency)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  {rec.observation}
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-200 font-medium leading-relaxed">
                  💡 <span className="text-amber-200">Trade-Off:</span> {rec.actionableTradeOff}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Health Meters */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-400" />
          Category Spending Allocation & Health Meters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map(cat => {
            const data = budgetSummary.categoriesMap[cat] || { actual: 0, estimated: 0, paid: 0, count: 0 };
            const percentOfTotal = event.totalBudget > 0 ? Math.round((data.actual / event.totalBudget) * 100) : 0;

            return (
              <div
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-500/15 border-indigo-500/40'
                    : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200 truncate">{cat}</span>
                  <span className="text-xs font-bold text-white">
                    {formatCurrency(data.actual, currency)}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min(percentOfTotal * 2, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <span>{percentOfTotal}% of total budget</span>
                  <span>{data.count} items • {formatCurrency(data.paid, currency)} paid</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Item Form (Collapsible) */}
      {isAddingItem && (
        <form onSubmit={handleAddItem} className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">Add New Line-Item Expense</h3>
            <button type="button" onClick={() => setIsAddingItem(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Expense Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Acoustic Guitarist Duo"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Category</label>
              <select
                value={newItemCategory}
                onChange={e => setNewItemCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Estimated Cost ({currency})</label>
              <input
                type="number"
                required
                placeholder="1500"
                value={newItemEstCost}
                onChange={e => setNewItemEstCost(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Payment Status</label>
              <select
                value={newItemStatus}
                onChange={e => setNewItemStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="planned">Planned (Unpaid)</option>
                <option value="deposit_paid">Deposit Paid (50%)</option>
                <option value="paid_in_full">Paid in Full</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
            >
              Add to Ledger
            </button>
          </div>
        </form>
      )}

      {/* Line Item Ledger Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Filter Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Categories ({event.budgetItems.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Showing {filteredItems.length} line items
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-semibold">Expense Item</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold text-right">Estimated</th>
                <th className="py-3 px-3 font-semibold text-right">Actual / Quoted</th>
                <th className="py-3 px-3 font-semibold text-right">Paid</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-white max-w-[240px] truncate">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {item.category}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 font-mono">
                    {formatCurrency(item.estimatedCost, currency)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-white">
                    {formatCurrency(item.actualCost, currency)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400">
                    {formatCurrency(item.paidAmount, currency)}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={item.status}
                      onChange={e => handleUpdateItemStatus(item.id, e.target.value as PaymentStatus)}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${
                        item.status === 'paid_in_full'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : item.status === 'deposit_paid'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="planned">Planned</option>
                      <option value="deposit_paid">Deposit Paid</option>
                      <option value="paid_in_full">Paid in Full</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete expense"
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
    </div>
  );
};
