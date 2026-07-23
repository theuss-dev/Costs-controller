"use client";

import { useState } from "react";
import TransactionDetailModal from "@/components/TransactionDetailModal";
import WeekendDetailModal from "@/components/WeekendDetailModal";
import { type TransactionCardProps } from "@/components/TransactionCard";
import { Plus, Bell, Utensils, Car, Ticket, ShoppingBag, Receipt } from "lucide-react";
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
  householdNames?: string;
}

export default function HomeClient({
  currentWeekSpent,
  weeklyLimit,
  weekends,
  allRecent,
  userInitial,
  householdNames = "Você & Parceiro",
}: HomeClientProps) {
  const [selectedTx, setSelectedTx] = useState<TransactionCardProps | null>(null);
  const [selectedWeekend, setSelectedWeekend] = useState<WeekendData | null>(null);
  const [showWeekend, setShowWeekend] = useState(false);

  const handleOpenWeekend = (wk: WeekendData) => {
    setSelectedWeekend(wk);
    setShowWeekend(true);
  };

  const handleCloseWeekend = () => {
    setShowWeekend(false);
    setTimeout(() => setSelectedWeekend(null), 300);
  };

  const available = weeklyLimit - currentWeekSpent;
  const isOverLimit = available < 0;
  const absAvailable = Math.abs(available);
  const pctSpent = Math.min((currentWeekSpent / weeklyLimit) * 100, 100);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "food": return <Utensils size={18} className="text-[#10b981]" />;
      case "transport": return <Car size={18} className="text-[#10b981]" />;
      case "leisure": return <Ticket size={18} className="text-[#10b981]" />;
      case "groceries": return <ShoppingBag size={18} className="text-[#10b981]" />;
      default: return <Receipt size={18} className="text-[#10b981]" />;
    }
  };

  return (
    <main className="flex flex-1 flex-col bg-[#121212] min-h-screen pb-32">
      
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[#71717a] text-[13px] font-medium tracking-[0.2px]">Good morning</span>
          <h1 className="text-white text-[19px] font-bold tracking-[-0.5px]">{householdNames}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative">
            <Bell size={20} className="text-[#71717a]" />
            {/* Optional badge */}
            <span className="absolute top-0 right-1 w-2 h-2 bg-[#10b981] rounded-full border-2 border-[#121212]"></span>
          </button>
          <Link href="/profile" className="w-[38px] h-[38px] rounded-full bg-[#064e3b] flex items-center justify-center border-[1.5px] border-white/10 active:scale-95 transition-transform">
            <span className="text-white text-[13px] font-bold">{userInitial}</span>
          </Link>
        </div>
      </header>

      {/* Main Card */}
      <section className="px-6 mb-8">
        <div className="bg-[#242427] border-[1.87px] border-white/5 rounded-[16px] p-5 shadow-[0px_4px_24px_-8px_rgba(0,0,0,0.5)]">
          <p className="text-[#a1a1aa] text-[13px] font-medium mb-1">Available this Weekend</p>
          <h2 className={cn("text-[32px] font-bold tracking-[-1px] mb-4", isOverLimit ? "text-red-500" : "text-[#10b981]")}>
            {isOverLimit ? "- " : ""}R$ {fmt(absAvailable)}
          </h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-medium">
              <span className="text-[#71717a]">Spent: <span className="text-white">R$ {fmt(currentWeekSpent)}</span></span>
              <span className="text-[#71717a]">Limit: <span className="text-white">R$ {fmt(weeklyLimit)}</span></span>
            </div>
            <div className="h-1.5 w-full bg-[#1e1e21] rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-500", isOverLimit ? "bg-red-500" : "bg-[#10b981]")} 
                style={{ width: `${pctSpent}%` }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Previous Weekends (Horizontal Scroll) */}
      <section className="mb-8">
        <div className="px-6 mb-3">
          <h3 className="text-[#71717a] text-[11px] font-medium tracking-[0.8px] uppercase">Previous Weekends</h3>
        </div>
        <div className="flex overflow-x-auto gap-3 px-6 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {weekends.length === 0 && (
            <p className="text-[13px] text-[#71717a]">Nenhum final de semana registrado.</p>
          )}
          {weekends.map((wk) => {
            const wkAvailable = weeklyLimit - wk.total;
            const wkIsOverLimit = wkAvailable < 0;
            const wkPct = Math.min((wk.total / weeklyLimit) * 100, 100);
            const shortLabel = wk.label.replace('º Final de Semana', 'º Wknd').replace('1º', 'Wknd 1').replace('2º', 'Wknd 2').replace('3º', 'Wknd 3').replace('4º', 'Wknd 4');
            
            return (
              <div 
                key={wk.label} 
                onClick={() => handleOpenWeekend(wk)}
                className="flex-none w-[140px] bg-[#242427] border-[1.87px] border-white/5 rounded-[12px] p-3 snap-center cursor-pointer hover:border-white/10 transition-colors active:scale-95"
              >
                <p className="text-white text-[13px] font-semibold mb-1 truncate">{shortLabel}</p>
                <p className={cn("text-[15px] font-bold mb-3", wkIsOverLimit ? "text-red-500" : "text-[#10b981]")}>
                  {wkIsOverLimit ? "- " : ""}R$ {fmt(Math.abs(wkAvailable))}
                </p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[9px] font-medium">
                    <span className="text-[#71717a]">Spent</span>
                    <span className="text-white">{fmt(wk.total)}</span>
                  </div>
                  <div className="h-1 w-full bg-[#1e1e21] rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", wkIsOverLimit ? "bg-red-500" : "bg-[#10b981]")} 
                      style={{ width: `${wkPct}%` }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Expenses */}
      <section className="px-6 flex flex-col gap-3">
        <h3 className="text-[#71717a] text-[11px] font-medium tracking-[0.8px] uppercase">Recent Expenses</h3>
        <div className="flex flex-col gap-2">
          {allRecent.length === 0 && (
            <p className="text-[13px] text-[#71717a]">Sem transações recentes.</p>
          )}
          {allRecent.map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => setSelectedTx(tx)}
              className="flex items-center justify-between p-4 bg-[#242427] border-[1.87px] border-white/5 rounded-[16px] cursor-pointer hover:border-white/10 transition-colors active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-[10px] bg-[#064e3b] flex items-center justify-center shrink-0">
                  {getCategoryIcon(tx.category)}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[14px] font-semibold">{tx.title}</span>
                  <span className="text-[#71717a] text-[12px]">{tx.category || "Outros"} • {tx.payerName}</span>
                </div>
              </div>
              <span className="text-white text-[14px] font-bold tracking-[-0.2px]">
                − R$ {fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FAB - Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <Link 
          href="/add"
          className="w-14 h-14 bg-[#059669] rounded-full flex items-center justify-center shadow-[0px_4px_16px_rgba(5,150,105,0.5)] hover:bg-[#047857] active:scale-95 transition-all"
        >
          <Plus size={24} className="text-white" strokeWidth={2.5} />
        </Link>
      </div>

      <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      <WeekendDetailModal weekend={selectedWeekend} isOpen={showWeekend} weeklyLimit={weeklyLimit} onClose={handleCloseWeekend} />
    </main>
  );
}
