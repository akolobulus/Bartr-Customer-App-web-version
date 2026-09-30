import React, { useState } from 'react';
import {
  Banknote,
  CreditCard,
  Gift,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Phone,
  Mail,
  Star,
  ThumbsUp,
  Briefcase,
  FileText,
  User,
  Home,
  LogOut,
  Trash2,
  Edit2
} from 'lucide-react';
import { Vendor } from '../types';
import { BartrRepository } from '../data/bartrData';
import {
  BartrTopBar,
  BartrPageHeader,
  BartrButtonPrimary,
  BartrVendorRow,
  VendorTypeIcon,
  BartrNameLogo
} from '../components/BartrComponents';

// ==================== PAYMENTS SCREEN ====================
export const PaymentsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrPageHeader title="Payments" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <p className="text-sm text-[#5B6472] leading-relaxed">
          Pay however feels safest to you. Cash works for every job, or add a card for faster checkout.
        </p>

        {/* Cash on completion */}
        <div className="rounded-2xl bg-[#F5F6FA] p-4.5 flex items-center gap-3.5 border border-slate-200/60">
          <Banknote size={26} className="text-[#0067F5] shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-[#0A2E65]">Cash on completion</h3>
            <p className="text-xs text-[#5B6472] mt-0.5">Pay the vendor directly when the job's done</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#ECFBEC] text-[#2F9E63] text-xs font-bold shrink-0">
            Default
          </span>
        </div>

        {/* Add Card */}
        <div
          onClick={() => alert("Card payments are coming soon in Lagos!")}
          className="rounded-2xl bg-[#F5F6FA] p-4.5 flex items-center gap-3.5 border border-slate-200/60 cursor-pointer active:scale-[0.99] transition-transform hover:bg-slate-100"
        >
          <CreditCard size={26} className="text-[#0067F5] shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-[#0A2E65]">Add a debit or credit card</h3>
            <p className="text-xs text-[#5B6472] mt-0.5">For escrow-protected, higher-value jobs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PROMOTIONS SCREEN ====================
export const PromotionsScreen: React.FC<{
  onBack: () => void;
  onInviteFriend: () => void;
}> = ({ onBack, onInviteFriend }) => {
  const [promoCode, setPromoCode] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const handleApply = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setFeedback("Enter a code to apply it.");
    } else if (code === 'BARTR500' || code === 'WELCOME') {
      setFeedback(`Promo code "${code}" applied! ₦500 off your next request.`);
    } else {
      setFeedback(`"${code}" doesn't match an active promotion right now.`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrPageHeader title="Enter promo code" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div className="rounded-2xl bg-[#F5F6FA] border border-slate-200 p-3.5 focus-within:border-[#0067F5]">
          <input
            type="text"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            placeholder="Promo code"
            className="w-full bg-transparent border-none outline-none font-medium text-base text-[#0A2E65] uppercase"
          />
        </div>

        <p className="text-xs text-[#5B6472]">
          The promo will be applied to your next request.
        </p>

        {feedback && (
          <div className={`p-3 rounded-xl text-xs font-semibold ${
            feedback.includes('applied') ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
          }`}>
            {feedback}
          </div>
        )}

        {/* Referral Callout */}
        <div
          onClick={onInviteFriend}
          className="rounded-2xl bg-[#E1F6FF] p-4 flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0067F5] shrink-0 shadow-xs">
            <Gift size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#0A2E65]">Don't have a code yet?</h3>
            <p className="text-xs text-[#5B6472] mt-0.5">Refer a friend to get one</p>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-slate-100 bg-white">
        <BartrButtonPrimary text="Apply" onClick={handleApply} />
      </div>
    </div>
  );
};

