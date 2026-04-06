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

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-white/12 bg-[radial-gradient(circle_at_top,#163043_0%,rgba(10,16,22,0.92)_55%,rgba(6,10,15,0.97)_100%)] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.42)]">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-muted)]">
              Concejo Municipal de Coinco
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
              {currentVote.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
              {currentVote.description}
            </p>
          </div>

          <div className="grid min-w-full gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:grid-cols-4">
            <StatCard label="Apruebo" value={summary.apruebo} tone="emerald" />
            <StatCard label="Rechazo" value={summary.rechazo} tone="rose" />
            <StatCard label="Abstencion" value={summary.abstencion} tone="amber" />
            <StatCard label="Sin voto" value={summary.sinVoto} tone="neutral" />
          </div>
        </div>

        <div className="mt-4 text-right text-sm text-white/60">
          {syncing ? "Actualizando desde Supabase..." : "Sincronizacion en tiempo real activa"}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {membersWithVotes.map((member) => (
            <CouncilCard key={member.id} member={member} decision={member.decision} />
          ))}
        </div>
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
    <div className={`rounded-[24px] border px-4 py-4 ${classes[tone]}`}>
      <div className="text-sm uppercase tracking-[0.22em] opacity-75">{label}</div>
      <div className="mt-3 text-4xl font-semibold">{value}</div>
    </div>
  );
}