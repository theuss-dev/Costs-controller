import type { NextConfig } from "next";

const securityHeaders = [
  // Força HTTPS por 2 anos, inclui subdomains e envia para preload list
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Bloqueia carregamento da app em iframes externos (anti-clickjacking)
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Bloqueia MIME sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Controla informações enviadas no Referer header
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restringe acesso a APIs sensíveis do browser
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Habilita proteção XSS do browser (legado, mas ainda útil)
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Content Security Policy
  // connect-src: apenas o projeto Supabase correto + self
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requer unsafe-inline para hydration; refinar com nonces em produção
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      `connect-src 'self' https://wpnzgylkaoaynjgrpbge.supabase.co wss://wpnzgylkaoaynjgrpbge.supabase.co`, // Whitelist explícita do projeto Supabase
      "frame-ancestors 'none'", // Bloqueia qualquer frame externo (mais forte que X-Frame-Options)
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Aplicar em todas as rotas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Bloqueia que variáveis de ambiente sem prefixo NEXT_PUBLIC_ sejam enviadas ao cliente
  // Isso é uma salvaguarda adicional de configuração
  experimental: {},

  // Remover o header "x-powered-by: Next.js" para não revelar o framework
  poweredByHeader: false,
};

export default nextConfig;
