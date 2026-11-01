/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { EventPlan, CostOptimizationAdvice, SpeechScript } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware: Helmet with customized CSP to allow Vite dev and safe asset loading
app.use(
  helmet({
    contentSecurityPolicy: false, // Vite handles its own dev assets and CSP
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(express.json({ limit: '1mb' }));

// Initialize Google GenAI securely on the server
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI();
  } catch (e) {
    console.warn('[GenAI] Could not initialize GoogleGenAI with key:', e);
  }
} else {
  console.info('[GenAI] No GEMINI_API_KEY set; heuristic resilience generator will be engaged.');
}

/**
 * Execute a Gemini call with a strict timeout (3.5 seconds) to guarantee zero UI blocking.
 */
async function callGeminiWithTimeout<T>(
  prompt: string,
  systemInstruction: string,
  fallbackFn: () => T,
  parseJson: boolean = true
): Promise<T> {
  if (!aiClient || !apiKey) {
    return fallbackFn();
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('AI generation timed out (3.5s limit)')), 3500)
  );

  try {
    const aiPromise = aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: parseJson ? 'application/json' : 'text/plain',
        temperature: 0.7
      }
    });

    const response = await Promise.race([aiPromise, timeoutPromise]);
    const text = response.text?.trim() || '';

    if (parseJson) {
      try {
        const cleaned = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
        return JSON.parse(cleaned) as T;
      } catch (err) {
        console.warn('[GenAI] JSON parse failed, utilizing domain fallback:', err);
        return fallbackFn();
      }
    }

    return text as unknown as T;
  } catch (error) {
    console.warn('[GenAI] Request failed or timed out; falling back to domain generator:', error);
    return fallbackFn();
  }
}

// ==========================================
// API ROUTES
// ==========================================

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    hasApiKey: !!apiKey,
    model: 'gemini-3.8-flash',
    uptime: process.uptime()
  });
});

/**
 * Route: Download complete submission zip archive
 */
app.get('/api/download-submission-zip', (_req: Request, res: Response) => {
  const zipPath = path.join(__dirname, 'occasio-ai-submission.zip');
  res.download(zipPath, 'occasio-ai-submission.zip');
});

/**
 * Route: Generate full event plan blueprint
 */
