export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-[#A39588] sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} linkedin-audit</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <a className="hover:text-[#E8B14B]" href="/privacy">
            Privacy policy
          </a>
          <a className="hover:text-[#E8B14B]" href="mailto:hello@zobnin.ai">
            hello@zobnin.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
