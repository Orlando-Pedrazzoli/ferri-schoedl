import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import Article from '@/models/Article';
import SiteContent from '@/models/SiteContent';
import User from '@/models/User';
import {
  livros,
  artigos,
  siteConfig,
  aboutData,
  faqItems,
  areasDeAtuacao,
  timeline,
} from '@/lib/data';

// ===== SEED BOOKS =====
export async function seedBooks(force = false) {
  await dbConnect();

  const existingCount = await Book.countDocuments();
  if (existingCount > 0 && !force) {
    console.log(
      `⏭️  Livros já existem (${existingCount}). Pulando seed. Use force=true para recriar.`,
    );
    return { skipped: true, count: existingCount };
  }

  if (force && existingCount > 0) {
    await Book.deleteMany({});
    console.log(`🗑️  ${existingCount} livros removidos para reseed.`);
  }

  const booksData = livros.map((livro, index) => ({
    slug: livro.slug,
    title: livro.title,
    subtitle: livro.subtitle || '',
    author: livro.author,
    coauthor: livro.coauthor || false,
    year: livro.year,
    publisher: livro.publisher,
    pages: livro.pages,
    isbn: livro.isbn || '',
    edition: livro.edition,
    price: livro.price,
    originalPrice: livro.originalPrice || undefined,
    description: livro.description,
    longDescription: livro.longDescription,
    topics: livro.topics,
    dimensions: livro.dimensions,
    weight: livro.weight,
    weightUnit: livro.weightUnit,
    image: livro.image,
    inStock: livro.inStock,
    featured: livro.featured || false,
    saleType: livro.saleType,
    saleNote: livro.saleNote || '',
    order: index,
    isActive: true,
  }));

  const result = await Book.insertMany(booksData);
  console.log(`✅ ${result.length} livros inseridos com sucesso.`);
  return { skipped: false, count: result.length };
}

// ===== SEED ARTICLES =====
export async function seedArticles(force = false) {
  await dbConnect();

  const existingCount = await Article.countDocuments();
  if (existingCount > 0 && !force) {
    console.log(
      `⏭️  Artigos já existem (${existingCount}). Pulando seed. Use force=true para recriar.`,
    );
    return { skipped: true, count: existingCount };
  }

  if (force && existingCount > 0) {
    await Article.deleteMany({});
    console.log(`🗑️  ${existingCount} artigos removidos para reseed.`);
  }

  const articlesData = artigos.map((artigo, index) => ({
    title: artigo.title,
    year: artigo.year,
    publisher: artigo.publisher,
    url: artigo.url || '',
    pdfUrl: artigo.pdfUrl || '',
    originalPublisher: artigo.originalPublisher || '',
    coauthors: artigo.coauthors || [],
    description: artigo.description || '',
    type: 'artigo' as const,
    isActive: true,
    order: index,
  }));

  const result = await Article.insertMany(articlesData);
  console.log(`✅ ${result.length} artigos inseridos com sucesso.`);
  return { skipped: false, count: result.length };
}