// ==================== MY REQUESTS SCREEN ====================
export const MyRequestsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const requests = BartrRepository.pastRequests;
  const months = ['Sept 2026', 'Aug 2026'];

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrPageHeader title="My requests" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-2">
        {months.map(month => {
          const items = requests.filter(r => r.month === month);
          return (
            <div key={month} className="mb-6">
              <h2 className="text-sm font-bold text-[#0A2E65] mt-4 mb-2">{month}</h2>
              <div className="divide-y divide-black/[0.06]">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center py-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E1F6FF] text-[#0067F5] flex items-center justify-center shrink-0">
                      <VendorTypeIcon type={item.iconType} size={18} />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#0A2E65] truncate">{item.title}</h3>
                      <p className="text-xs text-[#5B6472] truncate">{item.vendorName} · {item.status}</p>
                    </div>
                    <span className="text-sm font-bold text-[#0A2E65] font-space">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== SAVED VENDORS SCREEN ====================
export const SavedVendorsScreen: React.FC<{
  onBack: () => void;
  onVendorClick: (vendor: Vendor) => void;
}> = ({ onBack, onVendorClick }) => {
  const saved = [
    BartrRepository.getVendor("chuka"),
    BartrRepository.getVendor("adaeze"),
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrPageHeader title="Saved vendors" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="divide-y divide-black/[0.06]">
          {saved.map(vendor => (
            <BartrVendorRow
              key={vendor.id}
              vendor={vendor}
              onClick={() => onVendorClick(vendor)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== GET HELP SCREEN ====================
export const GetHelpScreen: React.FC<{
  onBack: () => void;
  onOpenFaqFeatures: () => void;
  onOpenFaqAccount: () => void;
  onOpenFaqPayments: () => void;
}> = ({ onBack, onOpenFaqFeatures, onOpenFaqAccount, onOpenFaqPayments }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrPageHeader title="Get help" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Navigation Cards */}
        <HelpNavCard title="App and features" onClick={onOpenFaqFeatures} />
        <HelpNavCard title="Account and data" onClick={onOpenFaqAccount} />
        <HelpNavCard title="Payments and pricing" onClick={onOpenFaqPayments} />

        <div className="pt-4">
          <h2 className="text-xs font-bold text-[#5B6472] tracking-wider uppercase mb-3">
            Still Need Help?
          </h2>

          <div className="space-y-2.5">
            <HelpActionCard
              icon={<MessageSquare size={20} className="text-[#0067F5]" />}
              title="Chat with support"
              onClick={() => alert("Support chat is available 24/7 in Lagos!")}
            />
            <HelpActionCard
              icon={<Phone size={20} className="text-[#0067F5]" />}
              title="Call support"
              onClick={() => alert("Support phone: +234 800 000 0000")}
            />
            <HelpActionCard
              icon={<Mail size={20} className="text-[#0067F5]" />}
              title="Email us"
              onClick={() => alert("Email support: support@bartr.app")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const HelpNavCard: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="rounded-2xl bg-[#F5F6FA] p-4.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform hover:bg-slate-100 border border-slate-200/60"
  >
    <span className="font-semibold text-sm text-[#0A2E65]">{title}</span>
    <ChevronRight size={16} className="text-[#5B6472]" />
  </div>
);

const HelpActionCard: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void }> = ({
  icon,
  title,
  onClick
}) => (
  <div
    onClick={onClick}
    className="rounded-2xl bg-[#F5F6FA] p-4 flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-transform hover:bg-slate-100 border border-slate-200/60"
  >
    {icon}
    <span className="font-semibold text-sm text-[#0A2E65]">{title}</span>
  </div>
);

// ==================== FAQ DETAIL SCREEN ====================
export const FaqDetailScreen: React.FC<{
  title: string;
  items: { q: string; a: string }[];
  onBack: () => void;
}> = ({ title, items, onBack }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrPageHeader title={title} onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-2 divide-y divide-black/[0.06]">
        {items.map((item, idx) => {
          const isOpen = expandedIndex === idx;
          return (
            <div key={idx} className="py-4">
              <button
                onClick={() => setExpandedIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-2 text-sm font-semibold text-[#0A2E65]"
              >
                <span>{item.q}</span>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {isOpen && (
                <p className="text-xs text-[#5B6472] mt-2 leading-relaxed animate-in fade-in">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== ABOUT SCREEN ====================
export const AboutScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrPageHeader title="About" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        <div>
          <BartrNameLogo fontSize="text-4xl" color="text-[#0067F5]" />
          <p className="text-sm text-[#5B6472] mt-1 italic">...Let's help you find them.</p>
          <p className="text-xs text-[#5B6472]/80 mt-1">Version 1.0.0 (91896739)</p>
        </div>

        <div className="space-y-2.5">
          <HelpActionCard
            icon={<Star size={20} className="text-[#0067F5]" />}
            title="Rate the app"
            onClick={() => alert("Thanks for supporting Bartr!")}
          />
          <HelpActionCard
            icon={<ThumbsUp size={20} className="text-[#0067F5]" />}
            title="Follow us on social media"
            onClick={() => alert("@BartrApp on Twitter & Instagram")}
          />
          <HelpActionCard
            icon={<Briefcase size={20} className="text-[#0067F5]" />}
            title="Careers at Bartr"
            onClick={() => alert("Check bartr.app/careers for openings")}
          />
          <HelpActionCard
            icon={<FileText size={20} className="text-[#0067F5]" />}
            title="Legal and privacy"
            onClick={() => alert("Terms of Service & Privacy Policy")}
          />
        </div>
      </div>
    </div>
  );
};

// ==================== PROFILE SCREEN ====================
export const ProfileScreen: React.FC<{
  onBack: () => void;
  onEditProfile: () => void;
}> = ({ onBack, onEditProfile }) => {
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <BartrTopBar
        title=""
        onBack={onBack}
        trailing={
          <button
            onClick={onEditProfile}
            className="text-sm font-semibold text-[#0067F5] px-2 py-1"
          >
            Edit
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto space-y-4 pb-8">
        {/* Profile Hero */}
        <div className="flex flex-col items-center pt-2 px-5">
          <div className="w-22 h-22 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#5B6472]">
            <User size={44} />
          </div>
          <h2 className="text-xl font-bold text-[#0A2E65] mt-3">Alex Johnson</h2>
          <p className="text-sm text-[#5B6472] mt-0.5">+234 704 200 1836</p>
        </div>

        <div className="h-2 bg-[#F5F6FA]" />

        {/* Email Row */}
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-[#5B6472]" />
            <span className="text-sm text-[#0A2E65]">alex.johnson@mail.com</span>
          </div>
          <button
            onClick={() => alert("Verification email sent!")}
            className="px-3.5 py-1.5 rounded-full bg-[#0067F5] text-white text-xs font-semibold"
          >
            Verify
          </button>
        </div>

        <div className="h-2 bg-[#F5F6FA]" />

        {/* Favorite Locations */}
        <div className="px-5 space-y-3">
          <h3 className="text-xs font-bold text-[#5B6472] tracking-wider uppercase">
            Favorite Locations
          </h3>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E1F6FF] text-[#0067F5] flex items-center justify-center">
                <Home size={18} />
              </div>
              <span className="text-sm font-medium text-[#0A2E65]">Home</span>
            </div>
            <button
              onClick={() => alert("Set home address")}
              className="px-3 py-1 rounded-full border border-[#0067F5] text-[#0067F5] text-xs font-semibold"
            >
              Add
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E1F6FF] text-[#0067F5] flex items-center justify-center">
                <Briefcase size={18} />
              </div>
              <span className="text-sm font-medium text-[#0A2E65]">Work</span>
            </div>
            <button
              onClick={() => alert("Set work address")}
              className="px-3 py-1 rounded-full border border-[#0067F5] text-[#0067F5] text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        <div className="h-2 bg-[#F5F6FA]" />

        {/* Communication preferences */}
        <div
          onClick={() => alert("Communication preferences updated")}
          className="flex items-center justify-between px-5 py-2 cursor-pointer"
        >
          <span className="text-sm font-medium text-[#0A2E65]">Communication preferences</span>
          <ChevronRight size={16} className="text-[#5B6472]" />
        </div>

        <div className="h-2 bg-[#F5F6FA]" />

        {/* Danger actions */}
        <div className="px-5 space-y-2 pt-2">
          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 py-2 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            <LogOut size={18} />
            Log out
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="w-full flex items-center gap-3 py-2 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            <Trash2 size={18} />
            Delete account
          </button>
        </div>
      </div>

      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#0A2E65]">Log out of Bartr?</h3>
            <p className="text-sm text-[#5B6472]">You can sign back in anytime with your phone number.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-2.5 rounded-xl border text-sm">Cancel</button>
              <button onClick={() => { setShowLogout(false); alert("Logged out"); }} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold">Log out</button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-red-600">Delete account?</h3>
            <p className="text-sm text-[#5B6472]">This will permanently delete your account and all your data. Continue?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl border text-sm">Cancel</button>
              <button onClick={() => { setShowDelete(false); alert("Account deletion submitted"); }} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== EDIT PROFILE SCREEN ====================
export const EditProfileScreen: React.FC<{
  onBack: () => void;
  onSave: () => void;
}> = ({ onBack, onSave }) => {
  const [firstName, setFirstName] = useState<string>('Alex');
  const [lastName, setLastName] = useState<string>('Johnson');

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]">
        <button onClick={onBack} className="text-sm font-medium text-[#0067F5]">Cancel</button>
        <h2 className="text-base font-bold text-[#0A2E65]">Edit profile</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Avatar with edit icon */}
        <div className="flex justify-center my-2">
          <div className="relative">
            <div className="w-22 h-22 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#5B6472]">
              <User size={44} />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0067F5] border-2 border-white flex items-center justify-center text-white">
              <Edit2 size={13} />
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="rounded-2xl bg-[#F5F6FA] p-3.5 border border-slate-200">
          <label className="text-[11px] font-bold text-[#5B6472] uppercase block">First name</label>
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full bg-transparent font-medium text-base text-[#0A2E65] outline-none mt-0.5"
          />
        </div>

        <div className="rounded-2xl bg-[#F5F6FA] p-3.5 border border-slate-200">
          <label className="text-[11px] font-bold text-[#5B6472] uppercase block">Last name</label>
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full bg-transparent font-medium text-base text-[#0A2E65] outline-none mt-0.5"
          />
        </div>

        <div className="rounded-2xl bg-[#F5F6FA] p-3.5 border border-slate-200 opacity-80">
          <label className="text-[11px] font-bold text-[#5B6472] uppercase block">Phone number</label>
          <input
            type="text"
            value="+234 704 200 1836"
            disabled
            className="w-full bg-transparent font-medium text-base text-slate-500 outline-none mt-0.5 cursor-not-allowed"
          />
        </div>

        <p className="text-xs text-[#5B6472] leading-relaxed">
          Your phone number can't be changed. If you want to link your account to another phone number, please contact customer support.
        </p>

        <div className="pt-2">
          <BartrButtonPrimary
            text="Save changes"
            onClick={() => {
              alert("Profile updated!");
              onSave();
            }}
          />
        </div>

        <button
          onClick={() => alert("Facebook connect is coming soon!")}
          className="w-full h-13 rounded-full border border-slate-300 text-sm font-semibold text-[#0A2E65] flex items-center justify-center hover:bg-slate-50"
        >
          Connect to Facebook
        </button>
      </div>
    </div>
  );
};

// ==================== INVITE A FRIEND SCREEN ====================
export const InviteFriendScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bartr',
        text: "I've been using Bartr to find trusted vendors nearby in Lagos. Try it out:",
        url: 'https://bartr.app'
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText("https://bartr.app");
      alert("Invite link copied to clipboard!");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0067F5] text-white">
      <div className="p-4">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <ArrowBackIcon />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-6">
        {/* Friends & Gift Illustration */}
        <div className="relative w-52 h-36 flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-[#E1F6FF] left-4 top-4" />
          <div className="absolute w-24 h-24 rounded-full bg-white right-4 top-4" />
          <div className="relative w-12 h-12 rounded-xl bg-amber-300 shadow-md flex items-center justify-center text-amber-900 font-bold z-10">
            <Gift size={26} />
          </div>
        </div>

        <h1 className="text-3xl font-bold font-rency">Better together!</h1>
        <p className="text-base text-white/90 leading-relaxed max-w-xs">
          Bartr works best when your circle's on it too. Invite a friend, and get things done faster.
        </p>
      </div>

      <div className="p-6">
        <button
          onClick={handleShare}
          className="w-full h-14 rounded-full bg-white text-[#0A2E65] font-bold text-base shadow-lg active:scale-98 transition-transform"
        >
          Invite a friend
        </button>
      </div>
    </div>
  );
};

const ArrowBackIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);
