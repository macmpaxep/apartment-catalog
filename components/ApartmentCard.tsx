"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Maximize2, Layers, UtensilsCrossed, MapPin } from "lucide-react";
import type { Apartment } from "@/data/apartments";
import { getFavorites, toggleFavorite } from "@/lib/store";

const BADGE = {
  new:  { label: "Новое",      cls: "bg-emerald-50 text-emerald-700" },
  hot:  { label: "Топ",        cls: "bg-orange-50 text-orange-700" },
  sale: { label: "Акция",      cls: "bg-amber-50 text-amber-700" },
};

const COLORS: Record<number, { bg: string; wall: string }> = {
  1: { bg: "#EEF6EE", wall: "#B8D8B8" },
  2: { bg: "#EEF0F8", wall: "#B8C4D8" },
  3: { bg: "#F3EEF8", wall: "#C4B8D8" },
};

function FloorPlan({ rooms }: { rooms: number }) {
  const c = COLORS[rooms] ?? COLORS[1];
  return (
    <svg viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="8" y="6" width="164" height="108" rx="3" fill={c.bg} stroke={c.wall} strokeWidth="1.5"/>
      {rooms >= 2 && <line x1="94" y1="6" x2="94" y2="72" stroke={c.wall} strokeWidth="1.5"/>}
      {rooms >= 3 && <line x1="8" y1="68" x2="94" y2="68" stroke={c.wall} strokeWidth="1.5"/>}
      <line x1="94" y1="72" x2="172" y2="72" stroke={c.wall} strokeWidth="1.5"/>
      <rect x="13" y="11" width="26" height="16" rx="2" fill="white" fillOpacity="0.7"/>
      <rect x="100" y="78" width="28" height="17" rx="2" fill="white" fillOpacity="0.7"/>
      {rooms >= 2 && <rect x="100" y="11" width="26" height="16" rx="2" fill="white" fillOpacity="0.7"/>}
      {rooms >= 3 && <rect x="13" y="74" width="26" height="16" rx="2" fill="white" fillOpacity="0.7"/>}
    </svg>
  );
}

function fmt(price: number) {
  return price >= 1_000_000 ? (price / 1_000_000).toFixed(1).replace(".0","") + " млн ₸"
    : price.toLocaleString("ru") + " ₸";
}

export default function ApartmentCard({ apartment: a }: { apartment: Apartment }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => { setLiked(getFavorites().includes(a.id)); }, [a.id]);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = toggleFavorite(a.id);
    setLiked(next);
  };

  const badge = a.badge ? BADGE[a.badge] : null;

  return (
    <Link href={`/apartments/${a.id}`} className="group block bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-400 hover:shadow-sm transition-all">
      {/* Plan */}
      <div className="relative h-36 bg-neutral-50 flex items-center justify-center p-3">
        <FloorPlan rooms={a.rooms} />
        {badge && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        <button
          onClick={handleFav}
          aria-label="В избранное"
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full border flex items-center justify-center transition-colors
            ${liked ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white border-neutral-200 text-neutral-300 hover:border-neutral-400"}`}
        >
          <Heart size={12} fill={liked ? "currentColor" : "none"}/>
        </button>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <div className="flex items-baseline justify-between gap-1 mb-0.5">
          <span className="text-[15px] font-bold text-neutral-900">{fmt(a.price)}</span>
          <span className="text-[10px] text-neutral-400 whitespace-nowrap">{Math.round(a.price/a.area/1000)}K/м²</span>
        </div>
        <p className="text-[11px] text-neutral-500 mb-2 truncate">{a.title}</p>

        <div className="flex items-center gap-0.5 text-[10px] text-neutral-400 mb-3">
          <MapPin size={9}/>
          <span className="truncate">{a.city}, {a.district}</span>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1"><Maximize2 size={10}/>{a.area} м²</span>
          <span className="flex items-center gap-1"><UtensilsCrossed size={10}/>{a.kitchenArea} м²</span>
          <span className="flex items-center gap-1"><Layers size={10}/>{a.floor}/{a.totalFloors}</span>
          <span className="text-neutral-400">{a.year}</span>
        </div>
      </div>
    </Link>
  );
}
