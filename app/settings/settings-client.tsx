"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, AlertTriangle, X } from "lucide-react";
import { updateProfileName } from "./actions";

interface SettingsClientProps {
  initialFirstName: string;
  initialLastName: string;
  email: string;
}

export default function SettingsClient({ initialFirstName, initialLastName, email }: SettingsClientProps) {
  const router = useRouter();

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isChanged = firstName !== initialFirstName || lastName !== initialLastName;

  const handleSaveClick = () => {
    if (isChanged) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSave = async () => {
    setLoading(true);
    setError(null);
    const res = await updateProfileName(firstName, lastName);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
      setShowConfirmModal(false);
      return;
    }

    setSaved(true);
    setLoading(false);
    setShowConfirmModal(false);
    
    setTimeout(() => {
      setSaved(false);
      router.refresh(); // To reflect changes in the parent component if needed
    }, 2000);
  };

  return (
    <>
      <main className="flex flex-1 flex-col bg-[#18181b] pb-28">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-6 border-b border-white/5">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 active:scale-95 transition-transform text-white"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-white tracking-tight">Dados Pessoais</h1>
        </header>

        <div className="flex flex-col px-6 pt-8 gap-6">

          {error && (
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          <div className="flex gap-4">
            {/* ─── Nome (editável) ─── */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Nome
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl px-5 py-4 text-white font-medium outline-none focus:border-orange-500/50 transition-colors placeholder:text-neutral-600"
                placeholder="Seu nome"
              />
            </div>

            {/* ─── Sobrenome (editável) ─── */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Sobrenome
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl px-5 py-4 text-white font-medium outline-none focus:border-orange-500/50 transition-colors placeholder:text-neutral-600"
                placeholder="Seu sobrenome"
              />
            </div>
          </div>

          {/* ─── E-mail (somente leitura) ─── */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              E-mail
            </label>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 py-4 flex items-center justify-between">
              <span className="text-neutral-400 font-medium text-sm truncate">{email}</span>
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                Somente leitura
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 px-1">O e-mail não pode ser alterado por aqui.</p>
          </div>

          {/* ─── Botão Salvar ─── */}
          <button
            onClick={handleSaveClick}
            disabled={!isChanged || !firstName.trim() || saved || loading}
            className="relative w-full h-[56px] rounded-[18px] overflow-hidden text-white font-bold text-sm active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
              boxShadow: "0 4px 0px #7c2d12, 0 8px 24px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            {saved ? (
              <><Check size={16} strokeWidth={3} /> Salvo!</>
            ) : (
              "Salvar alterações"
            )}
          </button>
        </div>
      </main>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1a1111] border border-orange-500/20 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Salvar alterações?</h3>
            <p className="text-orange-400/80 text-sm mb-6 leading-relaxed">
              Você está prestes a alterar seu nome no aplicativo. Confirma esta ação?
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmSave} 
                disabled={loading} 
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm disabled:opacity-50 transition-colors"
              >
                {loading ? "Salvando..." : "Sim, Atualizar Nome"}
              </button>
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="w-full py-3 rounded-xl bg-transparent text-neutral-400 font-medium text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
