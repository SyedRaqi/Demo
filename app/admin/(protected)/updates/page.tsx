"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Edit3, Plus, Trash2, X } from "lucide-react";

type UpdateRecord = { id: string; slug: string; title_en: string; title_ur: string; summary_en: string; summary_ur: string; content_en: string; content_ur: string; category: string; location_en: string; location_ur: string; published_at: string | null; is_published: boolean };
type FormState = Omit<UpdateRecord, "id">;
const emptyForm: FormState = { slug: "", title_en: "", title_ur: "", summary_en: "", summary_ur: "", content_en: "", content_ur: "", category: "announcement", location_en: "", location_ur: "", published_at: new Date().toISOString(), is_published: false };

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
  useEffect(() => {
    fetch("/api/admin/updates").then(async (response) => {
      if (response.ok) setRecords((await response.json()).data);
      else setStatus("Unable to load updates.");
    }).catch(() => setStatus("Unable to load updates."));
  }, []);
  function updateField(field: keyof FormState, value: string | boolean) { setForm((current) => ({ ...current, [field]: value })); }
  function startNew() { setEditing(null); setForm(emptyForm); setOpen(true); setStatus(""); }
  function startEdit(record: UpdateRecord) { setEditing(record.id); setForm({ ...record }); setOpen(true); setStatus(""); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Saving...");
    const response = await fetch("/api/admin/updates", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { ...form, id: editing } : form) });
    const result = await response.json();
    if (!response.ok) { setStatus(result.error ?? "Unable to save."); return; }
    setOpen(false); setStatus(""); await load();
  }
  async function remove(id: string) { if (!window.confirm("Delete this update?")) return; const response = await fetch("/api/admin/updates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (!response.ok) setStatus("Unable to delete."); else await load(); }

  return <main className="admin-page"><div className="admin-page-heading"><div><p className="section-kicker">CONTENT / UPDATES</p><h1>Latest updates</h1><p>Write, translate and publish community news.</p></div><button className="button button-primary admin-action" onClick={startNew}><Plus size={17} /> New update</button></div>{status && <p className="admin-message">{status}</p>}<div className="admin-table">{records.length === 0 ? <div className="admin-empty"><p className="section-kicker">NO UPDATES YET</p><h2>Start with a story from the community.</h2><p>Drafts stay private until you publish them.</p></div> : records.map((record) => <article className="admin-row" key={record.id}><div><span className={`publish-pill ${record.is_published ? "is-live" : ""}`}>{record.is_published ? "Published" : "Draft"}</span><h2>{record.title_en}</h2><p>{record.category} · {record.slug}</p></div><div className="admin-row-actions"><button aria-label={`Edit ${record.title_en}`} onClick={() => startEdit(record)}><Edit3 size={16} /></button><button aria-label={`Delete ${record.title_en}`} onClick={() => void remove(record.id)}><Trash2 size={16} /></button></div></article>)}</div>{open && <div className="admin-modal-backdrop"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="update-form-title"><div className="modal-heading"><div><p className="section-kicker">{editing ? "EDIT UPDATE" : "NEW UPDATE"}</p><h2 id="update-form-title">{editing ? "Refine the story." : "Add an update."}</h2></div><button aria-label="Close form" onClick={() => setOpen(false)}><X size={19} /></button></div><form className="admin-form" onSubmit={submit}><div className="form-row"><label>Title EN<input value={form.title_en} onChange={(event) => updateField("title_en", event.target.value)} required /></label><label>Title UR<input dir="rtl" value={form.title_ur} onChange={(event) => updateField("title_ur", event.target.value)} /></label></div><div className="form-row"><label>Slug<input value={form.slug} onChange={(event) => updateField("slug", event.target.value.toLowerCase().replace(/\s+/g, "-"))} required /></label><label>Category<select value={form.category} onChange={(event) => updateField("category", event.target.value)}><option value="announcement">Announcement</option><option value="community">Community</option><option value="education">Education</option><option value="healthcare">Healthcare</option><option value="relief">Relief</option><option value="event">Event</option></select></label></div><div className="form-row"><label>Summary EN<textarea rows={3} value={form.summary_en} onChange={(event) => updateField("summary_en", event.target.value)} /></label><label>Summary UR<textarea dir="rtl" rows={3} value={form.summary_ur} onChange={(event) => updateField("summary_ur", event.target.value)} /></label></div><div className="form-row"><label>Content EN<textarea rows={6} value={form.content_en} onChange={(event) => updateField("content_en", event.target.value)} /></label><label>Content UR<textarea dir="rtl" rows={6} value={form.content_ur} onChange={(event) => updateField("content_ur", event.target.value)} /></label></div><label className="checkbox-line"><input type="checkbox" checked={form.is_published} onChange={(event) => updateField("is_published", event.target.checked)} /><span><Check size={15} /> Publish this update</span></label><button className="button button-primary" type="submit">Save update</button></form></section></div>}</main>;
}
