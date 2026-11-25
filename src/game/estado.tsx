import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import {
  BACKUPS,
  EMAILS,
  EMAILS_PENDENTES,
  FALHAS,
  LOJAS,
  type Dia,
  type FalhaId,
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
  backup: string | null;
  verbetesLidos: VerbeteId[];
  totalDecisoes: number;
  falha: FalhaId | null;
  concluido: boolean;
};

type Acao =
  | { tipo: 'iniciar' }
  | { tipo: 'abrirEmail'; id: string }
  | { tipo: 'decidirEmail'; id: string; decisao: Decisao }
  | { tipo: 'comprar'; lojaId: string }
  | { tipo: 'avancarParaSexta' }
  | { tipo: 'restaurar'; backupId: string }
  | { tipo: 'lerVerbete'; id: VerbeteId }
  | { tipo: 'passarTempo'; minutos: number }
  | { tipo: 'repetirDia' };

const INICIO_DO_DIA: Record<Dia, number> = { seg: 8 * 60 + 30, sex: 16 * 60 + 40 };

export const estadoInicial: Estado = {
  iniciado: false,
  dia: 'seg',
  minutos: INICIO_DO_DIA.seg,
  emailsAbertos: [],
  decisoes: {},
  compra: null,
  backup: null,
  verbetesLidos: [],
  totalDecisoes: 0,
  falha: null,
  concluido: false,
};

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

    case 'avancarParaSexta':
      return { ...estado, dia: 'sex', minutos: INICIO_DO_DIA.sex };

    case 'restaurar': {
      const backup = BACKUPS.find((b) => b.id === acao.backupId);
      if (!backup) return estado;
      return {
        ...estado,
        backup: backup.id,
        totalDecisoes: estado.totalDecisoes + 1,
        minutos: estado.minutos + 5,
        falha: backup.falha ?? null,
        concluido: !backup.falha,
      };
    }

    case 'lerVerbete':
      if (estado.verbetesLidos.includes(acao.id)) return estado;
      return { ...estado, verbetesLidos: [...estado.verbetesLidos, acao.id] };

    case 'passarTempo':
      return { ...estado, minutos: estado.minutos + acao.minutos };

    case 'repetirDia': {
      const dia = estado.falha ? FALHAS[estado.falha].dia : estado.dia;
      const base = { ...estado, dia, falha: null, minutos: INICIO_DO_DIA[dia] };
      if (dia === 'seg') return { ...base, emailsAbertos: [], decisoes: {}, compra: null };
      return { ...base, backup: null, concluido: false };
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
  return `${dia === 'seg' ? 'Seg' : 'Sex'}, ${relogio(minutos)}`;
}

export function emailsResolvidos(estado: Estado) {
  return EMAILS_PENDENTES.every((id) => estado.decisoes[id]);
}

export function segundaConcluida(estado: Estado) {
  return emailsResolvidos(estado) && estado.compra !== null;
}

export function naoLidos(estado: Estado) {
  return EMAILS.filter((e) => !e.jaLido && !estado.emailsAbertos.includes(e.id)).length;
}
