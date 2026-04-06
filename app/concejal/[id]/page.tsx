/* eslint-disable @next/next/no-img-element */
import Header from "@/components/Header";
import VotePanel from "@/components/VotePanel";
import { requireCouncilAccess } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { loadVotingSnapshot } from "@/lib/voting/snapshot";
import { VotingStoreProvider } from "@/store/voting-store";

export default async function ConcejalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireCouncilAccess(id);

  const supabase = await createClient();
  const snapshot = await loadVotingSnapshot(supabase);

  if (!snapshot) {
    throw new Error("No fue posible cargar la votacion desde Supabase.");
  }

  const member = snapshot.members.find((item) => item.id === id);

  if (!member) {
    return (
      <>
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-4xl items-center justify-center px-6 py-10">
          <div className="rounded-[32px] border border-rose-400/30 bg-rose-500/10 p-8 text-center">
            <h1 className="text-3xl font-semibold text-white">Concejal no encontrado</h1>
            <p className="mt-3 text-white/70">Revisa la URL o la configuracion del padron.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-6">
          <section className="flex flex-col gap-5 rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:flex-row sm:items-center">
            <img
              src={member.image}
              alt={member.name}
              className="h-28 w-28 rounded-[24px] border border-white/15 object-cover"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                Acceso de integrante
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white">{member.name}</h1>
              <p className="mt-3 text-white/70">
                Emite o actualiza tu voto mientras la sesion se encuentre abierta.
              </p>
            </div>
          </section>

          <VotingStoreProvider initialSnapshot={snapshot}>
            <VotePanel memberId={member.id} />
          </VotingStoreProvider>
        </div>
      </main>
    </>
  );
}
