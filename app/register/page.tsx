"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { registerUser } from "@/lib/store";
import { Building2, Phone, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhone = (v: string) => {
    // auto-format +7 XXX XXX XX XX
    const digits = v.replace(/\D/g, "").slice(0, 11);
    let formatted = "";
    if (digits.length > 0) formatted = "+" + digits[0];
    if (digits.length > 1) formatted += " " + digits.slice(1, 4);
    if (digits.length > 4) formatted += " " + digits.slice(4, 7);
    if (digits.length > 7) formatted += " " + digits.slice(7, 9);
    if (digits.length > 9) formatted += " " + digits.slice(9, 11);
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) { setError("Введите корректный номер телефона"); return; }
    if (name.trim().length < 2) { setError("Введите ваше имя"); return; }
    setLoading(true);

    const result = registerUser(phone, name.trim());
    if ("error" in result) { setError(result.error); setLoading(false); return; }
    router.push("/cabinet");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="flex items-start justify-center py-14 px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-7">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Building2 size={15} className="text-white"/>
            </div>
            <span className="font-semibold text-neutral-900">КвартираHub</span>
          </div>

          <h1 className="text-xl font-semibold text-neutral-900 mb-1">Регистрация</h1>
          <p className="text-sm text-neutral-500 mb-6">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-neutral-900 underline underline-offset-2">Войти</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Ваше имя</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"/>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Айдар Ибраев" required minLength={2}
                  className="input-base pl-9"/>
              </div>
            </div>

            <div>
              <label className="label">Номер мобильного телефона</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"/>
                <input type="tel" value={phone} onChange={(e) => handlePhone(e.target.value)}
                  placeholder="+7 700 000 00 00" required
                  className="input-base pl-9"/>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1.5">Используется для входа в систему</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2.5 rounded-xl">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Регистрация..." : "Зарегистрироваться →"}
            </button>
          </form>

          <p className="text-[11px] text-neutral-400 text-center mt-5">
            Регистрируясь, вы соглашаетесь с условиями использования
          </p>
        </div>
      </div>
    </div>
  );
}
