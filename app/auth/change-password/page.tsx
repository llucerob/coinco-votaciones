import Link from "next/link";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import Header from "@/components/Header";
import { getCurrentSession, resolveHomePath } from "@/lib/auth";

export default async function ChangePasswordPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--color-muted)]">
            Cuenta
          </p>
          <h1 className="mt-3 text-5xl font-serif text-white">Seguridad de acceso</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">
            Actualiza tu contrasena y vuelve luego a tu panel de trabajo.
          </p>
        </div>

        <ChangePasswordForm />

        <Link
          href={resolveHomePath(session.profile)}
          className="mt-6 inline-block rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-[var(--color-accent)] hover:text-white"
        >
          Volver
        </Link>
      </main>
    </>
  );
}
