# Security Policy — CasalFi

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest (feature/new-ui) | ✅ |
| main | ✅ |

## Reporting a Vulnerability

Se você encontrou uma vulnerabilidade de segurança no CasalFi, **NÃO abra uma issue pública**.

Entre em contato via:
- **GitHub Private Advisory**: Vá em Security > Advisories > New draft security advisory neste repositório.

Por favor, inclua no seu reporte:
- Descrição clara da vulnerabilidade
- Passos para reproduzir (PoC)
- Impacto potencial
- Sugestão de correção (se houver)

Você pode esperar uma resposta em até **72 horas**.

## Scope

Os seguintes ativos estão dentro do escopo de segurança:
- Aplicação web (Next.js)
- Server Actions (`app/**/actions.ts`)
- Configuração Supabase (RLS policies, RPCs)
- Middleware de autenticação

## Security Architecture

### Autenticação
- Autenticação gerenciada pelo **Supabase Auth** (JWT + cookies HTTPOnly)
- Todas as rotas são protegidas pelo `middleware.ts` que verifica sessão ativa
- Server Actions validam `auth.getUser()` antes de qualquer operação de dados

### Autorização (IDOR Protection)
- Cada Server Action valida que o usuário possui ownership dos recursos manipulados
- `payerId` em transações é validado contra o `household_id` do usuário logado
- Aceite de convites valida `receiver_email === user.email`

### Chaves de API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública por design do Supabase SSR. Segurança depende de RLS policies robustas no banco de dados.
- `SUPABASE_SERVICE_ROLE_KEY`: **NUNCA deve ser exposta** via `NEXT_PUBLIC_*` ou código cliente.
- `.env.local` está no `.gitignore` e nunca deve ser comitado.

### Headers de Segurança HTTP
A aplicação configura os seguintes headers via `next.config.ts`:
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy` (CSP)
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

## Known Limitations

- A `ANON_KEY` do Supabase é embarcada no bundle JavaScript pelo Next.js (`NEXT_PUBLIC_*`). Este é o comportamento esperado do Supabase SSR. A segurança dos dados é garantida pelas **Row Level Security (RLS) policies** no PostgreSQL, não pela confidencialidade da chave.
