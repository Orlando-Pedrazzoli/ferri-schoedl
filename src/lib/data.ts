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
  pdfUrl?: string;
  originalPublisher?: string;
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
    artigosPublicados: 22,
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
];

// ===== PUBLICAÇÕES (LIVROS — Seção Acadêmica) =====
// Ordem: mais recentes primeiro, priorizando autoria solo

export const publicacoes: Publicacao[] = [
  {
    title: 'Comentários a decisões inconstitucionais do STF',
    year: 2023,
    publisher: 'Editora Letras Jurídicas',
    pages: 228,
    description:
      'Prefaciada pelo jurista, professor e advogado Dr. José Cretella Neto, a obra contém um estudo crítico acerca do atual papel desempenhado pela Corte Suprema Brasileira (Supremo Tribunal Federal), com enfoque exclusivamente jurídico, abordando a criminalização da homofobia, interferência nas nomeações presidenciais, levantamento do sigilo de reuniões presidenciais, investigação de fake news de ofício e prisão de parlamentares federais. Nas Considerações Finais foram elencados os possíveis métodos de controle de constitucionalidade de decisões das próprias Cortes Supremas, sob a ótica do Estado Democrático de Direito.',
    type: 'solo',
  },
  {
    title: 'Liberdade de imprensa e direitos da personalidade',
    subtitle: 'Uma abordagem interdisciplinar',
    year: 2019,
    publisher: 'Editora Letras Jurídicas',
    pages: 284,
    description:
      'Prefaciada pelo jurista, professor e ex-procurador de justiça Dr. Fernando Capez, esta obra é fruto da dissertação de Mestrado do autor na UFBA. Inicia-se com um estudo crítico sobre o papel da imprensa no processo penal, tendo como premissa a desmistificação da ideia de "quarto poder". Em seguida, trata das teorias que procuram solucionar a colisão entre direitos fundamentais, passando ao conflito específico entre a liberdade de imprensa e os direitos da personalidade, tratando ainda das tutelas previstas em lei.',
    type: 'solo',
  },
  {
    title: 'Responsabilidade Penal dos Notários e Registradores',
    subtitle: 'Noções Elementares de Direito Notarial e Registral — Vol. II',
    year: 2017,
    publisher: 'YK Editora',
    pages: 206,
    description:
      'Prefaciada pelo jurista, professor e desembargador Dr. Vitor Frederico Kümpel, a obra integra a Coleção "Noções Elementares de Direito Notarial e Registral", tratando, mediante abordagem interdisciplinar, da classificação dos agentes públicos e dos notários e registradores, responsabilidade e imputabilidade, relação entre as esferas de responsabilidade e dos delitos funcionais, concluindo com um ensaio sobre as repercussões penais da paternidade socioafetiva e das novas modalidades de família.',
    type: 'solo',
  },
  {
    title: '2243 Questões para Concursos Públicos',
    year: 2015,
    publisher: 'YK Editora',
    pages: 938,
    description:
      'Prefaciada pelo jurista, tabelião e professor Arthur Del Guércio Neto, a obra, nas palavras de seu apresentador Dr. Vitor Frederico Kümpel, se vale da maiêutica para fins de aprendizado nas mais diversas áreas do direito. O leitor está diante de questões respondidas com fundamento e pesquisa sérios e minuciosos, abrangendo Direito Constitucional, Administrativo, Tributário, Penal, Processual Penal, Civil, Processual Civil, Empresarial e Legislação Especial.',
    type: 'solo',
  },
  {
    title: 'Questões Comentadas do Exame Oral: Concursos de Cartórios',
    subtitle:
      'Capítulos de Direito Penal, Processual Penal, Constitucional e Administrativo',
    year: 2017,
    publisher: 'YK Editora',
    description:
      'Em obra coordenada pelo jurista, professor e juiz de direito Alberto Gentil de Almeida Pedroso, coube ao autor a elaboração dos Capítulos de Direito Penal, Processual Penal, Constitucional e Administrativo, os dois últimos em coautoria com o jurista, professor e tabelião Milton Fernando Lamanauskas, valendo-se da mesma metodologia do livro "2243 Questões para Concursos Públicos".',
    type: 'coautoria',
  },
  {
    title: 'O Direito Notarial e Registral em Artigos',
    subtitle: 'Volume I',
    year: 2016,
    publisher: 'YK Editora',
    pages: 509,
    description:
      'Em obra coordenada pelos juristas, professores e tabeliães Arthur Del Guércio Neto e Lucas Barelli Del Guércio, coube ao autor tecer considerações sobre o tema "Discriminação em razão de deficiência (art. 88 da Lei 13.146/15): análise da constitucionalidade do delito em face dos princípios da legalidade e lesividade, quando praticado por tabelião de notas no exercício da função".',
    type: 'coautoria',
  },
  {
    title: 'O Direito Notarial e Registral em Artigos',
    subtitle: 'Volume II',
    year: 2017,
    publisher: 'YK Editora',
    description:
      'No Volume II da obra coordenada pelos juristas, professores e tabeliães Arthur Del Guércio Neto e Lucas Barelli Del Guércio, o autor trata do tema "Tipos disciplinares da Lei dos Notários e Registradores (art. 31, incisos I a V, da Lei 8.935/94): uma abordagem interdisciplinar sob a ótica do Direito Penal e Administrativo".',
    type: 'coautoria',
  },
  {
    title: 'Direitos Fundamentais e Relações Jurídicas',
    year: 2015,
    publisher: 'GZ Editora',
    pages: 350,
    description:
      'Em obra coordenada pelos juristas Alexandre Coutinho Pagliarini e Zelma Tomaz Tolentino, o Capítulo elaborado pelo autor é dedicado ao tema "A compensatória produção de danos morais por veículos de comunicação", versando sobre os aspectos jurídicos e econômicos relacionados às ofensas produzidas por veículos de comunicação aos direitos da personalidade.',
    type: 'coautoria',
  },
  {
    title: 'Reflexiones sobre Derecho Latinoamericano',
    subtitle: 'Volumen 11',
    year: 2013,
    publisher: 'Editorial Derecho Latino (Buenos Aires)',
    pages: 400,
    description:
      'No Volume 11 da obra coordenada pelos juristas e professores Paulo Aragão, José Marco Tayah e Letícia Danielle Romano, publicada no Brasil e na Argentina, o autor aborda o tema "Controle de constitucionalidade dos tipos penais sob o aspecto material", iniciando pelas modalidades de controle de constitucionalidade, passando pela tipicidade material e seus princípios informadores.',
    type: 'coautoria',
  },
  {
    title: 'Reflexiones sobre Derecho Latinoamericano',
    subtitle: 'Volumen 15',
    year: 2014,
    publisher: 'Editorial Derecho Latino (Buenos Aires)',
    pages: 420,
    description:
      'No Volume 15 da obra coordenada pelos juristas e professores Paulo Aragão, José Marco Tayah e Letícia Danielle Romano, igualmente publicada no Brasil e na Argentina, o Capítulo de responsabilidade do autor trata do tema "Do crime de tortura: características gerais e análise de caso", tendo por objeto estudo de caso sobre o delito de tortura, no qual figura como denunciado um agente público.',
    type: 'coautoria',
  },
];

