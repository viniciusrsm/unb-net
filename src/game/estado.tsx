import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Href } from 'expo-router';

import { ESCOLHAS, FINAIS, LIGACOES, TRIAGENS } from './conteudo/atividades';
import { falhaDenunciaFalsa } from './conteudo/emails';
import { gerarPlano, idsDoPlano } from './gerador';
import {
  DIAS,
  INICIO_DIA,
  NOME_DIA,
  capitalizar,
  chaveAtividade,
  indiceDia,
  type AtividadePlano,
  type Dia,
  type Falha,
  type PlanoDia,
  type VerbeteId,
} from './tipos';

export type Decisao = 'denunciar' | 'confiar';

export type Estado = {
  iniciado: boolean;
  semana: number;
  dia: Dia;
  /** Relógio do jogo, em minutos desde 00:00. */
  minutos: number;
  planos: Partial<Record<Dia, PlanoDia>>;
  emailsAbertos: string[];
  decisoes: Record<string, Decisao>;
  /** Chaves das atividades concluídas (ver `chaveAtividade`). */
  concluidas: string[];
  /** Loja escolhida em cada compra concluída. */
  lojasCompradas: Record<string, string>;
  verbetesLidos: VerbeteId[];
  totalDecisoes: number;
  falha: Falha | null;
  concluido: boolean;
  /** Ids de conteúdo já vistos (persistido entre sessões). */
  vistos: string[];
};

type Acao =
  | { tipo: 'carregar'; vistos: string[]; semana: number }
  | { tipo: 'iniciarSemana'; plano: PlanoDia }
  | { tipo: 'avancarDia'; plano: PlanoDia }
  | { tipo: 'repetirDia'; plano: PlanoDia }
  | { tipo: 'abrirEmail'; id: string }
  | { tipo: 'decidirEmail'; id: string; decisao: Decisao }
  | { tipo: 'concluirAtividade'; chave: string; minutos?: number; loja?: string }
  | { tipo: 'falhar'; falha: Falha }
  | { tipo: 'lerVerbete'; id: VerbeteId };

const LIMITE_VISTOS = 120;

export const estadoInicial: Estado = {
  iniciado: false,
  semana: 0,
  dia: 'seg',
  minutos: INICIO_DIA.seg,
  planos: {},
  emailsAbertos: [],
  decisoes: {},
  concluidas: [],
  lojasCompradas: {},
  verbetesLidos: [],
  totalDecisoes: 0,
  falha: null,
  concluido: false,
  vistos: [],
};

const comVistos = (vistos: string[], plano: PlanoDia) =>
  [...vistos.filter((v) => !idsDoPlano(plano).includes(v)), ...idsDoPlano(plano)].slice(-LIMITE_VISTOS);

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.tipo) {
    case 'carregar':
      return { ...estado, vistos: acao.vistos, semana: Math.max(estado.semana, acao.semana) };

    case 'iniciarSemana':
      return {
        ...estadoInicial,
        iniciado: true,
        semana: estado.semana + 1,
        planos: { seg: acao.plano },
        verbetesLidos: estado.verbetesLidos,
        vistos: comVistos(estado.vistos, acao.plano),
      };

    case 'avancarDia':
      return {
        ...estado,
        dia: acao.plano.dia,
        minutos: INICIO_DIA[acao.plano.dia],
        planos: { ...estado.planos, [acao.plano.dia]: acao.plano },
        vistos: comVistos(estado.vistos, acao.plano),
      };

    case 'repetirDia': {
      const antigo = estado.planos[acao.plano.dia];
      const emails = antigo?.emails.map((e) => e.id) ?? [];
      const chaves = antigo?.atividades.map(chaveAtividade) ?? [];
      return {
        ...estado,
        dia: acao.plano.dia,
        minutos: INICIO_DIA[acao.plano.dia],
        planos: { ...estado.planos, [acao.plano.dia]: acao.plano },
        emailsAbertos: estado.emailsAbertos.filter((id) => !emails.includes(id)),
        decisoes: Object.fromEntries(Object.entries(estado.decisoes).filter(([k]) => !emails.includes(k))),
        concluidas: estado.concluidas.filter((c) => !chaves.includes(c)),
        falha: null,
        concluido: false,
        vistos: comVistos(estado.vistos, acao.plano),
      };
    }

    case 'abrirEmail':
      if (estado.emailsAbertos.includes(acao.id)) return estado;
      return { ...estado, emailsAbertos: [...estado.emailsAbertos, acao.id], minutos: estado.minutos + 2 };

    case 'decidirEmail': {
      const email = estado.planos[estado.dia]?.emails.find((e) => e.id === acao.id);
      if (!email || estado.decisoes[acao.id]) return estado;
      const falha = acao.decisao === 'confiar' ? (email.golpe ? email.falha : undefined) : email.golpe ? undefined : falhaDenunciaFalsa(email);
      return {
        ...estado,
        decisoes: { ...estado.decisoes, [acao.id]: acao.decisao },
        totalDecisoes: estado.totalDecisoes + 1,
        minutos: estado.minutos + 2,
        falha: falha ?? null,
      };
    }

    case 'concluirAtividade': {
      if (estado.concluidas.includes(acao.chave)) return estado;
      const plano = estado.planos[estado.dia];
      const final = plano?.atividades.some((a) => a.tipo === 'escolha' && chaveAtividade(a) === acao.chave && FINAIS.some((f) => f.id === a.id));
      return {
        ...estado,
        concluidas: [...estado.concluidas, acao.chave],
        lojasCompradas: acao.loja ? { ...estado.lojasCompradas, [acao.chave]: acao.loja } : estado.lojasCompradas,
        totalDecisoes: estado.totalDecisoes + 1,
        minutos: estado.minutos + (acao.minutos ?? 5),
        concluido: estado.concluido || !!final,
      };
    }

    case 'falhar':
      return { ...estado, falha: acao.falha, totalDecisoes: estado.totalDecisoes + 1, minutos: estado.minutos + 3 };

    case 'lerVerbete':
      if (estado.verbetesLidos.includes(acao.id)) return estado;
      return { ...estado, verbetesLidos: [...estado.verbetesLidos, acao.id] };
  }
}

