/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrencyCode, BudgetItem, MilestoneItem, GuestItem, VendorItem, MilestoneTimeframe } from '../types';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'AU$',
  INR: '₹',
  JPY: '¥'
};

export const EXCHANGE_RATES_FROM_USD: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  INR: 84.5,
  JPY: 152.0
};

/**
 * Format monetary amount with appropriate symbol and localization.
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${CURRENCY_SYMBOLS[currency] || '$'}0`;
  }
  
  const absAmount = Math.abs(amount);
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency === 'JPY' ? 0 : 0,
    maximumFractionDigits: currency === 'JPY' ? 0 : 0
  }).format(absAmount);

  const sign = amount < 0 ? '-' : '';
  return `${sign}${CURRENCY_SYMBOLS[currency] || '$'}${formattedNumber}`;
}

/**
 * Convert an amount from USD base to a target currency.
 */
export function convertCurrency(amountInUSD: number, targetCurrency: CurrencyCode): number {
  const rate = EXCHANGE_RATES_FROM_USD[targetCurrency] || 1.0;
  return Math.round(amountInUSD * rate);
}

/**
 * Calculate days remaining until target date.
 */
export function calculateDaysRemaining(targetDateIso: string, referenceDate: Date = new Date()): number {
  if (!targetDateIso) return 0;
  const target = new Date(targetDateIso);
  if (isNaN(target.getTime())) return 0;

  // Normalize reference date to start of day
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);
  
  const targetDay = new Date(target);
  targetDay.setHours(0, 0, 0, 0);

  const diffMs = targetDay.getTime() - ref.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Human-readable countdown label.
 */
export function getCountdownLabel(days: number): { text: string; isPast: boolean; urgency: 'critical' | 'warning' | 'normal' } {
  if (days < 0) {
    return { text: `${Math.abs(days)} days ago`, isPast: true, urgency: 'normal' };
  }
  if (days === 0) {
    return { text: 'Today is Event Day!', isPast: false, urgency: 'critical' };
  }
  if (days === 1) {
    return { text: 'Tomorrow (1 day)', isPast: false, urgency: 'critical' };
  }
  if (days <= 7) {
    return { text: `${days} days left`, isPast: false, urgency: 'critical' };
  }
  if (days <= 30) {
    return { text: `${days} days left`, isPast: false, urgency: 'warning' };
  }
  return { text: `${days} days left`, isPast: false, urgency: 'normal' };
}

/**
 * Human readable timeframe tag for milestones.
 */
export function formatTimeframeLabel(timeframe: MilestoneTimeframe): string {
  switch (timeframe) {
    case '12-9_months_before':
      return '9–12 Months Before';
    case '6-3_months_before':
      return '3–6 Months Before';
    case '1_month_before':
      return '1 Month Before';
    case 'week_of':
      return 'Week of Event';
    case 'day_before':
      return 'Day Before / Eve';
    default:
      return 'Timeline Horizon';
  }
}

/**
 * Aggregate budget calculations.
 */
export function computeBudgetSummary(items: BudgetItem[], totalBudgetCap: number) {
  const estimatedTotal = items.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const actualTotal = items.reduce((sum, item) => sum + (item.actualCost || 0), 0);
  const paidTotal = items.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  
  const remainingBudget = totalBudgetCap - actualTotal;
  const isOverBudget = actualTotal > totalBudgetCap;
  const percentUsed = totalBudgetCap > 0 ? Math.min(Math.round((actualTotal / totalBudgetCap) * 100), 100) : 0;
  const pendingPayments = actualTotal - paidTotal;

  // Breakdown by category
  const categoriesMap: Record<string, { estimated: number; actual: number; paid: number; count: number }> = {};
  items.forEach(item => {
    const cat = item.category || 'Other';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = { estimated: 0, actual: 0, paid: 0, count: 0 };
    }
    categoriesMap[cat].estimated += item.estimatedCost || 0;
    categoriesMap[cat].actual += item.actualCost || 0;
    categoriesMap[cat].paid += item.paidAmount || 0;
    categoriesMap[cat].count += 1;
  });

  return {
    totalBudgetCap,
    estimatedTotal,
    actualTotal,
    paidTotal,
    pendingPayments,
    remainingBudget,
    isOverBudget,
    percentUsed,
    categoriesMap
  };
}

