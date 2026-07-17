"use client";

import { useRef, useState } from "react";
import { LogOut, Camera } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logout } from "./actions";

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

interface ProfileClientProps {
  members: MemberData[];
  totalLimit: number;
  weeklyLimit: number;
  userName: string;
  userEmail: string;
  userInitial: string;
}

export default function ProfileClient({ members, totalLimit, weeklyLimit, userName, userEmail, userInitial }: ProfileClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    // In a real app, upload this file to Supabase Storage and update the user's avatar.
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#18181b] pb-28 px-6 pt-12">
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

      <form action={logout}>
        <button type="submit" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 font-semibold text-sm active:scale-[0.98] transition-transform">
          <LogOut size={16} strokeWidth={2} />
          Sair da conta
        </button>
      </form>

      <p className="text-center text-neutral-700 text-[11px] font-medium mt-6">Controle de Casal · v0.1.0</p>
    </main>
  );
}
