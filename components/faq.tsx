"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Это безопасно? Что вы делаете с данными?",
    a: "Храним email, ссылку, сырой JSON профиля (для дебага) и результат аудита. Не продаём и не шарим третьим лицам. Удаление — по запросу на контактный email из футера.",
  },
  {
    q: "Насколько точен анализ?",
    a: "Это эвристика под западного рекрутера, не приговор. Но лучше увидеть «как звучит снаружи», чем гадать, почему ноль ответов.",
  },
  {
    q: "Чем вы лучше Resumeworded / Teal?",
    a: "Они полируют английский. Мы ловим «иммигрантские» маркеры, которые бьют по доверию на первом экране.",
  },
  {
    q: "Можно ли удалить мои данные?",
    a: "Да. Напиши на email из футера — сотрём запись аудита и связанные данные.",
  },
  {
    q: "Будет ли платная версия?",
    a: "Да, планируется переписывание профиля под US/EU. Сейчас — бесплатный аудит как вход.",
  },
];

export function Faq() {
  return (
    <section className="border-b border-[#2a241c] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-[#F5EFE6] sm:text-3xl">FAQ</h2>
        <Accordion type="single" collapsible className="mt-8 w-full">
          {faqs.map((item, idx) => (
            <AccordionItem key={item.q} value={`item-${idx}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
