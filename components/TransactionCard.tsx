import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Coffee, Car, Utensils, ShoppingBag, type LucideIcon, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TransactionType = "expense" | "income";

export interface TransactionCardProps {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: "food" | "transport" | "restaurant" | "shopping" | "other";
  payerId: string;
  payerName: string;
  onClick?: () => void;
}

const categoryConfig: Record<string, { icon: LucideIcon; tint: string }> = {
  food:       { icon: Coffee,      tint: "text-orange-300" },
  transport:  { icon: Car,         tint: "text-orange-200" },
  restaurant: { icon: Utensils,    tint: "text-amber-300"  },
  shopping:   { icon: ShoppingBag, tint: "text-orange-400" },
  other:      { icon: ShoppingBag, tint: "text-orange-100" },
};

export default function TransactionCard({
  title, date, amount, type, category, payerName, onClick
}: TransactionCardProps) {
  const config = categoryConfig[category] || categoryConfig.other;
  const Icon = config.icon;
  const isIncome = type === "income";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // Glassmorphism base
        "w-full flex items-center justify-between p-4 mb-3 rounded-[24px]",
        "bg-white/[0.04] backdrop-blur-md border border-white/[0.07]",
        // Motion ao pressionar e soltar — escala + desvanece levemente
        "active:scale-[0.96] active:bg-white/[0.08] active:border-orange-500/20",
        "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "touch-manipulation text-left"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Ícone com estilo padronizado laranja translúcido */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20 shrink-0">
          <Icon className={config.tint} size={20} strokeWidth={2} />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold text-white tracking-tight leading-snug">{title}</span>
          <span className="text-xs text-neutral-400 font-medium">{date} • {payerName}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5 shrink-0 ml-2">
        <span className={cn(
          "text-base font-bold tracking-tight tabular-nums",
          isIncome ? "text-emerald-400" : "text-white"
        )}>
          {isIncome ? "+" : "-"} R$ {amount.toFixed(2).replace(".", ",")}
        </span>
        <div className={cn(
          "flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider",
          isIncome ? "text-emerald-500/70" : "text-neutral-500"
        )}>
          {isIncome ? <ArrowUpCircle size={10} /> : <ArrowDownCircle size={10} />}
          <span>{isIncome ? "Entrada" : "Saída"}</span>
        </div>
      </div>
    </button>
  );
}
