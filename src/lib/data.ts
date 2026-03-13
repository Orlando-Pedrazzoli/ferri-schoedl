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
  tagline: 'Defesa tecnica com rigor e experiencia',
  description:
    'Escritorio de advocacia com sede em Sao Paulo e atuacao em todo o Brasil, especializado em Direito Criminal, Tribunal do Juri, Improbidade Administrativa, Imobiliario, Civel e Disciplinar.',
  phone: '(11) 3832-0738',
  email: 'thales@ferrischoedl.adv.br',
  address: {
    street: 'Av. Queiroz Filho, 1.700',
    complement: 'Sala 211D',
    neighborhood: 'Vila Leopoldina',
    city: 'Sao Paulo',
    state: 'SP',
  },
  oab: 'OAB/SP 196.377',
  hours: 'Segunda a sexta, 9h as 18h',
  social: {
    linkedin: 'https://www.linkedin.com/in/thales-ferri-schoedl-00517816b/',
  },
};

export const areasDeAtuacao: AreaDeAtuacao[] = [
  {
    slug: 'criminal',
    title: 'Criminal',
    subtitle: 'Defesa criminal estrategica',
    icon: Shield,
    description:
      'Defesa judicial e extrajudicial em processos criminais de alta complexidade. Representacoes e acoes penais privadas com atuacao em todas as instancias, incluindo tribunais superiores.',
    details: [
      'Defesa em inqueritos policiais e processos criminais',
      'Representacoes e acoes penais privadas',
      'Recursos em tribunais superiores (STJ e STF)',
      'Sustentacao oral em todas as instancias',
      'Habeas corpus e medidas cautelares',
      'Acompanhamento de investigacoes',
    ],
  },
  {
    slug: 'tribunal-do-juri',
    title: 'Tribunal do Juri',
    subtitle: 'Experiencia comprovada em plenario',
    icon: Landmark,
    description:
      'Atuacao em plenario do Tribunal do Juri com sustentacao oral especializada e assistencia de acusacao. Experiencia comprovada em julgamentos de alta complexidade e repercussao.',
    details: [
      'Defesa e acusacao em plenario do Juri',
      'Sustentacao oral especializada',
      'Assistencia de acusacao',
      'Preparacao estrategica para sessoes de julgamento',
      'Recursos contra decisoes do Tribunal do Juri',
    ],
  },
  {
    slug: 'improbidade-administrativa',
    title: 'Improbidade Administrativa',
    subtitle: 'Defesa de agentes publicos',
    icon: FileText,
    description:
      'Defesa de agentes publicos em inqueritos civis e procedimentos administrativos relacionados a atos de improbidade administrativa. Elaboracao de representacoes e defesa judicial estrategica.',
    details: [
      'Defesa em inqueritos civis do Ministerio Publico',
      'Defesa judicial em acoes de improbidade',
      'Atuacao em procedimentos administrativos correlatos',
      'Elaboracao de representacoes',
      'Recursos em instancias superiores',
    ],
  },
  {
    slug: 'imobiliario',
    title: 'Imobiliario',
    subtitle: 'Solucoes patrimoniais completas',
    icon: Home,
    description:
      'Atuacao abrangente em questoes imobiliarias, desde usucapiao e inventario ate assessoria para regularizacao de imoveis e planejamento patrimonial familiar e empresarial.',
    details: [
      'Usucapiao judicial e extrajudicial',
      'Inventario e partilha',
      'Regularizacao de imoveis urbanos e rurais',
      'Retificacao de area e registro',
      'Assessoria em escrituras e contratos',
      'Planejamento patrimonial familiar e empresarial',
      'Analise de documentacao para compra segura',
    ],
  },
  {
    slug: 'civel',
    title: 'Civel',
    subtitle: 'Responsabilidade civil e funcional',
    icon: Scale,
    description:
      'Atuacao em acoes de responsabilidade civil e funcional, incluindo reparacao de danos morais e materiais decorrentes de acusacoes disciplinares ou criminais.',
    details: [
      'Acoes de reparacao de danos morais e materiais',
      'Responsabilidade civil e funcional',
      'Demandas civeis de alta complexidade',
      'Recursos em instancias superiores',
      'Consultorias e pareceres',
    ],
  },
  {
    slug: 'disciplinar',
    title: 'Disciplinar',
    subtitle: 'Processos administrativos disciplinares',
    icon: UserPlus,
    description:
      'Defesa de servidores publicos em processos administrativos disciplinares e sindicancias, com estrategia coordenada entre as esferas disciplinar e criminal.',
    details: [
      'Defesa em processos administrativos disciplinares (PAD)',
      'Defesa em sindicancias administrativas',
      'Estrategia coordenada disciplinar-criminal',
      'Recursos contra exoneracoes e penalidades',
      'Reintegracao ao cargo publico',
      'Assessoria preventiva para servidores',
    ],
  },
];