app.post('/api/ai/generate-event-plan', async (req: Request, res: Response) => {
  try {
    const { eventType, guestCount, totalBudget, city, aestheticStyle, culturalNotes, targetDate } = req.body;

    if (!eventType || !totalBudget || !guestCount) {
      res.status(400).json({ error: 'Missing required parameters: eventType, totalBudget, guestCount' });
      return;
    }

    const safeType = String(eventType).slice(0, 50);
    const safeGuests = Math.min(Math.max(Number(guestCount) || 50, 5), 5000);
    const safeBudget = Math.min(Math.max(Number(totalBudget) || 5000, 500), 10000000);
    const safeCity = String(city || 'Local City').slice(0, 100);
    const safeStyle = String(aestheticStyle || 'Elegant and Welcoming').slice(0, 200);
    const safeNotes = String(culturalNotes || 'Standard requirements').slice(0, 300);
    const safeDate = String(targetDate || new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0]).slice(0, 20);

    const prompt = `
Create an event blueprint for a ${safeType} in ${safeCity} for ${safeGuests} guests with a budget of $${safeBudget}.
Aesthetic style: ${safeStyle}
Dietary / cultural notes: ${safeNotes}
Target date: ${safeDate}

Generate a comprehensive JSON object matching the EventPlan interface:
{
  "title": "Inspiring Event Title",
  "eventType": "${safeType}",
  "city": "${safeCity}",
  "venueName": "Recommended Venue Type or Name",
  "guestCount": ${safeGuests},
  "totalBudget": ${safeBudget},
  "currency": "USD",
  "aestheticStyle": "${safeStyle}",
  "culturalOrDietaryNotes": "${safeNotes}",
  "budgetItems": [
    { "id": "b1", "category": "Venue & Rentals", "name": "Item Name", "estimatedCost": 2000, "actualCost": 2000, "paidAmount": 0, "status": "planned" }
  ],
  "milestones": [
    { "id": "m1", "title": "Actionable task", "timeframe": "12-9_months_before", "priority": "high", "dueDate": "${safeDate}", "completed": false, "category": "Planning" }
  ],
  "dayOfSchedule": [
    { "id": "d1", "time": "10:00 AM", "endTime": "11:30 AM", "activity": "Activity Name", "location": "Main Hall", "teamLead": "Lead Coordinator" }
  ],
  "vendors": [
    { "id": "v1", "name": "Vendor Name", "category": "Catering & Bar", "contactName": "Contact Person", "email": "info@example.com", "phone": "555-0192", "estimatedFee": 3000, "status": "researching", "contractSigned": false, "deliverables": [{"id": "vd1", "task": "Deliverable 1", "isDone": false}] }
  ],
  "personalizedIdeas": {
    "themeName": "Theme Concept",
    "vibeDescription": "Atmosphere description",
    "colorPalette": [
      { "name": "Color Name", "hex": "#2D4A3E", "role": "Primary Accent" }
    ],
    "decorConcepts": [
      { "id": "dc1", "area": "Entrance", "conceptTitle": "Title", "description": "Details", "diyTip": "Cost saving trick", "estimatedCost": 200 }
    ],
    "menuItems": [
      { "id": "mi1", "course": "Main Entrée", "dishName": "Dish Name", "description": "Dish description", "dietaryTags": ["Vegetarian"] }
    ],
    "beverages": [
      { "id": "bv1", "name": "Signature Drink", "type": "Signature Cocktail", "ingredients": "Ingredients", "flavorProfile": "Profile" }
    ],
    "musicPlaylist": {
      "vibeSummary": "Music summary",
      "recommendedGenres": ["Genre1", "Genre2"],
      "sampleTracks": [
        { "phase": "Peak Dance Party", "songIdea": "Song Title", "artist": "Artist" }
      ]
    }
  },
  "contingencyPlans": [
    { "id": "cp1", "riskCategory": "Weather & Climate", "severity": "medium", "triggerCondition": "Rain forecasted", "actionPlan": "Deploy tents", "responsibleLead": "Site Coordinator" }
  ]
}
`;

    const systemInstruction = `You are Occasio AI, an elite professional celebration architect. Output ONLY valid JSON adhering to the specified schema with realistic budget distributions (Venue ~30%, Catering ~35%, Decor ~12%, Music ~8%, Photo ~10%, Contingency ~5%).`;

    // Heuristic fallback generator
    const fallbackGenerator = (): Partial<EventPlan> => {
      const bVenue = Math.round(safeBudget * 0.28);
      const bCatering = Math.round(safeBudget * 0.34);
      const bPhoto = Math.round(safeBudget * 0.12);
      const bDecor = Math.round(safeBudget * 0.10);
      const bMusic = Math.round(safeBudget * 0.08);
      const bStationery = Math.round(safeBudget * 0.03);
      const bContingency = safeBudget - (bVenue + bCatering + bPhoto + bDecor + bMusic + bStationery);

      return {
        id: `custom-event-${Date.now()}`,
        title: `${safeStyle} ${safeType.charAt(0).toUpperCase() + safeType.slice(1)} Celebration`,
        eventType: safeType as any,
        targetDate: safeDate,
        startTime: '16:00',
        city: safeCity,
        venueName: `${safeCity} Heritage Pavilion`,
        guestCount: safeGuests,
        totalBudget: safeBudget,
        currency: 'USD',
        aestheticStyle: safeStyle,
        culturalOrDietaryNotes: safeNotes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        budgetItems: [
          { id: 'fb1', category: 'Venue & Rentals', name: 'Private Pavilion & Garden Lawn Booking', estimatedCost: bVenue, actualCost: bVenue, paidAmount: Math.round(bVenue * 0.5), status: 'deposit_paid' },
          { id: 'fb2', category: 'Catering & Bar', name: `Catered Dinner & Beverage Package (${safeGuests} guests)`, estimatedCost: bCatering, actualCost: bCatering, paidAmount: 0, status: 'planned' },
          { id: 'fb3', category: 'Photography & Film', name: 'Full Event Photojournalism Coverage', estimatedCost: bPhoto, actualCost: bPhoto, paidAmount: 0, status: 'planned' },
          { id: 'fb4', category: 'Florals & Decor', name: 'Ambient Centerpieces, Lighting & Entrance Arch', estimatedCost: bDecor, actualCost: bDecor, paidAmount: 0, status: 'planned' },
          { id: 'fb5', category: 'Music & Entertainment', name: 'DJ Sound Rig & Evening Lighting Package', estimatedCost: bMusic, actualCost: bMusic, paidAmount: 0, status: 'planned' },
          { id: 'fb6', category: 'Invitations & Stationery', name: 'Digital & Printed Invitation Suites', estimatedCost: bStationery, actualCost: bStationery, paidAmount: bStationery, status: 'paid_in_full' },
          { id: 'fb7', category: 'Contingency Reserve', name: 'Emergency Weather & Unforeseen Reserve Buffer', estimatedCost: bContingency, actualCost: bContingency, paidAmount: 0, status: 'planned' }
        ],
        milestones: [
          { id: 'fm1', title: 'Confirm Venue Booking & Security Deposit', timeframe: '12-9_months_before', priority: 'high', dueDate: safeDate, completed: true, category: 'Venue', assignedTo: 'Lead Organizer' },
          { id: 'fm2', title: 'Finalize Catering Menu & Beverage Selection', timeframe: '6-3_months_before', priority: 'high', dueDate: safeDate, completed: false, category: 'Catering', assignedTo: 'Food Committee' },
          { id: 'fm3', title: 'Distribute Invitations & Track RSVPs', timeframe: '6-3_months_before', priority: 'high', dueDate: safeDate, completed: false, category: 'Guests', assignedTo: 'Host' },
          { id: 'fm4', title: 'Walkthrough with Sound & Lighting Tech Lead', timeframe: '1_month_before', priority: 'medium', dueDate: safeDate, completed: false, category: 'Production', assignedTo: 'Tech Lead' },
          { id: 'fm5', title: 'Final Vendor Call & Minute-by-Minute Run-of-Show Lock', timeframe: 'week_of', priority: 'high', dueDate: safeDate, completed: false, category: 'Coordination', assignedTo: 'Lead Organizer' }
        ],
        dayOfSchedule: [
          { id: 'fd1', time: '11:00 AM', endTime: '01:00 PM', activity: 'Vendor Setup & Sound Staging', location: 'Main Grounds', teamLead: 'Production Lead' },
          { id: 'fd2', time: '01:00 PM', endTime: '02:30 PM', activity: 'Decor Placement & Floral Styling', location: 'Main Hall', teamLead: 'Stylist Lead' },
          { id: 'fd3', time: '03:30 PM', endTime: '04:15 PM', activity: 'Guest Welcome & Signature Refreshments', location: 'Reception Terrace', teamLead: 'Welcome Host' },
          { id: 'fd4', time: '04:30 PM', endTime: '06:00 PM', activity: 'Main Ceremony / Program Highlights', location: 'Auditorium / Lawn', teamLead: 'Master of Ceremonies' },
          { id: 'fd5', time: '06:30 PM', endTime: '08:30 PM', activity: 'Dinner Celebration & Keynote Toasts', location: 'Dining Hall', teamLead: 'Head of Hospitality' },
          { id: 'fd6', time: '08:30 PM', endTime: '11:00 PM', activity: 'Open Dance Floor & Dessert Buffet', location: 'Main Dance Floor', teamLead: 'DJ & Lead Host' }
        ],
        vendors: [
          {
            id: 'fv1',
            name: `${safeCity} Premier Catering Co.`,
            category: 'Catering & Bar',
            contactName: 'Executive Chef Leo',
            email: 'events@premiercatering.example.com',
            phone: '555-0144',
            estimatedFee: bCatering,
            quotedFee: bCatering,
            status: 'quoted',
            contractSigned: false,
            deliverables: [
              { id: 'fvd1', task: 'Menu tasting scheduled', isDone: true },
              { id: 'fvd2', task: 'Dietary breakdown confirmed', isDone: false }
            ]
          },
          {
            id: 'fv2',
            name: 'Lumina Sound & Visuals',
            category: 'Music & Sound',
            contactName: 'Alex Mercer',
            email: 'booking@luminasound.example.com',
            phone: '555-0189',
            estimatedFee: bMusic,
            status: 'contacted',
            contractSigned: false,
            deliverables: [
              { id: 'fvd3', task: 'Acoustic power survey verified', isDone: false }
            ]
          }
        ],
        guests: [
          { id: 'fg1', name: 'Honored Guest Party 1', rsvpStatus: 'confirmed', plusOnes: 1, dietary: 'vegetarian', tableGroup: 'Table 1 - VIP' },
          { id: 'fg2', name: 'Family Group Alpha', rsvpStatus: 'confirmed', plusOnes: 2, dietary: 'none', tableGroup: 'Table 2 - Family' }
        ],
        tableAssignments: [
          { id: 'ft1', tableNumber: 1, tableName: 'VIP Head Table', capacity: 8, guestIds: ['fg1'] }
        ],
        personalizedIdeas: {
          themeName: `${safeStyle} Elegance`,
          vibeDescription: `An enchanting balance of warm social intimacy and sophisticated celebration celebrating ${safeType}.`,
          colorPalette: [
            { name: 'Heritage Indigo', hex: '#1E293B', role: 'Primary Accent' },
            { name: 'Champagne Gold', hex: '#D4AF37', role: 'Secondary Color' },
            { name: 'Alabaster Silk', hex: '#F8FAFC', role: 'Neutral Base' },
            { name: 'Warm Terracotta', hex: '#C2410C', role: 'Warm Pop' },
            { name: 'Deep Slate', hex: '#0F172A', role: 'Contrast' }
          ],
          decorConcepts: [
            { id: 'fdc1', area: 'Focal Installation', conceptTitle: 'Illuminated Monogram Arch & Floating Greenery', description: 'Curved botanical arch lit with warm incandescent fairy filaments and seasonal branches.', diyTip: 'Construct base frame with rebar conduit from hardware store for a fraction of rental rates.', estimatedCost: 350 }
          ],
          menuItems: [
            { id: 'fmi1', course: 'Main Entrée', dishName: 'Herb-Roasted Seasonal Medley & Glazed Tenderloin', description: 'Slow-roasted with rosemary demi-glace and blistered heirloom vegetables.', dietaryTags: ['Gluten-Free'] },
            { id: 'fmi2', course: 'Main Entrée', dishName: 'Truffled Wild Mushroom Gnocchi', description: 'Pan-fried potato gnocchi with aged parmesan and shaved fresh herbs.', dietaryTags: ['Vegetarian'] }
          ],
          beverages: [
            { id: 'fbv1', name: 'The Occasio Sparkler', type: 'Signature Cocktail', ingredients: 'Sparkling wine, blood orange reduction, fresh thyme sprig', flavorProfile: 'Crisp, citrusy, aromatic and celebratory' },
            { id: 'fbv2', name: 'Golden Hour Fizz', type: 'Signature Mocktail', ingredients: 'Meyer lemon, lavender honey, club soda, crushed ice', flavorProfile: 'Floral, zesty, and refreshing' }
          ],
          musicPlaylist: {
            vibeSummary: 'Modern elegance transitioning into an unforgettable dance floor celebration.',
            recommendedGenres: ['Acoustic Covers', 'Motown & Soul', 'Nu-Disco / Modern Pop'],
            sampleTracks: [
              { phase: 'Guest Arrival', songIdea: 'Sunny', artist: 'Bobby Hebb' },
              { phase: 'Peak Dance Party', songIdea: 'Levitating', artist: 'Dua Lipa' }
            ]
          }
        },
        contingencyPlans: [
          { id: 'fcp1', riskCategory: 'Weather & Climate', severity: 'medium', triggerCondition: 'Rain forecasted with >30% probability', actionPlan: 'Pre-book marquee tent sidewalls and outdoor radiant heaters.', responsibleLead: 'Site Lead' },
          { id: 'fcp2', riskCategory: 'Power & AV Outage', severity: 'high', triggerCondition: 'Breaker failure during key program segment', actionPlan: 'Maintain portable lithium backup station dedicated to MC microphone.', responsibleLead: 'Tech Coordinator' }
        ]
      };
    };

    const planData = await callGeminiWithTimeout<Partial<EventPlan>>(
      prompt,
      systemInstruction,
      fallbackGenerator,
      true
    );

    res.json({ success: true, plan: planData });
  } catch (error: any) {
    console.error('[API] /generate-event-plan error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal error' });
  }
});

