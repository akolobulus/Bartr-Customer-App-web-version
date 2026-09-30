import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { Vendor } from '../types';
import { BartrRepository } from '../data/bartrData';
import {
  BartrTopBar,
  BartrButtonPrimary,
  BartrSpinnerState,
  BartrVendorRow
} from '../components/BartrComponents';

// ==================== REQUEST INPUT SCREEN ====================
export const RequestInputScreen: React.FC<{
  onBack: () => void;
  onFindVendors: (query: string) => void;
}> = ({ onBack, onFindVendors }) => {
  const [queryText, setQueryText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micLabel, setMicLabel] = useState<string>('Tap to speak instead');

  const handleMicClick = () => {
    if (isListening) return;

    setIsListening(true);
    setMicLabel('Listening...');

    // Web Speech API or simulated speech input
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          setQueryText(transcript);
          setIsListening(false);
          setMicLabel('Tap to speak instead');
        };
        recognition.onerror = () => {
          setQueryText('My phone screen cracked, need am fix today');
          setIsListening(false);
          setMicLabel('Tap to speak instead');
        };
        recognition.start();
        return;
      } catch {}
    }

    // Fallback simulation
    setTimeout(() => {
      setQueryText('My phone screen cracked, need am fix today');
      setIsListening(false);
      setMicLabel('Tap to speak instead');
    }, 1300);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrTopBar title="What do you need?" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        <p className="text-sm text-[#5B6472] leading-relaxed">
          Describe it in your own words, or tap the mic and just speak. We'll sort out the details for you.
        </p>

        {/* Large Text Area */}
        <div className="w-full h-32 rounded-2xl bg-[#F5F6FA] border border-slate-200/80 p-4 focus-within:border-[#0067F5] focus-within:ring-2 focus-within:ring-[#0067F5]/20 transition-all">
          <textarea
            value={queryText}
            onChange={e => setQueryText(e.target.value)}
            placeholder="e.g. My phone screen cracked, need am fix today"
            className="w-full h-full bg-transparent resize-none border-none outline-none text-base text-[#0A2E65] placeholder:text-slate-400"
          />
        </div>

        {/* Mic simulation row */}
        <div className="flex flex-col items-center justify-center pt-4">
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-3 rounded-full bg-blue-400/30 animate-ping pointer-events-none" />
            )}
            <button
              onClick={handleMicClick}
              aria-label="Speak"
              className={`w-16 h-16 rounded-full bg-[#0067F5] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all ${
                isListening ? 'scale-110 ring-4 ring-blue-300' : ''
              }`}
            >
              <Mic size={28} />
            </button>
          </div>

          <span className={`text-sm mt-3 ${isListening ? 'text-[#0067F5] font-semibold' : 'text-[#5B6472]'}`}>
            {micLabel}
          </span>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="p-5 border-t border-slate-100 bg-white">
        <BartrButtonPrimary
          text="Find vendors"
          disabled={!queryText.trim()}
          onClick={() => onFindVendors(queryText.trim())}
        />
      </div>
    </div>
  );
};

// ==================== PARSED SCREEN ====================
export const ParsedScreen: React.FC<{
  query: string;
  onBack: () => void;
  onConfirm: () => void;
}> = ({ query, onBack, onConfirm }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrTopBar title="Here's what we found" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* User Speech Bubble */}
        <div className="rounded-2xl rounded-bl-xs bg-[#F5F6FA] p-4 text-base text-[#0A2E65] leading-relaxed shadow-xs">
          "{query}"
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2.5">
          <span className="px-3.5 py-1.5 rounded-full bg-[#E1F6FF] text-[#0A2E65] font-semibold text-xs">
            Phone Repair
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-[#FFFFEE] text-[#8A7A00] font-semibold text-xs border border-yellow-200">
            Urgent · Today
          </span>
        </div>

        {/* Fair Price Card */}
        <div className="rounded-2xl bg-[#ECFBEC] p-5 border border-emerald-200/60 shadow-xs">
          <div className="text-xs font-semibold text-[#2F7A52] tracking-wide uppercase">
            A fair price, suggested for you
          </div>
          <div className="text-3xl font-bold text-[#0A2E65] mt-1.5 font-space">
            ₦4,500 – ₦6,000
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="p-5 border-t border-slate-100 bg-white">
        <BartrButtonPrimary
          text="Looks good, find vendors"
          onClick={onConfirm}
        />
      </div>
    </div>
  );
};

// ==================== MATCHING SCREEN ====================
export const MatchingScreen: React.FC<{
  query: string;
  onMatched: () => void;
}> = ({ onMatched }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onMatched();
    }, 1400);

    return () => clearTimeout(timer);
  }, [onMatched]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrSpinnerState
        title="Finding vendors near you"
        subtitle="Matching you with trusted people nearby."
      />
    </div>
  );
};

// ==================== MATCHES SCREEN ====================
export const MatchesScreen: React.FC<{
  onBack: () => void;
  onVendorClick: (vendor: Vendor) => void;
}> = ({ onBack, onVendorClick }) => {
  const matchedVendors = [
    BartrRepository.getVendor("chuka"),
    BartrRepository.getVendor("ifeoma"),
    BartrRepository.getVendor("bode"),
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrTopBar title="Matched for you" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-2">
          <h2 className="text-xs font-bold text-[#5B6472] tracking-wider uppercase">
            Best Matches, Ranked for You
          </h2>
        </div>

        <div className="divide-y divide-black/[0.06]">
          {matchedVendors.map(vendor => (
            <BartrVendorRow
              key={vendor.id}
              vendor={vendor}
              subtitle={`${vendor.category} · ${vendor.response}`}
              onClick={() => onVendorClick(vendor)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
