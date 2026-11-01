/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Copy,
  Check,
  GlassWater,
  UtensilsCrossed,
  Music,
  Lightbulb,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { EventPlan, ColorSwatch } from '../types';

interface IdeasTabProps {
  event: EventPlan;
}

export const IdeasTab: React.FC<IdeasTabProps> = ({ event }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const ideas = event.personalizedIdeas;

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" />
            Personalized Creative Direction & Inspiration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Curated color palettes, budget-saving DIY decor concepts, artisanal menu pairings, and phase-by-phase playlists.
          </p>
        </div>
      </div>

      {/* Theme Concept Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          Core Aesthetic Directive
        </span>
        <h3 className="text-xl font-bold text-white tracking-tight">{ideas.themeName}</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          {ideas.vibeDescription}
        </p>
      </div>

      {/* 1. Harmonious Color Palette */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Harmonious Color Palette & Swatches
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any swatch to copy its hexadecimal color code</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ideas.colorPalette.map((color, idx) => (
            <div
              key={idx}
              onClick={() => handleCopyHex(color.hex)}
              className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-2.5"
            >
              <div
                className="h-20 rounded-lg shadow-inner border border-slate-700/60 transition-transform group-hover:scale-102 flex items-center justify-center"
                style={{ backgroundColor: color.hex }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 px-2 py-1 rounded text-[10px] text-white flex items-center gap-1 font-mono">
                  {copiedHex === color.hex ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-white truncate">{color.name}</p>
                <p className="text-[10px] text-indigo-300 font-medium">{color.role}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Atmosphere & Decor Concepts with DIY Cost Saving Tips */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Atmosphere Installations & Budget-Saving DIY Tips
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">High-impact visual concepts paired with pragmatic maker alternatives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ideas.decorConcepts.map(decor => (
            <div
              key={decor.id}
              className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {decor.area}
                </span>
                <h4 className="text-sm font-bold text-white">{decor.conceptTitle}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {decor.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                  💡 Pro DIY Tip (~${decor.estimatedCost} est.)
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {decor.diyTip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Food & Beverage Pairings (Cocktails + Seasonal Menus) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beverages */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <GlassWater className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Signature Cocktails & Mocktails</h3>
          </div>

          <div className="space-y-3">
            {ideas.beverages.map(bev => (
              <div
                key={bev.id}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{bev.name}</h4>
                  <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/20">
                    {bev.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  <span className="text-slate-400 font-medium">Ingredients:</span> {bev.ingredients}
                </p>
                <p className="text-[11px] text-amber-300/90 italic">
                  Profile: {bev.flavorProfile}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Dishes */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <UtensilsCrossed className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-white">Curated Seasonal Menu Concepts</h3>
          </div>

          <div className="space-y-3">
            {ideas.menuItems.map(menu => (
              <div
                key={menu.id}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {menu.course}
                  </span>
                  <div className="flex items-center gap-1">
                    {menu.dietaryTags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white">{menu.dishName}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{menu.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Music Mood & Playlist */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-indigo-400" />
              Music Mood & Run-of-Show Soundscape
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{ideas.musicPlaylist.vibeSummary}</p>
          </div>

          <div className="flex items-center gap-1.5">
            {ideas.musicPlaylist.recommendedGenres.map(genre => (
              <span key={genre} className="text-[11px] font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ideas.musicPlaylist.sampleTracks.map((track, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 block truncate">
                {track.phase}
              </span>
              <p className="text-xs font-bold text-white truncate">{track.songIdea}</p>
              <p className="text-[11px] text-indigo-300 truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
