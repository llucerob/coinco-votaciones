import Link from "next/link";
import { getCurrentSession, resolveHomePath } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/admin", label: "Administrador" },
  { href: "/obs", label: "OBS" },
];

export default async function Header() {
  const session = await getCurrentSession();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(10,15,21,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
            Concejo Municipal
          </p>
          <h1 className="font-serif text-xl font-semibold text-white">Coinco Votaciones</h1>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-[var(--color-accent)] hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          {session?.user ? (
            <>
              <Link
                href={resolveHomePath(session.profile)}
                className="rounded-full border border-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-accent-soft)]"
              >
                {session.profile?.display_name ?? session.user.email}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#091117]"
                >
                  Salir
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[#091117]"
            >
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}