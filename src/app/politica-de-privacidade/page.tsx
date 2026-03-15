import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export const metadata = {
  title: 'Política de Privacidade',
  description:
    'Política de Privacidade do escritório Ferri Schoedl Advocacia, em conformidade com a LGPD (Lei 13.709/18).',
};

export default function PoliticaDePrivacidadePage() {
  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading
          label='LGPD'
          title='Política de Privacidade'
          align='left'
        />

        <Reveal>
          <div className='space-y-8 text-sm leading-relaxed text-txt-muted'>
            <p className='text-xs text-txt-muted'>
              Última atualização: março de 2026
            </p>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                1. Introdução
              </h3>
              <p>
                A Ferri Schoedl Advocacia, inscrita na OAB/SP sob o número
                196.377, com sede em São Paulo/SP, está comprometida com a
                proteção dos dados pessoais de seus clientes, usuários e
                visitantes, em conformidade com a Lei Geral de Proteção de Dados
                (Lei nº 13.709/2018 — LGPD) e demais normas aplicáveis.
              </p>
              <p className='mt-2'>
                Esta Política descreve como coletamos, utilizamos, armazenamos,
                compartilhamos e protegemos seus dados pessoais ao acessar nosso
                site, utilizar nossos serviços, adquirir livros ou cursos, e
                realizar cadastro em nossa plataforma.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                2. Dados pessoais coletados
              </h3>
              <p>Podemos coletar os seguintes dados pessoais:</p>
              <p className='mt-2'>
                <span className='text-cream-100'>Dados de identificação:</span>{' '}
                nome completo, CPF, e-mail, telefone e endereço.
              </p>
              <p className='mt-1'>
                <span className='text-cream-100'>Dados de navegação:</span>{' '}
                endereço IP, tipo de navegador, páginas acessadas, tempo de
                permanência e cookies.
              </p>
              <p className='mt-1'>
                <span className='text-cream-100'>
                  Dados de transação comercial:
                </span>{' '}
                informações de pagamento (processadas por terceiros seguros),
                endereço de entrega, histórico de compras.
              </p>
              <p className='mt-1'>
                <span className='text-cream-100'>Dados de cadastro:</span>{' '}
                credenciais de acesso, preferências de comunicação e dados
                fornecidos em formulários.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                3. Finalidades do tratamento
              </h3>
              <p>
                Seus dados pessoais são tratados para as seguintes finalidades:
                prestação de serviços jurídicos e atendimento de consultas;
                processamento de compras de livros e cursos; envio de
                comunicações sobre serviços, conteúdos e lançamentos (mediante
                consentimento); cumprimento de obrigações legais e regulatórias;
                melhoria da experiência de navegação e do funcionamento do site;
                prevenção de fraudes e garantia da segurança da plataforma.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                4. Base legal para o tratamento
              </h3>
              <p>
                O tratamento de dados pessoais é realizado com base nas
                hipóteses previstas no art. 7º da LGPD, incluindo: consentimento
                do titular; execução de contrato ou procedimentos preliminares;
                cumprimento de obrigação legal ou regulatória; exercício regular
                de direitos em processo judicial; e interesse legítimo do
                controlador, respeitados os direitos do titular.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                5. Compartilhamento de dados
              </h3>
              <p>
                Seus dados pessoais podem ser compartilhados com: processadores
                de pagamento (para viabilizar transações comerciais); serviços
                de logística (para entrega de livros); ferramentas de análise de
                navegação (Google Analytics ou similares, mediante
                consentimento); e autoridades públicas, quando exigido por lei
                ou decisão judicial.
              </p>
              <p className='mt-2'>
                Não comercializamos, alugamos ou cedemos dados pessoais a
                terceiros para fins distintos dos aqui descritos.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                6. Cookies
              </h3>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar a
                experiência de navegação. Os cookies são classificados em:
                necessários (funcionamento essencial do site), de análise
                (compreensão do comportamento do usuário) e de marketing
                (conteúdo personalizado). Você pode gerenciar suas preferências
                de cookies a qualquer momento através do banner de consentimento
                exibido no site.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                7. Direitos do titular
              </h3>
              <p>
                Nos termos do art. 18 da LGPD, você tem direito a: confirmação
                da existência de tratamento; acesso aos seus dados; correção de
                dados incompletos ou desatualizados; anonimização, bloqueio ou
                eliminação de dados desnecessários; portabilidade dos dados;
                eliminação dos dados tratados com base no consentimento;
                informação sobre compartilhamento; informação sobre a
                possibilidade de não fornecer consentimento e suas
                consequências; e revogação do consentimento.
              </p>
              <p className='mt-2'>
                Para exercer qualquer destes direitos, entre em contato pelo
                e-mail indicado na seção de contato deste site.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                8. Segurança dos dados
              </h3>
              <p>
                Adotamos medidas técnicas e administrativas adequadas para
                proteger seus dados pessoais contra acessos não autorizados,
                situações acidentais ou ilícitas de destruição, perda, alteração
                ou comunicação indevida, incluindo criptografia, controle de
                acesso e monitoramento contínuo.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                9. Retenção dos dados
              </h3>
              <p>
                Os dados pessoais serão retidos pelo tempo necessário ao
                cumprimento das finalidades para as quais foram coletados,
                inclusive para atender obrigações legais, contábeis ou
                regulatórias. Dados relacionados a transações comerciais serão
                mantidos pelo prazo legal aplicável (Código de Defesa do
                Consumidor, legislação tributária, etc.).
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                10. Encarregado de dados (DPO)
              </h3>
              <p>
                Em caso de dúvidas sobre o tratamento de dados pessoais ou para
                exercer seus direitos como titular, entre em contato com nosso
                Encarregado de Proteção de Dados através do e-mail disponível na
                página de contato deste site.
              </p>
            </div>

            <div>
              <h3 className='mb-3 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                11. Alterações nesta política
              </h3>
              <p>
                Esta Política de Privacidade poderá ser atualizada
                periodicamente. Recomendamos a consulta regular desta página.
                Alterações substanciais serão comunicadas por meio do site ou
                por e-mail, quando aplicável.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
