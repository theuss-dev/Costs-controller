"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Coffee, Car, Utensils, ShoppingBag, Edit3, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addTransaction } from "./actions";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  { id: "food",       icon: Coffee,      label: "Lanche"      },
  { id: "restaurant", icon: Utensils,    label: "Restaurante" },
  { id: "transport",  icon: Car,         label: "Uber"        },
  { id: "shopping",   icon: ShoppingBag, label: "Lazer"       },
  { id: "other",      icon: Edit3,       label: "Outro"       },
];

const EXCEED_REASONS = [
  "Evento especial / comemoração",
  "Emergência / imprevisto",
  "Compensando semana passada",
  "Decidimos aumentar o teto desta semana",
];

const glassCard       = "bg-white/[0.04] backdrop-blur-md border border-white/[0.08]";
const glassCardActive = "bg-white/[0.08] border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.12)]";

interface Account {
  id: string;
  name: string;
  color: string;
  initial: string;
}

interface AddClientProps {
  accounts: Account[];
  weeklyLimit: number;
  remainingLimit: number;
}

export default function AddClient({ accounts, weeklyLimit, remainingLimit }: AddClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [payer,          setPayer]          = useState<string | null>(null);
  const [categoryId,     setCategoryId]     = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [amount,         setAmount]         = useState("");
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [exceedEnabled,  setExceedEnabled]  = useState(false);
  const [exceedReason,   setExceedReason]   = useState("");
  const [customReason,   setCustomReason]   = useState("");

  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => amountInputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [step]);

  const amountNum     = parseFloat(amount.replace(",", ".")) || 0;
  const wouldExceed   = amountNum > remainingLimit;
  const exceedsWeekly = amountNum > weeklyLimit;
  const canSubmit     = amountNum > 0 && (!wouldExceed || (exceedEnabled && (exceedReason || customReason)));

  const handlePayerSelect = (id: string) => {
    setPayer(id);
    setTimeout(() => setStep(2), 280);
  };

  const handleCategorySelect = (id: string) => {
    setCategoryId(id);
    if (id !== "other") setTimeout(() => setStep(3), 280);
  };

  const handleCustomCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCategory.trim()) setStep(3);
  };

  const goBack = () => {
    if (step === 1) router.push("/");
    else setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-[#18181b]">
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 active:scale-95 transition-transform text-white">
          <ChevronLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn("rounded-full transition-all duration-300", s === step ? "w-5 h-2 bg-orange-500" : s < step ? "w-2 h-2 bg-orange-500/40" : "w-2 h-2 bg-white/10")} />
          ))}
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-hidden relative">
        {/* STEP 1 */}
        <div className={cn("absolute inset-0 flex flex-col px-6 pt-7 pb-6 transition-all duration-350", step === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none")}>
          <h1 className="text-3xl font-medium text-white tracking-tight mb-1">Quem pagou?</h1>
          <p className="text-neutral-500 text-sm mb-6">Selecione quem realizou o pagamento.</p>
          <div className="flex flex-col gap-4">
            {accounts.map((person) => (
              <button
                key={person.id}
                onClick={() => handlePayerSelect(person.id)}
                className={cn("flex items-center justify-between p-5 rounded-3xl border transition-all duration-250 active:scale-[0.98]", payer === person.id ? cn(glassCardActive, `border-orange-500/50`) : glassCard)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#18181b]", person.color)}>
                    <span className="text-white font-bold text-lg">{person.initial}</span>
                  </div>
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-semibold text-white text-lg">{person.name}</span>
                  </div>
                </div>
                <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", payer === person.id ? "border-orange-500 bg-orange-500" : "border-neutral-700")}>
                  {payer === person.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2 */}
        <div className={cn("absolute inset-0 flex flex-col px-6 pt-7 pb-6 transition-all duration-350", step === 2 ? "opacity-100 translate-x-0" : step < 2 ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-0 -translate-x-8 pointer-events-none")}>
          <h1 className="text-3xl font-medium text-white tracking-tight mb-1">Qual a categoria?</h1>
          <p className="text-neutral-500 text-sm mb-5">Ajuda a organizar o histórico do casal.</p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = categoryId === cat.id;
              return (
                <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={cn("flex flex-col items-center justify-center gap-3 py-5 rounded-3xl border transition-all duration-250 active:scale-[0.98]", isSelected ? glassCardActive : glassCard)}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20">
                    <Icon className="text-orange-300" size={22} strokeWidth={2} />
                  </div>
                  <span className={cn("font-medium text-sm", isSelected ? "text-white" : "text-neutral-400")}>{cat.label}</span>
                </button>
              );
            })}
          </div>
          {categoryId === "other" && (
            <form onSubmit={handleCustomCategorySubmit} className="mt-4 flex gap-2">
              <input type="text" placeholder="Ex: Farmácia, Presente…" autoFocus value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="flex-1 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-neutral-600 outline-none focus:border-orange-500/40 transition-colors text-sm" />
              <button type="submit" disabled={!customCategory.trim()} className="bg-orange-500 text-white p-3 rounded-2xl disabled:opacity-40 active:scale-95"><ArrowRight size={20} /></button>
            </form>
          )}
        </div>

        {/* STEP 3 */}
        <div className={cn("absolute inset-0 flex flex-col px-6 pt-7 pb-6 transition-all duration-350", step === 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none")}>
          <h1 className="text-3xl font-medium text-white tracking-tight mb-1">Qual o valor?</h1>
          <p className="text-neutral-500 text-sm mb-5">
            Disponível: <span className="text-white font-semibold">R$ {remainingLimit.toFixed(2).replace(".", ",")}</span>
          </p>

          <form action={addTransaction} onSubmit={() => setIsSubmitting(true)} className="flex flex-col flex-1 gap-4 min-h-0">
            <input type="hidden" name="payerId" value={payer || ""} />
            <input type="hidden" name="categoryId" value={categoryId || ""} />
            <input type="hidden" name="customCategory" value={customCategory} />
            <input type="hidden" name="exceedReason" value={exceedReason} />
            <input type="hidden" name="customReason" value={customReason} />

            <div className={cn("flex flex-col items-center justify-center py-5 rounded-3xl shrink-0", glassCard, wouldExceed && !exceedEnabled && "border-red-500/30")}>
              <span className="text-neutral-500 font-bold text-base mb-1">R$</span>
              <input ref={amountInputRef} name="amount" type="number" inputMode="decimal" step="0.01" min="0.01" placeholder="0,00" value={amount} onChange={(e) => { const val = e.target.value; const dotIdx = val.indexOf("."); if (dotIdx !== -1 && val.length - dotIdx > 3) return; setAmount(val); }} className="w-full bg-transparent text-center text-[58px] font-extrabold tracking-tighter text-white outline-none placeholder:text-neutral-800 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              
              {wouldExceed && (
                <div className={cn("flex items-center gap-2 mt-2 text-xs font-semibold px-3 py-1.5 rounded-full", exceedEnabled ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20")}>
                  <AlertTriangle size={12} />
                  {exceedEnabled ? "Teto excedido — justificativa ativa" : `Excede o saldo (R$ ${remainingLimit.toFixed(2).replace(".", ",")})`}
                </div>
              )}
              {exceedsWeekly && !wouldExceed && (
                <div className="flex items-center gap-2 mt-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <AlertTriangle size={12} />
                  Acima do limite semanal (R$ {weeklyLimit.toFixed(0)})
                </div>
              )}
            </div>

            {wouldExceed && (
              <div className={cn("flex flex-col gap-3 p-4 rounded-3xl border shrink-0", glassCard)}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-white">Autorizar excedente</span>
                    <p className="text-xs text-neutral-500">Exige justificativa</p>
                  </div>
                  <button type="button" onClick={() => setExceedEnabled((v) => !v)} className={cn("relative w-11 h-6 rounded-full transition-colors duration-300", exceedEnabled ? "bg-orange-500" : "bg-white/10")}>
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300", exceedEnabled ? "left-6" : "left-1")} />
                  </button>
                </div>
                {exceedEnabled && (
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Motivo</p>
                    <div className="grid grid-cols-2 gap-2">
                      {EXCEED_REASONS.map((reason) => (
                        <button key={reason} type="button" onClick={() => { setExceedReason(reason); setCustomReason(""); }} className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs transition-all text-left", exceedReason === reason ? "bg-orange-500/10 border-orange-500/30 text-white" : "bg-white/[0.02] border-white/5 text-neutral-400")}>
                          {exceedReason === reason && <CheckCircle2 size={12} className="text-orange-500 shrink-0" />}
                          {reason}
                        </button>
                      ))}
                    </div>
                    <input type="text" placeholder="Ou descreva outro motivo…" value={customReason} onChange={(e) => { setCustomReason(e.target.value); setExceedReason(""); }} className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs placeholder:text-neutral-600 outline-none focus:border-orange-500/40 transition-colors" />
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto shrink-0">
              <button type="submit" disabled={!canSubmit || isSubmitting} className="relative w-full h-[56px] rounded-[18px] overflow-hidden text-white font-bold text-[15px] active:scale-[0.97] transition-all duration-200 flex items-center justify-center disabled:opacity-40 disabled:active:scale-100" style={{ background: canSubmit ? "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)" : "rgba(255,255,255,0.06)", boxShadow: canSubmit ? "0 4px 0px #7c2d12, 0 8px 24px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.15)" : "none" }}>
                {canSubmit && <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />}
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : wouldExceed && !exceedEnabled ? "Selecione a justificativa" : "Confirmar Gasto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
