/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RotateCcw,
  Lightbulb
} from 'lucide-react';
import { EventPlan } from '../types';

interface ConciergeChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const ConciergeChatModal: React.FC<ConciergeChatModalProps> = ({
  isOpen,
  onClose,
  event
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your Occasio AI Co-Planner, grounded in the parameters of **${event.title}** (${event.guestCount} guests, $${event.totalBudget.toLocaleString()} budget, ${event.city}).\n\nHow can I help you today? I can draft vendor correspondence, devise rain contingency timelines, calculate seating ratios, or suggest creative cocktail pairings!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickChips = [
    'How do I budget for unexpected weather contingencies?',
    'Tips to tactfully negotiate caterer minimums?',
    'Suggest 2 signature cocktails matching our theme',
    'What should the timeline be for day-of speeches?'
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          eventContext: {
            title: event.title,
            eventType: event.eventType,
            totalBudget: event.totalBudget,
            currency: event.currency,
            guestCount: event.guestCount,
            targetDate: event.targetDate,
            city: event.city,
            aestheticStyle: event.aestheticStyle
          }
        })
      });

      const data = await res.json();
      const botReply = data.reply || "I'm here to assist with all your planning details. Could you clarify your question?";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered a brief network delay. Based on your current event parameters, I recommend double-checking your vendor payment schedule and keeping 5-10% in contingency reserves.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="concierge-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full h-[85vh] max-h-[750px] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 id="concierge-modal-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Occasio AI Co-Planner Concierge
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                Grounded in: {event.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset conversation"
              aria-label="Reset chat history"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Concierge Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/80 shadow-sm'
                }`}
              >
                {msg.text}
                <span className={`text-[10px] block mt-1.5 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
              </div>
              <div className="bg-slate-800/80 text-slate-400 border border-slate-700 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2">
                <span>Synthesizing tailored recommendation...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" /> Ideas:
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about timelines, budget, seating, etiquette..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-40"
              aria-label="Send message to AI Concierge"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
