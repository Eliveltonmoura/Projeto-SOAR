// Calcula a idade (em anos completos) a partir de uma data de nascimento ISO (YYYY-MM-DD)
export function calcularIdade(dataNascimentoISO: string): number {
  const nascimento = new Date(dataNascimentoISO);
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) idade--;
  return idade;
}

// Enquanto a data de nascimento não é informada, trata como menor de idade
// (exige dados do responsável por padrão).
export function isMenorDeIdade(dataNascimentoISO?: string): boolean {
  if (!dataNascimentoISO) return true;
  return calcularIdade(dataNascimentoISO) < 18;
}
