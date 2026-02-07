export type UserRole = 'trader' | 'provider' | 'admin';

export type ProviderStatus = 'pending' | 'approved' | 'rejected';

export type TransportMode = 'rail' | 'road' | 'ship' | 'air';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName?: string;
  phone?: string;
  createdAt: Date;
}

export interface Provider extends User {
  status: ProviderStatus;
  transportModes: TransportMode[];
  licenseNumber?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Container {
  id: string;
  providerId: string;
  providerName: string;
  transportMode: TransportMode;
  origin: string;
  destination: string;
  departureDate: Date;
  arrivalDate: Date;
  totalCapacity: number; // in cubic meters
  availableCapacity: number;
  pricePerCubicMeter: number;
  currency: string;
  containerType: string;
  description?: string;
}

export interface Booking {
  id: string;
  containerId: string;
  traderId: string;
  providerId: string;
  spaceBooked: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  paymentId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  participantIds: string[];
  lastMessage?: ChatMessage;
  updatedAt: Date;
}
