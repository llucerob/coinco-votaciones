"use client";

import { useTransition } from "react";
import { useVotingStore } from "@/store/voting-store";
import type { VoteDecision } from "@/types";

const options: Array<{ label: string; value: VoteDecision; tone: string }> = [
  {
    label: "Apruebo",
    value: "APRUEBO",
    tone: "hover:border-emerald-400/60 hover:bg-emerald-500/12",
  },
  {
    label: "Rechazo",
    value: "RECHAZO",
    tone: "hover:border-rose-400/60 hover:bg-rose-500/12",
  },
  {
    label: "Abstencion",
    value: "ABSTENCION",
    tone: "hover:border-amber-300/60 hover:bg-amber-400/12",
  },
];

export default function VotePanel({ memberId }: { memberId: string }) {
  const { currentVote, castVote, records, error, clearError, syncing } = useVotingStore();
  const [isPending, startTransition] = useTransition();
  const current = records.find((record) => record.memberId === memberId);

  const submitVote = (decision: VoteDecision) => {
    startTransition(async () => {
      clearError();
      await castVote(memberId, decision);
    });
  };

  return (
    <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Votacion actual</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{currentVote.title}</h2>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">
          {syncing ? "Sincronizando" : "Conectado a Supabase"}
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">{currentVote.description}</p>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {!currentVote.isOpen ? (
        <div className="mt-8 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-5 py-4 text-amber-100">
          La votacion esta cerrada. Espera una nueva apertura desde administracion.
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {options.map((option) => {
            const selected = current?.decision === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => submitVote(option.value)}
                disabled={isPending}
                className={`rounded-[22px] border px-5 py-4 text-left transition disabled:opacity-60 ${
                  selected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[#0a1117]"
                    : `border-white/10 bg-black/20 text-white ${option.tone}`
                }`}
              >
                <div className="text-lg font-semibold">{option.label}</div>
                <div className="mt-1 text-sm opacity-80">
                  {selected ? "Seleccion actual" : "Registrar este voto"}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {current ? (
        <p className="mt-6 text-sm text-white/70">
          Voto actual: <span className="font-semibold text-white">{current.decision}</span>
        </p>
      ) : (
        <p className="mt-6 text-sm text-white/60">Aun no registras un voto.</p>
      )}
    </section>
  );
}