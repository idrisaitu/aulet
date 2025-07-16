export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  familyIds: string[];
}

export interface Family {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
  microchats: string[];
  events: FamilyEvent[];
}

export interface Microchat {
  id: string;
  name: string;
  familyId: string;
  category: string;
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'location';
}

export interface FamilyEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  familyId: string;
  createdBy: string;
}

export interface TimelineStory {
  id: string;
  familyId: string;
  createdBy: string;
  content: string;
  media: string[];
  timestamp: number;
  expiresAt: number;
}

export interface FamilyTreeMember {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  photo?: string;
  parentIds: string[];
  spouseId?: string;
}

export interface LocationShare {
  userId: string;
  familyId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  isSharing: boolean;
} 