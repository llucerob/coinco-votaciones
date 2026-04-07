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
    <article className="rounded-[24px] border border-white/10 bg-[#0c141c] p-3 text-center shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
      <img
        src={member.image}
        alt={member.name}
        className="mx-auto mb-3 h-24 w-24 rounded-[20px] border border-white/15 object-cover"
      />
      <h3 className="flex min-h-12 items-center justify-center text-base font-semibold leading-tight text-white">
        {member.name}
      </h3>
      <div className={`mt-3 rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] ${classMap[decision]}`}>
        {labelMap[decision]}
      </div>
    </article>
  );
}
