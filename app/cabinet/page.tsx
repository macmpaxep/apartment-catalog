"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCurrentUser, setCurrentUser, getUserApartments, deleteApartment, type User } from "@/lib/store";
import type { Apartment } from "@/data/apartments";
import { PlusCircle, Trash2, Eye, LogOut, User as UserIcon, Building2 } from "lucide-react";

function formatPrice(price: number) {
  if (price >= 1_000_000) return (price / 1_000_000).toFixed(1).replace(".0", "") + " млн ₸";
  return price.toLocaleString("ru") + " ₸";
}

export default function CabinetPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [myApartments, setMyApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);
    const all = getUserApartments();
    setMyApartments(all.filter((a) => a.userId === u.id));
  }, [router]);

  const handleDelete = (id: string) => {
    if (!confirm("Удалить объявление?")) return;
    deleteApartment(id);
    setMyApartments((p) => p.filter((a) => a.id !== id));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
                <UserIcon size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-neutral-900">{user.name}</h1>
                <p className="text-sm text-neutral-500">{user.phone}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <LogOut size={14} />
            Выйти
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Объявлений", val: myApartments.length },
            { label: "Активных", val: myApartments.length },
            { label: "Просмотров", val: myApartments.length * 12 },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-bold text-neutral-900 mb-0.5">{s.val}</div>
              <div className="text-xs text-neutral-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-900">Мои объявления</h2>
          <Link href="/cabinet/add" className="btn-primary flex items-center gap-1.5">
            <PlusCircle size={14} />
            Добавить
          </Link>
        </div>

        {/* Listings */}
        {myApartments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <Building2 size={36} className="mx-auto mb-3 text-neutral-300" />
            <p className="text-neutral-600 font-medium mb-1">Нет объявлений</p>
            <p className="text-sm text-neutral-400 mb-4">Разместите своё первое объявление</p>
            <Link href="/cabinet/add" className="btn-primary inline-flex items-center gap-1.5">
              <PlusCircle size={14} />
              Подать объявление
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myApartments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{apt.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {apt.city} · {apt.area} м² · {apt.floor}/{apt.totalFloors} эт. · {apt.year} г.
                  </p>
                </div>
                <div className="text-sm font-semibold text-neutral-900 whitespace-nowrap">
                  {formatPrice(apt.price)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/apartments/${apt.id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-neutral-200
                               text-neutral-500 hover:border-neutral-400 transition-colors"
                  >
                    <Eye size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-neutral-200
                               text-neutral-500 hover:border-rose-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
