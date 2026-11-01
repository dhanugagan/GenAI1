/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventPlan } from '../types';

export const SAMPLE_EVENTS: EventPlan[] = [
  // 1. Botanical Glasshouse Wedding
  {
    id: 'wedding-botanical-glasshouse',
    title: 'Elena & Julian: Botanical Glasshouse Wedding',
    eventType: 'wedding',
    targetDate: '2027-06-19',
    startTime: '15:30',
    city: 'San Francisco, CA',
    venueName: 'Conservatory of Flowers Pavilion',
    guestCount: 110,
    totalBudget: 34000,
    currency: 'USD',
    aestheticStyle: 'Ethereal Botanical, Living Moss, Brass Accents & Candlelight',
    culturalOrDietaryNotes: 'Seasonal farm-to-table, Mediterranean influence, 18 vegetarian, 6 gluten-free guests',
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-10-28T14:30:00Z',
    budgetItems: [
      { id: 'b1', category: 'Venue & Rentals', name: 'Glasshouse Conservatory Rental (10 hrs)', estimatedCost: 7500, actualCost: 7500, paidAmount: 7500, status: 'paid_in_full', dueBy: '2026-12-01' },
      { id: 'b2', category: 'Catering & Bar', name: 'Farm-to-Table Dinner & Natural Wine Bar (110 pax)', estimatedCost: 11500, actualCost: 11800, paidAmount: 6000, status: 'deposit_paid', dueBy: '2027-05-15' },
      { id: 'b3', category: 'Florals & Decor', name: 'Hanging Fern Chandeliers & Tabletop Moss Runners', estimatedCost: 4200, actualCost: 3900, paidAmount: 2000, status: 'deposit_paid', dueBy: '2027-04-01' },
      { id: 'b4', category: 'Photography & Film', name: 'Full-Day 35mm & Digital Documentary Coverage', estimatedCost: 3800, actualCost: 3800, paidAmount: 1900, status: 'deposit_paid', dueBy: '2027-05-01' },
      { id: 'b5', category: 'Music & Entertainment', name: 'Acoustic Guitar Duo + Evening Soul Vinyl DJ', estimatedCost: 2400, actualCost: 2200, paidAmount: 1100, status: 'deposit_paid', dueBy: '2027-05-10' },
      { id: 'b6', category: 'Attire & Beauty', name: 'Bespoke Linen Suit & Silk Gown Tailoring', estimatedCost: 2200, actualCost: 2100, paidAmount: 2100, status: 'paid_in_full', dueBy: '2027-03-15' },
      { id: 'b7', category: 'Invitations & Stationery', name: 'Plantable Seed Paper Suites & Calligraphy Placecards', estimatedCost: 700, actualCost: 650, paidAmount: 650, status: 'paid_in_full', dueBy: '2027-02-01' },
      { id: 'b8', category: 'Permits & Insurance', name: 'Golden Gate Park Event Permit & City Liability Policy', estimatedCost: 600, actualCost: 550, paidAmount: 550, status: 'paid_in_full', dueBy: '2027-01-10' },
      { id: 'b9', category: 'Contingency Reserve', name: 'Weather Heaters & Emergency Buffer', estimatedCost: 1100, actualCost: 600, paidAmount: 0, status: 'planned', dueBy: '2027-06-01' }
    ],
    milestones: [
      { id: 'm1', title: 'Confirm Conservatory Booking & Deposit', timeframe: '12-9_months_before', priority: 'high', dueDate: '2026-10-30', completed: true, category: 'Venue', assignedTo: 'Elena' },
      { id: 'm2', title: 'Book Photographer & Schedule Engagement Session', timeframe: '12-9_months_before', priority: 'high', dueDate: '2026-11-15', completed: true, category: 'Photography', assignedTo: 'Julian' },
      { id: 'm3', title: 'Catering Menu Tasting & Seasonal Pairing Selection', timeframe: '6-3_months_before', priority: 'high', dueDate: '2027-02-10', completed: true, category: 'Catering', assignedTo: 'Elena & Julian' },
      { id: 'm4', title: 'Send Seed Paper Save-the-Dates & Launch RSVP Portal', timeframe: '6-3_months_before', priority: 'medium', dueDate: '2027-02-28', completed: true, category: 'Stationery', assignedTo: 'Julian' },
      { id: 'm5', title: 'Final Floral Mockup & Lighting Lumens Walkthrough', timeframe: '6-3_months_before', priority: 'medium', dueDate: '2027-03-20', completed: false, category: 'Decor', assignedTo: 'Florist Clara' },
      { id: 'm6', title: 'Final Headcount & Dietary Manifest Lock to Caterer', timeframe: '1_month_before', priority: 'high', dueDate: '2027-05-19', completed: false, category: 'Catering', assignedTo: 'Coordinator Sarah' },
      { id: 'm7', title: 'Apply for SF Park Acoustic Sound Decibel Permit', timeframe: '1_month_before', priority: 'high', dueDate: '2027-05-25', completed: false, category: 'Permits', assignedTo: 'Julian' },
      { id: 'm8', title: 'Compile Final Day-of Run-of-Show & Distribute to Vendors', timeframe: 'week_of', priority: 'high', dueDate: '2027-06-14', completed: false, category: 'Planning', assignedTo: 'Coordinator Sarah' },
      { id: 'm9', title: 'Rehearsal Walkthrough & Bridal Party Welcome Toast', timeframe: 'day_before', priority: 'medium', dueDate: '2027-06-18', completed: false, category: 'Logistics', assignedTo: 'All Leads' }
    ],
    dayOfSchedule: [
      { id: 'd1', time: '10:00 AM', endTime: '12:30 PM', activity: 'Load-in & Florist Moss Installation', location: 'Glasshouse Pavilion', teamLead: 'Florist Clara', notes: 'Ensure scissor lift is parked outside east door.' },
      { id: 'd2', time: '12:30 PM', endTime: '02:00 PM', activity: 'Catering Prep & Bar Setup', location: 'Catering Annex Kitchen', teamLead: 'Chef Martin', notes: 'Check refrigeration temperatures and stemware count.' },
      { id: 'd3', time: '02:00 PM', endTime: '03:15 PM', activity: 'First Look & Couple Portraits', location: 'Redwood Dahlia Garden', teamLead: 'Photographer Marco', notes: 'Capture natural golden afternoon light.' },
      { id: 'd4', time: '03:30 PM', endTime: '04:00 PM', activity: 'Guest Arrival & Welcome Spritz', location: 'Sunlit Courtyard', teamLead: 'Lead Host Maya', notes: 'Acoustic duo begins ambient fingerpicking set.' },
      { id: 'd5', time: '04:15 PM', endTime: '04:50 PM', activity: 'Ceremony & Vow Exchange', location: 'Glasshouse Center Altar', teamLead: 'Officiant David', notes: 'Microphone on channel 1; moss aisle markers kept clear.' },
      { id: 'd6', time: '05:00 PM', endTime: '06:30 PM', activity: 'Golden Hour Cocktails & Passed Canapés', location: 'Outdoor Terrace', teamLead: 'Chef Martin & Sommelier', notes: 'Fig crostini and botanical gin spritz circulating.' },
      { id: 'd7', time: '06:45 PM', endTime: '08:30 PM', activity: 'Plated Family-Style Dinner & Toasts', location: 'Main Conservatory Hall', teamLead: 'Coordinator Sarah', notes: 'Speeches capped at 4 min each; champagne pre-poured.' },
      { id: 'd8', time: '08:30 PM', endTime: '11:00 PM', activity: 'Vinyl DJ Soul Set & Open Dance Floor', location: 'Main Pavilion', teamLead: 'DJ Andre', notes: 'Sparkler sendoff staging at 10:45 PM.' }
    ],
    vendors: [
      {
        id: 'v1',
        name: 'Bloom & Moss Floral Studio',
        category: 'Florals & Decor',
        contactName: 'Clara Vance',
        email: 'clara@bloomandmoss.com',
        phone: '(415) 882-9014',
        website: 'https://bloomandmoss.example.com',
        estimatedFee: 4200,
        quotedFee: 3900,
        status: 'booked_and_locked',
        contractSigned: true,
        deliverables: [
          { id: 'vd1', task: 'Sample arch mock-up photos approved', isDone: true },
          { id: 'vd2', task: 'Proof of commercial liability insurance delivered to venue', isDone: true },
          { id: 'vd3', task: '12 botanical centerpieces and bridal bouquet delivered on time', isDone: false }
        ]
      },
      {
        id: 'v2',
        name: 'Heirloom Table Gastronomy',
        category: 'Catering & Bar',
        contactName: 'Chef Martin Ramos',
        email: 'martin@heirloomtable.com',
        phone: '(415) 701-4450',
        website: 'https://heirloomtable.example.com',
        estimatedFee: 11500,
        quotedFee: 11800,
        status: 'booked_and_locked',
        contractSigned: true,
        deliverables: [
          { id: 'vd4', task: 'Tasting completed & wine pairing confirmed', isDone: true },
          { id: 'vd5', task: 'Dietary allergen manifest confirmed (18 veg, 6 GF)', isDone: false },
          { id: 'vd6', task: 'Staffing schedule for 8 servers and 2 bartenders finalized', isDone: false }
        ]
      },
      {
        id: 'v3',
        name: 'Marco Chen Analog & Digital',
        category: 'Photography & Film',
        contactName: 'Marco Chen',
        email: 'marco@chenvisuals.com',
        phone: '(510) 934-2190',
        website: 'https://chenvisuals.example.com',
        estimatedFee: 3800,
        quotedFee: 3800,
        status: 'booked_and_locked',
        contractSigned: true,
        deliverables: [
          { id: 'vd7', task: 'Engagement session delivered', isDone: true },
          { id: 'vd8', task: 'Must-have family shot list confirmed', isDone: true },
          { id: 'vd9', task: 'High-res gallery + 35mm roll scans delivered within 4 weeks', isDone: false }
        ]
      },
      {
        id: 'v4',
        name: 'Groove Collective Sound & Vinyl',
        category: 'Music & Sound',
        contactName: 'Andre Miller',
        email: 'andre@groovecollective.com',
        phone: '(415) 304-9811',
        estimatedFee: 2400,
        quotedFee: 2200,
        status: 'booked_and_locked',
        contractSigned: true,
        deliverables: [
          { id: 'vd10', task: 'Ceremony acoustic sound check scheduled', isDone: false },
          { id: 'vd11', task: 'Do-Not-Play list received', isDone: true }
        ]
      }
    ],
    guests: [
      { id: 'g1', name: 'Sophia Julian-Smith', email: 'sophia@example.com', rsvpStatus: 'confirmed', plusOnes: 1, dietary: 'vegetarian', tableGroup: 'Table 1 - Immediate Family' },
      { id: 'g2', name: 'Dr. Michael Chen', email: 'mchen@example.com', rsvpStatus: 'confirmed', plusOnes: 0, dietary: 'gluten_free', tableGroup: 'Table 2 - College Friends' },
      { id: 'g3', name: 'Amina Al-Mansoor', email: 'amina@example.com', rsvpStatus: 'confirmed', plusOnes: 1, dietary: 'halal', tableGroup: 'Table 3 - Architecture Colleagues' },
      { id: 'g4', name: 'Marcus Sterling', email: 'marcus@example.com', rsvpStatus: 'confirmed', plusOnes: 0, dietary: 'none', tableGroup: 'Table 1 - Immediate Family' },
      { id: 'g5', name: 'Chloe Dubois', email: 'chloe@example.com', rsvpStatus: 'pending', plusOnes: 1, dietary: 'vegan', tableGroup: 'Table 2 - College Friends' },
      { id: 'g6', name: 'Liam O’Connor', email: 'liam@example.com', rsvpStatus: 'declined', plusOnes: 0, dietary: 'none', tableGroup: 'Table 4 - Travel Pals' }
    ],
    tableAssignments: [
      { id: 't1', tableNumber: 1, tableName: 'The Magnolia Pavilion (Family)', capacity: 10, guestIds: ['g1', 'g4'] },
      { id: 't2', tableNumber: 2, tableName: 'The Fernery (College)', capacity: 8, guestIds: ['g2', 'g5'] },
      { id: 't3', tableNumber: 3, tableName: 'The Brass Orchard (Design)', capacity: 8, guestIds: ['g3'] }
    ],
    personalizedIdeas: {
      themeName: 'Verdant Solarium & Whispering Botanicals',
      vibeDescription: 'Lush architectural foliage, soft amber candlelight reflecting off vintage glass panes, and organic textures that blur indoors and outdoors.',
      colorPalette: [
        { name: 'Forest Moss', hex: '#2D4A3E', role: 'Primary Accent' },
        { name: 'Eucalyptus Sage', hex: '#879F89', role: 'Secondary Color' },
        { name: 'Linen Parchment', hex: '#F4EFEB', role: 'Neutral Base' },
        { name: 'Warm Burnished Brass', hex: '#C89B3C', role: 'Warm Pop' },
        { name: 'Deep Botanical Charcoal', hex: '#1C2622', role: 'Contrast' }
      ],
      decorConcepts: [
        { id: 'dc1', area: 'Ceremony Altar', conceptTitle: 'Living Moss & Wild Fern Circular Bower', description: 'Curved ground installation with potted heirloom maidenhair ferns, sheet moss, and pillar candles of varying heights.', diyTip: 'Rent potted ferns from a local nursery instead of cut florals; return them the next day for a 60% cost reduction.', estimatedCost: 750 },
        { id: 'dc2', area: 'Guest Tables', conceptTitle: 'Brass Taper Candlesticks with Eucalyptus Trails', description: 'Raw brass candelabras nested among silver dollar eucalyptus garlands with torn-edge handmade paper name tags.', diyTip: 'Thrift vintage brass candlesticks over several months or polish secondhand sets with lemon & baking soda.', estimatedCost: 400 },
        { id: 'dc3', area: 'Welcome Table', conceptTitle: 'Hand-Lettered Botanical Mirror Seating Chart', description: 'Ornate gilded mirror inscribed with white liquid chalk calligraphy indicating table groupings.', diyTip: 'Rent a floor mirror from an architectural salvage yard and print mirror decals instead of hand calligraphy.', estimatedCost: 180 }
      ],
      menuItems: [
        { id: 'm1', course: 'Canapés & Starters', dishName: 'Fig & Goat Cheese Crostini with Wild Thyme Honey', description: 'Grilled sourdough baguette topped with black mission figs, whipped chèvre, and local honeycomb.', dietaryTags: ['Vegetarian'] },
        { id: 'm2', course: 'Main Entrée', dishName: 'Crispy Pan-Seared King Salmon with Meyer Lemon Beurre Blanc', description: 'Wild-caught Pacific salmon over roasted fingerling potatoes and charred asparagus spears.', dietaryTags: ['Gluten-Free'] },
        { id: 'm3', course: 'Main Entrée', dishName: 'Wild Chanterelle Mushroom & Truffle Risotto', description: 'Creamy Arborio rice with foragers chanterelles, shaved pecorino, and crispy sage leaves.', dietaryTags: ['Vegetarian', 'Gluten-Free'] },
        { id: 'm4', course: 'Dessert & Cake', dishName: 'Cardamom Olive Oil Cake with Earl Grey Buttercream', description: 'Moist single-origin olive oil sponge accented with candied kumquats and edible pansies.', dietaryTags: ['Vegetarian'] }
      ],
      beverages: [
        { id: 'bev1', name: 'The Solarium Spritz', type: 'Signature Cocktail', ingredients: 'Botanical gin, St-Germain elderflower, prosecco, fresh cucumber ribbon, rosemary sprig', flavorProfile: 'Crisp, effervescent, floral, and herbaceous' },
        { id: 'bev2', name: 'Wild Bramble Elixir', type: 'Signature Mocktail', ingredients: 'Crushed blackberries, Meyer lemon juice, sparkling ginger beer, and crushed mint', flavorProfile: 'Tart, zesty, and refreshing with gentle warming ginger finish' }
      ],
      musicPlaylist: {
        vibeSummary: 'Warm indie acoustic and bossa nova transitions gracefully into upbeat 70s soul, motown, and modern nu-disco funk.',
        recommendedGenres: ['Indie Folk', 'Bossa Nova', 'Classic Soul & Motown', 'Nu-Disco / Funk'],
        sampleTracks: [
          { phase: 'Guest Arrival', songIdea: 'Aguas de Março', artist: 'Stan Getz & João Gilberto' },
          { phase: 'Ceremony / Grand Entrance', songIdea: 'Bloom (Acoustic)', artist: 'The Paper Kites' },
          { phase: 'Dinner & Mingle', songIdea: 'You Send Me', artist: 'Sam Cooke' },
          { phase: 'Peak Dance Party', songIdea: 'September', artist: 'Earth, Wind & Fire' },
          { phase: 'Farewell Sendoff', songIdea: 'This Must Be the Place', artist: 'Talking Heads' }
        ]
      }
    },
    contingencyPlans: [
      { id: 'cp1', riskCategory: 'Weather & Climate', severity: 'medium', triggerCondition: 'Rain forecasted with >40% probability 48h prior', actionPlan: 'Conservatory roof automatically handles downpours; deploy covered marquee walkway from main pavilion to parking lot.', responsibleLead: 'Coordinator Sarah' },
      { id: 'cp2', riskCategory: 'Power & AV Outage', severity: 'high', triggerCondition: 'Main generator glitch or breaker trip during dance set', actionPlan: 'Secondary 2000W battery inverter reserved in sound booth with acoustic battery-powered PA mic.', responsibleLead: 'DJ Andre' },
      { id: 'cp3', riskCategory: 'Vendor Default', severity: 'critical', triggerCondition: 'Caterer transport delay or vehicle breakdown', actionPlan: 'On-call local gourmet pizzeria partner & charcuterie backup within 15 min standby radius.', responsibleLead: 'Julian' }
    ]
  },

  // 2. Maya's 30th Birthday Bash
  {
    id: 'birthday-neon-oasis',
    title: 'Neon Oasis: Maya’s 30th Birthday Bash',
    eventType: 'birthday',
    targetDate: '2027-04-10',
    startTime: '19:30',
    city: 'Austin, TX',
    venueName: 'The Mohawk Rooftop Lounge & Terrace',
    guestCount: 50,
    totalBudget: 4800,
    currency: 'USD',
    aestheticStyle: 'Cyberpunk Neon, Retro Synthwave, Iridescent Mylar & Velvet',
    culturalOrDietaryNotes: 'Taco bar & craft margaritas, 10 vegan guests, dairy-free options required',
    createdAt: '2026-10-20T12:00:00Z',
    updatedAt: '2026-10-29T16:00:00Z',
    budgetItems: [
      { id: 'nb1', category: 'Venue & Rentals', name: 'Rooftop Lounge Reservation (5 hrs)', estimatedCost: 1500, actualCost: 1400, paidAmount: 1400, status: 'paid_in_full' },
      { id: 'nb2', category: 'Catering & Bar', name: 'Street Taco Truck & Custom Margarita Bar', estimatedCost: 1600, actualCost: 1650, paidAmount: 800, status: 'deposit_paid' },
      { id: 'nb3', category: 'Music & Entertainment', name: 'Live Indie Synthwave DJ & Lighting Rig', estimatedCost: 750, actualCost: 700, paidAmount: 350, status: 'deposit_paid' },
      { id: 'nb4', category: 'Florals & Decor', name: 'Custom "Level 30 Unlocked" LED Neon Sign & Glow Wall', estimatedCost: 550, actualCost: 520, paidAmount: 520, status: 'paid_in_full' },
      { id: 'nb5', category: 'Photography & Video', name: 'Polaroid Instant Camera Station & Film Packs', estimatedCost: 250, actualCost: 230, paidAmount: 230, status: 'paid_in_full' },
      { id: 'nb6', category: 'Contingency Reserve', name: 'Overtime buffer & late night snack fund', estimatedCost: 150, actualCost: 100, paidAmount: 0, status: 'planned' }
    ],
    milestones: [
      { id: 'nm1', title: 'Lock Mohawk Rooftop Deposit & Contract', timeframe: '6-3_months_before', priority: 'high', dueDate: '2027-01-15', completed: true, category: 'Venue', assignedTo: 'Maya' },
      { id: 'nm2', title: 'Order Custom "Level 30" Neon Sign from Maker', timeframe: '6-3_months_before', priority: 'high', dueDate: '2027-02-01', completed: true, category: 'Decor', assignedTo: 'Best Friend Sam' },
      { id: 'nm3', title: 'Confirm Taco Truck Menu (Vegan Jackfruit & Carnitas)', timeframe: '1_month_before', priority: 'high', dueDate: '2027-03-10', completed: false, category: 'Catering', assignedTo: 'Maya' },
      { id: 'nm4', title: 'Send Neon Digital Invites & Track Headcount', timeframe: '1_month_before', priority: 'medium', dueDate: '2027-03-15', completed: true, category: 'Guests', assignedTo: 'Sam' },
      { id: 'nm5', title: 'Purchase 6 Instax Cameras & 300 Exposure Film Packs', timeframe: 'week_of', priority: 'medium', dueDate: '2027-04-05', completed: false, category: 'Entertainment', assignedTo: 'Maya' }
    ],
    dayOfSchedule: [
      { id: 'nd1', time: '05:30 PM', endTime: '06:30 PM', activity: 'Load-in Neon Sign & DJ Audio Check', location: 'Mohawk Rooftop Stage', teamLead: 'DJ Sam & Tech Crew' },
      { id: 'nd2', time: '06:30 PM', endTime: '07:15 PM', activity: 'Taco Truck Arrives & Salsa Bar Staging', location: 'Lower Deck Terrace', teamLead: 'Chef Hector' },
      { id: 'nd3', time: '07:30 PM', endTime: '08:45 PM', activity: 'Guest Welcome, Neon Cocktails & Polaroid Wall', location: 'Rooftop Entrance', teamLead: 'Maya & Sam' },
      { id: 'nd4', time: '09:00 PM', endTime: '09:30 PM', activity: 'Surprise Roast & Toast Speech + Churro Birthday Tower', location: 'Center Lounge', teamLead: 'Sister Chloe' },
      { id: 'nd5', time: '09:30 PM', endTime: '01:00 AM', activity: 'Retro 80s/90s Synth Dance Marathon', location: 'Rooftop Dance Floor', teamLead: 'DJ Sam' }
    ],
    vendors: [
      {
        id: 'nv1',
        name: 'Taqueria El Sol Mobile',
        category: 'Catering & Bar',
        contactName: 'Hector Gutierrez',
        email: 'hector@taqueriaelsol.example.com',
        phone: '(512) 441-9023',
        estimatedFee: 1600,
        quotedFee: 1650,
        status: 'booked_and_locked',
        contractSigned: true,
        deliverables: [
          { id: 'nvd1', task: 'Fresh guacamole and chips station', isDone: true },
          { id: 'nvd2', task: 'Churro tower with salted caramel dipping sauces', isDone: false }
        ]
      },
      {
        id: 'nv2',
        name: 'LaserWave Lighting & Audio Austin',
        category: 'Lighting & AV',
        contactName: 'Jordan Vance',
        email: 'jordan@laserwave.example.com',
        phone: '(512) 809-1122',
        estimatedFee: 750,
        quotedFee: 700,
        status: 'booked_and_locked',
        contractSigned: true,
        deliverables: [
          { id: 'nvd3', task: 'Mount custom acrylic neon sign with dimming switch', isDone: false }
        ]
      }
    ],
    guests: [
      { id: 'ng1', name: 'Sam Rivera', email: 'sam@example.com', rsvpStatus: 'confirmed', plusOnes: 1, dietary: 'vegan', tableGroup: 'VIP Birthday Squad' },
      { id: 'ng2', name: 'Chloe Lin', email: 'chloe@example.com', rsvpStatus: 'confirmed', plusOnes: 0, dietary: 'dairy_free', tableGroup: 'VIP Birthday Squad' },
      { id: 'ng3', name: 'Tyler Brooks', email: 'tyler@example.com', rsvpStatus: 'confirmed', plusOnes: 1, dietary: 'none', tableGroup: 'High School Crew' }
    ],
    tableAssignments: [
      { id: 'nt1', tableNumber: 1, tableName: 'VIP Neon Booth', capacity: 12, guestIds: ['ng1', 'ng2'] }
    ],
    personalizedIdeas: {
      themeName: 'Electric Oasis & 90s Neon Retrograde',
      vibeDescription: 'Pulsing magenta and cyan glow, vintage arcade game cabinets, holographic photo backdrops, and infectious dance vibes.',
      colorPalette: [
        { name: 'Neon Cyber Magenta', hex: '#FF007F', role: 'Primary Accent' },
        { name: 'Electric Cyan', hex: '#00F0FF', role: 'Secondary Color' },
        { name: 'Midnight Obsidian', hex: '#0D0F14', role: 'Neutral Base' },
        { name: 'Ultra Violet', hex: '#7928CA', role: 'Warm Pop' },
        { name: 'Iridescent Chrome', hex: '#E2E8F0', role: 'Contrast' }
      ],
      decorConcepts: [
        { id: 'ndc1', area: 'Photo Wall', conceptTitle: 'Holographic Fringe & Neon Typography Backdrop', description: 'Multi-layered metallic fringe curtains illuminated by blacklight and a custom LED glowing marquee.', diyTip: 'Purchase iridescent door foil curtains from party wholesalers and cluster them 3 layers deep for full opacity.', estimatedCost: 95 },
        { id: 'ndc2', area: 'Cocktail Tables', conceptTitle: 'Geometric Terrariums with Glow Stones', description: 'Glass dodecahedrons filled with activated blacklight pebbles and battery mini-fairy lights.', diyTip: 'Spray thrifted geometric glassware with frosted glass paint for soft diffused neon radiance.', estimatedCost: 65 }
      ],
      menuItems: [
        { id: 'nm1', course: 'Main Entrée', dishName: 'Al Pastor & Citrus Mojo Jackfruit Street Tacos', description: 'Charred corn tortillas, pineapple salsa, cilantro, and chipotle emulsion.', dietaryTags: ['Vegan', 'Gluten-Free'] },
        { id: 'nm2', course: 'Dessert & Cake', dishName: 'Warm Cinnamon Churro Tower with Dulce de Leche', description: 'Crispy fried churro spirals dusted with raw cinnamon sugar and chili-chocolate drizzle.', dietaryTags: ['Vegetarian'] }
      ],
      beverages: [
        { id: 'nbev1', name: 'Neon Dragon Paloma', type: 'Signature Cocktail', ingredients: 'Blanco tequila, pink grapefruit soda, dragonfruit purée, black lava salt rim', flavorProfile: 'Vibrant pink, smoky-sweet, citrusy and fizzy' },
        { id: 'nbev2', name: 'Electric Violet Spritzer', type: 'Signature Mocktail', ingredients: 'Butterfly pea flower tea, lemonade, sparkling water, mint sprig', flavorProfile: 'Color-changing purple to magenta, floral and citrus punch' }
      ],
      musicPlaylist: {
        vibeSummary: 'Daft Punk, The Weeknd, Dua Lipa, and 80s synth-pop gems that keep energy at a constant peak.',
        recommendedGenres: ['Synthwave', 'French House', 'Electro Pop', 'Nu-Disco'],
        sampleTracks: [
          { phase: 'Guest Arrival', songIdea: 'Nightcall', artist: 'Kavinsky' },
          { phase: 'Dinner & Mingle', songIdea: 'Music Sounds Better with You', artist: 'Stardust' },
          { phase: 'Peak Dance Party', songIdea: 'Physical', artist: 'Dua Lipa' }
        ]
      }
    },
    contingencyPlans: [
      { id: 'ncp1', riskCategory: 'Weather & Climate', severity: 'medium', triggerCondition: 'Texas wind speeds exceeding 25 mph', actionPlan: 'Drop retractable clear vinyl rooftop wind screens and anchor freestanding light bars.', responsibleLead: 'Mohawk Venue Manager' }
    ]
  },

  // 3. Oakridge Green Harvest & Community Block Fair
  {
    id: 'community-oakridge-harvest',
    title: 'Oakridge Green Harvest & Community Block Fair',
    eventType: 'community',
    targetDate: '2027-09-25',
    startTime: '10:00',
    city: 'Portland, OR',
    venueName: 'Oakridge Memorial Park & Meadow',
    guestCount: 350,
    totalBudget: 8500,
    currency: 'USD',
    aestheticStyle: 'Rustic Eco-Market, Burlap Pennants, Sunflower Hay Bales & Live Bluegrass',
    culturalOrDietaryNotes: 'Family-friendly community gathering, local farm stands, zero-waste composting stations',
    createdAt: '2026-10-10T09:00:00Z',
    updatedAt: '2026-10-25T11:00:00Z',
    budgetItems: [
      { id: 'cb1', category: 'Venue & Rentals', name: 'City Park Permit, Staging & Restroom Portables', estimatedCost: 2200, actualCost: 2100, paidAmount: 2100, status: 'paid_in_full' },
      { id: 'cb2', category: 'Music & Entertainment', name: 'Local 4-Piece Bluegrass String Band & Sound PA', estimatedCost: 1400, actualCost: 1350, paidAmount: 675, status: 'deposit_paid' },
      { id: 'cb3', category: 'Florals & Decor', name: 'Straw Bales, Heirloom Pumpkins & Sunflowers', estimatedCost: 800, actualCost: 750, paidAmount: 750, status: 'paid_in_full' },
      { id: 'cb4', category: 'Catering & Bar', name: 'Community Apple Cider Press & Fresh Pretzel Cart', estimatedCost: 1500, actualCost: 1400, paidAmount: 700, status: 'deposit_paid' },
      { id: 'cb5', category: 'Permits & Insurance', name: 'Municipal Public Assembly & Fire Marshall Permit', estimatedCost: 650, actualCost: 650, paidAmount: 650, status: 'paid_in_full' },
      { id: 'cb6', category: 'Invitations & Stationery', name: 'Recycled Community Flyers & Directional Lawn Signs', estimatedCost: 350, actualCost: 320, paidAmount: 320, status: 'paid_in_full' },
      { id: 'cb7', category: 'Contingency Reserve', name: 'Emergency first aid station & weather tarps', estimatedCost: 1600, actualCost: 500, paidAmount: 0, status: 'planned' }
    ],
    milestones: [
      { id: 'cm1', title: 'Submit Municipal Park & Sound Permit Application', timeframe: '12-9_months_before', priority: 'high', dueDate: '2026-11-01', completed: true, category: 'Permits', assignedTo: 'Committee Chair Dan' },
      { id: 'cm2', title: 'Recruit 24 Volunteer Stewards & Station Leads', timeframe: '6-3_months_before', priority: 'high', dueDate: '2027-05-15', completed: true, category: 'Volunteers', assignedTo: 'Dan' },
      { id: 'cm3', title: 'Secure 15 Local Farmers & Artisan Booth Agreements', timeframe: '6-3_months_before', priority: 'high', dueDate: '2027-06-01', completed: false, category: 'Vendors', assignedTo: 'Sarah L.' },
      { id: 'cm4', title: 'Arrange Zero-Waste Composting & Recycling Bins', timeframe: '1_month_before', priority: 'medium', dueDate: '2027-08-20', completed: false, category: 'Logistics', assignedTo: 'Eco Lead Mark' },
      { id: 'cm5', title: 'Morning Meadow Setup & Chalking Vendor Stalls', timeframe: 'day_before', priority: 'high', dueDate: '2027-09-24', completed: false, category: 'Setup', assignedTo: 'All Volunteers' }
    ],
    dayOfSchedule: [
      { id: 'cd1', time: '07:30 AM', endTime: '09:30 AM', activity: 'Vendor Arrival, Stall Setup & Straw Bale Seating Placement', location: 'Park Great Meadow', teamLead: 'Dan & Volunteer Crew' },
      { id: 'cd2', time: '09:30 AM', endTime: '10:00 AM', activity: 'Sound Check & Volunteer Orientation Briefing', location: 'Bandstand Gazebo', teamLead: 'Audio Lead Tom' },
      { id: 'cd3', time: '10:00 AM', endTime: '12:00 PM', activity: 'Gates Open: Farmers Market & Kids Pumpkin Painting', location: 'Meadow North', teamLead: 'Sarah L.' },
      { id: 'cd4', time: '12:00 PM', endTime: '02:00 PM', activity: 'Live Bluegrass Concert: The Pine Needle Boys', location: 'Bandstand Gazebo', teamLead: 'Tom' },
      { id: 'cd5', time: '02:00 PM', endTime: '03:00 PM', activity: 'Community Pie Baking Contest & Mayor Address', location: 'Central Pavilion', teamLead: 'Mayor Davis & Dan' },
      { id: 'cd6', time: '03:00 PM', endTime: '05:00 PM', activity: 'Cider Tasting & Square Dance Jamboree', location: 'Great Meadow', teamLead: 'Square Dance Caller Bill' },
      { id: 'cd7', time: '05:00 PM', endTime: '07:00 PM', activity: 'Packdown, Trash Sorting & Leave No Trace Audit', location: 'Park Meadow', teamLead: 'Eco Lead Mark' }
    ],
    vendors: [
      {
        id: 'cv1',
        name: 'The Pine Needle Boys String Band',
        category: 'Music & Sound',
        contactName: 'Jedediah Cole',
        email: 'jed@pineneedleboys.example.com',
        phone: '(503) 712-4091',
        estimatedFee: 1400,
        quotedFee: 1350,
        status: 'booked_and_locked',
        contractSigned: true,
        deliverables: [
          { id: 'cvd1', task: 'Two 60-min high-energy bluegrass sets with family callers', isDone: true }
        ]
      },
      {
        id: 'cv2',
        name: 'Cascade Restroom Solutions',
        category: 'Permits & Security',
        contactName: 'Rachel Miller',
        email: 'rachel@cascaderestrooms.example.com',
        phone: '(503) 902-1134',
        estimatedFee: 2200,
        quotedFee: 2100,
        status: 'booked_and_locked',
        contractSigned: true,
        deliverables: [
          { id: 'cvd2', task: 'Delivery of 6 ADA-compliant luxury porta-suites by 7:00 AM', isDone: true },
          { id: 'cvd3', task: 'Sanitation servicing at 1:30 PM midway mark', isDone: false }
        ]
      }
    ],
    guests: [
      { id: 'cg1', name: 'Oakridge Neighborhood Association', rsvpStatus: 'confirmed', plusOnes: 120, dietary: 'none', tableGroup: 'Zone A - Picnic Meadow' },
      { id: 'cg2', name: 'Elder Care Center Residents & Staff', rsvpStatus: 'confirmed', plusOnes: 35, dietary: 'vegetarian', tableGroup: 'Zone B - Accessible Shaded Pavilion' }
    ],
    tableAssignments: [
      { id: 'ct1', tableNumber: 1, tableName: 'Central Pavilion Seating', capacity: 40, guestIds: ['cg2'] }
    ],
    personalizedIdeas: {
      themeName: 'Autumn Harvest & Community Commons',
      vibeDescription: 'Warm golden sunlight on straw bales, smell of hot spiced cider, joyful fiddle tunes, and neighbours sharing fresh local harvest.',
      colorPalette: [
        { name: 'Harvest Marigold', hex: '#E58A1F', role: 'Primary Accent' },
        { name: 'Rustic Terracotta', hex: '#BA4C2A', role: 'Secondary Color' },
        { name: 'Warm Cream Linen', hex: '#F9F5EC', role: 'Neutral Base' },
        { name: 'Forest Evergreen', hex: '#234431', role: 'Warm Pop' },
        { name: 'Weathered Barnwood', hex: '#3E2E20', role: 'Contrast' }
      ],
      decorConcepts: [
        { id: 'cdc1', area: 'Park Entrance', conceptTitle: 'Straw Bale Arch with Sunflowers & Vintage Wheelbarrows', description: 'Two towers of stacked hay bales flanked with blooming yellow sunflowers and wooden welcome signage.', diyTip: 'Source straw bales from local farm co-ops with buy-back agreements after the event.', estimatedCost: 120 },
        { id: 'cdc2', area: 'Picnic Meadow', conceptTitle: 'Reclaimed Burlap Pennant Bunting Streamers', description: 'Hand-sewn rustic pennant triangles strung between trees across the fairgrounds.', diyTip: 'Upcycle donated coffee roaster burlap sacks for zero material cost.', estimatedCost: 40 }
      ],
      menuItems: [
        { id: 'cm1', course: 'Canapés & Starters', dishName: 'Warm Honeycrisp Apple Cider Donuts', description: 'Freshly fried cider donuts tossed in nutmeg cinnamon sugar.', dietaryTags: ['Vegetarian'] },
        { id: 'cm2', course: 'Main Entrée', dishName: 'Charred Sweet Corn on the Cob with Herb Butter', description: 'Locally grown sweet corn with roasted garlic compound butter and smoked paprika.', dietaryTags: ['Vegetarian', 'Gluten-Free'] }
      ],
      beverages: [
        { id: 'cbev1', name: 'Freshly Pressed Hood River Spiced Cider', type: 'Signature Mocktail', ingredients: 'Local Honeycrisp and Granny Smith apples pressed live with cinnamon sticks and clove', flavorProfile: 'Crisp, sweet, comforting and warm' }
      ],
      musicPlaylist: {
        vibeSummary: 'Traditional Appalachian fiddle tunes, foot-stomping bluegrass, and acoustic folk sing-alongs.',
        recommendedGenres: ['Bluegrass', 'Old-Time Americana', 'Acoustic Folk'],
        sampleTracks: [
          { phase: 'Guest Arrival', songIdea: 'Man of Constant Sorrow', artist: 'The Soggy Bottom Boys' },
          { phase: 'Peak Dance Party', songIdea: 'Foggy Mountain Breakdown', artist: 'Flatt & Scruggs' }
        ]
      }
    },
    contingencyPlans: [
      { id: 'ccp1', riskCategory: 'Weather & Climate', severity: 'high', triggerCondition: 'Pacific Northwest rain or drizzle morning of event', actionPlan: 'Erect 4 commercial pop-up canopy tents over acoustic gazebo and artisan demonstration tables.', responsibleLead: 'Dan & Setup Crew' }
    ]
  }
];
