"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const [name,  setName]  = useState("Matheus");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Futuramente: salvar no Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#18181b] pb-28">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-6 border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 active:scale-95 transition-transform text-white"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">Dados</h1>
      </header>

      <div className="flex flex-col px-6 pt-8 gap-6">

        {/* ─── Nome (editável) ─── */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl px-5 py-4 text-white font-medium outline-none focus:border-orange-500/50 transition-colors placeholder:text-neutral-600"
          />
        </div>

        {/* ─── E-mail (somente leitura) ─── */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            E-mail
          </label>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-neutral-400 font-medium text-sm">matheus@email.com</span>
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-full">
              Somente leitura
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 px-1">O e-mail não pode ser alterado por aqui.</p>
        </div>

        {/* ─── Botão Salvar ─── */}
        <button
          onClick={handleSave}
          disabled={!name.trim() || saved}
          className="relative w-full h-[56px] rounded-[18px] overflow-hidden text-white font-bold text-sm active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
            boxShadow: "0 4px 0px #7c2d12, 0 8px 24px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          {saved ? (
            <><Check size={16} strokeWidth={3} /> Salvo!</>
          ) : (
            "Salvar alterações"
          )}
        </button>
      </div>
    </main>
  );
}
