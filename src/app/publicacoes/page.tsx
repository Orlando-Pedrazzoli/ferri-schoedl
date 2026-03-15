'use client';

import Link from 'next/link';
import {
  BookOpen,
  FileText,
  Scale,
  ExternalLink,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { publicacoes } from '@/lib/data';

const artigos = [
  {
    title: 'Autoria mediata imprópria',
    portal: 'Portal Migalhas',
    description:
      'Texto didático sobre Direito Penal que explica a diferença entre quem executa o crime diretamente e quem utiliza outra pessoa como instrumento — tema recorrente em casos de organizações criminosas e erro de proibição.',
  },
  {
    title: 'Controle de constitucionalidade',
    portal: 'Portal Migalhas',
    description:
      'Análise das vertentes do controle no Brasil (difuso e concentrado), discutindo a importância do STF na guarda da Constituição.',
  },
  {
    title: 'Estudo de Impacto Ambiental — EIA/RIMA',
    portal: 'Jus.com.br',
    description:
      'Artigo técnico sobre Direito Ambiental, com foco na necessidade de uma abordagem interdisciplinar que una biologia, engenharia e direito para a proteção do ecossistema.',
  },
  {
    title: 'O caso Eliza Samúdio e a revogação de certidão de óbito',
    portal: 'Série de artigos',
    description:
      'Série de artigos em colaboração com outros juristas (como Frederico Kümpel), analisando o caso sob uma perspectiva civil-registral inédita.',
  },
  {
    title: 'Repercussões extrapenais da absolvição',
    portal: 'Artigo doutrinário',
    description:
      'Análise doutrinária que discute a independência das instâncias civil, penal e administrativa e suas repercussões práticas.',
  },
];

const vitorias = [
  {
    titulo: 'Indenização contra a Rede Record',
    instancia: 'STJ — 3ª Turma',
    descricao:
      'A 3ª Turma do STJ manteve a condenação da emissora ao pagamento de R$ 200 mil por danos morais, entendendo que as matérias veiculadas geraram uma exposição sensacionalista prejudicial à imagem do advogado.',
  },
  {
    titulo: 'Vitória contra a Editora Abril / Revista Veja',
    instancia: 'Justiça de São Paulo',
    descricao:
      'A Justiça de São Paulo julgou procedente o pedido de indenização por publicações consideradas injuriosas e que divulgaram informações equivocadas.',
  },
  {
    titulo: 'Condenação do Jornal O Estado de S. Paulo',
    instancia: '35ª Vara Cível de São Paulo',
    descricao:
      'Decisão que condenou o jornal ao pagamento de indenização por danos morais devido a publicações difamatórias.',
  },
];

export default function PublicacoesPage() {
  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading
          label='Obras e artigos'
          title='Publicações'
          description='Produção acadêmica, editorial e jurisprudencial que reflete décadas de experiência na prática e no ensino do Direito.'
        />

        {/* ───── OBRA PRINCIPAL ───── */}
        <Reveal>
          <div className='mb-12 border border-gold-500/15 bg-navy-800/30 p-6 sm:mb-16 sm:p-8 lg:p-10'>
            <p className='mb-4 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
              Obra principal
            </p>
            <h2 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100 lg:text-3xl'>
              Liberdade de Imprensa e Direitos da Personalidade
            </h2>
            <p className='mt-1 text-sm italic text-gold-600'>
              Uma abordagem interdisciplinar — Editora Letras Jurídicas, 2019
            </p>

            <p className='mt-6 text-base leading-relaxed text-txt-muted'>
              Sistematização da pesquisa acadêmica de Thales Ferri Schoedl sobre
              a relação entre o Judiciário e a Mídia. A obra foi destaque na
              Promoção Natal Migalhas em 2018 e 2019.
            </p>

            <div className='mt-8 grid gap-6 md:grid-cols-3'>
              <div className='border-l border-gold-500/20 pl-5'>
                <p className='mb-2 text-xs uppercase tracking-[1.5px] text-gold-600'>
                  Tese central
                </p>
                <p className='text-sm leading-relaxed text-txt-muted'>
                  O autor critica a ideia da imprensa como um "quarto poder"
                  absoluto, argumentando que a ligação dos grandes veículos com
                  grupos econômicos compromete a imparcialidade.
                </p>
              </div>
              <div className='border-l border-gold-500/20 pl-5'>
                <p className='mb-2 text-xs uppercase tracking-[1.5px] text-gold-600'>
                  Exploração midiática
                </p>
                <p className='text-sm leading-relaxed text-txt-muted'>
                  Schoedl defende que o antigo suplício físico da Idade Média
                  foi substituído pela exposição exaustiva e sensacionalista do
                  investigado — uma condenação moral antecipada.
                </p>
              </div>
              <div className='border-l border-gold-500/20 pl-5'>
                <p className='mb-2 text-xs uppercase tracking-[1.5px] text-gold-600'>
                  Solução jurídica
                </p>
                <p className='text-sm leading-relaxed text-txt-muted'>
                  Propõe a aplicação da Teoria da Ponderação (de Robert Alexy)
                  para resolver conflitos onde a liberdade de informar colide
                  com o direito à honra e à imagem.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ───── LIVROS E OBRAS ───── */}
        <Reveal>
          <p className='mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
            <span className='h-px w-8 bg-gold-500/40' />
            Livros e obras coletivas
          </p>
        </Reveal>

        <RevealStagger className='space-y-6'>
          {publicacoes.map((pub, i) => (
            <RevealItem key={i}>
              <div className='group border border-gold-500/8 bg-navy-800/20 p-6 transition-all duration-300 hover:border-gold-500/15 sm:p-8 lg:p-10'>
                <div className='flex flex-col gap-6 lg:flex-row lg:gap-10'>
                  {/* Year badge */}
                  <div className='shrink-0'>
                    <div className='flex h-16 w-16 flex-col items-center justify-center border border-gold-500/15 bg-navy-800/40 sm:h-20 sm:w-20'>
                      <span className='font-[family-name:var(--font-cormorant)] text-2xl font-light text-gold-500 sm:text-3xl'>
                        {pub.year}
                      </span>
                    </div>
                  </div>

                  <div className='flex-1'>
                    <div className='flex items-start gap-3'>
                      <BookOpen
                        size={18}
                        strokeWidth={1.2}
                        className='mt-1 shrink-0 text-gold-600/50'
                      />
                      <div>
                        <h3 className='font-[family-name:var(--font-cormorant)] text-xl text-cream-100 lg:text-2xl'>
                          {pub.title}
                        </h3>
                        {pub.subtitle && (
                          <p className='mt-1 text-sm italic text-gold-600'>
                            {pub.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className='mt-4 text-sm leading-relaxed text-txt-muted'>
                      {pub.description}
                    </p>

                    <div className='mt-4 flex flex-wrap gap-4 text-[13px] text-txt-muted'>
                      <span className='border-l border-gold-500/20 pl-3'>
                        {pub.publisher}
                      </span>
                      {pub.pages && (
                        <span className='border-l border-gold-500/20 pl-3'>
                          {pub.pages} páginas
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* ───── ARTIGOS DE DOUTRINA ───── */}
        <Reveal className='mt-16 sm:mt-20'>
          <p className='mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
            <span className='h-px w-8 bg-gold-500/40' />
            Artigos de doutrina
          </p>
          <p className='mb-8 max-w-2xl text-sm text-txt-muted'>
            Textos técnicos publicados regularmente em portais jurídicos,
            contribuindo para o debate acadêmico e profissional.
          </p>
        </Reveal>

        <RevealStagger className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {artigos.map((artigo, i) => (
            <RevealItem key={i}>
              <div className='flex h-full flex-col border border-gold-500/8 bg-navy-800/20 p-5 transition-all duration-300 hover:border-gold-500/15 sm:p-6'>
                <FileText
                  size={20}
                  strokeWidth={1.2}
                  className='mb-4 text-gold-500/70'
                />
                <h3 className='font-[family-name:var(--font-cormorant)] text-lg text-cream-100'>
                  {artigo.title}
                </h3>
                <p className='mt-1 text-xs uppercase tracking-[1px] text-gold-600'>
                  {artigo.portal}
                </p>
                <p className='mt-3 flex-1 text-sm leading-relaxed text-txt-muted'>
                  {artigo.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* ───── VITÓRIAS JURÍDICAS ───── */}
        <Reveal className='mt-16 sm:mt-20'>
          <p className='mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
            <span className='h-px w-8 bg-gold-500/40' />
            Vitórias jurídicas e proteção da imagem
          </p>
          <p className='mb-8 max-w-3xl text-sm text-txt-muted'>
            O STJ e o TJ/SP proferiram decisões que reconheceram o direito de
            Thales Ferri Schoedl à preservação de sua honra contra abusos
            midiáticos. Essas decisões são frequentemente publicadas no
            Informativo do STJ, servindo como material de estudo para advogados
            que atuam com responsabilidade civil.
          </p>
        </Reveal>

        <RevealStagger className='space-y-4'>
          {vitorias.map((vitoria, i) => (
            <RevealItem key={i}>
              <div className='flex gap-4 border border-gold-500/8 bg-navy-800/20 p-5 transition-all duration-300 hover:border-gold-500/15 sm:gap-6 sm:p-6 lg:p-8'>
                <div className='hidden shrink-0 sm:block'>
                  <Scale
                    size={24}
                    strokeWidth={1}
                    className='mt-1 text-gold-500/60'
                  />
                </div>
                <div>
                  <h3 className='font-[family-name:var(--font-cormorant)] text-lg text-cream-100'>
                    {vitoria.titulo}
                  </h3>
                  <p className='mt-1 text-xs uppercase tracking-[1.5px] text-gold-600'>
                    {vitoria.instancia}
                  </p>
                  <p className='mt-3 text-sm leading-relaxed text-txt-muted'>
                    {vitoria.descricao}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* ───── ONDE ENCONTRAR ───── */}
        <Reveal className='mt-16 sm:mt-20'>
          <div className='border border-gold-500/10 bg-navy-900/40 p-6 sm:p-8 lg:p-10'>
            <p className='mb-6 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
              Onde encontrar
            </p>
            <div className='grid gap-6 md:grid-cols-3'>
              <div className='flex items-start gap-4'>
                <ExternalLink
                  size={18}
                  strokeWidth={1.2}
                  className='mt-1 shrink-0 text-gold-600'
                />
                <div>
                  <p className='text-sm font-medium text-cream-100'>Migalhas</p>
                  <p className='mt-1 text-sm text-txt-muted'>
                    Pesquise por "Thales Ferri Schoedl" na busca interna do site
                    migalhas.com.br para acessar os artigos na íntegra.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <ExternalLink
                  size={18}
                  strokeWidth={1.2}
                  className='mt-1 shrink-0 text-gold-600'
                />
                <div>
                  <p className='text-sm font-medium text-cream-100'>
                    Jusbrasil
                  </p>
                  <p className='mt-1 text-sm text-txt-muted'>
                    Acórdãos e decisões judiciais que discutem liberdade de
                    imprensa e proteção da personalidade.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <ExternalLink
                  size={18}
                  strokeWidth={1.2}
                  className='mt-1 shrink-0 text-gold-600'
                />
                <div>
                  <p className='text-sm font-medium text-cream-100'>
                    Livrarias
                  </p>
                  <p className='mt-1 text-sm text-txt-muted'>
                    Os livros físicos e e-books estão disponíveis nas livrarias
                    Martins Fontes e YK Editora.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal className='mt-12 text-center sm:mt-16'>
          <Link
            href='/livros'
            className='group inline-flex items-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400 sm:px-8 sm:py-3.5'
          >
            Ver livros à venda
            <ArrowRight
              size={14}
              className='transition-transform group-hover:translate-x-1'
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
