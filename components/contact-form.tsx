"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function ContactForm({ urdu = false }: { urdu?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      form.reset();
      setStatus("success");
      setMessage(urdu ? "آپ کا پیغام موصول ہو گیا ہے۔ شکریہ۔" : "Your message has been received. Thank you.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : (urdu ? "پیغام بھیجنے میں مسئلہ پیش آیا۔" : "Something went wrong. Please try again."));
    }
  }

  return <form className="contact-form" onSubmit={submit} dir={urdu ? "rtl" : "ltr"}>
    <div className="form-row"><label>{urdu ? "نام" : "Name"}<input name="name" required maxLength={100} /></label><label>{urdu ? "ای میل" : "Email"}<input name="email" type="email" required maxLength={180} /></label></div>
    <label>{urdu ? "فون" : "Phone"}<input name="phone" maxLength={30} /></label>
    <label>{urdu ? "پیغام" : "Message"}<textarea name="message" required maxLength={3000} rows={5} /></label>
    <input className="website-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {message && <p className={status === "error" ? "form-error" : "form-success"} role="status">{message}</p>}
    <button className="button button-primary" disabled={status === "loading"}>{status === "loading" ? (urdu ? "بھیجا جا رہا ہے..." : "Sending...") : (urdu ? "پیغام بھیجیں" : "Send message")} <ArrowUpRight size={17} /></button>
  </form>;
}