// ——— Contexto ———

type Contexto = {
  estado: Estado;
  despachar: (acao: Acao) => void;
  iniciarSemana: () => void;
  avancarDia: () => void;
  repetirDia: () => void;
};

const JogoContext = createContext<Contexto | null>(null);

const CHAVE_STORAGE = 'unbnet:historico:v1';

export function JogoProvider({ children }: { children: ReactNode }) {
  const [estado, despachar] = useReducer(reducer, estadoInicial);
  const carregou = useRef(false);

  // Carrega o histórico de conteúdo já visto, para variar entre sessões.
  useEffect(() => {
    AsyncStorage.getItem(CHAVE_STORAGE)
      .then((bruto) => {
        if (!bruto) return;
        const salvo = JSON.parse(bruto) as { vistos?: string[]; semana?: number };
        despachar({ tipo: 'carregar', vistos: salvo.vistos ?? [], semana: salvo.semana ?? 0 });
      })
      .catch(() => {})
      .finally(() => {
        carregou.current = true;
      });
  }, []);

  useEffect(() => {
    if (!carregou.current) return;
    AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify({ vistos: estado.vistos, semana: estado.semana })).catch(() => {});
  }, [estado.vistos, estado.semana]);

  const planosDaSemana = (e: Estado, exceto: Dia) =>
    DIAS.filter((d) => d !== exceto && e.planos[d]).map((d) => e.planos[d]!);

  const iniciarSemana = useCallback(() => {
    const plano = gerarPlano('seg', { semana: [], vistos: estado.vistos, primeiraSemana: estado.semana === 0 });
    despachar({ tipo: 'iniciarSemana', plano });
  }, [estado.vistos, estado.semana]);

  const avancarDia = useCallback(() => {
    const proximo = DIAS[indiceDia(estado.dia) + 1];
    if (!proximo) return;
    const plano = gerarPlano(proximo, {
      semana: planosDaSemana(estado, proximo),
      vistos: estado.vistos,
      primeiraSemana: estado.semana <= 1,
    });
    despachar({ tipo: 'avancarDia', plano });
  }, [estado]);

  const repetirDia = useCallback(() => {
    const plano = gerarPlano(estado.dia, {
      semana: planosDaSemana(estado, estado.dia),
      anterior: estado.planos[estado.dia],
      vistos: estado.vistos,
      primeiraSemana: false,
    });
    despachar({ tipo: 'repetirDia', plano });
  }, [estado]);

  const valor = useMemo(
    () => ({ estado, despachar, iniciarSemana, avancarDia, repetirDia }),
    [estado, iniciarSemana, avancarDia, repetirDia],
  );
  return <JogoContext.Provider value={valor}>{children}</JogoContext.Provider>;
}

