export interface PersonalInfo {
  id: number;
  name_cn: string;
  name_en: string;
  title: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  avatar_path: string;
  resume_path: string;
  career_goal: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  wechat_qr_path: string;
}

export interface TimelineItem {
  id: number;
  category: 'experience' | 'education';
  title: string;
  subtitle: string;
  description: string;
  start_date: string;
  end_date: string;
  sort_order: number;
  is_current: boolean;
  badge_text: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  short_description: string;
  full_description: string;
  image_path: string;
  github_url: string;
  live_url: string;
  sort_order: number;
  featured: boolean;
}

export interface Competition {
  id: number;
  title: string;
  award: string;
  date: string;
  icon: string;
  sort_order: number;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  is_marquee: boolean;
  sort_order: number;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  icon: string;
  url: string;
  sort_order: number;
}

export interface Interest {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  icon_color: string;
  link_url: string;
  link_text: string;
  sort_order: number;
}

export interface TravelPhoto {
  id: number;
  country: string;
  image_path: string;
  caption: string;
  sort_order: number;
}

export interface Playlist {
  id: number;
  title: string;
  platform: string;
  link_url: string;
  sort_order: number;
}

export interface GuestbookMessage {
  id: number;
  author_name: string;
  message: string;
  created_at: string;
}

export interface Writing {
  id: number;
  title: string;
  url: string;
  description: string;
  platform: string;
  sort_order: number;
}

export interface AdminStats {
  pending_messages: number;
  total_projects: number;
  total_timeline: number;
  total_skills: number;
  total_interests: number;
}
