import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  ArrowLeft,
  Check,
  Shield,
  MapPin,
  Edit2,
  Banknote,
  Ban,
  Send,
  Star
} from 'lucide-react';
import { Vendor, ChatMessage } from '../types';
import {
  BartrTopBar,
  BartrButtonPrimary,
  BartrSpinnerState,
  VendorTypeIcon
} from '../components/BartrComponents';
import { BartrMapView } from '../components/BartrMapView';

// ==================== VENDOR PROFILE SCREEN ====================
export const VendorProfileScreen: React.FC<{
  vendor: Vendor;
  onBack: () => void;
  onOpenChat: () => void;
  onRequestVendor: () => void;
}> = ({ vendor, onBack, onOpenChat, onRequestVendor }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrTopBar
        title="Vendor"
        onBack={onBack}
        trailing={
          <button
            onClick={onOpenChat}
            aria-label="Chat with vendor"
            className="w-9 h-9 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#0A2E65] active:scale-95 transition-transform"
          >
            <MessageSquare size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* Vendor Hero */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-20 h-20 rounded-3xl bg-[#E1F6FF] flex items-center justify-center text-[#0067F5] shadow-xs">
            <VendorTypeIcon type={vendor.iconType} size={36} />
          </div>
          <h2 className="text-2xl font-bold text-[#0A2E65] mt-3.5">
            {vendor.name}
          </h2>
          <p className="text-sm text-[#5B6472] mt-1">
            {vendor.rating} · {vendor.reviews} · {vendor.distance}
          </p>
        </div>

        {/* About section */}
        <div>
          <h3 className="text-xs font-bold text-[#5B6472] tracking-wider uppercase mb-2">
            About
          </h3>
          <p className="text-sm text-[#0A2E65] leading-relaxed">
            {vendor.blurb}
          </p>
        </div>

        {/* Typical Price */}
        <div>
          <h3 className="text-xs font-bold text-[#5B6472] tracking-wider uppercase mb-2">
            Typical Price
          </h3>
          <p className="text-lg font-bold text-[#0A2E65] font-space">
            {vendor.price}
          </p>
        </div>

        {/* What People Say */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#5B6472] tracking-wider uppercase">
            What People Say
          </h3>

          <div className="rounded-2xl bg-[#F5F6FA] p-4 space-y-1.5 border border-slate-200/50">
            <p className="text-sm text-[#0A2E65] italic leading-relaxed">
              {vendor.review1}
            </p>
            <p className="text-xs text-[#5B6472]">Verified customer</p>
          </div>

          <div className="rounded-2xl bg-[#F5F6FA] p-4 space-y-1.5 border border-slate-200/50">
            <p className="text-sm text-[#0A2E65] italic leading-relaxed">
              {vendor.review2}
            </p>
            <p className="text-xs text-[#5B6472]">Verified customer</p>
          </div>
        </div>
      </div>

      {/* Bottom Request Button */}
      <div className="p-5 border-t border-slate-100 bg-white">
        <BartrButtonPrimary
          text="Request this vendor"
          onClick={onRequestVendor}
        />
      </div>
    </div>
  );
};

// ==================== SENDING SCREEN ====================
export const SendingScreen: React.FC<{
  onSent: () => void;
}> = ({ onSent }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSent();
    }, 1400);

    return () => clearTimeout(timer);
  }, [onSent]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrSpinnerState
        title="Sending your request"
        subtitle="Letting them know you need help."
      />
    </div>
  );
};

