"use client";

import { useEffect } from "react";
import { X, MapPin, Layers, Maximize2, CalendarDays, CheckCircle2 } from "lucide-react";
import type { Apartment } from "@/data/apartments";

const ROOM_COLORS: Record<number, string> = {
  1: "#E8F4E8",
  2: "#E8EEF8",
  3: "#F3EEF8",
};

function formatPrice(price: number): string {
  if (price >= 1_000_000) return (price / 1_000_000).toFixed(1).replace(".0", "") + " млн ₸";
  return price.toLocaleString("ru") + " ₸";
}

function FloorPlanLarge({ rooms, color }: { rooms: number; color: string }) {
  return (
    <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-52">
      <rect x="20" y="15" width="220" height="150" rx="4" fill={color} stroke="#d4d4d4" strokeWidth="1.5" />
      {rooms >= 2 && <line x1="130" y1="15" x2="130" y2="110" stroke="#d4d4d4" strokeWidth="1.5" />}
      {rooms >= 3 && <line x1="20" y1="108" x2="130" y2="108" stroke="#d4d4d4" strokeWidth="1.5" />}
      <line x1="130" y1="110" x2="240" y2="110" stroke="#d4d4d4" strokeWidth="1.5" />
      <rect x="26" y="22" width="32" height="20" rx="3" fill="white" fillOpacity="0.65" />
      <rect x="140" y="116" width="36" height="22" rx="3" fill="white" fillOpacity="0.65" />
      {rooms >= 2 && <rect x="140" y="22" width="32" height="20" rx="3" fill="white" fillOpacity="0.65" />}
      {rooms >= 3 && <rect x="26" y="116" width="32" height="20" rx="3" fill="white" fillOpacity="0.65" />}
      <text x="130" y="76" fontSize="13" fill="#999" textAnchor="middle" fontFamily="Inter, sans-serif">
        {rooms}-комн · {`${rooms === 1 ? 38 : rooms === 2 ? 65 : 100}`} м²
      </text>
    </svg>
  );
}

type Props = {
  apartment: Apartment | null;
  onClose: () => void;
};

export default function ApartmentModal({ apartment, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (apartment) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [apartment]);

  if (!apartment) return null;

  const color = ROOM_COLORS[apartment.rooms] ?? "#F0F0F0";
  const pricePerM2 = Math.round(apartment.price / apartment.area).toLocaleString("ru");

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{apartment.title}</h2>
            <p className="text-sm text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin size={12} />
              {apartment.address}, {apartment.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-400 ml-4 flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Floor plan */}
        <div className="mx-6 rounded-2xl overflow-hidden bg-stone-50 flex items-center justify-center p-4 h-44">
          <FloorPlanLarge rooms={apartment.rooms} color={color} />
        </div>

        {/* Stats */}
        <div className="px-6 py-4 grid grid-cols-4 gap-3">
          {[
            { icon: <Maximize2 size={14} />, label: "Площадь", value: `${apartment.area} м²` },
            { icon: <Layers size={14} />, label: "Этаж", value: `${apartment.floor}/${apartment.totalFloors}` },
            { icon: <CalendarDays size={14} />, label: "Год", value: `${apartment.year}` },
            { icon: null, label: "За м²", value: `${Math.round(apartment.price / apartment.area / 1000)}K ₸` },
          ].map((s) => (
            <div key={s.label} className="bg-stone-50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-stone-400 uppercase tracking-wide mb-1 flex items-center justify-center gap-1">
                {s.icon}
                {s.label}
              </div>
              <div className="text-sm font-semibold text-stone-800">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="px-6 pb-2">
          <p className="text-sm text-stone-600 leading-relaxed">{apartment.description}</p>
        </div>

        {/* Features */}
        <div className="px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {apartment.features.map((f) => (
              <span key={f} className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 size={10} />
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-stone-900">{formatPrice(apartment.price)}</div>
            <div className="text-xs text-stone-400">{pricePerM2} ₸ за м²</div>
          </div>
          <button className="bg-stone-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-stone-700 active:scale-95">
            Связаться →
          </button>
        </div>
      </div>
    </div>
  );
}
