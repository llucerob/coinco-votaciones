"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      setMessage("");

      if (password.length < 6) {
        setMessage("La contrasena debe tener al menos 6 caracteres.");
        return;
      }

      if (password !== confirmPassword) {
        setMessage("Las contrasenas no coinciden.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Contrasena actualizada correctamente.");
      setPassword("");
      setConfirmPassword("");
      router.refresh();
    });
  };

  return (
    <div className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <h2 className="text-3xl font-semibold text-white">Cambiar contrasena</h2>
      <p className="mt-3 max-w-xl text-white/70">
        Define una nueva contrasena para tu cuenta. El cambio se aplica de inmediato.
      </p>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm text-white/70">Nueva contrasena</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-white/70">Confirmar contrasena</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
        className="mt-6 rounded-2xl bg-[var(--color-accent)] px-5 py-3 font-semibold text-[#091117] transition hover:brightness-110 disabled:opacity-60"
      >
        {isPending ? "Actualizando..." : "Guardar contrasena"}
      </button>
    </div>
  );
}
