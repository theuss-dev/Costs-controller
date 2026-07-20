"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "./actions";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
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

    const res = await signup(email, password);
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccessMsg(res.message || "Conta criada com sucesso!");
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#18181b] p-6 relative">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-medium text-white tracking-tight mb-2">Criar Conta</h1>
          <p className="text-neutral-500 text-sm">Organize seus gastos em casal</p>
        </div>
        
        {successMsg ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-2">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <p className="text-white font-medium">{successMsg}</p>
            <Link href="/login" className="mt-4 text-orange-400 font-bold hover:text-orange-300">
              Ir para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-300">Senha</label>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-300">Confirmar Senha</label>
              <input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 mt-2 text-xs font-semibold px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Criar Conta"}
              </button>
              <Link 
                href="/login"
                className="w-full text-center text-neutral-400 text-sm hover:text-white transition-colors mt-2"
              >
                Já tem uma conta? <span className="text-orange-400 font-bold">Faça login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
