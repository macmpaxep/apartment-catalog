"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { loginUser, setCurrentUser, checkAdminCredentials, setAdminSession } from "@/lib/store";
import { Building2, Phone, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"user" | "admin">("user");
  const [phone, setPhone] = useState("");
  const [adminLogin, setAdminLogin] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [error, setError] = useState("");

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = loginUser(phone);
    if (!user) {
      setError("Пользователь с таким номером не найден. Сначала зарегистрируйтесь.");
      return;
    }
    setCurrentUser(user);
    router.push("/cabinet");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!checkAdminCredentials(adminLogin, adminPass)) {
      setError("Неверный логин или пароль.");
      return;
    }
    setAdminSession(true);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="flex items-start justify-center py-16 px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Building2 size={15} className="text-white" />
            </div>
            <span className="font-semibold text-neutral-900">КвартираHub</span>
          </div>

          <h1 className="text-xl font-semibold text-neutral-900 mb-1">Вход</h1>
          <p className="text-sm text-neutral-500 mb-6">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-neutral-900 underline underline-offset-2">
              Зарегистрируйтесь
            </Link>
          </p>

          {/* Tabs */}
          <div className="flex gap-1 bg-neutral-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab("user"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg transition-colors ${
                tab === "user" ? "bg-white text-neutral-900 shadow-sm font-medium" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Phone size={13} />
              По телефону
            </button>
            <button
              onClick={() => { setTab("admin"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg transition-colors ${
                tab === "admin" ? "bg-white text-neutral-900 shadow-sm font-medium" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <ShieldCheck size={13} />
              Администратор
            </button>
          </div>

          {tab === "user" ? (
            <form onSubmit={handleUserLogin} className="space-y-4">
              <div>
                <label className="label">Номер телефона</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 700 000 0000"
                  required
                  className="input-base"
                />
              </div>
              {error && <p className="text-xs text-rose-500">{error}</p>}
              <button type="submit" className="btn-primary w-full">
                Войти
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="label">Логин</label>
                <input
                  type="text"
                  value={adminLogin}
                  onChange={(e) => setAdminLogin(e.target.value)}
                  placeholder="Введите логин"
                  required
                  className="input-base"
                />
              </div>
              <div>
                <label className="label">Пароль</label>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="Введите пароль"
                  required
                  className="input-base"
                />
              </div>
              {error && <p className="text-xs text-rose-500">{error}</p>}
              <button type="submit" className="btn-primary w-full">
                Войти как администратор
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
