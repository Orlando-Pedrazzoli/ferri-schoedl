import {
  Shield,
  Landmark,
  FileText,
  Home,
  Scale,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

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
  name: "Ferri Schoedl Advocacia",
  tagline: "Defesa tecnica com rigor e experiencia",
  description:
    "Escritorio de advocacia com sede em Sao Paulo e atuacao em todo o Brasil, especializado em Direito Criminal, Tribunal do Juri, Improbidade Administrativa, Imobiliario, Civel e Disciplinar.",
  phone: "(11) 3832-0738",
  email: "thales@ferrischoedl.adv.br",
  address: {
    street: "Av. Queiroz Filho, 1.700",
    complement: "Sala 211D",
    neighborhood: "Vila Leopoldina",
    city: "Sao Paulo",
    state: "SP",
  },
  oab: "OAB/SP 196.377",
  hours: "Segunda a sexta, 9h as 18h",
  social: {
    linkedin: "https://www.linkedin.com/in/thales-ferri-schoedl-00517816b/",
  },
};

export const areasDeAtuacao: AreaDeAtuacao[] = [
  {
    slug: "criminal",
    title: "Criminal",
    subtitle: "Defesa criminal estrategica",
    icon: Shield,
    description:
      "Defesa judicial e extrajudicial em processos criminais de alta complexidade. Representacoes e acoes penais privadas com atuacao em todas as instancias, incluindo tribunais superiores.",
    details: [
      "Defesa em inqueritos policiais e processos criminais",
      "Representacoes e acoes penais privadas",
      "Recursos em tribunais superiores (STJ e STF)",
      "Sustentacao oral em todas as instancias",
      "Habeas corpus e medidas cautelares",
      "Acompanhamento de investigacoes",
    ],
  },
  {
    slug: "tribunal-do-juri",
    title: "Tribunal do Juri",
    subtitle: "Experiencia comprovada em plenario",
    icon: Landmark,
    description:
      "Atuacao em plenario do Tribunal do Juri com sustentacao oral especializada e assistencia de acusacao. Experiencia comprovada em julgamentos de alta complexidade e repercussao.",
    details: [
      "Defesa e acusacao em plenario do Juri",
      "Sustentacao oral especializada",
      "Assistencia de acusacao",
      "Preparacao estrategica para sessoes de julgamento",
      "Recursos contra decisoes do Tribunal do Juri",
    ],
  },
  {
    slug: "improbidade-administrativa",
    title: "Improbidade Administrativa",
    subtitle: "Defesa de agentes publicos",
    icon: FileText,
    description:
      "Defesa de agentes publicos em inqueritos civis e procedimentos administrativos relacionados a atos de improbidade administrativa. Elaboracao de representacoes e defesa judicial estrategica.",
    details: [
      "Defesa em inqueritos civis do Ministerio Publico",
      "Defesa judicial em acoes de improbidade",
      "Atuacao em procedimentos administrativos correlatos",
      "Elaboracao de representacoes",
      "Recursos em instancias superiores",
    ],
  },
  {
    slug: "imobiliario",
    title: "Imobiliario",
    subtitle: "Solucoes patrimoniais completas",
    icon: Home,
    description:
      "Atuacao abrangente em questoes imobiliarias, desde usucapiao e inventario ate assessoria para regularizacao de imoveis e planejamento patrimonial familiar e empresarial.",
    details: [
      "Usucapiao judicial e extrajudicial",
      "Inventario e partilha",
      "Regularizacao de imoveis urbanos e rurais",
      "Retificacao de area e registro",
      "Assessoria em escrituras e contratos",
      "Planejamento patrimonial familiar e empresarial",
      "Analise de documentacao para compra segura",
    ],
  },
  {
    slug: "civel",
    title: "Civel",
    subtitle: "Responsabilidade civil e funcional",
    icon: Scale,
    description:
      "Atuacao em acoes de responsabilidade civil e funcional, incluindo reparacao de danos morais e materiais decorrentes de acusacoes disciplinares ou criminais.",
    details: [
      "Acoes de reparacao de danos morais e materiais",
      "Responsabilidade civil e funcional",
      "Demandas civeis de alta complexidade",
      "Recursos em instancias superiores",
      "Consultorias e pareceres",
    ],
  },
  {
    slug: "disciplinar",
    title: "Disciplinar",
    subtitle: "Processos administrativos disciplinares",
    icon: UserPlus,
    description:
      "Defesa de servidores publicos em processos administrativos disciplinares e sindicancias, com estrategia coordenada entre as esferas disciplinar e criminal.",
    details: [
      "Defesa em processos administrativos disciplinares (PAD)",
      "Defesa em sindicancias administrativas",
      "Estrategia coordenada disciplinar-criminal",
      "Recursos contra exoneracoes e penalidades",
      "Reintegracao ao cargo publico",
      "Assessoria preventiva para servidores",
    ],
  },
];

