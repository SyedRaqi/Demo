"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Brand } from "@/components/brand";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      router.push("/admin/dashboard");
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Unable to sign in.");
      setLoading(false);
    }
  }

  return <main className="admin-auth"><div className="admin-auth-art"><div><Brand /><h1>Good work<br /><em>grows</em> together.</h1><p>Madeena Welfare Society · Bhatkal</p></div></div><section className="admin-auth-form"><Link className="back-link" href="/"><ArrowLeft size={15} /> Back to website</Link><div className="auth-heading"><span className="auth-icon"><LockKeyhole size={20} /></span><p className="section-kicker">ADMINISTRATION</p><h2>Welcome back.</h2><p>Sign in to manage the society website.</p></div><form onSubmit={handleSubmit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}<ArrowUpRight size={17} /></button></form></section></main>;
}
