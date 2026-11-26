/**
 * Monta o plano de cada dia sorteando conteúdo dos bancos. Regras:
 * - nada se repete dentro da mesma semana;
 * - ao repetir um dia, nada da tentativa anterior volta (se o banco permitir);
 * - prefere o que o jogador ainda não viu em semanas anteriores (`vistos`);
 * - o tipo de atividade tende a variar de um dia para o outro.
 */
import { ESCOLHAS, FINAIS, LIGACOES, TRIAGENS } from './conteudo/atividades';
import { LOJAS_FALSAS, LOJAS_LEGITIMAS, PRODUTOS, SINAIS_FALSOS, SOLICITANTES } from './conteudo/compras';
import { DOMINIO_OFICIAL, EMAILS_GOLPE, EMAILS_INFORMATIVOS, EMAILS_LEGITIMOS } from './conteudo/emails';
import {
  INICIO_DIA,
  type AtividadePlano,
  type Compra,
  type Dia,
  type Email,
  type EmailModelo,
  type Loja,
  type PlanoDia,
  type VerbeteId,
} from './tipos';
import { VERBETES } from './conteudo/verbetes';

// ——— Sorteio ———

export function embaralhar<T>(lista: readonly T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const umDe = <T>(lista: readonly T[]) => lista[Math.floor(Math.random() * lista.length)];

/**
 * Sorteia `n` itens evitando os proibidos (se sobrar o suficiente) e
 * preferindo os ainda não vistos.
 */
function sortear<T>(pool: readonly T[], n: number, chave: (x: T) => string, proibidos: Set<string>, vistos: Set<string>): T[] {
  const livres = pool.filter((x) => !proibidos.has(chave(x)));
  const base = livres.length >= n ? livres : [...pool];
  return embaralhar(base)
    .sort((a, b) => Number(vistos.has(chave(a))) - Number(vistos.has(chave(b))))
    .slice(0, n);
}

// ——— Compras ———

const reais = (n: number) => `R$ ${Math.round(n).toLocaleString('pt-BR').replace(/,/g, '.')}`;

function gerarCompra(produtoId?: string): { compra: Compra; email: EmailModelo } {
  const produto = PRODUTOS.find((p) => p.id === produtoId) ?? umDe(PRODUTOS);
  const quem = umDe(SOLICITANTES);
  const qtd = 2 + Math.floor(Math.random() * (produto.qtdMax - 1));
  const limite = Math.ceil((produto.preco * qtd * 1.1) / 100) * 100;

  const [legit, cara] = embaralhar(LOJAS_LEGITIMAS);
  const falsa = umDe(LOJAS_FALSAS);

  const precoCaro = Math.ceil((limite / qtd) * 1.12);
  const precoFalso = Math.round(produto.preco * (0.28 + Math.random() * 0.08));
  const precoAntigo = Math.round(produto.preco * 1.04);
  const desconto = Math.round((1 - precoFalso / precoAntigo) * 100);
  const sinaisFalsos = embaralhar(SINAIS_FALSOS).slice(0, 2);

  const lojaOk: Loja = {
    id: 'ok',
    rotulo: '',
    nome: legit.nome,
    dominio: legit.dominio,
    dominioSuspeito: false,
    preco: reais(produto.preco),
    sinais: [
      { texto: 'Cartão, boleto ou Pix', ok: true },
      { texto: 'CNPJ e endereço no rodapé', ok: true },
      { texto: `Total: ${reais(produto.preco * qtd)}, dentro do limite`, ok: true },
    ],
    pista: 'Preço de mercado, CNPJ informado e pagamento com cartão. Loja confiável e dentro do orçamento.',
  };

  const lojaCara: Loja = {
    id: 'cara',
    rotulo: '',
    nome: cara.nome,
    dominio: cara.dominio,
    dominioSuspeito: false,
    preco: reais(precoCaro),
    sinais: [
      { texto: 'Cartão, boleto ou Pix', ok: true },
      { texto: 'CNPJ e endereço no rodapé', ok: true },
      { texto: `Total: ${reais(precoCaro * qtd)}, acima do limite`, ok: false },
    ],
    pista: `A loja é confiável, mas ${qtd} unidades passam dos ${reais(limite)} autorizados.`,
    falha: {
      texto: `Você gastou ${reais(precoCaro * qtd)} no cartão corporativo, acima dos ${reais(limite)} autorizados. A compra foi estornada e o financeiro abriu uma auditoria.`,
      pistas: [`O pedido tinha limite de ${reais(limite)} no total`, `${qtd} unidades de ${reais(precoCaro)} passam do limite`, 'Outra loja confiável cabia no orçamento'],
      verbete: 'lojas',
    },
  };

  const lojaFalsa: Loja = {
    id: 'falsa',
    rotulo: '',
    nome: falsa.nome,
    dominio: falsa.dominio,
    dominioSuspeito: true,
    contador: `acaba em 0${Math.floor(Math.random() * 5) + 2}:59`,
    precoAntigo: reais(precoAntigo),
    preco: reais(precoFalso),
    desconto: `${desconto}% off`,
    sinais: embaralhar([...sinaisFalsos.map((t) => ({ texto: t, ok: false })), { texto: 'Entrega em 2 dias úteis', ok: true }]),
    pista: `Desconto de ${desconto}%, cronômetro de pressão e ${sinaisFalsos.map((s) => s.toLowerCase()).join(' e ')}: sinais clássicos de loja falsa.`,
    falha: {
      texto: `Você pagou ${reais(precoFalso * qtd)} por Pix para ${falsa.dominio}. O site saiu do ar no mesmo dia e os ${produto.plural} nunca chegaram.`,
      pistas: [`Desconto de ${desconto}% e cronômetro para apressar a compra`, ...sinaisFalsos],
      verbete: 'lojas',
    },
  };

  const lojas = embaralhar([lojaOk, lojaCara, lojaFalsa]).map((l, i) => ({ ...l, id: `loja${i + 1}`, rotulo: `Loja ${i + 1}` }));

  const idEmail = `pedido-${produto.id}`;
  const compra: Compra = {
    id: produto.id,
    solicitante: quem.nome,
    setor: quem.setor,
    produto: produto.nome,
    ilustracao: produto.id,
    quantidade: qtd,
    limite: reais(limite),
    lojas,
    emailPedido: idEmail,
  };

  const email: EmailModelo = {
    id: idEmail,
    tema: 'lojas',
    remetente: `${quem.nome}, ${quem.setor}`,
    remetenteCompleto: `${quem.nome}, ${quem.setor}`,
    usuario: quem.usuario,
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    assunto: `Pedido: ${qtd} ${produto.plural} para ${quem.time}`,
    corpo: `Oi! Preciso de ${qtd} ${produto.plural} (${produto.nome.toLowerCase()}) para ${quem.time}, até ${reais(limite)} no total. Separei 3 lojas no navegador. Pode escolher a melhor e fechar a compra pelo cartão corporativo?`,
    pista: 'Domínio oficial, pedido de trabalho com limite claro e nenhum dado sensível pedido.',
    golpe: false,
    acaoConfiar: 'Abrir as lojas indicadas',
    destinoAoConfiar: '/navegador',
  };

  return { compra, email };
}

// ——— Horários ———

const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

function comHorarios(dia: Dia, pendentes: EmailModelo[], lidos: EmailModelo[]): Email[] {
  const inicio = INICIO_DIA[dia];
  const usados = new Set<number>();
  const sortearMinuto = (de: number, ate: number) => {
    let m = de + Math.floor(Math.random() * (ate - de));
    while (usados.has(m)) m++;
    usados.add(m);
    return m;
  };
  const novos = pendentes.map((e) => ({ ...e, hora: hhmm(sortearMinuto(inicio + 4, inicio + 50)) }));
  const antigos = lidos.map((e) => ({ ...e, hora: hhmm(sortearMinuto(inicio - 40, inicio - 2)) }));
  const porHora = (a: Email, b: Email) => b.hora.localeCompare(a.hora);
  return [...novos.sort(porHora), ...antigos.sort(porHora)];
}

// ——— Textos do memorando ———

const ABERTURAS = [
  'Mais um dia na UnB Net.',
  'Café tomado, crachá no peito.',
  'A TI avisou que as tentativas de golpe aumentaram esta semana.',
  'Dia cheio por aqui.',
  'O RH está de olho em como você está indo.',
];

const nomeTema = (t: VerbeteId) => VERBETES.find((v) => v.id === t)?.titulo.toLowerCase() ?? t;

function intro(dia: Dia, temas: VerbeteId[], primeiraSemana: boolean) {
  if (dia === 'seg' && primeiraSemana) {
    return 'Bem-vindo à UnB Net. Hoje você cuida da caixa de entrada do time e de outras tarefas do dia. Na dúvida, não clique: consulte o manual.';
  }
  if (dia === 'sex') {
    return 'Último dia, quase na hora de ir embora. Mas o telefone da TI não para de tocar: aconteceu alguma coisa. Precisam de você agora.';
  }
  const lista = temas.slice(0, 3).map(nomeTema);
  const foco = lista.length > 1 ? `${lista.slice(0, -1).join(', ')} e ${lista[lista.length - 1]}` : lista[0];
  return `${umDe(ABERTURAS)} Hoje o assunto é ${foco}. Na dúvida, consulte o manual.`;
}

// ——— Plano do dia ———

export type Contexto = {
  /** Planos dos outros dias desta semana. */
  semana: PlanoDia[];
  /** Plano anterior deste mesmo dia (quando repete o dia). */
  anterior?: PlanoDia;
  /** Ids já vistos em semanas anteriores. */
  vistos: string[];
  primeiraSemana: boolean;
};

export function idsDoPlano(p: PlanoDia): string[] {
  return [
    ...p.emails.map((e) => `email:${e.id}`),
    ...p.atividades.flatMap((a) => {
      if (a.tipo === 'caixa') return [];
      if (a.tipo === 'compra') return [`compra:${a.compra.id}`];
      return [`${a.tipo}:${a.id}`];
    }),
  ];
}

type Candidata = { chave: string; tipo: 'compra' | 'escolha' | 'ligacao' | 'triagem'; id: string; tema: VerbeteId };

const CANDIDATAS: Candidata[] = [
  ...ESCOLHAS.map((e) => ({ chave: `escolha:${e.id}`, tipo: 'escolha' as const, id: e.id, tema: e.tema })),
  ...LIGACOES.map((e) => ({ chave: `ligacao:${e.id}`, tipo: 'ligacao' as const, id: e.id, tema: e.tema })),
  ...TRIAGENS.map((e) => ({ chave: `triagem:${e.id}`, tipo: 'triagem' as const, id: e.id, tema: e.tema })),
  ...PRODUTOS.map((p) => ({ chave: `compra:${p.id}`, tipo: 'compra' as const, id: p.id, tema: 'lojas' as const })),
];

export function gerarPlano(dia: Dia, ctx: Contexto): PlanoDia {
  const daSemana = ctx.semana.flatMap(idsDoPlano);
  const proibidos = new Set([...daSemana, ...(ctx.anterior ? idsDoPlano(ctx.anterior) : [])]);
  const vistos = new Set(ctx.vistos);

  if (dia === 'sex') {
    const [final] = sortear(FINAIS, 1, (f) => `escolha:${f.id}`, proibidos, vistos);
    return { dia, intro: intro(dia, [final.tema], ctx.primeiraSemana), emails: [], atividades: [{ tipo: 'escolha', id: final.id }], temas: [final.tema] };
  }

  // Atividades: 1 ou 2, de tipos diferentes; no máximo uma compra por semana.
  const tiposOntem = new Set(
    ctx.semana.filter((p) => p.dia !== dia).slice(-1).flatMap((p) => p.atividades.map((a) => a.tipo)),
  );
  const jaTemCompra = ctx.semana.some((p) => p.atividades.some((a) => a.tipo === 'compra'));
  const quantas = Math.random() < 0.45 ? 2 : 1;

  const pool = CANDIDATAS.filter((c) => !(c.tipo === 'compra' && jaTemCompra));
  const ordenadas = embaralhar(pool.filter((c) => !proibidos.has(c.chave)).length >= quantas ? pool.filter((c) => !proibidos.has(c.chave)) : pool)
    .map((c) => ({ c, peso: (vistos.has(c.chave) ? 2 : 0) + (tiposOntem.has(c.tipo) ? 1 : 0) + Math.random() }))
    .sort((a, b) => a.peso - b.peso)
    .map((x) => x.c);

  const escolhidas: Candidata[] = [];
  for (const c of ordenadas) {
    if (escolhidas.length >= quantas) break;
    if (escolhidas.some((e) => e.tipo === c.tipo)) continue;
    escolhidas.push(c);
  }

  const atividades: AtividadePlano[] = [];
  let emailPedido: EmailModelo | null = null;
  for (const c of escolhidas) {
    if (c.tipo === 'compra') {
      const { compra, email } = gerarCompra(c.id);
      atividades.push({ tipo: 'compra', compra });
      emailPedido = email;
    } else if (c.tipo === 'triagem') {
      const t = TRIAGENS.find((x) => x.id === c.id)!;
      const ok = embaralhar(t.itens.map((it, i) => ({ it, i })).filter((x) => x.it.ok)).map((x) => x.i);
      const ruins = embaralhar(t.itens.map((it, i) => ({ it, i })).filter((x) => !x.it.ok)).map((x) => x.i);
      const nOk = 2 + Math.floor(Math.random() * (t.quantidade - 3));
      atividades.push({ tipo: 'triagem', id: c.id, itens: embaralhar([...ok.slice(0, nOk), ...ruins.slice(0, t.quantidade - nOk)]) });
    } else {
      atividades.push({ tipo: c.tipo, id: c.id });
    }
  }

  // E-mails: 3 pendentes (2 se o dia tiver 2 atividades), com pelo menos 1 golpe e 1 legítimo.
  const nPendentes = escolhidas.length === 2 ? 2 : 3;
  const chaveEmail = (e: EmailModelo) => `email:${e.id}`;
  const golpes = sortear(EMAILS_GOLPE, nPendentes, chaveEmail, proibidos, vistos);
  const legitimos = sortear(EMAILS_LEGITIMOS, nPendentes, chaveEmail, proibidos, vistos);
  const nLegit = emailPedido ? 0 : Math.random() < 0.5 ? 1 : nPendentes - 1;
  const pendentes = [...(emailPedido ? [emailPedido] : []), ...legitimos.slice(0, nLegit), ...golpes].slice(0, nPendentes);

  const informativos =
    dia === 'seg' && ctx.primeiraSemana
      ? EMAILS_INFORMATIVOS.filter((e) => e.id === 'boas-vindas' || e.id === 'cracha')
      : sortear(EMAILS_INFORMATIVOS, 1, chaveEmail, proibidos, vistos);

  // Caixa sempre antes da compra (o pedido chega por e-mail); o resto em ordem aleatória.
  const compra = atividades.filter((a) => a.tipo === 'compra');
  const outras = atividades.filter((a) => a.tipo !== 'compra');
  const ordem: AtividadePlano[] =
    compra.length > 0 ? [...embaralhar(outras), { tipo: 'caixa' }, ...compra] : embaralhar([{ tipo: 'caixa' }, ...outras]);

  const temas = [...new Set<VerbeteId>([...escolhidas.map((c) => c.tema), ...pendentes.map((e) => e.tema)])];

  return {
    dia,
    intro: intro(dia, temas, ctx.primeiraSemana),
    emails: comHorarios(dia, pendentes, informativos),
    atividades: ordem,
    temas,
  };
}