/**
 * Route: AI Cost Optimizer & Budget Benchmark Analysis
 */
app.post('/api/ai/optimize-budget', async (req: Request, res: Response) => {
  try {
    const { budgetItems, totalBudget, eventType, guestCount } = req.body;

    const safeBudget = Number(totalBudget) || 10000;
    const safeType = String(eventType || 'event');
    const safeGuests = Number(guestCount) || 100;

    const prompt = `
Analyze this event budget for a ${safeType} ($${safeBudget} total budget, ${safeGuests} guests):
Current line items:
${JSON.stringify(budgetItems || [], null, 2)}

Provide actionable cost optimization advice in JSON format matching CostOptimizationAdvice:
{
  "summary": "High-level audit summary highlighting 2-3 key leverage points",
  "identifiedRiskCount": 3,
  "estimatedSavingsPotential": 1800,
  "recommendations": [
    {
      "category": "Catering & Bar",
      "observation": "Catering is 48% of budget, above typical 35-40% benchmark.",
      "actionableTradeOff": "Switch from full open bar to signature cocktails + craft beer & wine; offer family-style feast instead of plated 4-course service.",
      "estimatedSavings": 1200,
      "priority": "high"
    }
  ]
}
`;

    const systemInstruction = 'You are a veteran high-end event financial strategist. Provide concrete, realistic trade-offs that preserve guest experience while trimming budget.';

    const fallbackAdvice = (): CostOptimizationAdvice => ({
      summary: `Our audit evaluated your $${safeBudget.toLocaleString()} budget across industry standards. By executing strategic vendor renegotiations and beverage package restructuring, we estimate you can recover 8–15% without sacrificing guest delight.`,
      identifiedRiskCount: 3,
      estimatedSavingsPotential: Math.round(safeBudget * 0.11),
      recommendations: [
        {
          category: 'Catering & Bar',
          observation: 'Beverage & bar markup is typically the single largest variable cost source.',
          actionableTradeOff: 'Limit full-bar spirits to a 2-hour cocktail window, then transition to signature cocktails, craft cider, and regional wines.',
          estimatedSavings: Math.round(safeBudget * 0.05),
          priority: 'high'
        },
        {
          category: 'Florals & Decor',
          observation: 'Single-use cut florals command high labor and cold-chain transport fees.',
          actionableTradeOff: 'Adopt living potted plants, architectural greenery runners, and warm pillar candle clusters that can be gifted to VIP guests afterward.',
          estimatedSavings: Math.round(safeBudget * 0.035),
          priority: 'medium'
        },
        {
          category: 'Invitations & Stationery',
          observation: 'Heavy cardstock foil stamping and bespoke postal postage incur high friction.',
          actionableTradeOff: 'Deploy digital save-the-dates with interactive RSVP collection, reserving printed suites strictly for keepsake day-of menus.',
          estimatedSavings: Math.round(safeBudget * 0.015),
          priority: 'low'
        }
      ]
    });

    const result = await callGeminiWithTimeout<CostOptimizationAdvice>(
      prompt,
      systemInstruction,
      fallbackAdvice,
      true
    );

    res.json({ success: true, advice: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Route: AI Vendor Assistant (RFP Draft, Contract Audit, Price Negotiation)
 */
app.post('/api/ai/vendor-assistant', async (req: Request, res: Response) => {
  try {
    const { actionType, vendorName, vendorCategory, eventDetails, userNotes } = req.body;

    const safeAction = String(actionType || 'rfp'); // 'rfp' | 'contract_audit' | 'negotiation'
    const safeVendor = String(vendorName || 'Prospective Vendor').slice(0, 100);
    const safeCat = String(vendorCategory || 'Services').slice(0, 100);
    const safeNotes = String(userNotes || '').slice(0, 500);

    let prompt = '';
    let systemInstruction = 'You are an experienced event producer and contract specialist. Provide clear, courteous, and highly professional correspondence.';

    if (safeAction === 'rfp') {
      prompt = `Draft a polite, professional Request For Proposal (RFP) to ${safeVendor} (${safeCat}). Event details: ${JSON.stringify(eventDetails)}. Additional notes: ${safeNotes}. Include clear scope, requested itemized quote, insurance requirement, and timeline.`;
    } else if (safeAction === 'contract_audit') {
      prompt = `Provide a checklist of critical contract clauses and hidden red flags to check before signing with ${safeVendor} (${safeCat}). Check overtime billing rates, cancellation/force majeure terms, meal requirements for vendor crew, load-in grace periods, and liability indemnification.`;
    } else {
      prompt = `Draft a respectful, diplomatic price negotiation message to ${safeVendor} (${safeCat}) proposing specific scope adjustments to reduce the quote by 10-15% while keeping the relationship warm.`;
    }

    const fallbackResponse = () => {
      if (safeAction === 'rfp') {
        return `Dear ${safeVendor} Team,\n\nI hope this message finds you well. We are currently organizing an upcoming celebration in ${eventDetails?.city || 'our area'} on ${eventDetails?.targetDate || 'the designated date'} with approximately ${eventDetails?.guestCount || 100} guests.\n\nWe have long admired your work in ${safeCat} and would love to inquire about your availability and receiving an itemized quote for our event.\n\nKey Parameters:\n- Date: ${eventDetails?.targetDate || 'TBD'}\n- Guest Count: ${eventDetails?.guestCount || 100}\n- Aesthetic Style: ${eventDetails?.aestheticStyle || 'Elegant & Memorable'}\n\nCould you please share your service packages, deliverable timelines, and confirmation of standard commercial liability insurance?\n\nWarm regards,\nEvent Planning Committee`;
      } else if (safeAction === 'contract_audit') {
        return `### Critical Contract Audit Checklist for ${safeVendor}:\n\n1. **Overtime Clock & Grace Period**: Confirm exact hourly rate for setup delays ($150–$300/hr is standard). Ensure a 30-minute grace period before overtime kicks in.\n2. **Force Majeure & Rescheduling Policy**: Ensure deposits can be applied to an alternate date within 12 months in the event of severe weather or health emergencies.\n3. **Deliverable Acceptance & Timelines**: For photography or rentals, specify exact delivery windows (e.g., photo gallery within 30 days; rental pickup by 11:30 PM).\n4. **Crew Meal Requirements**: Verify if hot meals are contractual for staff working 5+ consecutive hours.\n5. **Certificate of Insurance (COI)**: Confirm they will name the venue as additional insured at least 14 days prior.`;
      } else {
        return `Dear ${safeVendor} Team,\n\nThank you so much for putting together such a thoughtful quote. We are genuinely excited about the possibility of collaborating with you for our celebration.\n\nWe are currently balancing our overall budget cap and were wondering if there might be room for a slight adjustment in scope to bring the total closer to our target (approximately a 10% reduction). For example:\n- Streamlining on-site crew hours from 8 hours to 6 hours\n- Providing equipment during standard setup windows\n- Flexible payment milestone scheduling\n\nWe would love to find a win-win that honors your craftsmanship while aligning with our budget parameters. Let us know your thoughts!\n\nWarm regards,\nEvent Planning Committee`;
      }
    };

    const generatedText = await callGeminiWithTimeout<string>(
      prompt,
      systemInstruction,
      fallbackResponse,
      false
    );

    res.json({ success: true, result: generatedText });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Route: AI Toast, Vow & Speech Writer
 */
app.post('/api/ai/speech-writer', async (req: Request, res: Response) => {
  try {
    const { speakerRole, tone, targetDurationMinutes, honoreeNames, relationshipStories, eventType } = req.body;

    const safeRole = String(speakerRole || 'Best Friend / Toastmaster').slice(0, 100);
    const safeTone = String(tone || 'heartfelt').slice(0, 50);
    const safeMinutes = Math.min(Math.max(Number(targetDurationMinutes) || 3, 1), 10);
    const safeHonorees = String(honoreeNames || 'The Celebrants').slice(0, 100);
    const safeStories = String(relationshipStories || 'Sharing memories of kindness and joyful laughter').slice(0, 500);

    const prompt = `
Write an extraordinary speech / toast for a ${eventType || 'celebration'}:
Speaker Role: ${safeRole}
Target Duration: ${safeMinutes} minute(s) (approx ${safeMinutes * 130} words)
Tone: ${safeTone} (heartfelt, witty, inspiring, or poetic)
Honorees: ${safeHonorees}
Key memories & stories to weave in: ${safeStories}

Output a JSON object matching SpeechScript:
{
  "title": "Speech Title",
  "speakerRole": "${safeRole}",
  "tone": "${safeTone}",
  "targetDurationMinutes": ${safeMinutes},
  "wordCount": 380,
  "stageCues": ["[Smile at the room]", "[Pause for laughter]", "[Turn towards honorees]", "[Raise glass high]"],
  "fullSpeech": "Full speech text formatted with paragraph breaks and embedded delivery cues in brackets..."
}
`;

    const systemInstruction = 'You are a world-class speechwriter known for touching, memorable, humorous, and eloquent event toasts. Avoid clichés; weave in authentic human warmth.';

    const fallbackSpeech = (): SpeechScript => ({
      title: `A Toast to ${safeHonorees}: Love, Laughter & Golden Days`,
      speakerRole: safeRole,
      tone: safeTone as any,
      targetDurationMinutes: safeMinutes,
      wordCount: 320,
      stageCues: [
        '[Step up to the microphone, smile, and make eye contact with the room]',
        '[Pause for warm smiles]',
        '[Turn directly toward honorees]',
        '[Deliver punchline with a mischievous wink, pause for laughter]',
        '[Slow down pace, speaking from the heart]',
        '[Raise glass high above shoulder]'
      ],
      fullSpeech: `Good evening, everyone. [Step up to the microphone, smile, and make eye contact with the room]\n\nFor those who haven't had the chance to meet me yet, I have the absolute privilege of standing here as ${safeRole} for ${safeHonorees}.\n\nWhen I first started thinking about what to say tonight, I remembered why we are all gathered in this room. Celebrations like this don't just happen because of calendars or dates. They happen because two extraordinary souls have brought together the people they cherish most. [Pause for warm smiles]\n\n${safeStories ? `Thinking back to our memories—${safeStories}—it's impossible not to smile. You bring a warmth into every room you enter, and watching you today reminds all of us what genuine happiness looks like.` : `Watching you both today reminds every single one of us of the power of genuine connection, radiant humor, and unwavering loyalty.`}\n\n[Turn directly toward honorees] You inspire everyone around you to live with more generosity, laugh a little louder, and never take a single golden moment for granted.\n\n[Slow down pace, speaking from the heart] May your journey ahead be blessed with good health, deep laughter on quiet Tuesday evenings, and adventures that take your breath away.\n\nEveryone, please join me in raising your glasses. [Raise glass high above shoulder]\n\nTo ${safeHonorees}—to your health, your happiness, and the unforgettable lifetime ahead. Cheers!`
    });

    const result = await callGeminiWithTimeout<SpeechScript>(
      prompt,
      systemInstruction,
      fallbackSpeech,
      true
    );

    res.json({ success: true, speech: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Route: Real-Time AI Co-Planner Concierge Chat
 */
app.post('/api/ai/concierge', async (req: Request, res: Response) => {
  try {
    const { message, eventContext } = req.body;

    const safeMsg = String(message || '').slice(0, 1000);
    if (!safeMsg) {
      res.status(400).json({ error: 'Message cannot be empty' });
      return;
    }

    const prompt = `
User question: "${safeMsg}"

Active Event Context:
- Title: ${eventContext?.title || 'Current Event'}
- Type: ${eventContext?.eventType || 'Celebration'}
- Budget: $${eventContext?.totalBudget || 0} (${eventContext?.currency || 'USD'})
- Guests: ${eventContext?.guestCount || 0}
- Date: ${eventContext?.targetDate || 'TBD'}
- City: ${eventContext?.city || 'Local'}
- Style: ${eventContext?.aestheticStyle || 'Elegant'}

Provide a direct, practical, inspiring, and concise answer with actionable bullet points.
`;

    const systemInstruction = 'You are the Occasio AI Concierge—an empathetic, hyper-organized event producer and creative director. Always ground your advice in the event\'s budget, guest count, and style.';

    const fallbackChat = () => {
      const q = safeMsg.toLowerCase();
      if (q.includes('weather') || q.includes('rain')) {
        return `Here is your fast weather contingency plan for **${eventContext?.title || 'your event'}**:\n\n1. **48-Hour Decision Cutoff**: Set a firm go/no-go deadline 48 hours prior with your venue and tent supplier.\n2. **Covered Transitions**: Ensure walkways between parking, ceremony, and dining have clear umbrella stations or pop-up canopies.\n3. **Acoustic Protection**: Rent waterproof slipcovers for speaker cabs and ground power junction boxes.\n4. **Guest Comfort**: Prepare a basket of warm pashminas or clear umbrellas for stunning rain photography!`;
      }
      if (q.includes('budget') || q.includes('save') || q.includes('cost')) {
        return `To protect your **$${eventContext?.totalBudget?.toLocaleString() || '10,000'}** budget cap:\n\n- **Beverage Restructuring**: Stick to a curated wine, beer, and 2 signature cocktails formula instead of a top-shelf open bar (saves ~15–20%).\n- **Repurpose Florals**: Move ceremony aisle arrangements to the head table and bar during the cocktail changeover.\n- **Digital RSVP**: Eliminate printed response cards and return postage by routing guests to a seamless digital RSVP portal.`;
      }
      return `For **${eventContext?.title || 'your celebration'}**, the most important next step is ensuring vendor communication and day-of timelines are locked in. Would you like me to draft an RFP, generate a toast, or run a budget optimization audit for your line items?`;
    };

    const reply = await callGeminiWithTimeout<string>(
      prompt,
      systemInstruction,
      fallbackChat,
      false
    );

    res.json({ success: true, reply });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// STATIC FILES & VITE DEV SERVER INTEGRATION
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Occasio AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Occasio AI] Failed to start server:', err);
  process.exit(1);
});
