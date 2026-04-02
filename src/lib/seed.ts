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
