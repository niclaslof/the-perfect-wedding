// Database types for The Perfect Wedding

export type Role = "admin" | "coordinator" | "guest";
export type CoordinatorType = "toastmaster" | "dj" | "photographer" | null;
export type InviteVia = "email" | "sms" | null;
export type DietaryType = "none" | "vegetarian" | "vegan" | "halal" | "kosher" | "other";
export type ItemType = "general" | "speech" | "activity" | "meal" | "break";
export type SpeechStatus = "pending" | "approved" | "denied" | "rescheduled";
export type NotificationType = "info" | "update" | "speech_approved" | "speech_denied" | "reminder";
export type ChannelType = "group" | "dm";

export type Wedding = {
  id: string;
  name: string;
  date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_lat: number | null;
  venue_lng: number | null;
  ceremony_time: string | null;
  dinner_time: string | null;
  party_time: string | null;
  dress_code: string | null;
  osa_deadline: string | null;
  extra_info: Record<string, unknown>;
  created_at: string;
};

export type Guest = {
  id: string;
  wedding_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  invite_code: string;
  role: Role;
  coordinator_type: CoordinatorType;
  plus_one_allowed: boolean;
  plus_one_name: string | null;
  invite_sent_at: string | null;
  invite_sent_via: InviteVia;
  last_seen_at: string | null;
  created_at: string;
};

export type EventPart = {
  id: string;
  wedding_id: string;
  name: string;
  slug: string;
  starts_at: string | null;
  ends_at: string | null;
  location_override: string | null;
  description: string | null;
  sort_order: number;
};

export type RSVP = {
  id: string;
  guest_id: string;
  attending: boolean | null;
  plus_one_attending: boolean;
  plus_one_name: string | null;
  message: string | null;
  responded_at: string | null;
  created_at: string;
};

export type DietaryPreference = {
  id: string;
  guest_id: string;
  is_plus_one: boolean;
  allergies: string[];
  dietary_type: DietaryType;
  other_notes: string | null;
  created_at: string;
};

export type ScheduleItem = {
  id: string;
  event_part_id: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  duration_minutes: number | null;
  item_type: ItemType;
  assigned_guest_id: string | null;
  sort_order: number;
  is_public: boolean;
};

export type SpeechRequest = {
  id: string;
  guest_id: string;
  event_part_id: string;
  preferred_time: string | null;
  estimated_minutes: number;
  topic: string | null;
  status: SpeechStatus;
  admin_note: string | null;
  schedule_item_id: string | null;
  created_at: string;
};

export type ChatChannel = {
  id: string;
  wedding_id: string;
  channel_type: ChannelType;
  name: string | null;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  channel_id: string;
  guest_id: string;
  content: string;
  created_at: string;
};

export type Photo = {
  id: string;
  wedding_id: string;
  guest_id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
};

export type GuestbookEntry = {
  id: string;
  wedding_id: string;
  guest_id: string | null;
  name: string;
  message: string;
  created_at: string;
};

export type GuestbookReply = {
  id: string;
  entry_id: string;
  guest_id: string;
  message: string;
  created_at: string;
};

export type Notification = {
  id: string;
  wedding_id: string;
  target_guest_id: string | null;
  title: string;
  body: string | null;
  notification_type: NotificationType;
  read_at: string | null;
  created_at: string;
};

// Session payload stored in JWT cookie
export type SessionPayload = {
  guest_id: string;
  wedding_id: string;
  role: Role;
  name: string;
};
