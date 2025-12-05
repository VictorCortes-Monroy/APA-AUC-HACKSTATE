export enum RequestStatus {
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  COMPLETED = 'COMPLETED'
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or Lucide icon name
  unlocked: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  karma: number;
  skills: string[]; 
  interests: string[];
  major: string;
  // Gamification Fields
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number; // "Racha"
  totalHelps: number;
  badges: Badge[];
}

export interface HelpRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requesterMajor: string; 
  preferredMajor?: string; 
  topic: string; 
  description: string;
  location: string; 
  offer: string; 
  status: RequestStatus;
  timestamp: number;
  tags: string[];
  helperId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}