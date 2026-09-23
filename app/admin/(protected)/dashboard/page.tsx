import { CalendarDays, Images, Mail, Newspaper, Sparkles, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const stats = [["Published updates", "updates", Newspaper], ["Events", "events", CalendarDays], ["Active programs", "programs", Sparkles], ["Gallery photos", "gallery", Images], ["Unread messages", "contact_messages", Mail], ["Team members", "team_members", Users]] as const;

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();
  const counts = await Promise.all(stats.map(async ([, table]) => {
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    return count ?? 0;
  }));

  return <main className="admin-page"><div className="admin-page-heading"><div><p className="section-kicker">OVERVIEW</p><h1>Good morning.</h1><p>Keep the community website current and useful.</p></div><span className="admin-status"><span /> Connected to Supabase</span></div><div className="admin-stats">{stats.map(([label, , Icon], index) => <article key={label}><span className="admin-stat-icon"><Icon size={18} /></span><p>{label}</p><strong>{counts[index]}</strong></article>)}</div><section className="admin-empty"><div><p className="section-kicker">CONTENT WORKSPACE</p><h2>Your next update can start here.</h2><p>Use the navigation to add official updates, programs, events, gallery images and notices. Public pages only show content that is published or active.</p></div></section></main>;
}
