/* eslint-disable @next/next/no-img-element */

import type { CouncilMember, VoteDecision } from "@/types";

const labelMap: Record<VoteDecision, string> = {
  APRUEBO: "Apruebo",
  RECHAZO: "Rechazo",
  ABSTENCION: "Abstencion",
  SIN_VOTO: "Sin voto",
};

const classMap: Record<VoteDecision, string> = {
  APRUEBO: "border-emerald-400/50 bg-emerald-500/12 text-emerald-200",
  RECHAZO: "border-rose-400/50 bg-rose-500/12 text-rose-200",
  ABSTENCION: "border-amber-300/50 bg-amber-400/12 text-amber-100",
  SIN_VOTO: "border-white/10 bg-white/5 text-white/70",
};

export default function CouncilCard({
  member,
  decision,
}: {
  member: CouncilMember;
  decision: VoteDecision;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-4 text-center shadow-[0_22px_50px_rgba(0,0,0,0.22)]">
      <img
        src={member.image}
        alt={member.name}
        className="mx-auto mb-4 h-28 w-28 rounded-[22px] border border-white/15 object-cover"
      />
      <h3 className="flex min-h-14 items-center justify-center text-lg font-semibold text-white">
        {member.name}
      </h3>
      <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] ${classMap[decision]}`}>
        {labelMap[decision]}
      </div>
    </article>
  );
}
