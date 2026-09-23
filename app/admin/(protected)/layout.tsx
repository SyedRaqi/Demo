import { redirect } from "next/navigation";
import Link from "next/link";
import { Image, LayoutDashboard, LogOut, MessagesSquare, Newspaper, Settings, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Brand } from "@/components/brand";

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata.role !== "admin") redirect("/admin/login");

  const links = [["Dashboard", "/admin/dashboard", LayoutDashboard], ["Updates", "/admin/updates", Newspaper], ["Events", "/admin/events", Newspaper], ["Programs", "/admin/programs", LayoutDashboard], ["Community stories", "/admin/community-stories", Newspaper], ["Photo stories", "/admin/photo-stories", Image], ["Gallery", "/admin/gallery", Image], ["Notices", "/admin/notices", Newspaper], ["Team", "/admin/team", Users], ["Messages", "/admin/messages", MessagesSquare], ["Settings", "/admin/settings", Settings]] as const;
  return <div className="admin-shell"><aside className="admin-sidebar"><Brand admin /><nav>{links.map(([label, href, Icon]) => <Link href={href} key={href}><Icon size={17} />{label}</Link>)}</nav><form action="/auth/signout" method="post"><button type="submit"><LogOut size={17} />Sign out</button></form></aside><div className="admin-main"><header className="admin-topbar"><span>Madeena Welfare Society</span><Link href="/" target="_blank">View website <LogOut size={14} /></Link></header>{children}</div></div>;
}