export const publicacoes: Publicacao[] = [
  {
    title: 'Comentarios a decisoes inconstitucionais do STF',
    year: 2023,
    publisher: 'Editora Letras Juridicas',
    pages: 228,
    description:
      'Analise critica de decisoes do Supremo Tribunal Federal sob a perspectiva do controle de constitucionalidade material dos tipos penais.',
  },
  {
    title: 'Liberdade de imprensa e direitos da personalidade',
    subtitle: 'Uma abordagem interdisciplinar',
    year: 2019,
    publisher: 'Editora Letras Juridicas',
    pages: 284,
    description:
      'Obra resultante do Mestrado Interdisciplinar, abordando a ponderacao entre liberdade de imprensa e direitos da personalidade.',
  },
  {
    title: 'Responsabilidade Penal dos Notarios e Registradores',
    year: 2017,
    publisher: 'YK Editora',
    pages: 206,
    description:
      'Estudo pioneiro sobre os tipos disciplinares da Lei dos Notarios e Registradores e suas implicacoes penais.',
  },
  {
    title: '2243 Questoes para Concursos Publicos',
    year: 2015,
    publisher: 'YK Editora',
    pages: 938,
    description:
      'Questoes respondidas com fundamento e pesquisa minuciosos, cobrindo Direito Constitucional, Administrativo, Tributario, Penal, Processual Penal, Civil, Processual Civil, Empresarial e Legislacao Especial.',
  },
  {
    title: 'Questoes Comentadas do Exame Oral: Concursos de Cartorios',
    subtitle:
      'Coautor — Capitulos de Direito Constitucional, Administrativo, Penal e Processual Penal',
    year: 2017,
    publisher: 'YK Editora',
    description:
      'Coordenacao de Alberto Gentil de Almeida Pedroso. Capitulos sobre Direito Constitucional, Administrativo, Penal e Processual Penal.',
  },
];

