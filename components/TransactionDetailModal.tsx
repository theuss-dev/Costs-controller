"use client";

import { useEffect, useRef, useState } from "react";
import {
  X, Coffee, Car, Utensils, ShoppingBag,
  type LucideIcon, ArrowDownCircle, ArrowUpCircle,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type TransactionCardProps } from "./TransactionCard";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categoryConfig: Record<string, { icon: LucideIcon; label: string; tint: string }> = {
  food:       { icon: Coffee,      label: "Lanche",      tint: "text-orange-300" },
  transport:  { icon: Car,         label: "Uber",         tint: "text-orange-200" },
  restaurant: { icon: Utensils,    label: "Restaurante",  tint: "text-amber-300"  },
  shopping:   { icon: ShoppingBag, label: "Lazer",        tint: "text-orange-400" },
  other:      { icon: ShoppingBag, label: "Outro",        tint: "text-orange-100" },
};

interface Props {
  tx: TransactionCardProps | null;
  onClose: () => void;
}

export default function TransactionDetailModal({ tx, onClose }: Props) {
  // Guarda a última tx válida para continuar renderizando durante a animação de saída
  const lastTxRef = useRef<TransactionCardProps | null>(null);
  if (tx) lastTxRef.current = tx;

  const [show,    setShow]    = useState(false); // controla CSS visible
  const [mounted, setMounted] = useState(false); // controla se está no DOM

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (tx) {
      setMounted(true);
      // aguarda 1 frame de layout para a animação de entrada funcionar
      timer = setTimeout(() => setShow(true), 16);
    } else {
      setShow(false);
      // desmonta após a transição de saída (350ms)
      timer = setTimeout(() => {
        setMounted(false);
        lastTxRef.current = null;
      }, 380);
    }
    return () => clearTimeout(timer);
  }, [tx]);

  // Fecha no Escape
  useEffect(() => {
    if (!mounted) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mounted, onClose]);

  if (!mounted) return null;

  // Usa a última tx armazenada (segura durante a saída)
  const data     = lastTxRef.current!;
  const config   = categoryConfig[data.category] ?? categoryConfig.other;
  const Icon     = config.icon;
  const isIncome = data.type === "income";
  const payerBg  = data.payerName === "Matheus" ? "bg-orange-500" : "bg-purple-500";

  return (
    <>
      {/* ── Backdrop: apenas bg escuro, sem blur ── */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/70 z-[60]",
          "transition-opacity duration-300",
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* ── Bottom Sheet ── */}
      <div
        className={cn(
          "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[70]",
          "transition-[transform,opacity] duration-350 ease-[cubic-bezier(0.34,1.4,0.64,1)]",
          show ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0"
        )}
      >
        <div
          className="bg-[#1f1f22] border border-white/10 border-b-0 rounded-t-[32px] px-6 pt-5"
          style={{ paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))" }}
        >
          {/* Handle */}
          <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-5" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Detalhe do Gasto
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 active:scale-90 transition-transform text-neutral-400"
            >
              <X size={16} />
            </button>
          </div>

          {/* Ícone + título + valor */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 bg-orange-500/10 border border-orange-500/20">
              <Icon className={config.tint} size={28} strokeWidth={2} />
            </div>
            <p className="text-neutral-400 text-sm font-medium mb-1 text-center">{data.title}</p>
            <div className={cn(
              "text-4xl font-extrabold tracking-tighter tabular-nums",
              isIncome ? "text-emerald-400" : "text-white"
            )}>
              {isIncome ? "+" : "−"} R$ {data.amount.toFixed(2).replace(".", ",")}
            </div>
          </div>

          {/* Grid de detalhes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
              <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">Data</p>
              <p className="text-sm font-semibold text-white">{data.date}</p>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
              <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">Categoria</p>
              <p className="text-sm font-semibold text-white">{config.label}</p>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
              <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">Pago por</p>
              <div className="flex items-center gap-2">
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", payerBg)}>
                  <span className="text-white text-[9px] font-bold">{data.payerName[0]}</span>
                </div>
                <span className="text-sm font-semibold text-white">{data.payerName}</span>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
              <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">Tipo</p>
              <div className={cn(
                "flex items-center gap-1.5 text-sm font-semibold",
                isIncome ? "text-emerald-400" : "text-orange-300"
              )}>
                {isIncome ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                {isIncome ? "Entrada" : "Saída"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
