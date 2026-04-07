"use client";

import CouncilCard from "@/components/CouncilCard";
import { useVotingStore } from "@/store/voting-store";
import type { VoteDecision } from "@/types";

export default function ObsResults() {
  const { members, records, currentVote, syncing } = useVotingStore();

  const membersWithVotes = members.map((member) => {
    const record = records.find((item) => item.memberId === member.id);
    const decision = record?.decision ?? "SIN_VOTO";

    return {
      ...member,
      decision: decision as VoteDecision,
    };
  });

  const summary = {
    apruebo: membersWithVotes.filter((member) => member.decision === "APRUEBO").length,
    rechazo: membersWithVotes.filter((member) => member.decision === "RECHAZO").length,
    abstencion: membersWithVotes.filter((member) => member.decision === "ABSTENCION").length,
    sinVoto: membersWithVotes.filter((member) => member.decision === "SIN_VOTO").length,
  };
  const orderedMembers = [
    ...membersWithVotes.filter((member) => member.id === "presidente"),
    ...membersWithVotes.filter((member) => member.id !== "presidente"),
  ];
  const president = orderedMembers[0]?.id === "presidente" ? orderedMembers[0] : undefined;

  return (
    <main className="min-h-screen bg-transparent px-4 py-4 md:px-6">
      <div className="mx-auto flex min-h-[680px] w-full max-w-[1280px] flex-col justify-between">
        <div className="max-w-4xl rounded-[28px] border border-white/10 bg-[rgba(8,13,18,0.42)] px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-md">
          <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-muted)]">
            Concejo Municipal de Coinco
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-5xl">
            {currentVote.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/70 md:text-lg">
            {currentVote.description}
          </p>
        </div>

        <div className="mt-3 text-right text-xs uppercase tracking-[0.22em] text-white/55">
          {syncing ? "Actualizando desde Supabase..." : "Sincronizacion en tiempo real activa"}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {orderedMembers.map((member) => (
            <CouncilCard key={member.id} member={member} decision={member.decision} />
          ))}
        </div>

        {president ? (
          <div className="mt-4 rounded-[26px] border border-white/10 bg-[rgba(8,13,18,0.44)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.24)] backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Resumen de la votacion
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Apruebo" value={summary.apruebo} tone="emerald" />
              <StatCard label="Rechazo" value={summary.rechazo} tone="rose" />
              <StatCard label="Abstencion" value={summary.abstencion} tone="amber" />
              <StatCard label="Ausente o Sin Voto" value={summary.sinVoto} tone="neutral" />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "rose" | "amber" | "neutral";
}) {
  const classes = {
    emerald: "border-emerald-400/40 bg-emerald-500/12 text-emerald-100",
    rose: "border-rose-400/40 bg-rose-500/12 text-rose-100",
    amber: "border-amber-300/40 bg-amber-400/12 text-amber-100",
    neutral: "border-white/10 bg-[rgba(255,255,255,0.06)] text-white",
  };

  return (
    <div className={`rounded-[20px] border px-4 py-3 ${classes[tone]}`}>
      <div className="text-[11px] uppercase tracking-[0.18em] opacity-75 md:text-xs">{label}</div>
      <div className="mt-2 text-3xl font-semibold md:text-4xl">{value}</div>
    </div>
  );
}
