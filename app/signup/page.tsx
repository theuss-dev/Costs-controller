"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "./actions";
import { AlertTriangle, CheckCircle2, Users } from "lucide-react";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const res = await signup(email, password, firstName, lastName);
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccessMsg(res.message || "Conta criada com sucesso!");
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#121212] p-6 relative min-h-screen">
      <div className="w-full max-w-[400px] flex flex-col gap-8">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center pt-6 gap-2">
          <div className="pb-2">
            <div className="bg-[#064e3b] flex items-center justify-center rounded-[16px] w-[64px] h-[64px] shadow-sm">
              <Users size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-[28px] font-bold text-white tracking-[-0.5px] leading-tight mt-1">
            <span>Casal</span>
            <span className="text-[#10b981]">Fi</span>
          </h1>
          <p className="text-[#71717a] text-[13px] font-normal tracking-[0.3px]">
            track what matters together
          </p>
        </div>
        
        {successMsg ? (
          <div className="flex flex-col items-center gap-4 text-center mt-4">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center mb-2">
              <CheckCircle2 size={32} className="text-[#10b981]" />
            </div>
            <p className="text-white font-medium">{successMsg}</p>
            <Link href="/login" className="mt-4 text-[#10b981] font-bold hover:text-[#059669]">
              Ir para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label htmlFor="firstName" className="text-[#a1a1aa] text-[13px] font-medium tracking-[0.2px] mb-1">Nome</label>
                <input 
                  id="firstName" 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                  className="w-full bg-[#1e1e21] border border-white/10 rounded-lg px-[18px] py-[16px] text-[15px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#10b981]/50 transition-colors h-[54px]"
                  placeholder="Nome"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label htmlFor="lastName" className="text-[#a1a1aa] text-[13px] font-medium tracking-[0.2px] mb-1">Sobrenome</label>
                <input 
                  id="lastName" 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                  className="w-full bg-[#1e1e21] border border-white/10 rounded-lg px-[18px] py-[16px] text-[15px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#10b981]/50 transition-colors h-[54px]"
                  placeholder="Sobrenome"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <label htmlFor="email" className="text-[#a1a1aa] text-[13px] font-medium tracking-[0.2px] mb-1">Email</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full bg-[#1e1e21] border border-white/10 rounded-lg px-[18px] py-[16px] text-[15px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#10b981]/50 transition-colors h-[54px]"
                placeholder="you@email.com"
              />
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <label htmlFor="password" className="text-[#a1a1aa] text-[13px] font-medium tracking-[0.2px] mb-1">Senha</label>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full bg-[#1e1e21] border border-white/10 rounded-lg px-[18px] py-[16px] text-[15px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#10b981]/50 transition-colors h-[54px]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <label htmlFor="confirmPassword" className="text-[#a1a1aa] text-[13px] font-medium tracking-[0.2px] mb-1">Confirmar Senha</label>
              <input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                className="w-full bg-[#1e1e21] border border-white/10 rounded-lg px-[18px] py-[16px] text-[15px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#10b981]/50 transition-colors h-[54px]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 mt-2 text-[13px] font-semibold px-4 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-[#059669] hover:bg-[#047857] text-white font-semibold text-[15px] py-4 rounded-lg transition-colors shadow-[0px_4px_7px_rgba(5,150,105,0.4)] disabled:opacity-50 h-[54px]"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Account"}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        {!successMsg && (
          <div className="text-center mt-2">
            <p className="text-[#71717a] text-[13px]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#10b981] font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
