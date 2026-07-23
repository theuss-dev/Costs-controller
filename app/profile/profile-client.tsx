"use client";

import { useRef, useState } from "react";
import { LogOut, Camera, AlertTriangle, Trash2, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logout, deleteAccount } from "./actions";
import { cancelInvite, sendNewInvite } from "./invite-actions";
import { useRouter } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MemberData {
  name: string;
  initial: string;
  color: string;
  spent: number;
  limit: number;
  email?: string;
  createdAt?: string;
}

interface PendingInvite {
  id: string;
  receiver_email: string;
  partner_contribution: number;
  status: string;
}

interface ProfileClientProps {
  members: MemberData[];
  totalLimit: number; // Ignored in new UI, kept for compatibility
  weeklyLimit: number; // Ignored in new UI
  userName: string;
  userEmail: string;
  userInitial: string;
  pendingInvites: PendingInvite[];
}

export default function ProfileClient({ members, userName, userEmail, userInitial, pendingInvites }: ProfileClientProps) {
  const router = useRouter();
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
    // Apenas permite números e uma vírgula
    let clean = val.replace(/[^\d,]/g, "");
    // Evita múltiplas vírgulas
    const parts = clean.split(",");
    if (parts.length > 2) {
      clean = parts[0] + "," + parts.slice(1).join("");
    }
    return clean;
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

  const nameParts = userName.split(' ');
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : "";

  return (
    <>
      <main className="flex flex-1 flex-col bg-[#121212] min-h-screen pb-28">
        {/* Header */}
        <header className="px-6 pt-12 pb-6 flex items-center justify-between relative">
          <button onClick={() => router.push("/")} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <h1 className="text-[17px] font-semibold text-white absolute left-1/2 -translate-x-1/2">Profile</h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </header>

        {/* User Info */}
        <div className="flex flex-col items-center mb-10 mt-2">
          <div className="relative">
            <div className="w-[88px] h-[88px] rounded-full bg-[#064e3b] flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-[28px]">{userInitial}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-[30px] h-[30px] rounded-full bg-[#242427] border-[2px] border-[#121212] flex items-center justify-center active:scale-90 transition-transform shadow-lg"
            >
              <Camera size={13} className="text-[#a1a1aa]" strokeWidth={2.5} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <h2 className="text-white font-bold text-[19px] tracking-[-0.5px] mt-4">{userName}</h2>
          <p className="text-[#71717a] text-[13px] font-medium mt-0.5">{userEmail}</p>
        </div>

        {/* PERSONAL INFORMATION */}
        <section className="px-6 mb-8">
          <h3 className="text-[#71717a] text-[11px] font-medium tracking-[0.8px] uppercase mb-3">Personal Information</h3>
          <div className="bg-[#242427] border-[1.87px] border-white/5 rounded-[16px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[#a1a1aa] text-[11px] font-medium">First name</span>
                <span className="text-white text-[14px] font-medium">{firstName}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[#a1a1aa] text-[11px] font-medium">Last name</span>
                <span className="text-white text-[14px] font-medium">{lastName || "Não informado"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col gap-1">
                <span className="text-[#a1a1aa] text-[11px] font-medium">Email</span>
                <span className="text-white text-[14px] font-medium">{userEmail}</span>
              </div>
            </div>
          </div>
        </section>

        {/* MY COUPLE */}
        <section className="px-6 mb-8">
          <h3 className="text-[#71717a] text-[11px] font-medium tracking-[0.8px] uppercase mb-3">My Couple</h3>
          <div className="bg-[#242427] border-[1.87px] border-white/5 rounded-[16px] overflow-hidden flex flex-col p-4 gap-4">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#059669] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-[14px]">
                    {members.length > 1 ? members[0].initial + "&" + members[1].initial : members[0].initial}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[14px] font-medium">
                    {members.length > 1 ? members[0].name.split(' ')[0] + " & " + members[1].name.split(' ')[0] : members[0].name.split(' ')[0]}
                  </span>
                  <span className="text-[#71717a] text-[12px]">Casal ativo</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {members.map((m, i) => (
                <div key={m.name + i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e1e21] flex items-center justify-center shrink-0 border border-white/5">
                    <span className="text-white font-medium text-[13px]">{m.initial}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[14px] font-medium">{m.name}</span>
                    <span className="text-[#71717a] text-[12px]">{m.email || (i === 0 ? userEmail : "Parceiro")}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Invites */}
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-dashed border-white/20">
                    <span className="text-[#a1a1aa] font-medium text-[13px]">?</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[14px] font-medium">Convite Pendente</span>
                    <span className="text-[#71717a] text-[12px]">{invite.receiver_email}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleCancelInvite(invite.id)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-[8px] bg-red-500/10 text-red-400 text-[11px] font-bold active:scale-95 transition-transform disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            ))}

            {/* Convidar Parceiro */}
            {members.length === 1 && pendingInvites.length === 0 && (
              <button 
                onClick={() => setShowInviteModal(true)}
                className="w-full flex items-center justify-center py-3 mt-2 rounded-[12px] bg-white/5 text-white font-medium text-[13px] active:scale-[0.98] transition-transform"
              >
                + Convidar parceiro
              </button>
            )}
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="px-6 mb-8">
          <h3 className="text-[#71717a] text-[11px] font-medium tracking-[0.8px] uppercase mb-3">Account</h3>
          <div className="bg-[#242427] border-[1.87px] border-white/5 rounded-[16px] overflow-hidden flex flex-col">
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center justify-between p-4 border-b border-white/5 active:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <LogOut size={14} className="text-red-500" />
                </div>
                <span className="text-red-500 text-[14px] font-medium">Sign out</span>
              </div>
            </button>
            
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-between p-4 active:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Trash2 size={14} className="text-[#71717a]" />
                </div>
                <span className="text-[#71717a] text-[14px] font-medium hover:text-red-500 transition-colors">Delete account</span>
              </div>
            </button>
          </div>
        </section>

        <p className="text-center text-[#71717a] text-[11px] font-medium mt-auto">Controle de Casal · v0.1.0</p>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#242427] border border-white/5 w-full max-w-sm rounded-[24px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-4 right-4 text-[#71717a] hover:text-white">
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <LogOut size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sign out?</h3>
            <p className="text-[#a1a1aa] text-[13px] mb-6">Você precisará fazer login novamente para acessar o controle do seu casal.</p>
            <form onSubmit={handleLogout} className="flex gap-3">
              <button type="button" onClick={() => setShowLogoutModal(false)} className="flex-1 py-3.5 rounded-[12px] bg-white/5 text-white font-medium text-[13px]">Cancelar</button>
              <button disabled={loading} type="submit" className="flex-1 py-3.5 rounded-[12px] bg-white text-black font-bold text-[13px] disabled:opacity-50">
                {loading ? "Saindo..." : "Sim, Sair"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#242427] border border-red-500/20 w-full max-w-sm rounded-[24px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 text-[#71717a] hover:text-white">
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete account?</h3>
            <p className="text-red-400/80 text-[13px] mb-6 leading-relaxed">
              ⚠️ <strong>Ação Irreversível.</strong> Isso apagará permanentemente todos os seus dados, histórico, convites e removerá você do seu casal.
            </p>
            <form onSubmit={handleDelete} className="flex flex-col gap-3">
              <button disabled={loading} type="submit" className="w-full py-3.5 rounded-[12px] bg-red-600 hover:bg-red-500 text-white font-bold text-[13px] disabled:opacity-50 transition-colors">
                {loading ? "Deletando..." : "Sim, Deletar Tudo"}
              </button>
              <button type="button" onClick={() => setShowDeleteModal(false)} className="w-full py-3 rounded-[12px] bg-transparent text-[#71717a] font-medium text-[13px]">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#242427] border border-white/5 w-full max-w-sm rounded-[24px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 text-[#71717a] hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Convidar Parceiro(a)</h3>
            <p className="text-[#a1a1aa] text-[13px] mb-6">Envie um convite para dividirem os gastos.</p>
            
            <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#a1a1aa]">E-mail do parceiro</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required 
                  className="bg-[#121212] border border-white/5 rounded-[12px] px-4 py-3.5 text-white placeholder:text-[#71717a] text-[14px] focus:outline-none focus:border-[#10b981]/50"
                  placeholder="parceiro@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#a1a1aa]">Contribuição mensal do parceiro</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] font-medium">R$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={inviteContrib}
                    onChange={(e) => setInviteContrib(formatCurrency(e.target.value))}
                    placeholder="0,00"
                    className="w-full bg-[#121212] border border-white/5 rounded-[12px] pl-10 pr-4 py-3.5 text-white placeholder:text-[#71717a] text-[14px] focus:outline-none focus:border-[#10b981]/50 transition-colors"
                  />
                </div>
              </div>

              {inviteError && (
                <div className="flex items-center gap-2 mt-2 text-[12px] font-semibold px-3 py-2 rounded-[8px] bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle size={14} />
                  {inviteError}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-3.5 rounded-[12px] bg-white/5 text-white font-medium text-[13px]">Cancelar</button>
                <button disabled={loading} type="submit" className="flex-1 py-3.5 rounded-[12px] bg-[#10b981] text-white font-bold text-[13px] disabled:opacity-50">
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
