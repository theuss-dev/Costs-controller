"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "./actions";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, insira seu email.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#18181b] p-6 relative">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-medium text-white tracking-tight mb-2">Entrar</h1>
          <p className="text-neutral-500 text-sm">Acesse o controle do casal</p>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleNext} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                autoFocus
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                placeholder="seu@email.com"
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
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]"
              >
                Continuar <ArrowRight size={18} />
              </button>
              <Link 
                href="/signup"
                className="w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-medium py-3.5 rounded-xl transition-all"
              >
                Criar conta
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium text-neutral-300">Senha</label>
                <button type="button" onClick={() => setStep(1)} className="text-xs text-orange-400 hover:text-orange-300">
                  Alterar email
                </button>
              </div>
              <p className="text-xs text-neutral-500 mb-2">{email}</p>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                autoFocus
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
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Entrar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
