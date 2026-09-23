"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Public page error", error); }, [error]);
  return <main className="status-page"><p className="section-kicker">SOMETHING WENT WRONG</p><h1>We could not load that page.</h1><p>Please try again.</p><button className="button button-primary" onClick={() => reset()}>Try again</button></main>;
}
