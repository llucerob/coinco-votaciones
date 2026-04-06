import Link from "next/link";
import Header from "@/components/Header";

const entries = [
  {
    href: "/admin",
    title: "Administrador",
    description: "Edita integrantes, abre o cierra votaciones y reinicia resultados.",
  },
  {
    href: "/obs",
    title: "Pantalla OBS",
    description: "Overlay limpio para mostrar resultados en vivo durante la sesion.",
  },
  {
    href: "/auth",
    title: "Autenticacion",
    description: "Ingreso y registro conectados a Supabase para administradores e integrantes.",
  },
];

export default async function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-12">
        <div className="grid w-full gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(26,95,122,0.35),rgba(10,15,21,0.96)_58%)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.28)] md:p-12">
            <p className="text-sm uppercase tracking-[0.38em] text-[var(--color-muted)]">
              Sistema conectado a Supabase
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-white md:text-7xl">
              Votaciones del Concejo Municipal de Coinco
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              La aplicacion ahora contempla autenticacion, persistencia de datos y sincronizacion en
              tiempo real entre dispositivos usando Supabase para 7 integrantes: 6 concejales y
              el presidente.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {entries.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 font-semibold text-[#091117] transition hover:brightness-110"
                >
                  {entry.title}
                </Link>
              ))}
            </div>
          </section>

          <section className="grid gap-4">
            {entries.map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:bg-[rgba(255,255,255,0.1)]"
              >
                <h2 className="text-2xl font-semibold text-white">{entry.title}</h2>
                <p className="mt-3 text-base leading-7 text-white/70">{entry.description}</p>
              </Link>
            ))}

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">
                Acceso individual
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Rutas individuales</h2>
              <p className="mt-3 text-white/70">
                Cada integrante entra a su ruta y el sistema valida que su perfil de Supabase
                coincida.
              </p>
              <code className="mt-4 block rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--color-accent-soft)]">
                /concejal/concejal-1
              </code>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