export function useJogo() {
  const ctx = useContext(JogoContext);
  if (!ctx) throw new Error('useJogo precisa estar dentro de <JogoProvider>');
  return ctx;
}

// ——— Derivados ———

export function relogio(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function rotuloHud(dia: Dia) {
  return capitalizar(NOME_DIA[dia]);
}

export const planoAtual = (estado: Estado) => estado.planos[estado.dia];

export const emailsDoDia = (estado: Estado) => planoAtual(estado)?.emails ?? [];

export function emailsResolvidos(estado: Estado) {
  return emailsDoDia(estado)
    .filter((e) => !e.jaLido)
    .every((e) => estado.decisoes[e.id]);
}

export function tarefaFeita(estado: Estado, a: AtividadePlano) {
  return a.tipo === 'caixa' ? emailsResolvidos(estado) : estado.concluidas.includes(chaveAtividade(a));
}

export function diaConcluido(estado: Estado) {
  return (planoAtual(estado)?.atividades ?? []).every((a) => tarefaFeita(estado, a));
}

export function descreverTarefa(estado: Estado, a: AtividadePlano): { titulo: string; detalhe: string } {
  switch (a.tipo) {
    case 'caixa': {
      const n = emailsDoDia(estado).length;
      return { titulo: 'Ler a caixa de entrada', detalhe: `${n} mensage${n === 1 ? 'm' : 'ns'}` };
    }
    case 'compra':
      return {
        titulo: `Comprar ${a.compra.quantidade} itens para ${a.compra.setor}`,
        detalhe: `Limite de ${a.compra.limite} · 3 lojas indicadas`,
      };
    case 'escolha': {
      const e = [...ESCOLHAS, ...FINAIS].find((x) => x.id === a.id);
      return { titulo: e?.tarefa ?? '', detalhe: e?.detalheTarefa ?? '' };
    }
    case 'ligacao': {
      const l = LIGACOES.find((x) => x.id === a.id);
      return { titulo: l?.tarefa ?? '', detalhe: l?.detalheTarefa ?? '' };
    }
    case 'triagem': {
      const t = TRIAGENS.find((x) => x.id === a.id);
      return { titulo: t?.tarefa ?? '', detalhe: t?.detalheTarefa ?? '' };
    }
  }
}

export function rotaDaTarefa(a: AtividadePlano): Href {
  switch (a.tipo) {
    case 'caixa':
      return '/caixa';
    case 'compra':
      return '/navegador';
    case 'escolha':
      return { pathname: '/escolha/[id]', params: { id: a.id } };
    case 'ligacao':
      return { pathname: '/ligacao/[id]', params: { id: a.id } };
    case 'triagem':
      return { pathname: '/triagem/[id]', params: { id: a.id } };
  }
}

/** Próxima tarefa pendente do dia, ou null se o dia acabou. */
export function proximaTarefa(estado: Estado): { rota: Href; rotulo: string } | null {
  const a = (planoAtual(estado)?.atividades ?? []).find((x) => !tarefaFeita(estado, x));
  if (!a) return null;
  let rotulo: string;
  if (a.tipo === 'caixa') rotulo = 'Abrir a caixa de entrada';
  else if (a.tipo === 'compra') rotulo = 'Abrir o navegador';
  else if (a.tipo === 'ligacao') rotulo = 'Atender a ligação';
  else if (a.tipo === 'escolha' && FINAIS.some((f) => f.id === a.id)) rotulo = 'Ir para a sala da TI';
  else rotulo = descreverTarefa(estado, a).titulo;
  return { rota: rotaDaTarefa(a), rotulo };
}

export function naoLidos(estado: Estado) {
  return emailsDoDia(estado).filter((e) => !e.jaLido && !estado.emailsAbertos.includes(e.id)).length;
}

/** Temas que já apareceram nesta semana até o dia atual, com o dia em que apareceram. */
export function temasLiberados(estado: Estado): Map<VerbeteId, Dia> {
  const mapa = new Map<VerbeteId, Dia>([['phishing', 'seg']]);
  for (const d of DIAS.slice(0, indiceDia(estado.dia) + 1)) {
    for (const t of estado.planos[d]?.temas ?? []) if (!mapa.has(t)) mapa.set(t, d);
  }
  return mapa;
}
