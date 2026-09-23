import Image from "next/image";
import Link from "next/link";

export function Brand({ href = "/", urdu = false, admin = false }: { href?: string; urdu?: boolean; admin?: boolean }) {
  return <Link className={`brand ${admin ? "brand-admin" : ""}`} href={href} aria-label="Madeena Welfare Society home"><span className="brand-logo"><Image src="/madeena-logo.png" alt="Madeena Welfare Society logo" width={54} height={54} priority /></span><span><strong>{urdu ? "مدینہ" : "Madeena"}</strong><small>{admin ? "Admin workspace" : urdu ? "ویلفیئر سوسائٹی · بھٹکل" : "Welfare Society · Bhatkal"}</small></span></Link>;
}
