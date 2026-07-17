export function translateAuthError(message: string): string {
  const errors: Record<string, string> = {
    "Invalid login credentials": "Email ou senha incorretos.",
    "User already registered": "Este e-mail já está cadastrado.",
    "Email not confirmed": "Por favor, confirme seu e-mail antes de entrar.",
    "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres.",
    "Signup requires a valid password": "É necessário informar uma senha válida."
  }
  return errors[message] || "Ocorreu um erro inesperado. Tente novamente."
}
