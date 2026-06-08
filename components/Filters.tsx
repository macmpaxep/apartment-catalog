"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cities } from "@/data/apartments";

export type FilterState = {
  search: string;
  city: string;
  rooms: number | null;
  maxPrice: number | null;
  minArea: number | null;
  maxArea: number | null;
  minKitchen: number | null;
  floor: number | null;
  minYear: number | null;
  maxYear: number | null;
  sort: string;
};

export const DEFAULT_FILTERS: FilterState = {
  search: "", city: "Все города", rooms: null, maxPrice: null,
  minArea: null, maxArea: null, minKitchen: null, floor: null,
  minYear: null, maxYear: null, sort: "default",
};

type Props = { filters: FilterState; onChange: (f: FilterState) => void; filteredCount: number; totalCount: number; };

const inp = "w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-neutral-900 placeholder:text-neutral-400 bg-white";

export default function Filters({ filters, onChange, filteredCount, totalCount }: Props) {
  const [expanded, setExpanded] = useState(false);
  const set = (p: Partial<FilterState>) => onChange({ ...filters, ...p });
  const hasActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);
  const hasExtra = filters.minArea || filters.maxArea || filters.minKitchen || filters.floor || filters.minYear || filters.maxYear;

  return (
    <div className="bg-white border-b border-neutral-100 sticky top-14 z-30">
      <div className="max-w-screen-xl mx-auto px-4 py-3 space-y-3">

        {/* Row 1: search + city + rooms + price + sort */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative min-w-52 flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"/>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="Район, улица, адрес..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 bg-white text-sm outline-none focus:border-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          <select value={filters.city} onChange={(e) => set({ city: e.target.value })}
            className="border border-neutral-200 bg-white rounded-xl px-3 py-2 text-sm outline-none focus:border-neutral-900 text-neutral-700">
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>

          <div className="flex gap-1">
            {[null, 1, 2, 3].map((r) => (
              <button key={r ?? "all"} onClick={() => set({ rooms: r })}
                className={`text-xs px-3 py-2 rounded-xl border transition-colors ${
                  filters.rooms === r ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                }`}>
                {r === null ? "Все" : `${r} комн`}
              </button>
            ))}
          </div>

          <select value={filters.maxPrice ?? ""} onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : null })}
            className="border border-neutral-200 bg-white rounded-xl px-3 py-2 text-sm outline-none focus:border-neutral-900 text-neutral-700">
            <option value="">Любая цена</option>
            <option value="20000000">до 20 млн</option>
            <option value="35000000">до 35 млн</option>
            <option value="55000000">до 55 млн</option>
            <option value="75000000">до 75 млн</option>
            <option value="100000000">до 100 млн</option>
          </select>

          <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })}
            className="border border-neutral-200 bg-white rounded-xl px-3 py-2 text-sm outline-none focus:border-neutral-900 text-neutral-600">
            <option value="default">Сортировка</option>
            <option value="price_asc">Цена ↑</option>
            <option value="price_desc">Цена ↓</option>
            <option value="area_asc">Площадь ↑</option>
            <option value="area_desc">Площадь ↓</option>
            <option value="year_desc">Новее</option>
            <option value="year_asc">Старше</option>
          </select>

          <button onClick={() => setExpanded((p) => !p)}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-colors ${
              (hasExtra || expanded) ? "border-neutral-900 text-neutral-900 bg-neutral-50 font-medium" : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
            }`}>
            <SlidersHorizontal size={12}/>
            Параметры{hasExtra ? " ·" : ""}
          </button>

          {hasActive && (
            <button onClick={() => onChange(DEFAULT_FILTERS)}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-800 transition-colors px-2 py-2">
              <X size={11}/>Сбросить
            </button>
          )}

          <span className="ml-auto text-xs text-neutral-400 whitespace-nowrap">
            <strong className="text-neutral-700">{filteredCount}</strong>
            {filteredCount !== totalCount && ` из ${totalCount}`} объявл.
          </span>
        </div>

        {/* Row 2: расширенные параметры */}
        {expanded && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pb-1">
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">Площадь от, м²</p>
              <input type="number" value={filters.minArea ?? ""} onChange={(e) => set({ minArea: e.target.value ? Number(e.target.value) : null })}
                placeholder="от" min={0} className={inp}/>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">Площадь до, м²</p>
              <input type="number" value={filters.maxArea ?? ""} onChange={(e) => set({ maxArea: e.target.value ? Number(e.target.value) : null })}
                placeholder="до" min={0} className={inp}/>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">Кухня от, м²</p>
              <input type="number" value={filters.minKitchen ?? ""} onChange={(e) => set({ minKitchen: e.target.value ? Number(e.target.value) : null })}
                placeholder="от" min={0} className={inp}/>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">Этаж</p>
              <input type="number" value={filters.floor ?? ""} onChange={(e) => set({ floor: e.target.value ? Number(e.target.value) : null })}
                placeholder="Номер" min={1} className={inp}/>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">Год от</p>
              <input type="number" value={filters.minYear ?? ""} onChange={(e) => set({ minYear: e.target.value ? Number(e.target.value) : null })}
                placeholder="2010" min={1900} max={2030} className={inp}/>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">Год до</p>
              <input type="number" value={filters.maxYear ?? ""} onChange={(e) => set({ maxYear: e.target.value ? Number(e.target.value) : null })}
                placeholder="2024" min={1900} max={2030} className={inp}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
