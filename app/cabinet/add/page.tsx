"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCurrentUser, addApartment } from "@/lib/store";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const CITIES = ["Алматы", "Астана", "Шымкент", "Другой"];
const FEATURES_OPTIONS = [
  "Балкон", "Лоджия", "Лифт", "Парковка", "Консьерж",
  "Охрана", "Смарт-дом", "Видеодомофон", "Кладовая", "Детская площадка",
  "Подземный паркинг", "Кухня-студия", "Гардеробная", "Тихий двор", "Вид на горы",
];

const Field = ({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) => (
  <div>
    <label className="label">{label}</label>
    {children}
    {note && <p className="text-[11px] text-neutral-400 mt-1">{note}</p>}
  </div>
);

export default function AddApartmentPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [newId, setNewId] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    rooms: "1",
    title: "",
    city: "Алматы",
    district: "",
    address: "",
    price: "",
    area: "",
    kitchenArea: "",
    floor: "",
    totalFloors: "",
    year: new Date().getFullYear().toString(),
    ownerName: "",
    ownerPhone: "",
    description: "",
    features: [] as string[],
  });

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/login"); return; }
    setUserId(u.id);
    setForm((p) => ({ ...p, ownerName: u.name, ownerPhone: u.phone }));
  }, [router]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const toggleFeature = (f: string) => setForm((p) => ({
    ...p,
    features: p.features.includes(f) ? p.features.filter((x) => x !== f) : [...p.features, f],
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!userId) return;

    if (!form.area || Number(form.area) <= 0) { setError("Укажите корректную площадь"); return; }
    if (!form.kitchenArea || Number(form.kitchenArea) <= 0) { setError("Укажите площадь кухни"); return; }
    if (!form.floor || Number(form.floor) <= 0) { setError("Укажите этаж"); return; }
    if (!form.totalFloors || Number(form.totalFloors) < Number(form.floor)) { setError("Количество этажей не может быть меньше этажа квартиры"); return; }
    if (!form.ownerPhone) { setError("Укажите номер телефона"); return; }
    if (!form.ownerName) { setError("Укажите имя владельца"); return; }

    const apt = addApartment({
      rooms: Number(form.rooms),
      title: form.title || `${form.rooms}-комн. квартира, ${form.city}`,
      city: form.city,
      district: form.district || form.city,
      address: form.address,
      price: Number(form.price) || 0,
      area: Number(form.area),
      kitchenArea: Number(form.kitchenArea),
      floor: Number(form.floor),
      totalFloors: Number(form.totalFloors),
      year: Number(form.year),
      badge: null,
      description: form.description,
      features: form.features,
      ownerName: form.ownerName,
      ownerPhone: form.ownerPhone,
    }, userId);

    setNewId(apt.id);
    setDone(true);
  };

  if (done) return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} className="text-emerald-600"/>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Объявление добавлено</h1>
        <p className="text-sm text-neutral-500 mb-6">Ваше объявление опубликовано в каталоге</p>
        <div className="flex flex-col gap-2">
          <Link href={`/apartments/${newId}`} className="btn-primary justify-center">Посмотреть объявление</Link>
          <Link href="/cabinet" className="btn-secondary justify-center">Вернуться в кабинет</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-8">
        <Link href="/cabinet" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors">
          <ArrowLeft size={14}/> Кабинет
        </Link>

        <h1 className="text-xl font-semibold text-neutral-900 mb-6">Новое объявление</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* === ОСНОВНАЯ ИНФОРМАЦИЯ === */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900">Основная информация</h2>

            <Field label="Количество комнат">
              <div className="flex gap-2">
                {["1","2","3","4+"].map((r) => (
                  <button key={r} type="button" onClick={() => set("rooms", r)}
                    className={`flex-1 py-2 rounded-xl border text-sm transition-colors ${form.rooms === r ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Заголовок объявления" note="Если не заполнить — сформируется автоматически">
              <input className="input-base" value={form.title} onChange={(e) => set("title", e.target.value)}
                placeholder={`${form.rooms}-комн. квартира в ${form.city}`}/>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Город *">
                <select className="input-base" value={form.city} onChange={(e) => set("city", e.target.value)}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Район">
                <input className="input-base" value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="Есильский район"/>
              </Field>
            </div>

            <Field label="Адрес">
              <input className="input-base" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="ул. Достык, 100"/>
            </Field>
          </div>

          {/* === ПАРАМЕТРЫ КВАРТИРЫ === */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900">Параметры квартиры</h2>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Общая площадь, м² *">
                <input type="number" min={1} className="input-base" value={form.area}
                  onChange={(e) => set("area", e.target.value)} placeholder="65" required/>
              </Field>
              <Field label="Площадь кухни, м² *">
                <input type="number" min={1} className="input-base" value={form.kitchenArea}
                  onChange={(e) => set("kitchenArea", e.target.value)} placeholder="12" required/>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Этаж *">
                <input type="number" min={1} max={200} className="input-base" value={form.floor}
                  onChange={(e) => set("floor", e.target.value)} placeholder="5" required/>
              </Field>
              <Field label="Этажей в доме *">
                <input type="number" min={1} max={200} className="input-base" value={form.totalFloors}
                  onChange={(e) => set("totalFloors", e.target.value)} placeholder="12" required/>
              </Field>
            </div>

            <Field label="Год постройки">
              <input type="number" min={1900} max={2030} className="input-base" value={form.year}
                onChange={(e) => set("year", e.target.value)} placeholder="2022"/>
            </Field>

            <Field label="Цена, ₸">
              <input type="number" min={0} className="input-base" value={form.price}
                onChange={(e) => set("price", e.target.value)} placeholder="45 000 000"/>
            </Field>
          </div>

          {/* === КОНТАКТЫ ВЛАДЕЛЬЦА === */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900">Контакты владельца</h2>

            <Field label="Имя владельца *">
              <input className="input-base" value={form.ownerName}
                onChange={(e) => set("ownerName", e.target.value)} placeholder="Айдар Ибраев" required/>
            </Field>

            <Field label="Номер телефона *" note="Будет показан покупателям для связи">
              <input type="tel" className="input-base" value={form.ownerPhone}
                onChange={(e) => set("ownerPhone", e.target.value)} placeholder="+7 700 000 0000" required/>
            </Field>
          </div>

          {/* === ОПИСАНИЕ === */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900">Описание</h2>
            <textarea
              className="input-base resize-none h-28"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Опишите квартиру: состояние ремонта, особенности, инфраструктуру рядом..."/>

            <div>
              <label className="label mb-2">Удобства</label>
              <div className="flex flex-wrap gap-2">
                {FEATURES_OPTIONS.map((f) => (
                  <button key={f} type="button" onClick={() => toggleFeature(f)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.features.includes(f)
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3 pb-8">
            <Link href="/cabinet" className="btn-secondary flex-1 justify-center">Отмена</Link>
            <button type="submit" className="btn-primary flex-1 justify-center">Опубликовать</button>
          </div>
        </form>
      </div>
    </div>
  );
}
