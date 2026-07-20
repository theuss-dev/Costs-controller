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

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

export interface WeekendData {
  label: string;
  dates: string;
  total: number;
  isCurrent?: boolean;
  transactions: TransactionCardProps[];
}

interface HomeClientProps {
  currentWeekSpent: number;
  weeklyLimit: number;
  weekends: WeekendData[];
  allRecent: TransactionCardProps[];
  userInitial: string;
}

export default function HomeClient({
  currentWeekSpent,
  weeklyLimit,
  weekends,
  allRecent,
  userInitial,
}: HomeClientProps) {
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionCardProps | null>(null);
  const [expandedWeekend, setExpandedWeekend] = useState<string | null>(null);

  const weekPct = Math.min((currentWeekSpent / weeklyLimit) * 100, 100);

  return (
    <main className="flex flex-1 flex-col bg-[#18181b] pb-24">
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

        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <Link href="/profile" className="w-12 h-12 rounded-full bg-orange-500 border-2 border-white/10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="text-white font-bold">{userInitial}</span>
          </Link>

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
              boxShadow: heroExpanded
                ? "0 0 16px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <BarChart2 size={13} strokeWidth={2.5} />
            {heroExpanded ? "Ocultar" : "Ver mês"}
          </button>
        </div>

        {/* Valor central */}
        <div className="flex flex-col items-center justify-center relative z-10 mb-6">
          <span className="text-neutral-400 font-medium tracking-wide text-sm mb-1">Gasto desta semana</span>
          <div className="text-[52px] font-medium tracking-tight text-white flex items-baseline gap-1 leading-none">
            <span className="text-2xl text-neutral-400 mb-1">R$</span>
            {fmt(currentWeekSpent)}
          </div>
          <span className="text-neutral-500 text-xs font-semibold tracking-widest mt-2">
            LIMITE SEMANAL R$ {fmt(weeklyLimit)}
          </span>
        </div>

        {/* Avatares + CTA */}
        <div className="flex flex-col items-center gap-5 relative z-10">
          <div className="flex items-center justify-center bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="text-white/80 font-semibold text-xs">
              {weekPct.toFixed(0)}% da semana
            </span>
          </div>

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
            <p className="text-[11px] text-neutral-600 font-medium text-center mb-1">
              Clique em uma semana para ver os gastos
            </p>
            {weekends.length === 0 && (
              <p className="text-center text-sm text-neutral-500 py-4">Nenhum gasto este mês ainda.</p>
            )}
            {weekends.map((wk, idx) => {
              const wkPct = Math.min((wk.total / weeklyLimit) * 100, 100);
              const isOpen = expandedWeekend === wk.label;
              const isCurrent = wk.isCurrent;
              return (
                <div key={wk.label}>
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

                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isOpen ? "max-h-64 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
                  )}>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-4 py-3 flex flex-col gap-2">
                      {wk.transactions.length > 0 ? (
                        wk.transactions.map((t) => (
                          <div key={t.id} className="flex items-center justify-between">
                            <span className="text-[12px] text-neutral-400">{t.title}</span>
                            <span className="text-[12px] text-neutral-300 font-medium tabular-nums">− R$ {fmt(t.amount)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[12px] text-neutral-500 text-center py-2">Sem gastos neste final de semana.</p>
                      )}
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
            {allRecent.length === 0 && (
              <p className="text-sm text-neutral-500">Sem transações recentes.</p>
            )}
            {allRecent.map((tx) => (
              <TransactionCard key={tx.id} {...tx} onClick={() => setSelectedTx(tx)} />
            ))}
          </div>
        </section>
      </div>

      <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </main>
  );
}
