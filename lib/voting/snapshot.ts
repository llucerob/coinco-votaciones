/* eslint-disable @typescript-eslint/no-explicit-any */
import { initialMembers, initialVoteItem } from "@/lib/data";
import type { VotingSnapshot } from "@/types";

interface SupabaseLike {
  from: (table: string) => any;
}

export async function loadVotingSnapshot(supabase: SupabaseLike): Promise<VotingSnapshot | null> {
  const membersQuery = supabase
    .from("council_members")
    .select("id, name, image")
    .order("id", { ascending: true });

  const voteQuery = supabase
    .from("vote_sessions")
    .select("id, title, description, is_open, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const [membersResult, voteResult] = await Promise.all([membersQuery, voteQuery]);

  if (membersResult.error || voteResult.error) {
    return null;
  }

  const currentVote =
    voteResult.data && voteResult.data.id
      ? {
          id: voteResult.data.id,
          title: voteResult.data.title,
          description: voteResult.data.description ?? "",
          isOpen: voteResult.data.is_open,
        }
      : initialVoteItem;

  const votesResult =
    currentVote.id === initialVoteItem.id
      ? { data: [], error: null }
      : await supabase
          .from("votes")
          .select("member_id, decision, updated_at")
          .eq("session_id", currentVote.id);

  if (votesResult.error) {
    return null;
  }

  return {
    members:
      membersResult.data && membersResult.data.length > 0 ? membersResult.data : initialMembers,
    currentVote,
    records: (votesResult.data ?? []).map(
      (record: { member_id: string; decision: string; updated_at: string }) => ({
        memberId: record.member_id,
        decision: record.decision,
        updatedAt: record.updated_at,
      }),
    ),
  };
}