/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  formatCurrency,
  convertCurrency,
  calculateDaysRemaining,
  getCountdownLabel,
  formatTimeframeLabel,
  computeBudgetSummary,
  computeMilestoneStats,
  computeGuestStats,
  computeVendorStats,
  clusterGuestsIntoTables
} from '../src/utils/formatters.js';
import { SAMPLE_EVENTS } from '../src/data/sampleEvents.js';
import { BudgetItem, MilestoneItem, GuestItem, VendorItem } from '../src/types/index.js';

describe('Occasio AI - Currency & Conversion Utilities', () => {
  test('formatCurrency formats standard USD correctly', () => {
    assert.strictEqual(formatCurrency(1250, 'USD'), '$1,250');
    assert.strictEqual(formatCurrency(0, 'USD'), '$0');
    assert.strictEqual(formatCurrency(-500, 'USD'), '-$500');
  });

  test('formatCurrency handles NaN, null, and undefined safely', () => {
    assert.strictEqual(formatCurrency(NaN, 'USD'), '$0');
    assert.strictEqual(formatCurrency(null as any, 'USD'), '$0');
    assert.strictEqual(formatCurrency(undefined as any, 'USD'), '$0');
  });

  test('formatCurrency supports diverse international currencies', () => {
    assert.strictEqual(formatCurrency(1500, 'EUR'), '€1,500');
    assert.strictEqual(formatCurrency(2000, 'GBP'), '£2,000');
    assert.strictEqual(formatCurrency(50000, 'INR'), '₹50,000');
    assert.strictEqual(formatCurrency(100000, 'JPY'), '¥100,000');
    assert.strictEqual(formatCurrency(3500, 'CAD'), 'CA$3,500');
    assert.strictEqual(formatCurrency(4000, 'AUD'), 'AU$4,000');
  });

  test('convertCurrency scales based on defined exchange rates', () => {
    const usd = 1000;
    assert.strictEqual(convertCurrency(usd, 'USD'), 1000);
    assert.strictEqual(convertCurrency(usd, 'EUR'), 920);
    assert.strictEqual(convertCurrency(usd, 'GBP'), 790);
    assert.strictEqual(convertCurrency(usd, 'INR'), 84500);
    assert.strictEqual(convertCurrency(usd, 'JPY'), 152000);
  });
});

describe('Occasio AI - Date & Countdown Utilities', () => {
  test('calculateDaysRemaining calculates future dates accurately', () => {
    const ref = new Date('2026-11-01T00:00:00Z');
    const target = '2026-11-10';
    const days = calculateDaysRemaining(target, ref);
    assert.strictEqual(days, 9);
  });

  test('calculateDaysRemaining identifies today and past dates', () => {
    const ref = new Date('2026-11-01T00:00:00Z');
    assert.strictEqual(calculateDaysRemaining('2026-11-01', ref), 0);
    assert.ok(calculateDaysRemaining('2026-10-25', ref) < 0);
  });

  test('calculateDaysRemaining safely returns 0 on invalid or empty date string', () => {
    assert.strictEqual(calculateDaysRemaining(''), 0);
    assert.strictEqual(calculateDaysRemaining('invalid-date'), 0);
  });

  test('getCountdownLabel provides correct urgency tags', () => {
    assert.strictEqual(getCountdownLabel(0).text, 'Today is Event Day!');
    assert.strictEqual(getCountdownLabel(0).urgency, 'critical');
    assert.strictEqual(getCountdownLabel(1).urgency, 'critical');
    assert.strictEqual(getCountdownLabel(5).urgency, 'critical');
    assert.strictEqual(getCountdownLabel(15).urgency, 'warning');
    assert.strictEqual(getCountdownLabel(100).urgency, 'normal');
    assert.strictEqual(getCountdownLabel(-5).isPast, true);
  });

  test('formatTimeframeLabel formats milestone intervals', () => {
    assert.strictEqual(formatTimeframeLabel('12-9_months_before'), '9–12 Months Before');
    assert.strictEqual(formatTimeframeLabel('6-3_months_before'), '3–6 Months Before');
    assert.strictEqual(formatTimeframeLabel('1_month_before'), '1 Month Before');
    assert.strictEqual(formatTimeframeLabel('week_of'), 'Week of Event');
    assert.strictEqual(formatTimeframeLabel('day_before'), 'Day Before / Eve');
  });
});

