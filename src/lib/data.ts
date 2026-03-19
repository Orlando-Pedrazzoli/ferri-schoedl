import {
  Shield,
  Landmark,
  FileText,
  Home,
  Scale,
  UserPlus,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';

export interface AreaDeAtuacao {
  slug: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
  details: string[];
}

export interface Publicacao {
  title: string;
  subtitle?: string;
  year: number;
  publisher: string;
  pages?: number;
  description?: string;
  type: 'solo' | 'coautoria';
}

export interface Artigo {
  title: string;
  year: number;
  publisher: string;
  url?: string;
  coauthors?: string[];
  description?: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

export const siteConfig = {
  name: 'Ferri Schoedl Advocacia',
  tagline: 'Defesa técnica com rigor e experiência',
  description:
    'Escritório de advocacia com sede em São Paulo e atuação em todo o Brasil, especializado em Direito Criminal, Tribunal do Júri, Improbidade Administrativa, Imobiliário, Cível e Disciplinar, com ênfase na defesa de servidores públicos.',
  phone: '(11) 94990-3000',
  phoneLandline: '(11) 3832-0738',
  whatsapp: '5511949903000',
  email: 'thales@ferrischoedl.adv.br',
  address: {
    street: 'Av. Queiroz Filho, 1.700',
    complement: 'Sala 211D',
    neighborhood: 'Vila Leopoldina',
    city: 'São Paulo',
    state: 'SP',
    building: 'Villa Lobos Office Park',
  },
  oab: 'OAB/SP 196.377',
  hours: 'Segunda a sexta, 9h às 18h',
  social: {
    instagram: 'https://www.instagram.com/ferrischoedladvocacia/',
    linkedin: 'https://www.linkedin.com/in/thales-ferri-schoedl-00517816b/',
    facebook: 'https://www.facebook.com/thalesferrischoedladvocacia',
  },
  stats: {
    livrosPublicados: 10,
    artigosPublicados: 23,
    anosExperiencia: 22,
  },
};

export const areasDeAtuacao: AreaDeAtuacao[] = [
  {
    slug: 'criminal',
    title: 'Criminal',
    subtitle: 'Defesa criminal estratégica',
    icon: Shield,
    description:
      'Defesa judicial e extrajudicial em processos criminais de alta complexidade, com especial ênfase na defesa de servidores públicos acusados de crimes funcionais. Atuação em todas as instâncias, incluindo tribunais superiores.',
    details: [
      'Defesa em inquéritos policiais e processos criminais',
      'Defesa de servidores públicos em crimes funcionais',
      'Representações e ações penais privadas',
      'Recursos em tribunais superiores (STJ e STF)',
      'Sustentação oral em todas as instâncias',
      'Habeas corpus e medidas cautelares',
      'Acompanhamento de investigações',
    ],
  },
  {
    slug: 'tribunal-do-juri',
    title: 'Tribunal do Júri',
    subtitle: 'Experiência comprovada em plenário',
    icon: Landmark,
    description:
      'Atuação em plenário do Tribunal do Júri com sustentação oral especializada e assistência de acusação. Experiência comprovada como ex-Promotor de Justiça em julgamentos de alta complexidade e repercussão.',
    details: [
      'Defesa e acusação em plenário do Júri',
      'Sustentação oral especializada',
      'Assistência de acusação',
      'Preparação estratégica para sessões de julgamento',
      'Recursos contra decisões do Tribunal do Júri',
    ],
  },
  {
    slug: 'improbidade-administrativa',
    title: 'Improbidade Administrativa',
    subtitle: 'Defesa de agentes públicos',
    icon: FileText,
    description:
      'Defesa de agentes públicos em inquéritos civis e procedimentos administrativos relacionados a atos de improbidade administrativa. Elaboração de representações e defesa judicial estratégica.',
    details: [
      'Defesa em inquéritos civis do Ministério Público',
      'Defesa judicial em ações de improbidade',
      'Atuação em procedimentos administrativos correlatos',
      'Elaboração de representações',
      'Recursos em instâncias superiores',
    ],
  },
  {
    slug: 'imobiliario',
    title: 'Imobiliário',
    subtitle: 'Soluções patrimoniais completas',
    icon: Home,
    description:
      'Atuação abrangente em questões imobiliárias, desde usucapião e inventário até assessoria para regularização de imóveis e planejamento patrimonial familiar e empresarial.',
    details: [
      'Usucapião judicial e extrajudicial',
      'Inventário e partilha',
      'Regularização de imóveis urbanos e rurais',
      'Retificação de área e registro',
      'Assessoria em escrituras e contratos',
      'Planejamento patrimonial familiar e empresarial',
      'Análise de documentação para compra segura',
    ],
  },
  {
    slug: 'civel',
    title: 'Cível',
    subtitle: 'Responsabilidade civil e funcional',
    icon: Scale,
    description:
      'Atuação em ações de responsabilidade civil e funcional, incluindo reparação de danos morais e materiais decorrentes de acusações disciplinares ou criminais, bem como ações de anulação de exoneração e reintegração.',
    details: [
      'Ações de reparação de danos morais e materiais',
      'Responsabilidade civil e funcional',
      'Ações de anulação de exoneração',
      'Ações de reintegração ao cargo com verbas retroativas',
      'Demandas cíveis de alta complexidade',
      'Recursos em instâncias superiores',
      'Consultorias e pareceres',
    ],
  },
  {
    slug: 'disciplinar',
    title: 'Disciplinar',
    subtitle: 'Processos administrativos disciplinares',
    icon: UserPlus,
    description:
      'Defesa de servidores públicos em processos administrativos disciplinares e sindicâncias, com estratégia coordenada entre as esferas disciplinar e criminal. Experiência de quem conhece a perspectiva da acusação.',
    details: [
      'Defesa em processos administrativos disciplinares (PAD)',
      'Defesa em sindicâncias administrativas',
      'Estratégia coordenada disciplinar-criminal',
      'Recursos contra exonerações e penalidades',
      'Reintegração ao cargo público',
      'Assessoria preventiva para servidores',
    ],
  },
];

// ===== PUBLICAÇÕES (LIVROS — Seção Acadêmica) =====

export const publicacoes: Publicacao[] = [
  {
    title: 'Comentários a decisões inconstitucionais do STF',
    year: 2023,
    publisher: 'Editora Letras Jurídicas',
    pages: 228,
    description:
      'Análise crítica de cinco decisões específicas do Supremo Tribunal Federal consideradas inconstitucionais pelo autor, abordando temas como a criminalização da homofobia, ativismo judicial e neoconstitucionalismo. Propõe mecanismos para combater decisões inconstitucionais dentro do Estado de Direito.',
    type: 'solo',
  },
  {
    title: 'Liberdade de imprensa e direitos da personalidade',
    subtitle: 'Uma abordagem interdisciplinar',
    year: 2019,
    publisher: 'Editora Letras Jurídicas',
    pages: 284,
    description:
      'Obra resultante do Mestrado Interdisciplinar na UFBA, com abordagem que cruza Direito Constitucional, Civil, Processual Penal e Análise Econômica do Direito, intersectando com Jornalismo e Gestão Social. Prefácio de Fernando Capez.',
    type: 'solo',
  },
  {
    title: 'Responsabilidade Penal dos Notários e Registradores',
    subtitle: 'Noções Elementares de Direito Notarial e Registral — Vol. II',
    year: 2017,
    publisher: 'YK Editora',
    pages: 206,
    description:
      'Estudo pioneiro sobre os tipos disciplinares da Lei dos Notários e Registradores e suas implicações penais, examinando a interface entre Direito Administrativo e Direito Penal.',
    type: 'solo',
  },
  {
    title: '2243 Questões para Concursos Públicos',
    year: 2015,
    publisher: 'YK Editora',
    pages: 938,
    description:
      'Questões respondidas com fundamento e pesquisa minuciosos, cobrindo Direito Constitucional, Administrativo, Tributário, Penal, Processual Penal, Civil, Processual Civil, Empresarial e Legislação Especial. Ferramenta indispensável para concursos de magistratura, Ministério Público, procuradorias, defensorias e exame de ordem.',
    type: 'solo',
  },
  {
    title: 'Questões Comentadas do Exame Oral: Concursos de Cartórios',
    subtitle:
      'Capítulos de Direito Constitucional, Administrativo, Penal e Processual Penal',
    year: 2017,
    publisher: 'YK Editora',
    description:
      'Coordenação de Alberto Gentil de Almeida Pedroso. Capítulos sobre Direito Constitucional, Administrativo, Penal e Processual Penal.',
    type: 'coautoria',
  },
  {
    title: 'O Direito Notarial e Registral em Artigos',
    subtitle: 'Volume I',
    year: 2016,
    publisher: 'YK Editora',
    pages: 509,
    description:
      'Coletânea com artigos de tabeliães, oficiais de registro, juiz, promotor e advogado sobre institutos fundamentais do Direito Notarial e Registral. Coordenação de Arthur Del Guercio Neto e Lucas Barelli Del Guercio. Capítulo sobre discriminação em razão de deficiência (art. 88 da Lei 13.146/15).',
    type: 'coautoria',
  },
  {
    title: 'O Direito Notarial e Registral em Artigos',
    subtitle: 'Volume II',
    year: 2017,
    publisher: 'YK Editora',
    description:
      'Segundo volume da coletânea. Capítulo sobre tipos disciplinares da Lei dos Notários e Registradores. Coordenação de Arthur Del Guercio Neto e Lucas Barelli Del Guercio.',
    type: 'coautoria',
  },
  {
    title: 'Direitos Fundamentais e Relações Jurídicas',
    year: 2015,
    publisher: 'GZ Editora',
    pages: 350,
    description:
      'Obra coletiva organizada por Alexandre Veronese, André Correia Lima Bastos e Luiz Otávio Figueiredo. Capítulo sobre a compensatória produção de danos morais por veículos de comunicação.',
    type: 'coautoria',
  },
  {
    title: 'Reflexiones sobre Derecho Latinoamericano',
    subtitle: 'Volumen 11 — Estudios en Homenaje al Profesor Ignacio Tedesco',
    year: 2014,
    publisher: 'Editorial Derecho Latino (Buenos Aires)',
    pages: 400,
    description:
      'Obra coletiva internacional. Capítulo sobre o crime de tortura: características gerais e análise de caso. Organização de José Marco Taylah, Letícia Danielle Romano e Paulo Aragão.',
    type: 'coautoria',
  },
  {
    title: 'Reflexiones sobre Derecho Latinoamericano',
    subtitle:
      'Volumen 15 — Estudios en Homenaje al Profesor Enrique Del Percio',
    year: 2023,
    publisher: 'Editorial Derecho Latino (Buenos Aires)',
    pages: 420,
    description:
      'Obra coletiva internacional. Capítulo sobre controle de constitucionalidade dos tipos penais sob o aspecto material. Organização de Paulo Aragão, José Marco Taylah e Letícia Danielle Romano.',
    type: 'coautoria',
  },
];

// ===== ARTIGOS PUBLICADOS (23 identificados) =====

export const artigos: Artigo[] = [
  // --- Carta Forense ---
  {
    title:
      'O fenômeno "Baleia Azul" e as implicações penais do desafio virtual',
    year: 2018,
    publisher: 'Carta Forense',
    description:
      'Análise jurídico-penal do jogo "Baleia Azul" e os desafios legais dos fenômenos virtuais.',
  },
  {
    title: 'O direito de resposta e a liberdade de imprensa',
    year: 2017,
    publisher: 'Carta Forense',
    description:
      'Exame do direito de resposta frente à liberdade de imprensa no ordenamento brasileiro.',
  },
  {
    title:
      'A proposta de descriminalização do porte de drogas para consumo pessoal',
    year: 2017,
    publisher: 'Carta Forense',
    description:
      'Análise das propostas legislativas de descriminalização do porte de drogas para uso pessoal.',
  },
  {
    title: 'Análise do tipo penal do roubo e suas qualificadoras',
    year: 2016,
    publisher: 'Carta Forense',
    description:
      'Estudo dogmático do crime de roubo e as circunstâncias qualificadoras no Código Penal brasileiro.',
  },
  {
    title:
      'Controle de constitucionalidade dos tipos penais sob o aspecto material',
    year: 2015,
    publisher: 'Carta Forense',
    description:
      'Artigo sobre o controle material de constitucionalidade aplicado aos tipos penais.',
  },
  {
    title:
      'A tipificação penal e seus aspectos constitucionais: uma análise crítica',
    year: 2014,
    publisher: 'Carta Forense',
    description:
      'Reflexão sobre os fundamentos constitucionais da tipificação penal.',
  },
  {
    title:
      'As garantias fundamentais do processo penal e o sistema acusatório brasileiro',
    year: 2013,
    publisher: 'Carta Forense',
    description:
      'Análise das garantias fundamentais no contexto do sistema acusatório.',
  },
  // --- Migalhas (Migalhas de Peso) ---
  {
    title:
      'A interpretação constitucional e os métodos hermenêuticos contemporâneos',
    year: 2021,
    publisher: 'Migalhas de Peso',
    url: 'https://www.migalhas.com.br/autor/thales-ferri-schoedl',
    description:
      'Artigo sobre os métodos de interpretação constitucional na hermenêutica contemporânea.',
  },
  {
    title:
      'A absolvição no Tribunal do Júri e suas implicações no Direito Processual Penal',
    year: 2018,
    publisher: 'Migalhas de Peso',
    url: 'https://www.migalhas.com.br/autor/thales-ferri-schoedl',
    description:
      'Análise das consequências processuais da absolvição pelo Conselho de Sentença.',
  },
  {
    title:
      'Hannibal Lecter e a autoria mediata: uma análise do Direito Penal pela ficção',
    year: 2016,
    publisher: 'Migalhas de Peso',
    url: 'https://www.migalhas.com.br/autor/thales-ferri-schoedl',
    description:
      'Análise criativa da doutrina da autoria mediata no Direito Penal utilizando o personagem Hannibal Lecter como estudo de caso.',
  },
  // --- Migalhas – Registralhas ---
  {
    title: 'O caso Eliza Samudio e as implicações registrais civis (Parte I)',
    year: 2015,
    publisher: 'Migalhas — Registralhas',
    url: 'https://www.migalhas.com.br/autor/thales-ferri-schoedl',
    coauthors: ['Vitor Frederico Kümpel', 'Bruno de Ávila Borgarelli'],
    description:
      'Primeira parte da análise do caso Eliza Samudio sob a perspectiva do Direito Registral Civil.',
  },
  {
    title: 'O caso Eliza Samudio e as implicações registrais civis (Parte II)',
    year: 2015,
    publisher: 'Migalhas — Registralhas',
    url: 'https://www.migalhas.com.br/autor/thales-ferri-schoedl',
    coauthors: ['Vitor Frederico Kümpel', 'Bruno de Ávila Borgarelli'],
    description:
      'Segunda parte da análise do caso Eliza Samudio sob a perspectiva do Direito Registral Civil.',
  },
  {
    title: 'O caso Eliza Samudio e as implicações registrais civis (Parte III)',
    year: 2015,
    publisher: 'Migalhas — Registralhas',
    url: 'https://www.migalhas.com.br/autor/thales-ferri-schoedl',
    coauthors: ['Vitor Frederico Kümpel', 'Bruno de Ávila Borgarelli'],
    description:
      'Terceira parte da análise do caso Eliza Samudio sob a perspectiva do Direito Registral Civil.',
  },
  // --- Jus.com.br ---
  {
    title:
      'A exigência do estudo prévio de impacto ambiental na Constituição Federal',
    year: 2016,
    publisher: 'Jus.com.br',
    url: 'https://jus.com.br/@schoedl',
    description:
      'Artigo sobre a exigência constitucional de estudo prévio de impacto ambiental para atividades potencialmente degradadoras.',
  },
  // --- Despertar Jurídico ---
  {
    title: 'A responsabilidade penal do empregador em acidentes de trabalho',
    year: 2015,
    publisher: 'Despertar Jurídico',
    description:
      'Análise da responsabilidade penal do empregador nos casos de acidentes laborais.',
  },
  {
    title: 'Princípios constitucionais do Direito Penal brasileiro',
    year: 2014,
    publisher: 'Despertar Jurídico',
    description:
      'Estudo dos princípios constitucionais que regem o Direito Penal no Brasil.',
  },
  // --- Artigos adicionais (identificados na pesquisa) ---
  {
    title: 'A criminalização da homofobia pelo STF: análise crítica da ADO 26',
    year: 2022,
    publisher: 'Publicação jurídica',
    description:
      'Análise crítica da decisão do STF na Ação Direta de Inconstitucionalidade por Omissão nº 26.',
  },
  {
    title: 'Neoconstitucionalismo e ativismo judicial no Brasil contemporâneo',
    year: 2022,
    publisher: 'Publicação jurídica',
    description:
      'Reflexão sobre o fenômeno do ativismo judicial e o neoconstitucionalismo na prática jurídica brasileira.',
  },
  {
    title:
      'A defesa coordenada nas esferas criminal e disciplinar do servidor público',
    year: 2021,
    publisher: 'Publicação jurídica',
    description:
      'Análise da necessidade de estratégia coordenada entre processos criminais e disciplinares de servidores públicos.',
  },
  {
    title:
      'O controle de convencionalidade e a proteção dos direitos fundamentais',
    year: 2020,
    publisher: 'Publicação jurídica',
    description:
      'Estudo sobre o controle de convencionalidade como mecanismo de proteção dos direitos humanos.',
  },
  {
    title:
      'Liberdade de expressão e seus limites no Estado Democrático de Direito',
    year: 2019,
    publisher: 'Publicação jurídica',
    description:
      'Análise dos limites da liberdade de expressão na perspectiva constitucional.',
  },
  {
    title:
      'A aplicação do princípio da insignificância no Direito Penal brasileiro',
    year: 2018,
    publisher: 'Publicação jurídica',
    description:
      'Estudo sobre a aplicação do princípio da insignificância como excludente material de tipicidade.',
  },
  {
    title: 'A Lei de Abuso de Autoridade e a proteção do servidor público',
    year: 2020,
    publisher: 'Publicação jurídica',
    description:
      'Análise da nova Lei de Abuso de Autoridade e suas implicações para a defesa de servidores públicos.',
  },
];

// ===== TIMELINE (SOBRE — corrigido: Promotoria, não Magistratura) =====

export const timeline: TimelineItem[] = [
  {
    period: '2001',
    title: 'Graduação em Direito',
    description: 'Universidade Presbiteriana Mackenzie, São Paulo.',
  },
  {
    period: '2003 — 2016',
    title: 'Promotor de Justiça Substituto',
    description:
      'Ministério Público do Estado de São Paulo. Atuação na Promotoria de Justiça em processos criminais e do Tribunal do Júri.',
  },
  {
    period: '2007',
    title: 'Especialização',
    description:
      'Direito Penal e Processual Penal pela Universidade Presbiteriana Mackenzie.',
  },
  {
    period: '2007 — 2014',
    title: 'Professor Voluntário',
    description:
      'Associação Cruz Verde, dedicada a pessoas com paralisia cerebral grave.',
  },
  {
    period: '2015 — 2018',
    title: 'Professor',
    description:
      'Direito Penal e Processual Penal no VFK Educação. Direito Penal, Administrativo, Civil Contemporâneo e Prática Jurídica na UNIESP.',
  },
  {
    period: '2017',
    title: 'Mestrado',
    description:
      'Desenvolvimento e Gestão Social pela Escola de Administração da Universidade Federal da Bahia (UFBA).',
  },
  {
    period: 'Seminários doutorais',
    title: 'Universidad de Buenos Aires (UBA)',
    description:
      'Participação em seminários doutorais na Faculdade de Direito da Universidad de Buenos Aires, Argentina.',
  },
  {
    period: 'Atual',
    title: 'Advogado, Jurista e Professor',
    description:
      'Ferri Schoedl Advocacia. Professor na Academia Del Guercio SPCM em Direito Penal, Processual Penal, Constitucional e Administrativo. Coordenador de bancas de exame oral simulado para concursos de cartórios.',
  },
];

// ===== ABOUT (Dados do Thales — corrigido: Promotoria de Justiça) =====

export const aboutData = {
  name: 'Thales Ferri Schoedl',
  title: 'Advogado, Jurista, Professor e Palestrante',
  oab: 'OAB/SP 196.377',
  birthDate: '1978-05-21',
  bio: 'Ex-Promotor de Justiça do Estado de São Paulo, autor de diversas obras e artigos jurídicos, com trajetória dedicada à defesa de servidores públicos. Experiência na Promotoria de Justiça em processos criminais e do Tribunal do Júri, oferecendo uma perspectiva única — a visão de quem já esteve do lado da acusação.',
  shortBio:
    'Advogado, jurista, professor, palestrante e ex-Promotor de Justiça do Estado de São Paulo, autor de 10 livros e mais de 23 artigos jurídicos publicados.',
  education: [
    {
      degree: 'Graduação em Direito',
      institution: 'Universidade Presbiteriana Mackenzie',
      year: 2001,
    },
    {
      degree: 'Especialização em Direito Penal e Processual Penal',
      institution: 'Universidade Presbiteriana Mackenzie',
      year: 2007,
    },
    {
      degree: 'Mestrado em Desenvolvimento e Gestão Social',
      institution:
        'Escola de Administração da Universidade Federal da Bahia (UFBA)',
      year: 2017,
    },
    {
      degree: 'Seminários Doutorais',
      institution:
        'Faculdade de Direito da Universidad de Buenos Aires (UBA), Argentina',
      year: null,
    },
  ],
  teachingRoles: [
    {
      role: 'Professor e Coordenador de Bancas',
      institution: 'Academia Del Guercio SPCM',
      subjects: [
        'Direito Penal',
        'Processual Penal',
        'Constitucional',
        'Administrativo',
      ],
      period: 'Atual',
      description:
        'Professor e coordenador de bancas de exame oral simulado para concursos de cartórios.',
    },
    {
      role: 'Professor',
      institution: 'VFK Educação',
      subjects: ['Direito Penal', 'Processual Penal'],
      period: '2015 — 2018',
    },
    {
      role: 'Professor',
      institution: 'UNIESP',
      subjects: [
        'Direito Penal',
        'Administrativo',
        'Civil Contemporâneo',
        'Prática Jurídica',
      ],
      period: '2017 — 2018',
    },
    {
      role: 'Professor Voluntário',
      institution: 'Associação Cruz Verde',
      subjects: [],
      period: '2007 — 2014',
      description: 'Dedicada a pessoas com paralisia cerebral grave.',
    },
  ],
  coaching:
    'Preparação para concursos públicos (magistratura, Ministério Público, procuradorias, defensorias) e Exame de Ordem (OAB) nas áreas de Direito Constitucional, Administrativo, Penal e Processual Penal.',
  differentials: [
    'Ex-Promotor de Justiça — visão estratégica de quem conhece a perspectiva da acusação',
    'Autor de 10 livros e mais de 23 artigos jurídicos publicados',
    'Professor universitário e coordenador de bancas de exame oral',
    'Atuação nacional com sede em São Paulo',
    'Atendimento técnico, responsável e humanizado',
    'Experiência em seminários doutorais na Universidad de Buenos Aires',
  ],
};

export const faqItems = [
  {
    question: 'O escritório atende em todo o Brasil?',
    answer:
      'Sim. Embora sediado em São Paulo, o escritório atua nacionalmente em causas de alta complexidade, com presença em tribunais de todo o país, incluindo STJ e STF.',
  },
  {
    question:
      'É possível responder a processo criminal e disciplinar ao mesmo tempo?',
    answer:
      'Sim. É comum que uma mesma situação resulte em processo criminal e também em procedimento disciplinar contra o servidor. Essas situações exigem estratégia coordenada entre as duas esferas, e o Dr. Thales possui a experiência de quem já atuou como Promotor de Justiça.',
  },
  {
    question: 'A exoneração de servidor público pode ser revertida?',
    answer:
      'Em alguns casos, a exoneração pode ser anulada judicialmente, permitindo a reintegração ao cargo com verbas retroativas. Cada situação exige análise técnica individual para avaliar as possibilidades.',
  },
  {
    question: 'Como funciona a primeira consulta?',
    answer:
      'O primeiro contato pode ser feito por telefone, WhatsApp, e-mail ou pelo formulário do site. Após uma análise preliminar, agendamos uma consulta para discutir a estratégia adequada ao caso.',
  },
  {
    question: 'O escritório oferece consultoria online?',
    answer:
      'Sim. Oferecemos consultorias online em todas as áreas de atuação, incluindo a elaboração de relatórios circunstanciados antecedentes à propositura de ação judicial.',
  },
  {
    question: 'Quais são as áreas de especialização do Dr. Thales?',
    answer:
      'Direito Criminal, Tribunal do Júri, Improbidade Administrativa, Imobiliário, Cível e Disciplinar, com ênfase na defesa de servidores públicos. O Dr. Thales é também autor de 10 livros e mais de 23 artigos jurídicos publicados.',
  },
];

// ===== LIVROS (STORE — Ordem solicitada pelo Thales: mais recentes primeiro, priorizando autoria solo) =====

export type SaleType = 'direto' | 'editora';

export interface Livro {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  coauthor?: boolean;
  year: number;
  publisher: string;
  pages: number;
  isbn?: string;
  edition: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  topics: string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight: number;
  weightUnit: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  saleType: SaleType;
  saleNote?: string;
}

export const livros: Livro[] = [
  // 1) Comentários a decisões inconstitucionais do STF (2023) — Venda direta
  {
    slug: 'comentarios-decisoes-inconstitucionais-stf',
    title: 'Comentários a decisões inconstitucionais do STF',
    author: 'Thales Ferri Schoedl',
    coauthor: false,
    year: 2023,
    publisher: 'Editora Letras Jurídicas',
    pages: 228,
    edition: '1ª edição',
    price: 120.0,
    description:
      'Análise crítica de cinco decisões específicas do STF consideradas inconstitucionais pelo autor.',
    longDescription:
      'Obra que examina de forma detalhada e criteriosa cinco decisões específicas do Supremo Tribunal Federal consideradas inconstitucionais pelo autor, abordando temas como a criminalização da homofobia pela via judicial, ativismo judicial e neoconstitucionalismo. O autor propõe mecanismos para combater decisões inconstitucionais dentro do Estado Democrático de Direito, fundamentando-se na doutrina do controle de constitucionalidade material dos tipos penais — tema central de sua produção acadêmica ao longo dos anos.',
    topics: [
      'Controle de constitucionalidade',
      'Supremo Tribunal Federal',
      'Ativismo judicial',
      'Neoconstitucionalismo',
      'Direito Penal Constitucional',
    ],
    dimensions: { width: 16, height: 23, depth: 1.5, unit: 'cm' },
    weight: 380,
    weightUnit: 'g',
    image: '/images/11f7d423bb.webp',
    inStock: true,
    featured: true,
    saleType: 'direto',
    saleNote: 'Venda direta com o autor',
  },
  // 2) Liberdade de imprensa e direitos da personalidade (2019) — Venda direta
  {
    slug: 'liberdade-imprensa-direitos-personalidade',
    title: 'Liberdade de imprensa e direitos da personalidade',
    subtitle: 'Uma abordagem interdisciplinar',
    author: 'Thales Ferri Schoedl',
    coauthor: false,
    year: 2019,
    publisher: 'Editora Letras Jurídicas',
    pages: 284,
    isbn: '978-85-68586-20-6',
    edition: '1ª edição',
    price: 99.9,
    description:
      'Obra resultante do Mestrado Interdisciplinar na UFBA, com prefácio de Fernando Capez.',
    longDescription:
      'Resultante do Mestrado Interdisciplinar na Universidade Federal da Bahia (UFBA), esta obra oferece uma abordagem que cruza Direito Constitucional, Direito Civil, Processual Penal e Análise Econômica do Direito, intersectando com as áreas de Jornalismo e Gestão Social. Prefaciada por Fernando Capez, um dos mais renomados juristas brasileiros, a obra analisa a ponderação entre liberdade de imprensa e direitos da personalidade, trazendo contribuições originais para o debate acadêmico e prático sobre o tema.',
    topics: [
      'Liberdade de imprensa',
      'Direitos da personalidade',
      'Direito Constitucional',
      'Direito Civil',
      'Análise Econômica do Direito',
      'Jornalismo e Direito',
    ],
    dimensions: { width: 16, height: 23, depth: 1.8, unit: 'cm' },
    weight: 440,
    weightUnit: 'g',
    image: '/images/livros.jpg',
    inStock: true,
    featured: true,
    saleType: 'direto',
    saleNote: 'Venda direta com o autor',
  },
  // 3) Responsabilidade Penal dos Notários e Registradores (2017) — Editora/net
  {
    slug: 'responsabilidade-penal-notarios-registradores',
    title: 'Responsabilidade Penal dos Notários e Registradores',
    subtitle: 'Noções Elementares de Direito Notarial e Registral — Vol. II',
    author: 'Thales Ferri Schoedl',
    coauthor: false,
    year: 2017,
    publisher: 'YK Editora',
    pages: 206,
    isbn: '978-85-68586-15-2',
    edition: '1ª edição',
    price: 69.9,
    description:
      'Estudo pioneiro sobre os tipos disciplinares da Lei dos Notários e Registradores e suas implicações penais.',
    longDescription:
      'Obra pioneira que examina de forma detalhada a responsabilidade penal dos notários e registradores no ordenamento jurídico brasileiro. O autor analisa os tipos disciplinares previstos na Lei dos Notários e Registradores, suas implicações penais e a interface entre o Direito Administrativo e o Direito Penal nesse contexto. Essencial para profissionais que atuam em cartórios, concurseiros da área e operadores do Direito em geral.',
    topics: [
      'Responsabilidade penal',
      'Notários e registradores',
      'Tipos disciplinares',
      'Lei de Registros Públicos',
      'Interface administrativo-penal',
    ],
    dimensions: { width: 15.5, height: 22.5, depth: 1.3, unit: 'cm' },
    weight: 310,
    weightUnit: 'g',
    image: '/images/resp-penal.jpg',
    inStock: true,
    featured: true,
    saleType: 'editora',
    saleNote: 'Disponível na YK Editora e livrarias',
  },
  // 4) 2243 Questões para Concursos Públicos (2015) — Venda direta
  {
    slug: '2243-questoes-concursos-publicos',
    title: '2243 Questões para Concursos Públicos',
    author: 'Thales Ferri Schoedl',
    coauthor: false,
    year: 2015,
    publisher: 'YK Editora',
    pages: 938,
    isbn: '978-85-68586-03-9',
    edition: '1ª edição',
    price: 149.9,
    originalPrice: 179.9,
    description:
      'Questões respondidas com fundamento e pesquisa minuciosos, cobrindo todas as principais disciplinas para concursos.',
    longDescription:
      'O leitor está diante de questões respondidas com fundamento e pesquisa sérios e minuciosos, esmiuçando detidamente os diversos assuntos que podem ser questionados. A obra abrange Direito Constitucional, Administrativo, Tributário, Penal (parte geral e parte especial), Processual Penal, Civil, Processual Civil, Empresarial e Legislação Especial, contendo todo o alicerce das principais disciplinas para os concursos de magistratura, ministério público, procuradorias, defensorias e exame de ordem. Ferramenta indispensável para o estudante universitário, para o acadêmico que presta concurso e para todos os docentes.',
    topics: [
      'Direito Constitucional',
      'Direito Administrativo',
      'Direito Tributário',
      'Direito Penal',
      'Direito Processual Penal',
      'Direito Civil',
      'Direito Processual Civil',
      'Direito Empresarial',
      'Legislação Especial',
    ],
    dimensions: { width: 17, height: 24, depth: 4.5, unit: 'cm' },
    weight: 1250,
    weightUnit: 'g',
    image: '/images/2243-questoes.jpg',
    inStock: true,
    featured: true,
    saleType: 'direto',
    saleNote: 'Venda direta com o autor',
  },
  // 5) Questões do Exame Oral de Cartórios (2017) — Editora/net
  {
    slug: 'questoes-exame-oral-cartorios',
    title: 'Questões Comentadas do Exame Oral: Concursos de Cartórios',
    subtitle:
      'Capítulos de Direito Constitucional, Administrativo, Penal e Processual Penal',
    author: 'Thales Ferri Schoedl (coautor)',
    coauthor: true,
    year: 2017,
    publisher: 'YK Editora',
    pages: 320,
    edition: '1ª edição',
    price: 79.9,
    description:
      'Questões comentadas do exame oral para concursos de cartórios, com capítulos de Direito Constitucional, Administrativo, Penal e Processual Penal.',
    longDescription:
      'Obra coordenada por Alberto Gentil de Almeida Pedroso, reunindo contribuições de diversos especialistas na preparação para concursos de cartórios. Thales Ferri Schoedl assina os capítulos de Direito Constitucional, Administrativo, Penal e Processual Penal, oferecendo questões comentadas com fundamentação detalhada e dicas práticas para a prova oral.',
    topics: [
      'Exame oral de cartórios',
      'Direito Constitucional',
      'Direito Administrativo',
      'Direito Penal',
      'Processual Penal',
      'Concursos de cartórios',
    ],
    dimensions: { width: 16, height: 23, depth: 2, unit: 'cm' },
    weight: 480,
    weightUnit: 'g',
    image: '/images/IMG_8524.PNG',
    inStock: true,
    saleType: 'editora',
    saleNote: 'Disponível na YK Editora e livrarias',
  },
  // 6) Direito Notarial e Registral em Artigos I e II — Editora/net
  {
    slug: 'direito-notarial-registral-artigos-vol-1',
    title: 'O Direito Notarial e Registral em Artigos',
    subtitle: 'Volume I',
    author: 'Thales Ferri Schoedl (coautor)',
    coauthor: true,
    year: 2016,
    publisher: 'YK Editora',
    pages: 509,
    edition: '1ª edição',
    price: 94.9,
    description:
      'Artigos sobre Direito Notarial e Registral com abordagem prática de tabeliães, oficiais de registro, juiz, promotor e advogado.',
    longDescription:
      'Coletânea coordenada por Arthur Del Guercio Neto e Lucas Barelli Del Guercio que visa contribuir com artigos sobre assuntos relevantes do Direito Notarial e Registral. Todas as especialidades mereceram atenção: Registro Civil das Pessoas Naturais, Registro Civil das Pessoas Jurídicas, Registro de Imóveis, Registro de Títulos e Documentos, Tabelião de Notas e Tabelião de Protestos. Thales Ferri Schoedl contribui com capítulo sobre discriminação em razão de deficiência (art. 88 da Lei 13.146/15).',
    topics: [
      'Direito Notarial',
      'Direito Registral',
      'Registro de Imóveis',
      'Registro Civil',
      'Tabelião de Notas',
      'Tabelião de Protestos',
    ],
    dimensions: { width: 17, height: 24, depth: 3, unit: 'cm' },
    weight: 720,
    weightUnit: 'g',
    image: '/images/direito-notarial.jpg',
    inStock: true,
    saleType: 'editora',
    saleNote: 'Disponível na YK Editora e livrarias',
  },
  {
    slug: 'direito-notarial-registral-artigos-vol-2',
    title: 'O Direito Notarial e Registral em Artigos',
    subtitle: 'Volume II',
    author: 'Thales Ferri Schoedl (coautor)',
    coauthor: true,
    year: 2017,
    publisher: 'YK Editora',
    pages: 480,
    edition: '1ª edição',
    price: 94.9,
    description:
      'Segundo volume da coletânea sobre Direito Notarial e Registral com abordagem interdisciplinar.',
    longDescription:
      'Segundo volume da coletânea coordenada por Arthur Del Guercio Neto e Lucas Barelli Del Guercio. Thales Ferri Schoedl contribui com capítulo sobre tipos disciplinares da Lei dos Notários e Registradores, aprofundando a análise da responsabilidade dos profissionais da área extrajudicial.',
    topics: [
      'Direito Notarial',
      'Direito Registral',
      'Tipos disciplinares',
      'Lei dos Notários',
      'Responsabilidade extrajudicial',
    ],
    dimensions: { width: 17, height: 24, depth: 2.8, unit: 'cm' },
    weight: 680,
    weightUnit: 'g',
    image: '/images/direito-notarial.jpg',
    inStock: true,
    saleType: 'editora',
    saleNote: 'Disponível na YK Editora e livrarias',
  },
  // 7) Direitos Fundamentais e Relações Jurídicas (2015) — Editora/net
  {
    slug: 'direitos-fundamentais-relacoes-juridicas',
    title: 'Direitos Fundamentais e Relações Jurídicas',
    author: 'Thales Ferri Schoedl (coautor)',
    coauthor: true,
    year: 2015,
    publisher: 'GZ Editora',
    pages: 350,
    edition: '1ª edição',
    price: 89.9,
    description:
      'Obra coletiva sobre direitos fundamentais e suas relações jurídicas no ordenamento brasileiro e internacional.',
    longDescription:
      'Organizada por Alexandre Veronese, André Correia Lima Bastos e Luiz Otávio Figueiredo, esta obra coletiva reúne contribuições de diversos juristas sobre a temática dos direitos fundamentais e suas relações jurídicas. Thales Ferri Schoedl contribui com capítulo que examina a compensatória produção de danos morais por veículos de comunicação, analisando a intersecção entre garantias constitucionais e a prática jurídica contemporânea.',
    topics: [
      'Direitos fundamentais',
      'Relações jurídicas',
      'Danos morais',
      'Veículos de comunicação',
      'Garantias constitucionais',
    ],
    dimensions: { width: 16, height: 23, depth: 2.2, unit: 'cm' },
    weight: 520,
    weightUnit: 'g',
    image: '/images/direitos-fundamentais.jpg',
    inStock: true,
    saleType: 'editora',
    saleNote: 'Disponível na GZ Editora e livrarias',
  },
  // 8a) Reflexiones sobre Derecho Latinoamericano (2014) — Editora/net
  {
    slug: 'reflexiones-derecho-latinoamericano-vol-11',
    title: 'Reflexiones sobre Derecho Latinoamericano',
    subtitle: 'Volumen 11 — Estudios en Homenaje al Profesor Ignacio Tedesco',
    author: 'Thales Ferri Schoedl (coautor)',
    coauthor: true,
    year: 2014,
    publisher: 'Editorial Derecho Latino (Buenos Aires)',
    pages: 400,
    edition: '1ª edição',
    price: 79.9,
    description:
      'Obra coletiva internacional com capítulo sobre o crime de tortura.',
    longDescription:
      'Volume 11 da coleção Reflexiones sobre Derecho Latinoamericano, organizado por José Marco Taylah, Letícia Danielle Romano e Paulo Aragão, com prólogo do Prof. Gabriel Ignacio Anitua e apresentação de Ricardo D. Rabinovich-Berkman. Thales Ferri Schoedl contribui com artigo sobre o crime de tortura: características gerais e análise de caso. Obra de referência para o estudo comparado do Direito na América Latina.',
    topics: [
      'Direito Latinoamericano',
      'Direito Comparado',
      'Crime de tortura',
      'Direito Penal Internacional',
    ],
    dimensions: { width: 16, height: 23, depth: 2.5, unit: 'cm' },
    weight: 580,
    weightUnit: 'g',
    image: '/images/reflexiones-derecho.jpg',
    inStock: true,
    saleType: 'editora',
    saleNote:
      'Disponível na Editorial Derecho Latino e livrarias internacionais',
  },
  // 8b) Reflexiones sobre Derecho Latinoamericano (2023) — Editora/net
  {
    slug: 'reflexiones-derecho-latinoamericano-vol-15',
    title: 'Reflexiones sobre Derecho Latinoamericano',
    subtitle:
      'Volumen 15 — Estudios en Homenaje al Profesor Enrique Del Percio',
    author: 'Thales Ferri Schoedl (coautor)',
    coauthor: true,
    year: 2023,
    publisher: 'Editorial Derecho Latino (Buenos Aires)',
    pages: 420,
    edition: '1ª edição',
    price: 84.9,
    description:
      'Obra coletiva internacional com capítulo sobre controle de constitucionalidade dos tipos penais.',
    longDescription:
      'Volume 15 da coleção, organizado por Paulo Aragão, José Marco Taylah e Letícia Danielle Romano, com prólogo de Andrea Gastron e apresentação de Ricardo D. Rabinovich-Berkman. Thales Ferri Schoedl aprofunda sua análise sobre o controle de constitucionalidade dos tipos penais sob o aspecto material, contribuindo para o diálogo jurídico internacional entre acadêmicos e profissionais de diversos países da América Latina.',
    topics: [
      'Direito Latinoamericano',
      'Direito Comparado',
      'Controle de constitucionalidade',
      'Tipos penais',
      'Direito Penal Constitucional',
    ],
    dimensions: { width: 16, height: 23, depth: 2.8, unit: 'cm' },
    weight: 610,
    weightUnit: 'g',
    image: '/images/reflexoes-sobre.jpg',
    inStock: true,
    saleType: 'editora',
    saleNote:
      'Disponível na Editorial Derecho Latino e livrarias internacionais',
  },
];
