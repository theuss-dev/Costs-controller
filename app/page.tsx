"use client";

import { useState } from "react";
import TransactionCard from "@/components/TransactionCard";
import TransactionDetailModal from "@/components/TransactionDetailModal";
import { type TransactionCardProps } from "@/components/TransactionCard";
import { Plus, BarChart2 } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Dados mock ──────────────────────────────────────────────
const TOTAL_LIMIT  = 600;
const WEEKLY_LIMIT = TOTAL_LIMIT / 4; // R$ 150

const weekends = [
  {
    label: "1º Final de Semana", dates: "1–2 Fev", total: 145.30,
    transactions: [
      { id: "w1t1", title: "Lanche",      date: "Sáb, 1 Fev",  amount: 87.90, type: "expense" as const, category: "food"      as const, payerId: "p1", payerName: "Matheus" },
      { id: "w1t2", title: "Uber",        date: "Dom, 2 Fev",  amount: 32.00, type: "expense" as const, category: "transport" as const, payerId: "p2", payerName: "Amor"    },
      { id: "w1t3", title: "Lazer",       date: "Dom, 2 Fev",  amount: 25.40, type: "expense" as const, category: "shopping"  as const, payerId: "p1", payerName: "Matheus" },
    ],
  },
  {
    label: "2º Final de Semana", dates: "8–9 Fev", total: 112.70,
    transactions: [
      { id: "w2t1", title: "Lazer",       date: "Sáb, 8 Fev",  amount: 76.00, type: "expense" as const, category: "shopping"  as const, payerId: "p2", payerName: "Amor"    },
      { id: "w2t2", title: "Uber",        date: "Sáb, 8 Fev",  amount: 21.70, type: "expense" as const, category: "transport" as const, payerId: "p1", payerName: "Matheus" },
      { id: "w2t3", title: "Lanche",      date: "Dom, 9 Fev",  amount: 15.00, type: "expense" as const, category: "food"      as const, payerId: "p2", payerName: "Amor"    },
    ],
  },
  {
    label: "3º Final de Semana", dates: "15–16 Fev", total: 138.00,
    transactions: [
      { id: "w3t1", title: "Restaurante", date: "Sáb, 15 Fev", amount: 110.00, type: "expense" as const, category: "restaurant" as const, payerId: "p1", payerName: "Matheus" },
      { id: "w3t2", title: "Uber",        date: "Sáb, 15 Fev", amount: 28.00,  type: "expense" as const, category: "transport"  as const, payerId: "p2", payerName: "Amor"    },
    ],
  },
  {
    label: "4º Final de Semana", dates: "22–23 Fev", total: 89.50,
    transactions: [
      { id: "w4t1", title: "Lanche",      date: "Sáb, 22 Fev", amount: 65.00, type: "expense" as const, category: "food"      as const, payerId: "p1", payerName: "Matheus" },
      { id: "w4t2", title: "Uber",        date: "Dom, 23 Fev", amount: 24.50, type: "expense" as const, category: "transport" as const, payerId: "p2", payerName: "Amor"    },
    ],
  },
];

// Gasto desta semana (último final de semana = semana atual)
const currentWeekSpent = weekends[weekends.length - 1].total;

const allRecent: TransactionCardProps[] = [
  { id: "r1", title: "Lanche",                date: "Sáb, 22 Fev", amount: 89.90,  type: "expense", category: "food",      payerId: "p1", payerName: "Matheus" },
  { id: "r2", title: "Uber",                  date: "Dom, 23 Fev", amount: 24.50,  type: "expense", category: "transport", payerId: "p2", payerName: "Amor"    },
  { id: "r3", title: "Valor mensal resetado", date: "Sex, 21 Fev", amount: 600.00, type: "income",  category: "other",     payerId: "p1", payerName: "Casal"   },
];

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