// ===== ARTIGOS PUBLICADOS (22 artigos reais — lista fornecida pelo Dr. Thales) =====

export const artigos: Artigo[] = [
  {
    title: 'A normatização da tipicidade material no Projeto de Código Penal',
    year: 2013,
    publisher: 'Carta Forense',
    pdfUrl:
      '/artigos/A_normatizacao_da_tipicidade_material_no_projeto_do_Codigo_Penal.pdf',
    originalPublisher:
      'Publicado originalmente no site www.cartaforense.com.br, em 21 de janeiro de 2013',
    description:
      'Análise da normatização da teoria do bem jurídico e do princípio da lesividade no Projeto de Código Penal, abordando o controle material da tipicidade e o princípio da insignificância.',
  },
  {
    title:
      'Projeto de Código Penal: a desequiparação entre o dolo direto e o dolo eventual',
    year: 2013,
    publisher: 'Carta Forense',
    pdfUrl: '/artigos/Desequiparacao_entre_o_dolo_direto_e_eventual.pdf',
    originalPublisher:
      'Publicado originalmente no site www.cartaforense.com.br, em 12 de abril de 2013',
    description:
      'Exame da desequiparação entre o dolo direto e o dolo eventual prevista no Projeto de Código Penal, com análise da distinção entre dolo eventual e culpa consciente.',
  },
  {
    title: 'PEC 37/2011: a blindagem do "sistema penal subterrâneo"',
    year: 2013,
    publisher: 'Carta Forense',
    pdfUrl: '/artigos/PEC_37.pdf',
    originalPublisher:
      'Publicado originalmente no site www.cartaforense.com.br, em 11 de junho de 2013',
    description:
      'Análise crítica da PEC 37/2011 e seus impactos na investigação criminal pelo Ministério Público, abordando o conceito de "sistema penal subterrâneo".',
  },
  {
    title:
      'A consumação do crime de roubo e a ação do terceiro que intervém em defesa da vítima',
    year: 2014,
    publisher: 'Carta Forense',
    pdfUrl: '/artigos/Consumacao_157_e_25_de_terceiro.pdf',
    originalPublisher:
      'Publicado originalmente no site www.cartaforense.com.br, em 7 de janeiro de 2014',
    description:
      'Estudo sobre o momento consumativo do crime de roubo e as consequências para o reconhecimento da legítima defesa praticada pelo terceiro que intervém em defesa da vítima.',
  },
  {
    title: 'A posse de droga para consumo pessoal no Projeto de Código Penal',
    year: 2014,
    publisher: 'Carta Forense',
    pdfUrl: '/artigos/Posse_de_droga.pdf',
    originalPublisher:
      'Publicado originalmente no site www.cartaforense.com.br, em 20 de março de 2014',
    description:
      'Análise da descriminalização da posse de droga para consumo pessoal no Projeto de Código Penal, à luz do princípio da alteridade.',
  },
  {
    title: 'Projeto do Código Penal: o início da execução do delito',
    year: 2014,
    publisher: 'Despertar Jurídico / Blog do DG',
    url: 'https://blogdodg.com.br/projeto-do-codigo-penal-o-inicio-da-execucao-do-delito/',
    originalPublisher:
      'Publicado originalmente no site www.despertarjuridico.com.br, em 5 de setembro de 2014, e republicado no Blog do DG em 10 de março de 2017',
    description:
      'Considerações sobre o início da execução do delito no Projeto de Código Penal.',
  },
  {
    title:
      'Particularidades sobre o interesse e a legitimidade recursal no processo penal',
    year: 2014,
    publisher: 'Despertar Jurídico / Blog do DG',
    url: 'https://blogdodg.com.br/particularidades-sobre-o-interesse-e-a-legitimidade-recursal-no-processo-penal/',
    originalPublisher:
      'Publicado originalmente no site www.despertarjuridico.com.br, em 5 de setembro de 2014, e republicado no Blog do DG em 15 de março de 2017',
    description:
      'Análise das particularidades do interesse e da legitimidade recursal no âmbito do processo penal.',
  },
  {
    title: 'O estranho caso do inimputável capaz — Parte I',
    year: 2015,
    publisher: 'Migalhas — Registralhas',
    url: 'https://www.migalhas.com.br/coluna/registralhas/228693/o-estranho-caso-do-inimputavel-capaz---parte-i',
    coauthors: ['Vitor Frederico Kümpel', 'Bruno de Ávila Borgarelli'],
    description:
      'Primeira parte da análise interdisciplinar sobre o caso do inimputável capaz, publicada na coluna Registralhas do Migalhas.',
  },
  {
    title: 'O estranho caso do inimputável capaz — Parte II',
    year: 2015,
    publisher: 'Migalhas — Registralhas',
    url: 'https://www.migalhas.com.br/coluna/registralhas/229398/o-estranho-caso-do-inimputavel-capaz---parte-ii',
    coauthors: ['Vitor Frederico Kümpel', 'Bruno de Ávila Borgarelli'],
    description:
      'Segunda parte da análise interdisciplinar sobre o caso do inimputável capaz.',
  },
  {
    title: 'O estranho caso do inimputável capaz — Parte III',
    year: 2015,
    publisher: 'Migalhas — Registralhas',
    url: 'https://www.migalhas.com.br/coluna/registralhas/230397/o-estranho-caso-do-inimputavel-capaz---parte-iii',
    coauthors: ['Vitor Frederico Kümpel', 'Bruno de Ávila Borgarelli'],
    description:
      'Terceira parte da análise interdisciplinar sobre o caso do inimputável capaz.',
  },
  {
    title:
      'O caso Eliza Samúdio e a revogação de certidão de óbito: uma abordagem interdisciplinar — Parte I',
    year: 2016,
    publisher: 'Migalhas — Registralhas',
    url: 'https://www.migalhas.com.br/coluna/registralhas/247511/o-caso-eliza-samudio-e-a-revogacao-de-certidao-de-obito---uma-abordagem-interdisciplinar',
    coauthors: ['Vitor Frederico Kümpel', 'Bruno de Ávila Borgarelli'],
    description:
      'Primeira parte da análise do caso Eliza Samúdio sob a perspectiva interdisciplinar, abordando a revogação de certidão de óbito.',
  },
  {
    title:
      'O caso Eliza Samúdio e a revogação de certidão de óbito: uma abordagem interdisciplinar — Parte II',
    year: 2016,
    publisher: 'Migalhas — Registralhas',
    url: 'https://www.migalhas.com.br/coluna/registralhas/247906/o-caso-eliza-samudio-e-a-revogacao-de-certidao-de-obito---uma-abordagem-interdisciplinar---parte-ii',
    coauthors: ['Vitor Frederico Kümpel', 'Bruno de Ávila Borgarelli'],
    description:
      'Segunda parte da análise do caso Eliza Samúdio e a revogação de certidão de óbito.',
  },
  {
    title:
      'O caso Eliza Samúdio e a revogação de certidão de óbito: uma abordagem interdisciplinar — Parte III',
    year: 2016,
    publisher: 'Migalhas — Registralhas',
    url: 'https://www.migalhas.com.br/coluna/registralhas/248951/o-caso-eliza-samudio-e-a-revogacao-de-certidao-de-obito---uma-abordagem-interdisciplinar---parte-iii',
    coauthors: ['Vitor Frederico Kümpel', 'Bruno de Ávila Borgarelli'],
    description:
      'Terceira parte da análise do caso Eliza Samúdio e a revogação de certidão de óbito.',
  },
  {
    title:
      'Dr. Hannibal Lecter e a utilização da própria vítima, em estado de inimputabilidade, para o cometimento do delito: autoria mediata imprópria?',
    year: 2016,
    publisher: 'Migalhas de Peso',
    url: 'https://www.migalhas.com.br/depeso/249782/dr--hannibal-lecter-e-a-utilizacao-da-propria-vitima--em-estado-de-inimputabilidade--para-o-cometimento-do-delito--autoria-mediata-impropria',
    description:
      'Análise da doutrina da autoria mediata imprópria no Direito Penal, utilizando o personagem Dr. Hannibal Lecter como estudo de caso.',
  },
  {
    title:
      'O problema do prazo para o exercício do direito de resposta judicial',
    year: 2018,
    publisher: 'Carta Forense / JusBrasil',
    url: 'https://www.jusbrasil.com.br/noticias/o-problema-do-prazo-para-o-exercicio-do-direito-de-resposta-judicial/547522076',
    originalPublisher:
      'Publicado originalmente no site www.cartaforense.com.br, em 21 de fevereiro de 2018, e republicado no JusBrasil',
    description:
      'Exame do problema do prazo para o exercício do direito de resposta judicial no ordenamento jurídico brasileiro.',
  },
  {
    title: 'Desafio da baleia azul (blue whale): repercussões penais e civis',
    year: 2018,
    publisher: 'Carta Forense',
    pdfUrl: '/artigos/Blue_whale.pdf',
    originalPublisher:
      'Publicado originalmente no site www.cartaforense.com.br, em 4 de junho de 2018',
    description:
      'Análise das repercussões penais e civis do desafio da baleia azul, examinando a subsunção ao tipo incriminador do art. 122 do Código Penal e a responsabilidade civil dos participantes.',
  },
  {
    title:
      'Repercussões extrapenais da absolvição proferida pelo Tribunal do Júri e a possibilidade de apelação do réu',
    year: 2018,
    publisher: 'Migalhas de Peso',
    url: 'https://www.migalhas.com.br/depeso/285490/repercussoes-extrapenais-da-absolvicao-proferida-pelo-tribunal-do-juri-e-a-possibilidade-de-apelacao-do-reu',
    description:
      'Análise das repercussões extrapenais da absolvição proferida pelo Tribunal do Júri e a possibilidade de apelação do réu.',
  },
  {
    title: 'Métodos de estudo para concursos e exame de Ordem — Parte I',
    year: 2018,
    publisher: 'Blog do DG',
    url: 'https://blogdodg.com.br/artigo-metodos-de-estudo-para-concursos-e-exame-de-ordem-parte-i-thales-ferri-schoedl/',
    description:
      'Primeira parte do artigo sobre métodos de estudo para concursos públicos e exame de Ordem.',
  },
  {
    title: 'Métodos de estudo para concursos e exame de Ordem — Parte II',
    year: 2018,
    publisher: 'Blog do DG',
    url: 'https://blogdodg.com.br/artigo-metodos-de-estudo-para-concursos-e-exame-de-ordem-parte-ii-thales-ferri-schoedl/',
    description:
      'Segunda parte do artigo sobre métodos de estudo para concursos públicos e exame de Ordem.',
  },
  {
    title:
      'Tecnologia Social online destinada ao exercício do direito de resposta: a utilização do território virtual como espaço centralizado para a defesa de direitos fundamentais',
    year: 2020,
    publisher: 'Revista Eletrônica Âmbito Jurídico',
    url: 'https://ambitojuridico.com.br/tecnologia-social-on-line-destinada-ao-exercicio-do-direito-de-resposta-a-utilizacao-do-territorio-virtual-como-espaco-centralizado-para-a-defesa-de-direitos-fundamentais/',
    description:
      'Artigo sobre a utilização do território virtual como espaço centralizado para a defesa de direitos fundamentais, especificamente o direito de resposta.',
  },
  {
    title:
      'Multidisciplinaridade e interdisciplinaridade do Estudo de Impacto Ambiental (EIA/RIMA)',
    year: 2020,
    publisher: 'Revista Eletrônica Jus',
    url: 'https://jus.com.br/artigos/78935/multidisciplinaridade-e-interdisciplinaridade-do-estudo-de-impacto-ambiental-eia-rima',
    description:
      'Estudo sobre a multidisciplinaridade e interdisciplinaridade do Estudo de Impacto Ambiental (EIA/RIMA).',
  },
  {
    title:
      'A "ampliação do círculo de intérpretes da Constituição" (HÄBERLE, 2002) como método de controle de constitucionalidade de decisões da Corte Suprema',
    year: 2021,
    publisher: 'Migalhas de Peso',
    url: 'https://www.migalhas.com.br/depeso/343473/a-ampliacao-do-circulo-de-interpretes-da-constituicao-haberle-2002',
    description:
      'Análise da ampliação do círculo de intérpretes da Constituição como método de controle de constitucionalidade de decisões da própria Corte Suprema.',
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
    'Advogado, jurista, professor, palestrante e ex-Promotor de Justiça do Estado de São Paulo, autor de mais de 10 livros e mais de 22 artigos jurídicos publicados.',
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
    'Autor de mais de 10 livros e mais de 22 artigos jurídicos publicados',
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
      'Direito Criminal, Tribunal do Júri, Improbidade Administrativa, Imobiliário, Cível e Disciplinar, com ênfase na defesa de servidores públicos. O Dr. Thales é também autor de mais de 10 livros e mais de 22 artigos jurídicos publicados.',
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
      'Prefaciada pelo Dr. José Cretella Neto, a obra contém um estudo crítico acerca do atual papel desempenhado pelo Supremo Tribunal Federal, com enfoque exclusivamente jurídico.',
    longDescription:
      'Prefaciada pelo jurista, professor e advogado Dr. José Cretella Neto, a obra contém um estudo crítico acerca do atual papel desempenhado pela Corte Suprema Brasileira (Supremo Tribunal Federal), com enfoque exclusivamente jurídico, muito embora suas recentes decisões venham produzindo nefastos impactos sociais, políticos e econômicos, notadamente por conta do cerceamento de direitos fundamentais conquistados após séculos de luta. Após se discorrer, brevemente, sobre o Jusnaturalismo, Positivismo Jurídico, Neoconstitucionalismo e o ativismo judicial, cada Capítulo foi dedicado ao exame de uma decisão proferida pelo STF, a saber: criminalização da homofobia, interferência do STF nas nomeações do presidente da República, levantamento do sigilo de reuniões presidenciais, investigação de "fake news" de ofício e prisão de parlamentares federais fora das hipóteses de flagrante por delito inafiançável. Nas Considerações Finais foram elencados os possíveis métodos de controle de constitucionalidade de decisões das próprias Cortes Supremas, sempre sob a ótica do Estado Democrático de Direito.',
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
    image: '/livros/capa-comentarios-stf.jpg',
    inStock: true,
    featured: false,
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
      'Prefaciada pelo Dr. Fernando Capez, esta obra é fruto da dissertação de Mestrado do autor na UFBA, sobre o conflito entre liberdade de imprensa e direitos da personalidade.',
    longDescription:
      'Esta obra, prefaciada pelo jurista, professor e ex-procurador de justiça Dr. Fernando Capez, é fruto da dissertação de Mestrado do autor na UFBA, inicia-se com um estudo crítico sobre o papel da imprensa no processo penal, tendo como premissa a desmistificação da ideia de "quarto poder", notadamente por conta da vinculação das organizações de comunicação social com os grandes agentes econômicos, o que muitas vezes compromete a imparcialidade e até mesmo a veracidade da informação, tendo como resultado a substituição do suplício da Idade Média pela exploração midiática da pessoa investigada ou acusada. Em seguida, ingressou-se na dogmática dos direitos fundamentais, tratando-se das teorias que procuram solucionar a colisão entre esses direitos, tendo como ponto de partida a distinção entre regras e princípios, passando-se ao conflito específico entre a liberdade de imprensa e os direitos da personalidade, reconhecendo-se a relatividade desses direitos, como consequência da doutrina jusnaturalista que fundamenta o presente trabalho, tratando-se ainda das tutelas previstas em lei (ações preventivas, reparatórias e direito de resposta).',
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
    image: '/livros/capa-liberdade-imprensa.jpg',
    inStock: true,
    featured: false,
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
      'Prefaciada pelo Dr. Vitor Frederico Kümpel, a obra trata da responsabilidade penal dos notários e registradores mediante abordagem interdisciplinar.',
    longDescription:
      'A presente obra, prefaciada pelo jurista, professor e desembargador Dr. Vitor Frederico Kümpel, integra a Coleção "Noções Elementares de Direito Notarial e Registral", tratando, mediante abordagem interdisciplinar, da classificação dos agentes públicos e dos notários e registradores, responsabilidade e imputabilidade, relação entre as esferas de responsabilidade (civil, penal e disciplinar) e dos delitos funcionais relacionados ao exercício profissional dos notários e registradores, concluindo com um ensaio sobre as repercussões penais da paternidade socioafetiva e das novas modalidades de família.',
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
    image: '/livros/capa-resp-penal-notarios.jpg',
    inStock: true,
    featured: false,
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
      'Prefaciada pelo tabelião Arthur Del Guércio Neto, com apresentação de Vitor Frederico Kümpel. Questões respondidas com fundamento e pesquisa minuciosos.',
    longDescription:
      'Prefaciada pelo jurista, tabelião e professor Arthur Del Guércio Neto, a obra, nas palavras de seu próprio apresentador, Dr. Vitor Frederico Kümpel, se vale da maiêutica para fins de aprendizado nas mais diversas áreas do direito, iniciando pelo Direito Constitucional e, além de seguir uma consequência cronológica na apresentação de perguntas e respostas, apresenta notas de rodapé esmiuçando cada assunto com academicismo e rigor não vistos nesse tipo de obra. O leitor está diante de questões respondidas com fundamento e pesquisa sérios e minuciosos, esmiuçando detidamente os diversos assuntos que podem ser questionados. Após o autor apresentar as principais perguntas e respostas do Direito Constitucional, procede da mesma forma em relação ao Direito Administrativo, Direito Tributário, Direito Penal (parte geral e parte especial), Direito Processual Penal, Direito Civil, Direito Processual Civil, Direito Empresarial, Legislação Especial, de forma a conter todo o alicerce e arcabouço das principais disciplinas para os concursos de Magistratura, Ministério Público, Procuradorias, Defensorias e para o Exame de Ordem.',
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
    image: '/livros/2243-questoes.jpg',
    inStock: true,
    featured: false,
    saleType: 'direto',
    saleNote: 'Venda direta com o autor',
  },
  // 5) Questões do Exame Oral de Cartórios (2017) — Editora/net
  {
    slug: 'questoes-exame-oral-cartorios',
    title: 'Questões Comentadas do Exame Oral: Concursos de Cartórios',
    subtitle:
      'Capítulos de Direito Penal, Processual Penal, Constitucional e Administrativo',
    author: 'Thales Ferri Schoedl (coautor)',
    coauthor: true,
    year: 2017,
    publisher: 'YK Editora',
    pages: 320,
    edition: '1ª edição',
    price: 79.9,
    description:
      'Coordenação de Alberto Gentil de Almeida Pedroso. Capítulos de Direito Penal, Processual Penal, Constitucional e Administrativo, os dois últimos em coautoria com Milton Fernando Lamanauskas.',
    longDescription:
      'Em obra coordenada pelo jurista, professor e juiz de direito Alberto Gentil de Almeida Pedroso, coube ao autor a elaboração dos Capítulos de Direito Penal, Processual Penal, Constitucional e Administrativo, os dois últimos em coautoria com o jurista, professor e tabelião Milton Fernando Lamanauskas, valendo-se da mesma metodologia do livro "2243 Questões para Concursos Públicos" para enfrentar diversas questões que foram objeto da prova oral dos Concursos de Cartórios.',
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
    image: '/livros/capa-questoes-exame-oral.png',
    inStock: true,
    saleType: 'editora',
    saleNote: 'Disponível na YK Editora e livrarias',
  },
  // 6) Direito Notarial e Registral em Artigos Vol. I (2016) — Editora/net
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
      'Coordenação de Arthur Del Guércio Neto e Lucas Barelli Del Guércio. Capítulo sobre discriminação em razão de deficiência (art. 88 da Lei 13.146/15).',
    longDescription:
      'Em obra coordenada pelos juristas, professores e tabeliães Arthur Del Guércio Neto e Lucas Barelli Del Guércio, coube ao autor tecer considerações sobre o tema "Discriminação em razão de deficiência (art. 88 da Lei 13.146/15): análise da constitucionalidade do delito em face dos princípios da legalidade e lesividade, quando praticado por tabelião de notas no exercício da função", propõe uma análise crítica do crime de discriminação em razão de deficiência (art. 88 da Lei 13.146/15), notadamente sobre sua constitucionalidade, confrontando-o com os princípios da legalidade e lesividade, este último implicitamente consagrado na Constituição Federal (CF, art. 5º, XXXIX), reconhecendo-se a atipicidade material da conduta do tabelião que se nega a lavrar ato notarial relacionado a negócio jurídico celebrado por pessoa com deficiência sem qualquer cognoscibilidade, desde que presente a intenção de protegê-la.',
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
    image: '/livros/direito-notarial.jpg',
    inStock: true,
    saleType: 'editora',
    saleNote: 'Disponível na YK Editora e livrarias',
  },
  // 7) Direito Notarial e Registral em Artigos Vol. II (2017) — Editora/net
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
      'Coordenação de Arthur Del Guércio Neto e Lucas Barelli Del Guércio. Capítulo sobre tipos disciplinares da Lei dos Notários e Registradores.',
    longDescription:
      'No Volume II da obra coordenada pelos juristas, professores e tabeliães Arthur Del Guércio Neto e Lucas Barelli Del Guércio, o autor trata do tema "Tipos disciplinares da Lei dos Notários e Registradores (art. 31, incisos I a V, da Lei 8.935/94): uma abordagem interdisciplinar sob a ótica do Direito Penal e Administrativo", defendendo que, embora se reconheça o princípio da atipicidade das faltas disciplinares, inerente ao Direito Administrativo, deve ser admitida a aplicação mitigada do princípio da taxatividade, que decorre da legalidade penal e informa os tipos penais incriminadores (CF, art. 5º, XXXIX, e CP, art. 1º), conferindo-se assim maior segurança jurídica ao exercício da função dos notários e registradores.',
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
    image: '/livros/capa-direito-notarial-vol2.png',
    inStock: true,
    saleType: 'editora',
    saleNote: 'Disponível na YK Editora e livrarias',
  },
  // 8) Direitos Fundamentais e Relações Jurídicas (2015) — Editora/net
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
      'Coordenação de Alexandre Coutinho Pagliarini e Zelma Tomaz Tolentino. Capítulo sobre a compensatória produção de danos morais por veículos de comunicação.',
    longDescription:
      'Em obra coordenada pelos juristas Alexandre Coutinho Pagliarini e Zelma Tomaz Tolentino, o Capítulo elaborado pelo autor é dedicado ao tema "A compensatória produção de danos morais por veículos de comunicação", embrião de sua obra sobre a liberdade de imprensa e os direitos da personalidade (2019), versando sobre os aspectos jurídicos e econômicos relacionados às ofensas produzidas por veículos de comunicação aos direitos da personalidade, passando pelo conflito entre os direitos fundamentais à honra, imagem, privacidade e intimidade, de um lado, e os direitos à informação e à livre manifestação do pensamento, de outro, para, posteriormente, ingressar nos critérios para a fixação do dano moral, demonstrando-se, ao final, que a produção de ofensas por órgãos de imprensa, na conjuntura atual, revela-se uma atividade compensatória sob o ponto de vista econômico.',
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
    image: '/livros/direitos-fundamentais.jpg',
    inStock: true,
    saleType: 'editora',
    saleNote: 'Disponível na GZ Editora e livrarias',
  },
  // 9) Reflexiones sobre Derecho Latinoamericano Vol. 11 (2013) — Editora/net
  {
    slug: 'reflexiones-derecho-latinoamericano-vol-11',
    title: 'Reflexiones sobre Derecho Latinoamericano',
    subtitle: 'Volumen 11',
    author: 'Thales Ferri Schoedl (coautor)',
    coauthor: true,
    year: 2013,
    publisher: 'Editorial Derecho Latino (Buenos Aires)',
    pages: 400,
    edition: '1ª edição',
    price: 79.9,
    description:
      'Coordenação de Paulo Aragão, José Marco Tayah e Letícia Danielle Romano. Capítulo sobre controle de constitucionalidade dos tipos penais sob o aspecto material.',
    longDescription:
      'No Volume 11 da obra coordenada pelos juristas e professores Paulo Aragão, José Marco Tayah, Letícia Danielle Romano, publicada no Brasil e na Argentina, o autor aborda o tema "Controle de constitucionalidade dos tipos penais sob o aspecto material", iniciando pelas modalidades de controle de constitucionalidade, passando pela tipicidade material e seus princípios informadores, os quais devem nortear tanto o legislador, no momento da elaboração dos tipos penais, como o aplicador da lei penal, ao realizar o juízo de subsunção de um fato ao tipo penal, concluindo pela necessidade de ampliação do controle de constitucionalidade dos tipos penais sob o aspecto material, e conferindo à jurisprudência a tarefa de trilhar os rumos para o seu necessário amadurecimento.',
    topics: [
      'Direito Latinoamericano',
      'Direito Comparado',
      'Controle de constitucionalidade',
      'Tipos penais',
      'Direito Penal Constitucional',
    ],
    dimensions: { width: 16, height: 23, depth: 2.5, unit: 'cm' },
    weight: 580,
    weightUnit: 'g',
    image: '/livros/reflexiones-derecho.jpg',
    inStock: true,
    saleType: 'editora',
    saleNote:
      'Disponível na Editorial Derecho Latino e livrarias internacionais',
  },
  // 10) Reflexiones sobre Derecho Latinoamericano Vol. 15 (2014) — Editora/net
  {
    slug: 'reflexiones-derecho-latinoamericano-vol-15',
    title: 'Reflexiones sobre Derecho Latinoamericano',
    subtitle: 'Volumen 15',
    author: 'Thales Ferri Schoedl (coautor)',
    coauthor: true,
    year: 2014,
    publisher: 'Editorial Derecho Latino (Buenos Aires)',
    pages: 420,
    edition: '1ª edição',
    price: 84.9,
    description:
      'Coordenação de Paulo Aragão, José Marco Tayah e Letícia Danielle Romano. Capítulo sobre o crime de tortura: características gerais e análise de caso.',
    longDescription:
      'No Volume 15 da obra coordenada pelos juristas e professores Paulo Aragão, José Marco Tayah, Letícia Danielle Romano, igualmente publicada no Brasil e na Argentina, o Capítulo de responsabilidade do autor trata do tema "Do crime de tortura: características gerais e análise de caso", tendo por objeto estudo de caso sobre o delito de tortura, no qual figura como denunciado um agente público, trazendo considerações sobre as características gerais do crime de tortura no Brasil, nos moldes em que fora tipificado pela Lei 9.455/97, compreendendo as modalidades, objeto jurídico, sujeitos do delito, consumação e tentativa, formas qualificadas, causas de aumento de pena, efeitos da condenação, disposições especiais e extraterritorialidade, com especial atenção ao problema da tipificação da tortura como crime comum ou próprio, e às consequências de tal distinção.',
    topics: [
      'Direito Latinoamericano',
      'Direito Comparado',
      'Crime de tortura',
      'Direito Penal Internacional',
    ],
    dimensions: { width: 16, height: 23, depth: 2.8, unit: 'cm' },
    weight: 610,
    weightUnit: 'g',
    image: '/livros/reflexoes-sobre.jpg',
    inStock: true,
    saleType: 'editora',
    saleNote:
      'Disponível na Editorial Derecho Latino e livrarias internacionais',
  },
];
