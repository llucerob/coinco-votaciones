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
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
        <div className="rounded-[32px] border border-rose-400/30 bg-rose-500/10 p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Acceso no disponible</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10">
      <div className="w-full">
        <VotingStoreProvider initialSnapshot={snapshot}>
          <VotePanel memberId={member.id} compact />
        </VotingStoreProvider>
      </div>
    </main>
  );
}
