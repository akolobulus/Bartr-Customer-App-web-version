import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  X,
  Mic,
  MicOff,
  MapPin,
  Keyboard,
  Send,
  Navigation,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  VoiceState,
  AutonomousAction,
  PendingPermission,
  GroundingSource
} from '../types';

interface LiveVoiceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction: (action: AutonomousAction) => void;
}

export const LiveVoiceSheet: React.FC<LiveVoiceSheetProps> = ({
  isOpen,
  onClose,
  onExecuteAction
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [aiTranscript, setAiTranscript] = useState<string>(
    "Hi! I'm your Bartr voice assistant. How far? What can I help you sort out today?"
  );
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMicPaused, setIsMicPaused] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [audioRms, setAudioRms] = useState<number>(0.2);
  const [groundings, setGroundings] = useState<GroundingSource[]>([
    { title: "Computer Village, Ikeja", snippet: "Otigba Street artisan hub" },
    { title: "Allen Avenue, Ikeja", snippet: "Commercial & beauty district" }
  ]);
  const [pendingPermission, setPendingPermission] = useState<PendingPermission | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    if (!isOpen) return;

    setVoiceState('LISTENING');

    // Setup Web Speech API if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setUserTranscript(currentTranscript);

        if (event.results[event.results.length - 1].isFinal) {
          handleUserUtterance(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }

    // Audio Visualizer pulse simulation
    const interval = setInterval(() => {
      setAudioRms(prev => {
        const target = voiceState === 'LISTENING' ? 0.3 + Math.random() * 0.6 : 0.15;
        return prev * 0.7 + target * 0.3;
      });
    }, 120);

    return () => {
      clearInterval(interval);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  const speakText = (text: string) => {
    if (isMuted || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setVoiceState('SPEAKING');
    };

    utterance.onend = () => {
      setVoiceState('LISTENING');
    };

    utterance.onerror = () => {
      setVoiceState('LISTENING');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleUserUtterance = async (prompt: string) => {
    if (!prompt.trim()) return;

    // Check if confirming pending permission
    if (pendingPermission) {
      const lower = prompt.toLowerCase();
      if (lower.includes('yes') || lower.includes('proceed') || lower.includes('approve') || lower.includes('confirm')) {
        confirmPermission();
        return;
      } else if (lower.includes('no') || lower.includes('cancel') || lower.includes('decline')) {
        dismissPermission();
        return;
      }
    }

    setVoiceState('THINKING');

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, currentLocation: '14 Market Road, Ikeja, Lagos' }),
      });

      const data = await res.json();
      setAiTranscript(data.text || "I found verified artisans near you.");
      if (data.groundings && data.groundings.length > 0) {
        setGroundings(data.groundings);
      }

      speakText(data.text);

      if (data.action) {
        if (data.action.requiresPermission) {
          setPendingPermission({
            id: Date.now().toString(),
            action: data.action,
            title: `Book ${data.action.vendorName || "Artisan"}`,
            explanation: `Authorize Bartr to send an instant booking request to ${data.action.vendorName} at the upfront rate of ${data.action.price}.`,
            details: {
              Vendor: data.action.vendorName || "Artisan",
              Service: data.action.service || "Repair service",
              Rate: data.action.price || "₦5,000",
              Location: "14 Market Road, Ikeja"
            }
          });
          setVoiceState('AWAITING_PERMISSION');
        } else {
          onExecuteAction(data.action);
        }
      }
    } catch (err) {
      console.error('AI chat failed:', err);
      setVoiceState('LISTENING');
    }
  };

  const confirmPermission = () => {
    if (pendingPermission) {
      onExecuteAction(pendingPermission.action);
      setPendingPermission(null);
      setAiTranscript(`Booking confirmed for ${pendingPermission.action.vendorName}! They are being notified right now.`);
      speakText(`Booking confirmed! Your request was sent.`);
    }
  };

  const dismissPermission = () => {
    setPendingPermission(null);
    setAiTranscript("Booking cancelled. What else can I do for you?");
    speakText("Cancelled. No wahala.");
    setVoiceState('LISTENING');
  };

  const toggleMic = () => {
    if (voiceState === 'SPEAKING') {
      window.speechSynthesis?.cancel();
      setVoiceState('LISTENING');
      return;
    }

    if (isMicPaused) {
      setIsMicPaused(false);
      setVoiceState('LISTENING');
      try {
        recognitionRef.current?.start();
      } catch {}
    } else {
      setIsMicPaused(true);
      setVoiceState('IDLE');
      try {
        recognitionRef.current?.stop();
      } catch {}
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-xs p-0 md:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-11 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-linear-to-r from-[#0067F5] to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Mic size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0A2E65] text-base">Voice Assistant</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  3.8 LIVE
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-0.5">
                  <MapPin size={9} />
                  MAPS
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted) window.speechSynthesis?.cancel();
              }}
              aria-label="Mute speaker"
              className={`p-2 rounded-full transition-colors ${isMuted ? 'text-red-500 bg-red-50' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Status pill */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border ${
              isMicPaused
                ? 'bg-slate-100 text-slate-600 border-slate-300'
                : voiceState === 'LISTENING'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : voiceState === 'SPEAKING'
                ? 'bg-blue-50 text-blue-800 border-blue-300'
                : voiceState === 'THINKING'
                ? 'bg-purple-50 text-purple-800 border-purple-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              {voiceState === 'LISTENING' && !isMicPaused && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              )}
              <span>
                {isMicPaused
                  ? "Mic Paused • Tap mic to resume"
                  : voiceState === 'LISTENING'
                  ? "Live Mic Active • Speak anytime"
                  : voiceState === 'SPEAKING'
                  ? "Assistant Speaking • Tap mic to interrupt"
                  : voiceState === 'THINKING'
                  ? "Gemini 3.8 Processing..."
                  : "Say 'Yes' or 'No' to authorize"}
              </span>
            </div>
          </div>

          {/* Voice Wave Visualizer */}
          <div className="h-14 flex items-center justify-center gap-1.5 px-4">
            {[0.4, 0.7, 1.0, 0.6, 0.8, 0.5, 0.9, 0.7, 0.3, 0.8, 1.0, 0.5, 0.7].map((heightMult, i) => {
              const baseHeight = voiceState === 'LISTENING' || voiceState === 'SPEAKING' ? audioRms * 48 * heightMult : 8;
              return (
                <div
                  key={i}
                  style={{ height: `${Math.max(6, baseHeight)}px` }}
                  className={`w-1.5 rounded-full transition-all duration-100 ${
                    voiceState === 'LISTENING'
                      ? 'bg-gradient-to-t from-blue-600 to-cyan-400'
                      : voiceState === 'SPEAKING'
                      ? 'bg-gradient-to-t from-purple-600 to-blue-500'
                      : 'bg-slate-300'
                  }`}
                />
              );
            })}
          </div>

          {/* Transcripts container */}
          <div className="rounded-2xl bg-[#E1F6FF]/40 p-4 space-y-3">
            {userTranscript && (
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-[#0A2E65] text-white text-sm px-3.5 py-2 rounded-2xl rounded-br-xs shadow-xs">
                  {userTranscript}
                </div>
              </div>
            )}

            <div className="flex justify-start">
              <div className="max-w-[90%] bg-white text-[#0A2E65] text-sm p-3.5 rounded-2xl rounded-bl-xs shadow-xs space-y-2">
                <p className="leading-relaxed">{aiTranscript}</p>

                {groundings.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                      <MapPin size={12} />
                      Grounded with Google Maps Lagos data:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {groundings.map((g, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-50 text-blue-900 px-2 py-0.5 rounded-md">
                          <MapPin size={10} className="text-blue-600" />
                          {g.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pending Permission Card */}
          {pendingPermission && (
            <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-900">
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-amber-950 font-bold">
                  <Shield size={16} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-700 tracking-wide uppercase">User Permission Required</div>
                  <div className="text-sm font-bold text-[#0A2E65]">{pendingPermission.title}</div>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {pendingPermission.explanation}
              </p>

              <div className="bg-white/90 rounded-xl p-2.5 text-xs space-y-1 border border-amber-200">
                {Object.entries(pendingPermission.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500 font-medium">{k}</span>
                    <span className="text-[#0A2E65] font-bold">{v}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-center text-slate-600">
                Say "Yes, proceed" or tap below:
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={dismissPermission}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-100"
                >
                  <XCircle size={15} />
                  Decline
                </button>
                <button
                  onClick={confirmPermission}
                  className="flex-[1.4] py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-700 shadow-sm"
                >
                  <CheckCircle size={15} />
                  Authorize & Run
                </button>
              </div>
            </div>
          )}

          {/* Quick Prompts */}
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-2">Try saying or tapping:</div>
            <div className="flex flex-wrap gap-2">
              {[
                "Find phone repair near me",
                "Book Chuka for phone repair",
                "Recenter map on my location",
                "Open my past requests",
                "Apply promo code BARTR500",
                "Open payments options"
              ].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUserTranscript(s);
                    handleUserUtterance(s);
                  }}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-[#0A2E65] px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Drawer Toggle */}
          {showKeyboard && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && textInput.trim()) {
                    setUserTranscript(textInput);
                    handleUserUtterance(textInput);
                    setTextInput('');
                  }
                }}
                placeholder="Ask or tell the AI to do something..."
                className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0A2E65] focus:outline-none focus:border-[#0067F5]"
              />
              <button
                onClick={() => {
                  if (textInput.trim()) {
                    setUserTranscript(textInput);
                    handleUserUtterance(textInput);
                    setTextInput('');
                  }
                }}
                className="w-10 h-10 rounded-xl bg-[#0067F5] text-white flex items-center justify-center active:scale-95"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer controls: Keyboard, Main Mic, Recenter */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-around">
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            aria-label="Toggle keyboard"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              showKeyboard ? 'bg-[#0067F5] text-white' : 'bg-white text-slate-700 shadow-sm border border-slate-200'
            }`}
          >
            <Keyboard size={20} />
          </button>

          {/* Main Pulsing Mic Button */}
          <div className="relative flex flex-col items-center">
            {voiceState === 'LISTENING' && !isMicPaused && (
              <span className="absolute -inset-2 rounded-full bg-blue-400/30 animate-ping pointer-events-none" />
            )}
            <button
              onClick={toggleMic}
              aria-label="Toggle microphone"
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all ${
                isMicPaused
                  ? 'bg-slate-500'
                  : voiceState === 'SPEAKING'
                  ? 'bg-emerald-600'
                  : 'bg-linear-to-r from-[#0067F5] to-cyan-500'
              }`}
            >
              {isMicPaused ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
            <span className="text-[11px] font-medium text-slate-500 mt-1">
              {isMicPaused ? 'Paused' : voiceState === 'SPEAKING' ? 'Tap to stop' : 'Tap to pause'}
            </span>
          </div>

          <button
            onClick={() => {
              onExecuteAction({
                type: 'RecenterMap',
                summary: 'Centered map on 14 Market Road, Ikeja'
              });
              setAiTranscript("Map centered on 14 Market Road, Ikeja.");
              speakText("Map centered.");
            }}
            aria-label="Recenter map"
            className="w-12 h-12 rounded-full bg-white text-[#0067F5] shadow-sm border border-slate-200 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Navigation size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
