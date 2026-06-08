import { apartments as staticApartments, type Apartment } from "@/data/apartments";

export type User = {
  id: string;
  phone: string;
  name: string;
  createdAt: string;
};

const K = {
  USER: "kh_user",
  USERS: "kh_users",
  APTS: "kh_apts",
  ADMIN: "kh_admin",
  FAVS: "kh_favs",
};

const isBr = () => typeof window !== "undefined";

// ── Auth ──────────────────────────────────────────────────────────────────────
export function getUsers(): User[] {
  if (!isBr()) return [];
  try { return JSON.parse(localStorage.getItem(K.USERS) || "[]"); } catch { return []; }
}

export function registerUser(phone: string, name: string): { user: User } | { error: string } {
  const users = getUsers();
  const clean = phone.replace(/\D/g, "");
  if (users.find((u) => u.phone.replace(/\D/g, "") === clean))
    return { error: "Этот номер уже зарегистрирован" };
  const user: User = { id: Date.now().toString(), phone, name, createdAt: new Date().toISOString() };
  localStorage.setItem(K.USERS, JSON.stringify([...users, user]));
  localStorage.setItem(K.USER, JSON.stringify(user));
  return { user };
}

export function loginByPhone(phone: string): User | null {
  const clean = phone.replace(/\D/g, "");
  const user = getUsers().find((u) => u.phone.replace(/\D/g, "") === clean) ?? null;
  if (user) localStorage.setItem(K.USER, JSON.stringify(user));
  return user;
}

// alias used by login page
export const loginUser = loginByPhone;

export function getCurrentUser(): User | null {
  if (!isBr()) return null;
  try { return JSON.parse(localStorage.getItem(K.USER) || "null"); } catch { return null; }
}

export function setCurrentUser(user: User | null) {
  if (!isBr()) return;
  if (user) localStorage.setItem(K.USER, JSON.stringify(user));
  else localStorage.removeItem(K.USER);
}

export function logout() {
  if (!isBr()) return;
  localStorage.removeItem(K.USER);
  localStorage.removeItem(K.ADMIN);
}

export function isAdmin(): boolean {
  if (!isBr()) return false;
  return localStorage.getItem(K.ADMIN) === "1";
}

export function adminLogin(login: string, pass: string): boolean {
  if (login === "adminMOZ" && pass === "ACO!0506") {
    localStorage.setItem(K.ADMIN, "1");
    return true;
  }
  return false;
}

// aliases used by login page
export const checkAdminCredentials = adminLogin;
export function setAdminSession(v: boolean) {
  if (!isBr()) return;
  if (v) localStorage.setItem(K.ADMIN, "1");
  else localStorage.removeItem(K.ADMIN);
}

export function adminLogout() {
  if (!isBr()) return;
  localStorage.removeItem(K.ADMIN);
}

// ── Apartments ────────────────────────────────────────────────────────────────
export function getUserApts(): Apartment[] {
  if (!isBr()) return [];
  try { return JSON.parse(localStorage.getItem(K.APTS) || "[]"); } catch { return []; }
}

// alias
export const getUserApartments = getUserApts;

export function getAllApts(): Apartment[] {
  return [...staticApartments, ...getUserApts()];
}

export function getAptById(id: string): Apartment | undefined {
  return getAllApts().find((a) => a.id === id);
}

// alias
export const getApartmentById = getAptById;

export function addApt(
  data: Omit<Apartment, "id" | "createdAt" | "isUserAdded" | "userId">,
  userId: string
): Apartment {
  const apt: Apartment = {
    ...data,
    id: `u_${Date.now()}`,
    isUserAdded: true,
    userId,
    createdAt: new Date().toISOString(),
  };
  const list = getUserApts();
  localStorage.setItem(K.APTS, JSON.stringify([...list, apt]));
  return apt;
}

// aliases
export const addApartment = addApt;

export function deleteApt(id: string) {
  if (!isBr()) return;
  localStorage.setItem(K.APTS, JSON.stringify(getUserApts().filter((a) => a.id !== id)));
}

// aliases
export const deleteApartment = deleteApt;

// ── Favorites ─────────────────────────────────────────────────────────────────
export function getFavs(): string[] {
  if (!isBr()) return [];
  try { return JSON.parse(localStorage.getItem(K.FAVS) || "[]"); } catch { return []; }
}

// aliases
export const getFavorites = getFavs;

export function toggleFav(id: string): boolean {
  const favs = getFavs();
  const has = favs.includes(id);
  localStorage.setItem(K.FAVS, JSON.stringify(has ? favs.filter((f) => f !== id) : [...favs, id]));
  return !has;
}

// aliases
export const toggleFavorite = toggleFav;
