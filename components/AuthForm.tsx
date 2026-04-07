"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({
  nextPath,
  initialError,
}: {
  nextPath: string;
  initialError?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(initialError ?? "");

  const submit = () => {
    startTransition(async () => {
      setMessage("");

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          setMessage(error.message);
          return;
        }

        router.push(nextPath);
        router.refresh();
        return;
      }

      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl,
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.session) {
        setMessage("Cuenta creada. Revisa tu correo para confirmar el acceso.");
        return;
      }

      setMessage("Cuenta creada. Si tu perfil ya existe en Supabase, puedes continuar.");
      router.push(nextPath);
      router.refresh();
    });
  };

  return (
    <div className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex gap-2 rounded-full border border-white/10 bg-black/20 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "login" ? "bg-[var(--color-accent)] text-[#091117]" : "text-white/70"
          }`}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "register" ? "bg-[var(--color-accent)] text-[#091117]" : "text-white/70"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm text-white/70">Correo</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="nombre@coinco.cl"
            className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-white/70">Contrasena</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="********"
            className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-[var(--color-accent)]"
          />
        </label>
      </div>

      {message ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
          {message}
        </div>
      ) : null}

      <button
        type="button"
        onClick={submit}
        disabled={isPending}
        className="mt-6 w-full rounded-2xl bg-[var(--color-accent)] px-5 py-3 font-semibold text-[#091117] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
      </button>

      <p className="mt-5 text-sm leading-6 text-white/60">
        Luego de crear la cuenta, debe esperar a que el administrador asocie su cuenta al sistema.
      </p>

      <Link href="/" className="mt-4 inline-block text-sm text-[var(--color-accent-soft)]">
        Volver al inicio
      </Link>
    </div>
  );
}
