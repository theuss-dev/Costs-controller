"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, Utensils, Car, Ticket, ShoppingBag, Receipt, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addTransaction } from "./actions";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  { id: "food",       icon: Utensils,    label: "Food"      },
  { id: "leisure",    icon: Ticket,      label: "Leisure"   },
  { id: "transport",  icon: Car,         label: "Transport" },
  { id: "groceries",  icon: ShoppingBag, label: "Groceries" },
  { id: "other",      icon: Receipt,     label: "Other"     },
];

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

  const [payer, setPayer] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => amountInputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [step]);

  const formatCurrency = (val: string) => {
    const numbers = val.replace(/\D/g, "");
    if (!numbers) return "";
    const amountVal = parseInt(numbers, 10) / 100;
    return amountVal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const amountNum = amount ? parseInt(amount.replace(/\D/g, ""), 10) / 100 : 0;
  const wouldExceed = amountNum > remainingLimit;
  const canSubmit = amountNum > 0;

  const goBack = () => {
    if (step === 1) router.push("/");
    else setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const selectedCategory = CATEGORIES.find(c => c.id === categoryId);
  const selectedAccount = accounts.find(a => a.id === payer);

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-[#121212] min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 shrink-0 relative z-10">
        <button 
          onClick={goBack} 
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-colors text-white"
        >
          {step === 1 ? <X size={20} /> : <ChevronLeft size={20} />}
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[#a1a1aa] text-[11px] font-bold tracking-[0.8px] uppercase">
            Step {step} of 3
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300", 
                  s === step ? "bg-[#10b981] w-4" : s < step ? "bg-[#10b981]/40" : "bg-white/10"
                )} 
              />
            ))}
          </div>
        </div>
        
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-hidden relative">
        
        {/* STEP 1: Who paid? */}
        <div className={cn(
          "absolute inset-0 flex flex-col px-6 pt-6 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]", 
          step === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
        )}>
          <h1 className="text-[24px] font-bold text-white tracking-[-0.5px] mb-8 text-center">
            Who paid for this expense?
          </h1>
          
          <div className="grid grid-cols-2 gap-4">
            {accounts.map((person) => {
              const isSelected = payer === person.id;
              return (
                <button
                  key={person.id}
                  onClick={() => setPayer(person.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-[24px] border-[1.87px] transition-all duration-200", 
                    isSelected ? "bg-[#242427] border-[#10b981]" : "bg-[#242427] border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="w-16 h-16 rounded-full bg-[#064e3b] flex items-center justify-center mb-3">
                    <span className="text-white font-bold text-[22px]">{person.initial}</span>
                  </div>
                  <span className="font-semibold text-white text-[15px]">{person.name.split(' ')[0]}</span>
                  
                  {/* Radio button indicator */}
                  <div className={cn(
                    "mt-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", 
                    isSelected ? "border-[#10b981] bg-[#10b981]" : "border-white/20"
                  )}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pb-8">
            <button 
              onClick={() => setStep(2)}
              disabled={!payer}
              className="w-full h-[56px] rounded-[16px] bg-[#059669] text-white font-bold text-[15px] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center shadow-[0px_4px_16px_rgba(5,150,105,0.3)]"
            >
              Continue &rarr;
            </button>
          </div>
        </div>

        {/* STEP 2: Category */}
        <div className={cn(
          "absolute inset-0 flex flex-col px-6 pt-6 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]", 
          step === 2 ? "opacity-100 translate-x-0" : step < 2 ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-0 -translate-x-8 pointer-events-none"
        )}>
          <h1 className="text-[24px] font-bold text-white tracking-[-0.5px] mb-8 text-center">
            What type of expense?
          </h1>
          
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = categoryId === cat.id;
              return (
                <button 
                  key={cat.id} 
                  onClick={() => setCategoryId(cat.id)} 
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 py-6 rounded-[20px] border-[1.87px] transition-all duration-200", 
                    isSelected ? "bg-[#242427] border-[#10b981]" : "bg-[#242427] border-white/5 hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors",
                    isSelected ? "bg-[#10b981]" : "bg-[#064e3b]"
                  )}>
                    <Icon className={isSelected ? "text-black" : "text-[#10b981]"} size={22} strokeWidth={2.5} />
                  </div>
                  <span className={cn(
                    "font-semibold text-[13px] transition-colors", 
                    isSelected ? "text-[#10b981]" : "text-white"
                  )}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-auto pb-8">
            <button 
              onClick={() => setStep(3)}
              disabled={!categoryId}
              className="w-full h-[56px] rounded-[16px] bg-[#059669] text-white font-bold text-[15px] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center shadow-[0px_4px_16px_rgba(5,150,105,0.3)]"
            >
              Continue &rarr;
            </button>
          </div>
        </div>

        {/* STEP 3: Amount */}
        <div className={cn(
          "absolute inset-0 flex flex-col px-6 pt-6 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]", 
          step === 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
        )}>
          <h1 className="text-[24px] font-bold text-white tracking-[-0.5px] mb-4 text-center">
            How much was spent?
          </h1>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#242427] border-[1.87px] border-white/5">
              {selectedCategory && (
                <selectedCategory.icon size={14} className="text-[#10b981]" />
              )}
              <span className="text-[#a1a1aa] text-[13px] font-medium">
                {selectedCategory?.label} • {selectedAccount?.name.split(' ')[0]}
              </span>
            </div>
          </div>

          <form action={addTransaction} onSubmit={() => setIsSubmitting(true)} className="flex flex-col flex-1 gap-4 min-h-0">
            <input type="hidden" name="payerId" value={payer || ""} />
            <input type="hidden" name="categoryId" value={categoryId || ""} />
            <input type="hidden" name="customCategory" value="" />
            <input type="hidden" name="exceedReason" value="Design simplificado" />
            
            <div className="flex flex-col items-center justify-center py-10 shrink-0">
              <span className="text-[#71717a] font-bold text-[16px] mb-2">R$</span>
              <input 
                ref={amountInputRef} 
                name="amount" 
                type="text" 
                inputMode="numeric" 
                placeholder="0,00" 
                value={amount} 
                onChange={(e) => setAmount(formatCurrency(e.target.value))} 
                className={cn(
                  "w-full bg-transparent text-center text-[56px] font-bold tracking-[-2px] outline-none placeholder:text-[#242427] transition-colors",
                  wouldExceed ? "text-red-500" : "text-white"
                )} 
              />
              
              <div className="h-6 mt-4">
                {wouldExceed && (
                  <p className="text-red-500 text-[13px] font-medium animate-in fade-in">
                    Exceeds your R$ {remainingLimit.toFixed(2).replace(".", ",")} available balance
                  </p>
                )}
              </div>
            </div>

            {/* Oculto, mas ainda envia a data de hoje por padrão */}
            <input type="hidden" name="date" value={new Date().toISOString().split('T')[0]} />

            <div className="mt-auto pb-8 shrink-0">
              <button 
                type="submit" 
                disabled={!canSubmit || isSubmitting} 
                className="relative w-full h-[56px] rounded-[16px] bg-[#059669] text-white font-bold text-[15px] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-30 shadow-[0px_4px_16px_rgba(5,150,105,0.3)]" 
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={18} strokeWidth={3} />
                    Confirm Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
