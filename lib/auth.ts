import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";

export async function getCurrentSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, member_id, display_name")
    .eq("id", user.id)
    .maybeSingle<UserProfile>();

  return {
    user,
    profile: profile ?? null,
  };
}

export function resolveHomePath(profile: UserProfile | null) {
  if (profile?.role === "admin") {
    return "/admin";
  }

  if (profile?.role === "council" && profile.member_id) {
    return `/concejal/${profile.member_id}`;
  }

  return "/";
}

export async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/auth?next=/admin");
  }

  if (session.profile?.role !== "admin") {
    redirect(resolveHomePath(session.profile));
  }

  return session;
}

export async function requireCouncilAccess(memberId: string) {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect(`/auth?next=/concejal/${memberId}`);
  }

  if (session.profile?.role === "admin") {
    return session;
  }

  if (session.profile?.role === "council" && session.profile.member_id === memberId) {
    return session;
  }

  redirect(resolveHomePath(session.profile));
}