import ObsResults from "@/components/ObsResults";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { loadVotingSnapshot } from "@/lib/voting/snapshot";
import { VotingStoreProvider } from "@/store/voting-store";

export default async function ObsPage() {
  const supabase = await createClient();
  const snapshot = await loadVotingSnapshot(supabase);

  if (!snapshot) {
    throw new Error("No fue posible cargar los resultados desde Supabase.");
  }

  return (
    <>
      <Header />
      <VotingStoreProvider initialSnapshot={snapshot}>
        <ObsResults />
      </VotingStoreProvider>
    </>
  );
}