export const timeline: TimelineItem[] = [
  {
    period: '2001',
    title: 'Graduacao em Direito',
    description: 'Universidade Presbiteriana Mackenzie, Sao Paulo.',
  },
  {
    period: '2003 — 2016',
    title: 'Promotor de Justica',
    description:
      'Ministerio Publico do Estado de Sao Paulo. Atuacao em processos criminais e do Tribunal do Juri.',
  },
  {
    period: '2007',
    title: 'Especializacao',
    description:
      'Direito Penal e Processual Penal pela Universidade Presbiteriana Mackenzie.',
  },
  {
    period: '2007 — 2014',
    title: 'Professor Voluntario',
    description:
      'Associacao Cruz Verde, dedicada a pessoas com paralisia cerebral grave.',
  },
  {
    period: '2015 — 2018',
    title: 'Professor',
    description:
      'Direito Penal e Processual Penal no VFK Educacao. Direito Penal, Administrativo, Civil Contemporaneo e Pratica Juridica na UNIESP.',
  },
  {
    period: '2017',
    title: 'Mestrado',
    description:
      'Desenvolvimento e Gestao Social pela Escola de Administracao da Universidade Federal da Bahia (UFBA).',
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
    question: 'O escritorio atende em todo o Brasil?',
    answer:
      'Sim. Embora sediado em Sao Paulo, o escritorio atua nacionalmente em causas de alta complexidade, com presenca em tribunais de todo o pais, incluindo STJ e STF.',
  },
  {
    question:
      'E possivel responder a processo criminal e disciplinar ao mesmo tempo?',
    answer:
      'Sim. E comum que uma mesma situacao resulte em processo criminal e tambem em procedimento disciplinar contra o servidor. Essas situacoes exigem estrategia coordenada entre as duas esferas.',
  },
  {
    question: 'A exoneracao de servidor publico pode ser revertida?',
    answer:
      'Em alguns casos, a exoneracao pode ser anulada judicialmente, permitindo a reintegracao ao cargo. Cada situacao exige analise tecnica individual para avaliar as possibilidades.',
  },
  {
    question: 'Como funciona a primeira consulta?',
    answer:
      'O primeiro contato pode ser feito por telefone, e-mail ou pelo formulario do site. Apos uma analise preliminar, agendamos uma consulta para discutir a estrategia adequada ao caso.',
  },
  {
    question: 'O escritorio oferece consultoria online?',
    answer:
      'Sim. Oferecemos consultorias online em todas as areas de atuacao, incluindo a elaboracao de relatorios circunstanciados antecedentes a propositura de acao judicial.',
  },
  {
    question: 'Quais sao as areas de especializacao do Dr. Thales?',
    answer:
      'Direito Criminal, Tribunal do Juri, Improbidade Administrativa, Imobiliario, Civel e Disciplinar, com enfase na defesa de servidores publicos.',
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
    title: '2243 Questoes para Concursos Publicos',
    author: 'Thales Ferri Schoedl',
    year: 2015,
    publisher: 'YK Editora',
    pages: 938,
    isbn: '978-85-68586-03-9',
    edition: '1a edicao',
    price: 149.9,
    originalPrice: 179.9,
    description:
      'Questoes respondidas com fundamento e pesquisa minuciosos, cobrindo todas as principais disciplinas para concursos.',
    longDescription:
      'O leitor esta diante de questoes respondidas com fundamento e pesquisa serios e minuciosos, esmiucando detidamente os diversos assuntos que podem ser questionados. A obra abrange Direito Constitucional, Administrativo, Tributario, Penal (parte geral e parte especial), Processual Penal, Civil, Processual Civil, Empresarial e Legislacao Especial, contendo todo o alicerce das principais disciplinas para os concursos de magistratura, ministerio publico, procuradorias, defensorias e exame de ordem. Ferramenta indispensavel para o estudante universitario, para o academico que presta concurso e para todos os docentes.',
    topics: [
      'Direito Constitucional',
      'Direito Administrativo',
      'Direito Tributario',
      'Direito Penal',
      'Direito Processual Penal',
      'Direito Civil',
      'Direito Processual Civil',
      'Direito Empresarial',
      'Legislacao Especial',
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
    title: 'Responsabilidade Penal dos Notarios e Registradores',
    subtitle: 'Nocoes Elementares de Direito Notarial e Registral — Vol. II',
    author: 'Thales Ferri Schoedl',
    year: 2017,
    publisher: 'YK Editora',
    pages: 206,
    isbn: '978-85-68586-15-2',
    edition: '1a edicao',
    price: 69.9,
    description:
      'Estudo pioneiro sobre os tipos disciplinares da Lei dos Notarios e Registradores e suas implicacoes penais.',
    longDescription:
      'Obra pioneira que examina de forma detalhada a responsabilidade penal dos notarios e registradores no ordenamento juridico brasileiro. O autor analisa os tipos disciplinares previstos na Lei dos Notarios e Registradores, suas implicacoes penais e a interface entre o Direito Administrativo e o Direito Penal nesse contexto. Essencial para profissionais que atuam em cartorios, concurseiros da area e operadores do Direito em geral.',
    topics: [
      'Responsabilidade penal',
      'Notarios e registradores',
      'Tipos disciplinares',
      'Lei de Registros Publicos',
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
    title: 'Direitos Fundamentais e Relacoes Juridicas',
    author: 'Thales Ferri Schoedl (coautor)',
    year: 2020,
    publisher: 'GZ Editora',
    pages: 350,
    edition: '1a edicao',
    price: 89.9,
    description:
      'Obra coletiva que aborda os direitos fundamentais e suas relacoes juridicas no ordenamento brasileiro e internacional.',
    longDescription:
      'Organizada por Alexandre Veronese, Andre Correia Lima Bastos e Luiz Otavio Figueiredo, esta obra coletiva reune contribuicoes de diversos juristas sobre a tematica dos direitos fundamentais e suas relacoes juridicas. Thales Ferri Schoedl contribui com capitulo que examina a interseccao entre garantias constitucionais e a pratica juridica contemporanea, oferecendo analise doutrinaria e jurisprudencial relevante para acadêmicos e profissionais do Direito.',
    topics: [
      'Direitos fundamentais',
      'Relacoes juridicas',
      'Garantias constitucionais',
      'Direito Constitucional',
      'Doutrina juridica contemporanea',
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
    edition: '1a edicao',
    price: 79.9,
    description:
      'Obra coletiva internacional em homenagem ao Professor Ignacio Tedesco, com contribuicoes sobre Direito Latinoamericano.',
    longDescription:
      'Volume 11 da colecao Reflexiones Sobre Derecho Latinoamericano, organizado por Jose Marco Taylah, Leticia Danielle Romano e Paulo Aragao, com prologo do Prof. Gabriel Ignacio Anitua e apresentacao de Ricardo D. Rabinovich-Berkman. Thales Ferri Schoedl contribui com artigo sobre o controle de constitucionalidade dos tipos penais sob o aspecto material, tema central de sua producao academica. Obra de referencia para o estudo comparado do Direito na America Latina.',
    topics: [
      'Direito Latinoamericano',
      'Direito Comparado',
      'Controle de constitucionalidade',
      'Tipos penais',
      'Homenagem academica',
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
    edition: '1a edicao',
    price: 84.9,
    description:
      'Obra coletiva internacional em homenagem ao Professor Enrique Del Percio, com contribuicoes sobre Direito Latinoamericano.',
    longDescription:
      'Volume 15 da colecao, organizado por Paulo Aragao, Jose Marco Taylah e Leticia Danielle Romano, com prologo de Andrea Gastron e apresentacao de Ricardo D. Rabinovich-Berkman. Nesta edicao, Thales Ferri Schoedl aprofunda sua analise sobre temas de Direito Penal e Constitucional no contexto latino-americano, contribuindo para o dialogo juridico internacional entre acadêmicos e profissionais de diversos paises.',
    topics: [
      'Direito Latinoamericano',
      'Direito Comparado',
      'Direito Penal',
      'Direito Constitucional',
      'Homenagem academica',
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
    edition: '1a edicao',
    price: 94.9,
    description:
      'Artigos sobre assuntos relevantes do Direito Notarial e Registral, com abordagem pratica de tabeliaes, oficiais de registro, juiz, promotor e advogado.',
    longDescription:
      'A presente obra visa contribuir, transmitindo aos leitores artigos sobre assuntos relevantes, ajudando-os na compreensao de institutos fundamentais ao Direito Notarial e Registral. Todas as especialidades mereceram atencao: Registro Civil das Pessoas Naturais, Registro Civil das Pessoas Juridicas, Registro de Imoveis, Registro de Titulos e Documentos, Tabeliao de Notas e Tabeliao de Protestos. Os autores sao Tabeliaes e Oficiais de Registro do mais alto nivel, nao so intelectual, mas ofertando uma abordagem pratica especial. Alem desses profissionais, temos o ponto de vista de Juiz, Promotor de Justica e Advogado, sobre temas palpitantes. Coordenacao de Arthur Del Guercio Neto e Lucas Barelli Del Guercio.',
    topics: [
      'Direito Notarial',
      'Direito Registral',
      'Registro de Imoveis',
      'Registro Civil',
      'Tabeliao de Notas',
      'Tabeliao de Protestos',
      'Seguranca juridica',
    ],
    dimensions: { width: 17, height: 24, depth: 3, unit: 'cm' },
    weight: 720,
    weightUnit: 'g',
    image: '/images/direito-notarial.jpg',
    inStock: true,
  },
];
