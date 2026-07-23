"use client";

import { X, Utensils, Car, Ticket, ShoppingBag, Receipt } from "lucide-react";
import { type TransactionCardProps } from "@/components/TransactionCard";
import { type WeekendData } from "@/app/home-client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

interface WeekendDetailModalProps {
  weekend: WeekendData | null;
  isOpen: boolean;
  weeklyLimit: number;
  onClose: () => void;
}

export default function WeekendDetailModal({ weekend, isOpen, weeklyLimit, onClose }: WeekendDetailModalProps) {
  if (!weekend) return null;

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "food": return <Utensils size={18} className="text-[#10b981]" />;
      case "transport": return <Car size={18} className="text-[#10b981]" />;
      case "leisure": return <Ticket size={18} className="text-[#10b981]" />;
      case "groceries": return <ShoppingBag size={18} className="text-[#10b981]" />;
      default: return <Receipt size={18} className="text-[#10b981]" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "food": return "bg-emerald-500";
      case "transport": return "bg-blue-500";
      case "leisure": return "bg-purple-500";
      case "groceries": return "bg-orange-500";
      default: return "bg-neutral-500";
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "food": return "Food";
      case "transport": return "Transport";
      case "leisure": return "Leisure";
      case "groceries": return "Groceries";
      default: return "Outros";
    }
  };

  const available = weeklyLimit - weekend.total;
  const isOverLimit = available < 0;
  const absAvailable = Math.abs(available);
  const pctSpent = Math.min((weekend.total / weeklyLimit) * 100, 100);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  weekend.transactions.forEach((tx) => {
    const cat = tx.category || "other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amount;
  });

  const categories = Object.keys(categoryTotals).map(cat => ({
    id: cat,
    label: getCategoryLabel(cat),
    amount: categoryTotals[cat],
    color: getCategoryColor(cat),
    pct: Math.min((categoryTotals[cat] / weekend.total) * 100, 100)
  })).sort((a, b) => b.amount - a.amount);

  const shortLabel = weekend.label
    .replace('º Final de Semana', 'º Wknd')
    .replace('1º', 'Wknd 1')
    .replace('2º', 'Wknd 2')
    .replace('3º', 'Wknd 3')
    .replace('4º', 'Wknd 4');

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-end justify-center backdrop-blur-sm transition-all duration-300",
      isOpen ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0 pointer-events-none"
    )}>
      <div 
        className={cn(
          "w-full max-h-[90vh] overflow-y-auto bg-[#121212] rounded-t-[24px] pt-4 pb-8 transition-transform duration-300",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ boxShadow: "0 -10px 40px rgba(0,0,0,0.5)" }}
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>
        
        <div className="px-6 flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[#71717a] text-[11px] font-medium tracking-[0.8px] uppercase">Weekend Summary</span>
            <h2 className="text-white text-xl font-bold">{shortLabel}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white active:scale-95 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 mb-8">
          <div className="bg-[#242427] border-[1.87px] border-white/5 rounded-[16px] p-5 shadow-[0px_4px_24px_-8px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[#a1a1aa] text-[12px] font-medium mb-1">Final spend</p>
                <h3 className="text-[28px] font-bold tracking-[-1px] text-white">R$ {fmt(weekend.total)}</h3>
              </div>
              <div className="text-right">
                <p className="text-[#71717a] text-[11px] font-medium mb-0.5">Weekend limit</p>
                <p className="text-[#a1a1aa] text-[14px] font-semibold">R$ {fmt(weeklyLimit)}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="h-1.5 w-full bg-[#1e1e21] rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", isOverLimit ? "bg-red-500" : "bg-[#10b981]")} 
                  style={{ width: `${pctSpent}%` }} 
                />
              </div>
              <span className={cn("text-[11px] font-medium", isOverLimit ? "text-red-400" : "text-[#10b981]")}>
                {isOverLimit ? "R$ " + fmt(absAvailable) + " over limit" : "R$ " + fmt(absAvailable) + " remaining"}
              </span>
            </div>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="px-6 mb-8">
            <h3 className="text-[#71717a] text-[11px] font-medium tracking-[0.8px] uppercase mb-4">By Category</h3>
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 w-1/3">
                    <div className="w-[32px] h-[32px] rounded-[8px] bg-white/5 flex items-center justify-center shrink-0">
                      {getCategoryIcon(cat.id === "other" ? undefined : cat.id)}
                    </div>
                    <span className="text-white text-[13px] font-medium">{cat.label}</span>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                  <span className="text-white text-[13px] font-semibold tabular-nums w-1/4 text-right">R$ {fmt(cat.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 flex flex-col gap-3">
          <h3 className="text-[#71717a] text-[11px] font-medium tracking-[0.8px] uppercase">All Expenses</h3>
          <div className="flex flex-col gap-2">
            {weekend.transactions.length === 0 && (
              <p className="text-[13px] text-[#71717a]">Nenhuma transação registrada.</p>
            )}
            {weekend.transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-4 bg-[#242427] border-[1.87px] border-white/5 rounded-[16px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[42px] h-[42px] rounded-[10px] bg-[#064e3b] flex items-center justify-center shrink-0">
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[14px] font-semibold">{tx.title}</span>
                    <span className="text-[#71717a] text-[12px]">{getCategoryLabel(tx.category)} • {tx.payerName}</span>
                  </div>
                </div>
                <span className="text-white text-[14px] font-bold tracking-[-0.2px]">
                  − R$ {fmt(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
