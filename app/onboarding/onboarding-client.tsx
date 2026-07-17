"use client";

import { useState } from "react";
import { createHousehold, acceptInvite } from "./actions";
import { Users, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OnboardingClient({ invites, userEmail }: { invites: any[], userEmail: string }) {
  const [mode, setMode] = useState<"choose" | "create">("choose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#18181b] p-6 relative">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-medium text-white tracking-tight mb-2">Bem-vindo(a)</h1>
          <p className="text-neutral-500 text-sm">Configure seu casal para começar</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        {mode === "choose" && (
          <div className="flex flex-col gap-6">
            {/* Convites Recebidos */}
            {invites.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Convites Recebidos</p>
                {invites.map((inv) => (
                  <div key={inv.id} className="flex flex-col gap-3 p-4 bg-white/[0.04] border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Mail size={18} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{inv.account?.name || 'Seu parceiro(a)'} te convidou</p>
                        <p className="text-neutral-500 text-xs">Sua contribuição: R$ {Number(inv.partner_contribution).toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAccept(inv.id)}
                      disabled={loading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                    >
                      Aceitar Convite
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Ou crie o seu</p>
              <button
                onClick={() => setMode("create")}
                className="w-full flex items-center justify-between p-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Users size={18} className="text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-semibold">Configurar Novo Casal</p>
                    <p className="text-neutral-500 text-xs">Defina o teto e convide seu amor</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-neutral-500" />
              </button>
            </div>
          </div>
        )}

        {mode === "create" && (
          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-3xl">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-300">Sua contribuição mensal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">R$</span>
                  <input type="number" name="myContrib" required step="0.01" className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-orange-500/50 transition-colors" placeholder="0,00" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-300">Contribuição do parceiro(a)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">R$</span>
                  <input type="number" name="partnerContrib" required step="0.01" className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-orange-500/50 transition-colors" placeholder="0,00" />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">O teto mensal do casal será a soma das duas contribuições.</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-300">E-mail do parceiro(a) <span className="text-neutral-500 text-xs font-normal">(Opcional)</span></label>
              <input type="email" name="partnerEmail" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500/50 transition-colors" placeholder="amor@email.com" />
              <p className="text-[11px] text-neutral-500">Ele(a) verá o convite ao criar a conta no app.</p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50">
                {loading ? "Salvando..." : "Criar Casal"}
              </button>
              <button type="button" onClick={() => setMode("choose")} className="w-full text-center text-neutral-400 text-sm py-2">
                Voltar
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
