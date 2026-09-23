import Link from "next/link";

export default function NotFound() {
  return <main className="status-page"><p className="section-kicker">404 / NOT FOUND</p><h1>This page is not here yet.</h1><p>Try returning to the Madeena Welfare Society homepage.</p><Link className="button button-primary" href="/">Back home</Link></main>;
}