export const publicacoes: Publicacao[] = [
  {
    title: "Comentarios a decisoes inconstitucionais do STF",
    year: 2023,
    publisher: "Editora Letras Juridicas",
    pages: 228,
    description:
      "Analise critica de decisoes do Supremo Tribunal Federal sob a perspectiva do controle de constitucionalidade material dos tipos penais.",
  },
  {
    title: "Liberdade de imprensa e direitos da personalidade",
    subtitle: "Uma abordagem interdisciplinar",
    year: 2019,
    publisher: "Editora Letras Juridicas",
    pages: 284,
    description:
      "Obra resultante do Mestrado Interdisciplinar, abordando a ponderacao entre liberdade de imprensa e direitos da personalidade.",
  },
  {
    title: "Responsabilidade Penal dos Notarios e Registradores",
    year: 2017,
    publisher: "YK Editora",
    pages: 206,
    description:
      "Estudo pioneiro sobre os tipos disciplinares da Lei dos Notarios e Registradores e suas implicacoes penais.",
  },
  {
    title: "2243 Questoes para Concursos Publicos",
    year: 2015,
    publisher: "YK Editora",
    pages: 938,
    description:
      "Questoes respondidas com fundamento e pesquisa minuciosos, cobrindo Direito Constitucional, Administrativo, Tributario, Penal, Processual Penal, Civil, Processual Civil, Empresarial e Legislacao Especial.",
  },
  {
    title: "Questoes Comentadas do Exame Oral: Concursos de Cartorios",
    subtitle: "Coautor — Capitulos de Direito Constitucional, Administrativo, Penal e Processual Penal",
    year: 2017,
    publisher: "YK Editora",
    description:
      "Coordenacao de Alberto Gentil de Almeida Pedroso. Capitulos sobre Direito Constitucional, Administrativo, Penal e Processual Penal.",
  },
];

export const timeline: TimelineItem[] = [
  {
    period: "2001",
    title: "Graduacao em Direito",
    description: "Universidade Presbiteriana Mackenzie, Sao Paulo.",
  },
  {
    period: "2003 — 2016",
    title: "Promotor de Justica",
    description:
      "Ministerio Publico do Estado de Sao Paulo. Atuacao em processos criminais e do Tribunal do Juri.",
  },
  {
    period: "2007",
    title: "Especializacao",
    description:
      "Direito Penal e Processual Penal pela Universidade Presbiteriana Mackenzie.",
  },
  {
    period: "2007 — 2014",
    title: "Professor Voluntario",
    description:
      "Associacao Cruz Verde, dedicada a pessoas com paralisia cerebral grave.",
  },
  {
    period: "2015 — 2018",
    title: "Professor",
    description:
      "Direito Penal e Processual Penal no VFK Educacao. Direito Penal, Administrativo, Civil Contemporaneo e Pratica Juridica na UNIESP.",
  },
  {
    period: "2017",
    title: "Mestrado",
    description:
      "Desenvolvimento e Gestao Social pela Escola de Administracao da Universidade Federal da Bahia (UFBA).",
  },
  {
    period: "Atual",
    title: "Advogado e Professor",
    description:
      "Ferri Schoedl Advocacia. Professor na Academia Del Guercio SPCM. Coordenador de bancas de exame oral simulado.",
  },
];

export const faqItems = [
  {
    question: "O escritorio atende em todo o Brasil?",
    answer:
      "Sim. Embora sediado em Sao Paulo, o escritorio atua nacionalmente em causas de alta complexidade, com presenca em tribunais de todo o pais, incluindo STJ e STF.",
  },
  {
    question: "E possivel responder a processo criminal e disciplinar ao mesmo tempo?",
    answer:
      "Sim. E comum que uma mesma situacao resulte em processo criminal e tambem em procedimento disciplinar contra o servidor. Essas situacoes exigem estrategia coordenada entre as duas esferas.",
  },
  {
    question: "A exoneracao de servidor publico pode ser revertida?",
    answer:
      "Em alguns casos, a exoneracao pode ser anulada judicialmente, permitindo a reintegracao ao cargo. Cada situacao exige analise tecnica individual para avaliar as possibilidades.",
  },
  {
    question: "Como funciona a primeira consulta?",
    answer:
      "O primeiro contato pode ser feito por telefone, e-mail ou pelo formulario do site. Apos uma analise preliminar, agendamos uma consulta para discutir a estrategia adequada ao caso.",
  },
  {
    question: "O escritorio oferece consultoria online?",
    answer:
      "Sim. Oferecemos consultorias online em todas as areas de atuacao, incluindo a elaboracao de relatorios circunstanciados antecedentes a propositura de acao judicial.",
  },
  {
    question: "Quais sao as areas de especializacao do Dr. Thales?",
    answer:
      "Direito Criminal, Tribunal do Juri, Improbidade Administrativa, Imobiliario, Civel e Disciplinar, com enfase na defesa de servidores publicos.",
  },
];
