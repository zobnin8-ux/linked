export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-[#F5EFE6]">Privacy policy</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-[#A39588]">
        <p>
          Мы собираем ссылку на LinkedIn, email, технические данные (IP, user-agent) и результат AI-аудита, включая
          сырой JSON профиля для отладки качества.
        </p>
        <p>Данные не продаём и не передаём третьим лицам для маркетинга.</p>
        <p>Удаление данных — по запросу на hello@zobnin.ai с темой «Удалить аудит».</p>
      </div>
    </main>
  );
}
