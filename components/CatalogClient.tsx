"use client";

import { useState, useMemo, useEffect } from "react";
import type { Apartment } from "@/data/apartments";
import { apartments as staticApartments } from "@/data/apartments";
import { getUserApartments } from "@/lib/store";
import ApartmentCard from "./ApartmentCard";
import Filters, { type FilterState, DEFAULT_FILTERS } from "./Filters";
import { Building2 } from "lucide-react";

function applyFilters(list: Apartment[], f: FilterState): Apartment[] {
  let r = [...list];
  if (f.search.trim()) {
    const q = f.search.toLowerCase();
    r = r.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.district.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
    );
  }
  if (f.city !== "Все города") r = r.filter((a) => a.city === f.city);
  if (f.rooms !== null) r = r.filter((a) => a.rooms === f.rooms);
  if (f.maxPrice !== null) r = r.filter((a) => a.price <= f.maxPrice!);
  if (f.minArea !== null) r = r.filter((a) => a.area >= f.minArea!);
  if (f.maxArea !== null) r = r.filter((a) => a.area <= f.maxArea!);
  if (f.minKitchen !== null) r = r.filter((a) => a.kitchenArea >= f.minKitchen!);
  if (f.floor !== null) r = r.filter((a) => a.floor === f.floor);
  if (f.minYear !== null) r = r.filter((a) => a.year >= f.minYear!);
  if (f.maxYear !== null) r = r.filter((a) => a.year <= f.maxYear!);
  switch (f.sort) {
    case "price_asc":  r.sort((a, b) => a.price - b.price); break;
    case "price_desc": r.sort((a, b) => b.price - a.price); break;
    case "area_asc":   r.sort((a, b) => a.area - b.area); break;
    case "area_desc":  r.sort((a, b) => b.area - a.area); break;
    case "year_desc":  r.sort((a, b) => b.year - a.year); break;
    case "year_asc":   r.sort((a, b) => a.year - b.year); break;
  }
  return r;
}

export default function CatalogClient() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [all, setAll] = useState<Apartment[]>(staticApartments);

  useEffect(() => {
    setAll([...staticApartments, ...getUserApartments()]);
  }, []);

  const filtered = useMemo(() => applyFilters(all, filters), [all, filters]);

  return (
    <>
      <Filters filters={filters} onChange={setFilters} filteredCount={filtered.length} totalCount={all.length}/>

      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Building2 size={36} className="mx-auto mb-4 text-neutral-300"/>
            <p className="text-neutral-600 font-medium mb-1">Ничего не найдено</p>
            <p className="text-sm text-neutral-400 mb-4">Попробуйте изменить параметры поиска</p>
            <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-sm text-neutral-900 underline underline-offset-2">
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((apt) => <ApartmentCard key={apt.id} apartment={apt}/>)}
          </div>
        )}
      </main>
    </>
  );
}