export default function Home() {
  const [heroExpanded,    setHeroExpanded]    = useState(false);
  const [selectedTx,      setSelectedTx]      = useState<TransactionCardProps | null>(null);
  const [expandedWeekend, setExpandedWeekend] = useState<string | null>(null);

  const weekPct = Math.min((currentWeekSpent / WEEKLY_LIMIT) * 100, 100);

  return (
    <main className="flex flex-col min-h-screen bg-[#18181b] pb-24">

      {/* ─── Hero Section ───────────────────────────────── */}
      <section
        className={cn(
          "relative w-full bg-[#1c1c1f] px-6 pt-12 border-b border-orange-500/20",
          "shadow-[0_20px_50px_rgba(249,115,22,0.15)] z-10",
          "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          heroExpanded ? "rounded-b-[32px] pb-2" : "rounded-b-[40px] pb-8"
        )}
      >
        {/* Glow laranja */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-500/20 to-transparent rounded-b-[inherit] pointer-events-none transition-opacity duration-500",
            heroExpanded ? "opacity-0" : "opacity-100"
          )}
        />

        {/* ── Header: avatar → link para perfil + botão liquid "Ver mês" ── */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          {/* Avatar clicável → /profile */}
          <Link href="/profile" className="w-12 h-12 rounded-full bg-orange-500 border-2 border-white/10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="text-white font-bold">M</span>
          </Link>

          {/* Liquid button "Ver mês" — canto superior direito */}
          <button
            onClick={() => setHeroExpanded((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold",
              "border transition-all duration-300 active:scale-95",
              "backdrop-blur-md",
              heroExpanded
                ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white"
            )}
            style={{
              // Liquid shimmer no estado ativo
              boxShadow: heroExpanded
                ? "0 0 16px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <BarChart2 size={13} strokeWidth={2.5} />
            {heroExpanded ? "Ocultar" : "Ver mês"}
          </button>
        </div>

        {/* Valor central — gasto SEMANAL */}
        <div className="flex flex-col items-center justify-center relative z-10 mb-6">
          <span className="text-neutral-400 font-medium tracking-wide text-sm mb-1">Gasto desta semana</span>
          <div className="text-[52px] font-medium tracking-tight text-white flex items-baseline gap-1 leading-none">
            <span className="text-2xl text-neutral-400 mb-1">R$</span>
            {fmt(currentWeekSpent)}
          </div>
          <span className="text-neutral-500 text-xs font-semibold tracking-widest mt-2">
            LIMITE SEMANAL R$ {fmt(WEEKLY_LIMIT)}
          </span>
        </div>

        {/* Avatares + CTA */}
        <div className="flex flex-col items-center gap-5 relative z-10">
          {/* Pill */}
          <div className="flex items-center justify-center bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="flex -space-x-3">
              <div className="w-9 h-9 rounded-full border-2 border-[#1c1c1f] bg-orange-500 flex items-center justify-center z-20">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-[#1c1c1f] bg-purple-500 flex items-center justify-center z-10">
                <span className="text-white font-bold text-xs">A</span>
              </div>
            </div>
            <span className="text-white/80 font-semibold text-xs ml-3">
              {weekPct.toFixed(0)}% da semana
            </span>
          </div>

          {/* CTA Adicionar Gasto */}
          <Link
            href="/add"
            className="w-full relative flex items-center justify-center gap-2 overflow-hidden rounded-[18px] py-4 text-sm font-bold text-white active:scale-[0.97] transition-all duration-200 select-none"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
              boxShadow: "0 4px 0px #7c2d12, 0 8px 24px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <Plus size={18} strokeWidth={2.5} />
            Adicionar Gasto
          </Link>
        </div>

        {/* ── Painel expansível dos finais de semana ── */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            heroExpanded ? "max-h-[700px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
          )}
        >
          <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
            {/* Label de guia */}
            <p className="text-[11px] text-neutral-600 font-medium text-center mb-1">
              Clique em uma semana para ver os gastos
            </p>

            {weekends.map((wk, idx) => {
              const wkPct     = Math.min((wk.total / WEEKLY_LIMIT) * 100, 100);
              const isOpen    = expandedWeekend === wk.label;
              const isCurrent = idx === weekends.length - 1;
              return (
                <div key={wk.label}>
                  {/* Card clicável — mostra apenas o valor total */}
                  <button
                    onClick={() => setExpandedWeekend(isOpen ? null : wk.label)}
                    className="w-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 active:scale-[0.98] transition-all duration-200 text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-semibold text-white">{wk.label}</p>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[9px] font-bold uppercase tracking-wider border border-orange-500/20">
                              Atual
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500">{wk.dates}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-bold tabular-nums",
                          wkPct >= 100 ? "text-red-400" : wkPct >= 80 ? "text-amber-400" : "text-orange-300"
                        )}>
                          R$ {fmt(wk.total)}
                        </span>
                        <span className={cn(
                          "text-neutral-600 transition-transform duration-300 text-xs",
                          isOpen && "rotate-180"
                        )}>▾</span>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", wkPct >= 100 ? "bg-red-500" : "bg-gradient-to-r from-orange-400 to-orange-500")}
                        style={{ width: `${wkPct}%` }}
                      />
                    </div>
                  </button>

                  {/* Lista de transações — expande ao clicar no card */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isOpen ? "max-h-64 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
                  )}>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-4 py-3 flex flex-col gap-2">
                      {wk.transactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between">
                          <span className="text-[12px] text-neutral-400">{t.title}</span>
                          <span className="text-[12px] text-neutral-300 font-medium tabular-nums">− R$ {fmt(t.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Transações Recentes ───────────────────────── */}
      <div
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
          heroExpanded ? "opacity-0 max-h-0" : "opacity-100 max-h-[800px]"
        )}
      >
        <section className="px-6 pt-8 flex flex-col gap-3">
          <h2 className="text-[15px] font-semibold text-neutral-300 mb-1">Transações Recentes</h2>
          <div className="flex flex-col">
            {allRecent.map((tx) => (
              <TransactionCard key={tx.id} {...tx} onClick={() => setSelectedTx(tx)} />
            ))}
          </div>
        </section>
      </div>

      {/* ─── Modal de detalhe ──────────────────────────── */}
      <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </main>
  );
}
