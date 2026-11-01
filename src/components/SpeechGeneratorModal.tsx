/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mic,
  Sparkles,
  X,
  Copy,
  Check,
  Clock,
  Heart,
  Smile,
  Zap,
  BookOpen
} from 'lucide-react';
import { EventPlan, SpeechScript } from '../types';

interface SpeechGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
}

export const SpeechGeneratorModal: React.FC<SpeechGeneratorModalProps> = ({
  isOpen,
  onClose,
  event
}) => {
  const [speakerRole, setSpeakerRole] = useState('Best Friend / Toastmaster');
  const [tone, setTone] = useState<'heartfelt' | 'witty' | 'inspiring' | 'poetic'>('heartfelt');
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(3);
  const [honoreeNames, setHonoreeNames] = useState(
    event.eventType === 'wedding' ? 'Elena & Julian' : event.eventType === 'birthday' ? 'Maya' : 'Our Neighbors & Community'
  );
  const [relationshipStories, setRelationshipStories] = useState('Years of shared laughter, road trips, and showing up for each other in hard times');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedSpeech, setGeneratedSpeech] = useState<SpeechScript | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const tones = [
    { id: 'heartfelt', label: 'Heartfelt & Emotional', icon: <Heart className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'witty', label: 'Witty & Humorous', icon: <Smile className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'inspiring', label: 'Inspiring & Uplifting', icon: <Zap className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'poetic', label: 'Poetic & Lyrical', icon: <BookOpen className="w-3.5 h-3.5 text-purple-400" /> }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/speech-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speakerRole,
          tone,
          targetDurationMinutes,
          honoreeNames,
          relationshipStories,
          eventType: event.eventType
        })
      });

      const data = await res.json();
      if (data.success && data.speech) {
        setGeneratedSpeech(data.speech);
      }
    } catch (err) {
      console.error('Error generating speech:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedSpeech) return;
    navigator.clipboard.writeText(generatedSpeech.fullSpeech);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="speech-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Mic className="w-4 h-4 text-rose-400" />
              </div>
            </div>
            <div>
              <h3 id="speech-modal-title" className="text-base font-bold text-white">
                AI Toast, Vow & Speech Writer
              </h3>
              <p className="text-xs text-slate-400">
                Craft resonant remarks with authentic emotion and embedded delivery stage cues
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close speech generator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form id="speech-form" onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Speaker Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maid of Honor / Best Friend"
                  value={speakerRole}
                  onChange={e => setSpeakerRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Honoree(s) Name(s)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena & Julian"
                  value={honoreeNames}
                  onChange={e => setHonoreeNames(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Target Duration</label>
                <select
                  value={targetDurationMinutes}
                  onChange={e => setTargetDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value={1}>1 Minute (Fast Toast, ~130 words)</option>
                  <option value={2}>2 Minutes (Concise, ~260 words)</option>
                  <option value={3}>3 Minutes (Sweet Spot, ~380 words)</option>
                  <option value={5}>5 Minutes (Keynote Toast, ~650 words)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-2">Tone & Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tones.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id as any)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                      tone === t.id
                        ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-sm'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {t.icon}
                    <span>{t.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Memorable Stories, Quirks & Shared Anecdotes
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. First meeting in college chemistry lab, their shared obsession with sourdough bread and indie concerts, and the quiet way they care for each other."
                value={relationshipStories}
                onChange={e => setRelationshipStories(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </form>

          {/* Generated Speech Display */}
          {generatedSpeech && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white">{generatedSpeech.title}</h4>
                  <p className="text-xs text-slate-400">
                    {generatedSpeech.speakerRole} • ~{generatedSpeech.targetDurationMinutes} min ({generatedSpeech.wordCount} words) • {generatedSpeech.tone.toUpperCase()}
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors self-start sm:self-auto"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Script!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Speech</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-serif bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                {generatedSpeech.fullSpeech}
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                <span className="text-amber-300 font-medium">💡 Stage Cue Guide:</span>
                <span>Phrases in [brackets] indicate delivery timing, pauses, eye contact, and glass raises.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Close
          </button>

          <button
            form="speech-form"
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Writing Speech (Gemini 3.8)...' : 'Generate Custom Speech'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
