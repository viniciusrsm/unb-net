import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { Href } from 'expo-router';

import {
  ABREV_DIA,
  DIAS,
  DIAS_INFO,
  EMAILS,
  ESCOLHAS,
  FALHAS,
  LOJAS,
  emailsDoDia,
  pendentesDoDia,
  type Dia,
  type Tarefa,
  type VerbeteId,
} from './conteudo';

export type Decisao = 'denunciar' | 'confiar';

export type Estado = {
  iniciado: boolean;
  dia: Dia;
  /** Relógio do jogo, em minutos desde 00:00. */
  minutos: number;
  emailsAbertos: string[];
  decisoes: Record<string, Decisao>;
  compra: string | null;
  /** Opção escolhida em cada tela de escolha. */
  escolhas: Record<string, string>;
  verbetesLidos: VerbeteId[];
  totalDecisoes: number;
  falha: string | null;
  concluido: boolean;
};

type Acao =
  | { tipo: 'iniciar' }
  | { tipo: 'abrirEmail'; id: string }
  | { tipo: 'decidirEmail'; id: string; decisao: Decisao }
  | { tipo: 'comprar'; lojaId: string }
  | { tipo: 'escolher'; escolhaId: string; opcaoId: string }
  | { tipo: 'avancarDia' }
  | { tipo: 'lerVerbete'; id: VerbeteId }
  | { tipo: 'repetirDia' };

export const estadoInicial: Estado = {
  iniciado: false,
  dia: 'seg',
  minutos: DIAS_INFO.seg.inicio,
  emailsAbertos: [],
  decisoes: {},
  compra: null,
  escolhas: {},
  verbetesLidos: [],
  totalDecisoes: 0,
  falha: null,
  concluido: false,
};

const semChaves = <T,>(obj: Record<string, T>, chaves: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !chaves.includes(k)));

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.tipo) {
    case 'iniciar':
      return { ...estadoInicial, iniciado: true, verbetesLidos: estado.verbetesLidos };

    case 'abrirEmail':
      if (estado.emailsAbertos.includes(acao.id)) return estado;
      return { ...estado, emailsAbertos: [...estado.emailsAbertos, acao.id], minutos: estado.minutos + 2 };

    case 'decidirEmail': {
      const email = EMAILS.find((e) => e.id === acao.id);
      if (!email || estado.decisoes[acao.id]) return estado;
      const falha = acao.decisao === 'confiar' ? email.falhaSeConfiar : email.falhaSeDenunciar;
      return {
        ...estado,
        decisoes: { ...estado.decisoes, [acao.id]: acao.decisao },
        totalDecisoes: estado.totalDecisoes + 1,
        minutos: estado.minutos + 2,
        falha: falha ?? null,
      };
    }

    case 'comprar': {
      const loja = LOJAS.find((l) => l.id === acao.lojaId);
      if (!loja || estado.compra) return estado;
      return {
        ...estado,
        compra: loja.falha ? null : loja.id,
        totalDecisoes: estado.totalDecisoes + 1,
        minutos: estado.minutos + 3,
        falha: loja.falha ?? null,
      };
    }

    case 'escolher': {
      const escolha = ESCOLHAS.find((e) => e.id === acao.escolhaId);
      const opcao = escolha?.opcoes.find((o) => o.id === acao.opcaoId);
      if (!escolha || !opcao || estado.escolhas[escolha.id]) return estado;
      return {
        ...estado,
        escolhas: opcao.falha ? estado.escolhas : { ...estado.escolhas, [escolha.id]: opcao.id },
        totalDecisoes: estado.totalDecisoes + 1,
        minutos: estado.minutos + 5,
        falha: opcao.falha ?? null,
        concluido: !opcao.falha && !!escolha.final,
      };
    }

    case 'avancarDia': {
      const proximo = DIAS[DIAS.indexOf(estado.dia) + 1];
      if (!proximo) return estado;
      return { ...estado, dia: proximo, minutos: DIAS_INFO[proximo].inicio };
    }

    case 'lerVerbete':
      if (estado.verbetesLidos.includes(acao.id)) return estado;
      return { ...estado, verbetesLidos: [...estado.verbetesLidos, acao.id] };

    case 'repetirDia': {
      const dia = estado.falha ? FALHAS[estado.falha].dia : estado.dia;
      const emails = emailsDoDia(dia).map((e) => e.id);
      const escolhas = ESCOLHAS.filter((e) => e.dia === dia).map((e) => e.id);
      return {
        ...estado,
        dia,
        falha: null,
        concluido: false,
        minutos: DIAS_INFO[dia].inicio,
        emailsAbertos: estado.emailsAbertos.filter((id) => !emails.includes(id)),
        decisoes: semChaves(estado.decisoes, emails),
        escolhas: semChaves(estado.escolhas, escolhas),
        compra: dia === 'seg' ? null : estado.compra,
      };
    }
  }
}

type Contexto = {
  estado: Estado;
  despachar: (acao: Acao) => void;
};

const JogoContext = createContext<Contexto | null>(null);

export function JogoProvider({ children }: { children: ReactNode }) {
  const [estado, despachar] = useReducer(reducer, estadoInicial);
  const valor = useMemo(() => ({ estado, despachar }), [estado]);
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

export function rotuloHud(dia: Dia, minutos: number) {
  return `${ABREV_DIA[dia]}, ${relogio(minutos)}`;
}

export function emailsResolvidos(estado: Estado, dia: Dia = estado.dia) {
  return pendentesDoDia(dia).every((e) => estado.decisoes[e.id]);
}

export function tarefaFeita(estado: Estado, tarefa: Tarefa) {
  switch (tarefa.tipo) {
    case 'caixa':
      return emailsResolvidos(estado);
    case 'compra':
      return estado.compra !== null;
    case 'escolha':
      return !!estado.escolhas[tarefa.id];
  }
}

export function diaConcluido(estado: Estado) {
  return DIAS_INFO[estado.dia].tarefas.every((t) => tarefaFeita(estado, t));
}

/** Rota da próxima tarefa pendente do dia, ou null se o dia acabou. */
export function proximaTarefa(estado: Estado): { rota: Href; rotulo: string } | null {
  const t = DIAS_INFO[estado.dia].tarefas.find((x) => !tarefaFeita(estado, x));
  if (!t) return null;
  if (t.tipo === 'caixa') return { rota: '/caixa', rotulo: 'Abrir a caixa de entrada' };
  if (t.tipo === 'compra') return { rota: '/navegador', rotulo: 'Abrir o navegador' };
  const escolha = ESCOLHAS.find((e) => e.id === t.id);
  return {
    rota: { pathname: '/escolha/[id]', params: { id: t.id } },
    rotulo: escolha?.alerta ? 'Ir para a sala da TI' : (escolha?.tarefa ?? 'Continuar'),
  };
}

export function naoLidos(estado: Estado) {
  return pendentesDoDia(estado.dia).filter((e) => !estado.emailsAbertos.includes(e.id)).length;
}
