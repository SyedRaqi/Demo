"use client";

import { useEffect, useState } from "react";
import { Check, Mail, Trash2 } from "lucide-react";

type Message = { id: string; name: string; email: string; phone: string; message: string; is_read: boolean; created_at: string };

export default function AdminMessagesPage() {
  const [records, setRecords] = useState<Message[]>([]); const [status, setStatus] = useState("");
  async function load() { const response = await fetch("/api/admin/messages"); if (response.ok) setRecords((await response.json()).data); else setStatus("Unable to load messages."); }
  useEffect(() => { fetch("/api/admin/messages").then(async (response) => { if (response.ok) setRecords((await response.json()).data); else setStatus("Unable to load messages."); }).catch(() => setStatus("Unable to load messages.")); }, []);
  async function markRead(record: Message) { await fetch("/api/admin/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record.id, is_read: !record.is_read }) }); await load(); }
  async function remove(id: string) { if (!window.confirm("Delete this message?")) return; await fetch("/api/admin/messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await load(); }
  return <main className="admin-page"><div className="admin-page-heading"><div><p className="section-kicker">INBOX / CONTACT</p><h1>Community messages</h1><p>Keep track of questions, suggestions and offers of support.</p></div><span className="admin-status"><span /> {records.filter((record) => !record.is_read).length} unread</span></div>{status && <p className="admin-message">{status}</p>}<div className="admin-table">{records.length === 0 ? <div className="admin-empty"><p className="section-kicker">INBOX IS CLEAR</p><h2>No messages yet.</h2><p>New contact form submissions will appear here.</p></div> : records.map((record) => <article className={`admin-row message-row ${record.is_read ? "read" : ""}`} key={record.id}><div><span className="publish-pill">{new Date(record.created_at).toLocaleDateString()}</span><h2>{record.name}</h2><p>{record.email}{record.phone ? ` · ${record.phone}` : ""}</p><div className="message-copy">{record.message}</div></div><div className="admin-row-actions"><button aria-label={record.is_read ? "Mark unread" : "Mark read"} onClick={() => void markRead(record)}><Check size={16} /></button><a className="message-mail" href={`mailto:${record.email}`} aria-label={`Email ${record.name}`}><Mail size={16} /></a><button aria-label={`Delete message from ${record.name}`} onClick={() => void remove(record.id)}><Trash2 size={16} /></button></div></article>)}</div></main>;
}
