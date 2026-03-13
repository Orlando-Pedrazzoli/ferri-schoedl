import {
  Shield,
  Landmark,
  FileText,
  Home,
  Scale,
  UserPlus,
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
    'Escritório de advocacia com sede em São Paulo e atuação em todo o Brasil, especializado em Direito Criminal, Tribunal do Júri, Improbidade Administrativa, Imobiliário, Cível e Disciplinar.',
  phone: '(11) 3832-0738',
  email: 'thales@ferrischoedl.adv.br',
  address: {
    street: 'Av. Queiroz Filho, 1.700',
    complement: 'Sala 211D',
    neighborhood: 'Vila Leopoldina',
    city: 'São Paulo',
    state: 'SP',
  },
  oab: 'OAB/SP 196.377',
  hours: 'Segunda a sexta, 9h às 18h',
  social: {
    linkedin: 'https://www.linkedin.com/in/thales-ferri-schoedl-00517816b/',
  },
};

export const areasDeAtuacao: AreaDeAtuacao[] = [
  {
    slug: 'criminal',
    title: 'Criminal',
    subtitle: 'Defesa criminal estratégica',
    icon: Shield,
    description:
      'Defesa judicial e extrajudicial em processos criminais de alta complexidade. Representações e ações penais privadas com atuação em todas as instâncias, incluindo tribunais superiores.',
    details: [
      'Defesa em inquéritos policiais e processos criminais',
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
      'Atuação em plenário do Tribunal do Júri com sustentação oral especializada e assistência de acusação. Experiência comprovada em julgamentos de alta complexidade e repercussão.',
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
      'Atuação em ações de responsabilidade civil e funcional, incluindo reparação de danos morais e materiais decorrentes de acusações disciplinares ou criminais.',
    details: [
      'Ações de reparação de danos morais e materiais',
      'Responsabilidade civil e funcional',
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
      'Defesa de servidores públicos em processos administrativos disciplinares e sindicâncias, com estratégia coordenada entre as esferas disciplinar e criminal.',
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

export const publicacoes: Publicacao[] = [
  {
    title: 'Comentários a decisões inconstitucionais do STF',
    year: 2023,
    publisher: 'Editora Letras Jurídicas',
    pages: 228,
    description:
      'Análise crítica de decisões do Supremo Tribunal Federal sob a perspectiva do controle de constitucionalidade material dos tipos penais.',
  },
  {
    title: 'Liberdade de imprensa e direitos da personalidade',
    subtitle: 'Uma abordagem interdisciplinar',
    year: 2019,
    publisher: 'Editora Letras Jurídicas',
    pages: 284,
    description:
      'Obra resultante do Mestrado Interdisciplinar, abordando a ponderação entre liberdade de imprensa e direitos da personalidade.',
  },
  {
    title: 'Responsabilidade Penal dos Notários e Registradores',
    year: 2017,
    publisher: 'YK Editora',
    pages: 206,
    description:
      'Estudo pioneiro sobre os tipos disciplinares da Lei dos Notários e Registradores e suas implicações penais.',
  },
  {
    title: '2243 Questões para Concursos Públicos',
    year: 2015,
    publisher: 'YK Editora',
    pages: 938,
    description:
      'Questões respondidas com fundamento e pesquisa minuciosos, cobrindo Direito Constitucional, Administrativo, Tributário, Penal, Processual Penal, Civil, Processual Civil, Empresarial e Legislação Especial.',
  },
  {
    title: 'Questões Comentadas do Exame Oral: Concursos de Cartórios',
    subtitle:
      'Coautor — Capítulos de Direito Constitucional, Administrativo, Penal e Processual Penal',
    year: 2017,
    publisher: 'YK Editora',
    description:
      'Coordenação de Alberto Gentil de Almeida Pedroso. Capítulos sobre Direito Constitucional, Administrativo, Penal e Processual Penal.',
  },
];

export const timeline: TimelineItem[] = [
  {
    period: '2001',
    title: 'Graduação em Direito',
    description: 'Universidade Presbiteriana Mackenzie, São Paulo.',
  },
  {
    period: '2003 — 2016',
    title: 'Promotor de Justiça',
    description:
      'Ministério Público do Estado de São Paulo. Atuação em processos criminais e do Tribunal do Júri.',
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
    period: 'Atual',
    title: 'Advogado e Professor',
    description:
      'Ferri Schoedl Advocacia. Professor na Academia Del Guercio SPCM. Coordenador de bancas de exame oral simulado.',
  },
];

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
      'Sim. É comum que uma mesma situação resulte em processo criminal e também em procedimento disciplinar contra o servidor. Essas situações exigem estratégia coordenada entre as duas esferas.',
  },
  {
    question: 'A exoneração de servidor público pode ser revertida?',
    answer:
      'Em alguns casos, a exoneração pode ser anulada judicialmente, permitindo a reintegração ao cargo. Cada situação exige análise técnica individual para avaliar as possibilidades.',
  },
  {
    question: 'Como funciona a primeira consulta?',
    answer:
      'O primeiro contato pode ser feito por telefone, e-mail ou pelo formulário do site. Após uma análise preliminar, agendamos uma consulta para discutir a estratégia adequada ao caso.',
  },
  {
    question: 'O escritório oferece consultoria online?',
    answer:
      'Sim. Oferecemos consultorias online em todas as áreas de atuação, incluindo a elaboração de relatórios circunstanciados antecedentes à propositura de ação judicial.',
  },
  {
    question: 'Quais são as áreas de especialização do Dr. Thales?',
    answer:
      'Direito Criminal, Tribunal do Júri, Improbidade Administrativa, Imobiliário, Cível e Disciplinar, com ênfase na defesa de servidores públicos.',
  },
];

// ===== LIVROS (STORE) =====

export interface Livro {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
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
}

export const livros: Livro[] = [
  {
    slug: '2243-questoes-concursos-publicos',
    title: '2243 Questões para Concursos Públicos',
    author: 'Thales Ferri Schoedl',
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
  },
  {
    slug: 'responsabilidade-penal-notarios-registradores',
    title: 'Responsabilidade Penal dos Notários e Registradores',
    subtitle: 'Noções Elementares de Direito Notarial e Registral — Vol. II',
    author: 'Thales Ferri Schoedl',
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
  },
  {
    slug: 'direitos-fundamentais-relacoes-juridicas',
    title: 'Direitos Fundamentais e Relações Jurídicas',
    author: 'Thales Ferri Schoedl (coautor)',
    year: 2020,
    publisher: 'GZ Editora',
    pages: 350,
    edition: '1ª edição',
    price: 89.9,
    description:
      'Obra coletiva que aborda os direitos fundamentais e suas relações jurídicas no ordenamento brasileiro e internacional.',
    longDescription:
      'Organizada por Alexandre Veronese, André Correia Lima Bastos e Luiz Otávio Figueiredo, esta obra coletiva reúne contribuições de diversos juristas sobre a temática dos direitos fundamentais e suas relações jurídicas. Thales Ferri Schoedl contribui com capítulo que examina a intersecção entre garantias constitucionais e a prática jurídica contemporânea, oferecendo análise doutrinária e jurisprudencial relevante para acadêmicos e profissionais do Direito.',
    topics: [
      'Direitos fundamentais',
      'Relações jurídicas',
      'Garantias constitucionais',
      'Direito Constitucional',
      'Doutrina jurídica contemporânea',
    ],
    dimensions: { width: 16, height: 23, depth: 2.2, unit: 'cm' },
    weight: 520,
    weightUnit: 'g',
    image: '/images/direitos-fundamentais.jpg',
    inStock: true,
  },
  {
    slug: 'reflexiones-derecho-latinoamericano-vol-11',
    title: 'Reflexiones Sobre Derecho Latinoamericano',
    subtitle: 'Volumen 11 — Estudios en Homenaje al Profesor Ignacio Tedesco',
    author: 'Thales Ferri Schoedl (coautor)',
    year: 2021,
    publisher: 'Editorial Derecho Latino',
    pages: 400,
    edition: '1ª edição',
    price: 79.9,
    description:
      'Obra coletiva internacional em homenagem ao Professor Ignacio Tedesco, com contribuições sobre Direito Latinoamericano.',
    longDescription:
      'Volume 11 da coleção Reflexiones Sobre Derecho Latinoamericano, organizado por José Marco Taylah, Letícia Danielle Romano e Paulo Aragão, com prólogo do Prof. Gabriel Ignacio Anitua e apresentação de Ricardo D. Rabinovich-Berkman. Thales Ferri Schoedl contribui com artigo sobre o controle de constitucionalidade dos tipos penais sob o aspecto material, tema central de sua produção acadêmica. Obra de referência para o estudo comparado do Direito na América Latina.',
    topics: [
      'Direito Latinoamericano',
      'Direito Comparado',
      'Controle de constitucionalidade',
      'Tipos penais',
      'Homenagem acadêmica',
    ],
    dimensions: { width: 16, height: 23, depth: 2.5, unit: 'cm' },
    weight: 580,
    weightUnit: 'g',
    image: '/images/reflexiones-derecho.jpg',
    inStock: true,
  },
  {
    slug: 'reflexiones-derecho-latinoamericano-vol-15',
    title: 'Reflexiones Sobre Derecho Latinoamericano',
    subtitle:
      'Volumen 15 — Estudios en Homenaje al Profesor Enrique Del Percio',
    author: 'Thales Ferri Schoedl (coautor)',
    year: 2023,
    publisher: 'Editorial Derecho Latino',
    pages: 420,
    edition: '1ª edição',
    price: 84.9,
    description:
      'Obra coletiva internacional em homenagem ao Professor Enrique Del Percio, com contribuições sobre Direito Latinoamericano.',
    longDescription:
      'Volume 15 da coleção, organizado por Paulo Aragão, José Marco Taylah e Letícia Danielle Romano, com prólogo de Andrea Gastron e apresentação de Ricardo D. Rabinovich-Berkman. Nesta edição, Thales Ferri Schoedl aprofunda sua análise sobre temas de Direito Penal e Constitucional no contexto latino-americano, contribuindo para o diálogo jurídico internacional entre acadêmicos e profissionais de diversos países.',
    topics: [
      'Direito Latinoamericano',
      'Direito Comparado',
      'Direito Penal',
      'Direito Constitucional',
      'Homenagem acadêmica',
    ],
    dimensions: { width: 16, height: 23, depth: 2.8, unit: 'cm' },
    weight: 610,
    weightUnit: 'g',
    image: '/images/reflexoes-sobre.jpg',
    inStock: true,
    featured: true,
  },
  {
    slug: 'direito-notarial-registral-artigos',
    title: 'O Direito Notarial e Registral em Artigos',
    subtitle: 'Volume 1',
    author: 'Thales Ferri Schoedl (coautor)',
    year: 2016,
    publisher: 'YK Editora',
    pages: 509,
    edition: '1ª edição',
    price: 94.9,
    description:
      'Artigos sobre assuntos relevantes do Direito Notarial e Registral, com abordagem prática de tabeliães, oficiais de registro, juiz, promotor e advogado.',
    longDescription:
      'A presente obra visa contribuir, transmitindo aos leitores artigos sobre assuntos relevantes, ajudando-os na compreensão de institutos fundamentais ao Direito Notarial e Registral. Todas as especialidades mereceram atenção: Registro Civil das Pessoas Naturais, Registro Civil das Pessoas Jurídicas, Registro de Imóveis, Registro de Títulos e Documentos, Tabelião de Notas e Tabelião de Protestos. Os autores são Tabeliães e Oficiais de Registro do mais alto nível, não só intelectual, mas ofertando uma abordagem prática especial. Além desses profissionais, temos o ponto de vista de Juiz, Promotor de Justiça e Advogado, sobre temas palpitantes. Coordenação de Arthur Del Guercio Neto e Lucas Barelli Del Guercio.',
    topics: [
      'Direito Notarial',
      'Direito Registral',
      'Registro de Imóveis',
      'Registro Civil',
      'Tabelião de Notas',
      'Tabelião de Protestos',
      'Segurança jurídica',
    ],
    dimensions: { width: 17, height: 24, depth: 3, unit: 'cm' },
    weight: 720,
    weightUnit: 'g',
    image: '/images/direito-notarial.jpg',
    inStock: true,
  },
];
