import { Timestamp } from 'firebase/firestore'

export type MemberAppStore = "apple" | "play" | "web" | "download";


export interface MemberApp {
  name: string;
  description: string;
  url: string;
  store: MemberAppStore;
}

export interface Member {
  id?: string;
  name: string;
  role: "Organizing Team" | "Member";
  title: string;
  portrait: string;
  bio: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  apps: MemberApp[];
}

export interface ProjectLink {
  label: string;
  url: string;
  icon: "apple" | "play" | "web" | "download";
}

export interface Project {
  id?: string;
  name: string;
  tagline: string;
  builder: string;
  cover: string;
  screenshots: string[];
  description: string;
  monetisation: string;
  tags: string[];
  links: ProjectLink[];
  featured: boolean;
  featuredOrder?: number;
}


export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;          // ISO 8601
  time: string;          // e.g. "6:30 PM BST"
  location: string;      // human-readable address
  locationUrl: string;   // Google Maps URL
  meetupUrl: string;
  coverImage: string;    // URL or local asset path
  tags: string[];
}

export interface EventTalk {
  id: string;
  speakerName: string;
  speakerTitle: string;
  speakerPortrait: string;   // image URL
  talkTitle: string;
  youtubeUrl: string;         // full YouTube watch URL
}

export interface PastEvent {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  description: string;
  fullDescription: string;
  tags: string[];
  galleryImages: string[];
  talks: EventTalk[];
}

export interface OutreachActivity {
  id: string;
  title: string;
  summary: string;          // short, 1-2 sentences
  fullDescription: string;
  date: string;
  coverImage: string;
  gallery: string[];        // 3–6 image URLs for carousel
  tags: string[];
}

export interface AuditEntry {
  id: string;
  action: 'create' | 'update' | 'delete' | 'restore' | 'login' | 'logout';
  collection: string;
  docId: string;
  performedBy: string;       // Firebase Auth UID
  performedByEmail: string;
  timestamp: Timestamp;
  detail?: string;
}

export interface SoftDeletedDoc {
  id: string;
  originalCollection: string;
  data: Record<string, unknown>;
  deletedBy: string;
  deletedAt: Timestamp;
  purgeAfter: Timestamp;     // deletedAt + 30 days
}



