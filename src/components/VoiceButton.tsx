import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onClick,
  className = '',
  size = 'md'
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'h-9 w-9 px-2.5 hover:w-auto hover:px-3 text-xs'
      : size === 'lg'
      ? 'h-11 w-11 px-3 hover:w-auto hover:px-4 text-xs'
      : 'h-10 w-10 px-2.5 hover:w-auto hover:px-3.5 text-xs';

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Voice"
      title="Voice"
      className={`group relative flex items-center justify-center rounded-full bg-linear-to-r from-[#0067F5] to-purple-600 shadow-md text-white font-semibold active:scale-95 transition-all duration-200 overflow-hidden cursor-pointer shrink-0 hover:shadow-lg ${sizeClasses} ${className}`}
    >
      {/* Exactly one mic icon, no sound icon */}
      <Mic size={iconSize} className="shrink-0" />
      {/* Text shows ONLY on hover */}
      <span className="max-w-0 opacity-0 group-hover:max-w-[70px] group-hover:opacity-100 group-hover:ml-1.5 transition-all duration-200 whitespace-nowrap overflow-hidden text-xs font-semibold">
        Voice
      </span>
    </button>
  );
};
