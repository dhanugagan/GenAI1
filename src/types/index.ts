/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventType = 'wedding' | 'birthday' | 'community' | 'corporate' | 'anniversary';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'INR' | 'JPY';

export type PaymentStatus = 'planned' | 'deposit_paid' | 'paid_in_full' | 'overdue';

export type MilestonePriority = 'high' | 'medium' | 'low';

export type MilestoneTimeframe = 
  | '12-9_months_before'
  | '6-3_months_before'
  | '1_month_before'
  | 'week_of'
  | 'day_before';

export type VendorCategory = 
  | 'Venue'
  | 'Catering & Bar'
  | 'Photography & Film'
  | 'Music & Sound'
  | 'Florals & Decor'
  | 'Lighting & AV'
  | 'Planning & Coordination'
  | 'Rentals & Furniture'
  | 'Permits & Security'
  | 'Transportation';

export type VendorStatus = 
  | 'researching'
  | 'contacted'
  | 'quoted'
  | 'booked_and_locked'
  | 'declined';

export type RSVPStatus = 'confirmed' | 'pending' | 'declined';

export type DietaryRequirement = 
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'nut_allergy'
  | 'dairy_free'
  | 'halal'
  | 'kosher';

export interface BudgetItem {
  id: string;
  category: string; // e.g. "Venue & Rentals", "Catering & Bar", etc.
  name: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  status: PaymentStatus;
  notes?: string;
  dueBy?: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  timeframe: MilestoneTimeframe;
  priority: MilestonePriority;
  dueDate: string;
  completed: boolean;
  category: string;
  notes?: string;
  assignedTo?: string;
}

export interface DayOfScheduleItem {
  id: string;
  time: string; // e.g. "08:30 AM"
  endTime?: string;
  activity: string;
  location: string;
  teamLead: string; // e.g. "Coordinator Sarah", "Lead Chef Martin"
  notes?: string;
  isCompleted?: boolean;
}

export interface VendorDeliverable {
  id: string;
  task: string;
  isDone: boolean;
  dueNotice?: string;
}

export interface VendorItem {
  id: string;
  name: string;
  category: VendorCategory;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  estimatedFee: number;
  quotedFee?: number;
  status: VendorStatus;
  contractSigned: boolean;
  deliverables: VendorDeliverable[];
  notes?: string;
}

export interface GuestItem {
  id: string;
  name: string;
  email?: string;
  rsvpStatus: RSVPStatus;
  plusOnes: number;
  dietary: DietaryRequirement;
  tableGroup?: string; // e.g. "Table 1 - Immediate Family"
  notes?: string;
}

export interface TableAssignment {
  id: string;
  tableNumber: number;
  tableName: string;
  capacity: number;
  guestIds: string[];
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'Primary Accent' | 'Secondary Color' | 'Neutral Base' | 'Warm Pop' | 'Contrast';
}

export interface DecorConcept {
  id: string;
  area: string;
  conceptTitle: string;
  description: string;
  diyTip: string;
  estimatedCost: number;
}

export interface MenuItem {
  id: string;
  course: 'Canapés & Starters' | 'Main Entrée' | 'Dessert & Cake' | 'Late Night Snack';
  dishName: string;
  description: string;
  dietaryTags: string[];
}

export interface BeverageItem {
  id: string;
  name: string;
  type: 'Signature Cocktail' | 'Signature Mocktail' | 'Wine & Craft Pairing';
  ingredients: string;
  flavorProfile: string;
}

export interface MusicPlaylist {
  vibeSummary: string;
  recommendedGenres: string[];
  sampleTracks: {
    phase: 'Guest Arrival' | 'Ceremony / Grand Entrance' | 'Dinner & Mingle' | 'Peak Dance Party' | 'Farewell Sendoff';
    songIdea: string;
    artist: string;
  }[];
}

export interface PersonalizedIdeas {
  themeName: string;
  vibeDescription: string;
  colorPalette: ColorSwatch[];
  decorConcepts: DecorConcept[];
  menuItems: MenuItem[];
  beverages: BeverageItem[];
  musicPlaylist: MusicPlaylist;
}

export interface ContingencyPlan {
  id: string;
  riskCategory: 'Weather & Climate' | 'Vendor Default' | 'Power & AV Outage' | 'Budget Overrun' | 'Crowd / Medical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggerCondition: string;
  actionPlan: string;
  responsibleLead: string;
}

export interface EventPlan {
  id: string;
  title: string;
  eventType: EventType;
  targetDate: string; // ISO format "YYYY-MM-DD"
  startTime: string; // "14:00"
  city: string;
  venueName: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyCode;
  aestheticStyle: string;
  culturalOrDietaryNotes: string;
  createdAt: string;
  updatedAt: string;
  
  // Modules
  budgetItems: BudgetItem[];
  milestones: MilestoneItem[];
  dayOfSchedule: DayOfScheduleItem[];
  vendors: VendorItem[];
  guests: GuestItem[];
  tableAssignments: TableAssignment[];
  personalizedIdeas: PersonalizedIdeas;
  contingencyPlans: ContingencyPlan[];
}

export interface CostOptimizationAdvice {
  summary: string;
  identifiedRiskCount: number;
  estimatedSavingsPotential: number;
  recommendations: {
    category: string;
    observation: string;
    actionableTradeOff: string;
    estimatedSavings: number;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export interface SpeechScript {
  title: string;
  speakerRole: string; // "Maid of Honor", "Best Friend", "Host", "Community Leader"
  tone: 'heartfelt' | 'witty' | 'inspiring' | 'poetic';
  targetDurationMinutes: number;
  wordCount: number;
  fullSpeech: string;
  stageCues: string[];
}
