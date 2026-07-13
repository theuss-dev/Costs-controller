import Link from "next/link";

export default function NotFoundAnalytics() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#18181b] px-6 text-center pb-24">
      <p className="text-neutral-500 text-sm mb-4">Esta seção foi removida.</p>
      <Link href="/" className="text-orange-500 font-semibold text-sm">
        ← Voltar para o início
      </Link>
    </main>
  );
}
