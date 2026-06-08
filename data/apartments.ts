export type Apartment = {
  id: string;
  rooms: number;
  title: string;
  district: string;
  city: string;
  address: string;
  price: number;
  area: number;
  kitchenArea: number;
  floor: number;
  totalFloors: number;
  year: number;
  badge: "new" | "hot" | "sale" | null;
  description: string;
  features: string[];
  ownerName: string;
  ownerPhone: string;
  isUserAdded?: boolean;
  userId?: string;
  createdAt?: string;
};

export const apartments: Apartment[] = [
  { id: "1", rooms: 1, title: "1-комн. квартира у парка", district: "Алмалинский район", city: "Алматы", address: "ул. Фурманова, 240", price: 28500000, area: 38, kitchenArea: 8, floor: 5, totalFloors: 12, year: 2022, badge: "new", description: "Светлая квартира с современным ремонтом в самом зелёном районе Алматы. Рядом парк им. Горького, школа, торговые центры. Развитая инфраструктура. Чистовая отделка, встроенная кухня.", features: ["Балкон", "Парковка", "Охрана", "Лифт"], ownerName: "Айдар Сейткали", ownerPhone: "+7 701 234 56 78" },
  { id: "2", rooms: 2, title: "2-комн. в деловом центре", district: "Есильский район", city: "Астана", address: "пр. Кабанбай батыра, 11", price: 52000000, area: 65, kitchenArea: 12, floor: 8, totalFloors: 22, year: 2023, badge: "hot", description: "Просторная квартира в самом сердце делового центра Астаны. Панорамные окна с видом на Байтерек, подземный паркинг, консьерж-сервис.", features: ["Панорамные окна", "Подземный паркинг", "Консьерж", "Смарт-дом"], ownerName: "Зарина Бекова", ownerPhone: "+7 702 345 67 89" },
  { id: "3", rooms: 3, title: "3-комн. у подножья гор", district: "Бостандыкский район", city: "Алматы", address: "ул. Тимирязева, 77", price: 75000000, area: 95, kitchenArea: 18, floor: 3, totalFloors: 9, year: 2019, badge: null, description: "Уютная трёхкомнатная квартира в тихом Бостандыкском районе. Большая кухня-студия 18 м², гардеробная комната, две лоджии.", features: ["Кухня-студия", "Гардеробная", "Две лоджии", "Тихий двор"], ownerName: "Нурлан Абенов", ownerPhone: "+7 705 456 78 90" },
  { id: "4", rooms: 1, title: "1-комн. студия, выгодная цена", district: "Сарыарка район", city: "Астана", address: "ул. Бейбітшілік, 18", price: 19900000, area: 42, kitchenArea: 9, floor: 4, totalFloors: 16, year: 2021, badge: "sale", description: "Отличный вариант для первой покупки или инвестиций. Качественная отделка, встроенная кухня, гардеробная ниша.", features: ["Встроенная кухня", "Рядом метро", "Гардеробная", "Видеодомофон"], ownerName: "Гульнара Ержанова", ownerPhone: "+7 707 567 89 01" },
  { id: "5", rooms: 2, title: "2-комн. с видом на горы", district: "Медеуский район", city: "Алматы", address: "ул. Достык, 130", price: 68000000, area: 72, kitchenArea: 14, floor: 12, totalFloors: 18, year: 2020, badge: null, description: "Квартира с захватывающим видом на горы. Престижный район, закрытая охраняемая территория с консьерж-сервисом.", features: ["Вид на горы", "Закрытая территория", "Паркинг", "Охрана 24/7"], ownerName: "Серик Жуманов", ownerPhone: "+7 708 678 90 12" },
  { id: "6", rooms: 3, title: "3-комн. в новостройке 2024", district: "Алматы район", city: "Астана", address: "ул. Сейфуллина, 45", price: 89000000, area: 110, kitchenArea: 22, floor: 7, totalFloors: 24, year: 2024, badge: "new", description: "Просторная квартира в жилом комплексе 2024 года постройки. Чистовая отделка, два санузла, гостиная 35 м².", features: ["Два санузла", "Гостиная 35м²", "Двор без машин", "Детская площадка"], ownerName: "Дана Сатпаева", ownerPhone: "+7 700 789 01 23" },
  { id: "7", rooms: 1, title: "1-комн. в Шымкенте", district: "Аль-Фарабийский район", city: "Шымкент", address: "пр. Республики, 22", price: 15500000, area: 35, kitchenArea: 7, floor: 2, totalFloors: 10, year: 2018, badge: null, description: "Компактная уютная квартира в центральном районе Шымкента. Хорошая транспортная доступность, рядом рынок и торговые центры.", features: ["Центр города", "Транспортная развязка", "Рядом рынок", "Интернет"], ownerName: "Бахытжан Омаров", ownerPhone: "+7 701 890 12 34" },
  { id: "8", rooms: 2, title: "2-комн. в зелёном ЖК", district: "Наурызбайский район", city: "Алматы", address: "мкр. Думан-2, 5", price: 38000000, area: 58, kitchenArea: 11, floor: 6, totalFloors: 20, year: 2022, badge: "sale", description: "Тихий зелёный район, новый жилой комплекс с благоустроенной территорией. Просторные комнаты, большой балкон.", features: ["Большой балкон", "Зелёный двор", "Скидка 5%", "Рассрочка"], ownerName: "Алия Нурмаганбетова", ownerPhone: "+7 702 901 23 45" },
];

export const cities = ["Все города", "Алматы", "Астана", "Шымкент"];
