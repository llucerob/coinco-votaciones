import AdminPanel from "@/components/AdminPanel";
import Header from "@/components/Header";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { loadVotingSnapshot } from "@/lib/voting/snapshot";
import { VotingStoreProvider } from "@/store/voting-store";

export default async function AdminPage() {
  await requireAdmin();

  const supabase = await createClient();
  const snapshot = await loadVotingSnapshot(supabase);

  if (!snapshot) {
    throw new Error("No fue posible cargar la configuracion desde Supabase.");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--color-muted)]">
            Panel de control
          </p>
          <h1 className="mt-3 text-5xl font-serif text-white">Administrador de votaciones</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">
            Configura la sesion, actualiza el padron visual y controla la apertura o cierre de la
            votacion activa.
          </p>
        </div>
        <VotingStoreProvider initialSnapshot={snapshot}>
          <AdminPanel />
        </VotingStoreProvider>
      </main>
    </>
  );
}