describe('Occasio AI - Budget & Financial Engine', () => {
  const mockBudget: BudgetItem[] = [
    { id: 'b1', category: 'Venue', name: 'Hall', estimatedCost: 3000, actualCost: 3200, paidAmount: 2000, status: 'deposit_paid' },
    { id: 'b2', category: 'Catering', name: 'Food', estimatedCost: 4000, actualCost: 3800, paidAmount: 3800, status: 'paid_in_full' },
    { id: 'b3', category: 'Music', name: 'DJ', estimatedCost: 1000, actualCost: 1000, paidAmount: 0, status: 'planned' }
  ];

  test('computeBudgetSummary computes accurate totals and percentages', () => {
    const totalBudgetCap = 10000;
    const summary = computeBudgetSummary(mockBudget, totalBudgetCap);

    assert.strictEqual(summary.estimatedTotal, 8000);
    assert.strictEqual(summary.actualTotal, 8000);
    assert.strictEqual(summary.paidTotal, 5800);
    assert.strictEqual(summary.pendingPayments, 2200);
    assert.strictEqual(summary.remainingBudget, 2000);
    assert.strictEqual(summary.isOverBudget, false);
    assert.strictEqual(summary.percentUsed, 80);
  });

  test('computeBudgetSummary flags overbudget conditions', () => {
    const summary = computeBudgetSummary(mockBudget, 7000);
    assert.strictEqual(summary.isOverBudget, true);
    assert.strictEqual(summary.remainingBudget, -1000);
  });

  test('computeBudgetSummary handles empty items list and 0 budget cap safely', () => {
    const summary = computeBudgetSummary([], 0);
    assert.strictEqual(summary.estimatedTotal, 0);
    assert.strictEqual(summary.actualTotal, 0);
    assert.strictEqual(summary.percentUsed, 0);
    assert.strictEqual(summary.isOverBudget, false);
  });

  test('computeBudgetSummary partitions spending by category', () => {
    const summary = computeBudgetSummary(mockBudget, 10000);
    assert.strictEqual(summary.categoriesMap['Venue'].actual, 3200);
    assert.strictEqual(summary.categoriesMap['Catering'].paid, 3800);
    assert.strictEqual(summary.categoriesMap['Music'].count, 1);
  });
});

describe('Occasio AI - Milestone & Vendor Tasks Engine', () => {
  const mockMilestones: MilestoneItem[] = [
    { id: 'm1', title: 'Task 1', timeframe: '12-9_months_before', priority: 'high', dueDate: '2026-12-01', completed: true, category: 'Venue' },
    { id: 'm2', title: 'Task 2', timeframe: '6-3_months_before', priority: 'high', dueDate: '2027-01-01', completed: false, category: 'Catering' },
    { id: 'm3', title: 'Task 3', timeframe: '1_month_before', priority: 'low', dueDate: '2027-02-01', completed: false, category: 'Decor' }
  ];

  test('computeMilestoneStats correctly computes progress and high priority counts', () => {
    const stats = computeMilestoneStats(mockMilestones);
    assert.strictEqual(stats.total, 3);
    assert.strictEqual(stats.completed, 1);
    assert.strictEqual(stats.pending, 2);
    assert.strictEqual(stats.progressPercent, 33);
    assert.strictEqual(stats.highPriorityPending, 1);
  });

  test('computeMilestoneStats handles empty milestones array without error', () => {
    const stats = computeMilestoneStats([]);
    assert.strictEqual(stats.total, 0);
    assert.strictEqual(stats.completed, 0);
    assert.strictEqual(stats.progressPercent, 0);
  });

  test('computeVendorStats computes deliverable completion rates', () => {
    const mockVendors: VendorItem[] = [
      {
        id: 'v1',
        name: 'Vendor A',
        category: 'Venue',
        contactName: 'Alice',
        email: 'alice@test.com',
        phone: '123',
        estimatedFee: 1000,
        status: 'booked_and_locked',
        contractSigned: true,
        deliverables: [
          { id: 'd1', task: 'Item 1', isDone: true },
          { id: 'd2', task: 'Item 2', isDone: false }
        ]
      },
      {
        id: 'v2',
        name: 'Vendor B',
        category: 'Catering & Bar',
        contactName: 'Bob',
        email: 'bob@test.com',
        phone: '456',
        estimatedFee: 2000,
        status: 'quoted',
        contractSigned: false,
        deliverables: [
          { id: 'd3', task: 'Item 3', isDone: true }
        ]
      }
    ];

    const stats = computeVendorStats(mockVendors);
    assert.strictEqual(stats.total, 2);
    assert.strictEqual(stats.bookedAndLocked, 1);
    assert.strictEqual(stats.quoted, 1);
    assert.strictEqual(stats.totalDeliverables, 3);
    assert.strictEqual(stats.completedDeliverables, 2);
    assert.strictEqual(stats.deliverablesPercent, 67);
  });
});

