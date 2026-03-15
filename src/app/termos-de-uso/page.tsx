import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export const metadata = {
  title: 'Termos de Uso',
  description:
    'Termos de Uso do site Ferri Schoedl Advocacia, incluindo condições de compra de livros e cursos.',
};

export default function TermosDeUsoPage() {
  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading label='Legal' title='Termos de Uso' align='left' />

        <Reveal>
          <div className='space-y-8 text-sm leading-relaxed text-txt-muted'>
            <p className='text-xs text-txt-muted'>
              Última atualização: março de 2026
            </p>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                1. Aceitação dos termos
              </h3>
              <p>
                Ao acessar e utilizar o site da Ferri Schoedl Advocacia, você
                concorda integralmente com estes Termos de Uso. Caso não
                concorde, orientamos que não utilize o site. O uso continuado
                após alterações constitui aceitação dos termos atualizados.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                2. Descrição dos serviços
              </h3>
              <p>
                Este site tem caráter institucional e informativo, apresentando
                os serviços jurídicos do escritório Ferri Schoedl Advocacia.
                Adicionalmente, o site disponibiliza a venda de livros e,
                futuramente, cursos e materiais educacionais, bem como cadastro
                de usuários para acesso a conteúdos e funcionalidades
                específicas.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                3. Conteúdo informativo
              </h3>
              <p>
                As informações disponibilizadas neste site possuem caráter
                meramente informativo e não constituem aconselhamento jurídico,
                parecer ou consultoria. A relação advogado-cliente somente se
                estabelece mediante contratação formal dos serviços.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                4. Compra de livros e cursos
              </h3>
              <p>
                As compras realizadas pelo site estão sujeitas às seguintes
                condições: os preços estão em Reais (BRL) e podem ser alterados
                sem aviso prévio; o pagamento é processado por operadoras
                terceiras que possuem suas próprias políticas de segurança; após
                a confirmação do pagamento, o prazo de entrega será informado de
                acordo com a opção de frete selecionada.
              </p>
              <p className='mt-2'>
                Nos termos do art. 49 do Código de Defesa do Consumidor (Lei
                8.078/90), o consumidor pode desistir da compra no prazo de 7
                (sete) dias a contar do recebimento do produto, mediante
                comunicação por e-mail. Nesse caso, os valores pagos serão
                integralmente devolvidos, incluindo o frete.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                5. Cadastro de usuário
              </h3>
              <p>
                Para acessar determinadas funcionalidades, poderá ser necessário
                o cadastro com informações verdadeiras e atualizadas. O usuário
                é responsável pela confidencialidade de suas credenciais de
                acesso e por todas as atividades realizadas em sua conta.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                6. Propriedade intelectual
              </h3>
              <p>
                Todo o conteúdo do site — textos, imagens, logotipos, layout,
                artigos e materiais didáticos — é protegido por direitos
                autorais e propriedade intelectual. É proibida a reprodução,
                distribuição ou modificação sem autorização prévia e expressa.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                7. Código de Ética da OAB
              </h3>
              <p>
                Este site observa rigorosamente as disposições do Código de
                Ética e Disciplina da OAB (Resolução 02/2015 do CFOAB) e do
                Provimento 205/2021 do CFOAB, que regulamenta a publicidade na
                advocacia. O conteúdo aqui disponibilizado possui caráter
                informativo e não configura captação de clientela.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                8. Limitação de responsabilidade
              </h3>
              <p>
                A Ferri Schoedl Advocacia não se responsabiliza por danos
                decorrentes do uso ou impossibilidade de uso do site, incluindo
                interrupções, erros técnicos ou indisponibilidade temporária. O
                site é disponibilizado &quot;como está&quot;, sem garantias
                expressas ou implícitas quanto à disponibilidade contínua.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                9. Legislação aplicável e foro
              </h3>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do
                Brasil. Fica eleito o Foro da Comarca de São Paulo/SP para
                dirimir quaisquer controvérsias, com renúncia a qualquer outro,
                por mais privilegiado que seja.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                10. Contato
              </h3>
              <p>
                Para dúvidas, solicitações ou exercício de direitos relacionados
                a estes Termos, utilize os canais de contato disponíveis na
                página de Contato deste site.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
