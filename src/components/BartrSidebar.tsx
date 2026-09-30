import React from 'react';
import {
  X,
  CreditCard,
  Tag,
  History,
  Bookmark,
  Gift,
  HelpCircle,
  Info
} from 'lucide-react';
import { BartrScreen } from '../types';

interface BartrSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: BartrScreen) => void;
  onBecomeVendor?: () => void;
}

export const BartrSidebar: React.FC<BartrSidebarProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onBecomeVendor
}) => {
  if (!isOpen) return null;

  const handleItemClick = (screen: BartrScreen) => {
    onClose();
    onNavigate(screen);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Scrim Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#0A2E65]/40 backdrop-blur-xs transition-opacity"
      />

      {/* Sidebar Panel - exactly matching mobile smaller devices drawer */}
      <div className="relative w-[82%] max-w-sm bg-white h-full shadow-2xl rounded-r-3xl z-10 flex flex-col p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
        {/* Header with Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full bg-slate-100 text-[#5B6472] flex items-center justify-center hover:bg-slate-200 active:scale-95 cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Card Header */}
        <div
          onClick={() => handleItemClick({ name: 'profile' })}
          className="flex items-center gap-3.5 py-4 cursor-pointer hover:bg-slate-50 rounded-2xl px-2 transition-colors -mx-2"
        >
          <div className="w-14 h-14 rounded-full bg-[#E1F6FF] text-[#0067F5] font-bold text-2xl flex items-center justify-center shrink-0">
            A
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg text-[#0A2E65] truncate">
              Alex Johnson
            </h3>
            <p className="text-xs text-[#5B6472] truncate mt-0.5">
              +234 704 200 1836
            </p>
          </div>
        </div>

        <hr className="my-2 border-slate-100" />

        {/* Navigation Items (All navs in the sidebar as in mobile smaller devices) */}
        <div className="flex-1 space-y-1">
          <SidebarNavRow
            icon={<CreditCard size={20} />}
            title="Payments"
            onClick={() => handleItemClick({ name: 'payments' })}
          />
          <SidebarNavRow
            icon={<Tag size={20} />}
            title="Promotions"
            subtitle="Enter promo code"
            onClick={() => handleItemClick({ name: 'promotions' })}
          />
          <SidebarNavRow
            icon={<History size={20} />}
            title="My requests"
            onClick={() => handleItemClick({ name: 'my_requests' })}
          />
          <SidebarNavRow
            icon={<Bookmark size={20} />}
            title="Saved vendors"
            onClick={() => handleItemClick({ name: 'saved_vendors' })}
          />
          <SidebarNavRow
            icon={<Gift size={20} />}
            title="Invite a friend"
            onClick={() => handleItemClick({ name: 'invite_friend' })}
          />
          <SidebarNavRow
            icon={<HelpCircle size={20} />}
            title="Get help"
            onClick={() => handleItemClick({ name: 'get_help' })}
          />
          <SidebarNavRow
            icon={<Info size={20} />}
            title="About"
            onClick={() => handleItemClick({ name: 'about' })}
          />
        </div>

        {/* Become a Vendor CTA Card */}
        <div
          onClick={() => {
            onClose();
            if (onBecomeVendor) {
              onBecomeVendor();
            }
          }}
          className="mt-4 p-4 rounded-2xl bg-[#0067F5] text-white cursor-pointer active:scale-98 transition-transform shadow-md"
        >
          <h4 className="font-bold text-base">Become a vendor</h4>
          <p className="text-xs text-white/80 mt-1">Get found for what you do</p>
        </div>
      </div>
    </div>
  );
};

const SidebarNavRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
}> = ({ icon, title, subtitle, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 py-3.5 px-3 rounded-xl hover:bg-slate-100 active:bg-slate-200 cursor-pointer text-[#0A2E65] transition-colors"
    >
      <div className="shrink-0 text-[#0A2E65]">{icon}</div>
      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm text-[#0A2E65] block">{title}</span>
        {subtitle && (
          <span className="text-xs text-[#5B6472] block">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
