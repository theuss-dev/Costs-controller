"use client";

import { useState } from "react";
import { createHousehold, acceptInvite } from "./actions";
import { logout } from "@/app/profile/actions";
import { Users, Mail, ArrowRight, LogOut, ChevronLeft, Inbox } from "lucide-react";

export default function OnboardingClient({ invites, userEmail }: { invites: any[], userEmail: string }) {
  const [mode, setMode] = useState<"choose" | "create">("choose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [myContribStr, setMyContribStr] = useState("");
  const [partnerContribStr, setPartnerContribStr] = useState("");

  const formatCurrency = (val: string) => {
    const numbers = val.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = parseInt(numbers, 10) / 100;
    return amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getRawValue = (str: string) => {
    const numbers = str.replace(/\D/g, "");
    return numbers ? (parseInt(numbers, 10) / 100).toFixed(2) : "";
  };

  const handleLogout = async () => {
    setLoading(true);
    await logout();
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createHousehold(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  const handleAccept = async (inviteId: string) => {
    setLoading(true);
    const res = await acceptInvite(inviteId);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#18181b] p-6 relative overflow-hidden">
      {/* Sair do App */}
      <button 
        onClick={handleLogout}
        disabled={loading}
        className="absolute top-6 right-6 flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
      >
        Sair
        <LogOut size={16} />
      </button>

      {/* Voltar (Top Left) */}
      {mode === "create" && (
        <button 
          type="button"
          onClick={() => setMode("choose")}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-all active:scale-95 shadow-md"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center mt-8">
          <h1 className="text-3xl font-medium text-white tracking-tight mb-2">Bem-vindo(a)</h1>
          <p className="text-neutral-500 text-sm">Configure seu casal para começar</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        {mode === "choose" && (
          <div className="flex flex-col gap-8">
            
            {/* Secção: Convites Recebidos */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Caixa de Convites</p>
              
              {invites.length > 0 ? (
                invites.map((inv) => (
                  <div key={inv.id} className="flex flex-col gap-3 p-5 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                        <Mail size={20} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{inv.account?.name || 'Seu parceiro(a)'} te convidou</p>
                        <p className="text-neutral-500 text-xs mt-0.5">Sua contribuição: R$ {Number(inv.partner_contribution).toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAccept(inv.id)}
                      disabled={loading}
                      className="w-full mt-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg disabled:opacity-50"
                    >
                      Aceitar Convite
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center border-dashed">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Inbox size={20} className="text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm font-medium">Nenhum convite recebido</p>
                    <p className="text-neutral-600 text-xs mt-1">Quando alguém te convidar, aparecerá aqui.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Secção: Criar Novo Casal */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Ou crie o seu</p>
              <button
                onClick={() => setMode("create")}
                className="w-full flex items-center justify-between p-5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-3xl transition-all active:scale-[0.98] group shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users size={20} className="text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-semibold">Configurar Novo Casal</p>
                    <p className="text-neutral-500 text-xs mt-0.5">Defina o teto e convide seu amor</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-neutral-600 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        )}

        {mode === "create" && (
          <form onSubmit={handleCreate} className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="flex flex-col gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-3xl">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-300">Sua contribuição mensal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">R$</span>
                  <input type="hidden" name="myContrib" value={getRawValue(myContribStr)} />
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    required 
                    value={myContribStr}
                    onChange={(e) => setMyContribStr(formatCurrency(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white focus:border-orange-500/50 transition-colors text-base" 
                    placeholder="0,00" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-medium text-neutral-300">Contribuição do parceiro(a)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">R$</span>
                  <input type="hidden" name="partnerContrib" value={getRawValue(partnerContribStr)} />
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    required 
                    value={partnerContribStr}
                    onChange={(e) => setPartnerContribStr(formatCurrency(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white focus:border-orange-500/50 transition-colors text-base" 
                    placeholder="0,00" 
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">O teto mensal do casal será a soma automática das duas contribuições.</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-1">
              <label className="text-sm font-medium text-neutral-300">E-mail do parceiro(a)</label>
              <input 
                type="email" 
                name="partnerEmail" 
                required 
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-orange-500/50 transition-colors text-base" 
                placeholder="amor@email.com" 
              />
              <p className="text-[11px] text-neutral-500 mt-1">Ele(a) verá o convite ao criar a conta no app.</p>
            </div>

            <button 
              disabled={loading || !myContribStr || !partnerContribStr} 
              type="submit" 
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(249,115,22,0.3)] disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
            >
              {loading ? "Criando..." : "Criar Casal"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
