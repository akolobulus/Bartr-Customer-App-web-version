export type VendorIconType = 'REPAIR' | 'BEAUTY' | 'MECHANIC';

export interface Vendor {
  id: string;
  initial: string;
  name: string;
  category: string;
  iconType: VendorIconType;
  rating: string;
  ratingNum: number;
  reviews: string;
  distance: string;
  response: string;
  blurb: string;
  price: string;
  finalPrice: string;
  review1: string;
  review2: string;
  lat: number;
  lng: number;
  phone: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isFromUser: boolean;
  time: string;
}

export interface PastRequest {
  title: string;
  vendorName: string;
  status: string;
  price: string;
  month: string;
  iconType: VendorIconType;
}

export type BartrScreen =
  | { name: 'splash' }
  | { name: 'home' }
  | { name: 'request' }
  | { name: 'parsed'; query: string }
  | { name: 'matching'; query: string }
  | { name: 'matches' }
  | { name: 'vendor_profile'; vendorId: string }
  | { name: 'sending'; vendorId: string }
  | { name: 'job_status'; vendorId: string }
  | { name: 'chat'; vendorId: string }
  | { name: 'rating'; vendorId: string }
  | { name: 'payments' }
  | { name: 'promotions' }
  | { name: 'my_requests' }
  | { name: 'saved_vendors' }
  | { name: 'get_help' }
  | { name: 'faq_features' }
  | { name: 'faq_account' }
  | { name: 'faq_payments' }
  | { name: 'about' }
  | { name: 'profile' }
  | { name: 'edit_profile' }
  | { name: 'invite_friend' };

export interface AutonomousAction {
  type: string;
  query?: string;
  category?: string;
  filterType?: string;
  value?: string;
  vendorId?: string;
  vendorName?: string;
  phoneNumber?: string;
  destination?: string;
  label?: string;
  locationName?: string;
  direction?: string;
  code?: string;
  initialMessage?: string;
  save?: boolean;
  service?: string;
  price?: string;
  scheduledTime?: string;
  trade?: string;
  taskDescription?: string;
  estimate?: string;
  referralCode?: string;
  summary: string;
  requiresPermission?: boolean;
}

export interface PendingPermission {
  id: string;
  action: AutonomousAction;
  title: string;
  explanation: string;
  details: Record<string, string>;
}

export interface GroundingSource {
  title: string;
  uri?: string;
  snippet?: string;
}

export type VoiceState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'AWAITING_PERMISSION';
