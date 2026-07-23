"use client";

import { useState } from "react";
import { createHousehold, acceptInvite } from "./actions";
import { logout } from "@/app/profile/actions";
import { LogOut, Inbox, Mail, HeartHandshake, FilePlus } from "lucide-react";

export default function OnboardingClient({ invites, userEmail }: { invites: any[], userEmail: string }) {
  const [mode, setMode] = useState<"choose" | "create">("choose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [myContribStr, setMyContribStr] = useState("");
  const [partnerContribStr, setPartnerContribStr] = useState("");

  const formatCurrency = (val: string) => {
    // Apenas permite números e uma vírgula
    let clean = val.replace(/[^\d,]/g, "");
    // Evita múltiplas vírgulas
    const parts = clean.split(",");
    if (parts.length > 2) {
      clean = parts[0] + "," + parts.slice(1).join("");
    }
    return clean;
  };

  const getRawValue = (str: string) => {
    if (!str) return "0";
    const numeric = str.replace(",", ".");
    return numeric;
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

  const totalMonthly = (parseFloat(getRawValue(myContribStr)) || 0) + (parseFloat(getRawValue(partnerContribStr)) || 0);
  const weeklyEstimate = totalMonthly / 4;

  const formatDisplayCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-start pt-24 bg-[#121212] p-6 relative min-h-screen">
      {/* Logout */}
      <button 
        onClick={handleLogout}
        disabled={loading}
        className="absolute top-6 right-6 flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
      >
        Logout
        <LogOut size={16} />
      </button>

      <div className="w-full max-w-[400px] flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-[28px] font-bold text-white tracking-[-0.5px] leading-tight">
            Set up your couple
          </h1>
          <p className="text-[#71717a] text-[13px] font-normal leading-[19.5px]">
            Choose how you want to start tracking together
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-[13px] font-semibold px-4 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          
          {/* Join a Couple Accordion */}
          <div 
            className={`flex flex-col rounded-[16px] transition-all overflow-hidden ${mode === 'choose' ? 'bg-[#242427] border-[1.87px] border-[#059669]/40 shadow-[0px_2px_8px_rgba(0,0,0,0.45)]' : 'bg-[#242427] border-[1.87px] border-white/5 cursor-pointer hover:border-white/10'}`}
          >
            {/* Header */}
            <div 
              className="flex items-center gap-3 p-4 select-none"
              onClick={() => setMode("choose")}
            >
              <div className="bg-[#064e3b] w-[40px] h-[40px] rounded-[8px] flex items-center justify-center shrink-0">
                <HeartHandshake size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white text-[15px] font-semibold leading-[22.5px]">Join a Couple</h3>
                <p className="text-[#71717a] text-[11px] leading-[16.5px]">Accept an invitation from your partner</p>
              </div>
            </div>

            {/* Body */}
            <div className={`grid transition-all duration-300 ease-in-out ${mode === 'choose' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="border-t-[1.87px] border-white/5 p-4 flex flex-col gap-3">
                  {invites.length > 0 ? (
                    invites.map((inv) => (
                      <div key={inv.id} className="flex flex-col gap-3 p-4 bg-[#1e1e21] border border-white/10 rounded-[8px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#059669]/20 border border-[#059669]/30 flex items-center justify-center shrink-0">
                            <Mail size={16} className="text-[#10b981]" />
                          </div>
                          <div>
                            <p className="text-white text-[13px] font-medium">{inv.account?.name || 'Seu parceiro(a)'} te convidou</p>
                            <p className="text-[#71717a] text-[11px] mt-0.5">Sua contribuição: {formatDisplayCurrency(Number(inv.partner_contribution))}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAccept(inv.id)}
                          disabled={loading}
                          className="w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold text-[13px] py-3 rounded-[8px] transition-colors disabled:opacity-50"
                        >
                          Accept Invitation
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-6 bg-[#1e1e21] border border-white/5 rounded-[8px] border-dashed text-center">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Inbox size={16} className="text-neutral-500" />
                      </div>
                      <div>
                        <p className="text-[#a1a1aa] text-[13px] font-medium">Nenhum convite recebido</p>
                        <p className="text-[#71717a] text-[11px] mt-0.5">Quando alguém te convidar, aparecerá aqui.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Create my Couple Accordion */}
          <div 
            className={`flex flex-col rounded-[16px] transition-all overflow-hidden ${mode === 'create' ? 'bg-[#242427] border-[1.87px] border-[#059669]/40 shadow-[0px_2px_8px_rgba(0,0,0,0.45)]' : 'bg-[#242427] border-[1.87px] border-white/5 cursor-pointer hover:border-white/10'}`}
          >
            {/* Header */}
            <div 
              className="flex items-center gap-3 p-4 select-none"
              onClick={() => setMode("create")}
            >
              <div className="bg-[#064e3b] w-[40px] h-[40px] rounded-[8px] flex items-center justify-center shrink-0">
                <FilePlus size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white text-[15px] font-semibold leading-[22.5px]">Create my Couple</h3>
                <p className="text-[#71717a] text-[11px] leading-[16.5px]">Set contributions and start tracking</p>
              </div>
            </div>

            {/* Body */}
            <div className={`grid transition-all duration-300 ease-in-out ${mode === 'create' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="border-t-[1.87px] border-white/5 p-4">
                  <form onSubmit={handleCreate} className="flex flex-col gap-4">
                    
                    {/* Invite Partner */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[#a1a1aa] text-[11px] font-medium tracking-[0.2px] mb-1">
                        Invite your partner
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          name="partnerEmail" 
                          required 
                          className="flex-1 bg-[#1e1e21] border-[1.87px] border-white/5 rounded-[8px] px-3 py-3 text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#10b981]/50 transition-colors h-[45px]" 
                          placeholder="partner@email.com" 
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2 my-2">
                      <div className="flex-1 h-px bg-white/5"></div>
                      <span className="text-[#71717a] text-[11px] font-medium tracking-[0.6px] uppercase">Contributions</span>
                      <div className="flex-1 h-px bg-white/5"></div>
                    </div>

                    {/* Contributions Inputs */}
                    <div className="flex gap-2">
                      <div className="flex flex-col gap-1 flex-1">
                        <label className="text-[#a1a1aa] text-[11px] font-medium tracking-[0.2px] mb-1">My Contribution</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-[13px] font-medium">R$</span>
                          <input type="hidden" name="myContrib" value={getRawValue(myContribStr)} />
                          <input 
                            type="text" 
                            inputMode="decimal" 
                            required 
                            value={myContribStr}
                            onChange={(e) => setMyContribStr(formatCurrency(e.target.value))}
                            className="w-full bg-[#1e1e21] border-[1.87px] border-white/5 rounded-[8px] pl-9 pr-3 py-3 text-[15px] font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-[#10b981]/50 transition-colors h-[45px]" 
                            placeholder="0,00" 
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <label className="text-[#a1a1aa] text-[11px] font-medium tracking-[0.2px] mb-1">Partner&apos;s Contribution</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-[13px] font-medium">R$</span>
                          <input type="hidden" name="partnerContrib" value={getRawValue(partnerContribStr)} />
                          <input 
                            type="text" 
                            inputMode="decimal" 
                            required 
                            value={partnerContribStr}
                            onChange={(e) => setPartnerContribStr(formatCurrency(e.target.value))}
                            className="w-full bg-[#1e1e21] border-[1.87px] border-white/5 rounded-[8px] pl-9 pr-3 py-3 text-[15px] font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-[#10b981]/50 transition-colors h-[45px]" 
                            placeholder="0,00" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview Summary */}
                    <div className="bg-[#2e2e32] border-[1.87px] border-[#059669]/20 rounded-[8px] p-4 flex flex-col gap-2 mt-1">
                      <p className="text-[#71717a] text-[11px] font-medium tracking-[0.8px] uppercase mb-1">Preview Summary</p>
                      <div className="flex items-center justify-between">
                        <p className="text-[#a1a1aa] text-[13px]">Monthly Total Limit</p>
                        <p className="text-white text-[13px] font-bold">{formatDisplayCurrency(totalMonthly)}</p>
                      </div>
                      <div className="h-px w-full bg-white/5 my-1"></div>
                      <div className="flex items-center justify-between">
                        <p className="text-[#a1a1aa] text-[13px] max-w-[165px]">Est. Weekly Limit (4 weekends)</p>
                        <p className="text-[#10b981] text-[13px] font-bold text-right max-w-[110px]">{formatDisplayCurrency(weeklyEstimate)}/wknd</p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button 
                        disabled={loading || !myContribStr || !partnerContribStr} 
                        type="submit" 
                        className="w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold text-[15px] py-4 rounded-[8px] transition-colors shadow-[0px_4px_7px_rgba(5,150,105,0.4)] disabled:opacity-50 h-[54px]"
                      >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "Start Tracking"}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
