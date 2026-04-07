export type VoteDecision = "APRUEBO" | "RECHAZO" | "ABSTENCION" | "SIN_VOTO";
export type UserRole = "admin" | "council";

export interface CouncilMember {
  id: string;
  name: string;
  image: string;
}

export interface VoteItem {
  id: string;
  sessionNumber?: string;
  title: string;
  description?: string;
  isOpen: boolean;
}

export interface VoteRecord {
  memberId: string;
  decision: VoteDecision;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  member_id: string | null;
  display_name: string | null;
}

export interface VotingSnapshot {
  members: CouncilMember[];
  currentVote: VoteItem;
  records: VoteRecord[];
}
