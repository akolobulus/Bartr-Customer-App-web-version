import React from 'react';
import { ArrowLeft, Wrench, Sparkles, Car } from 'lucide-react';
import { Vendor, VendorIconType } from '../types';

export const BartrLogoMark: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top arrow pointing right */}
      <path d="M6 12L14 6V10H26V14H14V18L6 12Z" fill="currentColor" />
      {/* Bottom arrow pointing left */}
      <path d="M26 20L18 26V22H6V18H18V14L26 20Z" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
};

export const BartrNameLogo: React.FC<{
  fontSize?: string;
  color?: string;
  className?: string;
}> = ({ fontSize = 'text-3xl', color = 'text-[#0067F5]', className = '' }) => {
  return (
    <span className={`font-rency font-bold tracking-tight ${fontSize} ${color} ${className}`}>
      Bartr
    </span>
  );
};

export const BartrTextLogoFull: React.FC<{
  className?: string;
  textColor?: string;
}> = ({ className = '', textColor = 'text-white' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <span className={`font-rency font-bold tracking-tight text-5xl md:text-6xl ${textColor}`}>
        Bartr
      </span>
      <span className={`font-rency text-sm md:text-base mt-2 tracking-normal opacity-95 ${textColor}`}>
        ...Let's help you find them.
      </span>
    </div>
  );
};

export const BartrTopBar: React.FC<{
  title: string;
  onBack: () => void;
  trailing?: React.ReactNode;
}> = ({ title, onBack, trailing }) => {
  return (
    <div className="flex items-center justify-between px-5 py-3 w-full border-b border-black/[0.06] bg-white sticky top-0 z-30">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#0A2E65] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-[#0A2E65] truncate">
            {title}
          </h1>
        )}
      </div>
      {trailing && <div>{trailing}</div>}
    </div>
  );
};

export const BartrPageHeader: React.FC<{
  title: string;
  onBack: () => void;
}> = ({ title, onBack }) => {
  return (
    <div className="w-full bg-white border-b border-black/[0.06] sticky top-0 z-30 pb-3">
      <div className="px-4 pt-3 flex items-center">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#0A2E65] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
      </div>
      <h1 className="text-2xl font-bold text-[#0A2E65] px-5 pt-3">
        {title}
      </h1>
    </div>
  );
};

export const BartrButtonPrimary: React.FC<{
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ text, onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-14 rounded-2xl bg-[#0067F5] text-white font-semibold text-base shadow-sm active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center ${className}`}
    >
      {text}
    </button>
  );
};

export const BartrButtonSecondary: React.FC<{
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ text, onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-14 rounded-2xl bg-[#F5F6FA] text-[#0A2E65] font-semibold text-base active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center ${className}`}
    >
      {text}
    </button>
  );
};

export const VendorTypeIcon: React.FC<{ type: VendorIconType; size?: number; className?: string }> = ({
  type,
  size = 20,
  className = ''
}) => {
  switch (type) {
    case 'REPAIR':
      return <Wrench size={size} className={className} />;
    case 'BEAUTY':
      return <Sparkles size={size} className={className} />;
    case 'MECHANIC':
      return <Car size={size} className={className} />;
  }
};

export const BartrVendorRow: React.FC<{
  vendor: Vendor;
  subtitle?: string;
  onClick: () => void;
}> = ({ vendor, subtitle, onClick }) => {
  const getBadgeStyle = (type: VendorIconType) => {
    switch (type) {
      case 'REPAIR':
        return { bg: 'bg-[#E1F6FF]', text: 'text-[#0067F5]' };
      case 'BEAUTY':
        return { bg: 'bg-[#ECFBEC]', text: 'text-[#2F9E63]' };
      case 'MECHANIC':
        return { bg: 'bg-[#FFFFEE]', text: 'text-[#C99A00]' };
    }
  };

  const badge = getBadgeStyle(vendor.iconType);

  return (
    <div
      onClick={onClick}
      className="flex items-center py-3.5 px-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl cursor-pointer transition-colors"
    >
      <div className={`w-11 h-11 rounded-xl ${badge.bg} flex items-center justify-center ${badge.text} shrink-0`}>
        <VendorTypeIcon type={vendor.iconType} size={20} />
      </div>

      <div className="ml-3.5 flex-1 min-w-0">
        <h3 className="text-[15.5px] font-semibold text-[#0A2E65] truncate">
          {vendor.name}
        </h3>
        <p className="text-[13px] text-[#5B6472] truncate">
          {subtitle || `${vendor.category} · ${vendor.response}`}
        </p>
      </div>

      <div className="text-right shrink-0 ml-2">
        <div className="text-xs font-semibold text-[#0067F5]">
          {vendor.rating}
        </div>
        <div className="text-xs text-[#5B6472] mt-0.5">
          {vendor.distance}
        </div>
      </div>
    </div>
  );
};

export const BartrSpinnerState: React.FC<{
  title: string;
  subtitle: string;
  showNameLogo?: boolean;
}> = ({ title, subtitle, showNameLogo = true }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[440px] animate-in fade-in duration-300">
      {showNameLogo && (
        <div className="mb-7">
          <BartrNameLogo fontSize="text-3xl" color="text-[#0067F5]" />
        </div>
      )}

      {/* Styled Circular Spinner with radar pulse rings */}
      <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-[#0067F5]/15 animate-ping duration-1000 pointer-events-none" />
        <span className="absolute -inset-2 rounded-full border border-[#0067F5]/20 animate-pulse pointer-events-none" />
        <div className="w-14 h-14 rounded-full border-[3.5px] border-[#E1F6FF] border-t-[#0067F5] animate-spin shadow-sm" />
        <div className="absolute w-4 h-4 rounded-full bg-[#0067F5]/20" />
      </div>

      <h2 className="text-xl font-bold text-[#0A2E65] mb-2">{title}</h2>
      <p className="text-sm text-[#5B6472] max-w-xs leading-relaxed">{subtitle}</p>

      {/* Animated dots indicator */}
      <div className="flex items-center gap-1.5 mt-5">
        <span className="w-2 h-2 rounded-full bg-[#0067F5] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-[#0067F5] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-[#0067F5] animate-bounce" />
      </div>
    </div>
  );
};
