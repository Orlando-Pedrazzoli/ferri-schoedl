/**
 * Calculo de frete baseado em tabela regional dos Correios
 * Origem: CEP 88330-045 (Balneario Camboriu, SC)
 *
 * Valores baseados na tabela a vista dos Correios (reajuste abril 2025, +9.6%)
 * com margem de seguranca de +15% para cobrir variacoes de CEP dentro da mesma regiao.
 *
 * O Thales despacha no balcao sem contrato, paga tarifa a vista.
 * Embalagem: o cliente paga a embalagem dos Correios (~R$7-10) separadamente no balcao,
 * OU o Thales embala por conta propria. O valor de embalagem NAO esta incluido no frete.
 *
 * Ultima actualizacao: Abril 2026
 * Proxima revisao recomendada: Abril 2027 (reajuste anual dos Correios)
 */

// --- Regioes por faixa de CEP ---

type Regiao =
  | 'local'
  | 'sul'
  | 'sudeste'
  | 'centro_oeste'
  | 'nordeste'
  | 'norte';

function getRegiao(cep: string): Regiao {
  const cepNum = parseInt(cep.replace(/\D/g, ''));

  // SC local (88000-89999) — mesma regiao do remetente
  if (cepNum >= 88000000 && cepNum <= 89999999) return 'local';

  // Sul: PR (80000-87999), RS (90000-99999)
  if (cepNum >= 80000000 && cepNum <= 87999999) return 'sul';
  if (cepNum >= 90000000 && cepNum <= 99999999) return 'sul';

  // Sudeste: SP (01000-19999), RJ (20000-28999), MG (30000-39999), ES (29000-29999)
  if (cepNum >= 1000000 && cepNum <= 19999999) return 'sudeste';
  if (cepNum >= 20000000 && cepNum <= 28999999) return 'sudeste';
  if (cepNum >= 29000000 && cepNum <= 29999999) return 'sudeste';
  if (cepNum >= 30000000 && cepNum <= 39999999) return 'sudeste';

  // Centro-Oeste: DF (70000-72799, 73000-73699), GO (72800-72999, 73700-76799),
  // MT (78000-78899), MS (79000-79999), TO (77000-77999)
  if (cepNum >= 70000000 && cepNum <= 76999999) return 'centro_oeste';
  if (cepNum >= 77000000 && cepNum <= 77999999) return 'centro_oeste';
  if (cepNum >= 78000000 && cepNum <= 78999999) return 'centro_oeste';
  if (cepNum >= 79000000 && cepNum <= 79999999) return 'centro_oeste';

  // Nordeste: BA (40000-48999), SE (49000-49999), PE (50000-56999),
  // AL (57000-57999), PB (58000-58999), RN (59000-59999),
  // CE (60000-63999), PI (64000-64999), MA (65000-65999)
  if (cepNum >= 40000000 && cepNum <= 65999999) return 'nordeste';

  // Norte: PA (66000-68899), AP (68900-68999), AM (69000-69299, 69400-69899),
  // RR (69300-69399), AC (69900-69999), RO (76800-76999)
  if (cepNum >= 66000000 && cepNum <= 69999999) return 'norte';
  if (cepNum >= 76800000 && cepNum <= 76999999) return 'norte';

  // Fallback: tratar como norte (mais caro, seguro)
  return 'norte';
}

// --- Tabela de precos por regiao e peso ---
// Valores em R$ (servico, sem embalagem)
// Baseados em consulta ao simulador dos Correios (abril 2026)
// PAC SC->AC confirmado: R$25,80 para 1kg
// Margem de seguranca: +15%

interface FaixaPreco {
  pesoMaxG: number; // peso maximo em gramas
  pac: Record<Regiao, number>;
  sedex: Record<Regiao, number>;
  pacPrazo: Record<Regiao, string>;
  sedexPrazo: Record<Regiao, string>;
}

