import { apartments as staticApartments, type Apartment } from "@/data/apartments";
import { supabase } from "@/lib/supabase";

export type User = {
  id: string;
  phone: string;
  name: string;
  createdAt: string;
};

const K = {
  USER: "kh_user",
  USERS: "kh_users",
  ADMIN: "kh_admin",
  FAVS: "kh_favs",
};

const isBr = () => typeof window !== "undefined";

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

export async function getUserApts(): Promise<Apartment[]> {
  const { data, error } = await supabase.from("apartments").select("*").order("created_at", { ascending: false });
  if (error) { console.error("Supabase fetch error:", error); return []; }
  return (data || []).map((row: any) => ({
    id: String(row.id),
    rooms: row.rooms,
    title: row.title,
    city: row.city,
    district: row.district,
    address: row.address,
    price: row.price,
    area: row.area,
    kitchenArea: row.kitchen_area,
    floor: row.floor,
    totalFloors: row.total_floors,
    year: row.year,
    badge: row.badge,
    description: row.description,
    features: row.features || [],
    ownerName: row.owner_name,
    ownerPhone: row.owner_phone,
    isUserAdded: true,
    userId: row.user_id,
    createdAt: row.created_at,
  }));
}
export const getUserApartments = getUserApts;

export async function getAllApts(): Promise<Apartment[]> {
  const userApts = await getUserApts();
  return [...staticApartments, ...userApts];
}

export async function addApt(
  data: Omit<Apartment, "id" | "createdAt" | "isUserAdded" | "userId">,
  userId: string
): Promise<Apartment> {
  const { data: row, error } = await supabase.from("apartments").insert([{
    rooms: data.rooms,
    title: data.title,
    city: data.city,
    district: data.district,
    address: data.address,
    price: data.price,
    area: data.area,
    kitchen_area: data.kitchenArea,
    floor: data.floor,
    total_floors: data.totalFloors,
    year: data.year,
    badge: data.badge,
    description: data.description,
    features: data.features,
    owner_name: data.ownerName,
    owner_phone: data.ownerPhone,
    user_id: userId,
  }]).select().single();

  if (error) { console.error("Supabase insert error:", error); throw error; }

  return {
    ...data,
    id: String(row.id),
    isUserAdded: true,
    userId,
    createdAt: row.created_at,
  };
}
export const addApartment = addApt;

export async function deleteApt(id: string) {
  const { error } = await supabase.from("apartments").delete().eq("id", id);
  if (error) console.error("Supabase delete error:", error);
}
export const deleteApartment = deleteApt;

export function getFavs(): string[] {
  if (!isBr()) return [];
  try { return JSON.parse(localStorage.getItem(K.FAVS) || "[]"); } catch { return []; }
}
export const getFavorites = getFavs;
export function toggleFav(id: string): boolean {
  const favs = getFavs();
  const has = favs.includes(id);
  localStorage.setItem(K.FAVS, JSON.stringify(has ? favs.filter((f) => f !== id) : [...favs, id]));
  return !has;
}
export const toggleFavorite = toggleFav;
