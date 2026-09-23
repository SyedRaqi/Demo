/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Photo = { id: string; image_url: string; title_en?: string; title_ur?: string; description_en?: string; description_ur?: string };

export function GalleryGrid({ photos, urdu = false }: { photos: Photo[]; urdu?: boolean }) {
  const [selected, setSelected] = useState<Photo | null>(null);
  return <><div className="gallery-grid">{photos.map((photo) => <button className="gallery-tile" key={photo.id} onClick={() => setSelected(photo)}><img src={photo.image_url} alt={String(urdu ? photo.title_ur || photo.title_en || "Community photo" : photo.title_en || "Community photo")} loading="lazy" /><span>{String(urdu ? photo.title_ur || photo.title_en || "" : photo.title_en || "")}</span></button>)}</div>{selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image" onClick={() => setSelected(null)}><button className="lightbox-close" aria-label="Close image" onClick={() => setSelected(null)}><X size={22} /></button><img src={selected.image_url} alt={String(urdu ? selected.title_ur || selected.title_en || "Community photo" : selected.title_en || "Community photo")} onClick={(event) => event.stopPropagation()} /></div>}</>;
}
