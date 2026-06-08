"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, isAdmin, logout } from "@/lib/store";
import { Building2, Plus, User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [admin, setAdmin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setAdmin(isAdmin());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setAdmin(false);
    setOpen(false);
    router.push("/");
  };

  const isAuth = user || admin;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
            <Building2 size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight">КвартираHub</span>
        </Link>

        <nav className="flex items-center gap-1">
          {isAuth && (
            <Link href="/cabinet/add" className="flex items-center gap-1.5 text-xs font-medium bg-black text-white px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors mr-2">
              <Plus size={13} />
              Добавить
            </Link>
          )}

          {!isAuth ? (
            <>
              <Link href="/login" className="text-xs font-medium text-stone-600 hover:text-black px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                Войти
              </Link>
              <Link href="/register" className="text-xs font-medium bg-black text-white px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors">
                Регистрация
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-1.5 text-xs font-medium border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <User size={13} />
                {admin ? "Admin" : user?.name.split(" ")[0]}
                <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-stone-200 rounded-xl shadow-lg py-1 text-xs">
                  <Link href="/cabinet" className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 text-stone-700" onClick={() => setOpen(false)}>
                    <User size={12} />
                    Кабинет
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-stone-50 text-stone-700">
                    <LogOut size={12} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
