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

    // AREAS DE ATUACAO (descriptions only — icons/slugs stay in code)
    ...areasDeAtuacao.map(area => ({
      key: `areas.${area.slug}.description`,
      page: 'areas',
      section: area.slug,
      field: 'description',
      value: area.description,
      type: 'textarea' as const,
      label: `${area.title} — Descrição`,
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
