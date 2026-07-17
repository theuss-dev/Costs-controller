import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#18181b] p-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Login</h1>
          <p className="text-neutral-400 text-sm">Acesse o controle do casal</p>
        </div>
        
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-neutral-300">Senha</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button 
              formAction={login}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]"
            >
              Entrar
            </button>
            <button 
              formAction={signup}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-medium py-3.5 rounded-xl transition-all"
            >
              Criar conta
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
