/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useTransition } from "react";
import { useVotingStore } from "@/store/voting-store";

interface MemberDraft {
  name: string;
  image: string;
}

export default function AdminPanel() {
  const {
    members,
    openVote,
    closeVote,
    resetVotes,
    updateMember,
    uploadMemberImage,
    currentVote,
    records,
    error,
    clearError,
    syncing,
  } = useVotingStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memberDrafts, setMemberDrafts] = useState<Record<string, MemberDraft>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [isPending, startTransition] = useTransition();

  const run = (callback: () => Promise<void>) => {
    startTransition(async () => {
      clearError();
      await callback();
    });
  };

  const updateDraft = (memberId: string, field: keyof MemberDraft, value: string) => {
    setMemberDrafts((current) => ({
      ...current,
      [memberId]: {
        name: current[memberId]?.name ?? "",
        image: current[memberId]?.image ?? "",
        [field]: value,
      },
    }));
  };

  const saveMember = (memberId: string) => {
    const member = members.find((item) => item.id === memberId);
    const draft = memberDrafts[memberId];
    const file = selectedFiles[memberId];

    if (!member) {
      return;
    }

    run(async () => {
      await updateMember(memberId, {
        name: (draft?.name ?? member.name).trim(),
      });

      if (file) {
        await uploadMemberImage(memberId, file);
      }
    });

    setMemberDrafts((current) => {
      const next = { ...current };
      delete next[memberId];
      return next;
    });

    setSelectedFiles((current) => {
      const next = { ...current };
      delete next[memberId];
      return next;
    });
  };

  return (
    <div className="grid gap-8">
      <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
              Control de sesion
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Configurar votacion</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
            Estado: <span className="font-semibold text-white">{currentVote.isOpen ? "Abierta" : "Cerrada"}</span>
            <span className="mx-2 text-white/20">|</span>
            Votos emitidos: <span className="font-semibold text-white">{records.length}</span>
            <span className="mx-2 text-white/20">|</span>
            Sync: <span className="font-semibold text-white">{syncing ? "Sincronizando" : "Activa"}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-white/70">Titulo</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ej. Votacion presupuesto municipal"
              className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-[var(--color-accent)]"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/70">Descripcion</span>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Tema o resumen de la sesion"
              className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-[var(--color-accent)]"
            />
          </label>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => run(() => openVote(title || "Nueva votacion", description))}
            disabled={isPending}
            className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 font-semibold text-[#0a1117] transition hover:brightness-110 disabled:opacity-60"
          >
            Abrir votacion
          </button>
          <button
            type="button"
            onClick={() => run(closeVote)}
            disabled={isPending}
            className="rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-[#1f1600] transition hover:brightness-110 disabled:opacity-60"
          >
            Cerrar votacion
          </button>
          <button
            type="button"
            onClick={() => run(resetVotes)}
            disabled={isPending}
            className="rounded-2xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            Reiniciar votos
          </button>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Padron visual</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Editar integrantes</h2>
        </div>

        <div className="mt-6 grid gap-4">
          {members.map((member) => (
            <article
              key={member.id}
              className="grid gap-4 rounded-[26px] border border-white/10 bg-black/20 p-4 md:grid-cols-[120px_1fr_1fr_auto]"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-24 w-24 rounded-2xl border border-white/10 object-cover"
              />
              <label className="grid gap-2">
                <span className="text-sm text-white/65">Nombre</span>
                <input
                  value={memberDrafts[member.id]?.name ?? member.name}
                  onChange={(event) => updateDraft(member.id, "name", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-[var(--color-accent)]"
                />
              </label>
              <div className="grid gap-2">
                <span className="text-sm text-white/65">Imagen</span>
                <label className="rounded-2xl border border-dashed border-white/15 bg-black/25 px-4 py-3 text-sm text-white/75 transition hover:border-[var(--color-accent)]">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setSelectedFiles((current) => ({
                        ...current,
                        [member.id]: file,
                      }));
                    }}
                  />
                  {selectedFiles[member.id]?.name ?? "Seleccionar imagen"}
                </label>
                <p className="text-xs text-white/50">La imagen se almacena en Supabase Storage.</p>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => saveMember(member.id)}
                  disabled={isPending}
                  className="w-full rounded-2xl border border-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-soft)] transition hover:bg-[rgba(143,214,194,0.12)] disabled:opacity-60 md:w-auto"
                >
                  Guardar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
