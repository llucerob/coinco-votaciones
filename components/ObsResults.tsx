/* eslint-disable @next/next/no-img-element */
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
  const president = membersWithVotes.find((member) => member.id === "presidente");
  const councilMembers = membersWithVotes.filter((member) => member.id !== "presidente");

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-white/12 bg-[radial-gradient(circle_at_top,#163043_0%,rgba(10,16,22,0.92)_55%,rgba(6,10,15,0.97)_100%)] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.42)]">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-muted)]">
            Concejo Municipal de Coinco
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
            {currentVote.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">
            {currentVote.description}
          </p>
        </div>

        <div className="mt-4 text-right text-sm text-white/60">
          {syncing ? "Actualizando desde Supabase..." : "Sincronizacion en tiempo real activa"}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {councilMembers.map((member) => (
            <CouncilCard key={member.id} member={member} decision={member.decision} />
          ))}
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[320px_1fr]">
          {president ? <PresidentCard member={president} /> : <div />}
          <div className="rounded-[30px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 shadow-[0_22px_50px_rgba(0,0,0,0.22)]">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Resumen de la votacion
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Apruebo" value={summary.apruebo} tone="emerald" />
              <StatCard label="Rechazo" value={summary.rechazo} tone="rose" />
              <StatCard label="Abstencion" value={summary.abstencion} tone="amber" />
              <StatCard label="Ausente o Sin Voto" value={summary.sinVoto} tone="neutral" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function PresidentCard({
  member,
}: {
  member: {
    id: string;
    name: string;
    image: string;
    decision: VoteDecision;
  };
}) {
  const classMap = {
    APRUEBO: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
    RECHAZO: "border-rose-400/50 bg-rose-500/12 text-rose-100",
    ABSTENCION: "border-amber-300/50 bg-amber-400/12 text-amber-100",
    SIN_VOTO: "border-white/10 bg-[rgba(255,255,255,0.06)] text-white/75",
  } satisfies Record<VoteDecision, string>;

  const labelMap = {
    APRUEBO: "Apruebo",
    RECHAZO: "Rechazo",
    ABSTENCION: "Abstencion",
    SIN_VOTO: "Sin Voto",
  } satisfies Record<VoteDecision, string>;

  return (
    <article className="rounded-[30px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 text-center shadow-[0_22px_50px_rgba(0,0,0,0.22)]">
      <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Presidencia</p>
      <img
        src={member.image}
        alt={member.name}
        className="mx-auto mt-4 h-28 w-28 rounded-[22px] border border-white/15 object-cover"
      />
      <h3 className="mt-4 text-2xl font-semibold text-white">{member.name}</h3>
      <div className={`mt-4 rounded-2xl border px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] ${classMap[member.decision]}`}>
        {labelMap[member.decision]}
      </div>
    </article>
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
