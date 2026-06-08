"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getApartmentById } from "@/lib/store";
import type { Apartment } from "@/data/apartments";
import {
  ArrowLeft, MapPin, Layers, Maximize2, CalendarDays,
  Phone, User, UtensilsCrossed, CheckCircle2, Building2, Share2, Heart
} from "lucide-react";
import { getFavorites, toggleFavorite } from "@/lib/store";

const PLAN_COLORS: Record<number, { bg: string; wall: string }> = {
  1: { bg: "#EEF6EE", wall: "#B8D8B8" },
  2: { bg: "#EEF0F8", wall: "#B8C4D8" },
  3: { bg: "#F3EEF8", wall: "#C4B8D8" },
};

function FloorPlan({ rooms }: { rooms: number }) {
  const c = PLAN_COLORS[rooms] ?? PLAN_COLORS[1];
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-52">
      <rect x="16" y="12" width="288" height="196" rx="4" fill={c.bg} stroke={c.wall} strokeWidth="2"/>
      {rooms >= 2 && <line x1="164" y1="12" x2="164" y2="134" stroke={c.wall} strokeWidth="2"/>}
      {rooms >= 3 && <line x1="16" y1="128" x2="164" y2="128" stroke={c.wall} strokeWidth="2"/>}
      <line x1="164" y1="134" x2="304" y2="134" stroke={c.wall} strokeWidth="2"/>
      <rect x="24" y="20" width="44" height="28" rx="3" fill="white" fillOpacity="0.65"/>
      <rect x="174" y="142" width="48" height="30" rx="3" fill="white" fillOpacity="0.65"/>
      {rooms >= 2 && <rect x="174" y="20" width="44" height="28" rx="3" fill="white" fillOpacity="0.65"/>}
      {rooms >= 3 && <rect x="24" y="136" width="44" height="28" rx="3" fill="white" fillOpacity="0.65"/>}
      <text x="160" y="92" fontSize="13" fill="#aaa" textAnchor="middle" fontFamily="Inter, sans-serif">{rooms}-комн.</text>
    </svg>
  );
}

function formatPrice(price: number) {
  if (price >= 1_000_000) return (price / 1_000_000).toFixed(1).replace(".0", "") + " млн ₸";
  return price.toLocaleString("ru") + " ₸";
}

const BADGE_LABEL: Record<string, string> = { new: "Новое", hot: "Топ", sale: "Акция" };
const BADGE_CLS: Record<string, string> = {
  new: "bg-emerald-50 text-emerald-700",
  hot: "bg-orange-50 text-orange-700",
  sale: "bg-amber-50 text-amber-700",
};

export default function ApartmentPage() {
  const params = useParams();
  const id = params?.id as string;
  const [apt, setApt] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = getApartmentById(id);
    setApt(found ?? null);
    setLiked(getFavorites().includes(id));
    setLoading(false);
  }, [id]);

  const handleFav = () => setLiked(toggleFavorite(id));
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-50"><Navbar/>
      <div className="max-w-4xl mx-auto px-6 py-16 text-center text-neutral-400 text-sm">Загрузка...</div>
    </div>
  );

  if (!apt) return (
    <div className="min-h-screen bg-neutral-50"><Navbar/>
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <Building2 size={40} className="mx-auto mb-4 text-neutral-300"/>
        <p className="text-neutral-700 font-medium mb-1">Объявление не найдено</p>
        <Link href="/" className="text-sm text-neutral-500 underline underline-offset-2">Вернуться в каталог</Link>
      </div>
    </div>
  );

  const pricePerM2 = Math.round(apt.price / apt.area).toLocaleString("ru");

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar/>
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-5">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={14}/> Каталог
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleShare}
              className="flex items-center gap-1.5 text-xs border border-neutral-200 rounded-xl px-3 py-2 hover:border-neutral-400 transition-colors text-neutral-600">
              <Share2 size={12}/>
              {copied ? "Скопировано!" : "Поделиться"}
            </button>
            <button onClick={handleFav}
              className={`flex items-center gap-1.5 text-xs border rounded-xl px-3 py-2 transition-colors ${liked ? "border-rose-200 bg-rose-50 text-rose-600" : "border-neutral-200 hover:border-neutral-400 text-neutral-600"}`}>
              <Heart size={12} fill={liked ? "currentColor" : "none"}/>
              {liked ? "В избранном" : "В избранное"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* LEFT COLUMN */}
          <div className="md:col-span-3 space-y-4">

            {/* Plan + main info */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="h-56 bg-neutral-50 flex items-center justify-center p-8">
                <FloorPlan rooms={apt.rooms}/>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h1 className="text-lg font-semibold text-neutral-900">{apt.title}</h1>
                  {apt.badge && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${BADGE_CLS[apt.badge]}`}>
                      {BADGE_LABEL[apt.badge]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-400 flex items-center gap-1 mb-4">
                  <MapPin size={11}/>{apt.address}, {apt.city}
                </p>

                {/* 6 stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: <Maximize2 size={12}/>, label: "Общая площадь", val: `${apt.area} м²` },
                    { icon: <UtensilsCrossed size={12}/>, label: "Площадь кухни", val: `${apt.kitchenArea} м²` },
                    { icon: <Layers size={12}/>, label: "Этаж", val: `${apt.floor} / ${apt.totalFloors}` },
                    { icon: <CalendarDays size={12}/>, label: "Год постройки", val: String(apt.year) },
                    { icon: <Building2 size={12}/>, label: "Комнат", val: String(apt.rooms) },
                    { icon: null, label: "Цена за м²", val: `${Math.round(apt.price / apt.area / 1000)}K ₸` },
                  ].map((s) => (
                    <div key={s.label} className="bg-neutral-50 rounded-xl p-3">
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1 mb-1">{s.icon}{s.label}</div>
                      <div className="text-sm font-semibold text-neutral-800">{s.val}</div>
                    </div>
                  ))}
                </div>

                {apt.description && (
                  <p className="text-sm text-neutral-600 leading-relaxed">{apt.description}</p>
                )}
              </div>
            </div>

            {/* Features */}
            {apt.features?.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <h2 className="text-sm font-semibold text-neutral-900 mb-3">Особенности</h2>
                <div className="flex flex-wrap gap-2">
                  {apt.features.map((f) => (
                    <span key={f} className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={10}/>{f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 sticky top-20">
              <div className="text-2xl font-bold text-neutral-900 mb-0.5">
                {apt.price > 0 ? formatPrice(apt.price) : "Цена по запросу"}
              </div>
              {apt.price > 0 && (
                <div className="text-xs text-neutral-400 mb-5">{pricePerM2} ₸ за м²</div>
              )}

              <div className="border-t border-neutral-100 pt-4 mb-4">
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium mb-3">Контакты продавца</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={17} className="text-neutral-500"/>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{apt.ownerName}</p>
                    <p className="text-xs text-neutral-400">Владелец</p>
                  </div>
                </div>
                <a href={`tel:${apt.ownerPhone}`}
                  className="flex items-center gap-2 w-full bg-neutral-900 text-white text-sm font-medium px-4 py-3 rounded-xl hover:bg-neutral-700 transition-colors justify-center">
                  <Phone size={14}/>{apt.ownerPhone}
                </a>
              </div>

              {apt.createdAt && (
                <p className="text-[11px] text-neutral-400 text-center">
                  Добавлено {new Date(apt.createdAt).toLocaleDateString("ru-RU")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
