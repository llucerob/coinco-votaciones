"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialVoteItem } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { loadVotingSnapshot } from "@/lib/voting/snapshot";
import type {
  CouncilMember,
  VoteDecision,
  VoteItem,
  VoteRecord,
  VotingSnapshot,
} from "@/types";

interface VotingState {
  members: CouncilMember[];
  currentVote: VoteItem;
  records: VoteRecord[];
  hydrated: boolean;
  syncing: boolean;
  error: string | null;
}

interface VotingContextValue extends VotingState {
  refresh: () => Promise<void>;
  clearError: () => void;
  updateMember: (id: string, payload: Partial<CouncilMember>) => Promise<void>;
  openVote: (title: string, description?: string) => Promise<void>;
  closeVote: () => Promise<void>;
  resetVotes: () => Promise<void>;
  castVote: (memberId: string, decision: VoteDecision) => Promise<void>;
}

const VotingContext = createContext<VotingContextValue | null>(null);

function getFriendlyVoteError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("row-level security") ||
    normalized.includes("duplicate key") ||
    normalized.includes("violates unique constraint")
  ) {
    return "Usted ya emitio su voto y no puede modificarlo.";
  }

  return message;
}

function toState(snapshot: VotingSnapshot): VotingState {
  return {
    members: snapshot.members,
    currentVote: snapshot.currentVote,
    records: snapshot.records,
    hydrated: true,
    syncing: false,
    error: null,
  };
}

export function VotingStoreProvider({
  children,
  initialSnapshot,
}: {
  children: ReactNode;
  initialSnapshot: VotingSnapshot;
}) {
  const [state, setState] = useState<VotingState>(() => toState(initialSnapshot));
  const supabase = useMemo(() => createClient(), []);

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, syncing: true, error: null }));

    const snapshot = await loadVotingSnapshot(supabase);

    if (!snapshot) {
      setState((current) => ({
        ...current,
        syncing: false,
        hydrated: true,
        error: "No fue posible sincronizar con Supabase.",
      }));
      return;
    }

    setState(toState(snapshot));
  }, [supabase]);

  useEffect(() => {
    setState(toState(initialSnapshot));
  }, [initialSnapshot]);

  useEffect(() => {
    const channel = supabase
      .channel("coinco-votaciones-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "council_members" },
        () => startTransition(() => void refresh()),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vote_sessions" },
        () => startTransition(() => void refresh()),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votes" },
        () => startTransition(() => void refresh()),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh, supabase]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      startTransition(() => void refresh());
    }, 2000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  const value = useMemo<VotingContextValue>(
    () => ({
      ...state,
      refresh,
      clearError: () => setState((current) => ({ ...current, error: null })),
      updateMember: async (id, payload) => {
        const { error } = await supabase.from("council_members").update(payload).eq("id", id);

        if (error) {
          setState((current) => ({ ...current, error: error.message }));
          return;
        }

        await refresh();
      },
      openVote: async (title, description) => {
        const closeOpen = await supabase
          .from("vote_sessions")
          .update({ is_open: false })
          .eq("is_open", true);

        if (closeOpen.error) {
          setState((current) => ({ ...current, error: closeOpen.error.message }));
          return;
        }

        const insertVote = await supabase.from("vote_sessions").insert({
          title: title.trim() || "Nueva votacion",
          description: description?.trim() || "Sin descripcion adicional.",
          is_open: true,
        });

        if (insertVote.error) {
          setState((current) => ({ ...current, error: insertVote.error.message }));
          return;
        }

        await refresh();
      },
      closeVote: async () => {
        if (!state.currentVote.id || state.currentVote.id === initialVoteItem.id) {
          return;
        }

        const { error } = await supabase
          .from("vote_sessions")
          .update({ is_open: false })
          .eq("id", state.currentVote.id);

        if (error) {
          setState((current) => ({ ...current, error: error.message }));
          return;
        }

        await refresh();
      },
      resetVotes: async () => {
        if (!state.currentVote.id || state.currentVote.id === initialVoteItem.id) {
          return;
        }

        const { error } = await supabase.from("votes").delete().eq("session_id", state.currentVote.id);

        if (error) {
          setState((current) => ({ ...current, error: error.message }));
          return;
        }

        await refresh();
      },
      castVote: async (memberId, decision) => {
        if (!state.currentVote.isOpen || state.currentVote.id === initialVoteItem.id) {
          return;
        }

        const alreadyVoted = state.records.some((record) => record.memberId === memberId);

        if (alreadyVoted) {
          setState((current) => ({
            ...current,
            error: "Tu voto ya fue registrado y no puede modificarse.",
          }));
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setState((current) => ({ ...current, error: "Debes iniciar sesion para votar." }));
          return;
        }

        const { error } = await supabase.from("votes").insert({
          session_id: state.currentVote.id,
          member_id: memberId,
          user_id: user.id,
          decision,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          setState((current) => ({
            ...current,
            error: getFriendlyVoteError(error.message),
          }));
          return;
        }

        await refresh();
      },
    }),
    [refresh, state, supabase],
  );

  return <VotingContext.Provider value={value}>{children}</VotingContext.Provider>;
}

export function useVotingStore() {
  const context = useContext(VotingContext);

  if (!context) {
    throw new Error("useVotingStore debe usarse dentro de VotingStoreProvider");
  }

  return context;
}
