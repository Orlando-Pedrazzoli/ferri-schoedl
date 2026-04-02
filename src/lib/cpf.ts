/**
 * Validação algorítmica de CPF brasileiro
 * Verifica dígitos verificadores e rejeita CPFs conhecidos como inválidos
 */

const KNOWN_INVALID_CPFS = [
  '00000000000',
  '11111111111',
  '22222222222',
  '33333333333',
  '44444444444',
  '55555555555',
  '66666666666',
  '77777777777',
  '88888888888',
  '99999999999',
];

/**
 * Remove caracteres não numéricos do CPF
 */
export function sanitizeCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/**
 * Formata CPF para exibição: 123.456.789-00
 */
export function formatCPF(cpf: string): string {
  const digits = sanitizeCPF(cpf);
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Calcula um dígito verificador do CPF
 * @param digits - Array de dígitos para cálculo
 * @param factor - Factor inicial (10 para primeiro dígito, 11 para segundo)
 */
function calculateDigit(digits: number[], factor: number): number {
  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (factor - index);
  }, 0);

  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Valida um CPF algoritmicamente
 * @param cpf - CPF com ou sem formatação
 * @returns true se o CPF é válido
 */
export function isValidCPF(cpf: string): boolean {
  const digits = sanitizeCPF(cpf);

  // Deve ter exactamente 11 dígitos
  if (digits.length !== 11) return false;

  // Rejeitar CPFs conhecidos como inválidos (todos os dígitos iguais)
  if (KNOWN_INVALID_CPFS.includes(digits)) return false;

  const cpfArray = digits.split('').map(Number);

  // Calcular primeiro dígito verificador
  const firstDigit = calculateDigit(cpfArray.slice(0, 9), 10);
  if (cpfArray[9] !== firstDigit) return false;

  // Calcular segundo dígito verificador
  const secondDigit = calculateDigit(cpfArray.slice(0, 10), 11);
  if (cpfArray[10] !== secondDigit) return false;

  return true;
}
