import { getPageContent } from '@/lib/content-helpers';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export const revalidate = 60;

export const metadata = {
  title: 'Termos de Uso',
  description:
    'Termos de Uso do site Ferri Schoedl Advocacia, incluindo condições de compra de livros e cursos.',
};

// Fallback sections — exact text from the original hardcoded page
const fallbackSections = [
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
];

export default async function TermosDeUsoPage() {
  const content = await getPageContent('termos');

  const lastUpdate = content['termos.lastUpdate'] || 'março de 2026';

  let sections = fallbackSections;
  const dbSections = content['termos.sections'];
  if (dbSections) {
    try {
      const parsed = JSON.parse(dbSections);
      if (Array.isArray(parsed) && parsed.length > 0) {
        sections = parsed;
      }
    } catch {
      // JSON parse failed — use fallback
    }
  }

  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading label='Legal' title='Termos de Uso' align='left' />

        <Reveal>
          <div className='space-y-8 text-sm leading-relaxed text-txt-muted'>
            <p className='text-xs text-txt-muted'>
              Última atualização: {lastUpdate}
            </p>

            {sections.map((section, i) => (
              <div key={i}>
                <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                  {section.title}
                </h3>
                {section.text.split('\n\n').map((paragraph, j) => (
                  <p key={j} className={j > 0 ? 'mt-2' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