// ===== SEED SITE CONTENT =====
export async function seedSiteContent(force = false) {
  await dbConnect();

  const existingCount = await SiteContent.countDocuments();
  if (existingCount > 0 && !force) {
    console.log(
      `⏭️  Conteúdo do site já existe (${existingCount}). Pulando seed. Use force=true para recriar.`,
    );
    return { skipped: true, count: existingCount };
  }

  if (force && existingCount > 0) {
    await SiteContent.deleteMany({});
    console.log(`🗑️  ${existingCount} conteúdos removidos para reseed.`);
  }

  const contentItems = [
    // HOME
    {
      key: 'home.hero.title',
      page: 'home',
      section: 'hero',
      field: 'title',
      value: 'Defesa técnica com rigor e experiência',
      type: 'text' as const,
      label: 'Título Principal (Hero)',
      description: 'Título grande que aparece na seção hero da homepage.',
    },
    {
      key: 'home.hero.subtitle',
      page: 'home',
      section: 'hero',
      field: 'subtitle',
      value:
        'Advocacia criminal, cível e administrativa com a perspectiva estratégica de um ex-Promotor de Justiça.',
      type: 'textarea' as const,
      label: 'Subtítulo (Hero)',
      description: 'Texto descritivo abaixo do título principal.',
    },
    {
      key: 'home.about.title',
      page: 'home',
      section: 'about',
      field: 'title',
      value: 'Dr. Thales Ferri Schoedl',
      type: 'text' as const,
      label: 'Título Seção Sobre (Home)',
    },
    {
      key: 'home.about.text',
      page: 'home',
      section: 'about',
      field: 'text',
      value: aboutData.shortBio,
      type: 'textarea' as const,
      label: 'Texto Sobre (Home)',
      description: 'Texto resumido sobre o Dr. Thales que aparece na homepage.',
    },
    {
      key: 'home.cursos.title',
      page: 'home',
      section: 'cursos',
      field: 'title',
      value: 'Cursos Preparatórios',
      type: 'text' as const,
      label: 'Título Seção Cursos (Home)',
    },
    {
      key: 'home.cursos.text',
      page: 'home',
      section: 'cursos',
      field: 'text',
      value:
        'Preparação estratégica para concursos públicos e Exame de Ordem, com a experiência de quem viveu a Promotoria de Justiça por dentro.',
      type: 'textarea' as const,
      label: 'Texto Seção Cursos (Home)',
    },

    // SOBRE
    {
      key: 'sobre.bio.title',
      page: 'sobre',
      section: 'bio',
      field: 'title',
      value: aboutData.title,
      type: 'text' as const,
      label: 'Título (Sobre)',
    },
    {
      key: 'sobre.bio.text',
      page: 'sobre',
      section: 'bio',
      field: 'text',
      value: aboutData.bio,
      type: 'richtext' as const,
      label: 'Biografia Completa',
      description: 'Texto completo da biografia do Dr. Thales.',
    },
    {
      key: 'sobre.bio.shortBio',
      page: 'sobre',
      section: 'bio',
      field: 'shortBio',
      value: aboutData.shortBio,
      type: 'textarea' as const,
      label: 'Biografia Curta',
    },
    {
      key: 'sobre.coaching.text',
      page: 'sobre',
      section: 'coaching',
      field: 'text',
      value: aboutData.coaching,
      type: 'textarea' as const,
      label: 'Texto de Coaching',
    },

    // CONTATO
    {
      key: 'contato.intro.text',
      page: 'contato',
      section: 'intro',
      field: 'text',
      value:
        'Entre em contato para agendar uma consulta ou esclarecer dúvidas sobre nossos serviços jurídicos.',
      type: 'textarea' as const,
      label: 'Texto Introdução (Contato)',
    },

    // CURSOS
    {
      key: 'cursos.intro.title',
      page: 'cursos',
      section: 'intro',
      field: 'title',
      value: 'Cursos Preparatórios',
      type: 'text' as const,
      label: 'Título (Cursos)',
    },
    {
      key: 'cursos.intro.text',
      page: 'cursos',
      section: 'intro',
      field: 'text',
      value:
        'Preparação especializada para concursos públicos e Exame de Ordem, ministrada pelo Dr. Thales Ferri Schoedl.',
      type: 'textarea' as const,
      label: 'Texto Introdução (Cursos)',
    },

    // CONFIG (editable site-wide)
    {
      key: 'config.site.tagline',
      page: 'config',
      section: 'site',
      field: 'tagline',
      value: siteConfig.tagline,
      type: 'text' as const,
      label: 'Tagline do Site',
    },
    {
      key: 'config.site.description',
      page: 'config',
      section: 'site',
      field: 'description',
      value: siteConfig.description,
      type: 'textarea' as const,
      label: 'Descrição Geral do Site',
    },
    {
      key: 'config.contact.phone',
      page: 'config',
      section: 'contact',
      field: 'phone',
      value: siteConfig.phone,
      type: 'text' as const,
      label: 'Telefone',
    },
    {
      key: 'config.contact.email',
      page: 'config',
      section: 'contact',
      field: 'email',
      value: siteConfig.email,
      type: 'text' as const,
      label: 'Email',
    },
    {
      key: 'config.contact.whatsapp',
      page: 'config',
      section: 'contact',
      field: 'whatsapp',
      value: siteConfig.whatsapp,
      type: 'text' as const,
      label: 'WhatsApp (número completo)',
    },
    {
      key: 'config.contact.address',
      page: 'config',
      section: 'contact',
      field: 'address',
      value: JSON.stringify(siteConfig.address),
      type: 'json' as const,
      label: 'Endereço',
    },

    // FAQ
    {
      key: 'faq.items',
      page: 'faq',
      section: 'items',
      field: 'items',
      value: JSON.stringify(faqItems),
      type: 'json' as const,
      label: 'Perguntas Frequentes',
      description: 'Array JSON com as perguntas e respostas do FAQ.',
    },

    // ===== HOME — textos adicionais =====
    {
      key: 'home.hero.label',
      page: 'home',
      section: 'hero',
      field: 'label',
      value: 'Advocacia e Consultoria Especializadas',
      type: 'text' as const,
      label: 'Label acima do título (Hero)',
      description: 'Texto pequeno em uppercase acima do título principal.',
    },
    {
      key: 'home.hero.description',
      page: 'home',
      section: 'hero',
      field: 'description',
      value:
        'Atuação estratégica nas áreas criminal, tribunal do júri, improbidade administrativa, imobiliário, cível e disciplinar, com ênfase na defesa de servidores públicos. Escritório com sede em São Paulo e atuação em todo o território nacional.',
      type: 'textarea' as const,
      label: 'Descrição (Hero)',
      description: 'Parágrafo descritivo abaixo do título hero.',
    },
    {
      key: 'home.areas.label',
      page: 'home',
      section: 'areas',
      field: 'label',
      value: 'Especializações',
      type: 'text' as const,
      label: 'Label Seção Áreas (Home)',
    },
    {
      key: 'home.areas.title',
      page: 'home',
      section: 'areas',
      field: 'title',
      value: 'Áreas de atuação',
      type: 'text' as const,
      label: 'Título Seção Áreas (Home)',
    },
    {
      key: 'home.areas.description',
      page: 'home',
      section: 'areas',
      field: 'description',
      value:
        'Atuação abrangente em áreas estratégicas do Direito, com ênfase na defesa técnica de servidores públicos em causas de alta complexidade.',
      type: 'textarea' as const,
      label: 'Descrição Seção Áreas (Home)',
    },
    {
      key: 'home.about.subtitle',
      page: 'home',
      section: 'about',
      field: 'subtitle',
      value: 'Advogado, jurista, professor e palestrante',
      type: 'text' as const,
      label: 'Subtítulo Seção Sobre (Home)',
    },
    {
      key: 'home.about.description1',
      page: 'home',
      section: 'about',
      field: 'description1',
      value: `Ex-Promotor de Justiça do Estado de São Paulo (2003–2016), com formação pela Universidade Presbiteriana Mackenzie, especialização em Direito Penal e Processual Penal e Mestrado pela UFBA. Autor de mais de ${siteConfig.stats.livrosPublicados} livros e mais de ${siteConfig.stats.artigosPublicados} artigos jurídicos publicados. Professor na Academia Del Guercio SPCM.`,
      type: 'textarea' as const,
      label: 'Parágrafo 1 — Sobre (Home)',
    },
    {
      key: 'home.about.description2',
      page: 'home',
      section: 'about',
      field: 'description2',
      value:
        'Sua trajetória une a experiência na Promotoria de Justiça com a advocacia estratégica, oferecendo uma perspectiva única — a visão de quem já esteve do lado da acusação — resultando em uma atuação técnica diferenciada na defesa de servidores públicos e em causas de alta complexidade.',
      type: 'textarea' as const,
      label: 'Parágrafo 2 — Sobre (Home)',
    },
    {
      key: 'home.publicacoes.label',
      page: 'home',
      section: 'publicacoes',
      field: 'label',
      value: 'Obras publicadas',
      type: 'text' as const,
      label: 'Label Seção Publicações (Home)',
    },
    {
      key: 'home.publicacoes.title',
      page: 'home',
      section: 'publicacoes',
      field: 'title',
      value: 'Publicações',
      type: 'text' as const,
      label: 'Título Seção Publicações (Home)',
    },
    {
      key: 'home.publicacoes.description',
      page: 'home',
      section: 'publicacoes',
      field: 'description',
      value: `Autor de mais de ${siteConfig.stats.livrosPublicados} livros e mais de ${siteConfig.stats.artigosPublicados} artigos jurídicos — produção acadêmica e editorial que reflete décadas de experiência na prática e no ensino do Direito.`,
      type: 'textarea' as const,
      label: 'Descrição Seção Publicações (Home)',
    },
    {
      key: 'home.cta.title',
      page: 'home',
      section: 'cta',
      field: 'title',
      value: 'Cada caso exige uma estratégia única',
      type: 'text' as const,
      label: 'Título CTA Final (Home)',
    },
    {
      key: 'home.cta.description',
      page: 'home',
      section: 'cta',
      field: 'description',
      value:
        'Entre em contato para uma análise preliminar do seu caso. Atuamos em todo o Brasil com atendimento presencial e online.',
      type: 'textarea' as const,
      label: 'Descrição CTA Final (Home)',
    },

    // ===== STATS (usados em várias páginas) =====
    {
      key: 'config.stats.anosExperiencia',
      page: 'config',
      section: 'stats',
      field: 'anosExperiencia',
      value: String(siteConfig.stats.anosExperiencia),
      type: 'text' as const,
      label: 'Anos de Experiência',
      description: 'Número exibido nas estatísticas do site.',
    },
    {
      key: 'config.stats.livrosPublicados',
      page: 'config',
      section: 'stats',
      field: 'livrosPublicados',
      value: String(siteConfig.stats.livrosPublicados),
      type: 'text' as const,
      label: 'Livros Publicados',
      description: 'Número exibido nas estatísticas do site.',
    },
    {
      key: 'config.stats.artigosPublicados',
      page: 'config',
      section: 'stats',
      field: 'artigosPublicados',
      value: String(siteConfig.stats.artigosPublicados),
      type: 'text' as const,
      label: 'Artigos Publicados',
      description: 'Número exibido nas estatísticas do site.',
    },

    // ===== CONFIG — contacto adicional =====
    {
      key: 'config.contact.phoneLandline',
      page: 'config',
      section: 'contact',
      field: 'phoneLandline',
      value: siteConfig.phoneLandline,
      type: 'text' as const,
      label: 'Telefone Fixo',
    },
    {
      key: 'config.contact.hours',
      page: 'config',
      section: 'contact',
      field: 'hours',
      value: siteConfig.hours,
      type: 'text' as const,
      label: 'Horário de Atendimento',
    },
    {
      key: 'config.contact.oab',
      page: 'config',
      section: 'contact',
      field: 'oab',
      value: siteConfig.oab,
      type: 'text' as const,
      label: 'Registro OAB',
    },
    {
      key: 'config.social.instagram',
      page: 'config',
      section: 'social',
      field: 'instagram',
      value: siteConfig.social.instagram,
      type: 'text' as const,
      label: 'Instagram URL',
    },
    {
      key: 'config.social.linkedin',
      page: 'config',
      section: 'social',
      field: 'linkedin',
      value: siteConfig.social.linkedin,
      type: 'text' as const,
      label: 'LinkedIn URL',
    },
    {
      key: 'config.social.facebook',
      page: 'config',
      section: 'social',
      field: 'facebook',
      value: siteConfig.social.facebook,
      type: 'text' as const,
      label: 'Facebook URL',
    },

    // ===== SOBRE — diferenciais =====
    {
      key: 'sobre.differentials.items',
      page: 'sobre',
      section: 'differentials',
      field: 'items',
      value: JSON.stringify(aboutData.differentials),
      type: 'json' as const,
      label: 'Diferenciais',
      description: 'Array JSON com os diferenciais do Dr. Thales.',
    },

    // ===== SOBRE — educação =====
    {
      key: 'sobre.education.items',
      page: 'sobre',
      section: 'education',
      field: 'items',
      value: JSON.stringify(aboutData.education),
      type: 'json' as const,
      label: 'Formação Acadêmica',
      description: 'Array JSON com a formação acadêmica.',
    },

    // AREAS DE ATUACAO — completo (title, subtitle, description, details)
    ...areasDeAtuacao.map(area => ({
      key: `areas.${area.slug}.description`,
      page: 'areas',
      section: area.slug,
      field: 'description',
      value: area.description,
      type: 'textarea' as const,
      label: `${area.title} — Descrição`,
    })),
    ...areasDeAtuacao.map(area => ({
      key: `areas.${area.slug}.title`,
      page: 'areas',
      section: area.slug,
      field: 'title',
      value: area.title,
      type: 'text' as const,
      label: `${area.title} — Título`,
    })),
    ...areasDeAtuacao.map(area => ({
      key: `areas.${area.slug}.subtitle`,
      page: 'areas',
      section: area.slug,
      field: 'subtitle',
      value: area.subtitle,
      type: 'text' as const,
      label: `${area.title} — Subtítulo`,
    })),
    ...areasDeAtuacao.map(area => ({
      key: `areas.${area.slug}.details`,
      page: 'areas',
      section: area.slug,
      field: 'details',
      value: JSON.stringify(area.details),
      type: 'json' as const,
      label: `${area.title} — Detalhes`,
      description: 'Array JSON com os itens de atuação desta área.',
    })),

    // TIMELINE
    {
      key: 'sobre.timeline.items',
      page: 'sobre',
      section: 'timeline',
      field: 'items',
      value: JSON.stringify(timeline),
      type: 'json' as const,
      label: 'Timeline / Trajetória',
      description: 'Array JSON com os itens da timeline do Dr. Thales.',
    },

    // ===== POLÍTICA DE PRIVACIDADE =====
    {
      key: 'privacidade.lastUpdate',
      page: 'privacidade',
      section: 'meta',
      field: 'lastUpdate',
      value: 'março de 2026',
      type: 'text' as const,
      label: 'Última atualização',
    },
    {
      key: 'privacidade.sections',
      page: 'privacidade',
      section: 'content',
      field: 'sections',
      value: JSON.stringify([
        {
          title: '1. Introdução',
          text: 'A Ferri Schoedl Advocacia, inscrita na OAB/SP sob o número 196.377, com sede em São Paulo/SP, está comprometida com a proteção dos dados pessoais de seus clientes, usuários e visitantes, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) e demais normas aplicáveis.\n\nEsta Política descreve como coletamos, utilizamos, armazenamos, compartilhamos e protegemos seus dados pessoais ao acessar nosso site, utilizar nossos serviços, adquirir livros ou cursos, e realizar cadastro em nossa plataforma.',
        },
        {
          title: '2. Dados pessoais coletados',
          text: 'Podemos coletar os seguintes dados pessoais:\n\nDados de identificação: nome completo, CPF, e-mail, telefone e endereço.\n\nDados de navegação: endereço IP, tipo de navegador, páginas acessadas, tempo de permanência e cookies.\n\nDados de transação comercial: informações de pagamento (processadas por terceiros seguros), endereço de entrega, histórico de compras.\n\nDados de cadastro: credenciais de acesso, preferências de comunicação e dados fornecidos em formulários.',
        },
        {
          title: '3. Finalidades do tratamento',
          text: 'Seus dados pessoais são tratados para as seguintes finalidades: prestação de serviços jurídicos e atendimento de consultas; processamento de compras de livros e cursos; envio de comunicações sobre serviços, conteúdos e lançamentos (mediante consentimento); cumprimento de obrigações legais e regulatórias; melhoria da experiência de navegação e do funcionamento do site; prevenção de fraudes e garantia da segurança da plataforma.',
        },
        {
          title: '4. Base legal para o tratamento',
          text: 'O tratamento de dados pessoais é realizado com base nas hipóteses previstas no art. 7º da LGPD, incluindo: consentimento do titular; execução de contrato ou procedimentos preliminares; cumprimento de obrigação legal ou regulatória; exercício regular de direitos em processo judicial; e interesse legítimo do controlador, respeitados os direitos do titular.',
        },
        {
          title: '5. Compartilhamento de dados',
          text: 'Seus dados pessoais podem ser compartilhados com: processadores de pagamento (para viabilizar transações comerciais); serviços de logística (para entrega de livros); ferramentas de análise de navegação (Google Analytics ou similares, mediante consentimento); e autoridades públicas, quando exigido por lei ou decisão judicial.\n\nNão comercializamos, alugamos ou cedemos dados pessoais a terceiros para fins distintos dos aqui descritos.',
        },
        {
          title: '6. Cookies',
          text: 'Utilizamos cookies e tecnologias similares para melhorar a experiência de navegação. Os cookies são classificados em: necessários (funcionamento essencial do site), de análise (compreensão do comportamento do usuário) e de marketing (conteúdo personalizado). Você pode gerenciar suas preferências de cookies a qualquer momento através do banner de consentimento exibido no site.',
        },
        {
          title: '7. Direitos do titular',
          text: 'Nos termos do art. 18 da LGPD, você tem direito a: confirmação da existência de tratamento; acesso aos seus dados; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade dos dados; eliminação dos dados tratados com base no consentimento; informação sobre compartilhamento; informação sobre a possibilidade de não fornecer consentimento e suas consequências; e revogação do consentimento.\n\nPara exercer qualquer destes direitos, entre em contato pelo e-mail indicado na seção de contato deste site.',
        },
        {
          title: '8. Segurança dos dados',
          text: 'Adotamos medidas técnicas e administrativas adequadas para proteger seus dados pessoais contra acessos não autorizados, situações acidentais ou ilícitas de destruição, perda, alteração ou comunicação indevida, incluindo criptografia, controle de acesso e monitoramento contínuo.',
        },
        {
          title: '9. Retenção dos dados',
          text: 'Os dados pessoais serão retidos pelo tempo necessário ao cumprimento das finalidades para as quais foram coletados, inclusive para atender obrigações legais, contábeis ou regulatórias. Dados relacionados a transações comerciais serão mantidos pelo prazo legal aplicável (Código de Defesa do Consumidor, legislação tributária, etc.).',
        },
        {
          title: '10. Encarregado de dados (DPO)',
          text: 'Em caso de dúvidas sobre o tratamento de dados pessoais ou para exercer seus direitos como titular, entre em contato com nosso Encarregado de Proteção de Dados através do e-mail disponível na página de contato deste site.',
        },
        {
          title: '11. Alterações nesta política',
          text: 'Esta Política de Privacidade poderá ser atualizada periodicamente. Recomendamos a consulta regular desta página. Alterações substanciais serão comunicadas por meio do site ou por e-mail, quando aplicável.',
        },
      ]),
      type: 'json' as const,
      label: 'Seções da Política de Privacidade',
      description: 'Array JSON com título e texto de cada seção.',
    },

    // ===== TERMOS DE USO =====
    {
      key: 'termos.lastUpdate',
      page: 'termos',
      section: 'meta',
      field: 'lastUpdate',
      value: 'março de 2026',
      type: 'text' as const,
      label: 'Última atualização',
    },
    {
      key: 'termos.sections',
      page: 'termos',
      section: 'content',
      field: 'sections',
      value: JSON.stringify([
        {
          title: '1. Aceitação dos termos',
          text: 'Ao acessar e utilizar o site da Ferri Schoedl Advocacia, você concorda integralmente com estes Termos de Uso. Caso não concorde, orientamos que não utilize o site. O uso continuado após alterações constitui aceitação dos termos atualizados.',
        },
        {
          title: '2. Descrição dos serviços',
          text: 'Este site tem caráter institucional e informativo, apresentando os serviços jurídicos do escritório Ferri Schoedl Advocacia. Adicionalmente, o site disponibiliza a venda de livros e, futuramente, cursos e materiais educacionais, bem como cadastro de usuários para acesso a conteúdos e funcionalidades específicas.',
        },
        {
          title: '3. Conteúdo informativo',
          text: 'As informações disponibilizadas neste site possuem caráter meramente informativo e não constituem aconselhamento jurídico, parecer ou consultoria. A relação advogado-cliente somente se estabelece mediante contratação formal dos serviços.',
        },
        {
          title: '4. Compra de livros e cursos',
          text: 'As compras realizadas pelo site estão sujeitas às seguintes condições: os preços estão em Reais (BRL) e podem ser alterados sem aviso prévio; o pagamento é processado por operadoras terceiras que possuem suas próprias políticas de segurança; após a confirmação do pagamento, o prazo de entrega será informado de acordo com a opção de frete selecionada.\n\nNos termos do art. 49 do Código de Defesa do Consumidor (Lei 8.078/90), o consumidor pode desistir da compra no prazo de 7 (sete) dias a contar do recebimento do produto, mediante comunicação por e-mail. Nesse caso, os valores pagos serão integralmente devolvidos, incluindo o frete.',
        },
        {
          title: '5. Cadastro de usuário',
          text: 'Para acessar determinadas funcionalidades, poderá ser necessário o cadastro com informações verdadeiras e atualizadas. O usuário é responsável pela confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.',
        },
        {
          title: '6. Propriedade intelectual',
          text: 'Todo o conteúdo do site — textos, imagens, logotipos, layout, artigos e materiais didáticos — é protegido por direitos autorais e propriedade intelectual. É proibida a reprodução, distribuição ou modificação sem autorização prévia e expressa.',
        },
        {
          title: '7. Código de Ética da OAB',
          text: 'Este site observa rigorosamente as disposições do Código de Ética e Disciplina da OAB (Resolução 02/2015 do CFOAB) e do Provimento 205/2021 do CFOAB, que regulamenta a publicidade na advocacia. O conteúdo aqui disponibilizado possui caráter informativo e não configura captação de clientela.',
        },
        {
          title: '8. Limitação de responsabilidade',
          text: 'A Ferri Schoedl Advocacia não se responsabiliza por danos decorrentes do uso ou impossibilidade de uso do site, incluindo interrupções, erros técnicos ou indisponibilidade temporária. O site é disponibilizado "como está", sem garantias expressas ou implícitas quanto à disponibilidade contínua.',
        },
        {
          title: '9. Legislação aplicável e foro',
          text: 'Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o Foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.',
        },
        {
          title: '10. Contato',
          text: 'Para dúvidas, solicitações ou exercício de direitos relacionados a estes Termos, utilize os canais de contato disponíveis na página de Contato deste site.',
        },
      ]),
      type: 'json' as const,
      label: 'Seções dos Termos de Uso',
      description: 'Array JSON com título e texto de cada seção.',
    },

    // ===== PUBLICAÇÕES — Vitórias Jurídicas =====
    {
      key: 'publicacoes.vitorias',
      page: 'publicacoes',
      section: 'vitorias',
      field: 'items',
      value: JSON.stringify([
        {
          titulo: 'Indenização contra a Rede Record',
          instancia: 'STJ — 3ª Turma',
          descricao:
            'Condenação mantida ao pagamento de R$ 200 mil por danos morais decorrentes de exposição sensacionalista.',
        },
        {
          titulo: 'Vitória contra a Editora Abril / Revista Veja',
          instancia: 'Justiça de São Paulo',
          descricao:
            'Indenização por publicações injuriosas que divulgaram informações equivocadas.',
        },
        {
          titulo: 'Condenação do Jornal O Estado de S. Paulo',
          instancia: '35ª Vara Cível de São Paulo',
          descricao:
            'Indenização por danos morais devido a publicações difamatórias.',
        },
      ]),
      type: 'json' as const,
      label: 'Vitórias Jurídicas',
      description:
        'Array JSON com as vitórias jurídicas exibidas na página de publicações.',
    },
  ];

  const result = await SiteContent.insertMany(contentItems);
  console.log(`✅ ${result.length} conteúdos do site inseridos com sucesso.`);
  return { skipped: false, count: result.length };
}

// ===== SEED ADMIN USER =====
export async function seedAdminUser() {
  await dbConnect();

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log('⏭️  Admin já existe. Pulando seed.');
    return { skipped: true };
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'thales@ferrischoedl.adv.br';
  const adminPassword = process.env.ADMIN_PASSWORD || 'FerriSchoedl2024!';

  await User.create({
    name: 'Dr. Thales Ferri Schoedl',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });

  console.log(`✅ Admin criado: ${adminEmail}`);
  return { skipped: false, email: adminEmail };
}

// ===== RUN ALL SEEDS =====
export async function seedAll(force = false) {
  console.log(
    force
      ? '🌱 Iniciando RESEED FORÇADO...\n'
      : '🌱 Iniciando seed completo...\n',
  );

  const admin = await seedAdminUser();
  const books = await seedBooks(force);
  const articles = await seedArticles(force);
  const content = await seedSiteContent(force);

  console.log('\n🎉 Seed completo!');
  return { admin, books, articles, content };
}
