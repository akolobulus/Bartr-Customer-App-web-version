import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { BartrScreen, AutonomousAction } from './types';
import { BartrRepository } from './data/bartrData';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import {
  RequestInputScreen,
  ParsedScreen,
  MatchingScreen,
  MatchesScreen
} from './screens/RequestScreens';
import {
  VendorProfileScreen,
  SendingScreen,
  JobStatusScreen,
  ChatScreen,
  RatingScreen
} from './screens/VendorScreens';
import {
  PaymentsScreen,
  PromotionsScreen,
  MyRequestsScreen,
  SavedVendorsScreen,
  GetHelpScreen,
  FaqDetailScreen,
  AboutScreen,
  ProfileScreen,
  EditProfileScreen,
  InviteFriendScreen
} from './screens/MenuScreens';
import { BartrNameLogo } from './components/BartrComponents';
import { BartrSidebar } from './components/BartrSidebar';
import { VoiceButton } from './components/VoiceButton';
import { LiveVoiceSheet } from './components/LiveVoiceSheet';
import { Analytics } from "@vercel/analytics/next";

export const App: React.FC = () => {
  const [screenStack, setScreenStack] = useState<BartrScreen[]>([{ name: 'splash' }]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showVoiceSheet, setShowVoiceSheet] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const currentScreen = screenStack[screenStack.length - 1] || { name: 'home' };

  const goTo = (screen: BartrScreen) => {
    setScreenStack(prev => [...prev, screen]);
  };

  const goBack = () => {
    setScreenStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const replaceTop = (screen: BartrScreen) => {
    setScreenStack(prev => [...(prev.length > 0 ? prev.slice(0, -1) : []), screen]);
  };

  const resetToHome = () => {
    setScreenStack([{ name: 'home' }]);
  };

  const handleExecuteAutonomousAction = (action: AutonomousAction) => {
    showToast(`AI: ${action.summary}`);

    switch (action.type) {
      case 'SearchVendors':
        if (action.query) {
          goTo({ name: 'parsed', query: action.query });
        } else {
          goTo({ name: 'request' });
        }
        break;

      case 'ApplyPromo':
        goTo({ name: 'promotions' });
        break;

      case 'OpenVendorChat':
        if (action.vendorId) {
          goTo({ name: 'chat', vendorId: action.vendorId });
        }
        break;

      case 'BookVendor':
        if (action.vendorId) {
          goTo({ name: 'sending', vendorId: action.vendorId });
        }
        break;

      case 'NavigateTo':
        switch (action.destination) {
          case 'payments':
            goTo({ name: 'payments' });
            break;
          case 'promotions':
            goTo({ name: 'promotions' });
            break;
          case 'my_requests':
            goTo({ name: 'my_requests' });
            break;
          case 'saved_vendors':
            goTo({ name: 'saved_vendors' });
            break;
          case 'help':
            goTo({ name: 'get_help' });
            break;
          case 'about':
            goTo({ name: 'about' });
            break;
          case 'profile':
            goTo({ name: 'profile' });
            break;
          case 'invite_friend':
            goTo({ name: 'invite_friend' });
            break;
        }
        break;
    }
  };

  const isHomeScreen = currentScreen.name === 'home';
  const isSplashScreen = currentScreen.name === 'splash';

  return (
    <div className="w-full h-screen h-[100dvh] bg-slate-100 flex flex-col overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0A2E65] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-white/20 animate-in fade-in slide-in-from-top duration-200">
          {toastMessage}
        </div>
      )}

      {/* Secondary Screens Desktop Header Bar:
          - Left: Hamburger Menu Button (opens sidebar with all navs as in mobile devices)
          - Center: Bartr Brand logo centered on large screens
          - Right: Voice button (single mic icon, text on hover only) + Profile avatar
          - No horizontal text nav links! All navs are in the sidebar!
      */}
      {!isHomeScreen && !isSplashScreen && (
        <header className="hidden md:flex items-center justify-between relative px-6 py-3.5 border-b border-slate-200 bg-white z-30 shrink-0 shadow-xs">
          {/* Left: Hamburger Menu Button */}
          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#0A2E65] active:scale-95 transition-all cursor-pointer"
              title="Menu"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Center: Bartr Logo moved to center on large screens */}
          <div
            onClick={resetToHome}
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer pointer-events-auto"
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

            <button
              onClick={() => goTo({ name: 'profile' })}
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
      )}

      {/* Sidebar Navigation (All navs in the sidebar as it is in mobile smaller devices) */}
      <BartrSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={screen => goTo(screen)}
        onBecomeVendor={() => showToast("Vendor mode is coming soon!")}
      />

      {/* Voice Assistant Sheet for secondary screens */}
      <LiveVoiceSheet
        isOpen={showVoiceSheet}
        onClose={() => setShowVoiceSheet(false)}
        onExecuteAction={handleExecuteAutonomousAction}
      />

      {/* Screen Container:
          - If HomeScreen: takes 100% width and height without bounding box
          - If Sub-screen on desktop: centered elegantly in modern desktop web frame
          - On mobile: always 100% full screen
      */}
      <main className="w-full flex-1 flex flex-col overflow-hidden relative">
        <div
          className={`w-full h-full flex flex-col overflow-hidden ${
            !isHomeScreen && !isSplashScreen
              ? 'md:max-w-2xl lg:max-w-3xl md:mx-auto md:my-auto md:h-[88vh] md:max-h-[860px] md:rounded-3xl md:shadow-2xl md:border md:border-slate-200 bg-white'
              : ''
          }`}
        >
          {(() => {
            switch (currentScreen.name) {
              case 'splash':
                return (
                  <SplashScreen
                    onSplashFinished={() => replaceTop({ name: 'home' })}
                  />
                );

              case 'home':
                return (
                  <HomeScreen
                    onSearchClick={() => goTo({ name: 'request' })}
                    onVendorClick={vendor =>
                      goTo({ name: 'vendor_profile', vendorId: vendor.id })
                    }
                    onOpenProfile={() => goTo({ name: 'profile' })}
                    onOpenPayments={() => goTo({ name: 'payments' })}
                    onOpenPromotions={() => goTo({ name: 'promotions' })}
                    onOpenMyRequests={() => goTo({ name: 'my_requests' })}
                    onOpenSavedVendors={() => goTo({ name: 'saved_vendors' })}
                    onOpenInviteFriend={() => goTo({ name: 'invite_friend' })}
                    onOpenGetHelp={() => goTo({ name: 'get_help' })}
                    onOpenAbout={() => goTo({ name: 'about' })}
                    onRequestVendorDirect={vendorId =>
                      goTo({ name: 'sending', vendorId })
                    }
                    onOpenChatDirect={vendorId =>
                      goTo({ name: 'chat', vendorId })
                    }
                    onSearchMatchesDirect={query =>
                      goTo({ name: 'parsed', query })
                    }
                  />
                );

              case 'request':
                return (
                  <RequestInputScreen
                    onBack={goBack}
                    onFindVendors={query => goTo({ name: 'parsed', query })}
                  />
                );

              case 'parsed':
                return (
                  <ParsedScreen
                    query={currentScreen.query}
                    onBack={goBack}
                    onConfirm={() =>
                      goTo({ name: 'matching', query: currentScreen.query })
                    }
                  />
                );

              case 'matching':
                return (
                  <MatchingScreen
                    query={currentScreen.query}
                    onMatched={() => replaceTop({ name: 'matches' })}
                  />
                );

              case 'matches':
                return (
                  <MatchesScreen
                    onBack={goBack}
                    onVendorClick={vendor =>
                      goTo({ name: 'vendor_profile', vendorId: vendor.id })
                    }
                  />
                );

              case 'vendor_profile': {
                const vendor = BartrRepository.getVendor(currentScreen.vendorId);
                return (
                  <VendorProfileScreen
                    vendor={vendor}
                    onBack={goBack}
                    onOpenChat={() => goTo({ name: 'chat', vendorId: vendor.id })}
                    onRequestVendor={() =>
                      goTo({ name: 'sending', vendorId: vendor.id })
                    }
                  />
                );
              }

              case 'sending':
                return (
                  <SendingScreen
                    onSent={() =>
                      replaceTop({
                        name: 'job_status',
                        vendorId: currentScreen.vendorId
                      })
                    }
                  />
                );

              case 'job_status': {
                const vendor = BartrRepository.getVendor(currentScreen.vendorId);
                return (
                  <JobStatusScreen
                    vendor={vendor}
                    onBack={goBack}
                    onOpenChat={() => goTo({ name: 'chat', vendorId: vendor.id })}
                    onCancel={resetToHome}
                    onCompleteJob={() =>
                      replaceTop({ name: 'rating', vendorId: vendor.id })
                    }
                  />
                );
              }

              case 'chat': {
                const vendor = BartrRepository.getVendor(currentScreen.vendorId);
                return <ChatScreen vendor={vendor} onBack={goBack} />;
              }

              case 'rating': {
                const vendor = BartrRepository.getVendor(currentScreen.vendorId);
                return <RatingScreen vendor={vendor} onSubmit={resetToHome} />;
              }

              case 'payments':
                return <PaymentsScreen onBack={goBack} />;

              case 'promotions':
                return (
                  <PromotionsScreen
                    onBack={goBack}
                    onInviteFriend={() => goTo({ name: 'invite_friend' })}
                  />
                );

              case 'my_requests':
                return <MyRequestsScreen onBack={goBack} />;

              case 'saved_vendors':
                return (
                  <SavedVendorsScreen
                    onBack={goBack}
                    onVendorClick={vendor =>
                      goTo({ name: 'vendor_profile', vendorId: vendor.id })
                    }
                  />
                );

              case 'get_help':
                return (
                  <GetHelpScreen
                    onBack={goBack}
                    onOpenFaqFeatures={() => goTo({ name: 'faq_features' })}
                    onOpenFaqAccount={() => goTo({ name: 'faq_account' })}
                    onOpenFaqPayments={() => goTo({ name: 'faq_payments' })}
                  />
                );

              case 'faq_features':
                return (
                  <FaqDetailScreen
                    title="App and features"
                    items={BartrRepository.faqFeaturesList}
                    onBack={goBack}
                  />
                );

              case 'faq_account':
                return (
                  <FaqDetailScreen
                    title="Account and data"
                    items={BartrRepository.faqAccountList}
                    onBack={goBack}
                  />
                );

              case 'faq_payments':
                return (
                  <FaqDetailScreen
                    title="Payments and pricing"
                    items={BartrRepository.faqPaymentsList}
                    onBack={goBack}
                  />
                );

              case 'about':
                return <AboutScreen onBack={goBack} />;

              case 'profile':
                return (
                  <ProfileScreen
                    onBack={goBack}
                    onEditProfile={() => goTo({ name: 'edit_profile' })}
                  />
                );

              case 'edit_profile':
                return <EditProfileScreen onBack={goBack} onSave={goBack} />;

              case 'invite_friend':
                return <InviteFriendScreen onBack={goBack} />;

              default:
                return null;
            }
          })()}
        </div>
      </main>

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
};

export default App;
