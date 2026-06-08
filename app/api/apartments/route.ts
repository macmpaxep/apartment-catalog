import { NextRequest, NextResponse } from "next/server";
import { apartments } from "@/data/apartments";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");
  const rooms = searchParams.get("rooms");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");

  let result = [...apartments];

  if (city && city !== "Все города") {
    result = result.filter((a) => a.city === city);
  }

  if (rooms) {
    result = result.filter((a) => a.rooms === parseInt(rooms));
  }

  if (maxPrice) {
    result = result.filter((a) => a.price <= parseInt(maxPrice));
  }

  switch (sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "area_asc":
      result.sort((a, b) => a.area - b.area);
      break;
    case "year_desc":
      result.sort((a, b) => b.year - a.year);
      break;
  }

  return NextResponse.json({ data: result, total: result.length });
}
