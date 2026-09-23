"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit3, Plus, Trash2, X } from "lucide-react";

type UpdateRecord = {
  id: string; slug: string; title_en: string; title_ur: string;
  subtitle_en: string; subtitle_ur: string; summary_en: string; summary_ur: string;
  content_en: string; content_ur: string; cover_image_url: string | null;
  category: string; location_en: string; location_ur: string; author: string;
  published_at: string | null; is_published: boolean; featured: boolean; breaking: boolean; pinned: boolean;
};
type FormState = Omit<UpdateRecord, "id">;
const emptyForm: FormState = {
  slug: "", title_en: "", title_ur: "", subtitle_en: "", subtitle_ur: "", summary_en: "", summary_ur: "",
  content_en: "", content_ur: "", cover_image_url: "", category: "community", location_en: "Bhatkal", location_ur: "بھٹکل", author: "",
  published_at: new Date().toISOString(), is_published: false, featured: false, breaking: false, pinned: false,
};

export default function AdminUpdatesPage() {
  const [records, setRecords] = useState<UpdateRecord[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  async function load() {
    const response = await fetch("/api/admin/updates");
    if (response.ok) setRecords((await response.json()).data);
    else setStatus("Unable to load updates.");
  }
  useEffect(() => { fetch("/api/admin/updates").then(async (response) => { if (response.ok) setRecords((await response.json()).data); else setStatus("Unable to load updates."); }).catch(() => setStatus("Unable to load updates.")); }, []);
  function setField<K extends keyof FormState>(field: K, value: FormState[K]) { setForm((current) => ({ ...current, [field]: value })); }
  function startNew() { setEditing(null); setForm({ ...emptyForm }); setOpen(true); setStatus(""); }
  function startEdit(record: UpdateRecord) { setEditing(record.id); setForm({ ...emptyForm, ...record }); setOpen(true); setStatus(""); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Saving...");
    const response = await fetch("/api/admin/updates", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { ...form, id: editing } : form) });
    const result = await response.json();
    if (!response.ok) { setStatus(result.error ?? "Unable to save."); return; }
    setOpen(false); setStatus(""); await load();
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this update?")) return;
    const response = await fetch("/api/admin/updates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!response.ok) setStatus("Unable to delete."); else await load();
  }

  return (
    <main className="admin-page">
      <div className="admin-page-heading"><div><p className="section-kicker">CONTENT / UPDATES</p><h1>Latest updates</h1><p>Write, translate and publish community news.</p></div><button className="button button-primary admin-action" onClick={startNew}><Plus size={17} /> New update</button></div>
      {status && <p className="admin-message">{status}</p>}
      <div className="admin-table">
        {records.length === 0 ? <div className="admin-empty"><p className="section-kicker">NO UPDATES YET</p><h2>Start with a story from the community.</h2><p>Drafts stay private until you publish them.</p></div> : records.map((record) => <article className="admin-row" key={record.id}><div><div className="admin-pills"><span className={`publish-pill ${record.is_published ? "is-live" : ""}`}>{record.is_published ? "Published" : "Draft"}</span>{record.featured && <span className="publish-pill is-live">Featured</span>}{record.breaking && <span className="publish-pill">Breaking</span>}{record.pinned && <span className="publish-pill">Pinned</span>}</div><h2>{record.title_en}</h2><p>{record.category} · {record.slug}</p></div><div className="admin-row-actions"><button aria-label={`Edit ${record.title_en}`} onClick={() => startEdit(record)}><Edit3 size={16} /></button><button aria-label={`Delete ${record.title_en}`} onClick={() => void remove(record.id)}><Trash2 size={16} /></button></div></article>)}
      </div>
      {open && <div className="admin-modal-backdrop"><section className="admin-modal" role="dialog" aria-modal="true"><div className="modal-heading"><div><p className="section-kicker">{editing ? "EDIT UPDATE" : "NEW UPDATE"}</p><h2>{editing ? "Refine the story." : "Add an update."}</h2></div><button aria-label="Close form" onClick={() => setOpen(false)}><X size={19} /></button></div><form className="admin-form" onSubmit={submit}>
+        <div className="form-row"><label>Title EN<input value={form.title_en} onChange={(event) => setField("title_en", event.target.value)} required /></label><label>Title UR<input dir="rtl" value={form.title_ur} onChange={(event) => setField("title_ur", event.target.value)} /></label></div>
+        <div className="form-row"><label>Subtitle EN<input value={form.subtitle_en} onChange={(event) => setField("subtitle_en", event.target.value)} /></label><label>Subtitle UR<input dir="rtl" value={form.subtitle_ur} onChange={(event) => setField("subtitle_ur", event.target.value)} /></label></div>
+        <div className="form-row"><label>Summary EN<textarea rows={3} value={form.summary_en} onChange={(event) => setField("summary_en", event.target.value)} /></label><label>Summary UR<textarea dir="rtl" rows={3} value={form.summary_ur} onChange={(event) => setField("summary_ur", event.target.value)} /></label></div>
+        <div className="form-row"><label>Article EN<textarea rows={7} value={form.content_en} onChange={(event) => setField("content_en", event.target.value)} /></label><label>Article UR<textarea dir="rtl" rows={7} value={form.content_ur} onChange={(event) => setField("content_ur", event.target.value)} /></label></div>
+        <div className="form-row"><label>Slug<input value={form.slug} onChange={(event) => setField("slug", event.target.value)} required /></label><label>Category<select value={form.category} onChange={(event) => setField("category", event.target.value)}><option value="community">Community</option><option value="education">Education</option><option value="healthcare">Healthcare</option><option value="welfare">Welfare</option><option value="sports">Sports</option><option value="announcement">Announcement</option><option value="relief">Relief</option></select></label></div>
+        <div className="form-row"><label>Location EN<input value={form.location_en} onChange={(event) => setField("location_en", event.target.value)} /></label><label>Location UR<input dir="rtl" value={form.location_ur} onChange={(event) => setField("location_ur", event.target.value)} /></label></div>
+        <div className="form-row"><label>Author<input value={form.author} onChange={(event) => setField("author", event.target.value)} /></label><label>Cover image URL<input type="url" value={form.cover_image_url ?? ""} onChange={(event) => setField("cover_image_url", event.target.value)} /></label></div>
        <label>Publish date<input type="datetime-local" value={form.published_at ? new Date(form.published_at).toISOString().slice(0, 16) : ""} onChange={(event) => setField("published_at", event.target.value ? new Date(event.target.value).toISOString() : null)} /></label>
        <div className="editorial-flags"><label><input type="checkbox" checked={form.is_published} onChange={(event) => setField("is_published", event.target.checked)} /> Published</label><label><input type="checkbox" checked={form.featured} onChange={(event) => setField("featured", event.target.checked)} /> Featured story</label><label><input type="checkbox" checked={form.breaking} onChange={(event) => setField("breaking", event.target.checked)} /> Breaking ticker</label><label><input type="checkbox" checked={form.pinned} onChange={(event) => setField("pinned", event.target.checked)} /> Pin notice</label></div>
        <button className="button button-primary admin-action" type="submit">{editing ? "Save update" : "Publish update"}</button>
      </form></section></div>}
    </main>
  );
}