describe('Occasio AI - Guest Experience & Table Clustering', () => {
  const mockGuests: GuestItem[] = [
    { id: 'g1', name: 'Guest 1', rsvpStatus: 'confirmed', plusOnes: 1, dietary: 'vegan', tableGroup: 'Family' },
    { id: 'g2', name: 'Guest 2', rsvpStatus: 'confirmed', plusOnes: 0, dietary: 'gluten_free', tableGroup: 'Family' },
    { id: 'g3', name: 'Guest 3', rsvpStatus: 'pending', plusOnes: 1, dietary: 'vegetarian', tableGroup: 'Friends' },
    { id: 'g4', name: 'Guest 4', rsvpStatus: 'declined', plusOnes: 0, dietary: 'none', tableGroup: 'Colleagues' }
  ];

  test('computeGuestStats calculates headcounts and dietary restrictions', () => {
    const stats = computeGuestStats(mockGuests);
    assert.strictEqual(stats.confirmedHeadcount, 3);
    assert.strictEqual(stats.pendingHeadcount, 2);
    assert.strictEqual(stats.declinedHeadcount, 1);
    assert.strictEqual(stats.totalInvited, 6);
    assert.strictEqual(stats.confirmationRate, 50);

    assert.strictEqual(stats.dietaryCounts.vegan, 1);
    assert.strictEqual(stats.dietaryCounts.gluten_free, 1);
    assert.strictEqual(stats.dietaryCounts.vegetarian, 1);
  });

  test('computeGuestStats handles empty guest list safely', () => {
    const stats = computeGuestStats([]);
    assert.strictEqual(stats.totalInvited, 0);
    assert.strictEqual(stats.confirmedHeadcount, 0);
    assert.strictEqual(stats.confirmationRate, 0);
  });

  test('clusterGuestsIntoTables clusters confirmed guests into tables', () => {
    const tables = clusterGuestsIntoTables(mockGuests, 8);
    assert.ok(tables.length >= 1);
    const totalAssigned = tables.reduce((sum, t) => sum + t.guests.length, 0);
    assert.strictEqual(totalAssigned, 2);
    assert.strictEqual(tables[0].tableName.includes('Family'), true);
  });

  test('clusterGuestsIntoTables splits oversized groups across multiple tables', () => {
    const largeGroup: GuestItem[] = Array.from({ length: 18 }, (_, i) => ({
      id: `lg-${i}`,
      name: `Person ${i}`,
      rsvpStatus: 'confirmed',
      plusOnes: 0,
      dietary: 'none',
      tableGroup: 'College Reunion'
    }));

    const tables = clusterGuestsIntoTables(largeGroup, 8);
    // 18 people with capacity 8 should create 3 tables: 8, 8, 2
    assert.strictEqual(tables.length, 3);
    assert.strictEqual(tables[0].guests.length, 8);
    assert.strictEqual(tables[1].guests.length, 8);
    assert.strictEqual(tables[2].guests.length, 2);
  });
});

describe('Occasio AI - Showcase Datasets Integrity', () => {
  test('All 3 preloaded events exist and conform to domain schema', () => {
    assert.strictEqual(SAMPLE_EVENTS.length, 3);
    
    const [wedding, birthday, community] = SAMPLE_EVENTS;
    assert.strictEqual(wedding.eventType, 'wedding');
    assert.strictEqual(birthday.eventType, 'birthday');
    assert.strictEqual(community.eventType, 'community');

    SAMPLE_EVENTS.forEach(event => {
      assert.ok(event.id);
      assert.ok(event.title);
      assert.ok(event.totalBudget > 0);
      assert.ok(event.guestCount > 0);
      assert.ok(event.budgetItems.length >= 5);
      assert.ok(event.milestones.length >= 5);
      assert.ok(event.dayOfSchedule.length >= 4);
      assert.ok(event.vendors.length >= 2);
      assert.ok(event.personalizedIdeas.colorPalette.length >= 4);
      assert.ok(event.personalizedIdeas.menuItems.length >= 2);
      assert.ok(event.personalizedIdeas.beverages.length >= 1);
      assert.ok(event.contingencyPlans.length >= 1);

      // Verify hex code validity
      event.personalizedIdeas.colorPalette.forEach(c => {
        assert.match(c.hex, /^#[0-9A-Fa-f]{6}$/);
      });
    });
  });
});
