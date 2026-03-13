# Ferri Schoedl Advocacia

Website institucional do escritorio Ferri Schoedl Advocacia — Sao Paulo/SP.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (animacoes)
- **Lucide React** (icones)

## Estrutura do Projeto

```
src/
  app/
    page.tsx              # Home
    layout.tsx            # Layout global (navbar + footer)
    globals.css           # Design tokens e estilos globais
    sobre/page.tsx        # Pagina Sobre
    areas-de-atuacao/     # Areas de Atuacao
    publicacoes/          # Publicacoes (livros e artigos)
    cursos/               # Cursos (com lead capture)
    contato/              # Formulario de contato
    faq/                  # Perguntas frequentes
  components/
    Navbar.tsx            # Navegacao com scroll detection
    Footer.tsx            # Rodape completo
    Reveal.tsx            # Animacoes de scroll (Framer Motion)
    SectionHeading.tsx    # Componente reutilizavel de titulo
  lib/
    data.ts               # Conteudo centralizado do site
```

## Como Rodar Localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`

## Deploy na Vercel

1. Suba o repositorio no GitHub
2. Conecte ao Vercel (vercel.com)
3. Framework preset: **Next.js**
4. Deploy automatico

## Proximos Passos

- [ ] Substituir placeholders de foto por imagens profissionais
- [ ] Conectar formulario de contato (Resend, SendGrid ou EmailJS)
- [ ] Conectar lead capture de cursos (Brevo, MailerLite, etc.)
- [ ] Adicionar Google Analytics / Tag Manager
- [ ] Configurar dominio personalizado
- [ ] SEO: adicionar sitemap.xml e robots.txt
- [ ] Blog com MDX ou CMS headless
- [ ] Area de cursos com autenticacao (NextAuth) e pagamento (Stripe)

## Desenvolvido por

**Pedrazzoli Digital** — [pedrazzolidigital.com](https://pedrazzolidigital.com)
