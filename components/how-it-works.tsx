import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "1. Вставляешь ссылку",
    body: "Мы тянем публичные данные профиля через официальный парсер. Без логина с твоей стороны.",
  },
  {
    title: "2. AI проходит чек-лист",
    body: "40+ маркеров: язык, структура, метрики, «скромность», заголовки, опыт.",
  },
  {
    title: "3. Получаешь «было → стало»",
    body: "Три топ-инсайта на странице, полный разбор — на почте. Без воды.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-[#2a241c] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight text-[#F5EFE6] sm:text-3xl">Как это работает</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.title} className="bg-[#1A1612]">
              <CardContent className="space-y-2 p-5">
                <h3 className="text-base font-semibold text-[#F5EFE6]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[#A39588]">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