/**
 * Aggregate milestone statistics.
 */
export function computeMilestoneStats(milestones: MilestoneItem[]) {
  const total = milestones.length;
  const completed = milestones.filter(m => m.completed).length;
  const pending = total - completed;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const highPriorityPending = milestones.filter(m => !m.completed && m.priority === 'high').length;

  return {
    total,
    completed,
    pending,
    progressPercent,
    highPriorityPending
  };
}

/**
 * Aggregate RSVP and dietary statistics.
 */
export function computeGuestStats(guests: GuestItem[]) {
  let confirmedHeadcount = 0;
  let pendingHeadcount = 0;
  let declinedHeadcount = 0;
  
  const dietaryCounts: Record<string, number> = {
    none: 0,
    vegetarian: 0,
    vegan: 0,
    gluten_free: 0,
    nut_allergy: 0,
    dairy_free: 0,
    halal: 0,
    kosher: 0
  };

  guests.forEach(g => {
    const totalGuestsInParty = 1 + (g.plusOnes || 0);
    if (g.rsvpStatus === 'confirmed') {
      confirmedHeadcount += totalGuestsInParty;
    } else if (g.rsvpStatus === 'pending') {
      pendingHeadcount += totalGuestsInParty;
    } else {
      declinedHeadcount += totalGuestsInParty;
    }

    if (g.dietary && g.dietary !== 'none') {
      dietaryCounts[g.dietary] = (dietaryCounts[g.dietary] || 0) + 1;
    } else {
      dietaryCounts.none = (dietaryCounts.none || 0) + 1;
    }
  });

  const totalInvited = confirmedHeadcount + pendingHeadcount + declinedHeadcount;
  const confirmationRate = totalInvited > 0 ? Math.round((confirmedHeadcount / totalInvited) * 100) : 0;

  return {
    totalInvited,
    confirmedHeadcount,
    pendingHeadcount,
    declinedHeadcount,
    confirmationRate,
    dietaryCounts
  };
}

/**
 * Aggregate vendor statuses and deliverables.
 */
export function computeVendorStats(vendors: VendorItem[]) {
  const total = vendors.length;
  const bookedAndLocked = vendors.filter(v => v.status === 'booked_and_locked').length;
  const quoted = vendors.filter(v => v.status === 'quoted').length;
  const contacted = vendors.filter(v => v.status === 'contacted').length;
  const researching = vendors.filter(v => v.status === 'researching').length;

  let totalDeliverables = 0;
  let completedDeliverables = 0;

  vendors.forEach(v => {
    if (v.deliverables && Array.isArray(v.deliverables)) {
      totalDeliverables += v.deliverables.length;
      completedDeliverables += v.deliverables.filter(d => d.isDone).length;
    }
  });

  return {
    total,
    bookedAndLocked,
    quoted,
    contacted,
    researching,
    totalDeliverables,
    completedDeliverables,
    deliverablesPercent: totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0
  };
}

/**
 * Intelligent Table Clustering Algorithm.
 * Groups guests into balanced tables based on group tags or headcounts.
 */
export function clusterGuestsIntoTables(guests: GuestItem[], targetTableSize: number = 8) {
  const confirmedGuests = guests.filter(g => g.rsvpStatus === 'confirmed');
  const groups: Record<string, GuestItem[]> = {};

  // First group by explicit tableGroup if specified
  confirmedGuests.forEach(guest => {
    const key = guest.tableGroup || 'General Seating';
    if (!groups[key]) groups[key] = [];
    groups[key].push(guest);
  });

  const generatedTables: { tableNumber: number; tableName: string; capacity: number; guests: GuestItem[] }[] = [];
  let tableCounter = 1;

  Object.entries(groups).forEach(([groupName, groupGuests]) => {
    // Chunk group if larger than table size
    for (let i = 0; i < groupGuests.length; i += targetTableSize) {
      const slice = groupGuests.slice(i, i + targetTableSize);
      generatedTables.push({
        tableNumber: tableCounter++,
        tableName: `${groupName} ${groupGuests.length > targetTableSize ? `(Part ${Math.floor(i / targetTableSize) + 1})` : ''}`,
        capacity: targetTableSize,
        guests: slice
      });
    }
  });

  return generatedTables;
}
