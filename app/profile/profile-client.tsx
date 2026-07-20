"use client";

import { useRef, useState } from "react";
import { LogOut, Camera, AlertTriangle, Trash2, X } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logout, deleteAccount } from "./actions";

import { cancelInvite, sendNewInvite } from "./invite-actions";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

interface MemberData {
  name: string;
  initial: string;
  color: string;
  spent: number;
  limit: number;
}

interface PendingInvite {
  id: string;
  receiver_email: string;
  partner_contribution: number;
  status: string;
}

interface ProfileClientProps {
  members: MemberData[];
  totalLimit: number;
  weeklyLimit: number;
  userName: string;
  userEmail: string;
  userInitial: string;
  pendingInvites: PendingInvite[];
}

export default function ProfileClient({ members, totalLimit, weeklyLimit, userName, userEmail, userInitial, pendingInvites }: ProfileClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // States para convidar
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteContrib, setInviteContrib] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (val: string) => {
    const numbers = val.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = parseInt(numbers) / 100;
    return amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  const handleCancelInvite = async (id: string) => {
    setLoading(true);
    await cancelInvite(id);
    setLoading(false);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setLoading(true);
    const res = await sendNewInvite(inviteEmail, inviteContrib);
    if (res.error) {
      setInviteError(res.error);
      setLoading(false);
    } else {
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteContrib("");
      setLoading(false);
    }
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await logout();
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await deleteAccount();
  };

  return (
    <>
      <main className="flex flex-1 flex-col bg-[#18181b] pb-28 px-6 pt-12">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-8">Perfil</h1>

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-orange-500 border-4 border-[#18181b] flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-3xl">{userInitial}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-orange-500 border-2 border-[#18181b] flex items-center justify-center active:scale-90 transition-transform shadow-lg"
            >
              <Camera size={14} className="text-white" strokeWidth={2.5} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <p className="text-white font-semibold mt-3 text-base">{userName}</p>
          <p className="text-neutral-500 text-xs mt-0.5">{userEmail}</p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <h2 className="text-[15px] font-semibold text-neutral-300 mb-1">Seu Casal</h2>
          {members.map((m) => {
            const pct = Math.min((m.spent / m.limit) * 100, 100);
            return (
              <div key={m.name} className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.04] backdrop-blur-md border border-white/[0.07]">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#18181b]", m.color)}>
                    <span className="text-white font-bold text-lg">{m.initial}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{m.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">R$ {fmt(m.spent)} de R$ {fmt(m.limit)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-xs font-bold text-orange-400">{pct.toFixed(0)}%</span>
                  <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pending Invites */}
          {pendingInvites.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/[0.04] border-dashed">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed border-neutral-600 bg-transparent">
                  <span className="text-neutral-500 font-bold text-lg">?</span>
                </div>
                <div>
                  <p className="text-neutral-300 font-semibold text-sm">Convite Pendente</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{invite.receiver_email}</p>
                </div>
              </div>
              <button 
                onClick={() => handleCancelInvite(invite.id)}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold active:scale-95 transition-transform disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          ))}

          {/* Convidar Parceiro (Se houver apenas 1 membro e nenhum convite) */}
          {members.length === 1 && pendingInvites.length === 0 && (
            <button 
              onClick={() => setShowInviteModal(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-sm active:scale-[0.98] transition-transform mt-2"
            >
              + Convidar Parceiro(a)
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-4">
            <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">Teto Mensal</p>
            <p className="text-lg font-bold text-white tabular-nums">R$ {fmt(totalLimit)}</p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-4">
            <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">Limite Semanal</p>
            <p className="text-lg font-bold text-white tabular-nums">R$ {fmt(weeklyLimit)}</p>
          </div>
        </div>

        <Link href="/settings" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] active:scale-[0.98] transition-transform mb-6">
          <span className="text-sm font-medium text-neutral-200">Dados</span>
          <span className="text-neutral-500 text-xs">Nome e e-mail →</span>
        </Link>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-neutral-300 font-semibold text-sm active:scale-[0.98] transition-transform hover:bg-white/10"
          >
            <LogOut size={16} strokeWidth={2} />
            Sair da conta
          </button>

          <button 
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 font-semibold text-sm active:scale-[0.98] transition-transform hover:bg-red-500/20"
          >
            <Trash2 size={16} strokeWidth={2} />
            Deletar conta
          </button>
        </div>

        <p className="text-center text-neutral-700 text-[11px] font-medium mt-6">Controle de Casal · v0.1.0</p>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <LogOut size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sair da conta?</h3>
            <p className="text-neutral-400 text-sm mb-6">Você precisará fazer login novamente para acessar o controle do seu casal.</p>
            <form onSubmit={handleLogout} className="flex gap-3">
              <button type="button" onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium text-sm">Cancelar</button>
              <button disabled={loading} type="submit" className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-sm disabled:opacity-50">
                {loading ? "Saindo..." : "Sim, Sair"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1a1111] border border-red-500/20 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Deletar conta permanentemente?</h3>
            <p className="text-red-400/80 text-sm mb-6 leading-relaxed">
              ⚠️ <strong>Ação Irreversível.</strong> Isso apagará permanentemente todos os seus dados, histórico, convites e removerá você do seu casal.
            </p>
            <form onSubmit={handleDelete} className="flex flex-col gap-3">
              <button disabled={loading} type="submit" className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm disabled:opacity-50 transition-colors">
                {loading ? "Deletando..." : "Sim, Deletar Tudo"}
              </button>
              <button type="button" onClick={() => setShowDeleteModal(false)} className="w-full py-3 rounded-xl bg-transparent text-neutral-400 font-medium text-sm">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Convidar Parceiro(a)</h3>
            <p className="text-neutral-400 text-sm mb-6">Envie um convite para dividirem os gastos.</p>
            
            <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-300">E-mail do parceiro</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required 
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50"
                  placeholder="parceiro@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-300">Contribuição mensal do parceiro</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formatCurrency(inviteContrib)}
                    onChange={(e) => setInviteContrib(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
              </div>

              {inviteError && (
                <div className="flex items-center gap-2 mt-2 text-xs font-semibold px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle size={14} />
                  {inviteError}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-3.5 rounded-xl bg-white/5 text-white font-medium text-sm">Cancelar</button>
                <button disabled={loading} type="submit" className="flex-1 py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm disabled:opacity-50">
                  {loading ? "Enviando..." : "Enviar Convite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