// ==================== JOB STATUS SCREEN ====================
export const JobStatusScreen: React.FC<{
  vendor: Vendor;
  onBack: () => void;
  onOpenChat: () => void;
  onCancel: () => void;
  onCompleteJob: () => void;
}> = ({ vendor, onBack, onOpenChat, onCancel, onCompleteJob }) => {
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showSafetyModal, setShowSafetyModal] = useState<boolean>(false);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-white">
      {/* Top Map Section (45% height) */}
      <div className="relative w-full h-[45%] shrink-0">
        <BartrMapView
          vendors={[vendor]}
          isMiniMap={true}
          trackedVendor={vendor}
          onVendorSelected={() => {}}
        />

        {/* Back Button */}
        <button
          onClick={onBack}
          aria-label="Back"
          className="absolute top-4 left-4 z-20 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0A2E65] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Bottom Sheet Section (55% height) */}
      <div className="flex-1 bg-white rounded-t-3xl shadow-xl flex flex-col z-10 -mt-4 border-t border-slate-100 overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0A2E65]">
              Arriving in 15 mins
            </h2>
            <p className="text-sm text-[#5B6472] mt-0.5">
              {vendor.name} · {vendor.category}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-around py-2 border-y border-slate-100">
            {/* Vendor Profile Column */}
            <div className="flex flex-col items-center">
              <div className="relative w-12 h-12">
                <div className="w-12 h-12 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#0A2E65]">
                  <VendorTypeIcon type={vendor.iconType} size={22} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#2F9E63] border-2 border-white flex items-center justify-center text-white">
                  <Check size={10} strokeWidth={3} />
                </div>
              </div>
              <span className="text-xs font-semibold text-[#5B6472] mt-1 truncate max-w-[80px]">
                {vendor.name.split(' ')[0]}
              </span>
            </div>

            {/* Chat button */}
            <div
              onClick={onOpenChat}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#E1F6FF] text-[#0067F5] flex items-center justify-center group-active:scale-95 transition-transform">
                <MessageSquare size={20} />
              </div>
              <span className="text-xs font-medium text-[#5B6472] mt-1">
                Chat
              </span>
            </div>

            {/* Safety button */}
            <div
              onClick={() => setShowSafetyModal(true)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#F5F6FA] text-[#0A2E65] flex items-center justify-center group-active:scale-95 transition-transform">
                <Shield size={20} />
              </div>
              <span className="text-xs font-medium text-[#5B6472] mt-1">
                Safety
              </span>
            </div>
          </div>

          {/* Info Rows */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3 text-sm text-[#0A2E65]">
              <MapPin size={20} className="text-[#5B6472] shrink-0" />
              <span className="flex-1 truncate">14 Market Road, Ikeja</span>
              <button
                onClick={() => alert("Location cannot be changed after dispatch")}
                className="text-[#0067F5] p-1"
                aria-label="Edit address"
              >
                <Edit2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#0A2E65]">
              <Banknote size={20} className="text-[#2F9E63] shrink-0" />
              <span className="flex-1 font-medium">Cash on completion</span>
              <span className="font-bold font-space text-base">{vendor.finalPrice}</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Cancel Request row */}
          <div
            onClick={() => setShowCancelModal(true)}
            className="flex items-center gap-3 py-2 cursor-pointer text-red-600 hover:text-red-700 active:opacity-80 transition-opacity"
          >
            <Ban size={18} />
            <span className="text-sm font-semibold">Cancel request</span>
          </div>

          {/* Complete Job & Rate CTA */}
          <div className="pt-2">
            <BartrButtonPrimary
              text="Complete job & rate"
              onClick={onCompleteJob}
            />
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#0A2E65]">Cancel request?</h3>
            <p className="text-sm text-[#5B6472]">
              The vendor will be notified that you cancelled.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-medium text-[#0A2E65]"
              >
                Keep request
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  onCancel();
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#0067F5]">
              <Shield size={22} />
              <h3 className="text-lg font-bold text-[#0A2E65]">Bartr Safety Hotline</h3>
            </div>
            <p className="text-sm text-[#5B6472] leading-relaxed">
              Every vendor on Bartr undergoes mandatory verification. For emergency support, call our 24/7 hotline at <strong className="text-[#0A2E65]">+234 800 000 911</strong>.
            </p>
            <button
              onClick={() => setShowSafetyModal(false)}
              className="w-full py-3 rounded-xl bg-[#0067F5] text-white text-sm font-bold"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== CHAT SCREEN ====================
export const ChatScreen: React.FC<{
  vendor: Vendor;
  onBack: () => void;
}> = ({ vendor, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! Happy to help, what do you need?',
      isFromUser: false,
      time: '10:15 AM'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isFromUser: true,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Vendor reply simulation
    setTimeout(() => {
      const vendorReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Got it! I'm on my way to your location now.",
        isFromUser: false,
        time: 'Just now'
      };
      setMessages(prev => [...prev, vendorReply]);
    }, 900);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center px-4 py-3 border-b border-black/[0.06] bg-white sticky top-0 z-20">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#0A2E65] active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="w-9 h-9 rounded-xl bg-[#E1F6FF] text-[#0067F5] flex items-center justify-center ml-3 shrink-0">
          <VendorTypeIcon type={vendor.iconType} size={18} />
        </div>

        <div className="ml-2.5 min-w-0 flex-1">
          <h2 className="text-base font-semibold text-[#0A2E65] truncate">
            {vendor.name}
          </h2>
          <p className="text-xs text-emerald-600 font-medium">Online</p>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed ${
                msg.isFromUser
                  ? 'bg-[#0067F5] text-white rounded-2xl rounded-br-xs'
                  : 'bg-[#F5F6FA] text-[#0A2E65] rounded-2xl rounded-bl-xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Row */}
      <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message"
          className="flex-1 bg-[#F5F6FA] border border-slate-200 rounded-full px-4 py-2.5 text-sm text-[#0A2E65] focus:outline-none focus:border-[#0067F5]"
        />
        <button
          onClick={handleSend}
          aria-label="Send message"
          className="w-11 h-11 rounded-full bg-[#0067F5] text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// ==================== RATING SCREEN ====================
export const RatingScreen: React.FC<{
  vendor: Vendor;
  onSubmit: () => void;
}> = ({ vendor, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white text-center">
      <h2 className="text-2xl font-bold text-[#0A2E65]">How was it?</h2>
      <p className="text-sm text-[#5B6472] mt-1.5 max-w-xs">
        Rate your experience with {vendor.name}
      </p>

      {/* Star Selector */}
      <div className="flex items-center gap-2 my-6">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setRating(star)}
            aria-label={`${star} stars`}
            className="p-1 active:scale-125 transition-transform"
          >
            <Star
              size={36}
              className={star <= rating ? 'fill-[#F5B301] text-[#F5B301]' : 'text-slate-300'}
            />
          </button>
        ))}
      </div>

      {/* Optional Feedback */}
      <div className="w-full max-w-sm h-24 rounded-2xl bg-[#F5F6FA] border border-slate-200 p-3 mb-6 focus-within:border-[#0067F5]">
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Anything you'd like to add? (optional)"
          className="w-full h-full bg-transparent resize-none border-none outline-none text-sm text-[#0A2E65] placeholder:text-slate-400"
        />
      </div>

      <div className="w-full max-w-sm">
        <BartrButtonPrimary
          text="Submit rating"
          disabled={rating === 0}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};
