# Ferri Schoedl Advocacia

Plataforma web completa do escritorio Ferri Schoedl Advocacia — Sao Paulo/SP.
Website institucional com sistema de e-commerce integrado para venda direta de livros juridicos, painel administrativo completo e checkout com guest mode.

**Producao:** [ferrischoedl.adv.br](https://www.ferrischoedl.adv.br)

---

## Stack

### Frontend

- **Next.js 15** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — animacoes de scroll e transicoes
- **Lucide React** — biblioteca de icones

### Backend

- **MongoDB Atlas** + **Mongoose** — persistencia
- **NextAuth v4** — autenticacao (JWT, multi-provider)
- **bcryptjs** — hashing de passwords
- **Resend** — envio transacional de emails
- **Cloudinary** — gestao de imagens

### Pagamentos e Logistica

- **Pagar.me V5** — processamento de pagamentos (cartao, PIX, boleto)
- **Melhor Envio** (planeado) — calculo de frete e etiquetas
- **ViaCEP** — preenchimento automatico de enderecos
- Calculo de frete real por regiao brasileira

### Infraestrutura

- **Vercel** — hosting e CI/CD
- **MongoDB Atlas** — cluster gerenciado
- **Locadados** — hosting de email corporativo

---

## Funcionalidades

### Site Institucional

- Home com secoes hero, areas de atuacao, biografia, publicacoes e CTA
- Pagina Sobre com trajetoria completa, diferenciais e formacao academica
- 6 areas de atuacao detalhadas (Criminal, Disciplinar, Civel, Tribunal do Juri, Improbidade, Imobiliario)
- Listagem de publicacoes (10 livros e 22 artigos juridicos)
- Pagina de contato com formulario integrado ao Resend
- FAQ dinamico alimentado por CMS
- Paginas legais (Politica de Privacidade e Termos de Uso)
- Pagina de cursos com lead capture para lancamento futuro
- Dark mode / Light mode com toggle persistente
- Responsive design completo (mobile-first)

### E-commerce de Livros

- Catalogo com 10 obras (proprias e coautorias)
- Pagina de detalhe por livro com especificacoes completas
- Dois fluxos de venda:
  - **Venda direta** (livros proprios): checkout interno com pagamento Pagar.me
  - **Venda externa** (coautorias): redirect para editora parceira
- Controle de estoque em tempo real:
  - Livros sem estoque mostram overlay "Indisponivel" na capa
  - Botoes de compra desabilitados automaticamente quando fora de estoque
  - Mensagem contextual ao visitante
- Carrinho persistente com drawer lateral
- Badge de contador de itens na navbar
- Grid navegavel mesmo para itens fora de estoque (preserva SEO e conteudo educativo)

### Checkout com Guest Mode

Fluxo de pagamento otimizado para conversao maxima:

- Customer navega o site livremente sem exigencia de login
- Adiciona livros ao carrinho como visitante
- Preenche dados pessoais, endereco e frete sem criar conta
- Autenticacao acontece apenas no momento final, antes do Pagar.me
- Gate de autenticacao inteligente:
  - **Customer existente com senha:** modal pede password → login tradicional
  - **Customer novo:** envia OTP de 6 digitos por email → conta criada automaticamente com email ja verificado
  - **Customer existente sem password:** mesmo fluxo OTP
- Retomada automatica do checkout apos autenticacao (sem perda de dados preenchidos)
- Integracao completa com Pagar.me V5: cartao de credito (ate 12x), PIX (QR code + copia e cola) e boleto bancario
- Confirmacao de pedido por email via Resend
- Area do cliente para acompanhar pedidos apos a compra

### Autenticacao Multi-Role

Sistema dual com dois tipos de usuarios isolados:

**Admin / Editor** (model `User`)

- Login em `/admin/login` (icone cadeado no footer)
- Acesso total ao painel administrativo
- Gestao de livros, cursos, artigos, conteudo do site e conta

**Customer** (model `Customer`)

- Login em `/conta/login` (icone usuario na navbar)
- Area do cliente em `/conta`
- Acesso a historico de pedidos e perfil
- Validacao de CPF, bloqueio de emails descartaveis
- Verificacao de email obrigatoria (via link ou OTP)

**Seguranca**

- Passwords hasheados com bcrypt (12 rounds)
- JWT signed com `NEXTAUTH_SECRET`
- HMAC-SHA256 para assinatura de sessoes OTP
- Rate limiting em endpoints sensiveis
- Middleware protege rotas `/admin/*` e `/conta/*` (exceto login/registro)
- Checkout valida sessao server-side (customerId vem do token, nao do body)
- TTL automatico em tokens temporarios (MongoDB)

### Painel Administrativo

Acesso completo para o Dr. Thales gerir o site sem tocar em codigo:

- Dashboard com estatisticas
- **Livros:** criar, editar, ativar/desativar, controlar estoque, featured, ordem
- **Cursos:** gestao completa (preparado para lancamento futuro)
- **Artigos:** CRUD dos 22 artigos juridicos
- **Conteudo do site:** editor de textos de todas as paginas publicas (home, sobre, contato, FAQ, termos, privacidade)
- **Conta:** alteracao de password propria
- Upload de imagens integrado com Cloudinary
- Seed de dados inicial via endpoint

### SEO e Performance

- Sitemap.xml dinamico (19 paginas indexaveis)
- Robots.txt configurado
- Metadata por pagina (Open Graph, Twitter Cards)
- JSON-LD structured data (Organization, Person, Article, Book)
- Google Search Console verificado e sitemap submetido
- Canonical URLs para todas as paginas
- Imagens otimizadas via next/image
- Server Components para maior parte do conteudo
- Fonts auto-hospedados com next/font (Cormorant Garamond, Inter)

### Emails Transacionais

Via Resend com templates HTML brandeados:

- Verificacao de conta (link 24h)
- Codigo OTP para checkout (6 digitos, 10min)
- Confirmacao de pedido com detalhes e link de rastreio
- Atualizacao de status de pedido (preparando, enviado, entregue, cancelado)
- Dominio verificado: `send.ferrischoedl.adv.br` (DKIM + SPF)

---

## Estrutura do Projeto
