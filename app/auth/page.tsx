import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import { getCurrentSession, resolveHomePath } from "@/lib/auth";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const session = await getCurrentSession();

  if (session?.user) {
    redirect(resolveHomePath(session.profile));
  }

  const params = await searchParams;
  const nextPath = params.next || "/admin";

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_460px]">
          <section className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(26,95,122,0.35),rgba(10,15,21,0.96)_58%)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.28)] md:p-12">
            <p className="text-sm uppercase tracking-[0.38em] text-[var(--color-muted)]">
              Acceso protegido
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-white md:text-7xl">
              Autenticacion con Supabase
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              El panel de administracion y los accesos de los 7 integrantes ahora validan sesion y
              rol. Los resultados publicos en OBS siguen disponibles sin login.
            </p>
          </section>

          <AuthForm nextPath={nextPath} initialError={params.error} />
        </div>
      </main>
    </>
  );
}
