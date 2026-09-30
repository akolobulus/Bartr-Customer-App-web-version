import React, { useState } from 'react';
import {
  Menu,
  Search,
  Navigation,
  ChevronRight
} from 'lucide-react';
import { Vendor, AutonomousAction, BartrScreen } from '../types';
import { BartrRepository } from '../data/bartrData';
import { BartrMapView } from '../components/BartrMapView';
import { BartrVendorRow, BartrNameLogo } from '../components/BartrComponents';
import { LiveVoiceSheet } from '../components/LiveVoiceSheet';
import { BartrSidebar } from '../components/BartrSidebar';
import { VoiceButton } from '../components/VoiceButton';

interface HomeScreenProps {
  onSearchClick: () => void;
  onVendorClick: (vendor: Vendor) => void;
  onOpenProfile: () => void;
  onOpenPayments: () => void;
  onOpenPromotions: () => void;
  onOpenMyRequests: () => void;
  onOpenSavedVendors: () => void;
  onOpenInviteFriend: () => void;
  onOpenGetHelp: () => void;
  onOpenAbout: () => void;
  onRequestVendorDirect: (vendorId: string) => void;
  onOpenChatDirect: (vendorId: string) => void;
  onSearchMatchesDirect: (query: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSearchClick,
  onVendorClick,
  onOpenProfile,
  onOpenPayments,
  onOpenPromotions,
  onOpenMyRequests,
  onOpenSavedVendors,
  onOpenInviteFriend,
  onOpenGetHelp,
  onOpenAbout,
  onRequestVendorDirect,
  onOpenChatDirect,
  onSearchMatchesDirect
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [showVoiceSheet, setShowVoiceSheet] = useState<boolean>(false);
  const [recenterTrigger, setRecenterTrigger] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentVendors, setCurrentVendors] = useState<Vendor[]>([
    BartrRepository.getVendor("chuka"),
    BartrRepository.getVendor("adaeze"),
    BartrRepository.getVendor("musa"),
  ]);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleFilterCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      setCurrentVendors(BartrRepository.vendors);
    } else {
      setCurrentVendors(
        BartrRepository.vendors.filter(v =>
          v.category.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }
  };

  const handleExecuteAutonomousAction = (action: AutonomousAction) => {
    showToast(`AI: ${action.summary}`);

    switch (action.type) {
      case 'SearchVendors':
        if (action.query) {
          onSearchMatchesDirect(action.query);
        } else {
          onSearchClick();
        }
        break;

      case 'FilterVendors':
        if (action.filterType?.toLowerCase() === 'cheapest') {
          setCurrentVendors([...BartrRepository.vendors].sort((a, b) => {
            const pa = parseInt(a.finalPrice.replace(/\D/g, ''), 10) || 99999;
            const pb = parseInt(b.finalPrice.replace(/\D/g, ''), 10) || 99999;
            return pa - pb;
          }));
        } else if (action.filterType?.toLowerCase() === 'top_rated') {
          setCurrentVendors([...BartrRepository.vendors].sort((a, b) => b.ratingNum - a.ratingNum));
        } else if (action.filterType?.toLowerCase() === 'nearest') {
          setCurrentVendors([...BartrRepository.vendors].sort((a, b) => {
            const da = parseFloat(a.distance.replace('km', '')) || 99;
            const db = parseFloat(b.distance.replace('km', '')) || 99;
            return da - db;
          }));
        } else if (action.value) {
          const val = action.value.toLowerCase();
          const match = BartrRepository.vendors.filter(v =>
            v.category.toLowerCase().includes(val) || v.name.toLowerCase().includes(val)
          );
          if (match.length > 0) setCurrentVendors(match);
        }
        break;

      case 'SelectVendor':
        if (action.vendorId) {
          setSelectedVendorId(action.vendorId);
        }
        break;

      case 'RecenterMap':
        setRecenterTrigger(prev => prev + 1);
        break;

      case 'ApplyPromo':
        onOpenPromotions();
        break;

      case 'OpenVendorChat':
        if (action.vendorId) {
          onOpenChatDirect(action.vendorId);
        }
        break;

      case 'BookVendor':
        if (action.vendorId) {
          onRequestVendorDirect(action.vendorId);
        }
        break;

      case 'NavigateTo':
        switch (action.destination) {
          case 'payments':
            onOpenPayments();
            break;
          case 'promotions':
            onOpenPromotions();
            break;
          case 'my_requests':
            onOpenMyRequests();
            break;
          case 'saved_vendors':
            onOpenSavedVendors();
            break;
          case 'help':
            onOpenGetHelp();
            break;
          case 'about':
            onOpenAbout();
            break;
          case 'profile':
            onOpenProfile();
            break;
          case 'invite_friend':
            onOpenInviteFriend();
            break;
        }
        break;

      case 'ClearFilters':
        setCurrentVendors(BartrRepository.vendors);
        setSelectedVendorId(null);
        setActiveCategory('all');
        break;
    }
  };

  const selectedVendor = selectedVendorId
    ? BartrRepository.getVendor(selectedVendorId)
    : null;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0A2E65] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-white/20 animate-in fade-in slide-in-from-top duration-200">
          {toastMessage}
        </div>
      )}

      {/* Top Header Bar for Desktop & Laptops:
          - Left: Menu Hamburger Button (opens sidebar with all navs)
          - Center: Bartr Brand logo centered on large screens
          - Right: Voice button (single mic icon, text on hover only) + Profile avatar
      */}
      <header className="hidden md:flex items-center justify-between relative px-6 py-3.5 border-b border-slate-200 bg-white z-30 shrink-0 shadow-xs">
        {/* Left: Hamburger Menu Button */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open sidebar menu"
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#0A2E65] active:scale-95 transition-all cursor-pointer"
            title="Menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Center: Bartr Logo moved to center on large screens */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer pointer-events-auto"
          onClick={() => handleFilterCategory('all')}
        >
          <BartrNameLogo fontSize="text-2xl" color="text-[#0067F5]" />
        </div>

        {/* Right: Voice button + Profile avatar */}
        <div className="flex items-center gap-3 z-10">
          {/* Voice button: One single mic icon, no sound icon, text shows ONLY on hover */}
          <VoiceButton
            onClick={() => setShowVoiceSheet(true)}
            size="md"
          />

          {/* Quick Profile Avatar */}
          <button
            onClick={onOpenProfile}
            aria-label="View profile"
            title="Profile - Alex Johnson"
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#E1F6FF] text-[#0067F5] font-bold text-xs flex items-center justify-center">
              A
            </div>
          </button>
        </div>
      </header>

      {/* Main Responsive Body:
          - Mobile (< md): Top map (40%) + Bottom sheet (60%)
          - Desktop (>= md): Split layout with Left Discovery Column + Right expansive Map
      */}
      <div className="w-full flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Discovery Column (Full desktop sidebar, or bottom sheet on mobile) */}
        <div className="order-2 md:order-1 w-full md:w-[440px] lg:w-[480px] h-[60%] md:h-full bg-white flex flex-col z-10 -mt-4 md:mt-0 rounded-t-3xl md:rounded-none shadow-xl md:shadow-none md:border-r md:border-slate-200 overflow-hidden shrink-0">
          {/* Mobile Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0 md:hidden">
            <div className="w-10 h-1.5 rounded-full bg-slate-300" />
          </div>

          <div className="flex-1 overflow-y-auto px-5 md:px-6 py-2 md:py-5 space-y-4">
            {/* Search Pill */}
            <div
              onClick={onSearchClick}
              className="w-full rounded-2xl bg-[#F5F6FA] p-4 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform hover:bg-slate-100 border border-slate-200/60"
            >
              <Search className="text-[#5B6472] w-5 h-5 shrink-0" />
              <div className="flex-1">
                <span className="text-[#0A2E65] font-semibold text-base block">
                  What do you need?
                </span>
                <span className="text-xs text-[#5B6472] hidden md:block">
                  Search phone repair, mechanics, beauty in Lagos
                </span>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All Services' },
                { id: 'phone', label: 'Phone Repair' },
                { id: 'nail', label: 'Nail Tech' },
                { id: 'mechanic', label: 'Mechanic' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleFilterCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-[#0067F5] text-white shadow-xs'
                      : 'bg-slate-100 text-[#0A2E65] hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-xs font-bold text-[#5B6472] tracking-wider uppercase">
                Nearby Vendors ({currentVendors.length})
              </h2>
              <span className="text-[11px] text-[#0067F5] font-medium hidden md:inline">
                Ikeja, Lagos
              </span>
            </div>

            {/* Vendors List */}
            <div className="divide-y divide-black/[0.06]">
              {currentVendors.map(vendor => (
                <div
                  key={vendor.id}
                  className={`transition-colors rounded-xl ${
                    selectedVendorId === vendor.id ? 'bg-blue-50/70' : ''
                  }`}
                >
                  <BartrVendorRow
                    vendor={vendor}
                    onClick={() => {
                      setSelectedVendorId(vendor.id);
                      onVendorClick(vendor);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Become a Vendor Desktop Callout Banner */}
            <div
              onClick={() => {
                showToast("Vendor mode is coming soon!");
              }}
              className="rounded-2xl bg-linear-to-r from-[#0067F5] to-blue-700 p-4 text-white cursor-pointer hover:shadow-md transition-all active:scale-[0.99] mt-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Become a vendor</h4>
                  <p className="text-xs text-white/80 mt-0.5">Get found for what you do across Lagos</p>
                </div>
                <ChevronRight size={18} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Map Section (Top on mobile 40%, Full right area on desktop flex-1) */}
        <div className="order-1 md:order-2 relative w-full md:flex-1 h-[40%] md:h-full min-h-[240px] shrink-0">
          <BartrMapView
            vendors={currentVendors}
            selectedVendorId={selectedVendorId}
            onVendorSelected={vendor => {
              setSelectedVendorId(vendor.id);
            }}
            recenterTrigger={recenterTrigger}
          />

          {/* Mobile-only Floating Hamburger Menu button (top left) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
            className="md:hidden absolute top-4 left-4 z-20 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0A2E65] active:scale-95 transition-transform"
          >
            <Menu size={20} />
          </button>

          {/* Mobile-only Floating Voice button: 1 single mic icon, text on hover only */}
          <div className="md:hidden absolute top-4 right-4 z-20">
            <VoiceButton
              onClick={() => setShowVoiceSheet(true)}
              size="lg"
            />
          </div>

          {/* Floating Recenter Location button (bottom right) */}
          <button
            onClick={() => {
              setRecenterTrigger(prev => prev + 1);
              showToast("Centered on 14 Market Road, Ikeja");
            }}
            aria-label="Locate me"
            className="absolute bottom-5 right-5 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0067F5] hover:scale-105 active:scale-95 transition-transform border border-slate-200"
          >
            <Navigation size={20} />
          </button>

          {/* Desktop Selected Vendor Quick Banner */}
          {selectedVendor && (
            <div className="hidden md:flex absolute bottom-5 left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 max-w-sm items-center gap-3.5 animate-in slide-in-from-bottom duration-200">
              <div className="w-12 h-12 rounded-xl bg-[#E1F6FF] flex items-center justify-center text-[#0067F5] font-bold text-lg shrink-0">
                {selectedVendor.initial}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-[#0A2E65] truncate">{selectedVendor.name}</h4>
                <p className="text-xs text-[#5B6472]">{selectedVendor.category} · {selectedVendor.rating}</p>
                <p className="text-xs font-bold text-[#0067F5] mt-0.5">{selectedVendor.finalPrice}</p>
              </div>
              <button
                onClick={() => onVendorClick(selectedVendor)}
                className="px-3 py-1.5 rounded-xl bg-[#0067F5] text-white text-xs font-semibold hover:bg-blue-700 active:scale-95 shrink-0"
              >
                View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Navigation Drawer (All navs in the sidebar as in mobile smaller devices) */}
      <BartrSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={screen => {
          switch (screen.name) {
            case 'profile':
              onOpenProfile();
              break;
            case 'payments':
              onOpenPayments();
              break;
            case 'promotions':
              onOpenPromotions();
              break;
            case 'my_requests':
              onOpenMyRequests();
              break;
            case 'saved_vendors':
              onOpenSavedVendors();
              break;
            case 'invite_friend':
              onOpenInviteFriend();
              break;
            case 'get_help':
              onOpenGetHelp();
              break;
            case 'about':
              onOpenAbout();
              break;
          }
        }}
        onBecomeVendor={() => showToast("Vendor mode is coming soon!")}
      />

      {/* Voice Assistant Sheet */}
      <LiveVoiceSheet
        isOpen={showVoiceSheet}
        onClose={() => setShowVoiceSheet(false)}
        onExecuteAction={handleExecuteAutonomousAction}
      />
    </div>
  );
};
