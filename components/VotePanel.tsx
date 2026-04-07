"use client";

import Link from "next/link";
import { useTransition } from "react";
import { signOut } from "@/app/auth/actions";
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

export default function VotePanel({
  memberId,
  compact = false,
}: {
  memberId: string;
  compact?: boolean;
}) {
  const { currentVote, castVote, records, error, clearError } = useVotingStore();
  const [isPending, startTransition] = useTransition();
  const current = records.find((record) => record.memberId === memberId);
  const voteLocked = Boolean(current);

  const submitVote = (decision: VoteDecision) => {
    if (voteLocked) {
      return;
    }

    startTransition(async () => {
      clearError();
      await castVote(memberId, decision);
    });
  };

  return (
    <section
      className={`rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.06)] shadow-[0_28px_80px_rgba(0,0,0,0.24)] ${
        compact ? "p-8 md:p-10" : "p-6"
      }`}
    >
      {compact ? (
        <div className="mb-6 flex justify-end">
          <details className="group relative">
            <summary className="list-none rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white">
              Cuenta
            </summary>
            <div className="absolute right-0 z-20 mt-3 w-52 rounded-2xl border border-white/10 bg-[rgba(8,13,18,0.88)] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <Link
                href="/auth/change-password"
                className="block rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/8 hover:text-white"
              >
                Cambiar contrasena
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/8 hover:text-white"
                >
                  Salir
                </button>
              </form>
            </div>
          </details>
        </div>
      ) : null}

      <div>
        {!compact ? (
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Votacion actual
          </p>
        ) : null}
        <h2 className={`${compact ? "text-4xl md:text-5xl" : "mt-3 text-3xl"} font-semibold text-white`}>
          {currentVote.title}
        </h2>
      </div>

      {currentVote.description ? (
        <p className={`${compact ? "mt-5 text-xl leading-9" : "mt-3 text-base leading-7"} max-w-2xl text-white/70`}>
          {currentVote.description}
        </p>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {!currentVote.isOpen ? (
        <div className="mt-8 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-5 py-4 text-amber-100">
          No hay una votacion abierta.
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
                disabled={isPending || voteLocked}
                className={`rounded-[22px] border text-left transition disabled:opacity-60 ${
                  compact ? "px-6 py-6" : "px-5 py-4"
                } ${
                  selected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[#0a1117]"
                    : `border-white/10 bg-black/20 text-white ${option.tone}`
                }`}
              >
                <div className={`${compact ? "text-2xl" : "text-lg"} font-semibold`}>{option.label}</div>
                {!compact ? (
                  <div className="mt-1 text-sm opacity-80">
                    {selected
                      ? "Voto registrado"
                      : voteLocked
                        ? "Votacion cerrada para tu usuario"
                        : "Registrar este voto"}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {current && compact ? (
        <p className="mt-6 text-center text-base text-white/75">Tu voto ya fue registrado.</p>
      ) : null}

      {current && !compact ? (
        <p className="mt-6 text-sm text-white/70">
          Voto actual: <span className="font-semibold text-white">{current.decision}</span>
        </p>
      ) : !compact ? (
        <p className="mt-6 text-sm text-white/60">Aun no registras un voto.</p>
      ) : null}
    </section>
  );
}
