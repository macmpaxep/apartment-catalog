import Navbar from "@/components/Navbar";
import CatalogClient from "@/components/CatalogClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      {/* Hero */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-screen-xl mx-auto px-4 py-5">
          <h1 className="text-xl font-bold text-neutral-900">Каталог квартир</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Актуальные предложения по Казахстану</p>
        </div>
      </div>
      <CatalogClient />
    </div>
  );
}
