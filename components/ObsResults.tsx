/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import CouncilCard from "@/components/CouncilCard";
import { useVotingStore } from "@/store/voting-store";
import type { VoteDecision } from "@/types";

export default function ObsResults() {
  const { members, records, currentVote, syncing } = useVotingStore();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlBackground = html.style.background;
    const previousBodyBackground = body.style.background;

    html.style.background = "transparent";
    body.style.background = "transparent";

    return () => {
      html.style.background = previousHtmlBackground;
      body.style.background = previousBodyBackground;
    };
  }, []);

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
    <main className="min-h-screen bg-transparent px-4 py-4 md:px-6">
      <div className="mx-auto flex min-h-[650px] w-full max-w-[1180px] flex-col justify-between">
        <div className="max-w-4xl rounded-[26px] border border-white/12 bg-[#0c141c] px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
          <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-muted)]">
            Concejo Municipal de Coinco
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
            {currentVote.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
            {currentVote.description}
          </p>
        </div>

        <div className="mt-3 text-right text-xs uppercase tracking-[0.22em] text-white/55">
          {syncing ? "Actualizando desde Supabase..." : "Sincronizacion en tiempo real activa"}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {councilMembers.map((member) => (
            <CouncilCard key={member.id} member={member} decision={member.decision} />
          ))}
        </div>

        {president ? (
          <div className="mt-4 grid gap-4 xl:grid-cols-[240px_1fr]">
            <PresidentCard member={president} />
            <div className="rounded-[24px] border border-white/15 bg-[#16222c] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
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
          </div>
        ) : null}
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
  return (
    <div className="rounded-[24px] border border-white/10 bg-[rgba(7,12,18,0.56)] p-3 text-center shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-md">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Presidencia</p>
      <img
        src={member.image}
        alt={member.name}
        className="mx-auto mt-3 h-24 w-24 rounded-[20px] border border-white/15 object-cover"
      />
      <h3 className="mt-3 text-base font-semibold leading-tight text-white">{member.name}</h3>
      <div className="mt-3">
        <StatBadge decision={member.decision} />
      </div>
    </div>
  );
}

function StatBadge({ decision }: { decision: VoteDecision }) {
  const labelMap = {
    APRUEBO: "Apruebo",
    RECHAZO: "Rechazo",
    ABSTENCION: "Abstencion",
    SIN_VOTO: "Sin voto",
  } satisfies Record<VoteDecision, string>;

  const classMap = {
    APRUEBO: "border-emerald-400/50 bg-emerald-500/12 text-emerald-200",
    RECHAZO: "border-rose-400/50 bg-rose-500/12 text-rose-200",
    ABSTENCION: "border-amber-300/50 bg-amber-400/12 text-amber-100",
    SIN_VOTO: "border-white/10 bg-white/5 text-white/70",
  } satisfies Record<VoteDecision, string>;

  return (
    <div className={`rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] ${classMap[decision]}`}>
      {labelMap[decision]}
    </div>
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