const TABELA_FRETE: FaixaPreco[] = [
  {
    // Ate 500g (Comentarios STF: 380g, Liberdade imprensa: 440g)
    pesoMaxG: 500,
    pac: {
      local: 16.5,
      sul: 19.9,
      sudeste: 23.9,
      centro_oeste: 26.9,
      nordeste: 28.9,
      norte: 30.9,
    },
    sedex: {
      local: 22.9,
      sul: 29.9,
      sudeste: 38.9,
      centro_oeste: 44.9,
      nordeste: 49.9,
      norte: 54.9,
    },
    pacPrazo: {
      local: '3-5 dias uteis',
      sul: '4-6 dias uteis',
      sudeste: '5-8 dias uteis',
      centro_oeste: '6-9 dias uteis',
      nordeste: '7-12 dias uteis',
      norte: '8-15 dias uteis',
    },
    sedexPrazo: {
      local: '1-2 dias uteis',
      sul: '2-3 dias uteis',
      sudeste: '2-4 dias uteis',
      centro_oeste: '3-5 dias uteis',
      nordeste: '4-6 dias uteis',
      norte: '5-7 dias uteis',
    },
  },
  {
    // Ate 1000g
    pesoMaxG: 1000,
    pac: {
      local: 19.9,
      sul: 22.9,
      sudeste: 27.9,
      centro_oeste: 30.9,
      nordeste: 33.9,
      norte: 35.9,
    },
    sedex: {
      local: 26.9,
      sul: 34.9,
      sudeste: 45.9,
      centro_oeste: 52.9,
      nordeste: 58.9,
      norte: 64.9,
    },
    pacPrazo: {
      local: '3-5 dias uteis',
      sul: '4-6 dias uteis',
      sudeste: '5-8 dias uteis',
      centro_oeste: '6-9 dias uteis',
      nordeste: '7-12 dias uteis',
      norte: '8-15 dias uteis',
    },
    sedexPrazo: {
      local: '1-2 dias uteis',
      sul: '2-3 dias uteis',
      sudeste: '2-4 dias uteis',
      centro_oeste: '3-5 dias uteis',
      nordeste: '4-6 dias uteis',
      norte: '5-7 dias uteis',
    },
  },
  {
    // Ate 1500g (2243 Questoes: 1250g)
    pesoMaxG: 1500,
    pac: {
      local: 23.9,
      sul: 27.9,
      sudeste: 34.9,
      centro_oeste: 38.9,
      nordeste: 42.9,
      norte: 46.9,
    },
    sedex: {
      local: 32.9,
      sul: 42.9,
      sudeste: 56.9,
      centro_oeste: 64.9,
      nordeste: 72.9,
      norte: 79.9,
    },
    pacPrazo: {
      local: '3-5 dias uteis',
      sul: '4-6 dias uteis',
      sudeste: '5-8 dias uteis',
      centro_oeste: '6-9 dias uteis',
      nordeste: '7-12 dias uteis',
      norte: '8-15 dias uteis',
    },
    sedexPrazo: {
      local: '1-2 dias uteis',
      sul: '2-3 dias uteis',
      sudeste: '2-4 dias uteis',
      centro_oeste: '3-5 dias uteis',
      nordeste: '4-6 dias uteis',
      norte: '5-7 dias uteis',
    },
  },
  {
    // Ate 2000g (caso compre 2 livros leves)
    pesoMaxG: 2000,
    pac: {
      local: 27.9,
      sul: 32.9,
      sudeste: 41.9,
      centro_oeste: 46.9,
      nordeste: 52.9,
      norte: 57.9,
    },
    sedex: {
      local: 38.9,
      sul: 52.9,
      sudeste: 68.9,
      centro_oeste: 78.9,
      nordeste: 88.9,
      norte: 96.9,
    },
    pacPrazo: {
      local: '3-5 dias uteis',
      sul: '4-6 dias uteis',
      sudeste: '5-8 dias uteis',
      centro_oeste: '6-9 dias uteis',
      nordeste: '7-12 dias uteis',
      norte: '8-15 dias uteis',
    },
    sedexPrazo: {
      local: '1-2 dias uteis',
      sul: '2-3 dias uteis',
      sudeste: '2-4 dias uteis',
      centro_oeste: '3-5 dias uteis',
      nordeste: '4-6 dias uteis',
      norte: '5-7 dias uteis',
    },
  },
  {
    // Ate 3000g (caso compre os 3 livros juntos: 380+440+1250 = 2070g)
    pesoMaxG: 3000,
    pac: {
      local: 32.9,
      sul: 38.9,
      sudeste: 49.9,
      centro_oeste: 55.9,
      nordeste: 62.9,
      norte: 68.9,
    },
    sedex: {
      local: 45.9,
      sul: 62.9,
      sudeste: 82.9,
      centro_oeste: 94.9,
      nordeste: 105.9,
      norte: 115.9,
    },
    pacPrazo: {
      local: '3-5 dias uteis',
      sul: '4-6 dias uteis',
      sudeste: '5-8 dias uteis',
      centro_oeste: '6-9 dias uteis',
      nordeste: '7-12 dias uteis',
      norte: '8-15 dias uteis',
    },
    sedexPrazo: {
      local: '1-2 dias uteis',
      sul: '2-3 dias uteis',
      sudeste: '2-4 dias uteis',
      centro_oeste: '3-5 dias uteis',
      nordeste: '4-6 dias uteis',
      norte: '5-7 dias uteis',
    },
  },
];

// --- Funcao publica ---

export interface FreteOpcao {
  method: 'PAC' | 'SEDEX';
  price: number;
  days: string;
  regiao: string;
}

export function calcularFreteReal(
  cepDestino: string,
  pesoTotalG: number,
): FreteOpcao[] {
  const cepClean = cepDestino.replace(/\D/g, '');

  if (cepClean.length !== 8) {
    return [];
  }

  const regiao = getRegiao(cepClean);

  // Encontrar faixa de peso
  const faixa = TABELA_FRETE.find(f => pesoTotalG <= f.pesoMaxG);

  // Se peso excede todas as faixas, usar a ultima com acrescimo proporcional
  if (!faixa) {
    const ultimaFaixa = TABELA_FRETE[TABELA_FRETE.length - 1];
    const fator = Math.ceil(pesoTotalG / ultimaFaixa.pesoMaxG);
    return [
      {
        method: 'PAC',
        price: Math.round(ultimaFaixa.pac[regiao] * fator * 100) / 100,
        days: ultimaFaixa.pacPrazo[regiao],
        regiao,
      },
      {
        method: 'SEDEX',
        price: Math.round(ultimaFaixa.sedex[regiao] * fator * 100) / 100,
        days: ultimaFaixa.sedexPrazo[regiao],
        regiao,
      },
    ];
  }

  return [
    {
      method: 'PAC',
      price: faixa.pac[regiao],
      days: faixa.pacPrazo[regiao],
      regiao,
    },
    {
      method: 'SEDEX',
      price: faixa.sedex[regiao],
      days: faixa.sedexPrazo[regiao],
      regiao,
    },
  ];
}

// Regioes legais para label
const REGIAO_LABELS: Record<Regiao, string> = {
  local: 'Santa Catarina',
  sul: 'Sul (PR, RS)',
  sudeste: 'Sudeste (SP, RJ, MG, ES)',
  centro_oeste: 'Centro-Oeste (GO, DF, MT, MS, TO)',
  nordeste: 'Nordeste',
  norte: 'Norte',
};

export function getRegiaoLabel(cep: string): string {
  const regiao = getRegiao(cep.replace(/\D/g, ''));
  return REGIAO_LABELS[regiao];
}
