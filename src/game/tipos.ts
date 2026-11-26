export type Dia = 'seg' | 'ter' | 'qua' | 'qui' | 'sex';

export const DIAS: Dia[] = ['seg', 'ter', 'qua', 'qui', 'sex'];

export const indiceDia = (dia: Dia) => DIAS.indexOf(dia);

export const NOME_DIA: Record<Dia, string> = {
  seg: 'segunda-feira',
  ter: 'terça-feira',
  qua: 'quarta-feira',
  qui: 'quinta-feira',
  sex: 'sexta-feira',
};

export const ABREV_DIA: Record<Dia, string> = { seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex' };

export const INICIO_DIA: Record<Dia, number> = {
  seg: 8 * 60 + 30,
  ter: 8 * 60 + 30,
  qua: 8 * 60 + 30,
  qui: 8 * 60 + 30,
  sex: 16 * 60 + 40,
};

export const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export type VerbeteId =
  | 'phishing'
  | 'lojas'
  | 'links'
  | 'senhas'
  | 'mfa'
  | 'engenharia'
  | 'dados'
  | 'wifi'
  | 'atualizacoes'
  | 'backup'
  | 'incidentes';

/**
 * O que aparece na tela "Desligado".
 * Sem `verbete`, o erro não foi cair num golpe (ex.: denunciar uma mensagem legítima):
 * a tela só explica por que era real, sem sugerir o manual.
 */
export type Falha = { texto: string; pistas: string[]; verbete?: VerbeteId };

export type Email = {
  id: string;
  tema: VerbeteId;
  remetente: string;
  remetenteCompleto: string;
  usuario: string;
  dominio: string;
  dominioSuspeito: boolean;
  hora: string;
  assunto: string;
  corpo: string;
  anexo?: string;
  pista: string;
  /** Já lido: só informativo, não pede decisão. */
  jaLido?: boolean;
  /** Golpe: denunciar é o certo. Legítimo: confiar é o certo. */
  golpe?: boolean;
  acaoDenunciar?: string;
  acaoConfiar?: string;
  /** Consequência de confiar num golpe. */
  falha?: Falha;
  destinoAoConfiar?: '/navegador';
};

export type EmailModelo = Omit<Email, 'hora'>;

export type Opcao = { id: string; titulo: string; detalhe: string; perigo?: boolean; falha?: Falha };

export type Escolha = {
  id: string;
  tema: VerbeteId;
  tarefa: string;
  detalheTarefa: string;
  alerta?: { titulo: string; texto: string };
  titulo?: string;
  enunciado: string;
  opcoes: Opcao[];
  /** Mantém a ordem das opções (ex.: cópias de backup em ordem cronológica). */
  ordemFixa?: boolean;
  pista: string;
  rotuloBotao: string | ((o: Opcao) => string);
  /** Acertar termina a semana. */
  final?: boolean;
};

export type Fala = { de: 'eles' | 'voce'; texto: string };

export type Ligacao = {
  id: string;
  tema: VerbeteId;
  tarefa: string;
  detalheTarefa: string;
  chamador: string;
  numero: string;
  falas: Fala[];
  pergunta: string;
  opcoes: Opcao[];
  pista: string;
};

export type ItemTriagem = { texto: string; ok: boolean; explicacao: string };

export type Triagem = {
  id: string;
  tema: VerbeteId;
  tarefa: string;
  detalheTarefa: string;
  titulo: string;
  enunciado: string;
  rotuloOk: string;
  rotuloRuim: string;
  itens: ItemTriagem[];
  /** Quantos itens sortear para cada rodada. */
  quantidade: number;
  pista: string;
  falhaTexto: string;
};

export type Sinal = { texto: string; ok: boolean };

export type Loja = {
  id: string;
  rotulo: string;
  nome: string;
  dominio: string;
  dominioSuspeito: boolean;
  contador?: string;
  precoAntigo?: string;
  preco: string;
  desconto?: string;
  sinais: Sinal[];
  pista: string;
  falha?: Falha;
};

export type Ilustracao = 'monitor' | 'notebook' | 'headset' | 'webcam' | 'cadeira' | 'teclado';

export type Compra = {
  id: string;
  solicitante: string;
  setor: string;
  produto: string;
  ilustracao: Ilustracao;
  quantidade: number;
  limite: string;
  lojas: Loja[];
  /** Id do e-mail com o pedido: a compra só abre depois de confiar nele. */
  emailPedido: string;
};

export type AtividadePlano =
  | { tipo: 'caixa' }
  | { tipo: 'compra'; compra: Compra }
  | { tipo: 'escolha'; id: string }
  | { tipo: 'ligacao'; id: string }
  | { tipo: 'triagem'; id: string; itens: number[] };

export type PlanoDia = {
  dia: Dia;
  intro: string;
  emails: Email[];
  atividades: AtividadePlano[];
  temas: VerbeteId[];
};

export const chaveAtividade = (a: AtividadePlano) => {
  switch (a.tipo) {
    case 'caixa':
      return 'caixa';
    case 'compra':
      return `compra:${a.compra.id}`;
    default:
      return `${a.tipo}:${a.id}`;
  }
};
