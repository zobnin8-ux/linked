import { Languages, LineChart, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  {
    title: "Calque-фразы",
    body: "«I was responsible for» вместо «Led» — звучит как перевод с резюме из вуза.",
    icon: Languages,
  },
  {
    title: "Скромность вместо результата",
    body: "«participated in» вместо «drove 40% growth» — рекрутер не угадает твой вклад.",
    icon: LineChart,
  },
  {
    title: "Headline как у джуна",
    body: "«Senior Developer at X» вместо value-driven заголовка — сразу в корзину «ещё один кодер».",
    icon: UserRound,
  },
];

export function WhatWeFind() {
  return (
    <section className="border-b border-[#2a241c] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight text-[#F5EFE6] sm:text-3xl">Что мы найдём</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#A39588] sm:text-base">
          Не мотивашки, а конкретика: что именно триггерит «foreign» в голове рекрутера.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title} className="bg-[#14110e]">
              <CardHeader className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#E8B14B]/15 text-[#E8B14B]">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-[#A39588]">{item.body}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
